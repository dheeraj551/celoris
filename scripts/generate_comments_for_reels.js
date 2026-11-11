const fs = require('fs');

const dataset = JSON.parse(fs.readFileSync('dataset_instagram-search-reels_2026-11-06_09-59-13-244.json', 'utf-8'));

// Diverse pool of realistic users with genuine avatars
const COMMENTERS = [
  { id: 'u_c1', username: 'rohit_vfx', name: 'Rohit Sharma', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150', isVerified: false },
  { id: 'u_c2', username: 'priya_edits', name: 'Priya Nair', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', isVerified: true },
  { id: 'u_c3', username: 'arjun_cinematics', name: 'Arjun Verma', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150', isVerified: false },
  { id: 'u_c4', username: 'sneha_creates', name: 'Sneha Patel', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', isVerified: false },
  { id: 'u_c5', username: 'vikram.singh.07', name: 'Vikram Singh', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', isVerified: false },
  { id: 'u_c6', username: 'ananya_reels', name: 'Ananya Roy', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150', isVerified: true },
  { id: 'u_c7', username: 'kabir_visuals', name: 'Kabir Mehta', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', isVerified: false },
  { id: 'u_c8', username: 'tanvi_art', name: 'Tanvi Kapoor', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150', isVerified: false },
  { id: 'u_c9', username: 'sahil_motion', name: 'Sahil Khan', avatar: 'https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150', isVerified: false },
  { id: 'u_c10', username: 'pooja.captures', name: 'Pooja Joshi', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', isVerified: true },
  { id: 'u_c11', username: 'aman_cuts', name: 'Aman Deep', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', isVerified: false },
  { id: 'u_c12', username: 'simran_vibe', name: 'Simran Kaur', avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150', isVerified: false },
  { id: 'u_c13', username: 'dev_media', name: 'Devendra K', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', isVerified: false },
  { id: 'u_c14', username: 'neha_creatives', name: 'Neha Gupta', avatar: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150', isVerified: false },
  { id: 'u_c15', username: 'tushar_vibes', name: 'Tushar Rao', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', isVerified: false },
];

const THEME_COMMENTS = {
  stunt: [
    'Bhai background music kaunsa hai? Pure goosebumps 🔥',
    'Next level control bro, but safety first always! ⚠️',
    'This stunt looks so unreal in slow-mo! 💯',
    'Bhai Nagaur ka swag hi alag hai 💪',
    'Smooth transitions and insane grading! Which camera?',
    'The adrenaline rush in this reel is unmatched ⚡'
  ],
  dance: [
    'Grace and expressions are 10/10! 😍✨',
    'The hook step is literally on loop in my mind 🎶',
    'So clean and effortless! Loved the choreography ❤️',
    'Trending audio pe full justice kiya hai! 🙌',
    'Watching this for the 5th time, energy is contagious 🔥',
    'Drop a tutorial for the transition please! 🙏'
  ],
  comedy: [
    'Relatable max bro 😂💀',
    'Why is this literally me every single morning 😭',
    'Last 3 seconds completely killed me hahaha 🤣',
    'Bro woke up and chose pure entertainment 👏',
    'Showed this to my roommate, we cannot stop laughing 💀',
    'Content quality + humor timing is top tier! 🔥'
  ],
  creative: [
    'Bro the color science in this grade is cinema level 🎥✨',
    'Which software did you edit this in? Premiere or DaVinci?',
    'Sound design carried this clip into another dimension 🎧',
    'Frame rate is butter smooth! 60fps export hits different.',
    'Lighting setup breakdown video upload karo please! 💡',
    'Pure creative inspiration for all mobile creators 🚀'
  ],
  viral: [
    'The algorithm finally brought me to the good side of Pulse! ✨',
    'Deserves 10 Million likes easily, so well made! 💯',
    'Bro dropped a masterpiece casually on our feed 🔥',
    'Can we talk about how good the lighting is here?!',
    'Saved to my favorites collection immediately! 📌',
    'Keep going king/queen, consistency is paying off! 🌟'
  ]
};

const parseTags = (text) => {
  if (!text) return [];
  return Array.from(new Set(
    text.split(/\s+/)
      .filter(w => w.startsWith('#') && w.length > 1)
      .map(w => w.replace(/^#+/, '').replace(/[^\w]/g, '').toLowerCase())
      .filter(Boolean)
  ));
};

const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const generateCommentsForPost = (postId, caption, postDate) => {
  const lower = (caption || '').toLowerCase();
  let theme = 'viral';
  if (lower.includes('stunt') || lower.includes('jeep') || lower.includes('danger') || lower.includes('action')) {
    theme = 'stunt';
  } else if (lower.includes('dance') || lower.includes('song') || lower.includes('music') || lower.includes('step')) {
    theme = 'dance';
  } else if (lower.includes('comedy') || lower.includes('funny') || lower.includes('joke') || lower.includes('relatable') || lower.includes('stickman')) {
    theme = 'comedy';
  } else if (lower.includes('film') || lower.includes('capcut') || lower.includes('edit') || lower.includes('camera') || lower.includes('shot')) {
    theme = 'creative';
  }

  const pool = [...THEME_COMMENTS[theme], ...THEME_COMMENTS.viral];
  const count = 4 + Math.floor(Math.random() * 3); // 4 to 6 comments
  const shuffledUsers = [...COMMENTERS].sort(() => 0.5 - Math.random());
  const comments = [];

  const postTime = new Date(postDate).getTime();
  const now = Date.now();

  for (let i = 0; i < count; i++) {
    const user = shuffledUsers[i % shuffledUsers.length];
    const text = pool[i % pool.length];
    // Dynamic recent times: e.g. 3m, 14m, 45m, 2h, 4h ago
    const minutesAgo = [3, 14, 38, 75, 180, 360][i] || (15 * (i + 1));
    const commentTime = new Date(now - minutesAgo * 60 * 1000).toISOString();

    comments.push({
      id: `c_${postId}_${i + 1}`,
      postId: postId,
      user: {
        id: user.id,
        username: user.username,
        name: user.name,
        avatar: user.avatar,
        bio: 'Creative Member · Celoris Social Cloud',
        isVerified: user.isVerified,
        followersCount: 1200 + Math.floor(Math.random() * 18000),
        followingCount: 150 + Math.floor(Math.random() * 400),
        postsCount: 12 + Math.floor(Math.random() * 50),
        isOnline: Math.random() > 0.4
      },
      text: text,
      createdAt: commentTime,
      likesCount: 14 + Math.floor(Math.random() * 850),
      isLiked: false
    });
  }

  return comments;
};

const posts = dataset.map((item, idx) => {
  const code = item.code || 'reel_' + (idx + 1);
  const user = item.user || {};
  const username = user.username || 'creator_' + code.toLowerCase();
  const name = user.full_name || username;
  const avatar = '/api/social/media/avatar_' + username + '.jpg';

  let captionText = '';
  if (typeof item.caption === 'object' && item.caption !== null) {
    captionText = item.caption.text || '';
  } else if (typeof item.caption === 'string') {
    captionText = item.caption;
  }

  const likesCount = item.like_count || 12000;
  const commentsCount = item.comment_count || 320;
  // Recent creation time so reels look actively trending today/yesterday
  const hoursAgo = 1 + (idx % 24);
  const postCreatedAt = new Date(Date.now() - hoursAgo * 3600 * 1000).toISOString();
  const postId = 'reel_' + code;

  const generatedComments = generateCommentsForPost(postId, captionText, postCreatedAt);

  return {
    id: postId,
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
    images: ['/api/social/media/' + code + '.mp4'],
    thumbnail: '/api/social/media/' + code + '_thumb.jpg',
    mediaType: 'video',
    aspectRatio: '9:16',
    caption: captionText.trim(),
    likesCount: likesCount,
    commentsCount: commentsCount,
    createdAt: postCreatedAt,
    tags: parseTags(captionText),
    isLiked: false,
    isSaved: false,
    comments: generatedComments,
  };
});

const tsContent = 'import { Post } from "../types";\n\n' +
  '// 39 Trending Viral Reels hosted on Cloudflare R2 (/api/social/media/)\n' +
  '// With automated realistic contextual comments & engagement\n' +
  'export const SCRAPED_VIRAL_REELS: Post[] = ' + JSON.stringify(posts, null, 2) + ';\n';

fs.writeFileSync('components/lumigram/data/scrapedReelsData.ts', tsContent, 'utf-8');
console.log(`[SUCCESS] Populated comments across all ${posts.length} reels!`);
