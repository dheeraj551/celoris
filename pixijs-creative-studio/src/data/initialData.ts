import { Student, ChatMessage } from '../types';

// Matching exactly the students shown in the reference image
export const INITIAL_STUDENTS: Student[] = [
  // Left Column list in UI
  { id: 'aarav', name: 'Aarav', isHandRaised: false, status: 'present', row: 3, col: -1.5, color: '#6366f1' },
  { id: 'diego', name: 'Diego', isHandRaised: false, status: 'present', row: 3, col: 0.5, color: '#3b82f6' },
  { id: 'ivan', name: 'Ivan', isHandRaised: true, status: 'present', row: 2, col: -2, color: '#f59e0b' },
  { id: 'kofi', name: 'Kofi', isHandRaised: false, status: 'away', row: 2, col: 0, color: '#64748b' },
  { id: 'tom', name: 'Tom', isHandRaised: false, status: 'present', row: 2, col: 2, color: '#10b981' },
  { id: 'rin', name: 'Rin', isHandRaised: true, status: 'present', row: 1, col: -1.2, color: '#ec4899' },
  { id: 'omar', name: 'Omar', isHandRaised: false, status: 'away', row: 1, col: 1.2, color: '#64748b' },

  // Right Column list in UI
  { id: 'mei', name: 'Mei', isHandRaised: true, status: 'present', row: 3, col: -0.5, color: '#eab308' },
  { id: 'zoya', name: 'Zoya', isHandRaised: false, status: 'present', row: 3, col: 1.5, color: '#8b5cf6' },
  { id: 'leah', name: 'Leah', isHandRaised: true, status: 'present', row: 2, col: -1, color: '#f59e0b' },
  { id: 'sara', name: 'Sara', isHandRaised: false, status: 'present', row: 2, col: 1, color: '#06b6d4' },
  { id: 'nour', name: 'Nour', isHandRaised: true, status: 'present', row: 3, col: 2.2, color: '#f97316' },
  { id: 'bea', name: 'Bea', isHandRaised: false, status: 'present', row: 1, col: 0, color: '#14b8a6' },
  { id: 'elif', name: 'Elif', isHandRaised: false, status: 'present', row: 3, col: -2.2, color: '#a855f7' },
];

export const INITIAL_CHAT: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'Mei',
    isTeacher: false,
    text: 'Can you zoom the board a bit?',
    time: '10:14 AM',
    avatarColor: '#eab308',
  },
  {
    id: 'msg-2',
    sender: 'Diego',
    isTeacher: false,
    text: 'The video helped, thanks!',
    time: '10:15 AM',
    avatarColor: '#3b82f6',
  },
];

export const PRESET_VIDEOS = [
  {
    id: 'v1',
    title: 'Wave Optics: Double Slit Interference',
    url: 'https://www.youtube.com/watch?v=Iuv6hY6zsd0',
    embedUrl: 'https://www.youtube-nocookie.com/embed/Iuv6hY6zsd0?autoplay=1',
  },
  {
    id: 'v2',
    title: 'Orbital Mechanics & Planetary Orbits',
    url: 'https://www.youtube.com/watch?v=76C_Z7o-xbg',
    embedUrl: 'https://www.youtube-nocookie.com/embed/76C_Z7o-xbg?autoplay=1',
  },
  {
    id: 'v3',
    title: 'Electromagnetic Spectrum & Light Wave',
    url: 'https://www.youtube.com/watch?v=m4t7gTmBK3g',
    embedUrl: 'https://www.youtube-nocookie.com/embed/m4t7gTmBK3g?autoplay=1',
  },
];

export const PRESET_SLIDES = [
  {
    title: 'Physics 201: Wave Optics & Interference',
    subtitle: 'Section 4.2 · Huygens Principle & Path Difference',
    content: [
      'Monochromatic coherent light passing through two slits separated by distance d.',
      'Constructive interference condition: d · sin(θ) = m · λ (where m = 0, ±1, ±2...)',
      'Destructive interference condition: d · sin(θ) = (m + 1/2) · λ',
      'Fringe spacing on observation screen: Δy = (λ · L) / d',
    ],
    formula: 'd · sin(θ) = m · λ',
  },
  {
    title: 'Electromagnetic Wave Propagation',
    subtitle: 'Maxwell Equations & Wave Velocity',
    content: [
      'Oscillating electric field E(x, t) perpendicular to magnetic field B(x, t).',
      'Propagation speed in vacuum: c = 1 / √(μ₀ · ε₀) ≈ 3.00 × 10⁸ m/s.',
      'Poynting vector S represents directional energy flux density: S = (1/μ₀) · (E × B).',
    ],
    formula: 'c = λ · f = 1 / √(μ₀ · ε₀)',
  },
  {
    title: 'Kinetic Energy & Relativistic Momentum',
    subtitle: 'Conservation Laws in High Energy Frames',
    content: [
      'Total energy: E² = (p · c)² + (m₀ · c²)²',
      'Relativistic gamma factor: γ = 1 / √(1 - v²/c²)',
      'For rest frame (v = 0): E = m₀ · c²',
    ],
    formula: 'E² = (pc)² + (m₀c²)²',
  },
];
