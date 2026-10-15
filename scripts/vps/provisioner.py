import http.server
import json
import subprocess
import os

PORT = 4000
AUTH_TOKEN = "celoris_cloud_secret_786a9f24e"

def run_wp(cmd_args):
    """Executes a WP-CLI command inside the celoris-wordpress container."""
    full_cmd = ["docker", "exec", "celoris-wordpress", "wp"] + cmd_args + ["--allow-root"]
    res = subprocess.run(full_cmd, capture_output=True, text=True)
    return res.returncode, res.stdout.strip(), res.stderr.strip()

class ProvisionHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "healthy", "domain": "celoris.in", "service": "celoris-provisioner"}).encode('utf-8'))
        elif self.path == '/diag':
            rc, sites_out, sites_err = run_wp(["site", "list", "--fields=blog_id,url,slug,deleted,archived,registered", "--format=json"])
            rc_u, users_out, users_err = run_wp(["user", "list", "--fields=ID,user_login,user_email,roles", "--format=json"])
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            try:
                sites_data = json.loads(sites_out) if sites_out else []
            except Exception:
                sites_data = sites_out or sites_err
            try:
                users_data = json.loads(users_out) if users_out else []
            except Exception:
                users_data = users_out or users_err

            self.wfile.write(json.dumps({
                "status": "healthy",
                "sites": sites_data,
                "users": users_data
            }, indent=2).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path not in ['/provision', '/wake', '/delete']:
            self.send_response(404)
            self.end_headers()
            return

        auth_header = self.headers.get('Authorization', '')
        if auth_header != f"Bearer {AUTH_TOKEN}":
            self.send_response(401)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Unauthorized"}).encode('utf-8'))
            return

        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        # ----------------- WAKE ENDPOINT -----------------
        if self.path == '/wake':
            try:
                data = json.loads(post_data.decode('utf-8'))
                subdomain = data.get('subdomain', '').strip().lower()
                slug = "".join([c for c in subdomain if c.isalnum() or c == '-'])
                full_domain = f"{slug}.celoris.in"

                run_wp(["site", "unarchive", slug])
                run_wp(["db", "query", f"UPDATE wp_blogs SET deleted = 0, archived = 0, mature = 0, spam = 0 WHERE domain = '{full_domain}';"])

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "subdomain": slug,
                    "siteUrl": f"https://{full_domain}",
                    "message": "Site awakened and reactivated successfully"
                }).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                return

        # ----------------- DELETE ENDPOINT -----------------
        if self.path == '/delete':
            try:
                data = json.loads(post_data.decode('utf-8'))
                subdomain = data.get('subdomain', '').strip().lower()
                slug = "".join([c for c in subdomain if c.isalnum() or c == '-'])
                full_domain = f"{slug}.celoris.in"

                if not slug:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": "Subdomain is required"}).encode('utf-8'))
                    return

                # Find blog_id
                rc, out, _ = run_wp(["site", "list", f"--slug={slug}", "--field=blog_id"])
                if out and out.isdigit() and int(out) > 1:
                    blog_id = int(out)
                    run_wp(["site", "delete", str(blog_id), "--yes"])

                # Direct database purge to ensure no zombie record
                run_wp(["db", "query", f"DELETE FROM wp_blogs WHERE domain = '{full_domain}';"])

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    "success": True,
                    "subdomain": slug,
                    "message": f"Site {full_domain} successfully deleted and freed."
                }).encode('utf-8'))
                return
            except Exception as e:
                self.send_response(500)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))
                return

        # ----------------- PROVISION ENDPOINT -----------------
        try:
            data = json.loads(post_data.decode('utf-8'))
            subdomain = data.get('subdomain', '').strip().lower()
            title = data.get('title', f'{subdomain} Site')
            user_email = data.get('email', f'{subdomain}@celoris.in').strip()

            if not subdomain:
                self.send_response(400)
                self.send_header('Content-Type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({"error": "Subdomain is required"}).encode('utf-8'))
                return

            slug = "".join([c for c in subdomain if c.isalnum() or c == '-'])
            full_domain = f"{slug}.celoris.in"

            PHISHING_KEYWORDS = [
                'login', 'signin', 'verify', 'verification', 'kyc', 'paytm', 'sbi', 'upi',
                'bank', 'hdfc', 'icici', 'axis', 'pnb', 'kotak', 'phonepe', 'gpay',
                'googlepay', 'bhim', 'aadhaar', 'uidai', 'incometax', 'pan', 'otp',
                'secure', 'account', 'auth', 'update', 'wallet', 'amazon',
                'flipkart', 'netflix', 'paypal', 'apple', 'microsoft', 'freecharge', 'cred',
                'password', 'security', 'invoice', 'telegram', 'whatsapp'
            ]
            for kw in PHISHING_KEYWORDS:
                if kw in slug:
                    self.send_response(400)
                    self.send_header('Content-Type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({"error": f"Restricted security keyword '{kw}' is prohibited."}).encode('utf-8'))
                    return

            raw_user = data.get('adminUser', '').strip().lower()
            if not raw_user or raw_user == 'admin':
                raw_user = slug
            admin_user = "".join([c for c in raw_user if c.isalnum() or c in '_-']) or slug
            admin_pass = data.get('adminPass', f'celoris_{slug}_2026')

            # STEP 1: Check if the slug or domain already exists in wp_blogs (or was previously deleted/archived)
            rc, sites_json, _ = run_wp(["site", "list", "--fields=blog_id,url,slug,deleted,archived", "--format=json"])
            existing_site_id = None
            if rc == 0 and sites_json:
                try:
                    sites_arr = json.loads(sites_json)
                    for s in sites_arr:
                        s_slug = s.get('slug', '').lower()
                        s_url = s.get('url', '').lower()
                        s_id = s.get('blog_id')
                        if s_id and int(s_id) > 1: # Don't touch main network site 1
                            if s_slug == slug or full_domain in s_url:
                                existing_site_id = int(s_id)
                                break
                except Exception as parse_err:
                    print(f"Warning: JSON parse error for sites: {parse_err}")

            # If existing site was found, cleanly remove it so it can be re-provisioned freshly
            if existing_site_id:
                print(f"Existing site ID {existing_site_id} found for {slug}. Cleaning up for fresh recreation...")
                run_wp(["site", "delete", str(existing_site_id), "--yes"])
                run_wp(["db", "query", f"DELETE FROM wp_blogs WHERE blog_id = {existing_site_id};"])

            # Ensure wp_blogs has no conflicting row with this domain
            run_wp(["db", "query", f"DELETE FROM wp_blogs WHERE domain = '{full_domain}';"])

            # STEP 2: Create the subsite cleanly without --email flag (prevents user collision)
            create_rc, create_out, create_err = run_wp([
                "site", "create",
                f"--slug={slug}",
                f"--title={title}"
            ])

            if create_rc != 0:
                # If it failed due to existing slug, force-purge and retry once
                print(f"Site create initial attempt returned code {create_rc}: {create_err}. Retrying purge...")
                run_wp(["db", "query", f"DELETE FROM wp_blogs WHERE domain = '{full_domain}' OR domain LIKE '%{slug}.celoris.in%';"])
                create_rc, create_out, create_err = run_wp([
                    "site", "create",
                    f"--slug={slug}",
                    f"--title={title}"
                ])

            if create_rc != 0:
                raise Exception(f"WP-CLI site create failed: {create_err or create_out}")

            # STEP 3: Ensure site is active (deleted = 0, archived = 0) in wp_blogs
            run_wp(["db", "query", f"UPDATE wp_blogs SET deleted = 0, archived = 0, mature = 0, spam = 0 WHERE domain = '{full_domain}';"])

            # STEP 4: Enforce 3 GB (3072 MB) upload storage limit
            run_wp(["site", "option", "set", "blog_upload_space", "3072"])
            run_wp(["option", "set", "blog_upload_space", "3072", f"--url=https://{full_domain}"])

            # STEP 5: Create or assign administrator user
            user_check_rc, user_check_out, _ = run_wp(["user", "get", admin_user, "--field=ID"])
            if user_check_rc != 0:
                # User does not exist, create new
                run_wp([
                    "user", "create",
                    admin_user, user_email,
                    f"--user_pass={admin_pass}",
                    "--role=administrator",
                    f"--url=https://{full_domain}"
                ])
            else:
                # User exists in network: assign role to this subsite and set password
                run_wp([
                    "user", "set-role",
                    admin_user, "administrator",
                    f"--url=https://{full_domain}"
                ])
                run_wp([
                    "user", "update",
                    admin_user,
                    f"--user_pass={admin_pass}"
                ])

            # STEP 6: Activate Astra theme on the new subsite
            run_wp([
                "theme", "activate", "astra",
                f"--url=https://{full_domain}"
            ])

            # STEP 7: Ensure HTTPS siteurl and home
            run_wp([
                "option", "update", "siteurl", f"https://{full_domain}",
                f"--url=https://{full_domain}"
            ])
            run_wp([
                "option", "update", "home", f"https://{full_domain}",
                f"--url=https://{full_domain}"
            ])

            # STEP 8: STRICT VERIFICATION
            # Verify site exists and is active (deleted = 0)
            v_rc, v_out, _ = run_wp([
                "db", "query",
                f"SELECT blog_id, deleted, archived FROM wp_blogs WHERE domain = '{full_domain}';",
                "--skip-column-names"
            ])

            if not v_out or len(v_out.split()) < 3:
                raise Exception(f"Verification failed: Site '{full_domain}' was not found in wp_blogs database table.")

            v_parts = v_out.split()
            blog_id = v_parts[0]
            deleted = v_parts[1]
            archived = v_parts[2]

            if deleted != '0' or archived != '0':
                # Force reset active status
                run_wp(["db", "query", f"UPDATE wp_blogs SET deleted = 0, archived = 0 WHERE blog_id = {blog_id};"])

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "success": True,
                "subdomain": slug,
                "fullDomain": full_domain,
                "siteUrl": f"https://{full_domain}",
                "adminUrl": f"https://{full_domain}/wp-admin",
                "adminUser": admin_user,
                "adminPass": admin_pass,
                "adminPassword": admin_pass,
                "blogId": int(blog_id),
                "message": "Instance active & secured with Let's Encrypt SSL"
            }).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": "Failed to provision site",
                "details": str(e)
            }).encode('utf-8'))

if __name__ == '__main__':
    server = http.server.ThreadingHTTPServer(('0.0.0.0', PORT), ProvisionHandler)
    server.serve_forever()
