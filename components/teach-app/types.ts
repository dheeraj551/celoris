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
