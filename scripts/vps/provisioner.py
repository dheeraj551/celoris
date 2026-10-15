import http.server
import json
import subprocess
import os

PORT = 4000
AUTH_TOKEN = "celoris_cloud_secret_786a9f24e"

class ProvisionHandler(http.server.BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/health':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"status": "healthy", "domain": "celoris.in", "service": "celoris-provisioner"}).encode('utf-8'))
        elif self.path == '/diag':
            res_sites = subprocess.run(["docker", "exec", "celoris-wordpress", "wp", "site", "list", "--allow-root"], capture_output=True, text=True)
            res_users = subprocess.run(["docker", "exec", "celoris-wordpress", "wp", "user", "list", "--allow-root"], capture_output=True, text=True)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "sites": res_sites.stdout or res_sites.stderr,
                "users": res_users.stdout or res_users.stderr
            }).encode('utf-8'))
        else:
            self.send_response(404)
            self.end_headers()

    def do_POST(self):
        if self.path not in ['/provision', '/wake']:
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

        if self.path == '/wake':
            try:
                data = json.loads(post_data.decode('utf-8'))
                subdomain = data.get('subdomain', '').strip().lower()
                slug = "".join([c for c in subdomain if c.isalnum() or c == '-'])
                full_domain = f"{slug}.celoris.in"

                subprocess.run([
                    "docker", "exec", "celoris-wordpress",
                    "wp", "site", "unarchive", slug,
                    "--allow-root"
                ], capture_output=True, text=True)

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

            # 1. Create site without --email flag to prevent WP-CLI user collisions
            # This creates the subsite cleanly assigned to Super Admin
            subprocess.run([
                "docker", "exec", "celoris-wordpress",
                "wp", "site", "create",
                f"--slug={slug}",
                f"--title={title}",
                "--allow-root"
            ], capture_output=True, text=True)

            # Enforce 3 GB (3072 MB) upload storage limit for the subsite
            subprocess.run([
                "docker", "exec", "celoris-wordpress",
                "wp", "site", "option", "set", "blog_upload_space", "3072",
                "--allow-root"
            ], capture_output=True, text=True)
            subprocess.run([
                "docker", "exec", "celoris-wordpress",
                "wp", "option", "set", "blog_upload_space", "3072",
                f"--url=https://{full_domain}",
                "--allow-root"
            ], capture_output=True, text=True)

            # 2. Add or create the requested user as administrator on this site
            subprocess.run([
                "docker", "exec", "celoris-wordpress",
                "wp", "user", "create",
                admin_user, user_email,
                f"--user_pass={admin_pass}",
                "--role=administrator",
                f"--url=https://{full_domain}",
                "--allow-root"
            ], capture_output=True, text=True)

            # 3. If user already exists in network, assign role to this subsite and update password
            subprocess.run([
                "docker", "exec", "celoris-wordpress",
                "wp", "user", "set-role",
                admin_user, "administrator",
                f"--url=https://{full_domain}",
                "--allow-root"
            ], capture_output=True, text=True)

            subprocess.run([
                "docker", "exec", "celoris-wordpress",
                "wp", "user", "update",
                admin_user,
                f"--user_pass={admin_pass}",
                "--allow-root"
            ], capture_output=True, text=True)

            # 4. Activate Astra theme on the new site
            subprocess.run([
                "docker", "exec", "celoris-wordpress",
                "wp", "theme", "activate", "astra",
                f"--url=https://{full_domain}",
                "--allow-root"
            ], capture_output=True, text=True)

            # 5. Ensure HTTPS siteurl and home
            subprocess.run([
                "docker", "exec", "celoris-wordpress",
                "wp", "option", "update", "siteurl", f"https://{full_domain}",
                f"--url=https://{full_domain}",
                "--allow-root"
            ], capture_output=True, text=True)
            subprocess.run([
                "docker", "exec", "celoris-wordpress",
                "wp", "option", "update", "home", f"https://{full_domain}",
                f"--url=https://{full_domain}",
                "--allow-root"
            ], capture_output=True, text=True)

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
                "message": "Instance active & secured with Let's Encrypt SSL"
            }).encode('utf-8'))

        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Failed to provision site", "details": str(e)}).encode('utf-8'))

if __name__ == '__main__':
    server = http.server.ThreadingHTTPServer(('0.0.0.0', PORT), ProvisionHandler)
    server.serve_forever()
