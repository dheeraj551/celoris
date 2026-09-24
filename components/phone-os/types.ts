export type PhoneView = 
  | 'home'
  | 'support'
  | 'whatschat'
  | 'jobs'
  | 'classrooms'
  | 'apps'
  | 'tv'
  | 'mail';

export interface EmailItem {
  id: string;
  senderName: string;
  senderRole: string;
  senderAvatar?: string;
  senderType: 'support' | 'employer' | 'freelancer' | 'academy';
  subject: string;
  preview: string;
  body: string;
  time: string;
  read: boolean;
  tag?: string;
  actionText?: string;
  actionHref?: string;
  actionType?: 'chat' | 'link';
}

export interface WhatsChatConversation {
  id: string;
  title: string;
  category: 'community' | 'group' | 'support' | 'mentor';
  avatarBg: string;
  iconType: 'community' | 'video' | 'code' | 'support';
  membersCount?: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isOnline?: boolean;
  prefillMessage: string;
}

export type WhatsAppChat = WhatsChatConversation;

export interface JobOpening {
  id: string;
  title: string;
  company: string;
  rate: string;
  type: 'Remote' | 'Full-time' | 'Freelance' | 'Contract';
  tag: string;
  category: 'video' | 'dev' | 'design' | 'ai';
  verified: boolean;
}

export interface ClassroomRoom {
  id: string;
  name: string;
  instructor: string;
  topic: string;
  activeLearners: number;
  status: 'live' | 'upcoming';
  timeNotice?: string;
  category: string;
}

export interface CreativeAppItem {
  id: string;
  name: string;
  shortDesc: string;
  badge: string;
  iconColor: string;
  bgColor: string;
  href: string;
}
