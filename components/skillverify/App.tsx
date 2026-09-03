/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { JobPortal } from './components/JobPortal';
import { ProgressionDashboard } from './components/ProgressionDashboard';
import { ExamsHub } from './components/ExamsHub';
import { CandidateProfileEditor } from './components/CandidateProfileEditor';
import { JobDetailsModal } from './components/JobDetailsModal';
import { AntiCheatExamModal } from './components/AntiCheatExamModal';
import { AIExamGeneratorModal } from './components/AIExamGeneratorModal';
import { JobAlertsDrawer } from './components/JobAlertsDrawer';
import { InteractiveTour } from './components/InteractiveTour';
import { LevelUpModal } from './components/LevelUpModal';
import { 
  INITIAL_JOBS, 
  PREBUILT_EXAMS, 
  INITIAL_USER_PROFILE, 
  LEVEL_TIERS 
} from './data/mockData';
import { 
  UserProfile, 
  JobListing, 
  ExamDefinition, 
  ExamResult, 
  JobTier, 
  JobAlertConfig, 
  LiveAlertNotification, 
  UserTierLevel 
} from './types';
import { soundFx } from './utils/audio';
import { useAuth } from '@/components/providers/AuthProvider';
import { createClient } from '@/lib/supabase-client';
import { formatDistanceToNow } from 'date-fns';

// Converts a public.certified_jobs / public.public_jobs row into the
// JobListing shape the rest of this app already understands, so
// JobPortal/JobDetailsModal need no changes regardless of which tier a job
// came from.
function mapJobRow(row: any, tier: JobTier): JobListing {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    logo: row.logo || '💼',
    location: row.location || 'Remote',
    salaryRange: row.salary_range || '',
    minSalaryNum: row.min_salary_num ?? 0,
    industry: row.industry || 'General',
    tier,
    minLevelRequired: row.min_level_required ?? 1,
    requiredBadges: row.required_badges || [],
    requiredSkills: row.required_skills || [],
    workMode: row.work_mode || 'Remote',
    description: row.description || '',
    responsibilities: row.responsibilities || [],
    benefits: row.benefits || [],
    postedAgo: row.created_at
      ? formatDistanceToNow(new Date(row.created_at), { addSuffix: true })
      : 'recently',
    applicantsCount: row.applicants_count ?? 0,
    featured: !!row.featured,
    hiringManagerVerified: !!row.hiring_manager_verified,
    sourceUrl: row.source_url || undefined,
  };
}

export default function App() {
  // Real signed-in account — used only to replace the ported app's
  // placeholder profile name/email below. All gamified stats (XP,
  // level, badges) stay local demo data tied to `user`.
  const { user: authUser, profile: authProfile } = useAuth();

  // Navigation
  const [activeView, setActiveView] = useState<'jobs' | 'progression' | 'exams' | 'profile'>('jobs');
  const [selectedJobTier, setSelectedJobTier] = useState<JobTier>('public');

  // Core Data
  // Both tiers are now fetched live from Supabase (public.certified_jobs and
  // public.public_jobs) below. Any cached jobs from an older build are
  // dropped here so a stale local cache can't bring old placeholder listings
  // back — INITIAL_JOBS is empty for the same reason.
  const [jobs, setJobs] = useState<JobListing[]>(() => {
    const saved = localStorage.getItem('skillverify_jobs');
    const initial: JobListing[] = saved ? JSON.parse(saved) : INITIAL_JOBS;
    return initial.filter((j) => j.tier !== 'certified' && j.tier !== 'public');
  });

  // Fetch live Certified Roles listings from Supabase and merge them in.
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    (async () => {
      const { data, error } = await supabase
        .from('certified_jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (cancelled) return;
      if (error) {
        console.error('Error fetching certified jobs:', error);
        return;
      }

      const certifiedJobs = (data || []).map((row: any) => mapJobRow(row, 'certified'));
      setJobs((prev) => [...prev.filter((j) => j.tier !== 'certified'), ...certifiedJobs]);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch live Public Jobs listings from Supabase and merge them in.
  useEffect(() => {
    let cancelled = false;
    const supabase = createClient();

    (async () => {
      const { data, error } = await supabase
        .from('public_jobs')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (cancelled) return;
      if (error) {
        console.error('Error fetching public jobs:', error);
        return;
      }

      const publicJobs = (data || []).map((row: any) => mapJobRow(row, 'public'));
      setJobs((prev) => [...prev.filter((j) => j.tier !== 'public'), ...publicJobs]);
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const [exams, setExams] = useState<ExamDefinition[]>(() => {
    const saved = localStorage.getItem('skillverify_exams');
    return saved ? JSON.parse(saved) : PREBUILT_EXAMS;
  });

  // A browser that already cached `skillverify_exams` before a new exam was
  // added to PREBUILT_EXAMS (e.g. the Creative Content & Social Media Design
  // cert) would otherwise never see it without clearing local storage — pull
  // in anything new by id.
  useEffect(() => {
    setExams((prev) => {
      const existingIds = new Set(prev.map((e) => e.id));
      const missing = PREBUILT_EXAMS.filter((e) => !existingIds.has(e.id));
      return missing.length > 0 ? [...prev, ...missing] : prev;
    });
  }, []);

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('skillverify_user');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

  // Real, persisted progress & badges (public.job_center_progress /
  // public.job_center_badges) — this is what makes a shared candidate
  // profile (see CandidateProfile.tsx) show genuine, per-user achievements
  // instead of the same local demo numbers every browser starts with.
  // Earning a badge (handleExamCompleted, below) writes back to these same
  // tables, so this is a real sync, not a one-way read.
  useEffect(() => {
    if (!authUser?.id) return;
    let cancelled = false;
    const supabase = createClient();

    (async () => {
      const [{ data: progressRow }, { data: badgeRows }] = await Promise.all([
        supabase.from('job_center_progress').select('*').eq('id', authUser.id).maybeSingle(),
        supabase.from('job_center_badges').select('*').eq('user_id', authUser.id).order('earned_date', { ascending: false }),
      ]);

      if (cancelled) return;

      const currentXP = progressRow?.current_xp ?? 0;
      const honorScore = progressRow?.honor_score ?? 100;
      const checked = checkLevelProgression(currentXP, 1);
      const verifiedBadges = (badgeRows || []).map((row: any) => ({
        id: row.id,
        badgeTitle: row.badge_title,
        skillName: row.skill_name || '',
        industry: row.industry || '',
        verificationHash: row.verification_hash || '',
        earnedDate: row.earned_date ? formatDistanceToNow(new Date(row.earned_date), { addSuffix: true }) : 'recently',
        score: row.score ?? 0,
        proctorScore: row.proctor_score ?? 0,
        badgeColor: row.badge_color || '#10B981',
      }));

      setUser((prev) => ({
        ...prev,
        currentXP,
        honorScore,
        level: checked.level,
        levelTitle: checked.levelTitle,
        nextLevelXP: checked.nextLevelXP,
        verifiedBadges,
      }));
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.id]);

  // Modals & Panels
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [activeExam, setActiveExam] = useState<ExamDefinition | null>(null);
  const [isAIExamModalOpen, setIsAIExamModalOpen] = useState(false);
  const [isAlertsDrawerOpen, setIsAlertsDrawerOpen] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [newLevelEarned, setNewLevelEarned] = useState<UserTierLevel | null>(null);

  // Sound
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Job Alerts Configuration & Feed
  const [alertConfig, setAlertConfig] = useState<JobAlertConfig>({
    enabled: true,
    frequency: 'Instant',
    keywords: ['React', 'TypeScript', 'AI', 'Cloud', 'Cybersecurity'],
    industries: ['AI / Machine Learning', 'Cloud & Infrastructure', 'FinTech', 'SaaS / Web Platforms'],
    minSalary: 100000,
    remoteOnly: false,
    soundAlerts: true,
    unlockedOnly: false,
  });

  // Both hardcoded placeholder seed alerts pointed at mock jobs that no
  // longer exist now that both tiers are fetched live from Supabase — seeded
  // with the real "AI Video Editor" listing instead so the alert stays
  // clickable (its id comes from the row inserted into public.public_jobs).
  const [alerts, setAlerts] = useState<LiveAlertNotification[]>([
    {
      id: 'alert-init-1',
      jobId: 'c81a9b48-1924-4c5a-91c9-a2149657f5e7',
      jobTitle: 'AI Video Editor',
      company: 'Celoris Designs',
      salaryRange: 'Contract (rate not disclosed)',
      matchScore: 88,
      timestamp: '5 days ago',
      read: true,
      tier: 'public',
    },
  ]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('skillverify_user', JSON.stringify(user));
  }, [user]);

  // Swap the placeholder profile name ("Alex Mercer") for the real
  // signed-in account's name once it's available.
  useEffect(() => {
    if (!authUser) return;
    const realName = authProfile?.full_name || authUser.email?.split('@')[0] || 'User';
    const realEmail = authUser.email || undefined;
    setUser((prev) => {
      if (prev.name === realName && (!realEmail || prev.email === realEmail)) return prev;
      return { ...prev, name: realName, ...(realEmail ? { email: realEmail } : {}) };
    });
  }, [authUser, authProfile]);

  useEffect(() => {
    localStorage.setItem('skillverify_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('skillverify_exams', JSON.stringify(exams));
  }, [exams]);

  // Active Platform Time Accumulator & XP Tick
  useEffect(() => {
    const timer = setInterval(() => {
      setUser((prevUser) => {
        const newTotalSecs = prevUser.totalTimeSpentSeconds + 1;
        // Award +5 XP every 60 seconds of active platform time
        if (newTotalSecs > 0 && newTotalSecs % 60 === 0) {
          const addedXP = 5;
          const nextXP = prevUser.currentXP + addedXP;
          const checkedLevel = checkLevelProgression(nextXP, prevUser.level);
          return {
            ...prevUser,
            totalTimeSpentSeconds: newTotalSecs,
            currentXP: nextXP,
            level: checkedLevel.level,
            levelTitle: checkedLevel.levelTitle,
            nextLevelXP: checkedLevel.nextLevelXP,
          };
        }
        return {
          ...prevUser,
          totalTimeSpentSeconds: newTotalSecs,
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Check XP Progression & Level threshold
  const checkLevelProgression = (currentXP: number, currentLevel: UserTierLevel) => {
    let level: UserTierLevel = 1;
    if (currentXP >= 2500) level = 5;
    else if (currentXP >= 1200) level = 4;
    else if (currentXP >= 600) level = 3;
    else if (currentXP >= 250) level = 2;
    else level = 1;

    const tier = LEVEL_TIERS[level];
    if (level > currentLevel) {
      setNewLevelEarned(level);
    }

    return {
      level,
      levelTitle: tier.name,
      nextLevelXP: tier.maxXP,
    };
  };

  // Award XP Helper
  const handleAwardXP = (amount: number) => {
    setUser((prev) => {
      const nextXP = prev.currentXP + amount;
      const checked = checkLevelProgression(nextXP, prev.level);
      return {
        ...prev,
        currentXP: nextXP,
        level: checked.level,
        levelTitle: checked.levelTitle,
        nextLevelXP: checked.nextLevelXP,
      };
    });
  };

  // Handle Exam Finished & Badge Issuance
  const handleExamCompleted = (result: ExamResult) => {
    soundFx.playNotification();
    let nextXPForSync = 0;
    let nextHonorForSync = 0;

    setUser((prev) => {
      const updatedBadges = result.badgeEarned
        ? [...prev.verifiedBadges.filter((b) => b.badgeTitle !== result.badgeEarned!.badgeTitle), result.badgeEarned]
        : prev.verifiedBadges;

      const nextXP = prev.currentXP + result.xpEarned;
      const nextHonor = Math.round((prev.honorScore + result.honorScore) / 2);
      const checked = checkLevelProgression(nextXP, prev.level);
      nextXPForSync = nextXP;
      nextHonorForSync = nextHonor;

      return {
        ...prev,
        currentXP: nextXP,
        level: checked.level,
        levelTitle: checked.levelTitle,
        nextLevelXP: checked.nextLevelXP,
        verifiedBadges: updatedBadges,
        honorScore: nextHonor,
        examHistory: [result, ...prev.examHistory],
      };
    });

    // Persist to Supabase so this badge/XP is real and shows up on the
    // shareable public candidate profile — not just this browser's
    // localStorage. Best-effort: a sync failure shouldn't block the exam
    // result the user already sees locally.
    if (authUser?.id) {
      const supabase = createClient();
      supabase
        .from('job_center_progress')
        .upsert({
          id: authUser.id,
          current_xp: nextXPForSync,
          honor_score: nextHonorForSync,
          updated_at: new Date().toISOString(),
        })
        .then(({ error }: { error: any }) => {
          if (error) console.error('Error syncing job center progress:', error);
        });

      if (result.badgeEarned) {
        const badge = result.badgeEarned;
        supabase
          .from('job_center_badges')
          .insert({
            user_id: authUser.id,
            badge_title: badge.badgeTitle,
            skill_name: badge.skillName,
            industry: badge.industry,
            verification_hash: badge.verificationHash,
            score: badge.score,
            proctor_score: badge.proctorScore,
            badge_color: badge.badgeColor,
          })
          .then(({ error }: { error: any }) => {
            if (error) console.error('Error syncing job center badge:', error);
          });
      }
    }
  };

  // Handle Applying for a Job
  const handleApplyJob = (jobId: string) => {
    setUser((prev) => {
      if (prev.appliedJobIds.includes(jobId)) return prev;
      return {
        ...prev,
        appliedJobIds: [...prev.appliedJobIds, jobId],
      };
    });
    // Award XP for applying
    handleAwardXP(25);
  };

  // Launch Exam for Badge from Job card
  const handleLaunchExamForBadge = (badgeTitle: string) => {
    const matchingExam = exams.find(
      (e) => e.badgeTitle.toLowerCase() === badgeTitle.toLowerCase() || e.skillName.toLowerCase().includes(badgeTitle.toLowerCase())
    );
    if (matchingExam) {
      if (selectedJob) setSelectedJob(null);
      setActiveExam(matchingExam);
    } else {
      // Open AI exam generator with that title preset
      setIsAIExamModalOpen(true);
    }
  };

  // Trigger Simulated Alert
  const handleTriggerTestAlert = () => {
    const randomJob = jobs[Math.floor(Math.random() * jobs.length)];
    const newAlert: LiveAlertNotification = {
      id: `alert-${Date.now()}`,
      jobId: randomJob.id,
      jobTitle: randomJob.title,
      company: randomJob.company,
      salaryRange: randomJob.salaryRange,
      matchScore: Math.floor(Math.random() * 15) + 85,
      timestamp: 'Just now',
      read: false,
      tier: randomJob.tier,
    };
    setAlerts((prev) => [newAlert, ...prev]);
    soundFx.playNotification();
  };

  // Select job from Alert
  const handleSelectAlertJob = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      setSelectedJob(job);
      setIsAlertsDrawerOpen(false);
      setAlerts((prev) =>
        prev.map((a) => (a.jobId === jobId ? { ...a, read: true } : a))
      );
    }
  };

  const handleMarkAllAlertsRead = () => {
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
  };

  const handleToggleSound = () => {
    soundFx.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  const unreadAlertsCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-[#453C38] flex flex-col font-sans transition-colors selection:bg-[#7C9070]/20 selection:text-[#2C2523]">
      
      {/* Top Main Navigation Header */}
      <Header
        user={user}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAlerts={() => setIsAlertsDrawerOpen(true)}
        unreadAlertsCount={unreadAlertsCount}
        onStartTour={() => setIsTourOpen(true)}
        onOpenAIExamModal={() => setIsAIExamModalOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* VIEW 1: JOB MARKETPLACE (DUAL PORTALS) */}
        {activeView === 'jobs' && (
          <JobPortal
            jobs={jobs}
            user={user}
            selectedTier={selectedJobTier}
            onSelectTier={setSelectedJobTier}
            onSelectJob={(job) => setSelectedJob(job)}
            onLaunchExamForBadge={handleLaunchExamForBadge}
          />
        )}

        {/* VIEW 2: PROGRESSION & VERIFIED PASSPORT */}
        {activeView === 'progression' && (
          <ProgressionDashboard
            user={user}
            onOpenExamsTab={() => setActiveView('exams')}
            onOpenAIExamModal={() => setIsAIExamModalOpen(true)}
          />
        )}

        {/* VIEW 3: ANTI-CHEAT EXAMS HUB */}
        {activeView === 'exams' && (
          <ExamsHub
            exams={exams}
            user={user}
            onSelectExam={(exam) => setActiveExam(exam)}
            onOpenAIExamModal={() => setIsAIExamModalOpen(true)}
          />
        )}

        {/* VIEW 4: CANDIDATE PROFILE EDITOR — build & share a public profile,
            same pattern as the Teach section's trainer resume. */}
        {activeView === 'profile' && <CandidateProfileEditor />}

      </main>

      {/* MODALS & OVERLAYS */}

      {/* Job Details & 1-Click Apply Modal */}
      {selectedJob && (
        <JobDetailsModal
          job={selectedJob}
          user={user}
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          onApply={handleApplyJob}
          onLaunchExamForJob={(badge) => handleLaunchExamForBadge(badge)}
        />
      )}

      {/* Anti-Cheat Proctored Exam Modal */}
      {activeExam && (
        <AntiCheatExamModal
          exam={activeExam}
          isOpen={!!activeExam}
          onClose={() => setActiveExam(null)}
          onExamComplete={handleExamCompleted}
        />
      )}

      {/* AI Custom Exam Generator Modal */}
      {isAIExamModalOpen && (
        <AIExamGeneratorModal
          isOpen={isAIExamModalOpen}
          onClose={() => setIsAIExamModalOpen(false)}
          onExamGenerated={(newExam) => {
            setExams((prev) => [newExam, ...prev]);
            setActiveExam(newExam);
          }}
        />
      )}

      {/* Real-time Job Alerts Drawer */}
      <JobAlertsDrawer
        isOpen={isAlertsDrawerOpen}
        onClose={() => setIsAlertsDrawerOpen(false)}
        alerts={alerts}
        alertConfig={alertConfig}
        onUpdateAlertConfig={setAlertConfig}
        onSelectAlertJob={handleSelectAlertJob}
        onTriggerTestAlert={handleTriggerTestAlert}
        onMarkAllAsRead={handleMarkAllAlertsRead}
      />

      {/* Guided Beginner Tour */}
      <InteractiveTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateToTab={(tab) => setActiveView(tab)}
      />

      {/* Level Up Celebration Popup */}
      {newLevelEarned && (
        <LevelUpModal
          newLevel={newLevelEarned}
          isOpen={!!newLevelEarned}
          onClose={() => setNewLevelEarned(null)}
          onViewJobs={() => {
            setNewLevelEarned(null);
            setSelectedJobTier('certified');
            setActiveView('jobs');
          }}
        />
      )}

    </div>
  );
}
