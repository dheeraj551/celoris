// Uploads the ViO Studio "Explore Templates" media to Cloudflare R2.
//
// Run once from the celoris folder (and again whenever you add/replace a file):
//   node scripts/upload-vio-templates.mjs
//
// Reads the R2_* values from .env.local (they never leave your computer) and
// uploads every file in new_higgs/upload/ to  <bucket>/public/vio-templates/.
// The website serves them through /api/media/vio-templates/<file>.

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const ROOT = process.cwd();
const SOURCE_DIR = join(ROOT, 'new_higgs', 'upload');
const PREFIX = 'public/vio-templates/';

function loadEnvFile(file) {
  if (!existsSync(file)) return;
  for (const raw of readFileSync(file, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq < 0) continue;
    const key = line.slice(0, eq).trim().replace(/^export\s+/, '');
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
}

loadEnvFile(join(ROOT, '.env.local'));
loadEnvFile(join(ROOT, '.env'));

const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET_NAME } = process.env;
const missing = ['R2_ACCOUNT_ID', 'R2_ACCESS_KEY_ID', 'R2_SECRET_ACCESS_KEY', 'R2_BUCKET_NAME'].filter(
  (k) => !process.env[k]
);
if (missing.length) {
  console.error(`Missing in .env.local: ${missing.join(', ')}`);
  process.exit(1);
}
if (!existsSync(SOURCE_DIR)) {
  console.error(`Folder not found: ${SOURCE_DIR}`);
  process.exit(1);
}

const TYPES = {
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

const client = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID.trim()}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID.trim(), secretAccessKey: R2_SECRET_ACCESS_KEY.trim() },
});
const Bucket = R2_BUCKET_NAME.trim();

const files = readdirSync(SOURCE_DIR).filter((f) => {
  const p = join(SOURCE_DIR, f);
  return statSync(p).isFile() && TYPES[extname(f).toLowerCase()];
});

if (!files.length) {
  console.log('Nothing to upload.');
  process.exit(0);
}

let ok = 0;
for (const name of files) {
  const body = readFileSync(join(SOURCE_DIR, name));
  const Key = PREFIX + name;
  try {
    await client.send(
      new PutObjectCommand({
        Bucket,
        Key,
        Body: body,
        ContentType: TYPES[extname(name).toLowerCase()],
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );
    const head = await client.send(new HeadObjectCommand({ Bucket, Key }));
    console.log(`✓ ${Key}  (${(head.ContentLength / 1024).toFixed(0)} KB)`);
    ok++;
  } catch (err) {
    console.error(`✗ ${Key}: ${err?.name || ''} ${err?.message || err}`);
  }
}

console.log(`\n${ok}/${files.length} files uploaded to R2 (${Bucket}/${PREFIX}).`);
process.exit(ok === files.length ? 0 : 1);
