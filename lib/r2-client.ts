import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Cloudflare R2 storage — used for Celoris 3D's private assets (3D models,
// textures, and anything else that shouldn't share Supabase Storage).
// R2 speaks the S3 API, so this is just an S3Client pointed at R2's
// account-specific endpoint. This bucket is private (no public read policy),
// so every access — upload and download — goes through a short-lived
// signed URL rather than a plain public URL.
//
// Mirrors the singleton + "throw on missing env var" pattern already used
// in lib/supabase-client.ts.

let r2Client: S3Client | null = null

function getR2Client(): S3Client {
  if (r2Client) return r2Client

  const accountId = process.env.R2_ACCOUNT_ID
  const accessKeyId = process.env.R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'Missing R2 environment variables — check R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY in .env.local'
    )
  }

  r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId.trim()}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: accessKeyId.trim(),
      secretAccessKey: secretAccessKey.trim(),
    },
  })

  return r2Client
}

export function getR2BucketName(): string {
  const bucket = process.env.R2_BUCKET_NAME
  if (!bucket) {
    throw new Error('Missing R2_BUCKET_NAME environment variable — check .env.local')
  }
  return bucket.trim()
}

/**
 * A signed URL the BROWSER can PUT a file to directly, bypassing our own
 * server (same reasoning as the café-radio mp3 upload fix: the file's bytes
 * never pass through our Next.js server or its request-size limit).
 */
export async function createR2SignedUploadUrl(
  key: string,
  contentType: string,
  expiresInSeconds = 300
): Promise<string> {
  const client = getR2Client()
  const command = new PutObjectCommand({
    Bucket: getR2BucketName(),
    Key: key,
    ContentType: contentType,
  })
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds })
}

/**
 * A signed URL for reading a private object. Since the bucket has no public
 * read policy, this is the only way anything (a browser, an <a> tag, a
 * <model-viewer>) can ever load a file back out of it — and it expires.
 */
export async function createR2SignedReadUrl(
  key: string,
  expiresInSeconds = 3600,
  responseContentDisposition?: string
): Promise<string> {
  const client = getR2Client()
  const command = new GetObjectCommand({
    Bucket: getR2BucketName(),
    Key: key,
    ...(responseContentDisposition ? { ResponseContentDisposition: responseContentDisposition } : {}),
  })
  return getSignedUrl(client, command, { expiresIn: expiresInSeconds })
}

/** Small server-side writes (metadata, tiny files) that don't need a signed upload URL. */
export async function putR2Object(
  key: string,
  body: Buffer | Uint8Array | string,
  contentType: string
): Promise<void> {
  const client = getR2Client()
  await client.send(
    new PutObjectCommand({
      Bucket: getR2BucketName(),
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  )
}

export async function deleteR2Object(key: string): Promise<void> {
  const client = getR2Client()
  await client.send(new DeleteObjectCommand({ Bucket: getR2BucketName(), Key: key }))
}
