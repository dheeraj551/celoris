export type CandidateStage = 
  | 'applied' 
  | 'screening' 
  | 'tech_screen' 
  | 'system_design' 
  | 'culture_fit' 
  | 'executive_review' 
  | 'offer_extended' 
  | 'hired' 
  | 'rejected';

export type RecommendationType = 
  | 'Strong Hire' 
  | 'Hire' 
  | 'Leaning Hire' 
  | 'Leaning No Hire' 
  | 'Strong No Hire';

export interface RubricCategory {
  id: string;
  name: string;
  description: string;
  weight: number; // percentage (0-100)
  score: number; // 1 to 5
  rationale?: string;
}

export interface ScorecardEvaluation {
  id: string;
  interviewId: string;
  candidateId: string;
  interviewerName: string;
  interviewerRole: string;
  submittedAt: string;
  overallScore: number;
  recommendation: RecommendationType;
  executiveSummary: string;
  strengths: string[];
  concerns: string[];
  rubricBreakdown: RubricCategory[];
  calibrationNotes: string;
  suggestedFollowUp?: string[];
  notes: string;
}

export interface TranscriptSnippet {
  id: string;
  timestamp: string;
  speaker: string;
  text: string;
  isBookmarked?: boolean;
  category?: 'architecture' | 'code' | 'behavioral' | 'general';
}

export interface InterviewSession {
  id: string;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  role: string;
  targetLevel: string; // e.g. L5 Senior, L6 Staff
  roundType: 'Screening' | 'Technical Coding' | 'System Architecture' | 'Values & Leadership' | 'Executive Debrief';
  scheduledDate: string; // ISO date string
  startTime: string; // e.g. "14:00"
  durationMinutes: number;
  timezone: string;
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  panelists: {
    name: string;
    role: string;
    avatarUrl?: string;
    isLead?: boolean;
  }[];
  meetingRoomId: string;
  passcode: string;
  scorecard?: ScorecardEvaluation;
  transcriptSnippets?: TranscriptSnippet[];
  notes?: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl: string;
  role: string;
  department: 'Infrastructure' | 'Product Engineering' | 'Data & AI' | 'Security' | 'Platform';
  targetLevel: string;
  currentCompany: string;
  yearsExperience: number;
  stage: CandidateStage;
  appliedDate: string;
  overallScore?: number;
  recommendation?: RecommendationType;
  interviewSessions: InterviewSession[];
  resumeHighlights: string[];
  skills: string[];
  activeInterviewId?: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'system_design' | 'coding' | 'behavioral' | 'architecture';
  title: string;
  prompt: string;
  difficulty: 'Mid' | 'Senior' | 'Staff' | 'Principal';
  evaluationCriteria: string[];
  probeQuestions: string[];
  starterCode?: {
    language: string;
    code: string;
  };
}
