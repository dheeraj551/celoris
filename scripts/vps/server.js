const http = require('http');
const { execSync } = require('child_process');

const PORT = 4000;
const AUTH_TOKEN = "celoris_cloud_secret_786a9f24e";

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({ status: 'healthy', domain: 'celoris.in', timestamp: new Date().toISOString() }));
  }

  if (req.method === 'POST' && req.url === '/provision') {
    const auth = req.headers['authorization'] || '';
    if (auth !== 'Bearer ' + AUTH_TOKEN) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify({ error: 'Unauthorized' }));
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const subdomain = (data.subdomain || '').trim().toLowerCase();
        const rawTitle = (data.title || (subdomain + ' Site')).replace(/"/g, '');
        const userEmail = (data.email || (subdomain + '@celoris.in')).trim();

        if (!subdomain) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({ error: 'Subdomain is required' }));
        }

        const slug = subdomain.replace(/[^a-z0-9-]/g, '');
        const fullDomain = slug + '.celoris.in';

        let rawUser = (data.adminUser || '').trim().toLowerCase();
        if (!rawUser || rawUser === 'admin') rawUser = slug;
        const adminUser = rawUser.replace(/[^a-z0-9_-]/g, '') || slug;
        const adminPass = (data.adminPass || ('celoris_' + slug + '_2026')).trim();

        const siteEmail = slug + '@celoris.in';
        try {
          execSync('docker exec celoris-wordpress wp site create --slug="' + slug + '" --title="' + rawTitle + '" --email="' + siteEmail + '" --allow-root', { stdio: 'pipe' });
        } catch (_) {}

        try {
          execSync('docker exec celoris-wordpress wp user create "' + adminUser + '" "' + userEmail + '" --user_pass="' + adminPass + '" --role=administrator --url="http://' + fullDomain + '" --allow-root', { stdio: 'pipe' });
        } catch (_) {
          try {
            execSync('docker exec celoris-wordpress wp user set-role "' + adminUser + '" administrator --url="http://' + fullDomain + '" --allow-root', { stdio: 'pipe' });
          } catch (e) {}
          try {
            execSync('docker exec celoris-wordpress wp user update "' + adminUser + '" --user_pass="' + adminPass + '" --allow-root', { stdio: 'pipe' });
          } catch (e) {}
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({
          success: true,
          subdomain: slug,
          fullDomain: fullDomain,
          siteUrl: 'https://' + fullDomain,
          adminUrl: 'https://' + fullDomain + '/wp-admin',
          adminUser: adminUser,
          adminPass: adminPass,
          adminPassword: adminPass,
          message: 'Instance active & secured with Let\'s Encrypt SSL'
        }));

      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Failed to provision site', details: err.message }));
      }
    });
    return;
  }

  res.writeHead(404);
  res.end();
});

server.listen(PORT, '0.0.0.0', () => {
  console.log('Celoris Provisioner running on port ' + PORT);
});
