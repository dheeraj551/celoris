#!/usr/bin/env bash

echo "=========================================================="
echo "          CELORIS CLOUD - MULTISITE DIAGNOSTIC            "
echo "=========================================================="

echo "=== [1] wp-config.php Multisite Constants ==="
docker exec celoris-wordpress grep -E "MULTISITE|SUBDOMAIN|DOMAIN_CURRENT_SITE|PATH_CURRENT_SITE" /var/www/html/wp-config.php || echo "No multisite constants found!"

echo ""
echo "=== [2] wp_site Table in Database ==="
docker exec celoris-wordpress wp db query "SELECT id, domain, path FROM wp_site;" --allow-root

echo ""
echo "=== [3] wp_blogs Table in Database ==="
docker exec celoris-wordpress wp db query "SELECT blog_id, site_id, domain, path, archived, deleted FROM wp_blogs;" --allow-root

echo ""
echo "=== [4] Options for Site 9 (ananyajairath) ==="
docker exec celoris-wordpress wp db query "SELECT option_name, option_value FROM wp_9_options WHERE option_name IN ('siteurl', 'home');" --allow-root

echo ""
echo "=========================================================="
