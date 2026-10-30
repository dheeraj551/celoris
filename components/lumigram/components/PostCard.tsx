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
} from 'lucide-react';
import { Post, User } from '../types';
import { formatTimeAgo, formatCount } from '../utils/socialLogic';
import { soundManager } from '../utils/sound';

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
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [commentInput, setCommentInput] = useState('');
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const lastTapRef = useRef<number>(0);

  const safeImages = Array.isArray(post.images) && post.images.length > 0
    ? post.images
    : ['/courses/digital-marketing-mastery-og.jpg'];
  const safeComments = Array.isArray(post.comments) ? post.comments : [];

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
                <CheckCircle2 size={14} className="text-sky-500 fill-sky-500 text-white" />
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

      {/* Media Carousel / Single Image with Double Tap */}
      <div
        className="relative w-full aspect-square bg-neutral-100 dark:bg-neutral-950 flex items-center justify-center overflow-hidden cursor-pointer select-none"
        onClick={handleDoubleTap}
      >
        <img
          src={safeImages[currentImageIndex] || safeImages[0]}
          alt={post.caption || 'Post image'}
          className={`w-full h-full object-cover transition-transform duration-300 ${
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
              onClick={() => setIsExpanded(true)}
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
            {!isExpanded && post.commentsCount > 2 ? (
              <button
                onClick={() => setIsExpanded(true)}
                className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:underline cursor-pointer"
              >
                View all {post.commentsCount} comments
              </button>
            ) : null}

            {/* List top comments or all if expanded */}
            <div className="mt-1 space-y-1">
              {(isExpanded ? safeComments : safeComments.slice(0, 2)).map((c) => (
                <div key={c.id} className="text-xs text-neutral-800 dark:text-neutral-300 flex items-start justify-between">
                  <div>
                    <span className="font-semibold mr-1.5">{c.user.username}</span>
                    <span>{c.text}</span>
                  </div>
                  <span className="text-[10px] text-neutral-400 ml-2 shrink-0">
                    {formatTimeAgo(c.createdAt)}
                  </span>
                </div>
              ))}
            </div>
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

        {/* Inline Add Comment */}
        <form
          onSubmit={handleCommentSubmit}
          className="mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center gap-2"
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
              className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors cursor-pointer"
            >
              Post
            </button>
          )}
        </form>
      </div>
    </article>
  );
};

