import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { formatTime } from '../../utils/formatters';
import {
  ThumbsUp,
  ThumbsDown,
  ListPlus,
  Share2,
  CheckCircle,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
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
    <div className="space-y-4 pt-3 text-[#E0E5E0]">
      {/* Video Subject & Badges */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-[#7F9172]/15 text-[#A8B89C] border border-[#7F9172]/30 rounded-lg">
          {video.subject}
        </span>
        <span className="px-2.5 py-1 text-[11px] font-semibold bg-[#181D18] text-[#E0E5E0] border border-[#2A322A] rounded-lg">
          {video.difficulty}
        </span>
        <span className="px-2.5 py-1 text-[11px] font-medium bg-[#141814] text-[#95A395] border border-[#242A24] rounded-lg">
          {video.gradeLevel}
        </span>
        <span className="text-xs text-[#95A395] ml-auto">
          Published {video.publishedAt}
        </span>
      </div>

      {/* Video Title */}
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white leading-tight">
        {video.title}
      </h1>

      {/* Author & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#242A24]">
        {/* Author Card */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={video.author.avatar}
              alt={video.author.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-[#7F9172]/40"
            />
            {video.author.verified && (
              <div
                className="absolute -bottom-1 -right-1 bg-[#7F9172] text-[#0D0F0D] rounded-full p-0.5"
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
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#7F9172]/20 text-[#A8B89C] border border-[#7F9172]/30">
                  Professor
                </span>
              )}
            </div>
            <p className="text-xs text-[#95A395]">
              {video.author.institution || video.author.title}
            </p>
          </div>

          <CourseInquiryDialog
            courseTitle={video.title}
            buttonText="+ Enroll Course"
            buttonClassName="ml-2 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-md bg-[#7F9172] hover:bg-[#91A582] text-[#0D0F0D] shadow-[#7F9172]/20 hover:scale-102"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Like */}
          <button
            onClick={() => toggleLike(video.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isLiked
                ? 'bg-[#7F9172]/20 border-[#7F9172]/60 text-[#A8B89C]'
                : 'bg-[#181D18] border-[#2A322A] text-[#95A395] hover:bg-[#222922] hover:text-white'
            }`}
          >
            <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-[#7F9172] text-[#7F9172]' : ''}`} />
            <span>{video.likes || 0}</span>
          </button>

          {/* Dislike */}
          <button
            onClick={() => toggleDislike(video.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
              isDisliked
                ? 'bg-[#C87D55]/20 border-[#C87D55]/60 text-[#E0B79C]'
                : 'bg-[#181D18] border-[#2A322A] text-[#95A395] hover:bg-[#222922] hover:text-white'
            }`}
          >
            <ThumbsDown className={`w-4 h-4 ${isDisliked ? 'fill-[#C87D55] text-[#C87D55]' : ''}`} />
            <span>{video.dislikes || 0}</span>
          </button>

          {/* Add to Playlist */}
          <button
            onClick={() => setShowAddToPlaylistModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#181D18] border border-[#2A322A] text-[#95A395] hover:bg-[#222922] hover:text-white transition-colors"
          >
            <ListPlus className="w-4 h-4 text-[#7F9172]" />
            <span>Save to Playlist</span>
          </button>

          {/* Share */}
          <div className="relative">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-[#181D18] border border-[#2A322A] text-[#95A395] hover:bg-[#222922] hover:text-white transition-colors"
              title="Copy share link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedToast && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 bg-[#7F9172] text-[#0D0F0D] text-[10px] font-bold rounded-md whitespace-nowrap shadow-md">
                Link copied!
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description & Syllabus Box */}
      <div className="p-4 bg-[#141814] border border-[#242A24] rounded-2xl">
        <p className="text-xs text-[#E0E5E0] leading-relaxed">
          {isDescriptionExpanded ? video.description : `${video.description.slice(0, 180)}...`}
        </p>

        {isDescriptionExpanded && (
          <div className="mt-4 pt-4 border-t border-[#242A24] space-y-3 animate-fadeIn">
            {/* Chapters list */}
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2">
                Lecture Chapters & Timestamps
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {video.chapters.map((ch, idx) => (
                  <button
                    key={idx}
                    onClick={() => seekToTime(ch.timestamp)}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-[#181D18] hover:bg-[#222922] border border-[#2A322A] hover:border-[#7F9172]/50 text-left transition-all group"
                  >
                    <span className="px-2 py-0.5 rounded-md bg-[#1E241E] group-hover:bg-[#7F9172] font-mono text-[11px] font-bold text-[#A8B89C] group-hover:text-[#0D0F0D] transition-colors">
                      {formatTime(ch.timestamp)}
                    </span>
                    <span className="text-xs text-[#E0E5E0] group-hover:text-white truncate">
                      {ch.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-[#95A395] block mb-1.5">Topic Tags:</span>
              <div className="flex flex-wrap gap-1.5">
                {video.tags.map(t => (
                  <span
                    key={t}
                    className="text-[11px] px-2.5 py-1 bg-[#181D18] text-[#E0E5E0] rounded-lg border border-[#2A322A]"
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
          className="mt-2 text-xs font-bold text-[#A8B89C] hover:text-white flex items-center gap-1"
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
