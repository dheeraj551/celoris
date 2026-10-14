#!/usr/bin/env bash
set -e

echo "=== [1/3] Locating Caddy and Caddyfile ==="

# Check running Caddy processes and containers
CADDY_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i "caddy" | head -n1 || true)
CADDY_FILES=$(find /etc /root /var /home -name "Caddyfile" 2>/dev/null || true)

echo "Detected Caddyfiles:"
echo "$CADDY_FILES"

if [ -n "$CADDY_CONTAINER" ]; then
    echo "Detected Caddy Docker container: $CADDY_CONTAINER"
fi

LIVEKIT_BLOCK='livekit.celoris.in {
    reverse_proxy 127.0.0.1:7880
}'

UPDATED=0

for file in $CADDY_FILES; do
    if [ -f "$file" ]; then
        if grep -q "livekit.celoris.in" "$file"; then
            echo "[*] livekit.celoris.in already present in $file"
        else
            echo "[+] Adding livekit.celoris.in to the top of $file..."
            # Insert at the beginning of the file so it takes priority over *.celoris.in
            TMP_FILE=$(mktemp)
            echo -e "$LIVEKIT_BLOCK\n" > "$TMP_FILE"
            cat "$file" >> "$TMP_FILE"
            cp "$TMP_FILE" "$file"
            rm -f "$TMP_FILE"
            UPDATED=1
        fi
    fi
done

# If no host Caddyfile found, check inside Caddy container if exists
if [ -n "$CADDY_CONTAINER" ]; then
    echo "[+] Checking Caddyfile inside container $CADDY_CONTAINER..."
    if ! docker exec "$CADDY_CONTAINER" grep -q "livekit.celoris.in" /etc/caddy/Caddyfile 2>/dev/null; then
        docker exec "$CADDY_CONTAINER" sh -c "echo -e '\nlivekit.celoris.in {\n    reverse_proxy 127.0.0.1:7880\n}' >> /etc/caddy/Caddyfile" || true
        UPDATED=1
    fi
fi

echo "=== [2/3] Reloading Caddy Configuration ==="
if systemctl is-active --quiet caddy; then
    echo "[+] Reloading systemd caddy service..."
    systemctl reload caddy || systemctl restart caddy
elif command -v caddy >/dev/null 2>&1; then
    echo "[+] Reloading caddy binary..."
    caddy reload 2>/dev/null || true
fi

if [ -n "$CADDY_CONTAINER" ]; then
    echo "[+] Reloading Caddy container $CADDY_CONTAINER..."
    docker exec "$CADDY_CONTAINER" caddy reload 2>/dev/null || true
fi

echo "=== [3/3] Testing LiveKit HTTPS endpoint ==="
sleep 2
TEST_RESP=$(curl -s -I -o /dev/null -w "%{http_code}" https://livekit.celoris.in || echo "000")
echo "HTTP Status for https://livekit.celoris.in: $TEST_RESP"

if [ "$TEST_RESP" = "200" ]; then
    echo ""
    echo "=========================================================="
    echo " SUCCESS: https://livekit.celoris.in is now LIVE! 🎉      "
    echo " WebRTC WSS URL: wss://livekit.celoris.in                  "
    echo "=========================================================="
else
    echo "Note: If Cloudflare is proxying *.celoris.in, make sure WebSockets are enabled in Cloudflare Network settings."
fi
