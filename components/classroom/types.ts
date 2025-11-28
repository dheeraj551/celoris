export enum UserRole {
  TEACHER = 'Teacher',
  STUDENT = 'Student'
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatarUrl: string;
}

export interface ClassSession {
  id: string;
  title: string;
  subject: string;
  startTime: string;
  studentsAttending: number;
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: Date;
  isAi?: boolean;
}

export interface DrawingPoint {
  x: number;
  y: number;
}

export interface WhiteboardPath {
  points: DrawingPoint[];
  color: string;
  width: number;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CLASSROOM = 'CLASSROOM',
  PLANNER = 'PLANNER',
  SETTINGS = 'SETTINGS'
}

export interface Assignment {
  id: string;
  title: string;
  dueDate: string;
  submitted: number;
  total: number;
  platform: 'GoogleClassroom' | 'EduStream';
}
