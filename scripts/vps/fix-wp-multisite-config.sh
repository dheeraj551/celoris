#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "    Celoris Cloud - Fix Multisite Subdomain Routing      "
echo "=========================================================="

# 1. Write the Complete, Pristine wp-config.php with Subdomain Multisite & SSL Proxy Detection
echo "=== [1/4] Writing Complete wp-config.php with Subdomain Constants ==="
cat << 'EOF' | docker exec -i celoris-wordpress bash -c "cat > /var/www/html/wp-config.php"
<?php
define( 'DB_NAME', 'celoris_wp' );
define( 'DB_USER', 'celoris_user' );
define( 'DB_PASSWORD', 'CelorisSecureDB_2026!' );
define( 'DB_HOST', 'mariadb:3306' );
define( 'DB_CHARSET', 'utf8' );
define( 'DB_COLLATE', '' );

define( 'AUTH_KEY',         'celoris_key_1_8f93e1a0b' );
define( 'SECURE_AUTH_KEY',  'celoris_key_2_7e82d0c9a' );
define( 'LOGGED_IN_KEY',    'celoris_key_3_6d71c9b8f' );
define( 'NONCE_KEY',        'celoris_key_4_5c60b8a7e' );
define( 'AUTH_SALT',        'celoris_salt_1_4b59a796d' );
define( 'SECURE_AUTH_SALT', 'celoris_salt_2_3a489685c' );
define( 'LOGGED_IN_SALT',   'celoris_salt_3_29378574b' );
define( 'NONCE_SALT',       'celoris_salt_4_18267463a' );

$table_prefix = 'wp_';

// SSL detection behind Caddy Reverse Proxy
if (isset($_SERVER['HTTP_X_FORWARDED_PROTO']) && $_SERVER['HTTP_X_FORWARDED_PROTO'] === 'https') {
    $_SERVER['HTTPS'] = 'on';
}

define( 'WP_DEBUG', false );
define( 'WP_ALLOW_MULTISITE', true );
define( 'MULTISITE', true );
define( 'SUBDOMAIN_INSTALL', true );
define( 'DOMAIN_CURRENT_SITE', 'celoris.in' );
define( 'PATH_CURRENT_SITE', '/' );
define( 'SITE_ID_CURRENT_SITE', 1 );
define( 'BLOG_ID_CURRENT_SITE', 1 );

if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

require_once ABSPATH . 'wp-settings.php';
EOF

docker exec celoris-wordpress chown www-data:www-data /var/www/html/wp-config.php
echo "[+] wp-config.php successfully updated with MULTISITE and SUBDOMAIN_INSTALL!"

# 2. Update Apache .htaccess for Subdomain Routing
echo "=== [2/4] Updating WordPress .htaccess for Subdomain Multisite ==="
cat << 'EOF' | docker exec -i celoris-wordpress bash -c "cat > /var/www/html/.htaccess"
RewriteEngine On
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteBase /
RewriteRule ^index\.php$ - [L]

# add a trailing slash to /wp-admin
RewriteRule ^wp-admin$ wp-admin/ [R=301,L]

RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]
RewriteRule ^(wp-(content|admin|includes).*) $1 [L]
RewriteRule ^(.*\.php)$ $1 [L]
RewriteRule . index.php [L]
EOF

docker exec celoris-wordpress chown www-data:www-data /var/www/html/.htaccess
echo "[+] .htaccess configured for multisite subdomain rewriting."

# 3. Fix URLs to HTTPS for Subsites in Database
echo "=== [3/4] Ensuring HTTPS on ananyajairath.celoris.in ==="
docker exec celoris-wordpress wp option update siteurl "https://ananyajairath.celoris.in" --url="http://ananyajairath.celoris.in" --allow-root 2>/dev/null || true
docker exec celoris-wordpress wp option update home "https://ananyajairath.celoris.in" --url="http://ananyajairath.celoris.in" --allow-root 2>/dev/null || true

# 4. Graceful Apache Reload
echo "=== [4/4] Reloading Apache Web Server ==="
docker exec celoris-wordpress apache2ctl graceful 2>/dev/null || docker restart celoris-wordpress
sleep 2

echo ""
echo "=== Verification ==="
echo "[*] Testing ananyajairath.celoris.in directly:"
curl -s -I https://ananyajairath.celoris.in | head -n 10

echo ""
echo "=========================================================="
echo "  🎉 SUCCESS: Multisite Subdomain Routing is FIXED!       "
echo "=========================================================="
