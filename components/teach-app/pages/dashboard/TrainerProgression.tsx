import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Award,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  Copy,
  Star,
  Radio,
} from 'lucide-react';
import { TrainerTierLevel } from '../../types';
import { TRAINER_LEVEL_TIERS, INITIAL_TRAINER_PROGRESS } from '../../data/trainerProgressionData';

const MotionLink = motion.create(Link);

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export function TrainerProgression() {
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const progress = INITIAL_TRAINER_PROGRESS;

  const currentTierInfo = TRAINER_LEVEL_TIERS[progress.level];
  const nextLevel = (progress.level < 5 ? progress.level + 1 : 5) as TrainerTierLevel;
  const nextTierInfo = TRAINER_LEVEL_TIERS[nextLevel];

  const progressPercent = Math.min(
    100,
    Math.max(
      0,
      Math.round(
        ((progress.currentXP - currentTierInfo.minXP) / (progress.nextLevelXP - currentTierInfo.minXP)) * 100
      )
    )
  );

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="p-8 space-y-6">
      {/* TOP PROGRESSION SUMMARY HERO */}
      <motion.div
        initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 border border-emerald-800/30 shadow-lg text-white space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Verified Trainer Progression
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Level {progress.level}: {currentTierInfo.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl leading-relaxed">
              {currentTierInfo.desc}
            </p>
          </div>

          {/* Quick Metrics Capsule Grid */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3"
          >
            <motion.div variants={fadeUpItem} className="p-3 rounded-xl bg-slate-900/80 border border-emerald-900/40 text-center">
              <span className="text-[11px] text-slate-400 font-medium block">Total XP</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{progress.currentXP}</span>
            </motion.div>
            <motion.div variants={fadeUpItem} className="p-3 rounded-xl bg-slate-900/80 border border-emerald-900/40 text-center">
              <span className="text-[11px] text-slate-400 font-medium block">Sessions Hosted</span>
              <span className="text-lg font-extrabold text-emerald-400 font-mono">{progress.sessionsHosted}</span>
            </motion.div>
            <motion.div variants={fadeUpItem} className="p-3 rounded-xl bg-slate-900/80 border border-emerald-900/40 text-center col-span-2 sm:col-span-1">
              <span className="text-[11px] text-slate-400 font-medium block">Trainer Rating</span>
              <span className="text-lg font-extrabold text-emerald-300 font-mono">{progress.trainerRating.toFixed(1)} / 5</span>
            </motion.div>
          </motion.div>
        </div>

        {/* XP Progress Bar to Next Level */}
        <div className="space-y-2 bg-slate-900/60 p-4 rounded-xl border border-emerald-900/40">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">
              Level {progress.level} ({currentTierInfo.name})
            </span>
            <span className="text-emerald-400 font-mono font-bold">
              {progress.currentXP} / {progress.nextLevelXP} XP ({progressPercent}%)
            </span>
            <span className="font-semibold text-slate-400">
              Level {nextLevel} ({nextTierInfo.name})
            </span>
          </div>

          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-emerald-900/40">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
              className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 rounded-full"
            />
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
            <span>Need {progress.nextLevelXP - progress.currentXP} XP to unlock Level {nextLevel}</span>
            <span className="text-emerald-300 font-medium">Unlocks {nextTierInfo.perks[0]}</span>
          </div>
        </div>

        {/* How to Earn XP Action Prompts */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2"
        >
          <MotionLink
            variants={fadeUpItem}
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            to="/teach/dashboard/trainer/profile"
            className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-left transition-colors group block"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-emerald-400">Verify Your Profile</span>
              <span className="text-xs font-mono font-bold text-emerald-400">+300 XP</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Complete verification & unlock a certified trainer badge.</p>
          </MotionLink>

          <MotionLink
            variants={fadeUpItem}
            whileHover={{ y: -3, scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            to="/teach/dashboard/trainer/overview"
            className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700 text-left transition-colors group block"
          >
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white group-hover:text-emerald-400 flex items-center gap-1.5">
                <Radio className="w-3 h-3" /> Host a Booth Session
              </span>
              <span className="text-xs font-mono font-bold text-emerald-400">+100 XP</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Go live from your dashboard and connect with students.</p>
          </MotionLink>

          <motion.div variants={fadeUpItem} className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-800/50 text-left">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs text-white">5-Star Student Reviews</span>
              <span className="text-xs font-mono font-bold text-emerald-400">+50 XP</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Earned automatically whenever a student rates you 5 stars.</p>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* VERIFIED TRAINER BADGES */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4"
      >
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="space-y-0.5">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              <span>Verified Trainer Badges ({progress.badges.length})</span>
            </h2>
            <p className="text-xs text-slate-500">
              Earned through verified teaching milestones, student ratings, and platform reviews.
            </p>
          </div>

          <Link
            to="/teach/dashboard/trainer/profile"
            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all"
          >
            + Earn New Badge
          </Link>
        </div>

        {progress.badges.length === 0 ? (
          <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <Award className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="text-sm font-bold text-slate-900">No verified badges yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Complete your trainer verification to earn your first badge and boost your visibility.
            </p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2"
          >
            {progress.badges.map((badge) => (
              <motion.div
                key={badge.id}
                variants={fadeUpItem}
                whileHover={{ y: -3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs space-y-3 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-xs"
                      style={{ backgroundColor: badge.badgeColor }}
                    >
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{badge.badgeTitle}</h3>
                      <p className="text-xs text-slate-500">
                        {badge.subject} • Earned {badge.earnedDate}
                      </p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-current" /> {badge.rating.toFixed(1)}
                  </span>
                </div>

                {/* Cryptographic verification ID & Copy */}
                <div className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="text-[10px] text-slate-400">VERIFY ID:</span>
                    <span className="font-bold text-emerald-700">{badge.verificationHash}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopyHash(badge.verificationHash)}
                    className="p-1 rounded text-slate-400 hover:text-emerald-700 transition-colors"
                    title="Copy verification hash"
                  >
                    {copiedHash === badge.verificationHash ? (
                      <span className="text-[10px] text-emerald-700 font-bold font-sans">Copied!</span>
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1">
                  <span>
                    Sessions Delivered: <strong className="text-emerald-700">{badge.sessionsCount}</strong>
                  </span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Boosts Directory Ranking
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* FACULTY TIER ROADMAP */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.5 }}
        className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4"
      >
        <div className="space-y-0.5">
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
            <span>Faculty Tier Roadmap & Perk Unlocks</span>
          </h2>
          <p className="text-xs text-slate-500">
            Higher verified levels unlock premium visibility, lower commission, and flagship programs.
          </p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="space-y-3 pt-2"
        >
          {([1, 2, 3, 4, 5] as TrainerTierLevel[]).map((lvl) => {
            const info = TRAINER_LEVEL_TIERS[lvl];
            const isCurrent = progress.level === lvl;
            const isUnlocked = progress.level >= lvl;

            return (
              <motion.div
                key={lvl}
                variants={{ hidden: { opacity: 0, x: -16 }, visible: { opacity: 1, x: 0, transition: { duration: 0.4 } } }}
                className={`p-4 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isCurrent
                    ? 'bg-emerald-50/60 border-emerald-500 shadow-xs'
                    : isUnlocked
                    ? 'bg-slate-50 border-slate-200'
                    : 'bg-slate-50/40 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white text-sm shadow-xs"
                    style={{ backgroundColor: info.color }}
                  >
                    L{lvl}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900">{info.name}</h3>
                      {isCurrent && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.3 }}
                          className="px-2 py-0.2 rounded-full bg-emerald-600 text-white text-[10px] font-bold"
                        >
                          Current Level
                        </motion.span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{info.desc}</p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {info.perks.map((perk, idx) => (
                    <span
                      key={idx}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium ${
                        isUnlocked
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isUnlocked ? '✓ ' : '🔒 '}
                      {perk}
                    </span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
