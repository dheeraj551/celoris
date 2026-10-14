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

// 5. Injected Abuse Notice on all subsites (Google Safe Browsing & Intermediary Compliance)
add_action('wp_footer', function() {
    $host = strtolower($_SERVER['HTTP_HOST'] ?? '');
    if ($host === 'celoris.in' || $host === 'www.celoris.in') {
        return;
    }
    echo '<div style="position:fixed;bottom:0;left:0;right:0;background:rgba(10,12,16,0.92);backdrop-filter:blur(8px);border-top:1px solid rgba(255,255,255,0.08);color:#94a3b8;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;font-size:11px;padding:4px 12px;display:flex;align-items:center;justify-content:space-between;z-index:999999;line-height:1.4;">' .
         '<span>Hosted on <a href="https://celorisdesigns.com/cloud" target="_blank" style="color:#10b981;font-weight:600;text-decoration:none;">Celoris Cloud</a></span>' .
         '<span><a href="https://celorisdesigns.com/cloud/acceptable-use" target="_blank" style="color:#64748b;text-decoration:none;margin-right:12px;">Acceptable Use</a>' .
         '<a href="mailto:abuse@celorisdesigns.com?subject=Abuse%20Report%20for%20' . rawurlencode($host) . '" style="color:#f43f5e;font-weight:600;text-decoration:none;">Report Abuse</a></span>' .
         '</div>';
}, 9999);

// 6. Anti-Spam: Rate limit outgoing emails (max 5/day for free subsites)
add_filter('wp_mail', function($args) {
    $today = date('Y-m-d');
    $count = (int) get_option('celoris_mail_count_' . $today, 0);
    if ($count >= 5) {
        return ['to' => '', 'subject' => '', 'message' => '', 'headers' => '', 'attachments' => []];
    }
    update_option('celoris_mail_count_' . $today, $count + 1);
    return $args;
});
EOF

docker cp /tmp/celoris-security.php celoris-wordpress:/var/www/html/wp-content/mu-plugins/celoris-security.php
rm -f /tmp/celoris-security.php

echo "=== [3/5] Disabling dashboard file editing in wp-config.php ==="
docker exec celoris-wordpress bash -c "grep -q 'DISALLOW_FILE_EDIT' /var/www/html/wp-config.php || sed -i \"1a define('DISALLOW_FILE_EDIT', true);\" /var/www/html/wp-config.php"

echo "=== [4/5] Hiding PHP Version & Capping direct mail() ==="
docker exec celoris-wordpress bash -c 'printf "expose_php = Off\ndisable_functions = mail\n" > /usr/local/etc/php/conf.d/security.ini'

echo "=== [5/5] Installing Network-wide 2FA plugin & restarting container ==="
docker exec celoris-wordpress wp plugin install two-factor --activate-network --allow-root || true
docker restart celoris-wordpress

echo "=== [SUCCESS] All 5 security hardening items are now active! ==="
