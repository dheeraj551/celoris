import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import {
  UserProfile,
  ChatMessage,
  CafeTable,
  ModerationReport,
  RetroThemeSkin,
  RetroViewMode,
  GuestbookEntry,
  CafeDrink,
  DiscussionTopic,
} from './types';
import { CAFE_TABLES } from './data/cafeData';
import { SEED_GUESTBOOK_ENTRIES } from './data/seedGuestbook';
import { cafeAudio } from './utils/cafeAudio';
import { AvatarPickerModal } from './components/AvatarPickerModal';
import { ModerationPanelModal } from './components/ModerationPanelModal';
import { DrinkGiftModal } from './components/DrinkGiftModal';
import { GuidedTopicModal } from './components/GuidedTopicModal';
import { AskBaristaModal } from './components/AskBaristaModal';
import { ReportModal } from './components/ReportModal';
import { CafePatronsSidebar } from './components/CafePatronsSidebar';
import { RetroYahooChatWindow } from './components/RetroYahooChatWindow';
import { RetroArcadeCabinetWrapper } from './components/RetroArcadeCabinetWrapper';
import { RetroArcadeGame } from './components/RetroArcadeGame';
import { WallOfFameModal } from './components/WallOfFameModal';

const sanitizePatrons = (list: UserProfile[]): UserProfile[] => {
  if (!Array.isArray(list)) return [];
  const map = new Map<string, UserProfile>();
  list.forEach((p) => {
    if (p && p.id) {
      map.set(p.id, p);
    }
  });
  return Array.from(map.values());
};

const DEFAULT_USER: UserProfile = {
  id: `user_${Math.random().toString(36).substring(2, 9)}`,
  name: 'New Patron',
  avatarId: 'rabbit_matcha',
  avatarColor: 'from-emerald-400 to-teal-600',
  accessory: 'Tea Flower',
  role: 'patron',
  statusText: 'Sipping a warm matcha latte 🍵',
  currentDrink: 'Ceremonial Matcha Latte',
  bubbleStyle: 'latte',
  joinedAt: Date.now(),
};

export default function App() {
  // User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('chat_cafe_user');
      if (saved) return JSON.parse(saved);
    } catch (_) {}
    return DEFAULT_USER;
  });

  // Table & Messaging State
  const [tables, setTables] = useState<CafeTable[]>(CAFE_TABLES);
  const [activeTableId, setActiveTableId] = useState<string>('main_lounge');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activePatrons, setActivePatrons] = useState<UserProfile[]>([]);
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [bannedUserIds, setBannedUserIds] = useState<string[]>([]);
  const [mutedUsers, setMutedUsers] = useState<Record<string, number>>({});

  // UI Modals & Drawers
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isModerationModalOpen, setIsModerationModalOpen] = useState(false);
  const [isDrinkModalOpen, setIsDrinkModalOpen] = useState(false);
  const [drinkRecipient, setDrinkRecipient] = useState<UserProfile | null>(null);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isAskBaristaOpen, setIsAskBaristaOpen] = useState(false);
  const [reportingMessage, setReportingMessage] = useState<ChatMessage | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isWallOfFameOpen, setIsWallOfFameOpen] = useState(false);
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>(SEED_GUESTBOOK_ENTRIES);

  // Initial guestbook fetch
  useEffect(() => {
    fetch('/api/guestbook')
      .then((r) => r.json())
      .then((data) => {
        if (data.entries && Array.isArray(data.entries)) {
          setGuestbookEntries(data.entries);
        }
      })
      .catch((err) => console.warn('Initial guestbook fetch warning:', err));
  }, []);

  // Chat interaction state
  const [replyingTo, setReplyingTo] = useState<ChatMessage | null>(null);
  const [slowModeCooldown, setSlowModeCooldown] = useState(0);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // Retro 1999 Yahoo! Chat & Arcade State (Exclusive View)
  const [retroSkin, setRetroSkin] = useState<RetroThemeSkin>('xp_purple');
  const [retroViewMode, setRetroViewMode] = useState<RetroViewMode>('retro_window');
  const [crtScanlines, setCrtScanlines] = useState(true);
  const [soundFxEnabled, setSoundFxEnabled] = useState(true);
  const [arcadeCredits, setArcadeCredits] = useState(4);
  const [isArcadeGameOpen, setIsArcadeGameOpen] = useState(false);
  const [ambientAudioEnabled, setAmbientAudioEnabled] = useState(false);

  const handleInsertCoin = () => {
    cafeAudio.playArcadeCoin();
    setArcadeCredits((prev) => prev + 1);
    showToast('🪙 Clink! Inserted 25¢ arcade coin. +1 Credit added!');
  };

  const handleToggleAmbientAudio = () => {
    const newState = cafeAudio.toggle();
    setAmbientAudioEnabled(newState);
  };

  // WebSocket reference
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reconnectTimeoutRef = useRef<any>(null);

  const activeTable = tables.find((t) => t.id === activeTableId) || tables[0];

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('chat_cafe_user', JSON.stringify(currentUser));
    } catch (_) {}
  }, [currentUser]);

  // Fast initial snapshot fetch from REST API
  useEffect(() => {
    fetch('/api/snapshot')
      .then((res) => res.json())
      .then((data) => {
        if (data.tables) setTables(data.tables);
        if (data.messages) setMessages(data.messages);
        if (data.activePatrons) setActivePatrons(sanitizePatrons(data.activePatrons));
        if (data.bannedUserIds) setBannedUserIds(Array.from(new Set(data.bannedUserIds)));
      })
      .catch((err) => console.log('Snapshot fetch note:', err));
  }, []);

  // Connect WebSocket
  const connectWebSocket = useCallback(() => {
    if (wsRef.current && (wsRef.current.readyState === WebSocket.OPEN || wsRef.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('Connected to Chat Café WebSocket');
        // Join session with user profile
        ws.send(JSON.stringify({
          type: 'join',
          data: { user: currentUser },
        }));
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const { event: evt, data } = payload;

          if (evt === 'init_sync') {
            setMessages(data.messages || []);
            if (data.tables) setTables(data.tables);
            if (data.activePatrons) setActivePatrons(sanitizePatrons(data.activePatrons));
            if (data.reports) setReports(data.reports);
            if (data.bannedUserIds) setBannedUserIds(Array.from(new Set(data.bannedUserIds)));
            if (data.guestbookEntries && Array.isArray(data.guestbookEntries)) {
              setGuestbookEntries(data.guestbookEntries);
            }
            if (data.mutedUntil) {
              setMutedUsers((prev) => ({ ...prev, [currentUser.id]: data.mutedUntil }));
            }
          }

          if (evt === 'message:created') {
            const newMsg: ChatMessage = data;
            setMessages((prev) => {
              if (prev.some((m) => m.id === newMsg.id)) return prev;
              return [...prev, newMsg];
            });
            // Play retro ding sound for other people's messages
            if (newMsg.sender.id !== currentUser.id && soundFxEnabled) {
              cafeAudio.playRetroDing();
            }
          }

          if (evt === 'message:updated') {
            const updated: ChatMessage = data;
            setMessages((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));
          }

          if (evt === 'patron:joined' || evt === 'patron:updated' || evt === 'patron:left') {
            if (data.activePatrons) {
              setActivePatrons(sanitizePatrons(data.activePatrons));
            }
          }

          if (evt === 'table:updated') {
            const updatedTable: CafeTable = data;
            setTables((prev) => prev.map((t) => (t.id === updatedTable.id ? updatedTable : t)));
          }

          if (evt === 'report:new') {
            setReports((prev) => [data, ...prev]);
            showToast(`New patron report received: ${data.reason}`);
          }

          if (evt === 'report:updated') {
            setReports((prev) => prev.map((r) => (r.id === data.id ? data : r)));
          }

          if (evt === 'user:muted') {
            setMutedUsers((prev) => ({ ...prev, [data.targetUserId]: data.expiration }));
            if (data.targetUserId === currentUser.id) {
              showToast(`You were temporarily muted: ${data.reason}`);
            }
          }

          if (evt === 'user:unmuted') {
            setMutedUsers((prev) => {
              const clone = { ...prev };
              delete clone[data.targetUserId];
              return clone;
            });
          }

          if (evt === 'user:banned') {
            setBannedUserIds((prev) => [...prev, data.targetUserId]);
            if (data.targetUserId === currentUser.id) {
              alert(`You have been barred from Chat Café: ${data.reason}`);
              window.location.reload();
            }
          }

          if (evt === 'user:unbanned') {
            setBannedUserIds((prev) => prev.filter((id) => id !== data.targetUserId));
          }

          if (evt === 'guestbook:signed') {
            if (data.entries && Array.isArray(data.entries)) {
              setGuestbookEntries(data.entries);
            } else if (data.entry) {
              setGuestbookEntries((prev) => [data.entry, ...prev.filter((e) => e.id !== data.entry.id)]);
            }
            if (data.entry && data.entry.userId !== currentUser.id) {
              showToast(`📜 ${data.entry.userName} signed the Wall of Fame!`);
            }
          }

          if (evt === 'guestbook:updated') {
            if (data.entries && Array.isArray(data.entries)) {
              setGuestbookEntries(data.entries);
            } else if (data.entry) {
              setGuestbookEntries((prev) => prev.map((e) => (e.id === data.entry.id ? data.entry : e)));
            }
          }

          if (evt === 'error') {
            showToast(data.message || 'Error occurred');
          }
        } catch (e) {
          console.error('Socket message parse err:', e);
        }
      };

      ws.onclose = () => {
        wsRef.current = null;
        // Auto-reconnect after 3s
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket();
        }, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    } catch (e) {
      console.warn('Socket connect failed:', e);
    }
  }, [currentUser]);

  useEffect(() => {
    connectWebSocket();
    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [connectWebSocket]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeTableId]);

  // Slow mode cooldown timer
  useEffect(() => {
    if (slowModeCooldown > 0) {
      const timer = setTimeout(() => setSlowModeCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [slowModeCooldown]);

  const showToast = (msg: string) => {
    setNotificationBanner(msg);
    setTimeout(() => setNotificationBanner(null), 4500);
  };

  // User Actions
  const handleSendMessage = (content: string, replyTo?: ChatMessage) => {
    const isMuted = mutedUsers[currentUser.id] && mutedUsers[currentUser.id] > Date.now();
    if (isMuted) {
      showToast('You are currently muted and cannot send messages.');
      return;
    }

    if (activeTable.slowModeSeconds > 0 && currentUser.role !== 'moderator' && currentUser.role !== 'admin') {
      setSlowModeCooldown(activeTable.slowModeSeconds);
    }

    const payload = {
      type: 'chat_message',
      data: {
        tableId: activeTableId,
        content,
        replyTo: replyTo
          ? {
              id: replyTo.id,
              senderName: replyTo.sender.name,
              content: replyTo.content.slice(0, 70),
            }
          : undefined,
      },
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    } else {
      // Fallback local append if socket reconnecting
      const fallbackMsg: ChatMessage = {
        id: `msg_local_${Date.now()}`,
        tableId: activeTableId,
        sender: currentUser,
        content,
        timestamp: Date.now(),
        reactions: {},
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'reaction',
        data: { messageId, emoji, userId: currentUser.id },
      }));
    } else {
      setMessages((prev) =>
        prev.map((m) => {
          if (m.id !== messageId) return m;
          const reactions = { ...m.reactions };
          if (!reactions[emoji]) reactions[emoji] = [];
          const idx = reactions[emoji].indexOf(currentUser.id);
          if (idx >= 0) {
            reactions[emoji].splice(idx, 1);
          } else {
            reactions[emoji].push(currentUser.id);
          }
          return { ...m, reactions };
        })
      );
    }
  };

  const handleSendDrinkGift = (drink: CafeDrink, recipientName?: string, note?: string) => {
    const giftPayload = {
      drink,
      recipientName,
      note,
    };

    const payload = {
      type: 'chat_message',
      data: {
        tableId: activeTableId,
        content: `Treated ${recipientName || 'the room'} to a ${drink.name}! ${drink.icon}✨`,
        drinkGift: giftPayload,
      },
    };

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(payload));
    }
    showToast(`Sent ${drink.name} to ${recipientName || 'the table'}!`);
  };

  const handleSelectTopic = (topic: DiscussionTopic) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'set_topic',
        data: { tableId: activeTableId, topic },
      }));
    } else {
      setTables((prev) =>
        prev.map((t) => (t.id === activeTableId ? { ...t, activeTopic: topic } : t))
      );
    }
    showToast(`New discussion launched: "${topic.title}"`);
  };

  const handleSaveProfile = (updated: Partial<UserProfile>) => {
    const newProfile = { ...currentUser, ...updated };
    setCurrentUser(newProfile);
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'update_profile',
        data: newProfile,
      }));
    }
    showToast('Café profile & chat bubble saved!');
  };

  // Moderation Handlers
  const handleDeleteMessage = (messageId: string, reason: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'mod_delete_message',
        data: { messageId, reason },
      }));
    } else {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, isDeleted: true, deletionReason: reason, deletedBy: currentUser.name }
            : m
        )
      );
    }
    showToast('Message removed by moderator');
  };

  const handlePinMessage = (messageId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'mod_pin_message',
        data: { messageId },
      }));
    }
  };

  const handleMuteUser = (userId: string, userName: string, durationMin: number = 10, reason: string = 'Moderator timeout') => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'mod_mute_user',
        data: { targetUserId: userId, targetUserName: userName, durationMinutes: durationMin, reason },
      }));
    }
    showToast(`Muted ${userName} for ${durationMin} minutes`);
  };

  const handleUnmuteUser = (userId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'mod_unmute_user',
        data: { targetUserId: userId },
      }));
    }
    showToast('Patron unmuted');
  };

  const handleBanUser = (userId: string, userName: string, reason: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'mod_ban_user',
        data: { targetUserId: userId, targetUserName: userName, reason },
      }));
    }
    showToast(`Banned ${userName} from Chat Café`);
  };

  const handleUnbanUser = (userId: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'mod_unban_user',
        data: { targetUserId: userId },
      }));
    }
    showToast('Ban revoked for patron');
  };

  const handleSetSlowMode = (tableId: string, seconds: number) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'mod_set_slowmode',
        data: { tableId, seconds },
      }));
    }
    showToast(`Slow mode updated to ${seconds}s`);
  };

  const handleReportMessage = (messageId: string, reason: string, note?: string) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'report_message',
        data: { messageId, reason, note },
      }));
    }
    showToast('Report submitted to café staff. Thank you for keeping our space safe!');
  };

  const handleResolveReport = (reportId: string, status: 'resolved' | 'dismissed') => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({
        type: 'mod_resolve_report',
        data: { reportId, status },
      }));
    }
  };

  const handleBroadcastHouseRules = () => {
    handleSendMessage(
      '📜 [Staff Announcement] Friendly reminder of our Café House Rules: 1. Be warm & welcoming. 2. Respect conversation flow. 3. Zero tolerance for harassment or hate speech. 4. Flag issues rather than escalating. Enjoy your stay!'
    );
    showToast('House rules broadcasted to table');
  };

  const handleSignGuestbook = useCallback((entryData: {
    message: string;
    stamp: any;
    theme: any;
    customNote?: string;
  }) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'sign_guestbook',
          data: {
            ...entryData,
            tableId: activeTableId,
            tableName: activeTable.name,
          },
        })
      );
    } else {
      // Fallback REST POST
      fetch('/api/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...entryData,
          tableId: activeTableId,
          tableName: activeTable.name,
          user: currentUser,
        }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.entry) {
            setGuestbookEntries((prev) => [data.entry, ...prev.filter((e) => e.id !== data.entry.id)]);
          }
        })
        .catch((e) => console.error('REST guestbook sign error:', e));
    }
  }, [activeTableId, activeTable.name, currentUser]);

  const handleTributeGuestbook = useCallback((entryId: string, tributeType: 'coffee' | 'heart' | 'star' | 'cookie') => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          type: 'tribute_guestbook',
          data: {
            entryId,
            tributeType,
          },
        })
      );
    } else {
      fetch(`/api/guestbook/${entryId}/tribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tributeType, userId: currentUser.id }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.entry) {
            setGuestbookEntries((prev) => prev.map((e) => (e.id === data.entry.id ? data.entry : e)));
          }
        })
        .catch((e) => console.error('REST tribute error:', e));
    }
  }, [currentUser.id]);

  // Filter messages for active table
  const tableMessages = messages.filter((m) => m.tableId === activeTableId);
  const pinnedMessages = tableMessages.filter((m) => m.isPinned && !m.isDeleted);
  const isUserMuted = mutedUsers[currentUser.id] && mutedUsers[currentUser.id] > Date.now();
  const muteSecondsRemaining = isUserMuted ? Math.ceil((mutedUsers[currentUser.id] - Date.now()) / 1000) : 0;

  // Modals renderer helper for both retro and modern views
  const renderModals = () => (
    <>
      {/* 1. Avatar & Custom Chat Bubble Studio */}
      <AvatarPickerModal
        currentUser={currentUser}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        onSaveProfile={handleSaveProfile}
      />

      {/* 2. Staff Moderation Console */}
      <ModerationPanelModal
        isOpen={isModerationModalOpen}
        onClose={() => setIsModerationModalOpen(false)}
        reports={reports}
        activePatrons={activePatrons}
        tables={tables}
        activeTableId={activeTableId}
        bannedUserIds={bannedUserIds}
        mutedUsers={mutedUsers}
        onResolveReport={handleResolveReport}
        onDeleteMessage={handleDeleteMessage}
        onMuteUser={handleMuteUser}
        onUnmuteUser={handleUnmuteUser}
        onBanUser={handleBanUser}
        onUnbanUser={handleUnbanUser}
        onSetSlowMode={handleSetSlowMode}
        onBroadcastHouseRules={handleBroadcastHouseRules}
      />

      {/* 3. Treat Room / Drink Gift Modal */}
      <DrinkGiftModal
        isOpen={isDrinkModalOpen}
        onClose={() => setIsDrinkModalOpen(false)}
        activePatrons={activePatrons.filter((p) => p.id !== currentUser.id)}
        preselectedRecipient={drinkRecipient}
        onSendGift={handleSendDrinkGift}
      />

      {/* 4. Host Guided Topic Modal */}
      <GuidedTopicModal
        isOpen={isTopicModalOpen}
        onClose={() => setIsTopicModalOpen(false)}
        onSelectTopic={handleSelectTopic}
        activeTableName={activeTable.name}
      />

      {/* 5. Ask Barista Nora (Gemini AI Host) */}
      <AskBaristaModal
        isOpen={isAskBaristaOpen}
        onClose={() => setIsAskBaristaOpen(false)}
        currentUser={currentUser}
        activeTableName={activeTable.name}
      />

      {/* 6. Patron Message Report Modal */}
      <ReportModal
        message={reportingMessage}
        isOpen={!!reportingMessage}
        onClose={() => setReportingMessage(null)}
        onSubmitReport={handleReportMessage}
      />

      {/* 7. Active Patrons Sidebar Drawer */}
      <CafePatronsSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        patrons={activePatrons}
        currentUser={currentUser}
        currentTable={activeTable}
        onTreatPatron={(p) => {
          setDrinkRecipient(p);
          setIsDrinkModalOpen(true);
        }}
        onMuteUser={(uid, uname) => handleMuteUser(uid, uname, 10, 'Sidebar timeout')}
        onBanUser={(uid, uname) => handleBanUser(uid, uname, 'Sidebar ban')}
      />

      {/* 8. Wall of Fame & Perpetual Guestbook Panel */}
      <WallOfFameModal
        isOpen={isWallOfFameOpen}
        onClose={() => setIsWallOfFameOpen(false)}
        currentUser={currentUser}
        activeTableId={activeTableId}
        activeTableName={activeTable.name}
        guestbookEntries={guestbookEntries}
        onSignGuestbook={handleSignGuestbook}
        onTribute={handleTributeGuestbook}
        isRetroMode={true}
      />
    </>
  );

  // Exclusive Retro 1999 Yahoo! Chat & Arcade Cabinet View
  return (
    <RetroArcadeCabinetWrapper
      viewMode={retroViewMode}
      onChangeViewMode={setRetroViewMode}
      crtScanlines={crtScanlines}
      onToggleCrtScanlines={() => setCrtScanlines(!crtScanlines)}
      onInsertCoin={handleInsertCoin}
      credits={arcadeCredits}
      onTogglePlayArcadeGame={() => setIsArcadeGameOpen(!isArcadeGameOpen)}
      isArcadeGameOpen={isArcadeGameOpen}
      ambientAudioEnabled={ambientAudioEnabled}
      onToggleAmbientAudio={handleToggleAmbientAudio}
      onOpenWallOfFame={() => setIsWallOfFameOpen(true)}
    >
      {/* Floating Toast Notification */}
      {notificationBanner && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded bg-amber-950/95 border-2 border-amber-400 text-amber-200 text-xs font-pixel shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{notificationBanner}</span>
        </div>
      )}

      <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4">
        {/* Main Retro Yahoo! Chat Window */}
        <div className="w-full flex-1 max-w-4xl">
          <RetroYahooChatWindow
            tables={tables}
            activeTableId={activeTableId}
            onSelectTable={(id) => {
              setActiveTableId(id);
              setReplyingTo(null);
            }}
            messages={messages}
            currentUser={currentUser}
            activePatrons={activePatrons}
            onSendMessage={(text) => handleSendMessage(text)}
            onGiftDrinkToUser={(recipient) => {
              setDrinkRecipient(recipient);
              setIsDrinkModalOpen(true);
            }}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onOpenModerationModal={() => setIsModerationModalOpen(true)}
            onOpenAskBaristaModal={() => setIsAskBaristaOpen(true)}
            onOpenTopicModal={() => setIsTopicModalOpen(true)}
            onReportMessage={(msg) => setReportingMessage(msg)}
            onMuteUser={(uid, uname) => handleMuteUser(uid, uname, 10, 'Retro Window Mute')}
            onToggleArcadeCabinet={() =>
              setRetroViewMode(retroViewMode === 'arcade_cabinet' ? 'retro_window' : 'arcade_cabinet')
            }
            onTogglePlayArcadeGame={() => setIsArcadeGameOpen(!isArcadeGameOpen)}
            isArcadeOpen={isArcadeGameOpen}
            retroSkin={retroSkin}
            onChangeRetroSkin={setRetroSkin}
            crtScanlines={crtScanlines}
            onToggleCrtScanlines={() => setCrtScanlines(!crtScanlines)}
            soundEnabled={soundFxEnabled}
            onToggleSound={() => setSoundFxEnabled(!soundFxEnabled)}
            onOpenWallOfFame={() => setIsWallOfFameOpen(true)}
            guestbookCount={guestbookEntries.length}
          />
        </div>

        {/* Playable Arcade Game Box with CRT power flicker entrance */}
        {isArcadeGameOpen && (
          <div className="w-full lg:w-80 flex-shrink-0 animate-flicker-in">
            <RetroArcadeGame
              onClose={() => setIsArcadeGameOpen(false)}
              onPostScoreToChat={(score) => {
                handleSendMessage(
                  `🕹️ [Arcade High Score] ${currentUser.name} scored ${score.toLocaleString()} on Cyber Invaders!`
                );
                showToast(`Arcade score of ${score} shared to chat!`);
              }}
            />
          </div>
        )}
      </div>

      {renderModals()}
    </RetroArcadeCabinetWrapper>
  );
}
