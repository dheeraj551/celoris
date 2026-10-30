"use client"
import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Image as ImageIcon,
  Heart,
  Smile,
  Mic,
  MoreVertical,
  Phone,
  Video,
  CheckCheck,
  Search,
  ArrowLeft,
  Play,
  Pause,
} from 'lucide-react';
import { Conversation, DirectMessage, User } from '../types';
import { formatTimeAgo } from '../utils/socialLogic';
import { soundManager } from '../utils/sound';

interface DirectMessagesProps {
  conversations: Conversation[];
  currentUser: User;
  onSendMessage: (conversationId: string, text: string, imageUrl?: string) => void;
  onAddReaction: (messageId: string, emoji: string) => void;
  onSelectUser: (user: User) => void;
}

export const DirectMessages: React.FC<DirectMessagesProps> = ({
  conversations,
  currentUser,
  onSendMessage,
  onAddReaction,
  onSelectUser,
}) => {
  const [selectedConvId, setSelectedConvId] = useState<string>(conversations[0]?.id || '');
  const [inputText, setInputText] = useState('');
  const [searchFilter, setSearchFilter] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find((c) => c.id === selectedConvId) || conversations[0];

  // Dummy message history per conversation
  const [messagesHistory, setMessagesHistory] = useState<Record<string, DirectMessage[]>>({
    conv_sofia: [
      {
        id: 'msg_s1',
        conversationId: 'conv_sofia',
        senderId: 'user_sofia',
        sender: activeConversation?.participant || currentUser,
        text: 'Hey Maya! Loved your recent Tokyo night street series! 🏮',
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        reactions: [{ userId: 'user_current', emoji: '❤️' }],
        isRead: true,
      },
      {
        id: 'msg_s2',
        conversationId: 'conv_sofia',
        senderId: 'user_current',
        sender: currentUser,
        text: 'Thank you Sofia! The rain created such incredible mirror reflections on the asphalt.',
        createdAt: new Date(Date.now() - 3600000 * 1.5).toISOString(),
        reactions: [],
        isRead: true,
      },
      {
        id: 'msg_s3',
        conversationId: 'conv_sofia',
        senderId: 'user_sofia',
        sender: activeConversation?.participant || currentUser,
        text: 'Maya, I sent you the high-res RAW files from the museum shoot! Did they download okay?',
        createdAt: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
        reactions: [{ userId: 'user_current', emoji: '❤️' }],
        isRead: true,
      },
    ],
    conv_kenji: [
      {
        id: 'msg_k1',
        conversationId: 'conv_kenji',
        senderId: 'user_current',
        sender: currentUser,
        text: 'Are you doing another night photowalk in Shibuya next week?',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        reactions: [{ userId: 'user_kenji', emoji: '🔥' }],
        isRead: true,
      },
      {
        id: 'msg_k2',
        conversationId: 'conv_kenji',
        senderId: 'user_kenji',
        sender: activeConversation?.participant || currentUser,
        text: 'Yes! Tuesday around 8 PM. Bringing the 50mm f/1.2.',
        createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
        reactions: [],
        isRead: true,
      },
    ],
    conv_elena: [
      {
        id: 'msg_e1',
        conversationId: 'conv_elena',
        senderId: 'user_elena',
        sender: activeConversation?.participant || currentUser,
        text: 'Check out this ridge camp view!',
        imageUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        reactions: [{ userId: 'user_current', emoji: '😍' }],
        isRead: true,
      },
    ],
  });

  const activeMessages = messagesHistory[selectedConvId] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    soundManager.playSendSound();

    const userMsg: DirectMessage = {
      id: `msg_${Date.now()}`,
      conversationId: selectedConvId,
      senderId: currentUser.id,
      sender: currentUser,
      text: inputText.trim(),
      createdAt: new Date().toISOString(),
      reactions: [],
      isRead: false,
    };

    setMessagesHistory((prev) => ({
      ...prev,
      [selectedConvId]: [...(prev[selectedConvId] || []), userMsg],
    }));

    onSendMessage(selectedConvId, inputText.trim());
    setInputText('');

    // Simulate friend typing and realistic response
    setTimeout(() => {
      setIsTyping(true);
    }, 900);

    setTimeout(() => {
      setIsTyping(false);
      soundManager.playMessagePing();
      const replies = [
        'Awesome, totally agree! ✨',
        'Just saw this, sounds like a great plan!',
        'Love that perspective! Let me know when you publish the next batch.',
        'Brilliant! I will check the RAWs and let you know.',
      ];
      const randomReply = replies[Math.floor(Math.random() * replies.length)];

      const friendMsg: DirectMessage = {
        id: `msg_reply_${Date.now()}`,
        conversationId: selectedConvId,
        senderId: activeConversation.participant.id,
        sender: activeConversation.participant,
        text: randomReply,
        createdAt: new Date().toISOString(),
        reactions: [],
        isRead: true,
      };

      setMessagesHistory((prev) => ({
        ...prev,
        [selectedConvId]: [...(prev[selectedConvId] || []), friendMsg],
      }));
    }, 2400);
  };

  const handleSendPhotoMock = () => {
    soundManager.playSendSound();
    const photoMsg: DirectMessage = {
      id: `msg_photo_${Date.now()}`,
      conversationId: selectedConvId,
      senderId: currentUser.id,
      sender: currentUser,
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      text: 'Sharing a quick snapshot from the coast 🌊',
      createdAt: new Date().toISOString(),
      reactions: [],
      isRead: false,
    };

    setMessagesHistory((prev) => ({
      ...prev,
      [selectedConvId]: [...(prev[selectedConvId] || []), photoMsg],
    }));
  };

  const handleReactionClick = (msgId: string, emoji: string) => {
    soundManager.playLikeSound();
    setMessagesHistory((prev) => {
      const list = prev[selectedConvId] || [];
      const updated = list.map((m) => {
        if (m.id === msgId) {
          const exists = m.reactions.some((r) => r.userId === currentUser.id && r.emoji === emoji);
          return {
            ...m,
            reactions: exists
              ? m.reactions.filter((r) => !(r.userId === currentUser.id && r.emoji === emoji))
              : [...m.reactions, { userId: currentUser.id, emoji }],
          };
        }
        return m;
      });
      return { ...prev, [selectedConvId]: updated };
    });
  };

  const filteredConversations = conversations.filter((c) =>
    c.participant.username.toLowerCase().includes(searchFilter.toLowerCase()) ||
    c.participant.name.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl overflow-hidden shadow-xs h-[750px] max-h-[85vh] flex">
      {/* Sidebar Threads List */}
      <div className="w-full sm:w-80 md:w-96 border-r border-neutral-200 dark:border-neutral-800 flex flex-col shrink-0">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base text-neutral-900 dark:text-neutral-100">
              {currentUser.username}
            </span>
          </div>
        </div>

        {/* Search threads */}
        <div className="p-3 border-b border-neutral-100 dark:border-neutral-800/80">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search chats..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-neutral-100 dark:divide-neutral-800/50">
          {filteredConversations.map((conv) => {
            const isSelected = conv.id === selectedConvId;
            return (
              <button
                key={conv.id}
                onClick={() => setSelectedConvId(conv.id)}
                className={`w-full p-3.5 flex items-center gap-3 text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-neutral-100 dark:bg-neutral-800'
                    : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={conv.participant.avatar}
                    alt={conv.participant.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  {conv.participant.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white dark:border-neutral-900" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-xs text-neutral-900 dark:text-neutral-100 truncate">
                      {conv.participant.name}
                    </span>
                    <span className="text-[10px] text-neutral-400 shrink-0">
                      {formatTimeAgo(conv.updatedAt)}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                    {conv.lastMessage.text || 'Shared a photo'}
                  </p>
                </div>

                {conv.unreadCount > 0 && !isSelected && (
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Active Chat Area */}
      {activeConversation ? (
        <div className="hidden sm:flex flex-1 flex-col h-full bg-neutral-50/50 dark:bg-neutral-950/30">
          {/* Chat Header */}
          <div className="p-3.5 px-5 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => onSelectUser(activeConversation.participant)}
                className="cursor-pointer"
              >
                <img
                  src={activeConversation.participant.avatar}
                  alt={activeConversation.participant.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              </button>
              <div>
                <button
                  onClick={() => onSelectUser(activeConversation.participant)}
                  className="font-semibold text-sm text-neutral-900 dark:text-neutral-100 hover:underline cursor-pointer block text-left"
                >
                  {activeConversation.participant.name}
                </button>
                <span className="text-[11px] text-emerald-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active now
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300">
              <button
                onClick={() => soundManager.playMessagePing()}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                aria-label="Start voice call"
              >
                <Phone size={18} />
              </button>
              <button
                onClick={() => soundManager.playMessagePing()}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                aria-label="Start video call"
              >
                <Video size={18} />
              </button>
              <button
                onClick={() => onSelectUser(activeConversation.participant)}
                className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                aria-label="View user profile"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          </div>

          {/* Messages Stream */}
          <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
            {activeMessages.map((msg) => {
              const isMine = msg.senderId === currentUser.id;
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col group ${isMine ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`relative max-w-[75%] rounded-2xl p-3.5 shadow-xs ${
                      isMine
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-xs'
                        : 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700 rounded-bl-xs'
                    }`}
                  >
                    {/* Optional photo in message */}
                    {msg.imageUrl && (
                      <img
                        src={msg.imageUrl}
                        alt="Shared in message"
                        className="rounded-xl mb-2 max-h-60 object-cover w-full shadow-xs"
                      />
                    )}

                    {msg.text && <p className="text-xs leading-relaxed">{msg.text}</p>}

                    {/* Reactions Pill */}
                    {msg.reactions.length > 0 && (
                      <div className="absolute -bottom-2.5 right-2 px-1.5 py-0.5 rounded-full bg-white dark:bg-neutral-700 shadow-md border border-neutral-200 dark:border-neutral-600 flex items-center gap-1 text-[11px]">
                        {msg.reactions.map((r, i) => (
                          <span key={i}>{r.emoji}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Quick reaction popover on hover */}
                  <div className="flex items-center gap-1.5 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[10px] text-neutral-400">
                      {formatTimeAgo(msg.createdAt)}
                    </span>
                    {['❤️', '🔥', '😂', '👏'].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReactionClick(msg.id, emoji)}
                        className="p-1 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-800 text-xs cursor-pointer"
                        aria-label={`React ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                    {isMine && <CheckCheck size={12} className="text-sky-500" />}
                  </div>
                </div>
              );
            })}

            {/* Friend typing indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-neutral-500 text-xs p-2">
                <img
                  src={activeConversation.participant.avatar}
                  alt={activeConversation.participant.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <div className="px-3 py-1.5 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 flex items-center gap-2"
          >
            <button
              type="button"
              onClick={handleSendPhotoMock}
              aria-label="Send photo"
              className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <ImageIcon size={20} />
            </button>
            <button
              type="button"
              onClick={() => {
                soundManager.playSendSound();
                setInputText((prev) => prev + ' ✨ ');
              }}
              aria-label="Insert sparkle"
              className="p-2 rounded-full text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Smile size={20} />
            </button>

            <input
              type="text"
              placeholder={`Message ${activeConversation.participant.name}...`}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-full text-xs bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {inputText.trim() ? (
              <button
                type="submit"
                aria-label="Send message"
                className="p-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:opacity-90 transition-opacity cursor-pointer"
              >
                <Send size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  soundManager.playLikeSound();
                  handleReactionClick(activeMessages[activeMessages.length - 1]?.id || '', '❤️');
                }}
                aria-label="Send heart reaction"
                className="p-2 rounded-full text-rose-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Heart size={20} />
              </button>
            )}
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8 text-center text-neutral-500">
          Select a chat to begin messaging
        </div>
      )}
    </div>
  );
};

