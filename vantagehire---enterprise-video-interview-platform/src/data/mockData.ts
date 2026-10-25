import { Candidate, InterviewQuestion, InterviewSession, RubricCategory } from '../types';

export const DEFAULT_RUBRIC_CATEGORIES: RubricCategory[] = [
  {
    id: 'system_design',
    name: 'System Architecture & Scalability',
    description: 'Ability to decompose distributed systems, address bottlenecks, handle failure modes, and evaluate latency vs throughput trade-offs.',
    weight: 30,
    score: 4,
    rationale: 'Demonstrated solid grasp of horizontal sharding and eventual consistency trade-offs.',
  },
  {
    id: 'problem_solving',
    name: 'Algorithmic Problem Solving & Code Cleanliness',
    description: 'Precision in algorithmic reasoning, edge case detection, clean modular structure, and optimal time/space complexity.',
    weight: 25,
    score: 4,
    rationale: 'Clean O(N log N) solution with defensive input validation and modular helpers.',
  },
  {
    id: 'communication',
    name: 'Technical Communication & Clarification',
    description: 'Proactive requirement clarification, structured articulation, receptive to hints, and concise reasoning under ambiguity.',
    weight: 20,
    score: 5,
    rationale: 'Articulate verbalization of tradeoffs; actively checked assumptions with interviewer.',
  },
  {
    id: 'resilience',
    name: 'Operational Resilience & Error Boundaries',
    description: 'Understanding of telemetry (tracing/metrics), retry budgets with jitter, circuit breakers, and zero-downtime deployment safety.',
    weight: 15,
    score: 4,
    rationale: 'Proposed exponential backoff and circuit breaking for external dependencies.',
  },
  {
    id: 'culture',
    name: 'Enterprise Alignment & Collaborative Leadership',
    description: 'Cross-functional empathy, constructive debate, ownership of mistakes, and mentoring mindset.',
    weight: 10,
    score: 4,
    rationale: 'Shared thoughtful examples of unblocking junior engineers and managing technical debt.',
  },
];

export const INITIAL_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    category: 'system_design',
    title: 'Design a Real-Time Distributed Rate Limiter',
    prompt: 'Design a global distributed rate limiting tier supporting 500,000 requests per second with multi-region consistency, sliding window accuracy, and sub-3ms latency impact.',
    difficulty: 'Staff',
    evaluationCriteria: [
      'Identifies sliding window counter vs token bucket trade-offs',
      'Addresses Redis cluster or local memory with asynchronous batch sync to prevent network saturation',
      'Defines graceful degradation and fail-open policies when rate limiter cluster is unreachable',
      'Handles multi-datacenter race conditions and clock skew'
    ],
    probeQuestions: [
      'What happens if the cache tier experiences a 200ms network partition?',
      'How would you enforce tier-based quotas for enterprise tenants vs public anonymous traffic?',
      'How do you measure p99.9 latency overhead on the ingress proxy?'
    ],
    starterCode: {
      language: 'typescript',
      code: `// Interface for Distributed Rate Limiter
interface RateLimitConfig {
  windowSeconds: number;
  maxRequests: number;
}

interface RateLimitResult {
  allowed: boolean;
  remainingTokens: number;
  resetAtEpochSeconds: number;
}

export class SlidingWindowRateLimiter {
  private readonly windowSizeMs: number;
  private readonly maxLimit: number;

  constructor(config: RateLimitConfig) {
    this.windowSizeMs = config.windowSeconds * 1000;
    this.maxLimit = config.maxRequests;
  }

  async shouldAllowRequest(tenantKey: string): Promise<RateLimitResult> {
    // TODO: Implement sliding window counter with memory tiering
    const now = Date.now();
    return {
      allowed: true,
      remainingTokens: this.maxLimit - 1,
      resetAtEpochSeconds: Math.floor((now + this.windowSizeMs) / 1000)
    };
  }
}`
    }
  },
  {
    id: 'q2',
    category: 'architecture',
    title: 'High-Throughput Event Ingestion Pipeline',
    prompt: 'Architect an audit log pipeline ingesting 100k events/sec from 50 microservices, ensuring exact-once semantics or deduplication, end-to-end encryption, and compliance retention for 7 years.',
    difficulty: 'Senior',
    evaluationCriteria: [
      'Decoupled ingestion with partitioned message brokers (Kafka/Pulsar)',
      'Idempotency key enforcement and distributed deduplication cache',
      'Tiered storage architecture: hot SSD -> warm object store -> cold archival Glacier',
      'Key rotation and cryptographic envelope encryption schema'
    ],
    probeQuestions: [
      'How do you handle schema evolution across microservices over 7 years?',
      'If a downstream consumer crashes mid-batch, how do you prevent duplicate processing?'
    ]
  },
  {
    id: 'q3',
    category: 'coding',
    title: 'Concurrent Task Scheduler with Resource Constraints',
    prompt: 'Implement an in-memory task scheduler that executes interdependent asynchronous jobs with concurrency limits and dependency resolution (DAG).',
    difficulty: 'Senior',
    evaluationCriteria: [
      'Correct topological sort or in-degree dependency graph resolution',
      'Worker pool with concurrency semaphore',
      'Cycle detection in job dependencies',
      'Graceful error handling and cancellation cascade'
    ],
    probeQuestions: [
      'How would you handle dynamic priority preemption for critical jobs?',
      'How do you prevent starvation when long-running jobs saturate the semaphore?'
    ],
    starterCode: {
      language: 'typescript',
      code: `export interface Job {
  id: string;
  dependencies: string[]; // Job IDs that must finish first
  run: () => Promise<void>;
}

export class DAGScheduler {
  constructor(private readonly maxConcurrency: number) {}

  async executeAll(jobs: Job[]): Promise<Map<string, 'success' | 'failed'>> {
    // TODO: Resolve DAG order and execute with worker limits
    const results = new Map<string, 'success' | 'failed'>();
    return results;
  }
}`
    }
  },
  {
    id: 'q4',
    category: 'behavioral',
    title: 'Navigating Architectural Disagreements & Tech Debt',
    prompt: 'Tell me about a time when you and another senior engineer or architect fundamentally disagreed on an architectural decision. How did you resolve the impasse, and what was the outcome?',
    difficulty: 'Senior',
    evaluationCriteria: [
      'Focuses on objective data, benchmarks, and customer outcomes rather than ego',
      'Demonstrates disagree and commit or structured spike/proof-of-concept resolution',
      'Reflects on the long-term impact on the team and system resilience'
    ],
    probeQuestions: [
      'Did the chosen path reveal any unforeseen trade-offs 6 months later?',
      'How did you maintain collaborative alignment with the peer after the decision?'
    ]
  }
];

export const INITIAL_INTERVIEW_SESSIONS: InterviewSession[] = [
  {
    id: 'int-live-01',
    candidateId: 'cand-01',
    candidateName: 'Elena Rostova',
    candidateEmail: 'elena.rostova@example.com',
    role: 'Staff Distributed Systems Engineer',
    targetLevel: 'L6 Staff',
    roundType: 'System Architecture',
    scheduledDate: '2026-10-15',
    startTime: '14:00',
    durationMinutes: 60,
    timezone: 'America/Los_Angeles (PDT)',
    status: 'live',
    panelists: [
      { name: 'Sarah Chen', role: 'Principal Architect (Lead)', isLead: true },
      { name: 'Devon Patel', role: 'Engineering Director' }
    ],
    meetingRoomId: 'VH-9024-CAL',
    passcode: '9024',
    transcriptSnippets: [
      { id: 't1', timestamp: '00:03', speaker: 'Sarah Chen (Lead)', text: 'Welcome Elena. Today we want to focus on designing a globally distributed rate limiting tier with multi-datacenter consistency.' },
      { id: 't2', timestamp: '00:45', speaker: 'Elena Rostova', text: 'Thank you Sarah. Before diving in, I want to clarify: are we optimizing strictly for write latency under 5ms, or is absolute strict precision more critical than availability during network partitions?' },
      { id: 't3', timestamp: '01:20', speaker: 'Sarah Chen (Lead)', text: 'Great question. Under partition, we prefer graceful degraded fail-open rather than dropping valid user checkout traffic.' },
      { id: 't4', timestamp: '02:15', speaker: 'Elena Rostova', text: 'Understood. That points toward a local in-memory token bucket per edge gateway instance, supplemented with an asynchronous Redis synchronization worker that publishes delta counters every 50ms.' }
    ],
    scorecard: {
      id: 'sc-01',
      interviewId: 'int-live-01',
      candidateId: 'cand-01',
      interviewerName: 'Sarah Chen',
      interviewerRole: 'Principal Architect',
      submittedAt: '2026-10-15T14:48:00Z',
      overallScore: 4.6,
      recommendation: 'Strong Hire',
      executiveSummary: 'Elena demonstrated exceptional depth in distributed consensus and failure domain isolation. She proactively scoped throughput vs consistency before writing architecture specs.',
      strengths: [
        'Nuanced grasp of token bucket vs sliding window tradeoffs under multi-region latency',
        'Strong production instincts: proposed fail-open fallback and telemetry circuits immediately',
        'Collaborative and calm communication cadence'
      ],
      concerns: [
        'Could have briefly addressed clock drift synchronization protocols (e.g. TrueTime vs NTP)'
      ],
      rubricBreakdown: DEFAULT_RUBRIC_CATEGORIES,
      calibrationNotes: 'Solid L6 Staff level performer. Exceeds standard bar on architectural tradeoffs.',
      suggestedFollowUp: [
        'Dig into operational incident postmortem examples in Executive round'
      ],
      notes: 'Elena started by establishing clear bounds. She diagrammed edge proxy layers with Envoy, decoupled rate calculation into a sidecar worker, and mitigated hot-partition keys.'
    }
  },
  {
    id: 'int-up-02',
    candidateId: 'cand-02',
    candidateName: 'Marcus Vance',
    candidateEmail: 'm.vance@example.com',
    role: 'Senior Platform Engineer',
    targetLevel: 'L5 Senior',
    roundType: 'Technical Coding',
    scheduledDate: '2026-10-15',
    startTime: '16:00',
    durationMinutes: 45,
    timezone: 'America/New_York (EDT)',
    status: 'upcoming',
    panelists: [
      { name: 'Alex Rivera', role: 'Staff SRE (Lead)', isLead: true }
    ],
    meetingRoomId: 'VH-4412-NYC',
    passcode: '4412'
  },
  {
    id: 'int-up-03',
    candidateId: 'cand-03',
    candidateName: 'Priya Nair',
    candidateEmail: 'priya.nair@example.com',
    role: 'Lead ML Infrastructure Architect',
    targetLevel: 'L6 Staff',
    roundType: 'Executive Debrief',
    scheduledDate: '2026-10-16',
    startTime: '10:30',
    durationMinutes: 45,
    timezone: 'America/Los_Angeles (PDT)',
    status: 'upcoming',
    panelists: [
      { name: 'Dr. Michael Hayes', role: 'VP of Engineering', isLead: true },
      { name: 'Claire Dubois', role: 'Head of Talent' }
    ],
    meetingRoomId: 'VH-7731-SFO',
    passcode: '7731'
  },
  {
    id: 'int-comp-04',
    candidateId: 'cand-04',
    candidateName: 'David Kim',
    candidateEmail: 'david.kim@example.com',
    role: 'Principal Security Engineer',
    targetLevel: 'L6 Principal',
    roundType: 'Values & Leadership',
    scheduledDate: '2026-10-14',
    startTime: '13:00',
    durationMinutes: 45,
    timezone: 'America/Chicago (CDT)',
    status: 'completed',
    panelists: [
      { name: 'Jessica Vance', role: 'CISO (Lead)', isLead: true }
    ],
    meetingRoomId: 'VH-1109-CHI',
    passcode: '1109',
    scorecard: {
      id: 'sc-04',
      interviewId: 'int-comp-04',
      candidateId: 'cand-04',
      interviewerName: 'Jessica Vance',
      interviewerRole: 'CISO',
      submittedAt: '2026-10-14T14:05:00Z',
      overallScore: 4.8,
      recommendation: 'Strong Hire',
      executiveSummary: 'David displayed world-class enterprise zero-trust security pedigree. Pragmatic communicator with clear history of rolling out cryptographic envelope protection at Fortune 50 scale.',
      strengths: [
        'Extensive knowledge of IAM federation and automated key rotation',
        'Balanced risk mitigation with developer productivity'
      ],
      concerns: [],
      rubricBreakdown: DEFAULT_RUBRIC_CATEGORIES.map(r => ({ ...r, score: 5 })),
      calibrationNotes: 'Unanimous hiring committee recommendation. Ready for formal offer package.',
      notes: 'Exceptional answers on mitigating supply-chain CI/CD vulnerabilities.'
    }
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-01',
    name: 'Elena Rostova',
    email: 'elena.rostova@example.com',
    phone: '+1 (415) 882-9014',
    location: 'San Francisco, CA (Hybrid / Remote)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    role: 'Staff Distributed Systems Engineer',
    department: 'Infrastructure',
    targetLevel: 'L6 Staff',
    currentCompany: 'Datacore Cloud Systems',
    yearsExperience: 11,
    stage: 'system_design',
    appliedDate: '2026-10-02',
    overallScore: 4.6,
    recommendation: 'Strong Hire',
    activeInterviewId: 'int-live-01',
    interviewSessions: [
      INITIAL_INTERVIEW_SESSIONS[0]
    ],
    skills: ['Distributed Systems', 'Go', 'Kubernetes Internals', 'Kafka', 'Raft / Paxos', 'eBPF'],
    resumeHighlights: [
      'Led architectural redesign of multi-tenant event pipeline ingesting 8M msgs/sec at 99.999% availability.',
      'Reduced p99 database query tail latency by 43% through intelligent connection pooling and cache warming.',
      'Authored 4 corporate RFCs on zero-downtime schema migrations across PostgreSQL shards.'
    ]
  },
  {
    id: 'cand-02',
    name: 'Marcus Vance',
    email: 'm.vance@example.com',
    phone: '+1 (206) 554-1892',
    location: 'Seattle, WA',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    role: 'Senior Platform Engineer',
    department: 'Platform',
    targetLevel: 'L5 Senior',
    currentCompany: 'Apex Scale Networks',
    yearsExperience: 7,
    stage: 'tech_screen',
    appliedDate: '2026-10-06',
    overallScore: 4.1,
    recommendation: 'Hire',
    activeInterviewId: 'int-up-02',
    interviewSessions: [
      INITIAL_INTERVIEW_SESSIONS[1]
    ],
    skills: ['Terraform', 'Rust', 'Linux Kernel Tuning', 'Prometheus', 'AWS Multi-Account'],
    resumeHighlights: [
      'Automated global multi-cluster failover reducing RTO from 18 minutes to 45 seconds.',
      'Standardized internal developer platform reducing service provision time from 3 days to 4 minutes.'
    ]
  },
  {
    id: 'cand-03',
    name: 'Priya Nair',
    email: 'priya.nair@example.com',
    phone: '+1 (650) 912-3401',
    location: 'Palo Alto, CA',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    role: 'Lead ML Infrastructure Architect',
    department: 'Data & AI',
    targetLevel: 'L6 Staff',
    currentCompany: 'TensorStream Labs',
    yearsExperience: 10,
    stage: 'executive_review',
    appliedDate: '2026-09-28',
    overallScore: 4.7,
    recommendation: 'Strong Hire',
    activeInterviewId: 'int-up-03',
    interviewSessions: [
      INITIAL_INTERVIEW_SESSIONS[2]
    ],
    skills: ['PyTorch Distributed', 'vLLM', 'Ray Cluster', 'Triton Inference', 'C++ / CUDA'],
    resumeHighlights: [
      'Orchestrated 2,048 H100 GPU cluster training pipelines with automatic fault tolerance and checkpointing.',
      'Decreased LLM serving inference p95 latency by 35% through continuous batching and KV-cache optimizations.'
    ]
  },
  {
    id: 'cand-04',
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+1 (312) 449-8011',
    location: 'Chicago, IL',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    role: 'Principal Security Engineer',
    department: 'Security',
    targetLevel: 'L6 Principal',
    currentCompany: 'Fortress Defense Tech',
    yearsExperience: 14,
    stage: 'offer_extended',
    appliedDate: '2026-09-20',
    overallScore: 4.8,
    recommendation: 'Strong Hire',
    activeInterviewId: 'int-comp-04',
    interviewSessions: [
      INITIAL_INTERVIEW_SESSIONS[3]
    ],
    skills: ['Zero Trust', 'Threat Modeling', 'SPIFFE / SPIRE', 'Cryptography', 'Audit & Compliance'],
    resumeHighlights: [
      'Designed FedRAMP High compliant identity plane for enterprise microservices.',
      'Pioneered automated vulnerability triage bot cutting mean-time-to-remediate (MTTR) by 60%.'
    ]
  },
  {
    id: 'cand-05',
    name: 'Chloe Mercier',
    email: 'c.mercier@example.com',
    phone: '+1 (617) 203-9112',
    location: 'Boston, MA (Remote)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    role: 'Staff Fullstack Architect',
    department: 'Product Engineering',
    targetLevel: 'L6 Staff',
    currentCompany: 'OmniFlow Solutions',
    yearsExperience: 9,
    stage: 'screening',
    appliedDate: '2026-10-12',
    overallScore: 3.9,
    recommendation: 'Hire',
    interviewSessions: [],
    skills: ['React Internals', 'Node.js', 'Next.js', 'GraphQL Federation', 'Microfrontends'],
    resumeHighlights: [
      'Engineered core design system adopted across 40+ engineering teams with zero breaking regressions.',
      'Achieved 100/100 Lighthouse performance score on mission-critical banking portal.'
    ]
  },
  {
    id: 'cand-06',
    name: 'Tariq Al-Mansoor',
    email: 'tariq.m@example.com',
    phone: '+1 (512) 809-2311',
    location: 'Austin, TX',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    role: 'Senior Site Reliability Engineer',
    department: 'Infrastructure',
    targetLevel: 'L5 Senior',
    currentCompany: 'CloudNexus Inc.',
    yearsExperience: 8,
    stage: 'applied',
    appliedDate: '2026-10-14',
    overallScore: undefined,
    recommendation: undefined,
    interviewSessions: [],
    skills: ['Kubernetes', 'BGP Routing', 'Datadog APM', 'Incident Command', 'Python'],
    resumeHighlights: [
      'Maintained 99.99% uptime SLA across 40,000 active customer tenants during peak holiday volume.'
    ]
  }
];
