export interface User {
  id: string;
  name: string;
  avatar: string;
  skill: string;
  college?: string;
  isOnline: boolean;
  isTrainer?: boolean;
  isVerified?: boolean;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  category: 'study' | 'course' | 'mixer' | 'night' | 'onboarding';
  onlineCount: number;
  status: 'Ready' | 'Live' | 'Full';
  tags: string[];
  host?: {
    name: string;
    avatar: string;
    role: string;
  };
  participants: User[];
}

export interface ChatMessage {
  id: string;
  roomId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  isTrainer?: boolean;
  isSelf?: boolean;
}

export interface Course {
  id: string;
  title: string;
  instructor: string;
  rating: number;
  enrolledCount: number;
  image: string;
  tag: string;
}

export interface StudioTool {
  id: string;
  name: string;
  description: string;
  iconName: string;
  demoTitle: string;
  features: string[];
}
