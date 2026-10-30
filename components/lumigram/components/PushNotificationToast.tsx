"use client"
import React from 'react';
import { Bell, X, Heart, MessageSquare, UserPlus } from 'lucide-react';
import { NotificationItem } from '../types';

interface PushNotificationToastProps {
  notification: NotificationItem | null;
  onDismiss: () => void;
  onClick: () => void;
}

export const PushNotificationToast: React.FC<PushNotificationToastProps> = ({
  notification,
  onDismiss,
  onClick,
}) => {
  if (!notification) return null;

  return (
    <div className="fixed top-4 left-1/2 z-50 w-full max-w-sm px-3 pointer-events-auto animate-slide-down-toast">
      <div
        onClick={onClick}
        className="p-3.5 rounded-2xl bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-800 shadow-2xl flex items-center justify-between gap-3 cursor-pointer hover:border-pink-500/50 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative shrink-0">
            <img
              src={notification.actor.avatar}
              alt={notification.actor.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="absolute -bottom-1 -right-1 p-0.5 rounded-full bg-pink-500 text-white">
              {notification.type === 'like' && <Heart size={10} className="fill-white" />}
              {notification.type === 'message' && <MessageSquare size={10} />}
              {notification.type === 'follow' && <UserPlus size={10} />}
            </span>
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                {notification.actor.username}
              </span>
              <span className="text-[10px] text-pink-500 font-mono font-semibold uppercase">
                Push Alert
              </span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 truncate">
              {notification.text}
            </p>
          </div>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          aria-label="Dismiss notification"
          className="p-1 rounded-full text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 cursor-pointer shrink-0"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};

