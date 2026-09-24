import { EmailItem, WhatsAppChat, JobOpening, ClassroomRoom, CreativeAppItem } from './types';

export const WHATSAPP_SUPPORT_NUMBER = "919084718101";

export const INITIAL_EMAILS: EmailItem[] = [
  {
    id: 'em-1',
    senderName: 'Celoris Careers Desk',
    senderRole: 'Verified Client Partner',
    senderType: 'employer',
    subject: 'Interview Invitation: Short-Form Video Editor',
    preview: 'A verified Delhi-NCR production agency reviewed your profile badge and scheduled a 15-minute quick meet...',
    body: `Hi Creator,

Great news! A verified digital brand on the Celoris Job Center has reviewed your skills and verified project portfolio.

Position: Senior Short-Form Video Editor (Reels & Shorts)
Compensation: ₹32,000 – ₹45,000 / month (Remote)
Requirements: CapCut / Premiere Pro, dynamic pacing, and sound design.

Your application passed the anti-cheat verification score. Tap the button below to review the job spec and respond to the hiring manager with zero platform fees.`,
    time: '12m ago',
    read: false,
    tag: 'Job Offer',
    actionText: 'View in Job Center',
    actionHref: '/job-center',
    actionType: 'link',
  },
  {
    id: 'em-2',
    senderName: 'Apex Creative Escrow',
    senderRole: 'Freelance Client Desk',
    senderType: 'freelancer',
    subject: 'Milestone Escrow Funded: ₹35,000 for 10 Reels',
    preview: 'The client has safely funded Milestone 1. You may now commence production with guaranteed payment release...',
    body: `Hi there,

Your project contract with Apex Creative has been securely funded into Celoris Escrow.

Project: 10 High-Retention Vertical Ads
Escrow Amount: ₹35,000
Platform Commission: 0% (Free for Creators)

You can coordinate directly with the client team on WhatsChat or submit draft cuts for review.`,
    time: '1h ago',
    read: false,
    tag: 'Escrow Paid',
    actionText: 'Connect on WhatsChat',
    actionHref: `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent("Hi Celoris! I have a question regarding my freelance project escrow.")}`,
    actionType: 'chat',
  },
  {
    id: 'em-3',
    senderName: 'Mentor Rahul — Celoris Academy',
    senderRole: 'Lead Video Instructor',
    senderType: 'academy',
    subject: 'Live Doubt-Clearing Room Starting Now',
    preview: 'We are opening the interactive video lounge to review timeline color grading and audio leveling tricks...',
    body: `Hey Team,

Tonight's live practical breakout session is now live in the Classroom lounge!

Agenda:
• Fixing over-exposed 4K footage
• Viral audio rhythm syncing
• Free presets download link

Jump in now — no webcam required, just listen or share your screen.`,
    time: '2h ago',
    read: true,
    tag: 'Live Class',
    actionText: 'Join Classroom',
    actionHref: '/learn',
    actionType: 'link',
  },
  {
    id: 'em-4',
    senderName: 'Celoris Cloud Support',
    senderRole: 'System Dispatch',
    senderType: 'support',
    subject: 'Welcome to Celoris! Daily AI Credits Refilled',
    preview: 'Your free tier creator account has been credited with daily tokens to explore our 20+ generative AI video & image models...',
    body: `Welcome to India's Creative Studio & Academy!

Your account is loaded with complimentary daily creative credits. You can immediately access:
1. 4K Browser Video Editor (No watermark)
2. Photoshop-style Layered Photo Studio
3. 20+ Generative AI models
4. Free job applications with zero middleman deductions.

No credit card is ever required. Start building your portfolio today!`,
    time: 'Yesterday',
    read: true,
    tag: 'System',
    actionText: 'Launch AI Explorer',
    actionHref: '/ai-explorer',
    actionType: 'link',
  }
];

export const WHATSAPP_CHATS: WhatsAppChat[] = [
  {
    id: 'wa-1',
    title: 'Celoris Student Community',
    category: 'community',
    avatarBg: 'bg-emerald-600',
    iconType: 'community',
    membersCount: '1,420 members',
    lastMessage: 'Aman: Anyone tried the new 4K audio denoising tool yet?',
    time: '10:41 PM',
    unreadCount: 0,
    isOnline: true,
    prefillMessage: 'Hi Celoris Community! I would like to join the active student discussion group.',
  },
  {
    id: 'wa-2',
    title: 'Short-Form Video Creators Hub',
    category: 'group',
    avatarBg: 'bg-blue-600',
    iconType: 'video',
    membersCount: '890 editors',
    lastMessage: 'Vicky: Just dropped 5 free viral sound effect packs in the lounge! 🔥',
    time: '9:25 PM',
    unreadCount: 0,
    isOnline: true,
    prefillMessage: 'Hi! I want to connect with fellow video editors in the Celoris Creators Hub.',
  },
  {
    id: 'wa-3',
    title: 'Fullstack & AI Builders Batch',
    category: 'group',
    avatarBg: 'bg-purple-600',
    iconType: 'code',
    membersCount: '640 learners',
    lastMessage: 'Dev: Live coding session starts in 10 mins. Link posted!',
    time: '8:15 PM',
    unreadCount: 0,
    isOnline: true,
    prefillMessage: 'Hi! I am interested in joining the Fullstack & AI student study group.',
  },
  {
    id: 'wa-4',
    title: 'Celoris Official Helpdesk',
    category: 'support',
    avatarBg: 'bg-teal-600',
    iconType: 'support',
    membersCount: 'Verified Business',
    lastMessage: 'Support: Message us any time — we reply as soon as we can.',
    time: 'Online',
    unreadCount: 0,
    isOnline: true,
    prefillMessage: 'Hi Celoris Team! I would like some assistance regarding courses and tools.',
  },
];

export const HOT_JOBS: JobOpening[] = [
  {
    id: 'job-1',
    title: 'Short-Form Video Editor',
    company: 'Viral Media Collective',
    rate: '₹32,000 / mo',
    type: 'Remote',
    tag: 'Hot Gig',
    category: 'video',
    verified: true,
  },
  {
    id: 'job-2',
    title: 'Next.js & Supabase Developer',
    company: 'HyperScale Apps',
    rate: '₹48,000 / mo',
    type: 'Full-time',
    tag: 'Verified',
    category: 'dev',
    verified: true,
  },
  {
    id: 'job-3',
    title: 'Thumbnail & Poster Designer',
    company: 'YouTube Creator Studio',
    rate: '₹25,000 / mo',
    type: 'Freelance',
    tag: 'Quick Hire',
    category: 'design',
    verified: true,
  },
  {
    id: 'job-4',
    title: 'AI Prompt & Workflow Artist',
    company: 'Studio Autonomous',
    rate: '₹40,000 / mo',
    type: 'Remote',
    tag: 'New',
    category: 'ai',
    verified: true,
  }
];

export const CLASSROOM_ROOMS: ClassroomRoom[] = [
  {
    id: 'cr-1',
    name: 'AI Video & Motion Lab',
    instructor: 'Mentor Vicky',
    topic: 'CapCut & Premiere Viral Workflows',
    activeLearners: 16,
    status: 'live',
    category: 'Video Editing',
  },
  {
    id: 'cr-2',
    name: 'Fullstack Dev Focus Room',
    instructor: 'Aman Sharma',
    topic: 'Tailwind + React Architecture',
    activeLearners: 11,
    status: 'live',
    category: 'Web Dev',
  },
  {
    id: 'cr-3',
    name: 'Free Masterclass Demo',
    instructor: 'Celoris Faculty',
    topic: 'Digital Marketing & AI Funnels',
    activeLearners: 24,
    status: 'upcoming',
    timeNotice: 'Starts Today at 8:00 PM',
    category: 'Marketing',
  },
];

export const CREATIVE_APPS: CreativeAppItem[] = [
  {
    id: 'app-video',
    name: 'Video Studio',
    shortDesc: '4K AI timeline video editor in your browser',
    badge: 'Free to Start',
    iconColor: 'text-rose-400',
    bgColor: 'from-rose-500/20 to-red-600/10 border-rose-500/30',
    href: '/video-studio',
  },
  {
    id: 'app-image',
    name: 'Image Studio',
    shortDesc: 'Photoshop-grade layers, filters & photo editing',
    badge: 'PhotoLite',
    iconColor: 'text-blue-400',
    bgColor: 'from-blue-500/20 to-cyan-600/10 border-blue-500/30',
    href: '/image-studio',
  },
  {
    id: 'app-ai',
    name: 'AI Explorer',
    shortDesc: '20+ top generative vision & video models',
    badge: '20+ AI Models',
    iconColor: 'text-purple-400',
    bgColor: 'from-purple-500/20 to-indigo-600/10 border-purple-500/30',
    href: '/ai-explorer',
  },
  {
    id: 'app-vault',
    name: 'PolyVault 3D',
    shortDesc: 'Interactive 3D models and creative asset vault',
    badge: 'Real-time 3D',
    iconColor: 'text-emerald-400',
    bgColor: 'from-emerald-500/20 to-teal-600/10 border-emerald-500/30',
    href: '/polyvault',
  },
];
