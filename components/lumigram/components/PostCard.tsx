"use client";
import React, { useState, useRef } from 'react';
import {
  Heart,
  MessageCircle,
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
  MoreHorizontal,
  Bookmark,
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

const AVAILABLE_EMOJIS = ['❤️', '🔥', '👏', '😈', '💡', '🎉', '🤝', '👀', '🚀', '💯', '🙌', '💥', '👑', '😭', '🚨', '😍', '🤩', '☕', '🍷', '🦄', '✨'];

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const lastTapRef = useRef<number>(0);

  // Multi-emoji reaction state
  const [reactions, setReactions] = useState<{ [emoji: string]: number }>(() => {
    if (post.reactions && Object.keys(post.reactions).length > 0) {
      return post.reactions;
    }
    // Deterministic counts based on post ID
    const hash = post.id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return {
      '❤️': 120 + (hash % 45),
      '🔥': 12 + (hash % 15),
      '👏': 10 + (hash % 8),
      '😈': 5 + (hash % 6),
      '💡': 4 + (hash % 5),
      '🎉': 7 + (hash % 4),
      '🤝': 10 + (hash % 6),
      '👀': 6 + (hash % 5),
      '🚀': 7 + (hash % 6),
      '💯': 4 + (hash % 4),
      '🙌': 11 + (hash % 7),
      '💥': 1 + (hash % 3),
      '👑': 6 + (hash % 5),
      '😭': 6 + (hash % 6),
      '🚨': 4 + (hash % 4),
      '😍': 4 + (hash % 4),
      '🤩': 2 + (hash % 3),
      '☕': 2,
      '🍷': 1,
      '🦄': 2,
      '✨': 1,
    };
  });
  const [userReactions, setUserReactions] = useState<Set<string>>(new Set());

  const handleToggleReaction = (emoji: string) => {
    soundManager.playLikeSound();
    setUserReactions((prev) => {
      const next = new Set(prev);
      const hasReacted = next.has(emoji);
      if (hasReacted) {
        next.delete(emoji);
        setReactions((curr) => ({
          ...curr,
          [emoji]: Math.max(0, (curr[emoji] || 1) - 1),
        }));
      } else {
        next.add(emoji);
        setReactions((curr) => ({
          ...curr,
          [emoji]: (curr[emoji] || 0) + 1,
        }));
      }
      return next;
    });
  };

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

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput);
    setCommentInput('');
  };

  const currentMediaUrl = safeImages[currentImageIndex] || safeImages[0];
  const isVideo = post.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(currentMediaUrl || '');

  // Extract or synthesize clean title for post
  const postTitle = post.title || (post.caption.length > 30 ? post.caption.split('\n')[0].replace(/[#@].*/g, '').trim() : '');

  return (
    <article className="w-full bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl mb-5 shadow-2xs overflow-hidden transition-colors">
      {/* Header matching Reference Screenshot */}
      <div className="p-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectUser(post.user)}
            className="group relative cursor-pointer"
            aria-label={`View profile of ${post.user.username}`}
          >
            <img
              src={post.user.avatar}
              alt={post.user.name || post.user.username}
              className="w-10 h-10 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700 group-hover:ring-blue-500 transition-all"
            />
          </button>
          <div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onSelectUser(post.user)}
                className="font-bold text-sm text-neutral-900 dark:text-neutral-100 hover:underline cursor-pointer"
              >
                {post.user.name || post.user.username}
              </button>
              {post.user.isVerified && (
                <CheckCircle2 size={14} className="text-blue-500 fill-blue-500 text-white" />
              )}
              <span className="text-neutral-500 dark:text-neutral-400 text-xs font-normal">
                {post.user.bio || `Developer of ColibriPlus`} · {formatTimeAgo(post.createdAt)}
              </span>
            </div>
            {post.location && (
              <p className="text-[11px] text-neutral-400 flex items-center gap-1 mt-0.5">
                <MapPin size={10} className="text-rose-500 shrink-0" />
                <span className="truncate max-w-[200px]">{post.location}</span>
              </p>
            )}
          </div>
        </div>

        {/* Options Menu Toggle */}
        <div className="relative">
          <button
            onClick={() => setShowOptions(!showOptions)}
            aria-label="Post options"
            className="p-1.5 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
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

      {/* Post Text & Title matching Reference Screenshot */}
      <div className="px-4 pt-1 pb-3 text-sm text-neutral-900 dark:text-neutral-100 leading-relaxed">
        {postTitle && postTitle.length < 50 && (
          <h2 className="font-bold text-[15px] mb-1 text-neutral-900 dark:text-white">
            {postTitle}
          </h2>
        )}
        <p className="whitespace-pre-line text-[14px]">
          {post.caption}
        </p>
      </div>

      {/* Media Carousel / Single Video or Image */}
      <div
        className={`relative w-full bg-black flex items-center justify-center overflow-hidden select-none ${
          post.aspectRatio === 'vertical' || post.aspectRatio === '9:16'
            ? 'aspect-[9/16] max-h-[580px]'
            : 'aspect-video max-h-[500px]'
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
            className="w-full h-full object-contain"
          />
        ) : (
          <img
            src={currentMediaUrl}
            alt={post.caption || 'Post image'}
            draggable={false}
            onContextMenu={(e) => e.preventDefault()}
            className="w-full h-full object-cover"
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
      </div>

      {/* MULTI-EMOJI REACTION TRAY matching Reference Screenshot */}
      <div className="p-3.5 pb-2">
        <div className="flex flex-wrap items-center gap-1.5 max-h-24 overflow-y-auto no-scrollbar py-0.5">
          {Object.entries(reactions).map(([emoji, count]) => {
            const hasReacted = userReactions.has(emoji);
            return (
              <button
                key={emoji}
                type="button"
                onClick={() => handleToggleReaction(emoji)}
                className={`px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1 transition-all cursor-pointer ${
                  hasReacted
                    ? 'bg-blue-100 text-blue-700 border border-blue-300 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 scale-105'
                    : 'bg-neutral-100 hover:bg-neutral-200/70 dark:bg-neutral-800/80 dark:hover:bg-neutral-700/80 text-neutral-700 dark:text-neutral-300 border border-transparent'
                }`}
                title={`React with ${emoji}`}
              >
                <span>{emoji}</span>
                <span className="text-[11px] font-mono">{count}</span>
              </button>
            );
          })}
        </div>

        {/* Action Row matching Reference Screenshot */}
        <div className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Like */}
            <button
              onClick={handleLikeClick}
              aria-label="Like"
              className="flex items-center gap-1 text-neutral-700 dark:text-neutral-300 hover:text-rose-500 transition-colors cursor-pointer group"
            >
              <Heart
                size={20}
                className={post.isLiked ? 'text-rose-500 fill-rose-500' : 'group-hover:scale-110 transition-transform'}
              />
              <span className="text-xs font-semibold">{formatCount(post.likesCount)}</span>
            </button>

            {/* Emoji Reaction Picker Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                aria-label="Add reaction"
                className="p-1 rounded-full text-neutral-700 dark:text-neutral-300 hover:text-amber-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                title="Add reaction"
              >
                <Smile size={20} />
              </button>

              {showEmojiPicker && (
                <div className="absolute left-0 bottom-8 z-30 p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-xl flex items-center gap-1.5 flex-wrap max-w-xs animate-in fade-in zoom-in-95 duration-100">
                  {AVAILABLE_EMOJIS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => {
                        handleToggleReaction(emoji);
                        setShowEmojiPicker(false);
                      }}
                      className="text-lg p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Comment */}
            <button
              onClick={() => {
                if (onOpenComments) {
                  onOpenComments(post);
                } else {
                  setIsExpanded(!isExpanded);
                }
              }}
              aria-label="Comment"
              className="p-1 text-neutral-700 dark:text-neutral-300 hover:text-blue-500 transition-colors cursor-pointer"
            >
              <MessageCircle size={20} />
            </button>
          </div>

          {/* Right Action: Show all comments button with avatar stack */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (onOpenComments) {
                  onOpenComments(post);
                } else {
                  setIsExpanded(!isExpanded);
                }
              }}
              className="flex items-center gap-2 text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              {safeComments.length > 0 && (
                <div className="flex -space-x-1.5 overflow-hidden">
                  {safeComments.slice(0, 3).map((c, i) => (
                    <img
                      key={c.id || i}
                      src={c.user.avatar}
                      alt={c.user.username}
                      className="inline-block h-5 w-5 rounded-full ring-2 ring-white dark:ring-neutral-900 object-cover"
                    />
                  ))}
                </div>
              )}
              <span>Show all comments ({post.commentsCount || safeComments.length})</span>
            </button>

            {/* AI Breakdown Pill */}
            <button
              type="button"
              onClick={() => setShowAiInsights(!showAiInsights)}
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                showAiInsights
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50'
              }`}
            >
              <Sparkles size={11} />
              <span>AI Radar</span>
            </button>
          </div>
        </div>

        {/* AI Breakdown Drawer */}
        {showAiInsights && (
          <div className="mt-3 p-3.5 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-blue-950/60 border border-blue-500/30 text-white backdrop-blur-md animate-in fade-in zoom-in-95 duration-200 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-blue-500/20">
              <div className="flex items-center gap-2">
                <Cpu size={14} className="text-blue-400" />
                <span className="text-xs font-bold text-blue-300">Pulse AI Radar</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-semibold">
                Viral Score: {insights.viralScore}/100
              </span>
            </div>

            <div className="mt-2.5 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
                <span className="text-[10px] text-neutral-400 block">Hook Retention</span>
                <span className="font-semibold text-blue-400">{insights.hookRate}</span>
              </div>
              <div className="p-2 rounded-xl bg-neutral-800/60 border border-neutral-700/50">
                <span className="text-[10px] text-neutral-400 block">Audio Radar</span>
                <span className="font-semibold text-teal-300 truncate block">{insights.soundRadar}</span>
              </div>
            </div>

            <div className="mt-2 text-[11px] text-neutral-300">
              <span className="text-blue-400 font-semibold mr-1">AI Tip:</span>
              {insights.creatorTip}
            </div>

            <div className="mt-2.5 p-2 rounded-xl bg-black/50 border border-blue-500/20 flex items-start justify-between gap-2">
              <div className="flex-1">
                <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider block">Recreate in AI Studio</span>
                <p className="text-[11px] text-neutral-300 italic line-clamp-1 mt-0.5">"{insights.suggestedPrompt}"</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(insights.suggestedPrompt);
                  setCopiedPrompt(true);
                  setTimeout(() => setCopiedPrompt(false), 2000);
                }}
                className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-semibold shrink-0 flex items-center gap-1 transition-colors cursor-pointer"
              >
                {copiedPrompt ? <Check size={11} /> : <Copy size={11} />}
                <span>{copiedPrompt ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Comments preview / expanded list */}
        {safeComments.length > 0 && (
          <div className="mt-2 space-y-1.5">
            {(isExpanded ? safeComments : safeComments.slice(0, 2)).map((c) => (
              <div key={c.id} className="text-xs text-neutral-800 dark:text-neutral-300 flex items-start justify-between gap-2">
                <div className="flex items-start gap-1.5 flex-1">
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100 hover:underline cursor-pointer shrink-0" onClick={() => onSelectUser(c.user)}>
                    {c.user.username}
                  </span>
                  {c.user.username === post.user.username && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30 shrink-0">
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
        )}

        {/* Creator is typing AI response indicator */}
        {isAiTyping && (
          <div className="mt-2 flex items-center gap-2 py-1.5 px-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs animate-pulse">
            <img src={post.user.avatar} alt="" className="w-4 h-4 rounded-full object-cover ring-1 ring-blue-500" />
            <span className="font-semibold">{post.user.username}</span>
            <span className="text-neutral-500 dark:text-neutral-400">is typing an AI response...</span>
            <div className="flex gap-1 items-center ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Quick AI Suggestion Chips */}
        <div className="mt-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800/80">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 shrink-0">
              <Sparkles size={11} className="text-blue-500 animate-pulse" /> Quick AI:
            </span>
            {aiSuggestions.map((suggestion, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onAddComment(post.id, suggestion);
                }}
                className="text-[11px] px-2.5 py-1 rounded-full bg-neutral-100 hover:bg-blue-50 dark:bg-neutral-800/70 dark:hover:bg-blue-950/40 border border-neutral-200 dark:border-neutral-700/60 hover:border-blue-500/50 text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 whitespace-nowrap transition-all cursor-pointer shadow-2xs hover:scale-102 active:scale-98"
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
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors cursor-pointer"
            >
              Post
            </button>
          )}
        </form>
      </div>
    </article>
  );
};
