export type JobTier = 'public' | 'certified';

export type UserTierLevel = 1 | 2 | 3 | 4 | 5;

export interface VerifiedBadge {
  id: string;
  badgeTitle: string;
  skillName: string;
  industry: string;
  verificationHash: string; // e.g. "SV-2026-REACT-88A9"
  earnedDate: string;
  score: number;
  proctorScore: number; // Anti-cheat integrity index (e.g. 98%)
  badgeColor: string;
  iconName?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  title: string;
  level: UserTierLevel;
  levelTitle: string;
  currentXP: number;
  nextLevelXP: number;
  totalTimeSpentSeconds: number;
  honorScore: number; // 0 - 100%
  skills: string[];
  preferredIndustries: string[];
  minSalaryTarget: number;
  preferredWorkModes: ('Remote' | 'Hybrid' | 'Onsite')[];
  verifiedBadges: VerifiedBadge[];
  appliedJobIds: string[];
  savedJobIds: string[];
  examHistory: ExamResult[];
  lastActiveTimestamp: number;
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  logo: string;
  location: string;
  salaryRange: string;
  minSalaryNum: number;
  industry: string;
  tier: JobTier;
  minLevelRequired: UserTierLevel;
  requiredBadges: string[]; // Badge titles required
  requiredSkills: string[];
  workMode: 'Remote' | 'Hybrid' | 'Onsite';
  description: string;
  responsibilities: string[];
  benefits: string[];
  postedAgo: string;
  applicantsCount: number;
  featured?: boolean;
  hiringManagerVerified?: boolean;
}

export interface ExamQuestion {
  id: string;
  type: 'mcq' | 'scenario';
  question: string;
  codeSnippet?: string;
  options?: string[];
  correctAnswerIndex?: number;
  explanation?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

export interface ExamDefinition {
  id: string;
  skillName: string;
  industry: string;
  title: string;
  description: string;
  timeLimitMinutes: number;
  passingScorePercent: number;
  xpReward: number;
  badgeTitle: string;
  badgeColor: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  targetRoleExamples: string[];
  questions: ExamQuestion[];
}

export interface ExamResult {
  id: string;
  examId: string;
  examTitle: string;
  skillName: string;
  date: string;
  score: number;
  passed: boolean;
  timeSpentSeconds: number;
  honorScore: number;
  violationsCount: number;
  badgeEarned?: VerifiedBadge;
  xpEarned: number;
  detailedFeedback?: string;
}

export interface JobAlertConfig {
  enabled: boolean;
  frequency: 'Instant' | 'Daily' | 'Weekly';
  keywords: string[];
  industries: string[];
  minSalary: number;
  remoteOnly: boolean;
  soundAlerts: boolean;
  unlockedOnly: boolean;
}

export interface LiveAlertNotification {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  salaryRange: string;
  matchScore: number;
  timestamp: string;
  read: boolean;
  tier: JobTier;
}

export interface TooltipGuideStep {
  targetId: string;
  title: string;
  content: string;
  badgeLabel: string;
  position: 'top' | 'bottom' | 'left' | 'right';
  icon: string;
}
