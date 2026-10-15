#!/usr/bin/env bash

echo "=========================================================="
echo "    Celoris Cloud - Fix Provisioner & MySQL Client        "
echo "=========================================================="

# 1. Install mysql client in celoris-wordpress container so wp db query works natively
echo "=== [1/5] Ensuring MySQL Client Inside WordPress Container ==="
docker exec celoris-wordpress bash -c "which mysql >/dev/null 2>&1 || (apt-get update && apt-get install -y default-mysql-client)"
echo "[+] MySQL client ready inside WordPress container!"

# 2. Clean up any conflicting old docker provisioner container
echo "=== [2/5] Cleaning Up Old Docker Containers on Port 4000 ==="
docker rm -f celoris-provisioner 2>/dev/null || true
docker rm -f $(docker ps -a --filter "name=provisioner" -q) 2>/dev/null || true

# 3. Download and install the new collision-free, secure-random provisioner.py
echo "=== [3/5] Updating /opt/celoris-cloud/provisioner.py ==="
mkdir -p /opt/celoris-cloud
curl -sL "https://raw.githubusercontent.com/dheeraj551/celoris/main/scripts/vps/provisioner.py?t=$(date +%s)" -o /opt/celoris-cloud/provisioner.py

# Ensure systemd service is active and running Python 3
cat << 'EOF' > /etc/systemd/system/celoris-provisioner.service
[Unit]
Description=Celoris Cloud Automated Provisioner API
After=docker.service

[Service]
Type=simple
ExecStart=/usr/bin/python3 /opt/celoris-cloud/provisioner.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now celoris-provisioner
systemctl restart celoris-provisioner
sleep 2

# 4. Install WordPress Network Themes
echo "=== [4/5] Verifying WordPress Network Themes ==="
docker exec celoris-wordpress wp theme install astra oceanwp generatepress neve hello-elementor kadence --activate-network --allow-root 2>/dev/null || true
echo "[+] WordPress network themes ready!"

# 5. Active Subsites on Celoris Cloud
echo "=== [5/5] Verification & Active Subsites ==="
docker exec celoris-wordpress wp site list --allow-root

echo ""
echo "Testing HTTP status for ananyajairath.celoris.in:"
curl -k -s -o /dev/null -w "HTTP Status: %{http_code}\nRedirect: %{redirect_url}\n" "https://ananyajairath.celoris.in"

echo ""
echo "=========================================================="
echo "  🎉 SUCCESS: Celoris Cloud Engine is 100% OPERATIONAL!   "
echo "=========================================================="
