import { Room, User, Course, ChatMessage } from '../types';

export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    skill: 'UI/UX Design',
    college: 'NID Bengaluru',
    isOnline: true,
    isVerified: true,
  },
  {
    id: 'u2',
    name: 'Rohan Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    skill: 'Trading & Equity',
    college: 'SRCC Delhi',
    isOnline: true,
    isVerified: true,
  },
  {
    id: 'u3',
    name: 'Ananya Goel',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    skill: 'Zumba & Dance',
    college: 'Christ University',
    isOnline: true,
    isVerified: true,
  },
  {
    id: 'u4',
    name: 'Kabir Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    skill: 'Advanced Excel',
    college: 'NMIMS Mumbai',
    isOnline: true,
    isVerified: true,
  },
  {
    id: 'u5',
    name: 'Sneha Patel',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    skill: 'Guitar & Vocals',
    college: 'IIT Madras',
    isOnline: true,
    isVerified: true,
  },
  {
    id: 'u6',
    name: 'Vikram Singh',
    avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
    skill: 'Fullstack Coding',
    college: 'BITS Pilani',
    isOnline: true,
    isVerified: true,
  },
  {
    id: 'trainer-1',
    name: 'Coach Yash',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    skill: 'Head of Community',
    isOnline: true,
    isTrainer: true,
    isVerified: true,
  }
];

export const MOCK_ROOMS: Room[] = [
  {
    id: 'room-study',
    name: 'Silent Study Table',
    description: 'A cozy silent coworking desk. Mics off, focus music on. Perfect for deep learning sessions, coding, or reading.',
    category: 'study',
    onlineCount: 24,
    status: 'Live',
    tags: ['Mics Off', 'Focus Music', 'Pomodoro'],
    participants: [MOCK_USERS[0], MOCK_USERS[3], MOCK_USERS[5]],
  },
  {
    id: 'room-excel',
    name: 'Excel & Data Wizards',
    description: 'Formula troubleshooting, dashboard hacks, and macro optimizations. Stop crying over VLOOKUP and join the table!',
    category: 'course',
    onlineCount: 14,
    status: 'Live',
    tags: ['Excel Hacks', 'Dashboards', 'Skill Up'],
    participants: [MOCK_USERS[3], MOCK_USERS[1]],
  },
  {
    id: 'room-trading',
    name: 'Trading & Finance Café',
    description: 'Analyzing charts, talking options trading, and debating market trends. Casual sharing, zero paid courses spam.',
    category: 'course',
    onlineCount: 18,
    status: 'Live',
    tags: ['Stock Market', 'Crypto', 'F&O'],
    participants: [MOCK_USERS[1]],
  },
  {
    id: 'room-design',
    name: 'UI/UX & Creative Lounge',
    description: 'Figma review, portfolio feedback, and design system discussions. Bring your latest design files for a friendly critique!',
    category: 'course',
    onlineCount: 9,
    status: 'Ready',
    tags: ['Figma', 'Portfolio', 'Critique'],
    participants: [MOCK_USERS[0]],
  },
  {
    id: 'room-dance',
    name: 'Zumba & Rhythm Lounge',
    description: 'Where dancers and fitness enthusiasts hang out, share choreography vids, and plan their next dance sessions.',
    category: 'course',
    onlineCount: 7,
    status: 'Ready',
    tags: ['Dance', 'Zumba', 'Fitness Vibes'],
    participants: [MOCK_USERS[2]],
  },
  {
    id: 'room-mixer',
    name: 'The Open Mixer',
    description: 'Grab a hot chai and talk about anything. Metrolife, music, sports, or student life. Friendly, zero-pressure zone.',
    category: 'mixer',
    onlineCount: 32,
    status: 'Live',
    tags: ['Chai Chat', 'College Life', 'Icebreakers'],
    participants: [MOCK_USERS[2], MOCK_USERS[4], MOCK_USERS[0]],
  },
  {
    id: 'room-night',
    name: 'Night Owls Corner',
    description: 'For those studying or chilling past midnight. Deep talks, late-night lo-fi, and venting about exam pressures.',
    category: 'night',
    onlineCount: 11,
    status: 'Live',
    tags: ['Deep Talks', 'Lo-fi Music', 'Past 12 AM'],
    participants: [MOCK_USERS[4], MOCK_USERS[5]],
  },
  {
    id: 'room-newbie',
    name: 'New Here? Onboarding Hub',
    description: 'Meet community mentors, learn how Celoris Café works, and find your first learning group. Hosted by Yash.',
    category: 'onboarding',
    onlineCount: 5,
    status: 'Live',
    tags: ['Onboarding', 'Meet Mentors', 'Q&A'],
    host: {
      name: 'Coach Yash',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      role: 'Community Mentor',
    },
    participants: [MOCK_USERS[6], MOCK_USERS[1]],
  }
];

export const MOCK_COURSES: Course[] = [
  {
    id: 'c1',
    title: 'Advanced Excel & Business Analytics',
    instructor: 'Trainer Yash Verma',
    rating: 4.8,
    enrolledCount: 1840,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300',
    tag: 'Excel',
  },
  {
    id: 'c2',
    title: 'Financial Markets, Stocks & Options Trading',
    instructor: 'Rohan Mehta & Team',
    rating: 4.9,
    enrolledCount: 2240,
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=300',
    tag: 'Trading',
  },
  {
    id: 'c3',
    title: 'UI/UX Design Masterclass with Figma',
    instructor: 'Priya Sharma (NID)',
    rating: 4.7,
    enrolledCount: 1530,
    image: 'https://images.unsplash.com/photo-1561070791-26c113006238?w=300',
    tag: 'Design',
  },
  {
    id: 'c4',
    title: 'Choreography, Zumba & Modern Fitness',
    instructor: 'Ananya Goel',
    rating: 4.9,
    enrolledCount: 940,
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=300',
    tag: 'Dance',
  }
];

export const MOCK_CHATS: Record<string, ChatMessage[]> = {
  'room-study': [
    {
      id: 'm1',
      roomId: 'room-study',
      userId: 'u1',
      userName: 'Priya Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      text: 'Hey everyone, working on a new dashboard UI. Loving the lo-fi track that is playing on the desk today.',
      timestamp: '11:15 AM'
    },
    {
      id: 'm2',
      roomId: 'room-study',
      userId: 'u4',
      userName: 'Kabir Verma',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      text: 'Same here, studying SQL join syntax. Keeping it on mute, focusing hard!',
      timestamp: '11:16 AM'
    },
    {
      id: 'm3',
      roomId: 'room-study',
      userId: 'u6',
      userName: 'Vikram Singh',
      userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
      text: 'Debugging a tricky Express router issue. Love the silent table vibe.',
      timestamp: '11:18 AM'
    }
  ],
  'room-excel': [
    {
      id: 'me1',
      roomId: 'room-excel',
      userId: 'u4',
      userName: 'Kabir Verma',
      userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      text: 'Guys, is there any reason to use VLOOKUP anymore over XLOOKUP? XLOOKUP seems way faster and doesnâ€™t break when I insert columns.',
      timestamp: '11:20 AM'
    },
    {
      id: 'me2',
      roomId: 'room-excel',
      userId: 'u2',
      userName: 'Rohan Mehta',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      text: 'Agreed! XLOOKUP is standard now. Also, INDEX MATCH is still pretty relevant for legacy files, but XLOOKUP is the king.',
      timestamp: '11:22 AM'
    }
  ],
  'room-trading': [
    {
      id: 'mt1',
      roomId: 'room-trading',
      userId: 'u2',
      userName: 'Rohan Mehta',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      text: 'Market took a sharp turn today in the second half. Anyone trading Nifty options or just watching?',
      timestamp: '11:24 AM'
    }
  ],
  'room-design': [
    {
      id: 'md1',
      roomId: 'room-design',
      userId: 'u1',
      userName: 'Priya Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      text: 'Working on a dark-mode theme myself right now. Figma auto-layout is a lifesaver!',
      timestamp: '11:25 AM'
    }
  ],
  'room-dance': [
    {
      id: 'mda1',
      roomId: 'room-dance',
      userId: 'u3',
      userName: 'Ananya Goel',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      text: 'Hey rhythm tribe! Teaching a Zumba batch in Mumbai this evening, drop by if youâ€™re around!',
      timestamp: '11:26 AM'
    }
  ],
  'room-mixer': [
    {
      id: 'mx1',
      roomId: 'room-mixer',
      userId: 'u3',
      userName: 'Ananya Goel',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      text: 'Hot take: Filter coffee beats Starbucks any day. Discuss! ☕',
      timestamp: '11:27 AM'
    },
    {
      id: 'mx2',
      roomId: 'room-mixer',
      userId: 'u5',
      userName: 'Sneha Patel',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      text: 'Omg YES! Tapri chai > Filter Coffee > Starbucks. Change my mind! 😂',
      timestamp: '11:28 AM'
    }
  ],
  'room-night': [
    {
      id: 'mn1',
      roomId: 'room-night',
      userId: 'u5',
      userName: 'Sneha Patel',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      text: 'Jamming to some indie acoustic guitar tracks. Anyone up studying?',
      timestamp: '11:30 PM'
    },
    {
      id: 'mn2',
      roomId: 'room-night',
      userId: 'u6',
      userName: 'Vikram Singh',
      userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
      text: 'Yep, BITS Pilani exams are next week. Coffee is keeping me alive.',
      timestamp: '11:32 PM'
    }
  ],
  'room-newbie': [
    {
      id: 'mnew1',
      roomId: 'room-newbie',
      userId: 'trainer-1',
      userName: 'Coach Yash',
      userAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      text: 'Welcome to Celoris CafÃ©! Glad you popped in. Here, students hang out, learn skills together, and meet peer groups. Ask me anything!',
      timestamp: '11:35 AM',
      isTrainer: true
    }
  ]
};

// Auto responses dictionary to simulate a live experience
export const AUTO_RESPONSES: Record<string, Array<{ text: string; delay: number; senderName: string; avatar: string; skill: string }>> = {
  'room-study': [
    {
      senderName: 'Vikram Singh',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150',
      skill: 'Fullstack Coding',
      text: 'Nice point! Letâ€™s crush our session today.',
      delay: 2000
    },
    {
      senderName: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      skill: 'UI/UX Design',
      text: 'Absolutely. Back to deep focus mode! 🤫',
      delay: 4500
    }
  ],
  'room-excel': [
    {
      senderName: 'Kabir Verma',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      skill: 'Advanced Excel',
      text: 'Interesting. You should check out my latest dashboard template, I pinned it in the tools panel here!',
      delay: 2500
    },
    {
      senderName: 'Rohan Mehta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      skill: 'Trading & Equity',
      text: 'I use Pivot Tables for all my equity backtests. If you need any tips on combining GETPIVOTDATA with dynamic arrays, let me know!',
      delay: 5000
    }
  ],
  'room-trading': [
    {
      senderName: 'Rohan Mehta',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      skill: 'Trading & Equity',
      text: 'Whoa, you watch the charts too? What strategies do you usually deploy?',
      delay: 2000
    }
  ],
  'room-design': [
    {
      senderName: 'Priya Sharma',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      skill: 'UI/UX Design',
      text: 'Figma is amazing! Letâ€™s jump on a screen-share later if you want to look at spacing guidelines!',
      delay: 2000
    }
  ],
  'room-dance': [
    {
      senderName: 'Ananya Goel',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      skill: 'Zumba & Dance',
      text: 'Welcome! Do you dance or do you just like listening to energetic music?',
      delay: 2500
    }
  ],
  'room-mixer': [
    {
      senderName: 'Sneha Patel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      skill: 'Guitar & Vocals',
      text: 'Ahahaha totally! Also, hot chai hits different during the monsoon. What are you studying currently?',
      delay: 2000
    },
    {
      senderName: 'Ananya Goel',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      skill: 'Zumba & Dance',
      text: 'Haha yes, chai over coffee any day for late-night college gossip groups.',
      delay: 4500
    }
  ],
  'room-night': [
    {
      senderName: 'Sneha Patel',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
      skill: 'Guitar & Vocals',
      text: 'Yay, late-night squad! Iâ€™m learning a new A.R. Rahman song on guitar, might post a short snippet on the audio studio soon.',
      delay: 3000
    }
  ],
  'room-newbie': [
    {
      senderName: 'Coach Yash',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      skill: 'Head of Community',
      text: 'We are running a trial session for our design and trading cohorts tomorrow. Feel free to use the sidebar to check out Courses too!',
      delay: 2500
    }
  ]
};
