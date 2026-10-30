"use client"
import React, { useState } from 'react';
import {
  X,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Smile,
  MapPin,
  Flag,
} from 'lucide-react';
import { Post, User } from '../types';
import { formatTimeAgo, formatCount } from '../utils/socialLogic';
import { soundManager } from '../utils/sound';

interface PostDetailModalProps {
  post: Post;
  currentUser: User;
  onClose: () => void;
  onToggleLike: (postId: string) => void;
  onToggleSave: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onOpenReport: (post: Post) => void;
  onSelectUser: (user: User) => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({
  post,
  currentUser,
  onClose,
  onToggleLike,
  onToggleSave,
  onAddComment,
  onOpenReport,
  onSelectUser,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onAddComment(post.id, commentInput.trim());
    setCommentInput('');
  };

  const handleLike = () => {
    soundManager.playLikeSound();
    onToggleLike(post.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Media Left Column */}
        <div className="relative md:w-3/5 bg-black flex items-center justify-center select-none overflow-hidden aspect-square md:aspect-auto">
          {(() => {
            const currentUrl = (post.images && post.images[currentImgIndex]) || post.images?.[0] || '';
            const isVid = post.mediaType === 'video' || /\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(currentUrl);
            return isVid ? (
              <video
                src={currentUrl}
                controls
                autoPlay
                playsInline
                loop
                className="w-full h-full object-contain max-h-[80vh]"
              />
            ) : (
              <img
                src={currentUrl || '/courses/digital-marketing-mastery-og.jpg'}
                alt={post.caption || 'Media detail'}
                className={`w-full h-full object-contain max-h-[80vh] ${
                  post.filter === 'clarendon'
                    ? 'contrast-125 saturate-125'
                    : post.filter === 'juno'
                    ? 'saturate-150 contrast-110'
                    : post.filter === 'valencia'
                    ? 'sepia-25 brightness-105'
                    : post.filter === 'vintage'
                    ? 'grayscale contrast-125'
                    : ''
                }`}
              />
            );
          })()}

          {Array.isArray(post.images) && post.images.length > 1 && (
            <>
              {currentImgIndex > 0 && (
                <button
                  onClick={() => setCurrentImgIndex((i) => i - 1)}
                  aria-label="Previous image"
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white cursor-pointer"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              {currentImgIndex < post.images.length - 1 && (
                <button
                  onClick={() => setCurrentImgIndex((i) => i + 1)}
                  aria-label="Next image"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white cursor-pointer"
                >
                  <ChevronRight size={20} />
                </button>
              )}
            </>
          )}
        </div>

        {/* Details & Comments Right Column */}
        <div className="md:w-2/5 flex flex-col h-full bg-white dark:bg-neutral-900 border-t md:border-t-0 md:border-l border-neutral-200 dark:border-neutral-800">
          {/* Header */}
          <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  onSelectUser(post.user);
                }}
                className="cursor-pointer"
              >
                <img
                  src={post.user.avatar}
                  alt={post.user.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </button>
              <div>
                <button
                  onClick={() => {
                    onClose();
                    onSelectUser(post.user);
                  }}
                  className="font-bold text-xs text-neutral-900 dark:text-neutral-100 hover:underline cursor-pointer block text-left"
                >
                  {post.user.username}
                </button>
                {post.location && (
                  <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                    <MapPin size={11} className="text-rose-500" />
                    {post.location}
                  </span>
                )}
              </div>
            </div>

            <button
              onClick={() => onOpenReport(post)}
              className="text-neutral-400 hover:text-rose-500 p-1 cursor-pointer"
              aria-label="Report post"
            >
              <Flag size={16} />
            </button>
          </div>

          {/* Comments and Caption Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {/* Caption item */}
            <div className="flex items-start gap-3">
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="w-8 h-8 rounded-full object-cover shrink-0"
              />
              <div className="text-xs text-neutral-800 dark:text-neutral-200">
                <span className="font-bold mr-1.5 text-neutral-900 dark:text-neutral-100">
                  {post.user.username}
                </span>
                <span>{post.caption}</span>
                <span className="text-[10px] text-neutral-400 block mt-1">
                  {formatTimeAgo(post.createdAt)}
                </span>
              </div>
            </div>

            {/* Comments list */}
            {post.comments.map((comment) => (
              <div key={comment.id} className="flex items-start gap-3">
                <img
                  src={comment.user.avatar}
                  alt={comment.user.username}
                  className="w-7 h-7 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 text-xs text-neutral-800 dark:text-neutral-200">
                  <span className="font-semibold mr-1.5 text-neutral-900 dark:text-neutral-100">
                    {comment.user.username}
                  </span>
                  <span>{comment.text}</span>
                  <div className="flex items-center gap-3 text-[10px] text-neutral-400 mt-1">
                    <span>{formatTimeAgo(comment.createdAt)}</span>
                    <button className="hover:underline cursor-pointer">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Row */}
          <div className="p-3.5 border-t border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLike}
                  aria-label={post.isLiked ? 'Unlike' : 'Like'}
                  className="cursor-pointer"
                >
                  <Heart
                    size={22}
                    className={post.isLiked ? 'text-rose-500 fill-rose-500' : 'text-neutral-700 dark:text-neutral-300'}
                  />
                </button>
                <button
                  onClick={() => soundManager.playSendSound()}
                  aria-label="Direct message"
                  className="text-neutral-700 dark:text-neutral-300 cursor-pointer"
                >
                  <Send size={22} />
                </button>
              </div>

              <button
                onClick={() => onToggleSave(post.id)}
                aria-label="Save"
                className="text-neutral-700 dark:text-neutral-300 cursor-pointer"
              >
                <Bookmark
                  size={22}
                  className={post.isSaved ? 'text-neutral-900 dark:text-neutral-100 fill-current' : ''}
                />
              </button>
            </div>

            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 block mb-1">
              {formatCount(post.likesCount)} likes
            </span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider block">
              {formatTimeAgo(post.createdAt)} AGO
            </span>

            {/* Comment Form */}
            <form
              onSubmit={handleCommentSubmit}
              className="mt-3 pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                className="flex-1 text-xs bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none"
              />
              {commentInput.trim() && (
                <button
                  type="submit"
                  className="text-xs font-bold text-emerald-500 hover:text-emerald-600 cursor-pointer"
                >
                  Post
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

