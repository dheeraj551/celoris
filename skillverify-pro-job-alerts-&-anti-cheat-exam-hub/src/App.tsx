/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { JobPortal } from './components/JobPortal';
import { ProgressionDashboard } from './components/ProgressionDashboard';
import { ExamsHub } from './components/ExamsHub';
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

export default function App() {
  // Navigation
  const [activeView, setActiveView] = useState<'jobs' | 'progression' | 'exams'>('jobs');
  const [selectedJobTier, setSelectedJobTier] = useState<JobTier>('public');

  // Core Data
  const [jobs, setJobs] = useState<JobListing[]>(() => {
    const saved = localStorage.getItem('skillverify_jobs');
    return saved ? JSON.parse(saved) : INITIAL_JOBS;
  });

  const [exams, setExams] = useState<ExamDefinition[]>(() => {
    const saved = localStorage.getItem('skillverify_exams');
    return saved ? JSON.parse(saved) : PREBUILT_EXAMS;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('skillverify_user');
    return saved ? JSON.parse(saved) : INITIAL_USER_PROFILE;
  });

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

  const [alerts, setAlerts] = useState<LiveAlertNotification[]>([
    {
      id: 'alert-init-1',
      jobId: 'cert-1',
      jobTitle: 'Staff Distributed Systems Architect',
      company: 'Apex Cloud Systems',
      salaryRange: '$240k - $310k',
      matchScore: 94,
      timestamp: '10m ago',
      read: false,
      tier: 'certified',
    },
    {
      id: 'alert-init-2',
      jobId: 'pub-1',
      jobTitle: 'Full-Stack React & TypeScript Developer',
      company: 'NovaWave Digital',
      salaryRange: '$95k - $135k',
      matchScore: 88,
      timestamp: '30m ago',
      read: true,
      tier: 'public',
    },
  ]);

  // Persist to local storage
  useEffect(() => {
    localStorage.setItem('skillverify_user', JSON.stringify(user));
  }, [user]);

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
    setUser((prev) => {
      const updatedBadges = result.badgeEarned
        ? [...prev.verifiedBadges.filter((b) => b.badgeTitle !== result.badgeEarned!.badgeTitle), result.badgeEarned]
        : prev.verifiedBadges;

      const nextXP = prev.currentXP + result.xpEarned;
      const nextHonor = Math.round((prev.honorScore + result.honorScore) / 2);
      const checked = checkLevelProgression(nextXP, prev.level);

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
