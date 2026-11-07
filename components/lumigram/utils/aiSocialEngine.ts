import { Post, User } from '../types';

/**
 * AI Smart Suggestions generator tailored to post content, tags, and niche
 */
export function getAiCommentSuggestions(post: Post): string[] {
  const text = `${post.caption} ${(post.tags || []).join(' ')}`.toLowerCase();

  if (text.includes('stickman') || text.includes('comedy') || text.includes('relatable') || text.includes('1760')) {
    return [
      'Relatable max bro 😂💀',
      'Stickman animated this too well 😭',
      'Need Part 2 ASAP! 🚀',
      'Audio sync is 10/10 🎧',
    ];
  }

  if (text.includes('camera') || text.includes('iphone') || text.includes('capcut') || text.includes('mobilefilmmaking')) {
    return [
      'What camera settings did you use? 📱',
      'The lighting setup is pure genius ✨',
      'Color grading looks cinematic 🎥',
      'Drop the full tutorial please! ⚡',
    ];
  }

  if (text.includes('dance') || text.includes('trending') || text.includes('songs') || text.includes('vibe')) {
    return [
      'Clean moves and energy! 🔥',
      'What is the song name? 🎧',
      'Replaying this on loop 🔁',
      'Transitions are buttery smooth ✨',
    ];
  }

  if (text.includes('stunt') || text.includes('jeep') || text.includes('thar') || text.includes('drift')) {
    return [
      'Pure adrenaline rush! 🔥',
      'Drone shot angle is insane 🚁',
      'What speed was that? ⚡',
      'Cinematography is next level 🏎️',
    ];
  }

  if (text.includes('marketing') || text.includes('agency') || text.includes('leads') || text.includes('ads')) {
    return [
      'This hook angle makes total sense 💡',
      'What was the exact CPC drop? 📈',
      'Testing this in our campaign today 🚀',
      'Gold advice for creative teams 👏',
    ];
  }

  // Default universal high-engagement suggestions
  return [
    'Fire edit! 🔥',
    'What song is this? 🎧',
    'How did you shoot this? 📸',
    'Too relatable haha 😂',
  ];
}

/**
 * Intelligent AI Creator Auto-Response
 * Generates an authentic creator reply tailored to the post and user comment
 */
export function generateCreatorReply(post: Post, userComment: string, user: User): string {
  const comment = userComment.toLowerCase();
  const caption = (post.caption || '').toLowerCase();
  const creator = post.user.name || post.user.username;
  const username = user.username ? `@${user.username}` : 'bro';

  // Audio / Song questions
  if (comment.includes('song') || comment.includes('track') || comment.includes('music') || comment.includes('audio') || comment.includes('sound')) {
    return `${username} Track is customized in Celoris SoundLab! Added the Spotify / Audio link in bio 🎧✨`;
  }

  // Camera / Gear / Settings
  if (comment.includes('camera') || comment.includes('phone') || comment.includes('gear') || comment.includes('iphone') || comment.includes('settings') || comment.includes('shoot') || comment.includes('lens')) {
    return `${username} Shot on 4K 60fps with locked exposure and graded with Celoris Film LUT! 🎥🙌`;
  }

  // Tutorial / How-to / CapCut / Editing
  if (comment.includes('tutorial') || comment.includes('edit') || comment.includes('capcut') || comment.includes('how') || comment.includes('software')) {
    return `${username} Took 3 days of frame-by-frame pacing! Dropping the complete editing breakdown on Celoris Studio this week ⚡`;
  }

  // Part 2 / Next
  if (comment.includes('part 2') || comment.includes('next') || comment.includes('asap') || comment.includes('more')) {
    return `${username} Part 2 is already rendering in the studio! Hit follow so you don't miss the drop tomorrow 🚀`;
  }

  // Comedy / Relatable / Laugh
  if (comment.includes('relatable') || comment.includes('😂') || comment.includes('💀') || comment.includes('haha') || comment.includes('funny') || comment.includes('lol')) {
    return `${username} Haha so true! We have all lived through this exact moment 🤣 Appreciate you watching!`;
  }

  // High praise / Fire / Insane / Love
  if (comment.includes('fire') || comment.includes('🔥') || comment.includes('insane') || comment.includes('crazy') || comment.includes('love') || comment.includes('clean') || comment.includes('smooth')) {
    return `${username} Thank you so much! Means a ton, worked hard on the visual flow for this one 🙌✨`;
  }

  // Default warm creator response
  return `${username} Appreciate the love! Drop a follow for more creative drops every single day ⚡❤️`;
}

export interface PostAiInsights {
  viralScore: number;
  hookRate: string;
  algorithmFit: string;
  soundRadar: string;
  creatorTip: string;
  suggestedPrompt: string;
}

/**
 * Returns AI Content breakdown and Viral Radar stats for reels
 */
export function getAiPostInsights(post: Post): PostAiInsights {
  const hash = post.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const viralScore = 92 + (hash % 8); // 92 to 99
  const retention = 91 + (hash % 8); // 91% to 98%
  const bpm = 120 + (hash % 15);

  let creatorTip = 'High-contrast visual pacing keeps viewer dwell time 2.4x higher than platform average.';
  let suggestedPrompt = `Cinematic viral reel style, hyper-engaging visual pacing, vivid mood lighting, studio 4k quality, trending aesthetics for ${post.tags?.[0] || 'social'}`;

  if (post.caption.toLowerCase().includes('stickman')) {
    creatorTip = 'Sub-second visual comedy beat hooks viewers immediately. Retention rate exceeds 96% in the first 3 seconds.';
    suggestedPrompt = 'A 2D minimalist stickman animator working late by single warm candle flame, dark background, humorous contrast, 4k 60fps viral aesthetic';
  } else if (post.caption.toLowerCase().includes('camera') || post.caption.toLowerCase().includes('iphone')) {
    creatorTip = 'Actionable value hook delivers immediate educational payoff, maximizing bookmark & share ratios.';
    suggestedPrompt = 'Behind-the-scenes mobile filmmaking setup, natural window lighting at noon, smartphone on mini tripod, split screen showing raw vs color graded footage';
  } else if (post.caption.toLowerCase().includes('dance')) {
    creatorTip = 'Beat-matched transitions aligned with viral audio rhythm trigger Instagram and Celoris recommendation algorithms.';
    suggestedPrompt = 'High-energy contemporary dance choreography, dynamic gimbal tracking shot, neon city bokeh, synchronized bass drops';
  }

  return {
    viralScore,
    hookRate: `${retention}% retained past 3s hook`,
    algorithmFit: 'Ranked in top 2% of Celoris Social recommendation index',
    soundRadar: `Trending SoundLab Audio · ${bpm} BPM rhythm`,
    creatorTip,
    suggestedPrompt,
  };
}
