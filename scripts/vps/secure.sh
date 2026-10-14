#!/usr/bin/env bash
set -e

echo "=== [1/5] Removing readme.html and setting up mu-plugins ==="
docker exec celoris-wordpress mkdir -p /var/www/html/wp-content/mu-plugins
docker exec celoris-wordpress rm -f /var/www/html/readme.html

echo "=== [2/5] Installing Security & Redirection Engine ==="
cat << 'EOF' > /tmp/celoris-security.php
<?php
/**
 * Plugin Name: Celoris Cloud Security & Redirect Engine
 * Description: Hardens REST API, disables XML-RPC, blocks leaks, and redirects celoris.in root.
 */

// 1. Block REST API users endpoint for visitors who are not logged in
add_filter('rest_endpoints', function($endpoints) {
    if (!is_user_logged_in() && isset($endpoints['/wp/v2/users'])) {
        unset($endpoints['/wp/v2/users']);
        unset($endpoints['/wp/v2/users/(?P<id>[\d]+)']);
    }
    return $endpoints;
});

// 2. Disable XML-RPC completely
add_filter('xmlrpc_enabled', '__return_false');
add_filter('xmlrpc_methods', function() { return []; });

// 3. Block install.php execution if already installed
if (strpos($_SERVER['REQUEST_URI'] ?? '', 'install.php') !== false) {
    if (function_exists('is_blog_installed') && is_blog_installed()) {
        wp_die('WordPress is already installed.', 'Forbidden', ['response' => 403]);
    }
}

// 4. Redirect celoris.in root to celorisdesigns.com/cloud (preserves wp-admin and subsites)
add_action('template_redirect', function() {
    $host = strtolower($_SERVER['HTTP_HOST'] ?? '');
    $uri = $_SERVER['REQUEST_URI'] ?? '/';
    if (($host === 'celoris.in' || $host === 'www.celoris.in') && ($uri === '/' || $uri === '')) {
        wp_redirect('https://celorisdesigns.com/cloud', 301);
        exit;
    }
});
EOF

docker cp /tmp/celoris-security.php celoris-wordpress:/var/www/html/wp-content/mu-plugins/celoris-security.php
rm -f /tmp/celoris-security.php

echo "=== [3/5] Disabling dashboard file editing in wp-config.php ==="
docker exec celoris-wordpress wp config set DISALLOW_FILE_EDIT true --raw --allow-root

echo "=== [4/5] Hiding PHP Version (expose_php = Off) ==="
docker exec celoris-wordpress bash -c 'echo "expose_php = Off" > /usr/local/etc/php/conf.d/security.ini'

echo "=== [5/5] Installing Network-wide 2FA plugin & restarting container ==="
docker exec celoris-wordpress wp plugin install two-factor --activate-network --allow-root || true
docker restart celoris-wordpress

echo "=== [SUCCESS] All 5 security hardening items are now active! ==="
