import { User, Post, UserStory, Conversation, NotificationItem, AccountSettings } from '../types';
import { SCRAPED_VIRAL_REELS } from './scrapedReelsData';

export const CURRENT_USER: User = {
  id: 'user_current',
  username: 'celoris_creator',
  name: 'Celoris Creator',
  avatar: 'https://ui-avatars.com/api/?name=Celoris+Creator&background=0f172a&color=fff',
  bio: 'Visual creator & community member on Celoris Social Cloud',
  website: 'https://celorisdesigns.com',
  isVerified: false,
  isPrivate: false,
  followersCount: 142,
  followingCount: 38,
  postsCount: 1,
  isOnline: true,
};

export const SEED_USERS: Record<string, User> = {
  dheeraj: {
    id: 'user_dheeraj',
    username: 'dheeraj_celoris',
    name: 'Dheeraj Kushwaha',
    avatar: '/courses/digital-marketing-mastery-og.jpg',
    bio: 'Lead Instructor · Performance Marketing & Funnel Architecture | Celoris Studio 🚀',
    isVerified: true,
    isPrivate: false,
    followersCount: 52400,
    followingCount: 210,
    postsCount: 64,
    isFollowing: true,
    isOnline: true,
    role: 'Lead Instructor · Celoris',
  },
  ananya: {
    id: 'user_ananya',
    username: 'ananya_reels',
    name: 'Ananya Jairath',
    avatar: '/free-courses/social-media-reels.jpg',
    bio: 'Short-Form Video Director & Hook Strategist 📱 Teaching 100k+ viral retention frameworks ✨',
    isVerified: true,
    isPrivate: false,
    followersCount: 88100,
    followingCount: 312,
    postsCount: 92,
    isFollowing: true,
    isOnline: true,
    role: 'Video Director · Celoris',
  },
};

export const SEED_POSTS: Post[] = [
  ...SCRAPED_VIRAL_REELS.slice(0, 3),
  {
    id: 'post_dheeraj_1',
    userId: 'user_dheeraj',
    user: SEED_USERS.dheeraj,
    images: ['/courses/digital-marketing-mastery-og.jpg'],
    caption: 'Stop spending ₹15,000/month on generic agency ads that deliver zero leads. 🛑\n\nWhen we tested this exact customer journey angle for our D2C packaging client, the CPC dropped straight from ₹18.40 to ₹6.40 in 48 hours. The secret? Calling out the hidden cost in the first 1.5 seconds instead of showing boring b-roll.\n\nBatch #43 students: make sure to inspect your audience fatigue metrics before launching tonight! 🚀 #marketing #digitalmarketing #performanceads #celoris',
    location: 'Celoris Studio · Noida',
    filter: 'normal',
    aspectRatio: 'landscape',
    likesCount: 1420,
    isLiked: false,
    isSaved: false,
    isSponsored: true,
    hook: 'Stop spending ₹15,000 on basic reels',
    sponsorData: {
      buttonText: 'Learn More',
      destination: '/learn/course/digital-marketing-mastery',
      impressions: 5410,
      clicks: 148,
      cpc: '₹6.40',
      ctr: '2.73%',
      leads: 19,
      dailyBudget: 500,
    },
    commentsCount: 1,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    tags: ['marketing', 'digitalmarketing', 'performanceads', 'celoris'],
    comments: [
      {
        id: 'c_dh_1',
        postId: 'post_dheeraj_1',
        user: SEED_USERS.ananya,
        text: 'The 1.5s hook framework really changed retention across all our student campaigns! 🔥',
        createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(),
        likesCount: 12,
        isLiked: false,
      },
    ],
  },
  {
    id: 'post_ananya_1',
    userId: 'user_ananya',
    user: SEED_USERS.ananya,
    images: ['/free-courses/social-media-reels.jpg'],
    caption: 'You DO NOT need an iPhone 16 Pro Max or a ₹50,000 Sony mirrorless camera to create high-retention Reels. 📱✨\n\nShot this entire clip on a 3-year-old Redmi phone by placing it directly facing a north-facing window at noon. Cost of lighting: ₹0.\n\nDrop your current smartphone model in the comments and I will tell you the best camera settings for 60fps export! 👇 #reels #contentcreator #mobilefilmmaking #capcut',
    location: 'Creator Hub · New Delhi',
    filter: 'normal',
    aspectRatio: 'landscape',
    likesCount: 2840,
    isLiked: false,
    isSaved: true,
    hook: "You don't need a ₹50,000 camera to go viral",
    commentsCount: 1,
    createdAt: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
    tags: ['reels', 'contentcreator', 'mobilefilmmaking', 'capcut'],
    comments: [
      {
        id: 'c_an_1',
        postId: 'post_ananya_1',
        user: SEED_USERS.dheeraj,
        text: 'Window lighting + locked exposure is undefeated for organic creators 👏',
        createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        likesCount: 8,
        isLiked: false,
      },
    ],
  },
  ...SCRAPED_VIRAL_REELS.slice(3),
];

export const SEED_STORIES: UserStory[] = [];

export const SEED_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv_dheeraj',
    participant: SEED_USERS.dheeraj,
    unreadCount: 1,
    updatedAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
    lastMessage: {
      id: 'm_1',
      conversationId: 'conv_dheeraj',
      senderId: 'user_dheeraj',
      sender: SEED_USERS.dheeraj,
      text: 'Welcome to Celoris Social Cloud! Feel free to share your latest creative drops or campaign ideas here.',
      createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      reactions: [{ userId: 'user_current', emoji: '❤️' }],
      isRead: false,
    },
  },
];

export const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_welcome',
    type: 'like',
    actor: SEED_USERS.dheeraj,
    text: 'welcomed you to Celoris Social Cloud',
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    isRead: false,
  },
];

export const INITIAL_ACCOUNT_SETTINGS: AccountSettings = {
  isPrivate: false,
  allowTagging: true,
  showOnlineStatus: true,
  filterOffensiveComments: true,
  pushNotifications: {
    enabled: true,
    likes: true,
    comments: true,
    directMessages: true,
    newFollowers: true,
    mentions: true,
    sound: true,
  },
};
