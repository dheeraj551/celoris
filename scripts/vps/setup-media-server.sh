#!/usr/bin/env bash
set -e

echo "=== [1/3] Setting Up Celoris Media Service on VPS ==="

SERVICE_FILE="/etc/systemd/system/celoris-media.service"
PROJECT_DIR="/root/celoris"
MEDIA_DIR="$PROJECT_DIR/public/media"

cat << EOF > "$SERVICE_FILE"
[Unit]
Description=Celoris Pulse Media & Video Streaming Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$PROJECT_DIR
Environment=PORT=8085
Environment=MEDIA_DIR=$MEDIA_DIR
ExecStart=/usr/bin/node $PROJECT_DIR/scripts/vps/media-server.js
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable celoris-media
systemctl restart celoris-media

echo "[+] celoris-media service started on port 8085."

echo "=== [2/3] Configuring Caddy for media.celoris.in ==="

CADDYFILE="/opt/celoris-cloud/caddy/Caddyfile"
if [ ! -f "$CADDYFILE" ]; then
    for candidate in /root/Caddyfile /etc/caddy/Caddyfile; do
        if [ -f "$candidate" ]; then
            CADDYFILE="$candidate"
            break
        fi
    done
fi

if [ -f "$CADDYFILE" ]; then
    if ! grep -q "media.celoris.in" "$CADDYFILE"; then
        echo "[+] Adding media.celoris.in block to $CADDYFILE..."
        cat << 'EOF' >> "$CADDYFILE"

media.celoris.in {
    reverse_proxy host.docker.internal:8085 {
        header_up Host {host}
        header_up X-Real-IP {remote}
    }
}
EOF
    else
        echo "[*] media.celoris.in already configured in $CADDYFILE"
    fi

    # Reload Caddy
    CADDY_CONTAINER=$(docker ps --format '{{.Names}}' | grep -i "caddy" | head -n1 || true)
    if [ -n "$CADDY_CONTAINER" ]; then
        echo "[+] Reloading Caddy container: $CADDY_CONTAINER..."
        docker exec "$CADDY_CONTAINER" caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || docker restart "$CADDY_CONTAINER"
    fi
fi

# Allow port 8085 in UFW if firewall is enabled
ufw allow 8085/tcp comment "Celoris Media Server" 2>/dev/null || true

echo "=== [3/3] Testing Media Endpoint ==="
sleep 2
TEST_LOCAL=$(curl -s -I -o /dev/null -w "%{http_code}" http://127.0.0.1:8085/reels/Db4eaYWBlXH.mp4 || echo "000")
echo "[+] Local HTTP test: $TEST_LOCAL (200/206 = SUCCESS)"

echo "=========================================================="
echo "  CELORIS MEDIA SERVER IS LIVE! 🚀"
echo "  URL: https://media.celoris.in/reels/{video_id}.mp4"
echo "=========================================================="
