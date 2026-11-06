#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "  [1/3] Setting Up Celoris Media Service on VPS"
echo "=========================================================="

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

echo "=========================================================="
echo "  [2/3] Configuring Caddy for media.celoris.in"
echo "=========================================================="

bash "$PROJECT_DIR/scripts/vps/fix-caddy.sh"

echo "=========================================================="
echo "  [3/3] Final Status Check"
echo "=========================================================="
systemctl status celoris-media --no-pager | head -n 10
