const fs = require('fs');

const dataset = JSON.parse(fs.readFileSync('dataset_instagram-search-reels_2026-11-06_09-59-13-244.json', 'utf-8'));

const parseTags = (text) => {
  if (!text) return [];
  return Array.from(new Set(
    text.split(/\s+/)
      .filter(w => w.startsWith('#') && w.length > 1)
      .map(w => w.replace(/^#+/, '').replace(/[^\w]/g, '').toLowerCase())
      .filter(Boolean)
  ));
};

const posts = dataset.map((item, idx) => {
  const code = item.code || 'reel_' + (idx + 1);
  const user = item.user || {};
  const username = user.username || 'creator_' + code.toLowerCase();
  const name = user.full_name || username;
  const avatar = 'https://media.celoris.in/reels/avatars/' + username + '.jpg';
  const remoteAvatar = user.profile_pic_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150';

  let captionText = '';
  if (typeof item.caption === 'object' && item.caption !== null) {
    captionText = item.caption.text || '';
  } else if (typeof item.caption === 'string') {
    captionText = item.caption;
  }

  const likesCount = item.like_count || 12000;
  const commentsCount = item.comment_count || 320;
  const timestamp = item.device_timestamp || item.taken_at || Math.floor(Date.now() / 1000);

  return {
    id: 'reel_' + code,
    userId: 'user_' + username,
    user: {
      id: 'user_' + username,
      username: username,
      name: name,
      avatar: avatar,
      bio: 'Digital Creator · Featured on Celoris Pulse',
      isVerified: user.is_verified || likesCount > 50000,
      followersCount: Math.max(Math.floor(likesCount * 0.45), 1800),
      followingCount: 160,
      postsCount: 32,
      isOnline: true,
    },
    images: ['https://media.celoris.in/reels/' + code + '.mp4'],
    thumbnail: 'https://media.celoris.in/reels/' + code + '_thumb.jpg',
    mediaType: 'video',
    aspectRatio: '9:16',
    caption: captionText.trim(),
    likesCount: likesCount,
    commentsCount: commentsCount,
    createdAt: new Date(timestamp < 1e11 ? timestamp * 1000 : timestamp).toISOString(),
    tags: parseTags(captionText),
    isLiked: false,
    isSaved: false,
    comments: [],
  };
});

const tsContent = 'import { Post } from "../types";\n\n' +
  '// 39 Trending Viral Reels downloaded and hosted on VPS (https://media.celoris.in/reels/)\n' +
  'export const SCRAPED_VIRAL_REELS: Post[] = ' + JSON.stringify(posts, null, 2) + ';\n';

fs.writeFileSync('components/lumigram/data/scrapedReelsData.ts', tsContent, 'utf-8');
console.log('Successfully generated components/lumigram/data/scrapedReelsData.ts with ' + posts.length + ' reels!');
