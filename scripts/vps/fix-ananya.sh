#!/usr/bin/env bash

echo "=========================================================="
echo "         Diagnosing & Fixing ananyajairath               "
echo "=========================================================="

echo ""
echo "=== [1] Current Sites in wp_blogs Table ==="
docker exec celoris-wordpress wp db query "SELECT blog_id, domain, path, deleted, archived FROM wp_blogs;" --allow-root

echo ""
echo "=== [2] Checking wp_signups Table (if any) ==="
docker exec celoris-wordpress wp db query "SELECT domain, path, user_login, registered FROM wp_signups WHERE domain LIKE '%ananyajairath%';" --allow-root 2>/dev/null || echo "No signups found or table does not exist."

echo ""
echo "=== [3] Checking WordPress Cache with eval domain_exists ==="
docker exec celoris-wordpress wp eval 'echo "domain_exists before cleanup: "; var_dump(domain_exists("ananyajairath.celoris.in", "/"));' --allow-root

echo ""
echo "=== [4] Purging Database Records & Flushing Cache ==="
docker exec celoris-wordpress wp db query "DELETE FROM wp_blogs WHERE domain LIKE '%ananyajairath%';" --allow-root
docker exec celoris-wordpress wp db query "DELETE FROM wp_signups WHERE domain LIKE '%ananyajairath%';" --allow-root 2>/dev/null || true
docker exec celoris-wordpress wp cache flush --allow-root

echo ""
echo "=== [5] Re-checking eval domain_exists after cache flush ==="
docker exec celoris-wordpress wp eval 'echo "domain_exists after flush: "; var_dump(domain_exists("ananyajairath.celoris.in", "/"));' --allow-root

echo ""
echo "=== [6] Creating Site cleanly with WP-CLI ==="
docker exec celoris-wordpress wp site create --slug="ananyajairath" --title="Ananya Jairath" --allow-root

echo ""
echo "=== [7] Ensuring Active & Activating Theme ==="
docker exec celoris-wordpress wp db query "UPDATE wp_blogs SET deleted = 0, archived = 0, mature = 0, spam = 0 WHERE domain = 'ananyajairath.celoris.in';" --allow-root
docker exec celoris-wordpress wp site option set blog_upload_space 3072 --allow-root
docker exec celoris-wordpress wp option set blog_upload_space 3072 --url="https://ananyajairath.celoris.in" --allow-root
docker exec celoris-wordpress wp theme activate astra --url="https://ananyajairath.celoris.in" --allow-root
docker exec celoris-wordpress wp option update siteurl "https://ananyajairath.celoris.in" --url="https://ananyajairath.celoris.in" --allow-root
docker exec celoris-wordpress wp option update home "https://ananyajairath.celoris.in" --url="https://ananyajairath.celoris.in" --allow-root

echo ""
echo "=== [8] Configuring Administrator User ==="
USER_EXISTS=$(docker exec celoris-wordpress wp user get ananyajairath --field=ID --allow-root 2>/dev/null || true)
if [ -z "$USER_EXISTS" ]; then
    docker exec celoris-wordpress wp user create ananyajairath ananyajairath@celoris.in --user_pass="Celoris#2026!Ananya" --role=administrator --url="https://ananyajairath.celoris.in" --allow-root
else
    docker exec celoris-wordpress wp user set-role ananyajairath administrator --url="https://ananyajairath.celoris.in" --allow-root
    docker exec celoris-wordpress wp user update ananyajairath --user_pass="Celoris#2026!Ananya" --allow-root
fi

echo ""
echo "=== [9] Final Verification ==="
docker exec celoris-wordpress wp site list --allow-root
echo ""
echo "Testing HTTP status for ananyajairath.celoris.in:"
curl -k -s -o /dev/null -w "HTTP Status: %{http_code}\nRedirect: %{redirect_url}\n" "https://ananyajairath.celoris.in"

echo ""
echo "=========================================================="
echo "                       COMPLETE                           "
echo "=========================================================="
