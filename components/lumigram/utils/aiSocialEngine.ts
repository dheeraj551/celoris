import { Post, User } from '../types';

/**
 * Intelligent context-aware comment generator for automated community engagement.
 * Analyzes the post caption, location, media type, and tags so comments are 100% relevant.
 */
export function generateContextualComment(post: Post): string {
  const caption = (post.caption || '').toLowerCase();
  const location = (post.location || '').toLowerCase();
  const tags = (post.tags || []).join(' ').toLowerCase();
  const text = `${caption} ${location} ${tags}`;

  const currentMediaUrl = post.images?.[0] || '';
  const isVideo = post.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(currentMediaUrl);

  // 1. Bikes, motorcycles, riding, sportbike, superbike
  if (
    text.includes('bike') ||
    text.includes('motorcycle') ||
    text.includes('ride') ||
    text.includes('riding') ||
    text.includes('superbike') ||
    text.includes('yamaha') ||
    text.includes('ducati') ||
    text.includes('ninja') ||
    text.includes('bmw') ||
    text.includes('ktm')
  ) {
    const bikeComments = [
      'Which bike model is this? Looks absolute beast! 🏍️🔥',
      'Tall rider on a sportbike is such a powerful aesthetic ⚡',
      'Clean ride and the Saint Petersburg backdrop is magnificent 🏛️',
      'The leather jacket fit with the bike is 10/10 🖤',
      'Stunning shot! Always love seeing fellow riders, ride safe 🙌',
      'Athletic build + sportbike combo is unreal 👏',
      'That machine looks menacing! Ride safe out there 💨',
    ];
    return bikeComments[Math.floor(Math.random() * bikeComments.length)];
  }

  // 2. Stickman (STRICT: only if caption or tags explicitly contain "stickman")
  if (text.includes('stickman')) {
    const stickmanComments = [
      'Stickman animation never fails to make me laugh 😂',
      'The frame by frame timing on this stickman is pure comedy 💀',
      'Stickman animator deserves an award for this one 😭',
      'Relatable max bro haha 😂💀',
    ];
    return stickmanComments[Math.floor(Math.random() * stickmanComments.length)];
  }

  // 3. Stunts / Drifting / Thar / Jeep
  if (text.includes('stunt') || text.includes('thar') || text.includes('jeep') || text.includes('drift')) {
    const stuntComments = [
      'Pure adrenaline rush! 🏎️💨',
      'The cinematography and handling here is insane ⚡',
      'Drone angle captured that stunt cleanly 🔥',
      'What speed was that? Unreal control 👏',
    ];
    return stuntComments[Math.floor(Math.random() * stuntComments.length)];
  }

  // 4. Architecture / Travel / Saint Petersburg / Russia / Historical
  if (
    text.includes('architecture') ||
    text.includes('petersburg') ||
    text.includes('russia') ||
    text.includes('monument') ||
    text.includes('cathedral') ||
    text.includes('travel') ||
    text.includes('oslo') ||
    text.includes('norway')
  ) {
    const travelComments = [
      'The architecture in the background is breathtaking 🏛️✨',
      'Incredible framing and lighting in this shot 📸',
      'Saint Petersburg aesthetic is truly unmatched! ✨',
      'Such a clean composition and city vibe 👏',
      'The historical architecture makes this portrait pop so well 🏛️',
    ];
    return travelComments[Math.floor(Math.random() * travelComments.length)];
  }

  // 5. Dance / Choreography
  if (text.includes('dance') || text.includes('choreography') || text.includes('dancer')) {
    const danceComments = [
      'Choreography and rhythm is so clean! 🔥',
      'The energy here is contagious ⚡',
      'Transitions are buttery smooth ✨',
      'Replaying this on loop 🔁',
    ];
    return danceComments[Math.floor(Math.random() * danceComments.length)];
  }

  // 6. Camera / Filmmaking / Mobile shooting
  if (text.includes('camera') || text.includes('iphone') || text.includes('capcut') || text.includes('cinematography')) {
    const filmComments = [
      'The lighting setup and color grade is top tier 🎥',
      'Natural lighting did all the heavy lifting here 👏',
      'What camera settings did you use for this? 📱',
      'Depth of field is so crisp ✨',
    ];
    return filmComments[Math.floor(Math.random() * filmComments.length)];
  }

  // 7. General Photo vs Video (Ensures photos never get comments about audio sync or video editing)
  if (!isVideo) {
    const photoComments = [
      'Stunning capture! The composition is incredible 📸',
      'The lighting and aesthetic in this shot is 10/10 ✨',
      'Such a clean portrait, loving the mood 🙌',
      'Absolute confidence! Looking amazing 👏',
      'Framing is so sharp and well balanced 🔥',
      'Aesthetic goals right here ✨',
    ];
    return photoComments[Math.floor(Math.random() * photoComments.length)];
  }

  const videoComments = [
    'Cleanest visual pacing on the feed right now 🔥',
    'Top tier creative work right here 🚀',
    'Replaying this on loop, too good 🔁✨',
    'The hook got me instantly 👏',
  ];
  return videoComments[Math.floor(Math.random() * videoComments.length)];
}

/**
 * AI Smart Suggestions generator tailored strictly to post content, tags, and media type
 */
export function getAiCommentSuggestions(post: Post): string[] {
  const caption = (post.caption || '').toLowerCase();
  const location = (post.location || '').toLowerCase();
  const tags = (post.tags || []).join(' ').toLowerCase();
  const text = `${caption} ${location} ${tags}`;

  const currentMediaUrl = post.images?.[0] || '';
  const isVideo = post.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(currentMediaUrl);

  // Bike / Motorcycle / Riding
  if (
    text.includes('bike') ||
    text.includes('motorcycle') ||
    text.includes('ride') ||
    text.includes('riding') ||
    text.includes('superbike')
  ) {
    return [
      'Which bike model? 🏍️',
      'Ride safe! 🖤',
      'Stunning shot 📸',
      'Aesthetic 10/10 ✨',
    ];
  }

  // Stickman STRICT
  if (text.includes('stickman')) {
    return [
      'Stickman comedy haha 😂',
      'Animation is 10/10 🎨',
      'Need Part 2 ASAP! 🚀',
      'Too relatable 💀',
    ];
  }

  // Travel / City / Architecture
  if (text.includes('architecture') || text.includes('petersburg') || text.includes('russia') || text.includes('travel')) {
    return [
      'Stunning architecture 🏛️',
      'Where was this taken? 📍',
      'Aesthetic 10/10 ✨',
      'Beautiful framing 📸',
    ];
  }

  // Camera / Gear / Settings
  if (text.includes('camera') || text.includes('iphone') || text.includes('capcut')) {
    return [
      'Camera settings? 📱',
      'Color grade is 10/10 🎥',
      'Lighting is genius ✨',
      'Drop tutorial please ⚡',
    ];
  }

  // Dance / Song
  if (text.includes('dance') || text.includes('trending') || text.includes('vibe')) {
    return [
      'Clean moves! 🔥',
      'What song is this? 🎧',
      'Smooth energy ⚡',
      'On loop 🔁',
    ];
  }

  // If static image / photo (NO AUDIO or SONG CHIPS)
  if (!isVideo) {
    return [
      'Stunning shot! 📸',
      'Aesthetic 10/10 ✨',
      'Looking amazing! 🔥',
      'Clean portrait 👏',
    ];
  }

  // Video fallback
  return [
    'Fire edit! 🔥',
    'What song is this? 🎧',
    'How did you shoot this? 🎥',
    'Clean pacing ⚡',
  ];
}

/**
 * Intelligent AI Creator Auto-Response
 * Generates an authentic creator reply tailored to the post and user comment
 */
export function generateCreatorReply(post: Post, userComment: string, user: User): string {
  const comment = userComment.toLowerCase();
  const caption = (post.caption || '').toLowerCase();
  const location = (post.location || '').toLowerCase();
  const tags = (post.tags || []).join(' ').toLowerCase();
  const postContext = `${caption} ${location} ${tags}`;
  const username = user.username ? `@${user.username}` : 'bro';

  // Bike inquiry
  if (comment.includes('bike') || comment.includes('model') || comment.includes('ride') || postContext.includes('bike')) {
    if (comment.includes('bike') || comment.includes('model') || comment.includes('which')) {
      return `${username} It's a custom supersport! The torque and agility in the city are incredible 🏍️💨`;
    }
    if (comment.includes('safe') || comment.includes('gear')) {
      return `${username} Always safety first! Appreciate you watching out, ride safe always 🙌🖤`;
    }
  }

  // Architecture / Place / Location
  if (comment.includes('where') || comment.includes('place') || comment.includes('location') || comment.includes('city') || comment.includes('architecture')) {
    return `${username} Shot right in front of the Church of the Savior on Spilled Blood in Saint Petersburg! Such a magical spot 🏛️✨`;
  }

  // Audio / Song questions (only for videos)
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
    return `${username} Haha so true! Glad this connected with you 🤣 Appreciate you watching!`;
  }

  // High praise / Fire / Insane / Love
  if (comment.includes('fire') || comment.includes('🔥') || comment.includes('insane') || comment.includes('crazy') || comment.includes('love') || comment.includes('clean') || comment.includes('smooth')) {
    return `${username} Thank you so much! Means a ton, worked hard on the visual flow for this one 🙌✨`;
  }

  // Default warm creator response
  return `${username} Appreciate the love and support! Drop a follow for more creative drops every single day ⚡❤️`;
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

  const caption = (post.caption || '').toLowerCase();

  if (caption.includes('stickman')) {
    creatorTip = 'Sub-second visual comedy beat hooks viewers immediately. Retention rate exceeds 96% in the first 3 seconds.';
    suggestedPrompt = 'A 2D minimalist stickman animator working late by single warm candle flame, dark background, humorous contrast, 4k 60fps viral aesthetic';
  } else if (caption.includes('bike') || caption.includes('motorcycle') || caption.includes('ride')) {
    creatorTip = 'High visual contrast between the rider, superbike, and architectural monument drives high dwell time and bookmark ratios.';
    suggestedPrompt = 'Athletic woman in leather jacket on a silver superbike parked in front of ornate historical cathedral in Saint Petersburg, golden hour natural light, 4k photography';
  } else if (caption.includes('camera') || caption.includes('iphone')) {
    creatorTip = 'Actionable value hook delivers immediate educational payoff, maximizing bookmark & share ratios.';
    suggestedPrompt = 'Behind-the-scenes mobile filmmaking setup, natural window lighting at noon, smartphone on mini tripod, split screen showing raw vs color graded footage';
  } else if (caption.includes('dance')) {
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
