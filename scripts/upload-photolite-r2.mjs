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
  console.error('Missing R2 environment variables in .env.local');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID.trim()}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID.trim(), secretAccessKey: R2_SECRET_ACCESS_KEY.trim() },
});

const zipPath = 'E:\\Celoris\\photolite-desktop\\dist\\PhotoLite-Windows-x64.zip';
if (!existsSync(zipPath)) {
  console.error('Zip file not found at:', zipPath);
  process.exit(1);
}

const key = 'software/photolite/PhotoLite-Windows-x64.zip';
const fileBuffer = readFileSync(zipPath);
console.log(`Uploading ${zipPath} (${(fileBuffer.length / (1024 * 1024)).toFixed(2)} MB) to R2 bucket: ${R2_BUCKET_NAME}, key: ${key}...`);

try {
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME.trim(),
      Key: key,
      Body: fileBuffer,
      ContentType: 'application/zip',
      ContentDisposition: 'attachment; filename="PhotoLite-Windows-x64.zip"',
    })
  );
  console.log('Upload to Cloudflare R2 successful!');

  // Verify
  const head = await s3.send(
    new HeadObjectCommand({
      Bucket: R2_BUCKET_NAME.trim(),
      Key: key,
    })
  );
  console.log(`Verified in R2: Size = ${head.ContentLength} bytes, ETag = ${head.ETag}`);
} catch (err) {
  console.error('Error uploading to R2:', err);
  process.exit(1);
}
