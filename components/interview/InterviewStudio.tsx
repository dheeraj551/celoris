"use client";

import React, { useState } from 'react';
import './interview.css';
import { Header, ActiveTab, UserRole } from './Header';
import { VideoInterviewRoom } from './video/VideoInterviewRoom';
import { SchedulingHub } from './scheduling/SchedulingHub';
import { CandidateTracker } from './tracking/CandidateTracker';
import { ScoringAnalytics } from './analytics/ScoringAnalytics';
import { CandidatePortalView } from './candidate-portal/CandidatePortalView';
import { LandingPage } from './landing/LandingPage';
import { 
  INITIAL_CANDIDATES, 
  INITIAL_INTERVIEW_SESSIONS, 
  DEFAULT_RUBRIC_CATEGORIES, 
  INITIAL_INTERVIEW_QUESTIONS 
} from './mockData';
import { Candidate, CandidateStage, InterviewSession, RubricCategory, ScorecardEvaluation } from './types';

interface InterviewStudioProps {
  initialRoomId?: string;
  defaultView?: 'landing' | 'video' | 'pipeline' | 'schedule' | 'analytics';
}

export function InterviewStudio({ initialRoomId, defaultView = 'landing' }: InterviewStudioProps) {
  const [showLandingPage, setShowLandingPage] = useState<boolean>(defaultView === 'landing' && !initialRoomId);
  const [activeTab, setActiveTab] = useState<ActiveTab>(defaultView === 'landing' ? 'video' : defaultView);
  const [userRole, setUserRole] = useState<UserRole>('interviewer');
  
  // Enterprise State
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [sessions, setSessions] = useState<InterviewSession[]>(INITIAL_INTERVIEW_SESSIONS);
  const [rubrics, setRubrics] = useState<RubricCategory[]>(DEFAULT_RUBRIC_CATEGORIES);
  const [questions, setQuestions] = useState(INITIAL_INTERVIEW_QUESTIONS);
  
  // Current active video interview session
  const defaultSession = (initialRoomId 
    ? sessions.find(s => s.meetingRoomId.toLowerCase() === initialRoomId.toLowerCase() || s.id === initialRoomId)
    : null) || sessions[0];

  const [activeSessionId, setActiveSessionId] = useState<string>(defaultSession.id);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  const activeSession = sessions.find(s => s.id === activeSessionId) || sessions[0];
  const activeCandidate = candidates.find(c => c.id === activeSession.candidateId) || candidates[0];

  // Join or switch to a session
  const handleJoinSession = (session: InterviewSession) => {
    setActiveSessionId(session.id);
    setActiveTab('video');
    setShowLandingPage(false);
  };

  // Schedule new session
  const handleScheduleSession = (newSession: InterviewSession) => {
    setSessions(prev => [newSession, ...prev]);
    // Associate with candidate
    setCandidates(prev => prev.map(c => {
      if (c.id === newSession.candidateId) {
        return {
          ...c,
          interviewSessions: [newSession, ...c.interviewSessions]
        };
      }
      return c;
    }));
  };

  // Update candidate pipeline stage
  const handleUpdateCandidateStage = (candidateId: string, newStage: CandidateStage) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, stage: newStage } : c));
  };

  // Save scorecard evaluation from live call
  const handleSaveEvaluation = (evaluation: ScorecardEvaluation) => {
    // 1. Update session scorecard
    setSessions(prev => prev.map(s => {
      if (s.id === activeSession.id) {
        return {
          ...s,
          status: 'completed',
          scorecard: evaluation
        };
      }
      return s;
    }));

    // 2. Update candidate overall score and recommendation
    setCandidates(prev => prev.map(c => {
      if (c.id === activeSession.candidateId) {
        return {
          ...c,
          overallScore: evaluation.overallScore,
          recommendation: evaluation.recommendation,
          interviewSessions: c.interviewSessions.map(sess => 
            sess.id === activeSession.id ? { ...sess, status: 'completed', scorecard: evaluation } : sess
          )
        };
      }
      return c;
    }));

    // Switch to Candidate Pipeline tab to observe the updated ATS state
    setActiveTab('pipeline');
  };

  // End live call
  const handleEndCall = () => {
    setActiveTab('pipeline');
  };

  if (showLandingPage) {
    return (
      <LandingPage
        onEnterEnvironment={(tab, role) => {
          if (tab) setActiveTab(tab);
          if (role) setUserRole(role);
          setShowLandingPage(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#030705] text-[#e2f5ea] flex flex-col font-sans relative selection:bg-emerald-500 selection:text-black">
      {/* Global Ambient Emerald Animation Layer */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[140px] animate-aurora" />
        <div className="absolute -bottom-40 -right-40 w-[700px] h-[700px] bg-emerald-900/10 rounded-full blur-[160px] animate-aurora" style={{ animationDelay: '-5s' }} />
      </div>

      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userRole={userRole}
        setUserRole={setUserRole}
        isCallActive={activeSession.status === 'live'}
        onScheduleNew={() => {
          setActiveTab('schedule');
          setIsScheduleModalOpen(true);
        }}
        activeCandidateName={activeCandidate?.name}
        onGoToLanding={() => setShowLandingPage(true)}
      />

      <main className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* If user switches perspective to Candidate View */}
        {userRole === 'candidate' ? (
          <CandidatePortalView
            candidate={activeCandidate}
            session={activeSession}
            onEnterRoom={() => {
              setUserRole('interviewer');
              setActiveTab('video');
            }}
          />
        ) : (
          <>
            {activeTab === 'video' && (
              <VideoInterviewRoom
                session={activeSession}
                rubrics={rubrics}
                onUpdateRubrics={setRubrics}
                onSaveEvaluation={handleSaveEvaluation}
                onEndCall={handleEndCall}
                questions={questions}
              />
            )}

            {activeTab === 'pipeline' && (
              <CandidateTracker
                candidates={candidates}
                onUpdateCandidateStage={handleUpdateCandidateStage}
                onStartInterview={handleJoinSession}
                onScheduleInterview={(cid) => {
                  setActiveTab('schedule');
                  setIsScheduleModalOpen(true);
                }}
              />
            )}

            {activeTab === 'schedule' && (
              <SchedulingHub
                sessions={sessions}
                candidates={candidates}
                onScheduleSession={handleScheduleSession}
                onJoinSession={handleJoinSession}
                isScheduleModalOpen={isScheduleModalOpen}
                setIsScheduleModalOpen={setIsScheduleModalOpen}
              />
            )}

            {activeTab === 'analytics' && (
              <ScoringAnalytics
                rubrics={rubrics}
                onSaveRubricWeights={(newRubrics) => setRubrics(newRubrics)}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
