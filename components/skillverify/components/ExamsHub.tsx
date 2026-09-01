import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Clock, 
  Award, 
  Zap, 
  Lock, 
  CheckCircle2, 
  ChevronRight, 
  Brain,
  ShieldAlert,
  Eye,
  BookOpen
} from 'lucide-react';
import { ExamDefinition, UserProfile } from '../types';
import { AnimatedTooltip } from './AnimatedTooltip';
import { soundFx } from '../utils/audio';

interface ExamsHubProps {
  exams: ExamDefinition[];
  user: UserProfile;
  onSelectExam: (exam: ExamDefinition) => void;
  onOpenAIExamModal: () => void;
}

export const ExamsHub: React.FC<ExamsHubProps> = ({
  exams,
  user,
  onSelectExam,
  onOpenAIExamModal,
}) => {
  return (
    <div className="space-y-6">
      
      {/* EXAMS HERO BANNER */}
      <div 
        id="tour-exam-hub-btn"
        className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/30 shadow-lg text-white space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Anti-Cheat Proctored Engine
              </span>
              <AnimatedTooltip
                id="tooltip-anticheat-hero"
                title="Strict Anti-Cheat Protocols"
                content="Our proctoring kernel monitors tab blur, screen changes, and copy-paste tampering. Earning a badge proves authentic technical mastery to hiring teams!"
                badge="Proctor Guard"
                showPulse
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Job Center Assessment Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              Pass rigorous proctored assessments to earn verified cryptographic badges, boost your XP level, and unlock exclusive high-end certified positions.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                soundFx.playNotification();
                onOpenAIExamModal();
              }}
              className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-900/40 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <BookOpen className="w-4 h-4 text-emerald-100" />
              <span>Launch Custom Skill Exam</span>
            </button>
          </div>
        </div>

        {/* Security Safeguards Feature Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Tab-Switch Detection</span>
            </div>
            <p className="text-[11px] text-slate-400">Navigating away records an instant proctor violation strike.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Eye className="w-4 h-4 shrink-0" />
              <span>Gaze & Focus Monitor</span>
            </div>
            <p className="text-[11px] text-slate-400">Maintains proctor visual continuity throughout the assessment.</p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-emerald-900/40 space-y-1">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <Award className="w-4 h-4 shrink-0" />
              <span>Verified Hash Issued</span>
            </div>
            <p className="text-[11px] text-slate-400">Instant cryptographic certificate attached to your job applications.</p>
          </div>
        </div>

      </div>

      {/* EXAMS LIST GRID */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Available Certification Assessments ({exams.length})
            </h2>
            <p className="text-xs text-slate-500">
              Each exam takes 10 minutes with instant grading and badge issuance.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => {
            const hasEarned = user.verifiedBadges.some(
              (b) => b.badgeTitle.toLowerCase() === exam.badgeTitle.toLowerCase()
            );

            return (
              <div
                key={exam.id}
                onClick={() => {
                  soundFx.playClick();
                  onSelectExam(exam);
                }}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-500 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-white shadow group-hover:scale-105 transition-transform"
                        style={{ backgroundColor: exam.badgeColor }}
                      >
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors">
                          {exam.badgeTitle}
                        </h3>
                        <p className="text-xs text-slate-500">
                          {exam.industry} • <span className="text-emerald-700 font-semibold">{exam.difficulty}</span>
                        </p>
                      </div>
                    </div>

                    {hasEarned && (
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Certified
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {exam.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {exam.timeLimitMinutes} mins
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                      {exam.questions.length} Questions
                    </span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" />
                      +{exam.xpReward} XP Reward
                    </span>
                  </div>
                </div>

                {/* Bottom Target Roles & Action Button */}
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-slate-500 truncate max-w-[200px]">
                    Unlocks: {exam.targetRoleExamples[0]}
                  </span>

                  <button
                    type="button"
                    className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1"
                  >
                    <span>{hasEarned ? 'Retake Exam' : 'Start Assessment'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
