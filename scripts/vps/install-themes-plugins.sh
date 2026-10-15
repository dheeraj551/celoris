#!/usr/bin/env bash

echo "=========================================================="
echo "    Celoris Cloud - Install Themes & Enable Subsite Menu  "
echo "=========================================================="

echo "=== [1/3] Installing Top Modern Themes ==="
# In WP-CLI, install first, then enable network
docker exec celoris-wordpress wp theme install astra blocksy kadence oceanwp generatepress neve hello-elementor popularfx sydney zakra --allow-root

echo ""
echo "=== [2/3] Network-Enabling All Themes for All Subsites ==="
docker exec celoris-wordpress wp theme enable --all --network --allow-root
echo "[+] All modern themes are now network-enabled!"

echo ""
echo "=== [3/3] Setting Astra as Active Theme on Recent Sites ==="
docker exec celoris-wordpress wp theme activate astra --url="https://soniyaa3366.celoris.in" --allow-root 2>/dev/null || true
docker exec celoris-wordpress wp theme activate astra --url="https://ananyajairath.celoris.in" --allow-root 2>/dev/null || true
docker exec celoris-wordpress wp theme activate astra --url="https://adityouknow.celoris.in" --allow-root 2>/dev/null || true

# Flush cache so themes show up immediately in wp-admin
docker exec celoris-wordpress wp cache flush --allow-root

echo ""
echo "=== Available Themes on Network ==="
docker exec celoris-wordpress wp theme list --allow-root

echo ""
echo "=========================================================="
echo "  🎉 SUCCESS: 10+ Modern Themes Available for All Users!  "
echo "=========================================================="
