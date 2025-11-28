import { Assignment, ClassSession, User, UserRole } from "./types";

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Prof. Sarah Jenkins',
  role: UserRole.TEACHER,
  avatarUrl: 'https://picsum.photos/200/200'
};

export const MOCK_SESSIONS: ClassSession[] = [
  { id: 'c1', title: 'Advanced React Patterns', subject: 'Computer Science', startTime: '09:00 AM', studentsAttending: 24, isActive: true },
  { id: 'c2', title: 'System Design 101', subject: 'Software Eng.', startTime: '11:30 AM', studentsAttending: 45, isActive: false },
  { id: 'c3', title: 'Data Structures', subject: 'Computer Science', startTime: '02:00 PM', studentsAttending: 30, isActive: false },
];

export const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 'a1', title: 'Build a Hook', dueDate: '2023-10-25', submitted: 18, total: 24, platform: 'GoogleClassroom' },
  { id: 'a2', title: 'System Architecture Diagram', dueDate: '2023-10-28', submitted: 5, total: 45, platform: 'EduStream' },
];

export const GEMINI_MODEL_FLASH = 'gemini-2.5-flash';
