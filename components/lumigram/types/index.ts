export type ThemeMode = 'dark' | 'light';

export interface User {
  id: string;
  username: string;
  name: string;
  avatar: string;
  bio: string;
  website?: string;
  isVerified?: boolean;
  isPrivate?: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing?: boolean;
  hasRequestedFollow?: boolean;
  isOnline?: boolean;
  role?: string;
}

export interface Comment {
  id: string;
  postId: string;
  user: User;
  text: string;
  createdAt: string;
  likesCount: number;
  isLiked?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  user: User;
  images: string[];
  caption: string;
  location?: string;
  filter?: string;
  mediaType?: 'image' | 'video';
  aspectRatio?: 'square' | 'portrait' | 'landscape' | 'vertical' | '9:16';
  likesCount: number;
  isLiked?: boolean;
  isSaved?: boolean;
  commentsCount: number;
  comments: Comment[];
  createdAt: string;
  tags: string[];
  isSponsored?: boolean;
  hook?: string;
  sponsorData?: {
    buttonText: string;
    destination: string;
    impressions: number;
    clicks: number;
    cpc: string;
    ctr: string;
    leads: number;
    dailyBudget: number;
  };
}

export interface ActiveCampaign {
  id: string;
  postId: string;
  postTitle: string;
  objective: string;
  dailyBudget: number;
  spent: number;
  status: 'Active' | 'Paused';
  impressions: number;
  clicks: number;
  cpc: string;
  ctr: string;
  leads: number;
}

export interface StorySlide {
  id: string;
  mediaUrl: string;
  type: 'image' | 'video';
  durationSeconds: number;
  caption?: string;
}

export interface UserStory {
  userId: string;
  user: User;
  hasUnseen: boolean;
  slides: StorySlide[];
  updatedAt: string;
}

export interface MessageReaction {
  userId: string;
  emoji: string;
}

export interface DirectMessage {
  id: string;
  conversationId: string;
  senderId: string;
  sender: User;
  text?: string;
  imageUrl?: string;
  isVoiceNote?: boolean;
  voiceDuration?: string;
  createdAt: string;
  reactions: MessageReaction[];
  isRead: boolean;
}

export interface Conversation {
  id: string;
  participant: User;
  lastMessage: DirectMessage;
  unreadCount: number;
  updatedAt: string;
}

export type NotificationType = 'like' | 'comment' | 'follow' | 'follow_request' | 'mention' | 'message';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  actor: User;
  targetPost?: Post;
  text?: string;
  createdAt: string;
  isRead: boolean;
}

export type ReportCategory =
  | 'spam'
  | 'harassment'
  | 'hate_speech'
  | 'misinformation'
  | 'violence'
  | 'copyright'
  | 'inappropriate_content';

export interface ReportItem {
  id: string;
  reportedItemId: string;
  itemType: 'post' | 'user' | 'message';
  reportedUser: User;
  category: ReportCategory;
  details: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'actioned';
  actionTaken?: string;
}

export interface PushNotificationSettings {
  enabled: boolean;
  likes: boolean;
  comments: boolean;
  directMessages: boolean;
  newFollowers: boolean;
  mentions: boolean;
  sound: boolean;
}

export interface AccountSettings {
  isPrivate: boolean;
  allowTagging: boolean;
  showOnlineStatus: boolean;
  filterOffensiveComments: boolean;
  pushNotifications: PushNotificationSettings;
}

export interface IngestionMetrics {
  concurrentUploads: number;
  ingestThroughputMBps: number;
  edgeLatencyMs: number;
  cacheHitRatio: number;
  activeShards: number;
  queuedTasks: number;
  processedImagesToday: number;
}
