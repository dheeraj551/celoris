#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  FIXING CADDY REVERSE PROXY FOR media.celoris.in"
echo "=========================================================="

CADDY_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i "caddy" | head -n1 || true)
if [ -z "$CADDY_CONTAINER" ]; then
    echo "[-] Error: Caddy Docker container not found!"
    exit 1
fi
echo "[+] Found Caddy container: $CADDY_CONTAINER"

# Detect Docker gateway IP (host IP seen from container)
DOCKER_GW=$(docker network inspect bridge --format '{{range .IPAM.Config}}{{.Gateway}}{{end}}' 2>/dev/null || echo "172.17.0.1")
if [ -z "$DOCKER_GW" ]; then
    DOCKER_GW="172.17.0.1"
fi
echo "[+] Detected Docker gateway IP: $DOCKER_GW"

# Check if port 8085 is listening on host
if ! ss -tlpn | grep -q ":8085"; then
    echo "[!] Warning: Port 8085 not listening. Restarting celoris-media service..."
    systemctl restart celoris-media
    sleep 2
fi

# Test connection from inside Caddy container to host port 8085
PROXY_TARGET=""
echo "[+] Testing connectivity from inside $CADDY_CONTAINER..."
if docker exec "$CADDY_CONTAINER" wget -qO- --spider "http://${DOCKER_GW}:8085/reels/Db4eaYWBlXH.mp4" 2>/dev/null; then
    PROXY_TARGET="${DOCKER_GW}:8085"
    echo "[+] Target ${PROXY_TARGET} reached successfully from container!"
elif docker exec "$CADDY_CONTAINER" wget -qO- --spider "http://127.0.0.1:8085/reels/Db4eaYWBlXH.mp4" 2>/dev/null; then
    PROXY_TARGET="127.0.0.1:8085"
    echo "[+] Target ${PROXY_TARGET} reached successfully (host network)!"
elif docker exec "$CADDY_CONTAINER" wget -qO- --spider "http://172.17.0.1:8085/reels/Db4eaYWBlXH.mp4" 2>/dev/null; then
    PROXY_TARGET="172.17.0.1:8085"
    echo "[+] Target 172.17.0.1:8085 reached successfully!"
else
    # Fallback to DOCKER_GW
    PROXY_TARGET="${DOCKER_GW}:8085"
    echo "[!] Container curl test inconclusive, defaulting to ${PROXY_TARGET}"
fi

# Locate Caddyfile
CADDYFILE="/opt/celoris-cloud/caddy/Caddyfile"
if [ ! -f "$CADDYFILE" ]; then
    for candidate in /root/Caddyfile /etc/caddy/Caddyfile; do
        if [ -f "$candidate" ]; then
            CADDYFILE="$candidate"
            break
        fi
    done
fi
echo "[+] Modifying Caddyfile at: $CADDYFILE"

# Backup Caddyfile
cp "$CADDYFILE" "${CADDYFILE}.bak.$(date +%s)"

# Read current Caddyfile without any existing media.celoris.in blocks
CLEANED_CADDYFILE=$(python3 -c "
import re
with open('$CADDYFILE', 'r') as f:
    content = f.read()

# Remove any existing media.celoris.in blocks
content = re.sub(r'([^\n]*media\.celoris\.in[^{]*\{[^}]*\})', '', content, flags=re.DOTALL)
# Also remove any stranded lines referencing media.celoris.in
lines = [l for l in content.split('\n') if 'media.celoris.in' not in l]
print('\n'.join(lines).strip())
")

# Build new Caddyfile:
# 1. Ensure global options has 'auto_https disable_redirects' to eliminate the 308 redirect loop
# 2. Add http://media.celoris.in and https://media.celoris.in blocks at the VERY TOP
python3 - << PYEOF
import re

caddyfile_path = "$CADDYFILE"
proxy_target = "$PROXY_TARGET"

with open(caddyfile_path, "r") as f:
    text = f.read()

# Strip any media.celoris.in blocks
text = re.sub(r'(?:[^\n]*media\.celoris\.in[^{]*\{[\s\S]*?\})', '', text)
lines = [l for l in text.split('\n') if 'media.celoris.in' not in l]
text = '\n'.join(lines).strip()

media_blocks = f"""
# --- Celoris Media Streaming (Reverse Proxy to Node.js) ---
http://media.celoris.in {{
    reverse_proxy {proxy_target} {{
        header_up Host {{host}}
        header_up X-Real-IP {{remote}}
    }}
}}

https://media.celoris.in {{
    tls internal
    reverse_proxy {proxy_target} {{
        header_up Host {{host}}
        header_up X-Real-IP {{remote}}
    }}
}}
"""

# Check if global block exists: { ... }
global_match = re.match(r'^\s*\{\s*([\s\S]*?)\}', text)
if global_match:
    inner = global_match.group(1)
    if "auto_https" not in inner:
        new_global = "{\n    auto_https disable_redirects\n" + inner.strip() + "\n}\n"
    else:
        new_global = "{\n" + inner.strip() + "\n}\n"
    rest = text[global_match.end():].strip()
    final_caddy = new_global + "\n" + media_blocks + "\n" + rest
else:
    final_caddy = "{\n    auto_https disable_redirects\n}\n\n" + media_blocks + "\n" + text

with open(caddyfile_path, "w") as f:
    f.write(final_caddy.strip() + "\n")

print("[+] Updated Caddyfile successfully.")
PYEOF

echo "[+] Validating and reloading Caddy..."
docker exec "$CADDY_CONTAINER" caddy reload --config /etc/caddy/Caddyfile || docker restart "$CADDY_CONTAINER"

sleep 2

echo "=== Testing Media Endpoint via HTTP ==="
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -H "Host: media.celoris.in" http://127.0.0.1/reels/Db4eaYWBlXH.mp4 || echo "ERR")
echo "[+] HTTP (Port 80) Host test: $HTTP_STATUS (Expected: 200 or 206, NOT 308!)"

echo "=== Testing Media Endpoint via HTTPS ==="
HTTPS_STATUS=$(curl -k -s -o /dev/null -w "%{http_code}" -H "Host: media.celoris.in" https://127.0.0.1/reels/Db4eaYWBlXH.mp4 || echo "ERR")
echo "[+] HTTPS (Port 443) Host test: $HTTPS_STATUS (Expected: 200 or 206, NOT 502/308!)"

if [ "$HTTP_STATUS" = "200" ] || [ "$HTTP_STATUS" = "206" ]; then
    echo "=========================================================="
    echo "  SUCCESS! CADDY REDIRECT LOOP ELIMINATED! 🎉"
    echo "  HTTP 80 -> $HTTP_STATUS"
    echo "  HTTPS 443 -> $HTTPS_STATUS"
    echo "=========================================================="
else
    echo "[!] Notice: Status was $HTTP_STATUS. Please inspect /opt/celoris-cloud/caddy/Caddyfile"
fi
