#!/usr/bin/env bash
set -e

echo "=== [1/4] Connecting LiveKit to Caddy's Docker Network ==="
CADDY_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i "caddy" | head -n1 || true)
if [ -z "$CADDY_CONTAINER" ]; then
    echo "[!] Error: celoris-caddy container not found running."
    docker ps
    exit 1
fi
echo "[+] Detected Caddy container: $CADDY_CONTAINER"

# Connect livekit to the same docker network as caddy so they can communicate internally
CADDY_NET=$(docker inspect "$CADDY_CONTAINER" --format '{{range $k, $v := .NetworkSettings.Networks}}{{$k}} {{end}}' | awk '{print $1}')
if [ -n "$CADDY_NET" ] && [ "$CADDY_NET" != "bridge" ] && [ "$CADDY_NET" != "host" ]; then
    echo "[+] Connecting livekit container to network: $CADDY_NET..."
    docker network connect "$CADDY_NET" livekit 2>/dev/null || true
fi

echo "=== [2/4] Locating Host Caddyfile Mount ==="
# Inspect volume/bind mounts of Caddy container
HOST_CADDYFILE=""
while IFS= read -r line; do
    SRC=$(echo "$line" | awk '{print $1}')
    DEST=$(echo "$line" | awk '{print $2}')
    if [ "$DEST" = "/etc/caddy/Caddyfile" ]; then
        HOST_CADDYFILE="$SRC"
        break
    elif [ "$DEST" = "/etc/caddy" ]; then
        HOST_CADDYFILE="$SRC/Caddyfile"
        break
    fi
done < <(docker inspect "$CADDY_CONTAINER" --format '{{range .Mounts}}{{.Source}} {{.Destination}}{{"\n"}}{{end}}')

# Fallback: check standard directories if not found in mounts
if [ -z "$HOST_CADDYFILE" ] || [ ! -f "$HOST_CADDYFILE" ]; then
    for candidate in /root/Caddyfile /etc/caddy/Caddyfile /root/celoris/Caddyfile /home/*/Caddyfile; do
        if [ -f "$candidate" ]; then
            HOST_CADDYFILE="$candidate"
            break
        fi
    done
fi

echo "[+] Target Host Caddyfile: $HOST_CADDYFILE"

if [ -z "$HOST_CADDYFILE" ] || [ ! -f "$HOST_CADDYFILE" ]; then
    echo "[!] Could not locate host Caddyfile. Dumping caddy mounts:"
    docker inspect "$CADDY_CONTAINER" --format '{{range .Mounts}}{{.Type}}: {{.Source}} -> {{.Destination}}{{"\n"}}{{end}}'
    exit 1
fi

echo "=== [3/4] Updating Caddyfile Routing for livekit.celoris.in ==="
if grep -q "livekit.celoris.in" "$HOST_CADDYFILE"; then
    echo "[*] livekit.celoris.in already present in $HOST_CADDYFILE"
else
    echo "[+] Inserting livekit.celoris.in block at the top of $HOST_CADDYFILE..."
    TMP_FILE=$(mktemp)
    cat << 'EOF' > "$TMP_FILE"
livekit.celoris.in {
    reverse_proxy livekit:7880 {
        header_up Host {host}
        header_up X-Real-IP {remote}
    }
}

EOF
    cat "$HOST_CADDYFILE" >> "$TMP_FILE"
    cp "$TMP_FILE" "$HOST_CADDYFILE"
    rm -f "$TMP_FILE"
    echo "[+] Successfully updated $HOST_CADDYFILE"
fi

echo "=== [4/4] Reloading Caddy ==="
docker exec "$CADDY_CONTAINER" caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || docker restart "$CADDY_CONTAINER"
echo "[+] Caddy reloaded successfully!"

sleep 3
echo "=== Testing livekit.celoris.in endpoint ==="
TEST_RESP=$(curl -s -I -o /dev/null -w "%{http_code}" https://livekit.celoris.in || echo "000")
echo "[+] HTTP Status for https://livekit.celoris.in: $TEST_RESP"

if [ "$TEST_RESP" = "200" ]; then
    echo ""
    echo "=========================================================="
    echo " SUCCESS! https://livekit.celoris.in is now LIVE! 🎉     "
    echo " WebRTC Signaling URL : wss://livekit.celoris.in         "
    echo "=========================================================="
else
    echo "Current status: $TEST_RESP (if 302, ensure Caddy has reloaded or test again in a moment)."
fi
