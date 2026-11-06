#!/usr/bin/env node

/**
 * Celoris Social Cloud - Instagram Reels Importer & VPS Media Downloader (Node.js)
 * ==============================================================================
 * Reads the Apify dataset JSON, downloads all 9:16 MP4 video files, cover thumbnails,
 * and creator avatars directly to your VPS / local media folder, and produces a
 * ready-to-use Celoris Pulse manifest.
 *
 * Usage:
 *   node scripts/download_reels_to_vps.js
 *   node scripts/download_reels_to_vps.js --output /var/www/celoris/media/reels --base-url https://media.celoris.in/reels
 *   node scripts/download_reels_to_vps.js --max 5 (for quick test)
 */

const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const { finished } = require('stream/promises');

// Parse CLI arguments
const args = process.argv.slice(2);
function getArg(flag, defaultValue) {
  const idx = args.indexOf(flag);
  if (idx !== -1 && args[idx + 1]) return args[idx + 1];
  return defaultValue;
}

const inputArg = getArg('--input', '');
const outputDirArg = getArg('--output', './public/media/reels');
const baseUrlArg = getArg('--base-url', '/media/reels');
const maxArg = parseInt(getArg('--max', '0'), 10);

// Find input dataset
function findDataset() {
  if (inputArg && fs.existsSync(inputArg)) return inputArg;
  const files = fs.readdirSync(process.cwd());
  const found = files.find(f => f.startsWith('dataset_instagram-search-reels') && f.endsWith('.json'));
  if (found) return found;
  const anyDataset = files.find(f => f.startsWith('dataset_') && f.endsWith('.json'));
  return anyDataset || null;
}

const inputFile = findDataset();
if (!inputFile) {
  console.error('\n❌ ERROR: No Apify dataset JSON file found in this directory.');
  console.error('Usage: node scripts/download_reels_to_vps.js --input <filename.json>\n');
  process.exit(1);
}

const targetDir = path.resolve(process.cwd(), outputDirArg);
const avatarsDir = path.join(targetDir, 'avatars');

fs.mkdirSync(targetDir, { recursive: true });
fs.mkdirSync(avatarsDir, { recursive: true });

async function downloadFile(url, destPath, label = '') {
  if (!url) return false;
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1024) {
    console.log(`  [SKIPPED - Already exists]: ${path.basename(destPath)}`);
    return true;
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
          'Accept': '*/*',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} ${response.statusText}`);
      }

      const fileStream = fs.createWriteStream(destPath);
      await finished(Readable.fromWeb(response.body).pipe(fileStream));
      const sizeMB = (fs.statSync(destPath).size / (1024 * 1024)).toFixed(2);
      console.log(`  [DOWNLOADED]: ${path.basename(destPath)} (${sizeMB} MB)`);
      return true;
    } catch (err) {
      if (attempt < 3) {
        await new Promise(r => setTimeout(r, 1200));
      } else {
        console.error(`  [FAILED]: ${label || path.basename(destPath)} - ${err.message}`);
        if (fs.existsSync(destPath)) {
          try { fs.unlinkSync(destPath); } catch {}
        }
        return false;
      }
    }
  }
  return false;
}

function parseHashtags(text) {
  if (!text) return [];
  const words = text.split(/\s+/);
  const tags = words
    .filter(w => w.startsWith('#') && w.length > 1)
    .map(w => w.replace(/^#+/, '').replace(/[^\w]/g, '').toLowerCase())
    .filter(Boolean);
  return Array.from(new Set(tags));
}

async function run() {
  console.log('\n=======================================================');
  console.log('  CELORIS SOCIAL CLOUD - REELS VPS MEDIA DOWNLOADER');
  console.log('=======================================================');
  console.log(`Input Dataset   : ${inputFile}`);
  console.log(`Output Directory: ${targetDir}`);
  console.log(`Public Base URL : ${baseUrlArg}`);
  console.log('=======================================================\n');

  const raw = fs.readFileSync(inputFile, 'utf-8');
  const items = JSON.parse(raw);
  const toProcess = maxArg > 0 ? items.slice(0, maxArg) : items;

  console.log(`Loaded ${items.length} reels from dataset. Downloading ${toProcess.length} items...\n`);

  const celorisPosts = [];
  let downloadedCount = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const item = toProcess[i];
    const code = item.code || `reel_${i + 1}`;
    const videoUrl = item.video_url;
    const thumbUrl = item.thumbnail_url || item.image_versions2?.candidates?.[0]?.url;

    const userObj = item.user || {};
    const username = userObj.username || `creator_${code.toLowerCase()}`;
    const fullName = userObj.full_name || username;
    const profilePicUrl = userObj.profile_pic_url;

    let captionText = '';
    if (typeof item.caption === 'object' && item.caption !== null) {
      captionText = item.caption.text || '';
    } else if (typeof item.caption === 'string') {
      captionText = item.caption;
    }

    const likesCount = item.like_count || 0;
    const commentsCount = item.comment_count || 0;
    const playCount = item.play_count || 0;
    const timestamp = item.device_timestamp || item.taken_at || Math.floor(Date.now() / 1000);

    console.log(`[${i + 1}/${toProcess.length}] Processing @${username} (Code: ${code})...`);

    // 1. Download Video (.mp4)
    const videoFilename = `${code}.mp4`;
    const videoPath = path.join(targetDir, videoFilename);
    const videoOk = await downloadFile(videoUrl, videoPath, `Video ${videoFilename}`);

    // 2. Download Thumbnail (.jpg)
    const thumbFilename = `${code}_thumb.jpg`;
    const thumbPath = path.join(targetDir, thumbFilename);
    if (thumbUrl) {
      await downloadFile(thumbUrl, thumbPath, `Thumb ${thumbFilename}`);
    }

    // 3. Download Avatar (.jpg)
    const avatarFilename = `${username}.jpg`;
    const avatarPath = path.join(avatarsDir, avatarFilename);
    let publicAvatarUrl = `${baseUrlArg.replace(/\/$/, '')}/avatars/${avatarFilename}`;
    if (profilePicUrl) {
      const avatarOk = await downloadFile(profilePicUrl, avatarPath, `Avatar ${avatarFilename}`);
      if (!avatarOk) publicAvatarUrl = profilePicUrl;
    }

    const cleanBase = baseUrlArg.replace(/\/$/, '');
    const publicVideoUrl = `${cleanBase}/${videoFilename}`;
    const publicThumbUrl = `${cleanBase}/${thumbFilename}`;

    celorisPosts.push({
      id: `post_reel_${code}`,
      userId: `user_${username}`,
      user: {
        id: `user_${username}`,
        username: username,
        name: fullName,
        avatar: publicAvatarUrl,
        bio: 'Digital Creator · Featured on Celoris Pulse',
        isVerified: userObj.is_verified || likesCount > 50000,
        followersCount: Math.max(Math.floor(likesCount * 0.45), 1500),
        followingCount: 160,
        postsCount: 28,
        isOnline: true,
      },
      images: [publicVideoUrl],
      thumbnail: publicThumbUrl,
      mediaType: 'video',
      aspectRatio: '9:16',
      caption: captionText.trim(),
      likesCount,
      commentsCount,
      playCount,
      createdAt: new Date(timestamp < 1e11 ? timestamp * 1000 : timestamp).toISOString(),
      tags: parseHashtags(captionText),
      isLiked: false,
      isSaved: false,
      comments: [],
    });

    if (videoOk) downloadedCount++;
  }

  // Save JSON Manifest
  const manifestPath = path.join(targetDir, 'celoris_reels_manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(celorisPosts, null, 2), 'utf-8');

  console.log('\n=======================================================');
  console.log('  DOWNLOAD COMPLETE! 🎉');
  console.log('=======================================================');
  console.log(`Successfully downloaded: ${downloadedCount} / ${toProcess.length} videos`);
  console.log(`Local Media Directory  : ${targetDir}`);
  console.log(`Manifest File          : ${manifestPath}`);
  console.log('=======================================================\n');
}

run().catch(err => {
  console.error('Fatal error during download:', err);
  process.exit(1);
});
