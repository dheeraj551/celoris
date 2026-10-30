"use client"
import React, { useState } from 'react';
import {
  Grid,
  Bookmark,
  Film,
  UserCheck,
  Lock,
  CheckCircle2,
  Settings,
  Share2,
  Heart,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { User, Post } from '../types';
import { formatCount } from '../utils/socialLogic';
import { soundManager } from '../utils/sound';

interface ProfileViewProps {
  user: User;
  currentUser: User;
  posts: Post[];
  savedPosts: Post[];
  onToggleFollow: (user: User) => void;
  onOpenSettings: () => void;
  onSelectPost: (post: Post) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  user,
  currentUser,
  posts,
  savedPosts,
  onToggleFollow,
  onOpenSettings,
  onSelectPost,
}) => {
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'reels' | 'tagged'>('posts');
  const isSelf = user.id === currentUser.id;

  // Filter posts created by this user
  const userPosts = posts.filter((p) => p.userId === user.id);
  const isPrivateLocked = user.isPrivate && !user.isFollowing && !isSelf;

  const handleFollowClick = () => {
    soundManager.playSendSound();
    onToggleFollow(user);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Profile Header */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          {/* Avatar with gradient ring */}
          <div className="relative shrink-0">
            <div className="p-1 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 shadow-md">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-white dark:border-neutral-900"
              />
            </div>
            {user.isOnline && (
              <span className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900" />
            )}
          </div>

          {/* Details & Actions */}
          <div className="flex-1 text-center sm:text-left space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                  {user.username}
                </h1>
                {user.isVerified && (
                  <CheckCircle2 size={18} className="text-sky-500 fill-sky-500 text-white" />
                )}
                {user.isPrivate && (
                  <span className="p-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400" title="Private Account">
                    <Lock size={13} />
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-2">
                {isSelf ? (
                  <>
                    <button
                      onClick={onOpenSettings}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Settings size={15} />
                      Settings
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleFollowClick}
                      className={`px-5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                        user.isFollowing
                          ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-200'
                          : user.hasRequestedFollow
                          ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                          : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:opacity-95 shadow-xs'
                      }`}
                    >
                      {user.isFollowing
                        ? 'Following'
                        : user.hasRequestedFollow
                        ? 'Requested'
                        : 'Follow'}
                    </button>
                    <button
                      onClick={() => navigator.clipboard.writeText(window.location.href)}
                      className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                      aria-label="Share profile"
                    >
                      <Share2 size={16} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Counts Row */}
            <div className="flex items-center justify-center sm:justify-start gap-8 text-sm">
              <div>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  {userPosts.length}
                </span>{' '}
                <span className="text-neutral-500 dark:text-neutral-400 text-xs">posts</span>
              </div>
              <div>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCount(user.followersCount)}
                </span>{' '}
                <span className="text-neutral-500 dark:text-neutral-400 text-xs">followers</span>
              </div>
              <div>
                <span className="font-bold text-neutral-900 dark:text-neutral-100">
                  {formatCount(user.followingCount)}
                </span>{' '}
                <span className="text-neutral-500 dark:text-neutral-400 text-xs">following</span>
              </div>
            </div>

            {/* Bio & Links */}
            <div className="space-y-1.5 text-xs text-neutral-800 dark:text-neutral-200">
              <p className="font-semibold">{user.name}</p>
              <p className="whitespace-pre-line leading-relaxed">{user.bio}</p>
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-pink-600 dark:text-pink-400 font-semibold hover:underline"
                >
                  <ExternalLink size={12} />
                  {user.website.replace('https://', '')}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-neutral-200 dark:border-neutral-800 flex justify-center gap-8 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'posts'
              ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Grid size={15} />
          POSTS
        </button>

        {isSelf && (
          <button
            onClick={() => setActiveTab('saved')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'saved'
                ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
                : 'border-transparent text-neutral-400 hover:text-neutral-600'
            }`}
          >
            <Bookmark size={15} />
            SAVED
          </button>
        )}

        <button
          onClick={() => setActiveTab('reels')}
          className={`pb-3 flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'reels'
              ? 'border-neutral-900 dark:border-white text-neutral-900 dark:text-white'
              : 'border-transparent text-neutral-400 hover:text-neutral-600'
          }`}
        >
          <Film size={15} />
          REELS
        </button>
      </div>

      {/* Content Area */}
      {isPrivateLocked ? (
        /* Private Account Locked State */
        <div className="p-12 text-center bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl space-y-3">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto text-neutral-600 dark:text-neutral-400">
            <Lock size={32} />
          </div>
          <h3 className="font-bold text-base text-neutral-900 dark:text-neutral-100">
            This Account is Private
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto">
            Follow this account to see their photos, reels, and stories.
          </p>
          <button
            onClick={handleFollowClick}
            className="mt-2 px-5 py-2 rounded-xl text-xs font-semibold bg-pink-500 hover:bg-pink-600 text-white cursor-pointer"
          >
            {user.hasRequestedFollow ? 'Request Sent' : 'Request to Follow'}
          </button>
        </div>
      ) : activeTab === 'saved' ? (
        /* Saved Posts Tab */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {savedPosts.length > 0 ? (
            savedPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer shadow-xs"
              >
                <img
                  src={post.images[0]}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-neutral-500 text-xs">
              No saved posts yet. Tap the bookmark icon on any post to save it here.
            </div>
          )}
        </div>
      ) : (
        /* User's Posts Grid */
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div
                key={post.id}
                onClick={() => onSelectPost(post)}
                className="group relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800 cursor-pointer shadow-xs"
              >
                <img
                  src={post.images[0]}
                  alt={post.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 text-white font-semibold text-xs">
                  <span className="flex items-center gap-1">
                    <Heart size={16} className="fill-white" />
                    {formatCount(post.likesCount)}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={16} className="fill-white" />
                    {post.commentsCount}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-neutral-500 text-xs">
              No posts shared yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

