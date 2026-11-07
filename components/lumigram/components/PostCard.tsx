"use client"
import React, { useState, useRef } from 'react';
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Smile,
  CheckCircle2,
  MapPin,
  Flag,
  Share2,
  TrendingUp,
  Sparkles,
  Cpu,
  Copy,
  Check,
} from 'lucide-react';
import { Post, User } from '../types';
import { formatTimeAgo, formatCount } from '../utils/socialLogic';
import { soundManager } from '../utils/sound';
import { getAiCommentSuggestions, getAiPostInsights } from '../utils/aiSocialEngine';

interface PostCardProps {
  post: Post;
  currentUser: User;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenReport: (post: Post) => void;
  onOpenShareModal: (post: Post) => void;
  onSelectUser: (user: User) => void;
  onBoostPost?: (post: Post) => void;
  onOpenComments?: (post: Post) => void;
  isAiTyping?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUser,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onOpenReport,
  onOpenShareModal,
  onSelectUser,
  onBoostPost,
  onOpenComments,
  isAiTyping = false,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const lastTapRef = useRef<number>(0);

  const safeImages = Array.isArray(post.images) && post.images.length > 0
    ? post.images
    : ['/courses/digital-marketing-mastery-og.jpg'];
  const safeComments = Array.isArray(post.comments) ? post.comments : [];
  const aiSuggestions = getAiCommentSuggestions(post);
  const insights = getAiPostInsights(post);

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      if (!post.isLiked) {
        onToggleLike(post.id);
      }
      soundManager.playLikeSound();
      setShowHeartAnimation(true);
      setTimeout(() => setShowHeartAnimation(false), 900);
    }
    lastTapRef.current = now;
  };

  const handleLikeClick = () => {
    soundManager.playLikeSound();
    onToggleLike(post.id);
  };

  const handleSaveClick = () => {
    onToggleSave(post.id);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput);
    setCommentInput('');
  };

  const currentMediaUrl = safeImages[currentImageIndex] || safeImages[0];
  const isVideo = post.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(currentMediaUrl || '');

  return (
    <article className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl mb-6 shadow-xs overflow-hidden transition-colors">
      {/* Header */}
      <div className="p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectUser(post.user)}
            className="group relative cursor-pointer"
            aria-label={`View profile of ${post.user.username}`}
          >
            <img
              src={post.user.avatar}
              alt={post.user.username}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700 group-hover:ring-emerald-500 transition-all"
            />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onSelectUser(post.user)}
                className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 hover:underline cursor-pointer"
              >
                {post.user.username}
              </button>
              {post.user.isVerified && (
                <CheckCircle2 size={14} className="text-emerald-500 fill-emerald-500 text-white" />
              )}
              <span className="text-neutral-400 dark:text-neutral-500 text-xs">•</span>
              <span className="text-neutral-500 dark:text-neutral-400 text-xs font-normal">
                {formatTimeAgo(post.createdAt)}
              </span>
            </div>
            {post.isSponsored ? (
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5 mt-0.5">
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">Sponsored</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {post.sponsorData && (
                  <span className="text-[10px] font-mono text-emerald-500 font-semibold">
                    CTR {post.sponsorData.ctr} · CPC {post.sponsorData.cpc}
                  </span>
                )}
              </p>
            ) : post.location ? (
              <p className="text-xs text-neutral-500 dark:text-neutral-400 flex items-center gap-1 mt-0.5">
                <MapPin size={11} className="text-rose-500 shrink-0" />
                <span className="truncate max-w-[200px]">{post.location}</span>
              </p>
            ) : null}
          </div>
        </div>

        {/* Options Menu Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            aria-label="Post options"
            className="p-1.5 rounded-full text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <MoreHorizontal size={18} />
          </button>

          {showOptions && (
            <div className="absolute right-0 top-8 z-20 w-44 bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 py-1.5 animate-in fade-in zoom-in-95 duration-100">
              <button
                onClick={() => {
                  setShowOptions(false);
                  onOpenReport(post);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 cursor-pointer"
              >
                <Flag size={14} />
                Report Post
              </button>
              <button
                onClick={() => {
                  setShowOptions(false);
                  onOpenShareModal(post);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 cursor-pointer"
              >
                <Share2 size={14} />
                Share to...
              </button>
              <button
                onClick={() => {
                  setShowOptions(false);
                  navigator.clipboard.writeText(window.location.href);
                }}
                className="w-full px-3.5 py-2 text-left text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 flex items-center gap-2 cursor-pointer"
              >
                Copy Link
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Media Carousel / Single Image or Video with Double Tap */}
      <div
        className={`relative w-full bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center overflow-hidden select-none ${
          post.aspectRatio === 'vertical' || post.aspectRatio === '9:16'
            ? 'aspect-[9/16] max-h-[620px]'
            : post.aspectRatio === 'portrait'
            ? 'aspect-[4/5]'
            : post.aspectRatio === 'landscape'
            ? 'aspect-[16/9]'
            : 'aspect-square'
        }`}
        onClick={handleDoubleTap}
      >
        {isVideo ? (
          <video
            src={currentMediaUrl}
            poster={post.thumbnail}
            controls
            playsInline
            loop
            preload="metadata"
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={currentMediaUrl}
            alt={post.caption || 'Post image'}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className={`w-full h-full object-cover transition-transform duration-300 pointer-events-none select-none ${
              post.filter === 'clarendon'
                ? 'contrast-125 saturate-125'
                : post.filter === 'juno'
                ? 'saturate-150 contrast-110 hue-rotate-15'
                : post.filter === 'valencia'
                ? 'sepia-25 brightness-105'
                : post.filter === 'vintage'
                ? 'grayscale contrast-125'
                : ''
            }`}
            loading="lazy"
          />
        )}

        {/* Double-tap Bursting Heart Animation */}
        {showHeartAnimation && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20 animate-heart-burst">
            <Heart
              size={100}
              className="text-rose-500 fill-rose-500 drop-shadow-2xl"
            />
          </div>
        )}

        {/* Carousel Navigation Arrows */}
        {safeImages.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => prev - 1);
                }}
                aria-label="Previous image"
                className="absolute left-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {currentImageIndex < safeImages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) => prev + 1);
                }}
                aria-label="Next image"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
              >
                <ChevronRight size={18} />
              </button>
            )}

            {/* Pagination Dots */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5 z-10 pointer-events-none">
              {safeImages.map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    i === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Sponsored Campaign CTA Banner */}
      {post.isSponsored && post.sponsorData && (
        <div className="bg-neutral-100 dark:bg-neutral-800/80 border-b border-neutral-200 dark:border-neutral-800 px-4 py-2.5 flex items-center justify-between">
          <div className="text-xs">
            <span className="font-semibold text-neutral-900 dark:text-white block">
              {post.sponsorData.leads} Leads Generated
            </span>
            <span className="text-neutral-500 text-[11px]">
              Daily Budget: ₹{post.sponsorData.dailyBudget}
            </span>
          </div>
          <button
            type="button"
            onClick={() => alert(`Ad destination: ${post.sponsorData?.destination}`)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold px-4 py-1.5 rounded-xl transition-colors cursor-pointer"
          >
            {post.sponsorData.buttonText} &gt;
          </button>
        </div>
      )}

      {/* Action Buttons Bar */}
      <div className="p-3.5 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleLikeClick}
              aria-label={post.isLiked ? 'Unlike photo' : 'Like photo'}
              className="group focus:outline-none cursor-pointer"
            >
              <Heart
                size={24}
                className={`transition-all duration-200 group-hover:scale-115 ${
                  post.isLiked
                    ? 'text-rose-500 fill-rose-500 scale-105'
                    : 'text-neutral-800 dark:text-neutral-200 hover:text-neutral-500'
                }`}
              />
            </button>
            <button
              onClick={() => {
                if (onOpenComments) {
                  onOpenComments(post);
                } else {
                  setIsExpanded(true);
                }
              }}
              aria-label="View comments"
              className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-500 transition-colors cursor-pointer"
            >
              <MessageCircle size={24} />
            </button>
            <button
              onClick={() => onOpenShareModal(post)}
              aria-label="Direct message share"
              className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-500 transition-colors cursor-pointer"
            >
              <Send size={24} />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowAiInsights(!showAiInsights)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                showAiInsights
                  ? 'bg-emerald-500 text-white shadow-xs'
                  : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
              title="Toggle AI Breakdown & Viral Retention Radar"
            >
              <Sparkles size={12} className={showAiInsights ? 'animate-spin-slow' : 'text-emerald-500 animate-pulse'} />
              <span>AI Breakdown</span>
            </button>

            <button
              onClick={handleSaveClick}
              aria-label={post.isSaved ? 'Remove from saved' : 'Save post'}
              className="text-neutral-800 dark:text-neutral-200 hover:text-neutral-500 transition-colors cursor-pointer"
            >
              <Bookmark
                size={24}
                className={post.isSaved ? 'text-neutral-900 dark:text-neutral-100 fill-current' : ''}
              />
            </button>
          </div>
        </div>

        {/* AI Reel Intelligence Radar Drawer */}
        {showAiInsights && (
          <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-emerald-950/60 border border-emerald-500/30 text-white backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300">Pulse AI Intelligence Radar</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold">
                Viral Score: {insights.viralScore}/100
              </span>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
                <span className="text-[10px] text-neutral-400 block">Hook Retention</span>
                <span className="font-semibold text-emerald-400">{insights.hookRate}</span>
              </div>
              <div className="p-2 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
                <span className="text-[10px] text-neutral-400 block">Audio Radar</span>
                <span className="font-semibold text-teal-300 truncate block">{insights.soundRadar}</span>
              </div>
            </div>

            <div className="mt-2 text-[11px] text-neutral-300">
              <span className="text-emerald-400 font-semibold mr-1">AI Tip:</span>
              {insights.creatorTip}
            </div>

            {/* AI Recreate Prompt */}
            <div className="mt-2.5 p-2.5 rounded-xl bg-black/50 border border-emerald-500/20 flex items-start justify-between gap-2">
              <div className="flex-1">
                <span className="text-[10px] font-semibold text-emerald-400 uppercase tracking-wider block">Recreate in AI Studio</span>
                <p className="text-[11px] text-neutral-300 italic line-clamp-2 mt-0.5">"{insights.suggestedPrompt}"</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(insights.suggestedPrompt);
                  setCopiedPrompt(true);
                  setTimeout(() => setCopiedPrompt(false), 2000);
                }}
                className="px-2 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-semibold shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedPrompt ? <Check size={11} /> : <Copy size={11} />}
                <span>{copiedPrompt ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Likes Count */}
        <div className="mt-2.5">
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {formatCount(post.likesCount)} likes
          </span>
        </div>

        {/* Caption */}
        <div className="mt-1.5 text-sm text-neutral-900 dark:text-neutral-200 leading-snug">
          <span className="font-semibold mr-2">{post.user.username}</span>
          <span>{post.caption}</span>
        </div>

        {/* Comments preview / toggle */}
        {post.commentsCount > 0 && (
          <div className="mt-2">
            {post.commentsCount > 0 ? (
              <button
                onClick={() => {
                  if (onOpenComments) {
                    onOpenComments(post);
                  } else {
                    setIsExpanded(!isExpanded);
                  }
                }}
                className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-emerald-500 hover:underline cursor-pointer flex items-center gap-1.5"
              >
                <span>View all {formatCount(post.commentsCount)} comments</span>
                {safeComments.length > 0 && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300">
                    {safeComments.length} active
                  </span>
                )}
              </button>
            ) : null}

            {/* List top comments or all if expanded */}
            <div className="mt-1.5 space-y-1.5">
              {(isExpanded ? safeComments : safeComments.slice(0, 3)).map((c) => (
                <div key={c.id} className="text-xs text-neutral-800 dark:text-neutral-300 flex items-start justify-between gap-2">
                  <div className="flex items-start gap-1.5 flex-1">
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100 hover:underline cursor-pointer shrink-0" onClick={() => onSelectUser(c.user)}>
                      {c.user.username}
                    </span>
                    {c.user.username === post.user.username && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 shrink-0">
                        Creator ✨
                      </span>
                    )}
                    <span className="text-neutral-700 dark:text-neutral-300">{c.text}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 shrink-0">
                    {formatTimeAgo(c.createdAt)}
                  </span>
                </div>
              ))}
            </div>

            {/* Creator is typing AI response indicator */}
            {isAiTyping && (
              <div className="mt-2 flex items-center gap-2 py-1.5 px-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs animate-pulse">
                <img src={post.user.avatar} alt="" className="w-4 h-4 rounded-full object-cover ring-1 ring-emerald-500" />
                <span className="font-semibold">{post.user.username}</span>
                <span className="text-neutral-500 dark:text-neutral-400">is typing an AI response...</span>
                <div className="flex gap-1 items-center ml-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Ad Studio Amplify Button */}
        {onBoostPost && !post.isSponsored && (
          <div className="mt-3">
            <button
              type="button"
              onClick={() => onBoostPost(post)}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
            >
              <TrendingUp size={14} />
              <span>Amplify in Ad Studio (₹10,000 Credits)</span>
            </button>
          </div>
        )}

        {/* 1-Tap AI Auto-Like & Comment Action */}
        <div className="mt-2">
          <button
            type="button"
            onClick={() => {
              if (!post.isLiked) {
                onToggleLike(post.id);
              }
              const randomChip = aiSuggestions[Math.floor(Math.random() * aiSuggestions.length)];
              onAddComment(post.id, randomChip);
            }}
            className="w-full py-2 rounded-xl bg-neutral-900 dark:bg-neutral-800 hover:bg-neutral-800 dark:hover:bg-neutral-700 border border-emerald-500/40 text-emerald-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer hover:scale-[1.01]"
          >
            <Sparkles size={13} className="text-emerald-400 animate-spin-slow" />
            <span>AI Auto-Like & Comment (1-Tap Simulation)</span>
          </button>
        </div>

        {/* Quick AI Suggestion Chips */}
        <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 shrink-0">
              <Sparkles size={11} className="text-emerald-500 animate-pulse" /> Quick AI:
            </span>
            {aiSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onAddComment(post.id, suggestion);
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-emerald-50 dark:bg-neutral-800/70 dark:hover:bg-emerald-950/40 border border-neutral-200 dark:border-neutral-700/60 hover:border-emerald-500/50 text-neutral-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Inline Add Comment */}
        <form
          onSubmit={handleCommentSubmit}
          className="mt-1.5 pt-1.5 flex items-center gap-2"
        >
          <Smile size={18} className="text-neutral-400 dark:text-neutral-500 shrink-0" />
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            className="flex-1 text-xs bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none"
          />
          {commentInput.trim() && (
            <button
              type="submit"
              className="text-xs font-semibold text-emerald-500 hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Post
            </button>
          )}
        </form>
      </div>
    </article>
  );
};

