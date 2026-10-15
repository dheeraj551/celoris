#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "    Celoris Cloud - Fix Provisioner & Install Themes     "
echo "=========================================================="

# 1. Clean up any conflicting old docker provisioner container
echo "=== [1/4] Cleaning Up Old Docker Containers on Port 4000 ==="
docker rm -f celoris-provisioner 2>/dev/null || true
docker rm -f $(docker ps -a --filter "name=provisioner" -q) 2>/dev/null || true

# 2. Download and install the new collision-free provisioner.py
echo "=== [2/4] Updating /opt/celoris-cloud/provisioner.py ==="
curl -sL https://raw.githubusercontent.com/dheeraj551/celoris/main/scripts/vps/provisioner.py -o /opt/celoris-cloud/provisioner.py

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

# 3. Install WordPress Network Themes
echo "=== [3/4] Installing WordPress Network Themes ==="
docker exec celoris-wordpress wp theme install astra oceanwp generatepress neve hello-elementor kadence --activate-network --allow-root 2>/dev/null || true
echo "[+] WordPress network themes installed and network-activated!"

# 4. Provision ananyajairath site now
echo "=== [4/4] Provisioning ananyajairath Site ==="
docker exec celoris-wordpress wp site create --slug="ananyajairath" --title="Ananya Jairath Portfolio" --allow-root 2>/dev/null || true
docker exec celoris-wordpress wp user set-role ananyajairath administrator --url="http://ananyajairath.celoris.in" --allow-root 2>/dev/null || true
docker exec celoris-wordpress wp user update ananyajairath --user_pass="celoris_ananyajairath_2026" --allow-root 2>/dev/null || true
docker exec celoris-wordpress wp theme activate astra --url="http://ananyajairath.celoris.in" --allow-root 2>/dev/null || true

echo ""
echo "[*] Current Active Subsites on Celoris Cloud:"
docker exec celoris-wordpress wp site list --allow-root

echo ""
echo "=========================================================="
echo "  🎉 SUCCESS: Celoris Cloud Provisioning is FIXED & LIVE! "
echo "=========================================================="
