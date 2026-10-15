import { Candidate, InterviewQuestion, InterviewSession, RubricCategory } from './types';

export const DEFAULT_RUBRIC_CATEGORIES: RubricCategory[] = [
  {
    id: 'system_design',
    name: 'Cloud & System Architecture',
    description: 'Ability to architect multi-tenant services, handle edge routing, evaluate database sharding, and balance latency vs consistency tradeoffs.',
    weight: 30,
    score: 4,
    rationale: 'Demonstrated solid grasp of isolated container quotas and edge TLS termination.',
  },
  {
    id: 'problem_solving',
    name: 'Clean Code & Engineering Precision',
    description: 'Algorithmic reasoning, modular TypeScript/React structure, edge-case mitigation, and maintainable design patterns.',
    weight: 25,
    score: 4,
    rationale: 'Clean modular implementation with defensive validation and clear type boundaries.',
  },
  {
    id: 'communication',
    name: 'Technical Communication & Scoping',
    description: 'Clear articulation of architectural tradeoffs, proactive constraint clarification, and receptive collaboration with interviewers.',
    weight: 20,
    score: 5,
    rationale: 'Articulate communication; verified requirements before jumping into code.',
  },
  {
    id: 'reliability',
    name: 'Operational Resilience & Edge Performance',
    description: 'Understanding of telemetry (p99 latency, TTFB), health checks, automated container recovery, and sub-second failovers.',
    weight: 15,
    score: 4,
    rationale: 'Proposed circuit breaking, health probes, and isolated pod resource quotas.',
  },
  {
    id: 'culture',
    name: 'Celoris Ownership & Collaborative Leadership',
    description: 'Mentorship mindset, accountability for production regressions, customer-first empathy, and high delivery velocity.',
    weight: 10,
    score: 4,
    rationale: 'Shared thoughtful examples of unblocking team members and managing technical debt.',
  },
];

export const INITIAL_INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'q1',
    category: 'system_design',
    title: 'Design a Multi-Tenant Cloud Pod & Subdomain Ingress Architecture',
    prompt: 'Architect an automated cloud hosting platform (similar to Celoris Cloud) that provisions an isolated 3 GB NVMe container with a custom subdomain (e.g. yourname.celoris.in), automatic Let\'s Encrypt wildcard TLS 1.3, and a MariaDB instance in under 60 seconds with 99.9% uptime SLA.',
    difficulty: 'Lead',
    evaluationCriteria: [
      'Proposes edge reverse proxy (Envoy / Traefik / Nginx) with dynamic SNI routing and automated TLS certificate caching',
      'Defines container isolation strategy (cgroups v2, disk quotas on NVMe, CPU burst credits)',
      'Implements automated database container provisioning with pooled connections and memory ceiling',
      'Addresses DDoS protection, rate limiting on pod creation, and cold storage archival for inactive subdomains'
    ],
    probeQuestions: [
      'How do you prevent a runaway subsite from saturating disk I/O on the shared NVMe host?',
      'If the automated Let\'s Encrypt rate limit is hit, how does your ingress queue fallback gracefully?',
      'How do you achieve 38ms median TTFB across Mumbai and Delhi edge nodes?'
    ],
    starterCode: {
      language: 'typescript',
      code: `// Multi-Tenant Ingress Router & Pod Provisioner
export interface PodProvisionRequest {
  subdomain: string;
  storageQuotaMb: number; // e.g. 3072 MB
  cmsEngine: 'wordpress' | 'nextjs' | 'static';
  region: 'asia-south1-mumbai' | 'asia-south1-delhi';
}

export interface PodProvisionResult {
  podId: string;
  subdomainUrl: string;
  tlsStatus: 'active' | 'pending';
  provisionTimeMs: number;
}

export class CelorisCloudIngressManager {
  private readonly reservedPrefixes = new Set(['admin', 'api', 'billing', 'cloud', 'status']);

  public async provisionPod(req: PodProvisionRequest): Promise<PodProvisionResult> {
    const cleanSub = req.subdomain.toLowerCase().trim();
    if (this.reservedPrefixes.has(cleanSub)) {
      throw new Error(\`Subdomain "\${cleanSub}" is reserved for system services.\`);
    }

    const startTime = Date.now();
    // TODO: Allocate NVMe volume, launch container, attach MariaDB and issue TLS certificate
    
    return {
      podId: \`pod-\${cleanSub}-\${Date.now()}\`,
      subdomainUrl: \`https://\${cleanSub}.celoris.in\`,
      tlsStatus: 'active',
      provisionTimeMs: Date.now() - startTime
    };
  }
}`
    }
  },
  {
    id: 'q2',
    category: 'coding',
    title: 'Concurrent Task Scheduler with DAG Dependency Graph',
    prompt: 'Implement an in-memory task scheduler that executes interdependent asynchronous deployment tasks with concurrency limits, cycle detection, and DAG dependency resolution.',
    difficulty: 'Senior',
    evaluationCriteria: [
      'Correct topological sorting or in-degree resolution of dependent tasks',
      'Worker pool concurrency limits enforced with Promise.race or semaphore',
      'Cycle detection prevents infinite deadlocks',
      'Graceful error handling and cascading cancellation of downstream tasks'
    ],
    probeQuestions: [
      'How would you handle priority preemption for high-priority emergency deployment tasks?',
      'How do you prevent worker starvation when long-running build tasks saturate the queue?'
    ],
    starterCode: {
      language: 'typescript',
      code: `export interface DeploymentTask {
  id: string;
  dependencies: string[]; // Task IDs that must successfully finish first
  run: () => Promise<void>;
}

export class DAGDeploymentScheduler {
  constructor(private readonly maxConcurrency: number = 3) {}

  async executeAll(tasks: DeploymentTask[]): Promise<Map<string, 'success' | 'failed'>> {
    const results = new Map<string, 'success' | 'failed'>();
    // TODO: Resolve dependency graph and run with worker limit
    return results;
  }
}`
    }
  },
  {
    id: 'q3',
    category: 'architecture',
    title: 'Next.js Server Components & Live Streaming Cache Optimization',
    prompt: 'Design the cache invalidation and data pipeline for an education and video studio dashboard serving 100,000 active students and creators with instant course updates and zero hydration mismatches.',
    difficulty: 'Senior',
    evaluationCriteria: [
      'Leverages Next.js App Router cache tags, on-demand revalidation, and React Server Components',
      'Handles WebSocket live presence syncing without database connection pool exhaustion',
      'Optimizes client-side bundle size with dynamic code splitting and modular icon trees'
    ],
    probeQuestions: [
      'How do you avoid cascading waterfall requests when rendering nested layout server components?',
      'What is your strategy for optimistic UI updates in real-time chat and video rooms?'
    ]
  },
  {
    id: 'q4',
    category: 'behavioral',
    title: 'Navigating Production Outages & Cross-Functional Deadlines',
    prompt: 'Tell me about a time when a critical release introduced a production regression or high-latency spike under heavy traffic. How did you triage the incident, communicate with leadership and customers, and prevent recurrence?',
    difficulty: 'Senior',
    evaluationCriteria: [
      'Prioritizes customer availability and rollback speed over finding immediate blame',
      'Communicates transparently with non-technical stakeholders and executive leadership',
      'Conducts blameless post-mortem with automated regression guards'
    ],
    probeQuestions: [
      'What metrics did you look at first to pinpoint the bottleneck?',
      'What permanent architectural safeguards were introduced in the sprint after the incident?'
    ]
  }
];

export const INITIAL_INTERVIEW_SESSIONS: InterviewSession[] = [
  {
    id: 'int-live-01',
    candidateId: 'cand-01',
    candidateName: 'Aryan Verma',
    candidateEmail: 'aryan.verma@celoris.in',
    role: 'Senior Full-Stack Next.js & Cloud Architect',
    targetLevel: 'L5 Senior',
    roundType: 'System Architecture',
    scheduledDate: '2026-10-16',
    startTime: '14:00',
    durationMinutes: 60,
    timezone: 'Asia/Kolkata (IST)',
    status: 'live',
    panelists: [
      { name: 'Dheeraj Kushwaha', role: 'Head of Technology (Lead)', isLead: true },
      { name: 'Priya Sharma', role: 'Engineering Director' }
    ],
    meetingRoomId: 'CEL-INT-9024',
    passcode: '9024',
    transcriptSnippets: [
      { id: 't1', timestamp: '00:05', speaker: 'Dheeraj (Lead)', text: 'Welcome Aryan. Today we want to focus on designing our multi-tenant cloud ingress tier for Celoris Cloud pods.' },
      { id: 't2', timestamp: '00:42', speaker: 'Aryan Verma', text: 'Thank you Dheeraj. Before jumping into diagrams: are we aiming for sub-second DNS/TLS issuance or can we batch certificate issuance in a background queue?' },
      { id: 't3', timestamp: '01:15', speaker: 'Dheeraj (Lead)', text: 'We promise user sites live in 60 seconds, so Let\'s Encrypt wildcard certificates are pre-warmed on the edge proxy.' },
      { id: 't4', timestamp: '02:10', speaker: 'Aryan Verma', text: 'Understood. That means we can use Traefik or Envoy with an in-memory certificate resolver and route *.celoris.in directly to the allocated Docker pod cgroup.' }
    ],
    scorecard: {
      id: 'sc-01',
      interviewId: 'int-live-01',
      candidateId: 'cand-01',
      interviewerName: 'Dheeraj Kushwaha',
      interviewerRole: 'Head of Technology',
      submittedAt: '2026-10-16T14:45:00Z',
      overallScore: 4.7,
      recommendation: 'Strong Hire',
      executiveSummary: 'Aryan demonstrated exceptional depth in container orchestration, Next.js App Router performance, and edge proxying. Proactive in scoping failure domains and latency SLAs.',
      strengths: [
        'Nuanced grasp of cgroup resource isolation and MariaDB connection pooling',
        'Strong production instincts: proposed pre-warmed TLS certificates and fail-open proxies',
        'Clear, articulate engineering communication'
      ],
      concerns: [
        'Could delve deeper into automated multi-region backup replication'
      ],
      rubricBreakdown: DEFAULT_RUBRIC_CATEGORIES,
      calibrationNotes: 'Top-tier performer. Meets and exceeds our senior engineering bar for Celoris Cloud.',
      suggestedFollowUp: [
        'Review experience with distributed tracing (OpenTelemetry / Grafana Tempo)'
      ],
      notes: 'Aryan immediately sketched clean boundaries between the ingress daemon, MariaDB container, and NVMe quotas.'
    }
  },
  {
    id: 'int-up-02',
    candidateId: 'cand-02',
    candidateName: 'Ananya Sharma',
    candidateEmail: 'ananya.sharma@celoris.in',
    role: 'Lead Product & UX Designer',
    targetLevel: 'L6 Lead',
    roundType: 'Values & Leadership',
    scheduledDate: '2026-10-16',
    startTime: '16:00',
    durationMinutes: 45,
    timezone: 'Asia/Kolkata (IST)',
    status: 'upcoming',
    panelists: [
      { name: 'Dheeraj Kushwaha', role: 'Head of Technology (Lead)', isLead: true }
    ],
    meetingRoomId: 'CEL-INT-4412',
    passcode: '4412'
  },
  {
    id: 'int-up-03',
    candidateId: 'cand-03',
    candidateName: 'Aarav Mehta',
    candidateEmail: 'aarav.mehta@celoris.in',
    role: 'Senior WordPress & Headless CMS Specialist',
    targetLevel: 'L5 Senior',
    roundType: 'Technical Coding',
    scheduledDate: '2026-10-17',
    startTime: '11:00',
    durationMinutes: 45,
    timezone: 'Asia/Kolkata (IST)',
    status: 'upcoming',
    panelists: [
      { name: 'Siddharth Rao', role: 'Senior CMS Architect', isLead: true }
    ],
    meetingRoomId: 'CEL-INT-7731',
    passcode: '7731'
  },
  {
    id: 'int-comp-04',
    candidateId: 'cand-04',
    candidateName: 'Priya Nair',
    candidateEmail: 'priya.nair@celoris.in',
    role: 'Lead AI & Machine Learning Systems',
    targetLevel: 'L6 Lead',
    roundType: 'Executive Debrief',
    scheduledDate: '2026-10-15',
    startTime: '15:30',
    durationMinutes: 45,
    timezone: 'Asia/Kolkata (IST)',
    status: 'completed',
    panelists: [
      { name: 'Dheeraj Kushwaha', role: 'Lead Architect', isLead: true }
    ],
    meetingRoomId: 'CEL-INT-1109',
    passcode: '1109',
    scorecard: {
      id: 'sc-04',
      interviewId: 'int-comp-04',
      candidateId: 'cand-04',
      interviewerName: 'Dheeraj Kushwaha',
      interviewerRole: 'Lead Architect',
      submittedAt: '2026-10-15T16:15:00Z',
      overallScore: 4.8,
      recommendation: 'Strong Hire',
      executiveSummary: 'Priya demonstrated elite expertise in low-latency AI inference pipelines, continuous batching with vLLM, and model serving. Ready for formal offer for our AI Studio team.',
      strengths: [
        'Deep understanding of GPU memory bandwidth and quantization (FP8 / AWQ)',
        'Extensive production experience serving generative video & voice models'
      ],
      concerns: [],
      rubricBreakdown: DEFAULT_RUBRIC_CATEGORIES.map(r => ({ ...r, score: 5 })),
      calibrationNotes: 'Unanimous hiring committee recommendation. Ready for offer rollout.',
      notes: 'Exceptional answers on mitigating GPU cold starts in cloud infrastructure.'
    }
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-01',
    name: 'Aryan Verma',
    email: 'aryan.verma@celoris.in',
    phone: '+91 98765 43210',
    location: 'Bangalore, India (Hybrid / Remote)',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
    role: 'Senior Full-Stack Next.js & Cloud Architect',
    department: 'Cloud & Infrastructure',
    targetLevel: 'L5 Senior',
    currentCompany: 'NovaScale Systems',
    yearsExperience: 8,
    stage: 'system_design',
    appliedDate: '2026-10-04',
    overallScore: 4.7,
    recommendation: 'Strong Hire',
    portfolioUrl: 'https://aryan-dev.celoris.in',
    activeInterviewId: 'int-live-01',
    interviewSessions: [
      INITIAL_INTERVIEW_SESSIONS[0]
    ],
    skills: ['Next.js 15', 'TypeScript', 'Docker & cgroups', 'Traefik', 'MariaDB', 'Redis', 'WebSockets'],
    resumeHighlights: [
      'Architected multi-tenant microservices supporting 2.4M monthly requests with sub-40ms TTFB.',
      'Reduced cloud infrastructure costs by 38% through intelligent connection pooling and container packing.',
      'Authored automated deployment pipelines reducing site provisioning latency from 5 minutes to 35 seconds.'
    ]
  },
  {
    id: 'cand-02',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@celoris.in',
    phone: '+91 98201 54321',
    location: 'Mumbai, India',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80',
    role: 'Lead Product & UX Designer',
    department: 'Design & Creative',
    targetLevel: 'L6 Lead',
    currentCompany: 'Studio Lumos Design',
    yearsExperience: 9,
    stage: 'culture_fit',
    appliedDate: '2026-10-06',
    overallScore: 4.6,
    recommendation: 'Strong Hire',
    portfolioUrl: 'https://ananya-design.celoris.in',
    activeInterviewId: 'int-up-02',
    interviewSessions: [
      INITIAL_INTERVIEW_SESSIONS[1]
    ],
    skills: ['Figma Design Systems', 'Dark-Mode UI', 'Motion Design', 'Micro-Interactions', 'UX Research'],
    resumeHighlights: [
      'Led the redesign of an enterprise SaaS analytics platform, driving a 42% increase in task completion speed.',
      'Constructed modular design token system utilized across 12 product squads.'
    ]
  },
  {
    id: 'cand-03',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@celoris.in',
    phone: '+91 99112 87654',
    location: 'Noida, India (Hybrid)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&q=80',
    role: 'Senior WordPress & Headless CMS Specialist',
    department: 'Product & Full-Stack',
    targetLevel: 'L5 Senior',
    currentCompany: 'Apex Digital Agency',
    yearsExperience: 7,
    stage: 'tech_screen',
    appliedDate: '2026-10-08',
    overallScore: 4.2,
    recommendation: 'Hire',
    portfolioUrl: 'https://aarav-portfolio.celoris.in',
    activeInterviewId: 'int-up-03',
    interviewSessions: [
      INITIAL_INTERVIEW_SESSIONS[2]
    ],
    skills: ['WordPress Core', 'Headless WP', 'PHP 8.3', 'Astra & Elementor Internals', 'MySQL Optimization'],
    resumeHighlights: [
      'Migrated 120+ client sites to NVMe-backed architecture achieving 98+ Google PageSpeed scores.',
      'Developed custom WooCommerce headless checkout yielding 28% higher conversion.'
    ]
  },
  {
    id: 'cand-04',
    name: 'Priya Nair',
    email: 'priya.nair@celoris.in',
    phone: '+91 97451 23456',
    location: 'Gurugram, India',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=256&q=80',
    role: 'Lead AI & Machine Learning Systems',
    department: 'AI & Data Engineering',
    targetLevel: 'L6 Lead',
    currentCompany: 'TensorCloud AI',
    yearsExperience: 10,
    stage: 'offer_extended',
    appliedDate: '2026-09-26',
    overallScore: 4.8,
    recommendation: 'Strong Hire',
    portfolioUrl: 'https://priya-ai.celoris.in',
    activeInterviewId: 'int-comp-04',
    interviewSessions: [
      INITIAL_INTERVIEW_SESSIONS[3]
    ],
    skills: ['PyTorch', 'vLLM', 'FastAPI', 'CUDA', 'Model Quantization', 'LangChain / LangGraph'],
    resumeHighlights: [
      'Deployed low-latency generative AI model serving pipelines handling 80,000 daily active generations.',
      'Decreased p95 inference latency by 45% through continuous tensor batching and KV-cache optimizations.'
    ]
  },
  {
    id: 'cand-05',
    name: 'Vikram Singhania',
    email: 'vikram.singhania@celoris.in',
    phone: '+91 98110 34567',
    location: 'Delhi, India',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
    role: 'Performance Marketing & Creative Growth Lead',
    department: 'Growth & Marketing',
    targetLevel: 'L5 Senior',
    currentCompany: 'Nexus Media Partners',
    yearsExperience: 6,
    stage: 'screening',
    appliedDate: '2026-10-12',
    overallScore: 4.0,
    recommendation: 'Hire',
    skills: ['Growth Marketing', 'Meta & Google Ads', 'Creative Funnels', 'A/B Testing', 'Retention Analytics'],
    interviewSessions: [],
    resumeHighlights: [
      'Scaled Indian edtech brand ad spend from ₹5L to ₹40L/month with a 3.4x blended ROAS.',
      'Built viral short-form video creative loops driving 1.2M organic views across Instagram & YouTube.'
    ]
  },
  {
    id: 'cand-06',
    name: 'Elena Rostova',
    email: 'elena.rostova@celoris.in',
    phone: '+1 (415) 882-9014',
    location: 'Remote (Global)',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=256&q=80',
    role: 'Staff Distributed Systems Engineer',
    department: 'Cloud & Infrastructure',
    targetLevel: 'L6 Lead',
    currentCompany: 'Global DataMesh',
    yearsExperience: 11,
    stage: 'applied',
    appliedDate: '2026-10-14',
    overallScore: undefined,
    recommendation: undefined,
    skills: ['Go', 'Distributed Consensus (Raft)', 'Kubernetes', 'Kafka', 'eBPF'],
    interviewSessions: [],
    resumeHighlights: [
      'Led the core infrastructure rewrite for a global telemetry pipeline handling 10M events/second.'
    ]
  }
];
