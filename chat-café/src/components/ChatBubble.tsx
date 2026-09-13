import React, { useState } from 'react';
import {
  Pin,
  Reply,
  Flag,
  Trash2,
  VolumeX,
  Ban,
  MoreVertical,
  Check,
  Heart,
  Coffee,
  Sparkles,
  Shield,
  Gift,
} from 'lucide-react';
import { ChatMessage, UserProfile, BubbleStyleId } from '../types';
import { BUBBLE_STYLES } from '../utils/themes';
import { cafeAudio } from '../utils/cafeAudio';

interface ChatBubbleProps {
  message: ChatMessage;
  currentUser: UserProfile;
  onReply: (msg: ChatMessage) => void;
  onReaction: (messageId: string, emoji: string) => void;
  onReport: (message: ChatMessage) => void;
  onPin: (messageId: string) => void;
  onDelete: (messageId: string, reason: string) => void;
  onMuteUser: (userId: string, userName: string) => void;
  onBanUser: (userId: string, userName: string) => void;
  onGiftDrinkToUser?: (recipient: UserProfile) => void;
}

const COMMON_REACTIONS = ['☕', '🥐', '✨', '🍵', '👏', '💡'];

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  currentUser,
  onReply,
  onReaction,
  onReport,
  onPin,
  onDelete,
  onMuteUser,
  onBanUser,
  onGiftDrinkToUser,
}) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState(false);

  const isSelf = message.sender.id === currentUser.id;
  const isStaff = currentUser.role === 'moderator' || currentUser.role === 'admin';
  const bubbleStyleId = (message.sender.bubbleStyle || 'ceramic') as BubbleStyleId;
  const styleConfig = BUBBLE_STYLES[bubbleStyleId] || BUBBLE_STYLES.ceramic;

  // Handle reaction click
  const handleReactionClick = (emoji: string) => {
    cafeAudio.playBubblePop();
    onReaction(message.id, emoji);
    setShowReactionPicker(false);
  };

  // Format timestamp (e.g. "10:42 AM")
  const timeFormatted = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // If deleted message
  if (message.isDeleted) {
    return (
      <div className="py-2 px-4 my-1.5 rounded-xl bg-stone-900/40 border border-dashed border-stone-700/50 text-xs text-stone-400 italic flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Trash2 className="w-3.5 h-3.5 text-stone-500" />
          <span>Message removed by moderator {message.deletedBy ? `(${message.deletedBy})` : ''}: {message.deletionReason || 'Content flagged'}</span>
        </span>
        <span className="text-[10px] text-stone-500">{timeFormatted}</span>
      </div>
    );
  }

  return (
    <div
      id={`message-${message.id}`}
      className={`group relative flex gap-2.5 sm:gap-3 py-1.5 transition-all ${
        message.isPinned ? 'bg-amber-500/10 -mx-2 px-2 rounded-2xl border-l-4 border-amber-500 my-1.5' : ''
      }`}
    >
      {/* Sender Avatar */}
      <div className="flex flex-col items-center flex-shrink-0 pt-0.5">
        <div
          onClick={() => onGiftDrinkToUser && onGiftDrinkToUser(message.sender)}
          title={`Click to treat ${message.sender.name} to a drink!`}
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br ${message.sender.avatarColor || 'from-amber-400 to-orange-500'} flex items-center justify-center text-lg shadow-sm border border-white/20 cursor-pointer transition-transform hover:scale-110`}
        >
          {message.sender.avatarId === 'cat_barista' ? '🐱' :
           message.sender.avatarId === 'fox_books' ? '🦊' :
           message.sender.avatarId === 'owl_philosophy' ? '🦉' :
           message.sender.avatarId === 'bear_cozy' ? '🐻' :
           message.sender.avatarId === 'rabbit_matcha' ? '🐰' :
           message.sender.avatarId === 'capybara_chill' ? '🦫' :
           message.sender.avatarId === 'otter_latte' ? '🦦' :
           message.sender.avatarId === 'raccoon_pastry' ? '🦝' : '🐕'}
        </div>

        {/* Small Drink Icon badge */}
        {message.sender.currentDrink && (
          <span className="text-[10px] -mt-1.5 bg-stone-900/80 px-1 rounded-full border border-stone-700 shadow-xs" title={message.sender.currentDrink}>
            ☕
          </span>
        )}
      </div>

      {/* Message Content & Bubble */}
      <div className="flex-1 min-w-0">
        {/* Header (Name, Role, Drink, Timestamp) */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap text-xs mb-1">
          <span className="font-bold text-amber-100 hover:underline cursor-pointer" onClick={() => onGiftDrinkToUser && onGiftDrinkToUser(message.sender)}>
            {message.sender.name}
          </span>

          {/* Role badge */}
          {message.sender.role === 'barista' && (
            <span className="px-1.5 py-0.2 rounded-md bg-amber-600/30 text-amber-200 border border-amber-500/40 text-[10px] font-medium flex items-center gap-1">
              ☕ Barista
            </span>
          )}
          {message.sender.role === 'moderator' && (
            <span className="px-1.5 py-0.2 rounded-md bg-rose-950/50 text-rose-300 border border-rose-700/40 text-[10px] font-medium flex items-center gap-1">
              <Shield className="w-2.5 h-2.5" /> Staff Mod
            </span>
          )}
          {message.sender.role === 'regular' && (
            <span className="px-1.5 py-0.2 rounded-md bg-emerald-950/40 text-emerald-300 border border-emerald-700/30 text-[10px] font-medium">
              ⭐ Regular
            </span>
          )}

          {/* Current Drink text */}
          {message.sender.currentDrink && (
            <span className="text-[11px] text-stone-400 hidden sm:inline truncate max-w-[150px]">
              • {message.sender.currentDrink}
            </span>
          )}

          {/* Pinned label */}
          {message.isPinned && (
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded-full font-semibold flex items-center gap-0.5 border border-amber-500/40">
              <Pin className="w-2.5 h-2.5" /> Pinned
            </span>
          )}

          <span className="text-[10px] text-stone-400 ml-auto">
            {timeFormatted}
          </span>
        </div>

        {/* Reply Quote preview if replying to another message */}
        {message.replyTo && (
          <div className="mb-1 text-xs px-2.5 py-1 rounded-lg bg-black/30 border-l-2 border-amber-500 text-stone-300 flex items-center gap-1.5 max-w-lg">
            <Reply className="w-3 h-3 text-amber-400 flex-shrink-0" />
            <span className="font-semibold text-amber-200">{message.replyTo.senderName}:</span>
            <span className="truncate italic">{message.replyTo.content}</span>
          </div>
        )}

        {/* Drink Gift Card */}
        {message.drinkGift && (
          <div className="mb-2 p-2.5 rounded-xl bg-gradient-to-r from-amber-600/30 to-orange-600/20 border border-amber-500/40 flex items-center gap-3 text-xs text-amber-100 shadow-sm">
            <span className="text-2xl animate-bounce">{message.drinkGift.drink.icon}</span>
            <div>
              <div className="font-bold text-amber-200 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-amber-400" />
                <span>Gifted {message.drinkGift.drink.name} {message.drinkGift.recipientName ? `to ${message.drinkGift.recipientName}` : ''}!</span>
              </div>
              <div className="text-[11px] text-amber-300/80">
                "{message.drinkGift.note || message.drinkGift.drink.flavorNote}"
              </div>
            </div>
          </div>
        )}

        {/* The Custom Chat Bubble */}
        <div className="relative inline-block max-w-full">
          <div
            className={`px-3.5 py-2.5 sm:px-4 sm:py-3 text-sm leading-relaxed transition-all break-words ${
              isSelf ? styleConfig.selfClasses : styleConfig.otherClasses
            } ${styleConfig.tailShape}`}
          >
            {message.content}
          </div>

          {/* Floating Action Bar (visible on hover or focus) */}
          <div className="absolute right-0 -top-4 hidden group-hover:flex items-center gap-1 bg-stone-900/90 border border-stone-700/80 px-1.5 py-0.5 rounded-xl shadow-lg backdrop-blur-md z-10">
            {/* Quick React Button */}
            <button
              onClick={() => setShowReactionPicker(!showReactionPicker)}
              className="p-1 text-stone-300 hover:text-amber-300 transition-colors"
              title="Add café reaction"
            >
              <Coffee className="w-3.5 h-3.5" />
            </button>

            {/* Reply Button */}
            <button
              onClick={() => onReply(message)}
              className="p-1 text-stone-300 hover:text-amber-300 transition-colors"
              title="Reply to message"
            >
              <Reply className="w-3.5 h-3.5" />
            </button>

            {/* Report Button */}
            <button
              onClick={() => onReport(message)}
              className="p-1 text-stone-300 hover:text-rose-400 transition-colors"
              title="Report message to café moderators"
            >
              <Flag className="w-3.5 h-3.5" />
            </button>

            {/* Staff / Moderator Menu */}
            {isStaff && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-1 text-amber-400 hover:text-amber-300 transition-colors"
                  title="Staff moderation tools"
                >
                  <MoreVertical className="w-3.5 h-3.5" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-6 w-44 p-1 rounded-xl bg-stone-950 border border-stone-700 shadow-2xl text-xs text-stone-200 z-50 space-y-0.5">
                    <button
                      onClick={() => {
                        onPin(message.id);
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-800 flex items-center gap-2"
                    >
                      <Pin className="w-3.5 h-3.5 text-amber-400" />
                      <span>{message.isPinned ? 'Unpin message' : 'Pin to top'}</span>
                    </button>

                    <button
                      onClick={() => {
                        const reason = window.prompt('Reason for removing this message:', 'Inappropriate content');
                        if (reason !== null) {
                          onDelete(message.id, reason);
                        }
                        setShowMenu(false);
                      }}
                      className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-800 text-rose-300 flex items-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                      <span>Delete message</span>
                    </button>

                    {!isSelf && (
                      <>
                        <button
                          onClick={() => {
                            onMuteUser(message.sender.id, message.sender.name);
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-800 text-amber-300 flex items-center gap-2"
                        >
                          <VolumeX className="w-3.5 h-3.5 text-amber-400" />
                          <span>Mute sender</span>
                        </button>

                        <button
                          onClick={() => {
                            onBanUser(message.sender.id, message.sender.name);
                            setShowMenu(false);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-stone-800 text-rose-400 flex items-center gap-2"
                        >
                          <Ban className="w-3.5 h-3.5 text-rose-500" />
                          <span>Ban from café</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Reaction Picker Popover */}
          {showReactionPicker && (
            <div className="absolute left-0 -top-8 flex items-center gap-1 bg-stone-900 border border-stone-700 px-2 py-1 rounded-2xl shadow-xl z-20">
              {COMMON_REACTIONS.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className="hover:scale-130 transition-transform p-0.5 text-base"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Reaction Counters List */}
        {message.reactions && Object.keys(message.reactions).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {Object.entries(message.reactions).map(([emoji, rawIds]) => {
              const userIds = (Array.isArray(rawIds) ? rawIds : []) as string[];
              if (userIds.length === 0) return null;
              const hasReacted = userIds.includes(currentUser.id);
              return (
                <button
                  key={emoji}
                  onClick={() => handleReactionClick(emoji)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium transition-all ${
                    hasReacted
                      ? 'bg-amber-600/30 text-amber-200 border border-amber-500/50 shadow-xs'
                      : 'bg-black/20 text-stone-300 border border-white/5 hover:bg-white/5'
                  }`}
                  title={`${userIds.length} patrons reacted`}
                >
                  <span>{emoji}</span>
                  <span className="text-[11px]">{userIds.length}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
