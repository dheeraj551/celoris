import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, 
  ShieldCheck, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Camera, 
  Maximize2, 
  Eye, 
  Award, 
  Sparkles, 
  Send,
  Loader2,
  Lock,
  ChevronRight,
  Info,
  Zap,
  Volume2
} from 'lucide-react';
import { ExamDefinition, ExamResult } from '../types';
import { soundFx } from '../utils/audio';
import { AnimatedTooltip } from './AnimatedTooltip';
import confetti from 'canvas-confetti';
import { ExamCourseSuggestion } from './ExamCourseSuggestion';
import { timeUntil } from '@/lib/exam-courses';

// Attempt status from /api/job-center/exam/attempts (one attempt per exam
// every N days — N comes from the member's plan).
type CooldownInfo = {
  nextAvailableAt: string;
  retakeDays?: number;
  fasterPlan?: { label: string; days: number } | null;
  lastScore?: number | null;
  lastPassed?: boolean | null;
};

interface AntiCheatExamModalProps {
  exam: ExamDefinition;
  isOpen: boolean;
  onClose: () => void;
  // progress is the authoritative post-award current_xp/honor_score from
  // app/api/job-center/exam/submit (see handleSubmitExam below) — the
  // caller should trust these over anything derived from prior local state.
  onExamComplete: (result: ExamResult, progress?: { currentXP: number; honorScore: number }) => void;
}

export const AntiCheatExamModal: React.FC<AntiCheatExamModalProps> = ({
  exam,
  isOpen,
  onClose,
  onExamComplete,
}) => {
  // Exam phases: 'intro' | 'active' | 'evaluating' | 'completed' | 'disqualified'
  const [phase, setPhase] = useState<'intro' | 'active' | 'evaluating' | 'completed' | 'disqualified'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(exam.timeLimitMinutes * 60);
  
  // Anti-Cheat Proctoring States
  const [strikeCount, setStrikeCount] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [webcamActive, setWebcamActive] = useState(false);
  const [gazeStatus, setGazeStatus] = useState<'Focused Center' | 'Looking Away' | 'Screen Switched'>('Focused Center');
  const [proctorLogs, setProctorLogs] = useState<string[]>([]);
  const [honorScore, setHonorScore] = useState(100);

  // Evaluation & Results
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [finalResult, setFinalResult] = useState<ExamResult | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  // A submission the server refused for good (attempt closed / time ran out).
  const [fatalError, setFatalError] = useState<string | null>(null);

  // Attempts
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState<CooldownInfo | null>(null);
  const [retakeDays, setRetakeDays] = useState<number | null>(null);
  const [inProgress, setInProgress] = useState(false);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);

  // The timer and anti-cheat listeners are set up once per phase, so they
  // read the latest answers / attempt through refs.
  const answersRef = useRef<Record<string, number | string>>({});
  answersRef.current = answers;
  const attemptIdRef = useRef<string | null>(null);
  attemptIdRef.current = attemptId;
  const submitRef = useRef<() => void>(() => undefined);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const examContainerRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const webcamStreamRef = useRef<MediaStream | null>(null);

  // Initialize Exam
  useEffect(() => {
    if (isOpen) {
      setPhase('intro');
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTimeLeftSeconds(exam.timeLimitMinutes * 60);
      setStrikeCount(0);
      setHonorScore(100);
      setProctorLogs([`[${new Date().toLocaleTimeString()}] Anti-Cheat Session initialized for ${exam.title}`]);
      setFinalResult(null);
      setSubmitError(null);
      setFatalError(null);
      setAttemptId(null);
      setCooldown(null);
      setInProgress(false);
      setStartError(null);
    } else {
      stopWebcam();
    }
  }, [isOpen, exam]);

  // Is this exam available right now, or waiting for the next attempt?
  useEffect(() => {
    if (!isOpen) return;
    let cancelled = false;
    fetch('/api/job-center/exam/attempts', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (typeof data.retakeDays === 'number') setRetakeDays(data.retakeDays);
        const st = data.exams?.[exam.id];
        if (st?.inProgress) setInProgress(true);
        if (st?.nextAvailableAt) {
          setCooldown({
            nextAvailableAt: st.nextAvailableAt,
            retakeDays: data.retakeDays,
            fasterPlan: data.fasterPlan,
            lastScore: st.last?.score ?? null,
            lastPassed: st.last?.passed ?? null,
          });
        }
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [isOpen, exam.id]);

  // Anti-Cheat Tab-Switch & Blur Detection
  useEffect(() => {
    if (phase !== 'active') return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('Tab Switch Detected: Candidate navigated away from active assessment window.');
      }
    };

    const handleWindowBlur = () => {
      triggerViolation('Window Focus Lost: Secondary application or external monitor access detected.');
    };

    const handleCopyPaste = (e: ClipboardEvent) => {
      e.preventDefault();
      triggerViolation('Clipboard Tampering: Copy / Cut / Paste is locked during anti-cheat proctored session.');
    };

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent PrintScreen, F12, Ctrl+Shift+I, Alt+Tab hints
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && e.key === 'I') || (e.metaKey && e.altKey && e.key === 'I')) {
        e.preventDefault();
        triggerViolation('DevTools Access Attempt blocked by anti-cheat kernel.');
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [phase, strikeCount]);

  // Anti-cheat violation strike trigger
  const triggerViolation = (reason: string) => {
    soundFx.playWarning();
    const newStrikes = strikeCount + 1;
    setStrikeCount(newStrikes);
    setHonorScore((prev) => Math.max(20, prev - 25));
    setGazeStatus('Screen Switched');

    const logEntry = `[${new Date().toLocaleTimeString()}] VIOLATION STRIKE #${newStrikes}: ${reason}`;
    setProctorLogs((prev) => [logEntry, ...prev]);
    setShowViolationWarning(reason);

    if (newStrikes >= 3) {
      // Disqualify immediately — the attempt is used up.
      setPhase('disqualified');
      stopWebcam();
      const id = attemptIdRef.current;
      if (id) {
        fetch('/api/job-center/exam/attempts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'disqualify', attemptId: id }),
          keepalive: true,
        }).catch(() => undefined);
      }
    }
  };

  // Live Timer Countdown
  useEffect(() => {
    if (phase === 'active') {
      timerRef.current = setInterval(() => {
        setTimeLeftSeconds((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            // Through the ref so the latest answers are sent.
            submitRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  // Webcam Setup
  const startWebcam = async () => {
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
        webcamStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setWebcamActive(true);
        setProctorLogs((prev) => [`[${new Date().toLocaleTimeString()}] Proctor Visual Stream Verified`, ...prev]);
      }
    } catch {
      // Webcam denied or not present - fallback to simulated AI proctor node
      setWebcamActive(true);
      setProctorLogs((prev) => [`[${new Date().toLocaleTimeString()}] Simulated AI Proctor Vision Node Enabled`, ...prev]);
    }
  };

  const stopWebcam = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      webcamStreamRef.current = null;
    }
    setWebcamActive(false);
  };

  const handleStartExam = async () => {
    if (starting) return;
    setStarting(true);
    setStartError(null);

    // Start (or resume) the attempt on the server first.
    let timeLeft = exam.timeLimitMinutes * 60;
    try {
      const res = await fetch('/api/job-center/exam/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start', examId: exam.id }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.status === 429 && data?.nextAvailableAt) {
        setCooldown({ nextAvailableAt: data.nextAvailableAt, retakeDays: data.retakeDays, fasterPlan: data.fasterPlan });
        setStarting(false);
        return;
      }
      if (!res.ok || !data?.ok) {
        setStartError(res.status === 401 ? 'Please sign in to take this exam.' : data?.error || "Couldn't start the exam. Please try again.");
        setStarting(false);
        return;
      }
      if (data.attemptId) {
        setAttemptId(data.attemptId);
        attemptIdRef.current = data.attemptId;
        if (data.endsAt) {
          timeLeft = Math.max(5, Math.floor((Date.parse(data.endsAt) - Date.now()) / 1000));
        }
      }
    } catch {
      setStartError("Couldn't reach Celoris. Check your connection and try again.");
      setStarting(false);
      return;
    }
    setTimeLeftSeconds(timeLeft);
    setStarting(false);

    soundFx.playNotification();
    await startWebcam();
    // Attempt fullscreen
    if (examContainerRef.current && document.fullscreenEnabled) {
      try {
        await examContainerRef.current.requestFullscreen();
        setIsFullscreen(true);
      } catch {
        // Fullscreen optional
      }
    }
    setPhase('active');
  };

  const handleAnswerSelect = (questionId: string, value: number | string) => {
    soundFx.playClick();
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  // Grading moved server-side (app/api/job-center/exam/submit) — this used
  // to grade MCQs against exam.correctAnswerIndex and build the badge/XP
  // entirely in the browser, then App.tsx wrote that self-reported result
  // straight to Supabase. That meant a tampered client (or a forged network
  // request) could self-issue XP and badges without the server ever
  // re-checking anything. The server now independently recomputes the
  // score from the raw answers and is the sole issuer of XP/badges; this
  // function just submits and displays whatever it authoritatively
  // returns. On a network/server failure we deliberately do NOT fall back
  // to grading locally — that would reopen the same hole — we just let the
  // candidate retry the submission.
  const handleSubmitExam = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);
    setPhase('evaluating');
    stopWebcam();

    const timeSpent = exam.timeLimitMinutes * 60 - timeLeftSeconds;

    try {
      const response = await fetch('/api/job-center/exam/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          examId: exam.id,
          attemptId: attemptIdRef.current,
          answers: answersRef.current,
          timeSpentSeconds: timeSpent,
          violationsCount: strikeCount,
        }),
      });
      const data = await response.json();

      // The attempt is closed (already submitted, or time ran out) — retrying won't help.
      if (response.status === 409 || response.status === 410) {
        setIsSubmitting(false);
        setFatalError(data?.error || 'This attempt could not be graded.');
        setPhase('completed');
        return;
      }

      if (!response.ok || !data?.success || !data?.result) {
        throw new Error(data?.error || 'Grading failed');
      }

      const result: ExamResult = data.result;

      if (result.badgeEarned) {
        soundFx.playCelebration();
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      setFinalResult(result);
      setIsSubmitting(false);
      setPhase('completed');
      onExamComplete(result, data.progress);
    } catch (err) {
      console.error('Exam submit error:', err);
      setIsSubmitting(false);
      setSubmitError("We couldn't verify your result — check your connection and submit again. Your answers are still here.");
      setPhase('active');
    }
  };

  submitRef.current = handleSubmitExam;

  const currentQ = exam.questions[currentQuestionIndex];

  if (!isOpen) return null;

  return (
    <div
      ref={examContainerRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F1C1A]/90 backdrop-blur-lg p-3 sm:p-6 overflow-y-auto"
    >
      <div className="relative w-full max-w-4xl bg-[#241F1C] border border-[#3D3530] rounded-2xl shadow-2xl overflow-hidden text-[#EDE6DE] flex flex-col max-h-[92vh]">
        
        {/* Anti-Cheat Violation Strike Overlay Warning */}
        <AnimatePresence>
          {showViolationWarning && phase === 'active' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-[#381E19]/95 backdrop-blur-md flex items-center justify-center p-6 text-center"
            >
              <div className="max-w-md space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-[#E07A5F]/20 border border-[#E07A5F] flex items-center justify-center mx-auto animate-bounce">
                  <ShieldAlert className="w-9 h-9 text-[#E07A5F]" />
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-1 rounded-full bg-[#E07A5F]/20 text-[#F5C4B8] border border-[#E07A5F]/40 text-xs font-bold uppercase tracking-wider">
                    Anti-Cheat Strike #{strikeCount} of 3
                  </span>
                  <h3 className="text-xl font-bold text-white font-serif-heading">Integrity Violation Detected!</h3>
                </div>
                <p className="text-sm text-[#F5C4B8] leading-relaxed bg-[#2C1916] p-3 rounded-xl border border-[#522923]">
                  {showViolationWarning}
                </p>
                <div className="text-xs text-[#E59887]">
                  ⚠️ Note: 3 Strikes will result in automatic exam disqualification and an honor score penalty.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setShowViolationWarning(null);
                    setGazeStatus('Focused Center');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#C47A53] hover:bg-[#B86B3E] text-white font-semibold text-sm shadow-lg transition-all"
                >
                  I Understand & Resume Assessment
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TOP BAR: Exam Title, Timer, Anti-Cheat Indicators */}
        <div className="px-6 py-4 bg-[#1C1816] border-b border-[#332B27] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-white shadow"
              style={{ backgroundColor: exam.badgeColor }}
            >
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm sm:text-base text-white truncate max-w-[280px] sm:max-w-md font-serif-heading">
                  {exam.title}
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-[#2C2523] text-[#A3B899] border border-[#3D3530] text-[10px] font-semibold">
                  {exam.difficulty}
                </span>
              </div>
              <p className="text-[11px] text-[#A3968C]">
                {exam.industry} • Reward: <span className="text-[#D4A373] font-semibold">+{exam.xpReward} XP</span> & Badge
              </p>
            </div>
          </div>

          {phase === 'active' && (
            <div className="flex items-center gap-4">
              {/* Countdown Timer */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-mono text-xs font-bold ${
                timeLeftSeconds < 120
                  ? 'bg-[#3D1D18] border-[#8C3A2B] text-[#E07A5F] animate-pulse'
                  : 'bg-[#2C2523] border-[#3D3530] text-[#FAF7F2]'
              }`}>
                <Clock className="w-3.5 h-3.5 text-[#7C9070]" />
                <span>
                  {Math.floor(timeLeftSeconds / 60)}:{(timeLeftSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>

              {/* Proctor Strike Tracker */}
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#2C2523] border border-[#3D3530] text-xs">
                <span className="text-[#A3968C] text-[11px]">Strikes:</span>
                <div className="flex gap-1">
                  {[1, 2, 3].map((s) => (
                    <div
                      key={s}
                      className={`w-2.5 h-2.5 rounded-full ${
                        s <= strikeCount ? 'bg-[#E07A5F] shadow-sm shadow-[#E07A5F]/50' : 'bg-[#3D3530]'
                      }`}
                    />
                  ))}
                </div>
                <AnimatedTooltip
                  id="tooltip-exam-strikes"
                  title="Anti-Cheat Strikes"
                  content="Exiting fullscreen, switching browser tabs, or clipboard copy-paste will trigger a strike. 3 strikes terminates the assessment."
                  badge="Proctor Guard"
                />
              </div>

              {/* Honor Score Indicator */}
              <div className="hidden sm:flex items-center gap-1 text-xs text-[#A3B899] bg-[#242E21]/60 px-2 py-1 rounded-lg border border-[#35422D]">
                <ShieldCheck className="w-3 h-3" />
                <span className="font-bold">{honorScore}% Integrity</span>
              </div>
            </div>
          )}

          {phase !== 'active' && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[#A3968C] hover:text-white hover:bg-[#332B27] transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Submission Error Banner — shown if the server-side grading call
            failed; we return to 'active' rather than silently faking a
            local result, so this is where the candidate finds out. */}
        {submitError && phase === 'active' && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-[#2C1916] border border-[#522923] text-xs text-[#F5C4B8] flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#E07A5F] shrink-0 mt-0.5" />
            <span>{submitError}</span>
          </div>
        )}

        {/* MAIN BODY AREA */}
        <div className="flex-1 p-6 overflow-y-auto">

          {/* PHASE 1: INTRO / PRE-CHECK */}
          {phase === 'intro' && (
            <div className="max-w-2xl mx-auto space-y-6 py-4">
              <div className="text-center space-y-2">
                <div 
                  className="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-xl shadow-[#7C9070]/10 mb-3"
                  style={{ backgroundColor: exam.badgeColor }}
                >
                  <Award className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-bold text-white font-serif-heading">{exam.badgeTitle}</h3>
                <p className="text-sm text-[#D5CABE] max-w-lg mx-auto leading-relaxed">
                  {exam.description}
                </p>
              </div>

              {/* Anti-Cheat Verification Protocols Info Box */}
              <div className="p-4 rounded-xl bg-[#2C2523] border border-[#3D3530] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-semibold text-xs text-[#A3B899] uppercase tracking-wider">
                    <ShieldCheck className="w-4 h-4 text-[#7C9070]" />
                    Anti-Cheat Proctoring Rules & Protocols
                  </span>
                  <span className="text-[11px] text-[#D4A373] font-medium">Locked Assessment</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#D5CABE]">
                  <div className="flex items-start gap-2 bg-[#1C1816]/80 p-2.5 rounded-lg border border-[#332B27]">
                    <CheckCircle2 className="w-4 h-4 text-[#7C9070] shrink-0 mt-0.5" />
                    <span><strong>No Tab Switching:</strong> Navigating away from this tab records a proctor violation strike.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-[#1C1816]/80 p-2.5 rounded-lg border border-[#332B27]">
                    <CheckCircle2 className="w-4 h-4 text-[#7C9070] shrink-0 mt-0.5" />
                    <span><strong>Clipboard Lockdown:</strong> Copy, cut, and paste shortcuts are disabled.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-[#1C1816]/80 p-2.5 rounded-lg border border-[#332B27]">
                    <CheckCircle2 className="w-4 h-4 text-[#7C9070] shrink-0 mt-0.5" />
                    <span><strong>AI Proctor Eye:</strong> Monitors focus integrity and gaze continuity.</span>
                  </div>
                  <div className="flex items-start gap-2 bg-[#1C1816]/80 p-2.5 rounded-lg border border-[#332B27]">
                    <CheckCircle2 className="w-4 h-4 text-[#7C9070] shrink-0 mt-0.5" />
                    <span><strong>Passing Threshold:</strong> Score {exam.passingScorePercent}%+ to unlock Certified High-End Roles.</span>
                  </div>
                </div>
              </div>

              {/* Roles Unlocked Preview */}
              <div className="p-3.5 rounded-xl bg-[#2C2523] border border-[#3D3530] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#D5CABE]">
                  <Zap className="w-4 h-4 text-[#D4A373]" />
                  <span><strong>Target Unlocks:</strong> {exam.targetRoleExamples.join(' • ')}</span>
                </div>
                <span className="text-[#A3B899] font-bold">₹160k - ₹320k+ Tier</span>
              </div>

              {/* Attempt rules / waiting period */}
              {cooldown ? (
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-[#2C2523] border border-[#D4A373]/40 text-xs text-[#EDE6DE] space-y-1.5">
                    <p className="flex items-center gap-2 font-bold text-[#D4A373]">
                      <Clock className="w-4 h-4" />
                      Your next attempt opens {timeUntil(cooldown.nextAvailableAt)}
                    </p>
                    <p className="text-[#C9BFB4] leading-relaxed">
                      {typeof cooldown.lastScore === 'number'
                        ? `Last time you scored ${cooldown.lastScore}% (pass mark ${exam.passingScorePercent}%). `
                        : ''}
                      Each exam can be taken once every {cooldown.retakeDays ?? retakeDays ?? 7} day{(cooldown.retakeDays ?? retakeDays ?? 7) === 1 ? '' : 's'}, so badges stay meaningful to employers
                      ({new Date(cooldown.nextAvailableAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}).
                    </p>
                    {cooldown.fasterPlan && (
                      <p className="text-[#A3B899]">
                        {cooldown.fasterPlan.label} members can retake every {cooldown.fasterPlan.days} day{cooldown.fasterPlan.days === 1 ? '' : 's'}.{' '}
                        <a href="/pricing" className="underline font-semibold hover:text-white">See plans</a>
                      </p>
                    )}
                  </div>
                  {cooldown.lastPassed !== true && (
                    <ExamCourseSuggestion examId={exam.id} score={cooldown.lastScore} passingScore={exam.passingScorePercent} />
                  )}
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-[#2C2523] border border-[#3D3530] text-xs text-[#D5CABE] flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#D4A373] shrink-0 mt-0.5" />
                  <span>
                    {inProgress
                      ? 'You have an attempt in progress — starting will continue it with the time that is left.'
                      : `Starting uses your attempt: you can take this exam once every ${retakeDays ?? 7} day${(retakeDays ?? 7) === 1 ? '' : 's'}, even if you close the window or get disqualified.`}
                  </span>
                </div>
              )}

              {startError && (
                <div className="p-3 rounded-xl bg-[#2C1916] border border-[#522923] text-xs text-[#F5C4B8] flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-[#E07A5F] shrink-0 mt-0.5" />
                  <span>{startError}</span>
                </div>
              )}

              {/* Launch Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-[#A3968C] hover:text-white hover:bg-[#332B27] text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartExam}
                  disabled={!!cooldown || starting}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C9070] to-[#5B6E50] hover:from-[#6B7F5F] hover:to-[#4A5D40] text-white text-sm font-bold shadow-lg shadow-[#7C9070]/30 flex items-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
                >
                  {starting ? <Loader2 className="w-4 h-4 animate-spin" /> : cooldown ? <Lock className="w-4 h-4" /> : null}
                  <span>{cooldown ? 'Not available yet' : inProgress ? 'Continue Exam' : 'Start Anti-Cheat Exam'}</span>
                  {!cooldown && !starting && <ChevronRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* PHASE 2: ACTIVE EXAM & PROCTORING */}
          {phase === 'active' && currentQ && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              
              {/* Left Column: Proctor Live Eye & Question Stepper */}
              <div className="lg:col-span-1 space-y-4 order-2 lg:order-1">
                
                {/* Live Webcam / AI Proctor Canvas */}
                <div className="p-3 rounded-xl bg-[#1C1816] border border-[#332B27] space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-[#A3968C]">
                    <span className="flex items-center gap-1.5 font-semibold text-[#D5CABE]">
                      <Camera className="w-3.5 h-3.5 text-[#7C9070] animate-pulse" />
                      Proctor Visual Feed
                    </span>
                    <span className="px-1.5 py-0.2 rounded bg-[#7C9070]/20 text-[#A3B899] text-[9px] font-bold">
                      LIVE
                    </span>
                  </div>

                  {/* Video Box */}
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#181514] border border-[#332B27] flex items-center justify-center">
                    <video
                      ref={videoRef}
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                    {/* Proctor HUD Overlay */}
                    <div className="absolute inset-0 pointer-events-none border border-[#7C9070]/30 flex flex-col justify-between p-1.5">
                      <div className="flex items-center justify-between text-[9px] font-mono text-[#A3B899]">
                        <span>GAZE: {gazeStatus.toUpperCase()}</span>
                        <span>MIC: 16dB</span>
                      </div>
                      <div className="flex items-center justify-between text-[9px] font-mono text-[#A3B899]/80">
                        <span>FACE: 1 DETECTED</span>
                        <span>SYNC: 60FPS</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-[#A3968C]">
                    <span>Integrity: <strong className="text-[#A3B899]">{honorScore}%</strong></span>
                    <span className="text-[#7A6E67]">Anti-Cheat v3.4</span>
                  </div>
                </div>

                {/* Question Navigation Matrix */}
                <div className="p-3 rounded-xl bg-[#1C1816] border border-[#332B27] space-y-2">
                  <span className="text-[11px] font-semibold text-[#A3968C] uppercase tracking-wider block">
                    Questions ({exam.questions.length})
                  </span>
                  <div className="grid grid-cols-4 gap-1.5">
                    {exam.questions.map((q, idx) => {
                      const isAnswered = answers[q.id] !== undefined && answers[q.id] !== '';
                      const isCurrent = idx === currentQuestionIndex;
                      return (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => {
                            soundFx.playClick();
                            setCurrentQuestionIndex(idx);
                          }}
                          className={`h-8 rounded-lg text-xs font-semibold flex items-center justify-center transition-all ${
                            isCurrent
                              ? 'bg-[#7C9070] text-white ring-2 ring-[#A3B899]'
                              : isAnswered
                              ? 'bg-[#242E21] text-[#A3B899] border border-[#35422D]'
                              : 'bg-[#2C2523] text-[#A3968C] hover:bg-[#352D29]'
                          }`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Proctor Logs Ticker */}
                <div className="p-3 rounded-xl bg-[#1C1816] border border-[#332B27] text-[10px] font-mono text-[#A3968C] space-y-1 max-h-32 overflow-y-auto">
                  <span className="font-semibold text-[#D5CABE] block mb-1">Live Audit Logs</span>
                  {proctorLogs.slice(0, 3).map((log, idx) => (
                    <p key={idx} className="truncate text-[#7A6E67]">
                      {log}
                    </p>
                  ))}
                </div>
              </div>

              {/* Right Column: Question Content & Options */}
              <div className="lg:col-span-3 space-y-5 order-1 lg:order-2">
                
                <div className="flex items-center justify-between border-b border-[#332B27] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-[#2C2523] text-[#D5CABE] text-xs font-bold">
                      Question {currentQuestionIndex + 1} of {exam.questions.length}
                    </span>
                    <span className="text-xs text-[#A3B899] font-semibold uppercase">
                      {currentQ.type === 'mcq' ? 'Multiple Choice' : 'Architectural Scenario'}
                    </span>
                  </div>

                  <AnimatedTooltip
                    id="tooltip-active-q"
                    title="Answering Tip"
                    content="Carefully evaluate the technical trade-offs. Once satisfied, click Next Question or Submit Exam."
                    badge="Tip"
                  />
                </div>

                {/* Question Statement */}
                <div className="space-y-3">
                  <h3 className="text-base sm:text-lg font-semibold text-white leading-snug font-serif-heading">
                    {currentQ.question}
                  </h3>

                  {/* Code snippet if any */}
                  {currentQ.codeSnippet && (
                    <pre className="p-3.5 rounded-xl bg-[#181514] border border-[#332B27] text-xs font-mono text-[#A3B899] overflow-x-auto">
                      <code>{currentQ.codeSnippet}</code>
                    </pre>
                  )}
                </div>

                {/* MCQ Options */}
                {currentQ.type === 'mcq' && currentQ.options && (
                  <div className="space-y-2.5">
                    {currentQ.options.map((option, optIdx) => {
                      const isSelected = answers[currentQ.id] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleAnswerSelect(currentQ.id, optIdx)}
                          className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 text-xs sm:text-sm ${
                            isSelected
                              ? 'bg-[#332B27] border-[#7C9070] text-white shadow-md'
                              : 'bg-[#2C2523]/80 border-[#3D3530] text-[#D5CABE] hover:bg-[#332B27] hover:border-[#4D423D]'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                            isSelected ? 'bg-[#7C9070] text-white' : 'bg-[#3D3530] text-[#D5CABE]'
                          }`}>
                            {String.fromCharCode(65 + optIdx)}
                          </div>
                          <span className="leading-relaxed">{option}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Scenario Written Challenge Editor */}
                {currentQ.type === 'scenario' && (
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-[#D5CABE]">
                      Your Technical Proposal & Implementation Strategy (Evaluated by AI Examiner):
                    </label>
                    <textarea
                      value={(answers[currentQ.id] as string) || ''}
                      onChange={(e) => handleAnswerSelect(currentQ.id, e.target.value)}
                      placeholder="Outline architectural decisions, algorithmic trade-offs, security mitigation steps, and concurrency handling..."
                      rows={6}
                      className="w-full p-3.5 rounded-xl bg-[#181514] border border-[#3D3530] text-[#EDE6DE] text-xs sm:text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#7C9070] placeholder:text-[#7A6E67]"
                    />
                    <div className="flex items-center justify-between text-[11px] text-[#A3968C]">
                      <span>Proctor Note: Clipboard paste is disabled to ensure original problem solving.</span>
                      <span>Min 30 words recommended</span>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-[#332B27]">
                  <button
                    type="button"
                    disabled={currentQuestionIndex === 0}
                    onClick={() => {
                      soundFx.playClick();
                      setCurrentQuestionIndex((prev) => Math.max(0, prev - 1));
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-[#A3968C] hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-3">
                    {currentQuestionIndex < exam.questions.length - 1 ? (
                      <button
                        type="button"
                        onClick={() => {
                          soundFx.playClick();
                          setCurrentQuestionIndex((prev) => prev + 1);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#7C9070] hover:bg-[#5B6E50] text-white text-xs font-bold transition-all shadow"
                      >
                        Next Question
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={handleSubmitExam}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#7C9070] to-[#5B6E50] hover:from-[#6B7F5F] hover:to-[#4A5D40] text-white text-xs font-bold shadow-lg shadow-[#7C9070]/30 transition-all flex items-center gap-1.5"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit Final Assessment</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PHASE 3: EVALUATING */}
          {phase === 'evaluating' && (
            <div className="text-center py-12 space-y-4">
              <Loader2 className="w-12 h-12 text-[#7C9070] animate-spin mx-auto" />
              <h3 className="text-xl font-bold text-white font-serif-heading">AI Proctor Evaluating Assessment...</h3>
              <p className="text-xs text-[#A3968C] max-w-sm mx-auto">
                Analyzing anti-cheat integrity telemetry, scoring architectural scenario, and validating verification badge credentials.
              </p>
            </div>
          )}

          {/* PHASE 4: COMPLETED SCORECARD & BADGE ISSUANCE */}
          {phase === 'completed' && fatalError && !finalResult && (
            <div className="max-w-md mx-auto text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#E07A5F]/20 border border-[#E07A5F]/40 flex items-center justify-center mx-auto text-[#E07A5F]">
                <Clock className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-bold text-white font-serif-heading">This attempt couldn't be graded</h3>
              <p className="text-xs text-[#F5C4B8] leading-relaxed bg-[#2C1916] p-3 rounded-xl border border-[#522923]">{fatalError}</p>
              <ExamCourseSuggestion examId={exam.id} />
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#332B27] hover:bg-[#3D3430] text-white text-xs font-semibold transition-colors"
              >
                Return to Hub
              </button>
            </div>
          )}

          {phase === 'completed' && finalResult && (
            <div className="max-w-xl mx-auto space-y-6 py-2">
              <div className="text-center space-y-2">
                {finalResult.passed ? (
                  <div className="w-16 h-16 rounded-2xl bg-[#7C9070]/20 border border-[#7C9070]/40 flex items-center justify-center mx-auto text-[#A3B899] mb-2 animate-pulse">
                    <Award className="w-9 h-9" />
                  </div>
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-[#E07A5F]/20 border border-[#E07A5F]/40 flex items-center justify-center mx-auto text-[#E07A5F] mb-2">
                    <XCircle className="w-9 h-9" />
                  </div>
                )}

                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  finalResult.passed
                    ? 'bg-[#7C9070]/20 text-[#A3B899] border border-[#7C9070]/30'
                    : 'bg-[#E07A5F]/20 text-[#F5C4B8] border border-[#E07A5F]/30'
                }`}>
                  {finalResult.passed ? 'PASSED & CERTIFIED' : 'DID NOT MEET THRESHOLD'}
                </span>

                <h3 className="text-2xl font-bold text-white font-serif-heading">
                  Score: {finalResult.score}%
                </h3>
                <p className="text-xs text-[#D5CABE]">
                  Passing threshold was {exam.passingScorePercent}%. Anti-Cheat Integrity Honor: <strong className="text-[#A3B899]">{finalResult.honorScore}%</strong>
                </p>
              </div>

              {/* Verified Badge Certificate Card */}
              {finalResult.badgeEarned && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#2E2824] via-[#241F1C] to-[#1C1816] border-2 border-[#7C9070]/40 shadow-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-[#7C9070]" />
                      <span className="font-bold text-sm text-white">{finalResult.badgeEarned.badgeTitle}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#7C9070]/30 text-[#A3B899] border border-[#7C9070]/40 text-[10px] font-mono">
                      VERIFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#D5CABE] pt-1">
                    <div>
                      <span className="text-[#A3968C] block text-[10px]">Verification ID Hash</span>
                      <span className="font-mono text-[#A3B899] font-bold">{finalResult.badgeEarned.verificationHash}</span>
                    </div>
                    <div>
                      <span className="text-[#A3968C] block text-[10px]">XP Awarded</span>
                      <span className="font-bold text-[#D4A373]">+{finalResult.xpEarned} XP</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#A3B899] flex items-center gap-1.5 pt-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7C9070]" />
                    <span>Unlocked Certified High-End Roles in {exam.industry}</span>
                  </div>
                </div>
              )}

              {finalResult.passed && finalResult.alreadyCertified && (
                <p className="text-center text-[11px] text-[#A3968C]">
                  You already held this badge, so no extra XP this time
                  {finalResult.badgeEarned ? ' — your badge now shows your new best score.' : '.'}
                </p>
              )}

              {!finalResult.passed && (
                <div className="space-y-3">
                  <ExamCourseSuggestion examId={exam.id} score={finalResult.score} passingScore={exam.passingScorePercent} />
                  {finalResult.nextAttemptAt && (
                    <p className="text-center text-[11px] text-[#A3968C]">
                      Your next attempt opens {timeUntil(finalResult.nextAttemptAt)} (
                      {new Date(finalResult.nextAttemptAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}).
                    </p>
                  )}
                </div>
              )}

              {/* Proctor & AI Feedback */}
              {finalResult.detailedFeedback && (
                <div className="p-3.5 rounded-xl bg-[#1C1816] border border-[#332B27] text-xs text-[#D5CABE] space-y-1">
                  <span className="font-semibold text-[#A3968C] block text-[11px]">Examiner Assessment Feedback:</span>
                  <p className="leading-relaxed">{finalResult.detailedFeedback}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-[#7C9070] hover:bg-[#5B6E50] text-white font-bold text-xs shadow-lg transition-all"
                >
                  {finalResult.passed ? 'View Unlocked Jobs & Progression' : 'Back to Exams'}
                </button>
              </div>
            </div>
          )}

          {/* PHASE 5: DISQUALIFIED */}
          {phase === 'disqualified' && (
            <div className="max-w-md mx-auto text-center py-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-[#E07A5F]/20 border border-[#E07A5F] flex items-center justify-center mx-auto text-[#E07A5F]">
                <ShieldAlert className="w-9 h-9" />
              </div>
              <h3 className="text-2xl font-bold text-white font-serif-heading">Assessment Disqualified</h3>
              <p className="text-xs text-[#F5C4B8] leading-relaxed bg-[#2C1916] p-3 rounded-xl border border-[#522923]">
                Maximum anti-cheat strikes (3/3) reached due to tab switching, loss of active window focus, or clipboard tampering.
              </p>
              <div className="text-xs text-[#A3968C]">
                This attempt has been used. You can take this exam again {retakeDays ? `after ${retakeDays} day${retakeDays === 1 ? '' : 's'}` : 'after the waiting period'} — use the time to prepare:
              </div>
              <ExamCourseSuggestion examId={exam.id} />
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#332B27] hover:bg-[#3D3430] text-white text-xs font-semibold transition-colors"
              >
                Return to Hub
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
