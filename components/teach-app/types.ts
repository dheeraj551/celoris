export type Role = 'student' | 'trainer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
}

export interface TrainerProfile {
  id: string;
  userId: string;
  name: string;
  bio: string;
  subjects: string[];
  experienceYears: number;
  hourlyRate: number;
  location: string;
  ratingAvg: number;
  reviewCount: number;
  avatarUrl: string;
  isOnline: boolean;
  isOffline: boolean;
}

export interface Course {
  id: string;
  trainerId: string;
  title: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  categoryId: string;
  rating: number;
  studentsCount: number;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export type TrainerTierLevel = 1 | 2 | 3 | 4 | 5;

export interface TrainerBadge {
  id: string;
  badgeTitle: string;
  subject: string;
  verificationHash: string; // e.g. "TV-2026-WD-77K2"
  earnedDate: string;
  rating: number; // e.g. 4.9 out of 5
  sessionsCount: number;
  badgeColor: string;
}

export interface TrainerProgress {
  level: TrainerTierLevel;
  currentXP: number;
  nextLevelXP: number;
  sessionsHosted: number;
  trainerRating: number;
  badges: TrainerBadge[];
}
