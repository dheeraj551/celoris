import { TrainerTierLevel, TrainerProgress } from '../types';

export const TRAINER_LEVEL_TIERS: Record<
  TrainerTierLevel,
  { name: string; minXP: number; maxXP: number; color: string; desc: string; perks: string[] }
> = {
  1: {
    name: 'New Educator',
    minXP: 0,
    maxXP: 300,
    color: '#64748B',
    desc: 'Just getting started on Celoris. Build your first booth sessions and enquiries.',
    perks: ['List up to 3 courses', 'Appear in Public Trainer Directory', 'Basic booth hosting access'],
  },
  2: {
    name: 'Certified Trainer',
    minXP: 300,
    maxXP: 800,
    color: '#10B981',
    desc: 'Verified subject-matter trainer. Unlocks priority visibility and enhanced booking tools.',
    perks: ['Priority listing in Trainer Directory (+20% visibility)', 'Unlock Trainer Verification Exam', 'Custom booth branding'],
  },
  3: {
    name: 'Expert Mentor',
    minXP: 800,
    maxXP: 1800,
    color: '#059669',
    desc: 'Verified badge holder with a proven teaching track record. Unlocks premium student matching.',
    perks: ['Verified Mentor Badge on profile', 'Featured on Learn page carousel', 'Reduced platform commission (12% → 8%)'],
  },
  4: {
    name: 'Master Instructor',
    minXP: 1800,
    maxXP: 3500,
    color: '#047857',
    desc: 'Senior faculty status. Access to enterprise cohorts and higher-value engagements.',
    perks: ['Access to Enterprise & Corporate cohorts', 'Direct student-lead priority inbox', 'Dedicated success manager'],
  },
  5: {
    name: 'Celoris Elite Faculty',
    minXP: 3500,
    maxXP: 6000,
    color: '#064E3B',
    desc: 'Top 1% of trainers platform-wide. Full access to flagship programs and maximum revenue share.',
    perks: ['Invite-only Masterclass hosting', 'Gold Verified Faculty badge', 'Maximum revenue share (95%)'],
  },
};

export const INITIAL_TRAINER_PROGRESS: TrainerProgress = {
  level: 2,
  currentXP: 480,
  nextLevelXP: 800,
  sessionsHosted: 24,
  trainerRating: 4.8,
  badges: [
    {
      id: 'tb1',
      badgeTitle: 'Verified Subject Expert',
      subject: 'Web Development',
      verificationHash: 'TV-2026-WD-77K2',
      earnedDate: 'This week',
      rating: 4.9,
      sessionsCount: 24,
      badgeColor: '#10B981',
    },
    {
      id: 'tb2',
      badgeTitle: 'Top Rated Trainer',
      subject: 'Digital Marketing',
      verificationHash: 'TV-2026-TR-93F0',
      earnedDate: '2 weeks ago',
      rating: 5.0,
      sessionsCount: 38,
      badgeColor: '#059669',
    },
  ],
};
