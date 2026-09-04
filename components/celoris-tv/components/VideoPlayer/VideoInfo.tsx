import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Video } from '../../types';
import { formatViews, formatTime } from '../../utils/formatters';
import {
  ThumbsUp,
  Bookmark,
  ListPlus,
  Share2,
  Download,
  CheckCircle,
  FileText,
  Code,
  GraduationCap,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Check,
} from 'lucide-react';
import { AddToPlaylistModal } from '../Modals/AddToPlaylistModal';

interface Props {
  video: Video;
}

export const VideoInfo: React.FC<Props> = ({ video }) => {
  const { currentUser, toggleLike, toggleSave, seekToTime } = useApp();
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState<boolean>(false);
  const [showAddToPlaylistModal, setShowAddToPlaylistModal] = useState<boolean>(false);
  const [showResourcesDropdown, setShowResourcesDropdown] = useState<boolean>(false);
  const [isEnrolled, setIsEnrolled] = useState<boolean>(
    currentUser.enrolledCourseIds.includes(video.id)
  );
  const [copiedToast, setCopiedToast] = useState<boolean>(false);

  const isLiked = currentUser.likedVideoIds.includes(video.id);
  const isSaved = currentUser.savedVideoIds.includes(video.id);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2400);
  };

  const handleEnrollToggle = () => {
    setIsEnrolled(!isEnrolled);
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
          {formatViews(video.views)} • Published {video.publishedAt}
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

          <button
            onClick={handleEnrollToggle}
            className={`ml-2 px-4 py-2 text-xs font-bold rounded-xl transition-all shadow-md ${
              isEnrolled
                ? 'bg-[#181D18] text-[#A8B89C] border border-[#7F9172]/40 hover:bg-[#222922]'
                : 'bg-[#7F9172] hover:bg-[#91A582] text-[#0D0F0D] shadow-[#7F9172]/20 hover:scale-102 font-bold'
            }`}
          >
            {isEnrolled ? '✓ Enrolled in Course' : '+ Enroll Course'}
          </button>
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
            <span>{video.likes}</span>
          </button>

          {/* Add to Playlist */}
          <button
            onClick={() => setShowAddToPlaylistModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#181D18] border border-[#2A322A] text-[#95A395] hover:bg-[#222922] hover:text-white transition-colors"
          >
            <ListPlus className="w-4 h-4 text-[#7F9172]" />
            <span>Save to Playlist</span>
          </button>

          {/* Save / Watchlist */}
          <button
            onClick={() => toggleSave(video.id)}
            className={`p-2 rounded-xl border text-xs font-semibold transition-colors ${
              isSaved
                ? 'bg-[#7F9172]/25 border-[#7F9172]/60 text-[#A8B89C]'
                : 'bg-[#181D18] border-[#2A322A] text-[#95A395] hover:bg-[#222922] hover:text-white'
            }`}
            title={isSaved ? 'Saved in Library' : 'Save for later'}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-[#7F9172] text-[#7F9172]' : ''}`} />
          </button>

          {/* Resources Download Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowResourcesDropdown(!showResourcesDropdown)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#181D18] border border-[#2A322A] text-[#95A395] hover:bg-[#222922] hover:text-white transition-colors"
            >
              <Download className="w-4 h-4 text-[#7F9172]" />
              <span>Slides & Code ({video.resources.length})</span>
            </button>

            {showResourcesDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-[#161B16] border border-[#2A322A] rounded-2xl shadow-2xl p-2 z-40 animate-fadeIn">
                <div className="px-3 py-2 border-b border-[#242A24] text-[11px] font-bold uppercase tracking-wider text-[#95A395]">
                  Course Materials & Attachments
                </div>
                <div className="py-1 space-y-1">
                  {video.resources.map(res => (
                    <a
                      key={res.id}
                      href={res.url}
                      onClick={e => {
                        e.preventDefault();
                        alert(`Downloading: ${res.title}`);
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#1E241E] text-[#E0E5E0] transition-colors group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {res.type === 'slides' || res.type === 'pdf' ? (
                          <FileText className="w-4 h-4 text-[#C87D55] flex-shrink-0" />
                        ) : (
                          <Code className="w-4 h-4 text-[#7F9172] flex-shrink-0" />
                        )}
                        <div className="truncate">
                          <p className="text-xs font-medium text-white truncate">{res.title}</p>
                          <span className="text-[10px] text-[#95A395]">{res.size || 'Attachment'}</span>
                        </div>
                      </div>
                      <Download className="w-3.5 h-3.5 text-[#5E6C5E] group-hover:text-[#7F9172] transition-colors flex-shrink-0 ml-2" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

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
