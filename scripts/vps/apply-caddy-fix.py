import subprocess
import re
import os
import sys

print("==========================================================")
print("  REBUILDING /opt/celoris-cloud/caddy/Caddyfile")
print("==========================================================")

caddyfile = "/opt/celoris-cloud/caddy/Caddyfile"
if not os.path.exists(caddyfile):
    print(f"[-] {caddyfile} not found!")
    sys.exit(1)

# Find running caddy container
try:
    caddy_container = subprocess.check_output(
        "docker ps --format '{{.Names}}' | grep -i caddy | head -n1", 
        shell=True, text=True
    ).strip()
except Exception as e:
    caddy_container = "celoris-caddy"

print(f"[+] Found container: {caddy_container}")

# Determine the best reachable IP from inside container
candidates = ["172.17.0.1:8085", "169.58.229.99:8085", "127.0.0.1:8085"]
# Also check docker gateway of celoris-cloud_celoris-net
try:
    gw = subprocess.check_output(
        "docker inspect celoris-cloud_celoris-net --format '{{range .IPAM.Config}}{{.Gateway}}{{end}}'",
        shell=True, text=True
    ).strip()
    if gw:
        candidates.insert(0, f"{gw}:8085")
except:
    pass

working_target = None
for c in candidates:
    print(f"[*] Testing container connectivity to {c}...")
    res = subprocess.run(
        f"docker exec {caddy_container} wget -qO- --spider -T 3 http://{c}/reels/Db4eaYWBlXH.mp4",
        shell=True
    )
    if res.returncode == 0:
        print(f"[+] SUCCESS: Container can reach {c}!")
        working_target = c
        break

if not working_target:
    print("[!] Fallback to 172.17.0.1:8085")
    working_target = "172.17.0.1:8085"

# Backup Caddyfile
subprocess.run(f"cp {caddyfile} {caddyfile}.bak", shell=True)

# Build the perfect Caddyfile
new_caddyfile = f"""{{
    auto_https disable_redirects
    email admin@celorisdesigns.com
    on_demand_tls {{
        ask http://provisioner:4000/check-domain
    }}
}}

http://media.celoris.in, https://media.celoris.in {{
    reverse_proxy {working_target} {{
        header_up Host {{host}}
        header_up X-Real-IP {{remote}}
    }}
}}

http://livekit.celoris.in, https://livekit.celoris.in {{
    reverse_proxy livekit:7880
}}

:80, :443 {{
    tls {{
        on_demand
    }}
    reverse_proxy wordpress:80 {{
        header_up Host {{host}}
        header_up X-Real-IP {{remote}}
        header_up X-Forwarded-For {{remote}}
        header_up X-Forwarded-Proto {{scheme}}
    }}
}}
"""

with open(caddyfile, "w") as f:
    f.write(new_caddyfile.strip() + "\n")

print(f"[+] Wrote clean Caddyfile to {caddyfile}")

# Reload or restart container
print(f"[+] Restarting {caddy_container} to apply fresh configuration...")
subprocess.run(f"docker restart {caddy_container}", shell=True)
subprocess.run("sleep 3", shell=True)

# Test port 80 directly
print("[*] Testing HTTP 80 with Host: media.celoris.in...")
res80 = subprocess.run(
    "curl -s -o /dev/null -w '%{http_code}' -H 'Host: media.celoris.in' http://127.0.0.1/reels/Db4eaYWBlXH.mp4",
    shell=True, capture_output=True, text=True
)
print(f"[+] Port 80 Result: HTTP {res80.stdout.strip()}")

# Test port 443 directly
print("[*] Testing HTTPS 443 with Host: media.celoris.in...")
res443 = subprocess.run(
    "curl -k -s -o /dev/null -w '%{http_code}' -H 'Host: media.celoris.in' https://127.0.0.1/reels/Db4eaYWBlXH.mp4",
    shell=True, capture_output=True, text=True
)
print(f"[+] Port 443 Result: HTTP {res443.stdout.strip()}")

if res80.stdout.strip() in ["200", "206"]:
    print("==========================================================")
    print("  SUCCESS! MEDIA STREAMING IS NOW FULLY OPERATIONAL! 🎉")
    print("==========================================================")
else:
    print(f"[!] Warning: HTTP code was {res80.stdout.strip()}. Inspecting docker logs:")
    subprocess.run(f"docker logs --tail 20 {caddy_container}", shell=True)
