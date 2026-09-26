import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  ThumbsUp,
  ThumbsDown,
  ListPlus,
  Share2,
  ChevronDown,
  ChevronUp,
  Check,
} from 'lucide-react';
import { AddToPlaylistModal } from '../Modals/AddToPlaylistModal';
import { CourseInquiryDialog } from '@/components/CourseInquiryDialog';

interface Props {
  video: Video;
}

export const VideoInfo: React.FC<Props> = ({ video }) => {
  const { currentUser, toggleLike, toggleDislike, seekToTime } = useApp();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState<boolean>(false);
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  const isLiked = currentUser.likedVideoIds.includes(video.id);
  const isDisliked = currentUser.dislikedVideoIds.includes(video.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2400);
  };

  return (
    <div className="space-y-4 pt-2 text-slate-200 select-none">
      {/* Video Subject & Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 rounded-lg">
          {video.subject}
        </span>
        <span className="px-2.5 py-1 text-[11px] font-semibold bg-white/[0.04] text-slate-200 border border-white/10 rounded-lg">
          {video.difficulty}
        </span>
        <span className="px-2.5 py-1 text-[11px] font-medium bg-white/[0.04] text-slate-400 border border-white/10 rounded-lg">
          {video.gradeLevel}
        </span>
        <span className="text-xs text-slate-500 font-mono ml-auto">
          Published {video.publishedAt}
        </span>
      </div>

      {/* Video Title */}
      <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white leading-tight">
        {video.title}
      </h1>

      {/* Author & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        {/* Author Card */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={video.author.avatar}
              alt={video.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500/40 shadow-xs"
            />
            {video.author.verified && (
              <div
                className="absolute -bottom-1 -right-1 bg-emerald-400 text-black rounded-full p-0.5 shadow-xs"
                title="Verified Academic Instructor"
              >
                <Check className="w-3 h-3 stroke-[3]" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-sm text-white">{video.author.name}</span>
              {video.author.role === 'professor' && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Professor
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400">
              {video.author.institution || video.author.title}
            </p>
          </div>

          <CourseInquiryDialog
            courseTitle={video.title}
            buttonText="+ Enroll Course"
            buttonClassName="ml-2 px-4 py-2 text-xs font-extrabold rounded-xl transition-all shadow-md bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black shadow-emerald-500/20 hover:scale-102 active:scale-98"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Like */}
          <button
            onClick={() => toggleLike(video.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isLiked
                ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-emerald-400 text-emerald-400' : ''}`} />
            <span>{video.likes || 0}</span>
          </button>

          {/* Dislike */}
          <button
            onClick={() => toggleDislike(video.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isDisliked
                ? 'bg-rose-500/20 border-rose-500/60 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.2)]'
                : 'bg-white/[0.04] border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white'
            }`}
          >
            <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-rose-400 text-rose-400' : ''}`} />
            <span>{video.dislikes || 0}</span>
          </button>

          {/* Add to Playlist */}
          <button
            onClick={() => setShowAddToPlaylistModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/[0.04] border border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
          >
            <ListPlus className="w-4 h-4 text-emerald-400" />
            <span>Save</span>
          </button>

          {/* Share */}
          <div className="relative">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-white/[0.04] border border-white/10 text-slate-300 hover:bg-white/[0.08] hover:text-white transition-colors"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedToast && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 text-black text-[10px] font-extrabold rounded-md whitespace-nowrap shadow-md">
                Link copied!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description & Syllabus Box */}
      <div className="p-4 bg-[#0e121e]/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl">
        <p className="text-xs text-slate-300 leading-relaxed">
          {isDescriptionExpanded ? video.description : `${video.description.slice(0, 180)}...`}
        </p>

        {isDescriptionExpanded && (
          <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-3 animate-fadeIn">
            {/* Chapters list */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 font-mono">
                Lecture Chapters & Timestamps
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {video.chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => seekToTime(ch.timestamp)}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-emerald-500/40 text-left transition-all group"
                  >
                    <span className="px-2 py-0.5 rounded-md bg-white/[0.08] group-hover:bg-emerald-400 font-mono text-[11px] font-bold text-emerald-400 group-hover:text-black transition-colors">
                      {formatTime(ch.timestamp)}
                    </span>
                    <span className="text-xs text-slate-300 group-hover:text-white truncate">
                      {ch.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-slate-400 block mb-1.5 font-mono">Topic Tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {video.tags.map(t => (
                  <span
                    key={t}
                    className="text-[11px] px-2.5 py-1 bg-white/[0.04] text-slate-300 rounded-lg border border-white/10"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          className="mt-2 text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
        >
          {isDescriptionExpanded ? (
            <>
              Show Less <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              Show More Syllabus <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Add To Playlist Modal */}
      <AddToPlaylistModal
        isOpen={showAddToPlaylistModal}
        onClose={() => setShowAddToPlaylistModal(false)}
        video={video}
      />
    </div>
  );
};
