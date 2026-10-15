#!/usr/bin/env bash

echo "=========================================================="
echo "    Installing Mow - Premium Blog & Magazine Theme       "
echo "=========================================================="

echo "=== [1/4] Downloading Mow Theme from Google Drive ==="
curl -sL "https://drive.usercontent.google.com/download?id=1N_sPxJbUOYdV5UBb0AQJilMRXiRb8Ivu&export=download" -o /tmp/mow.zip
ls -lh /tmp/mow.zip

echo ""
echo "=== [2/4] Copying & Installing inside WordPress ==="
docker cp /tmp/mow.zip celoris-wordpress:/tmp/mow.zip
docker exec celoris-wordpress wp theme install /tmp/mow.zip --force --allow-root
docker exec celoris-wordpress rm -f /tmp/mow.zip
rm -f /tmp/mow.zip

echo ""
echo "=== [3/4] Network-Enabling Mow Theme for All Subsites ==="
docker exec celoris-wordpress wp theme enable mow --network --allow-root
docker exec celoris-wordpress wp cache flush --allow-root

echo ""
echo "=== [4/4] Verification ==="
docker exec celoris-wordpress wp theme list --allow-root | grep -i "mow" || docker exec celoris-wordpress wp theme list --allow-root

echo ""
echo "=========================================================="
echo "  🎉 SUCCESS: Mow Premium Theme is Network-Enabled!       "
echo "=========================================================="
