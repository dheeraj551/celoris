export type Role = 'student' | 'teacher';

export interface Author {
  id: string;
  name: string;
  avatar: string;
  role: 'student' | 'teacher' | 'professor' | 'ta';
  title?: string;
  institution?: string;
  verified?: boolean;
}

export interface VideoChapter {
  title: string;
  timestamp: number; // in seconds
  description?: string;
}

export interface VideoResource {
  id: string;
  title: string;
  type: 'pdf' | 'slides' | 'code' | 'worksheet' | 'link';
  size?: string;
  url: string;
}

export interface TranscriptItem {
  id: string;
  timestamp: number; // in seconds
  speaker?: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  timestamp: number; // point in video where quiz can pop up
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  youtubeId?: string; // when set, EduVideoPlayer plays via the YouTube IFrame API instead of the native <video> element
  thumbnailUrl: string;
  duration: number; // in seconds
  views: number;
  likes: number;
  dislikes: number;
  // The signed-in viewer's own reaction to this video, as last loaded from
  // the server ('like' | 'dislike' | null/undefined if they haven't reacted).
  // Not persisted client-side beyond seeding currentUser's liked/disliked
  // lists on load — the source of truth is the server.
  userReaction?: 'like' | 'dislike' | null;
  publishedAt: string;
  category: string;
  subject: string;
  gradeLevel: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  author: Author;
  chapters: VideoChapter[];
  resources: VideoResource[];
  transcript: TranscriptItem[];
  quizzes?: QuizQuestion[];
  isFeatured?: boolean;
}

export interface QAAnswer {
  id: string;
  questionId: string;
  author: Author;
  content: string;
  createdAt: string;
  upvotes: number;
  isEndorsedByTeacher: boolean;
  isAccepted: boolean;
}

export interface QAQuestion {
  id: string;
  videoId: string;
  videoTitle?: string;
  author: Author;
  timestampSec: number | null; // null if general question, or number for video timestamp
  title: string;
  content: string;
  codeSnippet?: string;
  createdAt: string;
  upvotes: number;
  isResolved: boolean;
  isPinned?: boolean;
  answers: QAAnswer[];
  tags: string[];
}

export interface Playlist {
  id: string;
  title: string;
  description: string;
  coverUrl: string;
  videoIds: string[];
  authorId: string;
  authorName: string;
  authorRole: Role;
  subject: string;
  isPersonal: boolean; // created by student
  isTeacherCurated: boolean; // officially curated course syllabus
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserNote {
  id: string;
  videoId: string;
  timestampSec: number;
  title: string;
  text: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: Role;
  institution: string;
  bio: string;
  enrolledCourseIds: string[];
  likedVideoIds: string[];
  dislikedVideoIds: string[];
  savedVideoIds: string[];
  customPlaylistIds: string[];
  watchProgress: Record<string, number>; // videoId -> progress ratio 0..1 or timestamp in sec
  historyVideoIds: string[];
}

export type ActiveTab = 'qa' | 'transcript' | 'notes' | 'resources' | 'quiz';
export type ViewMode = 'explore' | 'watch' | 'playlists' | 'playlist-detail' | 'qa-hub' | 'notes' | 'history' | 'teacher-studio';
