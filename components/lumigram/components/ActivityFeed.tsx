"use client"
import React from 'react';
import {
  Heart,
  MessageCircle,
  UserPlus,
  AtSign,
  ShieldAlert,
  Check,
  X,
  Bell,
  Sparkles,
} from 'lucide-react';
import { NotificationItem, User } from '../types';
import { formatTimeAgo } from '../utils/socialLogic';
import { soundManager } from '../utils/sound';

interface ActivityFeedProps {
  notifications: NotificationItem[];
  currentUser: User;
  onFollowToggle: (user: User) => void;
  onSelectUser: (user: User) => void;
  onSelectPost?: (postId: string) => void;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  notifications,
  currentUser,
  onFollowToggle,
  onSelectUser,
  onSelectPost,
}) => {
  const followRequests = notifications.filter((n) => n.type === 'follow_request');
  const otherNotifications = notifications.filter((n) => n.type !== 'follow_request');

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-xs p-5">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-4">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <Bell size={20} className="text-pink-500" />
          Activity & Notifications
        </h2>
        <span className="text-xs px-2.5 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-600 dark:text-pink-400 font-semibold">
          Real-time Feed
        </span>
      </div>

      {/* Follow Requests Section if user has private requests */}
      {followRequests.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-amber-500" />
              Follow Requests ({followRequests.length})
            </span>
            <span className="text-[11px] text-neutral-500">Private account gate</span>
          </div>

          <div className="space-y-3">
            {followRequests.map((req) => (
              <div key={req.id} className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onSelectUser(req.actor)}
                    className="cursor-pointer"
                  >
                    <img
                      src={req.actor.avatar}
                      alt={req.actor.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </button>
                  <div>
                    <button
                      onClick={() => onSelectUser(req.actor)}
                      className="text-xs font-semibold text-neutral-900 dark:text-neutral-100 hover:underline cursor-pointer block text-left"
                    >
                      {req.actor.username}
                    </button>
                    <span className="text-[11px] text-neutral-500 dark:text-neutral-400">
                      {req.actor.name} wants to follow you
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      soundManager.playSendSound();
                      onFollowToggle(req.actor);
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold bg-pink-500 hover:bg-pink-600 text-white cursor-pointer transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => soundManager.playSendSound()}
                    className="p-1.5 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-500 cursor-pointer transition-colors"
                    aria-label="Decline follow request"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Activity Feed List */}
      <div className="space-y-4">
        {otherNotifications.map((notif) => {
          return (
            <div
              key={notif.id}
              className="flex items-center justify-between gap-3 py-2 border-b border-neutral-100 dark:border-neutral-800/40 last:border-none"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Avatar with type badge */}
                <div className="relative shrink-0">
                  <button
                    onClick={() => onSelectUser(notif.actor)}
                    className="cursor-pointer"
                  >
                    <img
                      src={notif.actor.avatar}
                      alt={notif.actor.username}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                  </button>
                  <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-white dark:bg-neutral-900 shadow-sm border border-neutral-200 dark:border-neutral-700">
                    {notif.type === 'like' && (
                      <Heart size={10} className="text-rose-500 fill-rose-500" />
                    )}
                    {notif.type === 'comment' && (
                      <MessageCircle size={10} className="text-sky-500" />
                    )}
                    {notif.type === 'follow' && (
                      <UserPlus size={10} className="text-purple-500" />
                    )}
                    {notif.type === 'mention' && (
                      <AtSign size={10} className="text-emerald-500" />
                    )}
                  </span>
                </div>

                <div className="text-xs text-neutral-800 dark:text-neutral-200 leading-snug">
                  <span
                    onClick={() => onSelectUser(notif.actor)}
                    className="font-bold hover:underline cursor-pointer mr-1 text-neutral-900 dark:text-neutral-100"
                  >
                    {notif.actor.username}
                  </span>
                  <span>{notif.text}</span>
                  <span className="text-[10px] text-neutral-400 dark:text-neutral-500 ml-1.5 block sm:inline">
                    {formatTimeAgo(notif.createdAt)}
                  </span>
                </div>
              </div>

              {/* Action side: post thumbnail or follow button */}
              {notif.targetPost ? (
                <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
                  <img
                    src={notif.targetPost.images[0]}
                    alt="Post thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : notif.type === 'follow' ? (
                <button
                  onClick={() => {
                    soundManager.playSendSound();
                    onFollowToggle(notif.actor);
                  }}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    notif.actor.isFollowing
                      ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                      : 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:opacity-90'
                  }`}
                >
                  {notif.actor.isFollowing ? 'Following' : 'Follow Back'}
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

