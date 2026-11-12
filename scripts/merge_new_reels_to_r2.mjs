import fs from 'fs';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

dotenv.config({ path: '.env.local' });

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_BUCKET_NAME) {
  console.error('Missing R2 env vars in .env.local');
  process.exit(1);
}

const s3 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

async function existsInR2(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function uploadToR2(sourceUrl, key, contentType) {
  if (!sourceUrl) return false;
  if (await existsInR2(key)) return 'skipped';

  const res = await fetch(sourceUrl, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  });
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} downloading ${sourceUrl.slice(0, 80)}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
      Body: buf,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    })
  );
  return `uploaded (${(buf.length / 1024).toFixed(1)} KB)`;
}

const COMMENTERS = [
  { id: 'u_c1', username: 'rohit_vfx', name: 'Rohit Sharma', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', isVerified: false },
  { id: 'u_c2', username: 'priya_edits', name: 'Priya Nair', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', isVerified: true },
  { id: 'u_c3', username: 'arjun_cinematics', name: 'Arjun Verma', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', isVerified: false },
  { id: 'u_c4', username: 'sneha_creates', name: 'Sneha Patel', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', isVerified: false },
  { id: 'u_c5', username: 'vikram.singh.07', name: 'Vikram Singh', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', isVerified: false },
  { id: 'u_c6', username: 'ananya_reels', name: 'Ananya Roy', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', isVerified: true },
  { id: 'u_c7', username: 'kabir_visuals', name: 'Kabir Mehta', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', isVerified: false },
  { id: 'u_c8', username: 'tanvi_art', name: 'Tanvi Kapoor', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', isVerified: false },
];

const GENERAL_COMMENTS = [
  'The framing and color grading on this is pure gold! 🔥',
  'Delhi NCR vibes hit different! 🙌',
  'Watched this twice already, super clean edit 💯',
  'Algorithm finally blessed my feed today 🚀',
  'How did you shoot this? Looks so crisp! 📸',
  'Pure energy and storytelling ✨',
];

function parseTags(caption) {
  const tags = [];
  const matches = (caption || '').match(/#[a-zA-Z0-9_]+/g);
  if (matches) {
    matches.slice(0, 6).forEach((m) => tags.push(m.replace('#', '')));
  }
  return tags.length ? tags : ['Trending', 'DelhiNCR', 'Reels'];
}

function generateComments(postId, postCreatedAt) {
  const count = 3 + Math.floor(Math.random() * 3);
  const shuffled = [...COMMENTERS].sort(() => 0.5 - Math.random());
  const comments = [];
  for (let i = 0; i < count; i++) {
    const u = shuffled[i % shuffled.length];
    const text = GENERAL_COMMENTS[(i + Math.floor(Math.random() * GENERAL_COMMENTS.length)) % GENERAL_COMMENTS.length];
    const t = new Date(new Date(postCreatedAt).getTime() + (i + 1) * 14 * 60000).toISOString();
    comments.push({
      id: `c_${postId}_${i + 1}`,
      postId,
      user: {
        id: u.id,
        username: u.username,
        name: u.name,
        avatar: u.avatar,
        bio: 'Creative Member · Celoris Creator Hub',
        isVerified: u.isVerified,
        followersCount: 1200 + Math.floor(Math.random() * 18000),
        followingCount: 150 + Math.floor(Math.random() * 400),
        postsCount: 12 + Math.floor(Math.random() * 50),
        isOnline: Math.random() > 0.4,
      },
      text,
      createdAt: t,
      likesCount: 14 + Math.floor(Math.random() * 500),
      isLiked: false,
    });
  }
  return comments;
}

const newDataset = JSON.parse(fs.readFileSync('dataset_instagram-search-reels_2026-11-12_11-20-45-301.json', 'utf-8'));

// Read existing posts from scrapedReelsData.ts
const existingRaw = fs.readFileSync('components/lumigram/data/scrapedReelsData.ts', 'utf-8');
const startIdx = existingRaw.indexOf('= [') + 2;
const endIdx = existingRaw.lastIndexOf(']');
const existingPosts = JSON.parse(existingRaw.slice(startIdx, endIdx + 1));
const existingIds = new Set(existingPosts.map((p) => p.id));

let uploaded = 0;
let skipped = 0;
let failed = 0;
const newPosts = [];

for (let idx = 0; idx < newDataset.length; idx++) {
  const item = newDataset[idx];
  const code = item.code || `reel_nov12_${idx + 1}`;
  const postId = `reel_${code}`;
  const user = item.user || {};
  const username = (user.username || `creator_${code.toLowerCase()}`).replace(/[^a-zA-Z0-9_.]/g, '_');
  const name = user.full_name || username;

  const videoUrl = item.video_versions?.[0]?.url;
  const thumbUrl = item.image_versions?.items?.[0]?.url || item.image_versions2?.candidates?.[0]?.url;
  const avatarUrl = user.profile_pic_url;

  try {
    const vRes = await uploadToR2(videoUrl, `social/${code}.mp4`, 'video/mp4');
    if (vRes === 'skipped') skipped++; else if (vRes) { uploaded++; console.log(`✅ [${idx + 1}/${newDataset.length}] ${code}.mp4 -> ${vRes}`); }

    const tRes = await uploadToR2(thumbUrl, `social/${code}_thumb.jpg`, 'image/jpeg');
    if (tRes === 'skipped') skipped++; else if (tRes) uploaded++;

    const aRes = await uploadToR2(avatarUrl, `social/avatar_${username}.jpg`, 'image/jpeg');
    if (aRes === 'skipped') skipped++; else if (aRes) uploaded++;
  } catch (err) {
    failed++;
    console.warn(`❌ Failed media for ${code}: ${err.message}`);
    continue;
  }

  if (existingIds.has(postId)) {
    continue;
  }

  let captionText = '';
  if (typeof item.caption === 'object' && item.caption !== null) {
    captionText = item.caption.text || '';
  } else if (typeof item.caption === 'string') {
    captionText = item.caption;
  }

  const likesCount = item.like_count || 12000;
  const commentsCount = item.comment_count || 320;
  const hoursAgo = 1 + (idx % 24);
  const postCreatedAt = new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();

  newPosts.push({
    id: postId,
    userId: `user_${username}`,
    user: {
      id: `user_${username}`,
      username,
      name,
      avatar: `/api/social/media/avatar_${username}.jpg`,
      bio: 'Digital Creator · Featured on Celoris Creator Hub',
      isVerified: Boolean(user.is_verified || likesCount > 50000),
      followersCount: Math.max(Math.floor(likesCount * 0.45), 1800),
      followingCount: 160,
      postsCount: 32,
      isOnline: true,
    },
    images: [`/api/social/media/${code}.mp4`],
    thumbnail: `/api/social/media/${code}_thumb.jpg`,
    mediaType: 'video',
    aspectRatio: '9:16',
    caption: captionText.trim(),
    likesCount,
    commentsCount,
    createdAt: postCreatedAt,
    tags: parseTags(captionText),
    isLiked: false,
    isSaved: false,
    comments: generateComments(postId, postCreatedAt),
  });
}

const merged = [...newPosts, ...existingPosts];
const tsContent =
  'import { Post } from "../types";\n\n' +
  `// ${merged.length} Trending Viral Reels hosted on Cloudflare R2 (/api/social/media/)\n` +
  '// With automated realistic contextual comments & engagement\n' +
  'export const SCRAPED_VIRAL_REELS: Post[] = ' +
  JSON.stringify(merged, null, 2) +
  ';\n';

fs.writeFileSync('components/lumigram/data/scrapedReelsData.ts', tsContent, 'utf-8');
console.log(`Done! R2 uploaded=${uploaded}, skipped=${skipped}, failed=${failed}. Merged total=${merged.length} (${newPosts.length} new + ${existingPosts.length} existing).`);
