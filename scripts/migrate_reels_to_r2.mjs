import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

const ROOT = process.cwd();

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
if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('Missing R2 environment variables');
  process.exit(1);
}

const bucket = R2_BUCKET_NAME.trim();
const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID.trim()}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID.trim(),
    secretAccessKey: R2_SECRET_ACCESS_KEY.trim(),
  },
});

const dataPath = join(ROOT, 'components/lumigram/data/scrapedReelsData.ts');
const content = readFileSync(dataPath, 'utf8');

const urlRegex = /https:\/\/media\.celoris\.in\/reels\/([^"'\s)]+\.(?:mp4|jpg|jpeg|png|webp))/g;
const uniqueUrls = new Set();
let match;
while ((match = urlRegex.exec(content)) !== null) {
  uniqueUrls.add(match[0]);
}

console.log(`Found ${uniqueUrls.size} unique media URLs on media.celoris.in`);

function mapUrlToR2Filename(url) {
  const rel = url.replace('https://media.celoris.in/reels/', '');
  if (rel.startsWith('avatars/')) {
    return 'avatar_' + rel.replace('avatars/', '');
  }
  return rel;
}

async function existsInR2(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  } catch {
    return false;
  }
}

let uploaded = 0;
let skipped = 0;
let failed = 0;

for (const url of uniqueUrls) {
  const filename = mapUrlToR2Filename(url);
  const key = `social/${filename}`;
  const isVideo = filename.endsWith('.mp4');
  const contentType = isVideo ? 'video/mp4' : 'image/jpeg';

  try {
    if (await existsInR2(key)) {
      skipped++;
      continue;
    }

    const res = await fetch(url);
    if (!res.ok) {
      console.error(`❌ Failed to download ${url}: HTTP ${res.status}`);
      failed++;
      continue;
    }
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: buffer,
        ContentType: contentType,
        CacheControl: 'public, max-age=31536000, immutable',
      })
    );
    uploaded++;
    console.log(`✅ Uploaded [${uploaded + skipped}/${uniqueUrls.size}] -> ${key} (${(buffer.length / 1024).toFixed(1)} KB)`);
  } catch (err) {
    console.error(`❌ Error migrating ${url}:`, err.message);
    failed++;
  }
}

console.log(`\nMigration Summary: uploaded=${uploaded}, skipped=${skipped}, failed=${failed}, total=${uniqueUrls.size}`);
if (failed > 0) process.exit(1);
