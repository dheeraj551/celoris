#!/usr/bin/env bash

echo "=========================================================="
echo "    Celoris Cloud - Install Themes & Enable Subsite Menu  "
echo "=========================================================="

echo "=== [1/4] Installing & Network-Enabling Top Modern Themes ==="
# Notice: For themes, the WP-CLI flag is --enable-network (NOT --activate-network)
docker exec celoris-wordpress wp theme install astra blocksy kadence oceanwp generatepress neve hello-elementor popularfx sydney zakra --enable-network --allow-root

# Ensure all installed themes are network-enabled across all subsites
docker exec celoris-wordpress wp theme enable --all --network --allow-root
echo "[+] Themes installed and network-enabled!"

echo ""
echo "=== [2/4] Installing Essential Subsite Plugins ==="
# Install Elementor, Astra Starter Templates, Spectra Blocks, and WPForms
docker exec celoris-wordpress wp plugin install elementor astra-sites ultimate-addons-for-gutenberg wpforms-lite all-in-one-wp-migration --allow-root
echo "[+] Plugins installed!"

echo ""
echo "=== [3/4] Enabling Plugins Menu for All Subsite Admins ==="
# Allows subsite administrators to view and activate plugins on their individual site
docker exec celoris-wordpress wp site option set menu_items '{"plugins":1}' --format=json --allow-root
docker exec celoris-wordpress wp network meta set 1 menu_items '{"plugins":1}' --format=json --allow-root 2>/dev/null || true
echo "[+] Plugins menu enabled for all subsite admins!"

echo ""
echo "=== [4/4] Activating Astra on Current Subsites ==="
# Activate Astra theme on soniyaa3366 and existing test sites
docker exec celoris-wordpress wp theme activate astra --url="https://soniyaa3366.celoris.in" --allow-root 2>/dev/null || true
docker exec celoris-wordpress wp theme activate astra --url="https://ananyajairath.celoris.in" --allow-root 2>/dev/null || true
docker exec celoris-wordpress wp theme activate astra --url="https://adityouknow.celoris.in" --allow-root 2>/dev/null || true

# Flush cache so themes appear instantly in wp-admin
docker exec celoris-wordpress wp cache flush --allow-root

echo ""
echo "=== Available Themes on Network ==="
docker exec celoris-wordpress wp theme list --allow-root

echo ""
echo "=========================================================="
echo "  🎉 SUCCESS: Themes & Plugins Catalog is 100% LIVE!     "
echo "=========================================================="
