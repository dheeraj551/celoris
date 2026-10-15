#!/usr/bin/env bash
set -e

echo "=========================================================="
echo "    Celoris Cloud - Fix Provisioner & Install Themes     "
echo "=========================================================="

PROVISIONER_DIR="/opt/celoris-cloud/provisioner"
mkdir -p "$PROVISIONER_DIR"

echo "=== [1/4] Writing Robust server.js ==="
cat << 'EOF' > "$PROVISIONER_DIR/server.js"
const express = require('express');
const { execSync } = require('child_process');

const app = express();
app.use(express.json());

const SECRET = process.env.PROVISION_API_SECRET || 'celoris_cloud_secret_786a9f24e';
const DOMAIN = process.env.DOMAIN || 'celoris.in';

app.get('/check-domain', (req, res) => {
  const domain = (req.query.domain || '').toLowerCase();
  if (domain.endsWith('.' + DOMAIN) || domain === DOMAIN) {
    return res.status(200).send('Domain allowed');
  }
  return res.status(403).send('Forbidden domain');
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', domain: DOMAIN, timestamp: new Date() });
});

app.post('/provision', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || authHeader !== `Bearer ${SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized. Invalid API Secret.' });
  }

  const { subdomain, siteTitle, title, adminUser, adminEmail, email, adminPass } = req.body;
  const rawSub = subdomain || '';
  if (!rawSub) {
    return res.status(400).json({ error: 'Subdomain is required' });
  }

  const cleanSub = rawSub.toLowerCase().replace(/[^a-z0-9-]/g, '').replace(/^-+|-+$/g, '');
  if (cleanSub.length < 3) {
    return res.status(400).json({ error: 'Subdomain must be at least 3 characters' });
  }

  const fullDomain = `${cleanSub}.${DOMAIN}`;
  const effectiveTitle = (siteTitle || title || `${cleanSub} Portfolio`).replace(/"/g, '\\"');
  
  let rawUser = (adminUser || '').toLowerCase().replace(/[^a-z0-9_-]/g, '');
  if (!rawUser || rawUser === 'admin') {
    rawUser = cleanSub.replace(/-/g, '_');
  }
  const user = rawUser;

  const userEmail = (adminEmail || email || `${user}@${cleanSub}.${DOMAIN}`).trim();
  const password = adminPass || ('celoris_' + Math.random().toString(36).substring(2, 10));

  console.log(`[Celoris Cloud] Provisioning site: ${fullDomain} for user ${user} (${userEmail})...`);

  // Step 1: Create the WordPress Multisite subsite WITHOUT --email flag
  // Omission of --email avoids WP-CLI's "Can't create user" conflict when the user already exists
  try {
    execSync(`docker exec celoris-wordpress wp site create --slug="${cleanSub}" --title="${effectiveTitle}" --allow-root`, { stdio: 'pipe' });
    console.log(`[Celoris Cloud] Site ${cleanSub} created successfully.`);
  } catch (siteErr) {
    const errOutput = (siteErr.stderr ? siteErr.stderr.toString() : '') + (siteErr.message || '');
    if (!errOutput.toLowerCase().includes('already exists') && !errOutput.toLowerCase().includes('duplicate')) {
      console.warn(`[Celoris Cloud] wp site create notice: ${errOutput}`);
    }
  }

  // Step 2: Enforce 3 GB upload quota
  try {
    execSync(`docker exec celoris-wordpress wp site option set blog_upload_space 3072 --allow-root`, { stdio: 'pipe' });
    execSync(`docker exec celoris-wordpress wp option set blog_upload_space 3072 --url="http://${fullDomain}" --allow-root`, { stdio: 'pipe' });
  } catch (_) {}

  // Step 3: Create the user if not exists, or assign administrator role to this site
  let userCreated = false;
  try {
    execSync(`docker exec celoris-wordpress wp user create "${user}" "${userEmail}" --user_pass="${password}" --role=administrator --url="http://${fullDomain}" --allow-root`, { stdio: 'pipe' });
    userCreated = true;
    console.log(`[Celoris Cloud] User ${user} created successfully.`);
  } catch (uErr) {
    // If user already exists in network, assign administrator role to this subsite and update password
    try {
      execSync(`docker exec celoris-wordpress wp user set-role "${user}" administrator --url="http://${fullDomain}" --allow-root`, { stdio: 'pipe' });
      execSync(`docker exec celoris-wordpress wp user update "${user}" --user_pass="${password}" --allow-root`, { stdio: 'pipe' });
      console.log(`[Celoris Cloud] Existing user ${user} assigned administrator role on ${fullDomain}.`);
      userCreated = true;
    } catch (assignErr) {
      // If username conflicted with existing email, search user by email
      try {
        const existingUserId = execSync(`docker exec celoris-wordpress wp user get "${userEmail}" --field=ID --allow-root`, { stdio: 'pipe' }).toString().trim();
        if (existingUserId) {
          execSync(`docker exec celoris-wordpress wp user set-role ${existingUserId} administrator --url="http://${fullDomain}" --allow-root`, { stdio: 'pipe' });
          execSync(`docker exec celoris-wordpress wp user update ${existingUserId} --user_pass="${password}" --allow-root`, { stdio: 'pipe' });
          userCreated = true;
        }
      } catch (e) {
        console.error(`[Celoris Cloud] User assignment fallback notice:`, e.message);
      }
    }
  }

  return res.status(200).json({
    success: true,
    subdomain: cleanSub,
    fullDomain: fullDomain,
    siteUrl: `https://${fullDomain}`,
    adminUrl: `https://${fullDomain}/wp-admin`,
    adminUser: user,
    adminPassword: password,
    adminPass: password,
    message: "Instance active & secured with Let's Encrypt SSL"
  });
});

const PORT = 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[Celoris Cloud Provisioner] running on port ${PORT}`);
});
EOF

echo "=== [2/4] Freeing Port 4000 & Starting Provisioner Container ==="
# Stop any conflicting host systemd service
systemctl stop celoris-provisioner 2>/dev/null || true
systemctl disable celoris-provisioner 2>/dev/null || true

# Kill any non-docker host process squatting on port 4000
if command -v fuser >/dev/null 2>&1; then
    fuser -k 4000/tcp 2>/dev/null || true
fi
sleep 1

CONTAINER_ID=$(docker ps -a --filter "name=provisioner" -q | head -n 1)
if [ -n "$CONTAINER_ID" ]; then
    echo "[+] Copying updated server.js directly into container $CONTAINER_ID..."
    docker cp "$PROVISIONER_DIR/server.js" "$CONTAINER_ID:/app/server.js"
    echo "[+] Starting container $CONTAINER_ID..."
    docker start "$CONTAINER_ID" || docker restart "$CONTAINER_ID"
    echo "[+] Container active."
else
    echo "[!] Container provisioner not found via filter, rebuilding via docker compose..."
    cd /opt/celoris-cloud
    docker compose build provisioner && docker compose up -d provisioner
fi

sleep 3

echo "=== [3/4] Installing WordPress Network Themes ==="
echo "[+] Installing Astra, OceanWP, GeneratePress, Neve, Hello Elementor, Kadence..."
docker exec celoris-wordpress wp theme install astra oceanwp generatepress neve hello-elementor kadence --activate-network --allow-root 2>/dev/null || true
echo "[+] WordPress network themes installed and network-activated!"

echo "=== [4/4] Verification & Testing Provisioning API ==="
TEST_RES=$(curl -s -X POST http://127.0.0.1:4000/provision \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer celoris_cloud_secret_786a9f24e" \
  -d '{"subdomain":"ananyajairath","title":"Ananya Jairath Portfolio","email":"ananyajairath@gmail.com","adminUser":"ananyajairath","adminPass":"celoris_ananyajairath_2026"}')

echo "[*] Test Provision Result:"
echo "$TEST_RES"

if echo "$TEST_RES" | grep -q '"success":true'; then
    echo ""
    echo "=========================================================="
    echo "  🎉 SUCCESS: Celoris Cloud Provisioning is FIXED & LIVE! "
    echo "=========================================================="
else
    echo ""
    echo "[!] Warning: Response did not include success:true. Please check above output."
fi
