export type UserRole = 'patron' | 'regular' | 'barista' | 'moderator' | 'admin';

export type SeasonalThemeId = 'autumn' | 'spring' | 'summer' | 'winter';

export type RetroThemeSkin = 'xp_purple' | 'win98_teal' | 'arcade_neon' | 'cyber_dark';
export type RetroViewMode = 'retro_window' | 'arcade_cabinet' | 'arcade_game';

export type BubbleStyleId = 'ceramic' | 'latte' | 'matcha' | 'parchment' | 'espresso' | 'cozyknit' | 'boba';

export interface UserProfile {
  id: string;
  name: string;
  avatarId: string;
  avatarColor: string;
  accessory: string;
  role: UserRole;
  statusText: string;
  currentDrink: string;
  bubbleStyle: BubbleStyleId;
  joinedAt: number;
}

export interface CafeDrink {
  id: string;
  name: string;
  icon: string;
  type: 'hot' | 'iced' | 'sweet' | 'snack';
  flavorNote: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface ChatMessage {
  id: string;
  tableId: string;
  sender: UserProfile;
  content: string;
  timestamp: number;
  replyTo?: {
    id: string;
    senderName: string;
    content: string;
  };
  reactions: Record<string, string[]>; // emoji -> array of userIds
  isPinned?: boolean;
  isDeleted?: boolean;
  deletionReason?: string;
  deletedBy?: string;
  drinkGift?: {
    drink: CafeDrink;
    recipientName?: string;
    note?: string;
  };
  isDiscussionTopic?: boolean;
  discussionData?: {
    title: string;
    category: string;
    starterPrompts: string[];
  };
}

export interface CafeTable {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  atmosphere: string;
  slowModeSeconds: number;
  activeTopic?: DiscussionTopic;
  isLocked?: boolean;
}

export interface DiscussionTopic {
  id: string;
  title: string;
  prompt: string;
  category: string;
  starterQuestions: string[];
  hostedBy: string;
  startedAt: number;
  phase: 'opening' | 'open_floor' | 'deep_dive' | 'closing';
}

export interface ModerationReport {
  id: string;
  messageId: string;
  messagePreview: string;
  reportedUserId: string;
  reportedUserName: string;
  reportedBy: string;
  reason: 'spam' | 'harassment' | 'inappropriate' | 'disrespectful' | 'off_topic' | 'other';
  note?: string;
  timestamp: number;
  status: 'pending' | 'resolved' | 'dismissed';
}

export interface ModerationActionLog {
  id: string;
  action: 'delete' | 'pin' | 'unpin' | 'mute' | 'unmute' | 'ban' | 'unban' | 'slowmode' | 'warning';
  targetUserId?: string;
  targetUserName?: string;
  targetMessageId?: string;
  moderatorName: string;
  reason: string;
  timestamp: number;
}

export type GuestbookStamp = 'star' | 'coffee' | 'quill' | 'seal' | 'heart' | 'trophy' | 'music' | 'gem';

export interface GuestbookEntry {
  id: string;
  tableId: string;
  userId: string;
  userName: string;
  userAvatarId: string;
  userAvatarColor: string;
  userRole: UserRole;
  message: string;
  motto?: string;
  origin?: string;
  stamp: GuestbookStamp;
  plaqueStyle: 'gold_brass' | 'classic_wood' | 'marble' | 'retro_pixel';
  timestamp: number;
  tributes: Record<string, string[]>; // tribute type -> array of userIds
  isFeatured?: boolean;
}

export interface ServerStateSnapshot {
  users: UserProfile[];
  messages: ChatMessage[];
  tables: CafeTable[];
  activeTableId: string;
  reports: ModerationReport[];
  bannedUserIds: string[];
  mutedUsers: Record<string, number>; // userId -> mute expiration timestamp
  slowModeSeconds: Record<string, number>; // tableId -> seconds
  guestbookEntries?: GuestbookEntry[];
}
