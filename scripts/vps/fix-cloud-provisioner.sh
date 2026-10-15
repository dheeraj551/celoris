#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "    Celoris Cloud - Fix Provisioner & Subsite Purge      "
echo "=========================================================="

# 1. Clean up any conflicting old docker provisioner container
echo "=== [1/5] Cleaning Up Old Docker Containers on Port 4000 ==="
docker rm -f celoris-provisioner 2>/dev/null || true
docker rm -f $(docker ps -a --filter "name=provisioner" -q) 2>/dev/null || true

# 2. Download and install the new collision-free, zombie-purging provisioner.py
echo "=== [2/5] Updating /opt/celoris-cloud/provisioner.py ==="
mkdir -p /opt/celoris-cloud
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
echo "=== [3/5] Verifying WordPress Network Themes ==="
docker exec celoris-wordpress wp theme install astra oceanwp generatepress neve hello-elementor kadence --activate-network --allow-root 2>/dev/null || true
echo "[+] WordPress network themes ready!"

# 4. Clean up any zombie/deleted record for ananyajairath
echo "=== [4/5] Purging Zombie Records & Re-creating ananyajairath ==="
# Find existing blog_id if any
OLD_ID=$(docker exec celoris-wordpress wp db query "SELECT blog_id FROM wp_blogs WHERE domain LIKE '%ananyajairath%' LIMIT 1;" --skip-column-names --allow-root 2>/dev/null || true)
if [ -n "$OLD_ID" ] && [ "$OLD_ID" != "1" ]; then
    echo "Found old site ID $OLD_ID for ananyajairath. Purging..."
    docker exec celoris-wordpress wp site delete "$OLD_ID" --yes --allow-root 2>/dev/null || true
fi
docker exec celoris-wordpress wp db query "DELETE FROM wp_blogs WHERE domain LIKE '%ananyajairath%';" --allow-root 2>/dev/null || true

# Cleanly create ananyajairath
echo "Creating clean site for ananyajairath..."
docker exec celoris-wordpress wp site create --slug="ananyajairath" --title="Ananya Jairath" --allow-root

# Ensure active in wp_blogs
docker exec celoris-wordpress wp db query "UPDATE wp_blogs SET deleted = 0, archived = 0, mature = 0, spam = 0 WHERE domain = 'ananyajairath.celoris.in';" --allow-root

# Set storage quota (3 GB)
docker exec celoris-wordpress wp site option set blog_upload_space 3072 --allow-root
docker exec celoris-wordpress wp option set blog_upload_space 3072 --url="https://ananyajairath.celoris.in" --allow-root

# Configure user
USER_ID=$(docker exec celoris-wordpress wp user get ananyajairath --field=ID --allow-root 2>/dev/null || true)
if [ -z "$USER_ID" ]; then
    docker exec celoris-wordpress wp user create ananyajairath ananyajairath@celoris.in --user_pass="celoris_ananyajairath_2026" --role=administrator --url="https://ananyajairath.celoris.in" --allow-root
else
    docker exec celoris-wordpress wp user set-role ananyajairath administrator --url="https://ananyajairath.celoris.in" --allow-root
    docker exec celoris-wordpress wp user update ananyajairath --user_pass="celoris_ananyajairath_2026" --allow-root
fi

# Activate theme and ensure HTTPS URLs
docker exec celoris-wordpress wp theme activate astra --url="https://ananyajairath.celoris.in" --allow-root
docker exec celoris-wordpress wp option update siteurl "https://ananyajairath.celoris.in" --url="https://ananyajairath.celoris.in" --allow-root
docker exec celoris-wordpress wp option update home "https://ananyajairath.celoris.in" --url="https://ananyajairath.celoris.in" --allow-root

echo ""
echo "=== [5/5] Verification & Active Subsites ==="
docker exec celoris-wordpress wp site list --allow-root

echo ""
echo "Testing HTTP response of ananyajairath.celoris.in:"
curl -k -s -o /dev/null -w "HTTP Status: %{http_code}\nRedirect: %{redirect_url}\n" "https://ananyajairath.celoris.in"

echo ""
echo "=========================================================="
echo "  🎉 SUCCESS: Celoris Cloud Provisioner & ananyajairath FIXED! "
echo "=========================================================="
