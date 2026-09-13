import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Coffee,
  Sparkles,
  Gift,
  X,
  Clock,
  VolumeX,
  Palette,
  Smile,
  Bot,
} from 'lucide-react';
import { ChatMessage, UserProfile, BubbleStyleId } from '../types';
import { BUBBLE_STYLES } from '../utils/themes';
import { cafeAudio } from '../utils/cafeAudio';

interface ChatInputProps {
  onSendMessage: (content: string, replyTo?: ChatMessage) => void;
  replyingTo: ChatMessage | null;
  onCancelReply: () => void;
  onOpenDrinkMenu: () => void;
  onOpenBubbleStylePicker: () => void;
  onAskBaristaAI: () => void;
  slowModeRemaining: number;
  isMuted: boolean;
  mutedTimeRemaining?: number;
  currentUser: UserProfile;
  activeTableName: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  replyingTo,
  onCancelReply,
  onOpenDrinkMenu,
  onOpenBubbleStylePicker,
  onAskBaristaAI,
  slowModeRemaining,
  isMuted,
  mutedTimeRemaining,
  currentUser,
  activeTableName,
}) => {
  const [content, setContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const bubbleConfig = BUBBLE_STYLES[currentUser.bubbleStyle || 'ceramic'] || BUBBLE_STYLES.ceramic;

  useEffect(() => {
    if (replyingTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyingTo]);

  const handleSend = () => {
    if (!content.trim() || isMuted || slowModeRemaining > 0) return;
    cafeAudio.playBubblePop();
    onSendMessage(content.trim(), replyingTo || undefined);
    setContent('');
    if (replyingTo) {
      onCancelReply();
    }
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    // Auto-resize
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
    }
  };

  const addEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
    setShowEmojiPicker(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const QUICK_CAFE_EMOJIS = ['☕', '🍵', '🥐', '✨', '🧋', '🍰', '🌿', '📖', '🎧', '🍂', '❤️'];

  return (
    <div className="relative border-t border-white/10 bg-stone-900/60 backdrop-blur-md px-3 sm:px-6 py-3 transition-colors">
      {/* Reply Banner */}
      {replyingTo && (
        <div className="mb-2.5 px-3 py-1.5 rounded-xl bg-amber-950/40 border border-amber-600/30 flex items-center justify-between text-xs text-amber-200">
          <div className="flex items-center gap-2 truncate">
            <span className="font-bold text-amber-300">Replying to {replyingTo.sender.name}:</span>
            <span className="truncate italic text-stone-300 max-w-sm sm:max-w-md">"{replyingTo.content}"</span>
          </div>
          <button
            onClick={onCancelReply}
            className="text-stone-400 hover:text-white p-0.5 rounded-md hover:bg-white/10"
            title="Cancel reply"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Mute or Cooldown Notice */}
      {isMuted && (
        <div className="mb-2 px-3 py-2 rounded-xl bg-rose-950/60 border border-rose-600/40 text-rose-200 text-xs flex items-center gap-2">
          <VolumeX className="w-4 h-4 text-rose-400" />
          <span>
            You are temporarily muted by a moderator {mutedTimeRemaining ? `(${mutedTimeRemaining}s remaining)` : ''}. You can still listen and read conversations.
          </span>
        </div>
      )}

      {/* Input container */}
      <div className="flex items-end gap-2 bg-black/30 border border-white/10 rounded-2xl p-1.5 focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/30 transition-all shadow-inner">
        {/* Quick Actions Left */}
        <div className="flex items-center gap-1 pb-1 pl-1">
          {/* Treat Room / Gift Drink */}
          <button
            id="chat-input-drink-menu-btn"
            onClick={onOpenDrinkMenu}
            className="p-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs flex items-center gap-1 transition-all"
            title="Treat the table to coffee or pastries"
          >
            <Gift className="w-4 h-4" />
            <span className="hidden md:inline text-[11px] font-medium">Treat</span>
          </button>

          {/* Chat Bubble Style Badge & Switcher */}
          <button
            id="chat-input-bubble-style-btn"
            onClick={onOpenBubbleStylePicker}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-amber-200 text-xs flex items-center gap-1 transition-all"
            title={`Current bubble style: ${bubbleConfig.name}. Click to change.`}
          >
            <Palette className="w-4 h-4 text-amber-400" />
            <span className="hidden lg:inline text-[11px]">{bubbleConfig.name}</span>
          </button>

          {/* Ask Barista AI Button */}
          <button
            id="chat-input-barista-ai-btn"
            onClick={onAskBaristaAI}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-300 hover:text-amber-200 text-xs flex items-center gap-1 transition-all"
            title="Ask Barista Nora (AI) a question or recommendation"
          >
            <Bot className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline text-[11px]">Ask Nora</span>
          </button>
        </div>

        {/* Textarea */}
        <textarea
          id="chat-input-textarea"
          ref={textareaRef}
          value={content}
          onChange={handleTextareaInput}
          onKeyDown={handleKeyDown}
          disabled={isMuted}
          rows={1}
          placeholder={
            isMuted
              ? 'You are currently muted...'
              : slowModeRemaining > 0
              ? `Slow mode: wait ${slowModeRemaining}s...`
              : `Share your thoughts at ${activeTableName}...`
          }
          className="flex-1 bg-transparent text-sm text-stone-100 placeholder:text-stone-400/80 px-2 py-1.5 resize-none focus:outline-none min-h-[38px] max-h-[140px] leading-relaxed"
        />

        {/* Right side buttons: Emoji picker & Send */}
        <div className="flex items-center gap-1 pb-1 pr-1">
          {/* Emoji toggle */}
          <div className="relative">
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-1.5 rounded-xl text-stone-400 hover:text-amber-300 hover:bg-white/5 transition-colors"
              title="Quick café emojis"
            >
              <Smile className="w-4 h-4" />
            </button>

            {showEmojiPicker && (
              <div className="absolute right-0 bottom-11 p-2 bg-stone-900 border border-stone-700 rounded-2xl shadow-xl z-30 flex flex-wrap gap-1.5 w-48">
                {QUICK_CAFE_EMOJIS.map((em) => (
                  <button
                    key={em}
                    onClick={() => addEmoji(em)}
                    className="w-8 h-8 rounded-lg hover:bg-stone-800 text-lg flex items-center justify-center transition-transform hover:scale-120"
                  >
                    {em}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            id="chat-send-btn"
            onClick={handleSend}
            disabled={!content.trim() || isMuted || slowModeRemaining > 0}
            className={`p-2 rounded-xl flex items-center justify-center transition-all ${
              content.trim() && !isMuted && slowModeRemaining <= 0
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950/40 scale-100'
                : 'bg-stone-800 text-stone-500 cursor-not-allowed opacity-60'
            }`}
            title="Send message (Enter)"
          >
            {slowModeRemaining > 0 ? (
              <div className="flex items-center gap-1 text-[11px] font-bold px-1 text-amber-300">
                <Clock className="w-3.5 h-3.5 animate-spin" />
                <span>{slowModeRemaining}s</span>
              </div>
            ) : (
              <Send className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Tiny Footer Note */}
      <div className="flex items-center justify-between mt-1 px-1 text-[10px] text-stone-400">
        <span>Press <kbd className="bg-black/30 px-1 py-0.5 rounded text-[9px] border border-white/10 text-stone-300">Enter</kbd> to send, <kbd className="bg-black/30 px-1 py-0.5 rounded text-[9px] border border-white/10 text-stone-300">Shift + Enter</kbd> for new line</span>
        <span className="italic hidden sm:inline">Respectful conversation is the heart of Chat Café</span>
      </div>
    </div>
  );
};
