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
  category: 'study' | 'course' | 'mixer' | 'night' | 'onboarding' | 'classroom';
  onlineCount: number;
  /** Host-set seat cap for this table (e.g. 15). Defaults to 15 when not set. */
  maxStudents?: number;
  status: 'Ready' | 'Live' | 'Full';
  /** Free-text note the host can set so students see when to come back
      (e.g. "Next batch 6 PM today"). Always shown on the room card once
      set — not gated on `status === 'Full'`, so a trainer's note is never
      silently hidden just because the room still has open seats. */
  nextBatchInfo?: string;
  /** True when a student code is set on this room — the code ITSELF never
      reaches the browser via this Room object; only this boolean does (see
      app/social/page.tsx fetchRooms, which never selects the actual code
      columns). Gates the join flow for ordinary students. */
  requiresStudentCode?: boolean;
  /** True when a separate trainer code is set on this room. Doesn't gate
      ordinary student entry by itself (only requiresStudentCode does) — it
      just means someone can also enter as trainer via that code. */
  requiresTrainerCode?: boolean;
  /** Trainer-linked course — shown as a clickable cover-image preview on
      the lobby card so browsing students can jump straight to it. */
  courseUrl?: string;
  courseTitle?: string;
  courseImageUrl?: string;
  courseDescription?: string;
  tags: string[];
  host?: {
    id?: string;
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
