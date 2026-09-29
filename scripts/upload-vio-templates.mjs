// Uploads the site's showcase media to Cloudflare R2.
//
// Run from the celoris folder (again whenever you add/replace a file):
//   node scripts/upload-vio-templates.mjs
//
// Reads the R2_* values from .env.local (they never leave your computer) and
// uploads:
//   new_higgs/upload/    → <bucket>/public/vio-templates/   (ViO Studio templates,
//                          served by /api/media/vio-templates/<file>)
//   new_higgs/showcase/  → <bucket>/public/showcase/        (homepage videos,
//                          served by /api/media/showcase/<file>)

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const ROOT = process.cwd();
const SOURCES = [
  { dir: join(ROOT, 'new_higgs', 'upload'), prefix: 'public/vio-templates/' },
  { dir: join(ROOT, 'new_higgs', 'showcase'), prefix: 'public/showcase/' },
];

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

// Upload files that are new or changed (same size already in R2 = skipped).
let ok = 0;
let skipped = 0;
let failed = 0;
for (const { dir, prefix } of SOURCES) {
  if (!existsSync(dir)) continue;
  const files = readdirSync(dir).filter((f) => {
    const p = join(dir, f);
    return statSync(p).isFile() && TYPES[extname(f).toLowerCase()];
  });
  for (const name of files) {
    const path = join(dir, name);
    const Key = prefix + name;
    const size = statSync(path).size;
    try {
      const existing = await client.send(new HeadObjectCommand({ Bucket, Key })).catch(() => null);
      if (existing && existing.ContentLength === size) {
        skipped++;
        continue;
      }
      await client.send(
        new PutObjectCommand({
          Bucket,
          Key,
          Body: readFileSync(path),
          ContentType: TYPES[extname(name).toLowerCase()],
          CacheControl: 'public, max-age=31536000, immutable',
        })
      );
      const head = await client.send(new HeadObjectCommand({ Bucket, Key }));
      console.log(`✓ ${Key}  (${(head.ContentLength / 1024).toFixed(0)} KB)`);
      ok++;
    } catch (err) {
      console.error(`✗ ${Key}: ${err?.name || ''} ${err?.message || err}`);
      failed++;
    }
  }
}

console.log(`\nUploaded ${ok}, already up to date ${skipped}, failed ${failed} (bucket: ${Bucket}).`);
process.exit(failed ? 1 : 0);
