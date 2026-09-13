'use client';

/**
 * Chat Café — real-time multiplayer retro chat lounge.
 *
 * This is a from-scratch rewrite of the ported prototype's App.tsx: the
 * child components (RetroYahooChatWindow, the modals, the arcade cabinet,
 * etc.) are ported verbatim, but the data layer here talks to Supabase
 * (Postgres tables + Realtime + Presence) instead of the prototype's raw
 * in-memory WebSocket server, so it runs on Vercel. See the
 * chat_cafe_* migration for the schema and RLS policy this all depends on.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Sparkles, Loader2, Coffee } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import { useAuth } from '@/components/providers/AuthProvider';
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
import { cafeAudio } from './utils/cafeAudio';
import { AvatarPickerModal } from './AvatarPickerModal';
import { ModerationPanelModal } from './ModerationPanelModal';
import { DrinkGiftModal } from './DrinkGiftModal';
import { GuidedTopicModal } from './GuidedTopicModal';
import { AskBaristaModal } from './AskBaristaModal';
import { ReportModal } from './ReportModal';
import { CafePatronsSidebar } from './CafePatronsSidebar';
import { RetroYahooChatWindow } from './RetroYahooChatWindow';
import { RetroArcadeCabinetWrapper } from './RetroArcadeCabinetWrapper';
import { RetroArcadeGame } from './RetroArcadeGame';
import { WallOfFameModal } from './WallOfFameModal';

// Fixed display order for the four café tables (matches the original
// prototype's CAFE_TABLES array — the DB doesn't guarantee row order).
const TABLE_ORDER = ['main_lounge', 'study_nook', 'idea_roastery', 'mindful_patio'];
const sortTables = (list: CafeTable[]): CafeTable[] =>
  [...list].sort((a, b) => {
    const ai = TABLE_ORDER.indexOf(a.id);
    const bi = TABLE_ORDER.indexOf(b.id);
    return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
  });

const sanitizePatrons = (list: UserProfile[]): UserProfile[] => {
  if (!Array.isArray(list)) return [];
  const map = new Map<string, UserProfile>();
  list.forEach((p) => {
    if (p && p.id) map.set(p.id, p);
  });
  return Array.from(map.values());
};

function rowToUserProfile(row: any): UserProfile {
  return {
    id: row.id,
    name: row.name,
    avatarId: row.avatar_id,
    avatarColor: row.avatar_color,
    accessory: row.accessory || '',
    role: row.role,
    statusText: row.status_text || '',
    currentDrink: row.current_drink || '',
    bubbleStyle: row.bubble_style,
    joinedAt: row.joined_at ? new Date(row.joined_at).getTime() : Date.now(),
  };
}

function rowToMessage(row: any, sender: UserProfile): ChatMessage {
  return {
    id: row.id,
    tableId: row.table_id,
    sender,
    content: row.content,
    timestamp: new Date(row.created_at).getTime(),
    replyTo: row.reply_to || undefined,
    reactions: {},
    isPinned: row.is_pinned,
    isDeleted: row.is_deleted,
    deletionReason: row.deletion_reason || undefined,
    deletedBy: row.deleted_by || undefined,
    drinkGift: row.drink_gift || undefined,
    isDiscussionTopic: row.is_discussion_topic || undefined,
    discussionData: row.discussion_data || undefined,
  };
}

function rowToGuestbookEntry(row: any): GuestbookEntry {
  return {
    id: row.id,
    tableId: row.table_id,
    userId: row.user_id,
    userName: row.user_name,
    userAvatarId: row.user_avatar_id,
    userAvatarColor: row.user_avatar_color,
    userRole: row.user_role,
    message: row.message,
    motto: row.motto || undefined,
    origin: row.origin || undefined,
    stamp: row.stamp,
    plaqueStyle: row.plaque_style,
    timestamp: new Date(row.created_at).getTime(),
    tributes: {},
    isFeatured: row.is_featured,
  };
}

export default function ChatCafeApp() {
  const supabase = useMemo(() => createClient(), []);
  const { user: authUser, loading: authLoading } = useAuth();

  // Café persona for the signed-in account (fetched/created server-side).
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [myBanReason, setMyBanReason] = useState<string | null>(null);

  // Table & Messaging State
  const [tables, setTables] = useState<CafeTable[]>([]);
  const [activeTableId, setActiveTableId] = useState<string>('main_lounge');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [reactionsByMessage, setReactionsByMessage] = useState<Record<string, Record<string, string[]>>>({});
  const [activePatrons, setActivePatrons] = useState<UserProfile[]>([]);
  const [reports, setReports] = useState<ModerationReport[]>([]);
  const [bannedUserIds, setBannedUserIds] = useState<string[]>([]);
  const [mutedUsers, setMutedUsers] = useState<Record<string, number>>({});

  // A cache of every patron profile we've seen (message senders, presence,
  // realtime profile updates) so newly-arrived realtime rows that only
  // carry a sender_id can be resolved to a display name/avatar.
  const profilesCacheRef = useRef<Record<string, UserProfile>>({});

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
  const [guestbookEntries, setGuestbookEntries] = useState<GuestbookEntry[]>([]);

  // Chat interaction state
  const [slowModeCooldown, setSlowModeCooldown] = useState(0);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // Retro 1999 Yahoo! Chat & Arcade State (purely local/cosmetic — no backend needed)
  const [retroSkin, setRetroSkin] = useState<RetroThemeSkin>('xp_purple');
  const [retroViewMode, setRetroViewMode] = useState<RetroViewMode>('retro_window');
  const [crtScanlines, setCrtScanlines] = useState(true);
  const [soundFxEnabled, setSoundFxEnabled] = useState(true);
  const [arcadeCredits, setArcadeCredits] = useState(4);
  const [isArcadeGameOpen, setIsArcadeGameOpen] = useState(false);
  const [ambientAudioEnabled, setAmbientAudioEnabled] = useState(false);

  const presenceChannelRef = useRef<any>(null);
  const activeTableIdRef = useRef(activeTableId);
  activeTableIdRef.current = activeTableId;
  const currentUserRef = useRef(currentUser);
  currentUserRef.current = currentUser;

  const activeTable = tables.find((t) => t.id === activeTableId) || tables[0];

  const showToast = useCallback((msg: string) => {
    setNotificationBanner(msg);
    setTimeout(() => setNotificationBanner(null), 4500);
  }, []);

  const cacheProfile = useCallback((p: UserProfile) => {
    if (p?.id) profilesCacheRef.current[p.id] = p;
  }, []);

  // ---------------------------------------------------------------------
  // 1. Load / create the caller's Chat Café persona.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (authLoading) return;
    if (!authUser) {
      setProfileLoading(false);
      return;
    }
    let cancelled = false;
    setProfileLoading(true);
    setProfileError(null);
    fetch('/api/social/chat-cafe/profile')
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok || data.error) {
          throw new Error(data.error || `Request failed with status ${r.status}`);
        }
        return data;
      })
      .then((data) => {
        if (cancelled) return;
        if (data.profile) {
          setCurrentUser(data.profile);
          cacheProfile(data.profile);
        }
      })
      .catch((err) => {
        console.error('Chat Café profile load failed:', err.message || err);
        if (!cancelled) setProfileError(err.message || 'Failed to load your café profile.');
      })
      .finally(() => !cancelled && setProfileLoading(false));
    return () => {
      cancelled = true;
    };
  }, [authUser, authLoading, cacheProfile]);

  // ---------------------------------------------------------------------
  // 2. Load café tables once, then subscribe to live updates (slow mode,
  //    active discussion topic).
  // ---------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    supabase
      .from('chat_cafe_tables')
      .select('*, active_topic:chat_cafe_topics!chat_cafe_tables_active_topic_id_fkey(*)')
      .then(({ data, error }: any) => {
        if (error) {
          console.error(
            `Chat Café tables load failed: message="${error.message}" code="${error.code}" details="${error.details}" hint="${error.hint}"`
          );
        }
        if (cancelled || error || !data) return;
        setTables(
          sortTables(data.map((row: any) => ({
            id: row.id,
            name: row.name,
            tagline: row.tagline,
            icon: row.icon,
            atmosphere: row.atmosphere,
            slowModeSeconds: row.slow_mode_seconds,
            isLocked: row.is_locked,
            activeTopic: row.active_topic
              ? {
                  id: row.active_topic.id,
                  title: row.active_topic.title,
                  prompt: row.active_topic.prompt,
                  category: row.active_topic.category,
                  starterQuestions: row.active_topic.starter_questions || [],
                  hostedBy: row.active_topic.hosted_by,
                  startedAt: new Date(row.active_topic.started_at).getTime(),
                  phase: row.active_topic.phase,
                }
              : undefined,
          })))
        );
      });

    const channel = supabase
      .channel('chat-cafe-tables')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_cafe_tables' }, async (payload: any) => {
        const row: any = payload.new;
        let activeTopic: DiscussionTopic | undefined;
        if (row.active_topic_id) {
          const { data: topicRow } = await supabase.from('chat_cafe_topics').select('*').eq('id', row.active_topic_id).maybeSingle();
          if (topicRow) {
            activeTopic = {
              id: topicRow.id,
              title: topicRow.title,
              prompt: topicRow.prompt,
              category: topicRow.category,
              starterQuestions: topicRow.starter_questions || [],
              hostedBy: topicRow.hosted_by,
              startedAt: new Date(topicRow.started_at).getTime(),
              phase: topicRow.phase,
            };
          }
        }
        setTables((prev) =>
          prev.map((t) =>
            t.id === row.id
              ? { ...t, slowModeSeconds: row.slow_mode_seconds, isLocked: row.is_locked, activeTopic }
              : t
          )
        );
        if (row.id === activeTableIdRef.current) {
          showToast(`Table settings updated (slow mode: ${row.slow_mode_seconds}s)`);
        }
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [supabase, showToast]);

  // ---------------------------------------------------------------------
  // 3. Messages for the active table: fetch recent history, then subscribe
  //    to live INSERT/UPDATE for just this table.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;

    supabase
      .from('chat_cafe_messages')
      .select('*, sender:chat_cafe_profiles(*)')
      .eq('table_id', activeTableId)
      .order('created_at', { ascending: true })
      .limit(150)
      .then(({ data, error }: any) => {
        if (cancelled || error || !data) return;
        const mapped = data.map((row: any) => {
          const sender = row.sender ? rowToUserProfile(row.sender) : profilesCacheRef.current[row.sender_id];
          if (sender) cacheProfile(sender);
          return rowToMessage(row, sender || currentUser);
        });
        setMessages(mapped);
      });

    // Reactions for this table's messages.
    supabase
      .from('chat_cafe_message_reactions')
      .select('message_id, emoji, user_id, message:chat_cafe_messages!inner(table_id)')
      .eq('message.table_id', activeTableId)
      .then(({ data }: any) => {
        if (cancelled || !data) return;
        const map: Record<string, Record<string, string[]>> = {};
        data.forEach((r: any) => {
          if (!map[r.message_id]) map[r.message_id] = {};
          if (!map[r.message_id][r.emoji]) map[r.message_id][r.emoji] = [];
          map[r.message_id][r.emoji].push(r.user_id);
        });
        setReactionsByMessage(map);
      });

    const channel = supabase
      .channel(`chat-cafe-messages-${activeTableId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'chat_cafe_messages', filter: `table_id=eq.${activeTableId}` },
        async (payload: any) => {
          const row: any = payload.new;
          let sender: UserProfile | undefined = profilesCacheRef.current[row.sender_id];
          if (!sender) {
            const { data: senderRow } = await supabase.from('chat_cafe_profiles').select('*').eq('id', row.sender_id).maybeSingle();
            sender = senderRow ? rowToUserProfile(senderRow) : undefined;
            if (sender) cacheProfile(sender);
          }
          const newMsg = rowToMessage(row, sender || currentUserRef.current!);
          setMessages((prev) => (prev.some((m) => m.id === newMsg.id) ? prev : [...prev, newMsg]));
          if (row.sender_id !== currentUserRef.current?.id && soundFxEnabled) {
            cafeAudio.playRetroDing();
          }
        }
      )
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'chat_cafe_messages', filter: `table_id=eq.${activeTableId}` },
        (payload: any) => {
          const row: any = payload.new;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === row.id
                ? {
                    ...m,
                    isPinned: row.is_pinned,
                    isDeleted: row.is_deleted,
                    deletionReason: row.deletion_reason || undefined,
                    deletedBy: row.deleted_by || undefined,
                  }
                : m
            )
          );
        }
      )
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_cafe_message_reactions' }, (payload: any) => {
        const row: any = payload.new || payload.old;
        if (!row) return;
        setReactionsByMessage((prev) => {
          const current = { ...(prev[row.message_id] || {}) };
          const list = new Set(current[row.emoji] || []);
          if (payload.eventType === 'DELETE') {
            list.delete(row.user_id);
          } else {
            list.add(row.user_id);
          }
          current[row.emoji] = Array.from(list);
          return { ...prev, [row.message_id]: current };
        });
      })
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [supabase, activeTableId, currentUser, soundFxEnabled, cacheProfile]);

  // ---------------------------------------------------------------------
  // 4. Presence: who's currently at this table.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!currentUser) return;

    const channel = supabase.channel(`chat-cafe-presence-${activeTableId}`, {
      config: { presence: { key: currentUser.id } },
    });

    channel.on('presence', { event: 'sync' }, () => {
      const state: Record<string, Array<{ profile: UserProfile }>> = channel.presenceState();
      const patrons = Object.values(state).flatMap((entries) => entries.map((e: any) => e.profile));
      patrons.forEach(cacheProfile);
      setActivePatrons(sanitizePatrons(patrons));
    });

    channel.subscribe(async (status: any) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ profile: currentUser });
      }
    });

    presenceChannelRef.current = channel;

    return () => {
      channel.untrack();
      supabase.removeChannel(channel);
      presenceChannelRef.current = null;
    };
    // Re-join presence when the table changes or the account changes; the
    // effect below re-tracks on profile *edits* without rejoining.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, activeTableId, currentUser?.id]);

  // Re-broadcast presence when the patron edits their profile.
  useEffect(() => {
    if (presenceChannelRef.current && currentUser) {
      presenceChannelRef.current.track({ profile: currentUser });
    }
  }, [currentUser]);

  // ---------------------------------------------------------------------
  // 5. Every patron's ban/mute status (for the moderation UI + self-gating),
  //    kept live via a lightweight realtime subscription.
  // ---------------------------------------------------------------------
  const refreshSanctionLists = useCallback(() => {
    supabase
      .from('chat_cafe_profiles')
      .select('id, name, is_banned, muted_until')
      .or('is_banned.eq.true,muted_until.not.is.null')
      .then(({ data }: any) => {
        if (!data) return;
        const banned: string[] = [];
        const muted: Record<string, number> = {};
        data.forEach((row: any) => {
          if (row.is_banned) banned.push(row.id);
          if (row.muted_until && new Date(row.muted_until).getTime() > Date.now()) {
            muted[row.id] = new Date(row.muted_until).getTime();
          }
        });
        setBannedUserIds(Array.from(new Set(banned)));
        setMutedUsers(muted);
      });
  }, [supabase]);

  useEffect(() => {
    if (!currentUser) return;
    refreshSanctionLists();

    const channel = supabase
      .channel('chat-cafe-profiles')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'chat_cafe_profiles' }, (payload: any) => {
        const row: any = payload.new;
        const updated = rowToUserProfile(row);
        cacheProfile(updated);
        setActivePatrons((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));

        if (row.is_banned) setBannedUserIds((prev) => Array.from(new Set([...prev, row.id])));
        else setBannedUserIds((prev) => prev.filter((id) => id !== row.id));

        const mutedUntilMs = row.muted_until ? new Date(row.muted_until).getTime() : null;
        setMutedUsers((prev) => {
          const clone = { ...prev };
          if (mutedUntilMs && mutedUntilMs > Date.now()) clone[row.id] = mutedUntilMs;
          else delete clone[row.id];
          return clone;
        });

        if (row.id === currentUserRef.current?.id) {
          setCurrentUser(updated);
          if (row.is_banned) {
            setMyBanReason(row.ban_reason || 'Violation of house rules');
          } else if (mutedUntilMs && mutedUntilMs > Date.now()) {
            showToast(`You were temporarily muted: ${row.ban_reason || ''}`.trim());
          }
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, currentUser?.id, cacheProfile, refreshSanctionLists, showToast]);

  // ---------------------------------------------------------------------
  // 6. Wall of Fame guestbook: load once, live thereafter.
  // ---------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    const loadGuestbook = () => {
      Promise.all([
        supabase.from('chat_cafe_guestbook_entries').select('*').order('created_at', { ascending: false }).limit(200),
        supabase.from('chat_cafe_guestbook_tributes').select('entry_id, tribute_type, user_id'),
      ]).then(([entriesRes, tributesRes]: any) => {
        if (cancelled) return;
        const tributesByEntry: Record<string, Record<string, string[]>> = {};
        (tributesRes.data || []).forEach((t: any) => {
          if (!tributesByEntry[t.entry_id]) tributesByEntry[t.entry_id] = {};
          if (!tributesByEntry[t.entry_id][t.tribute_type]) tributesByEntry[t.entry_id][t.tribute_type] = [];
          tributesByEntry[t.entry_id][t.tribute_type].push(t.user_id);
        });
        const entries = (entriesRes.data || []).map((row: any) => ({
          ...rowToGuestbookEntry(row),
          tributes: tributesByEntry[row.id] || {},
        }));
        setGuestbookEntries(entries);
      });
    };

    loadGuestbook();

    const channel = supabase
      .channel('chat-cafe-guestbook')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_cafe_guestbook_entries' }, () => loadGuestbook())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_cafe_guestbook_tributes' }, () => loadGuestbook())
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Auto-scroll on new messages is handled internally by RetroYahooChatWindow.

  // Slow mode cooldown timer (purely cosmetic countdown on this client — the
  // real enforcement happens server-side in /api/social/chat-cafe/messages).
  useEffect(() => {
    if (slowModeCooldown > 0) {
      const timer = setTimeout(() => setSlowModeCooldown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [slowModeCooldown]);

  const handleInsertCoin = () => {
    cafeAudio.playArcadeCoin();
    setArcadeCredits((prev) => prev + 1);
    showToast('🪙 Clink! Inserted 25¢ arcade coin. +1 Credit added!');
  };

  const handleToggleAmbientAudio = () => {
    setAmbientAudioEnabled(cafeAudio.toggle());
  };

  // -----------------------------------------------------------------------
  // User actions — every one of these calls the corresponding
  // /api/social/chat-cafe/* route; Realtime then fans the result out to
  // every connected patron (including this tab, which just ignores the
  // duplicate by id).
  // -----------------------------------------------------------------------
  const handleSendMessage = useCallback(
    async (content: string, whisperTo?: string, replyTo?: ChatMessage, extra?: { drinkGift?: any; isDiscussionTopic?: boolean; discussionData?: any }) => {
      if (!currentUser || !activeTable) return;
      const isMuted = mutedUsers[currentUser.id] && mutedUsers[currentUser.id] > Date.now();
      if (isMuted) {
        showToast('You are currently muted and cannot send messages.');
        return;
      }
      if (activeTable.slowModeSeconds > 0 && currentUser.role !== 'moderator' && currentUser.role !== 'admin') {
        setSlowModeCooldown(activeTable.slowModeSeconds);
      }

      const res = await fetch('/api/social/chat-cafe/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: activeTableId,
          content,
          replyTo: replyTo
            ? { id: replyTo.id, senderName: replyTo.sender.name, content: replyTo.content.slice(0, 70) }
            : undefined,
          ...extra,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Message could not be sent.');
        return;
      }
      // Optimistic local append (Realtime INSERT will dedupe by id).
      if (data.message) {
        const sender = data.message.sender ? rowToUserProfile(data.message.sender) : currentUser;
        cacheProfile(sender);
        setMessages((prev) => (prev.some((m) => m.id === data.message.id) ? prev : [...prev, rowToMessage(data.message, sender)]));
      }
    },
    [currentUser, activeTable, activeTableId, mutedUsers, showToast, cacheProfile]
  );

  const handleReaction = useCallback(
    async (messageId: string, emoji: string) => {
      if (!currentUser) return;
      // Optimistic toggle.
      setReactionsByMessage((prev) => {
        const current = { ...(prev[messageId] || {}) };
        const list = new Set(current[emoji] || []);
        if (list.has(currentUser.id)) list.delete(currentUser.id);
        else list.add(currentUser.id);
        current[emoji] = Array.from(list);
        return { ...prev, [messageId]: current };
      });
      await fetch(`/api/social/chat-cafe/messages/${messageId}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emoji }),
      }).catch(() => {});
    },
    [currentUser]
  );

  const handleSendDrinkGift = useCallback(
    (drink: CafeDrink, recipientName?: string, note?: string) => {
      handleSendMessage(`Treated ${recipientName || 'the room'} to a ${drink.name}! ${drink.icon}✨`, undefined, undefined, {
        drinkGift: { drink, recipientName, note },
      });
      showToast(`Sent ${drink.name} to ${recipientName || 'the table'}!`);
    },
    [handleSendMessage, showToast]
  );

  const handleSelectTopic = useCallback(
    async (topic: DiscussionTopic) => {
      const res = await fetch('/api/social/chat-cafe/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: activeTableId,
          title: topic.title,
          prompt: topic.prompt,
          category: topic.category,
          starterQuestions: topic.starterQuestions,
          source: topic.id?.startsWith('ai_') ? 'ai_generated' : 'curated',
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        showToast(data.error || 'Could not launch that discussion.');
        return;
      }
      showToast(`New discussion launched: "${topic.title}"`);
    },
    [activeTableId, showToast]
  );

  const handleSaveProfile = useCallback(
    async (updated: Partial<UserProfile>) => {
      const res = await fetch('/api/social/chat-cafe/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (res.ok && data.profile) {
        setCurrentUser(data.profile);
        cacheProfile(data.profile);
        showToast('Café profile & chat bubble saved!');
      } else {
        showToast(data.error || 'Could not save your profile.');
      }
    },
    [showToast, cacheProfile]
  );

  // Moderation Handlers
  const handleDeleteMessage = useCallback(async (messageId: string, reason: string) => {
    const res = await fetch(`/api/social/chat-cafe/messages/${messageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete', reason }),
    });
    if (res.ok) showToast('Message removed by moderator');
  }, [showToast]);

  const handlePinMessage = useCallback(async (messageId: string) => {
    const target = messages.find((m) => m.id === messageId);
    await fetch(`/api/social/chat-cafe/messages/${messageId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: target?.isPinned ? 'unpin' : 'pin' }),
    });
  }, [messages]);

  const handleMuteUser = useCallback(
    async (userId: string, userName: string, durationMin: number = 10, reason: string = 'Moderator timeout') => {
      const res = await fetch('/api/social/chat-cafe/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'mute', targetUserId: userId, targetUserName: userName, durationMin, reason }),
      });
      if (res.ok) {
        showToast(`Muted ${userName} for ${durationMin} minutes`);
        refreshSanctionLists();
      }
    },
    [showToast, refreshSanctionLists]
  );

  const handleUnmuteUser = useCallback(
    async (userId: string) => {
      const res = await fetch('/api/social/chat-cafe/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unmute', targetUserId: userId }),
      });
      if (res.ok) {
        showToast('Patron unmuted');
        refreshSanctionLists();
      }
    },
    [showToast, refreshSanctionLists]
  );

  const handleBanUser = useCallback(
    async (userId: string, userName: string, reason: string) => {
      const res = await fetch('/api/social/chat-cafe/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'ban', targetUserId: userId, targetUserName: userName, reason }),
      });
      if (res.ok) {
        showToast(`Banned ${userName} from Chat Café`);
        refreshSanctionLists();
      }
    },
    [showToast, refreshSanctionLists]
  );

  const handleUnbanUser = useCallback(
    async (userId: string) => {
      const res = await fetch('/api/social/chat-cafe/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'unban', targetUserId: userId }),
      });
      if (res.ok) {
        showToast('Ban revoked for patron');
        refreshSanctionLists();
      }
    },
    [showToast, refreshSanctionLists]
  );

  const handleSetSlowMode = useCallback(
    async (tableId: string, seconds: number) => {
      const res = await fetch('/api/social/chat-cafe/moderate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'slowmode', tableId, seconds }),
      });
      if (res.ok) showToast(`Slow mode updated to ${seconds}s`);
    },
    [showToast]
  );

  const handleReportMessage = useCallback(
    async (messageId: string, reason: string, note?: string) => {
      const res = await fetch('/api/social/chat-cafe/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId, reason, note }),
      });
      if (res.ok) showToast('Report submitted to café staff. Thank you for keeping our space safe!');
    },
    [showToast]
  );

  const handleResolveReport = useCallback(async (reportId: string, status: 'resolved' | 'dismissed') => {
    const res = await fetch(`/api/social/chat-cafe/reports/${reportId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) setReports((prev) => prev.map((r) => (r.id === reportId ? { ...r, status } : r)));
  }, []);

  const handleBroadcastHouseRules = useCallback(() => {
    handleSendMessage(
      '📜 [Staff Announcement] Friendly reminder of our Café House Rules: 1. Be warm & welcoming. 2. Respect conversation flow. 3. Zero tolerance for harassment or hate speech. 4. Flag issues rather than escalating. Enjoy your stay!'
    );
    showToast('House rules broadcasted to table');
  }, [handleSendMessage, showToast]);

  const handleSignGuestbook = useCallback(
    async (entryData: { message: string; motto?: string; origin?: string; stamp: any; plaqueStyle: string; tableId: string }) => {
      const res = await fetch('/api/social/chat-cafe/guestbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entryData),
      });
      const data = await res.json();
      if (res.ok && data.entry) {
        setGuestbookEntries((prev) => [{ ...rowToGuestbookEntry(data.entry), tributes: {} }, ...prev.filter((e) => e.id !== data.entry.id)]);
      } else {
        showToast(data.error || 'Could not sign the guestbook.');
      }
    },
    [showToast]
  );

  const handleTributeGuestbook = useCallback(
    async (entryId: string, tributeType: string) => {
      if (!currentUser) return;
      setGuestbookEntries((prev) =>
        prev.map((e) => {
          if (e.id !== entryId) return e;
          const tributes = { ...e.tributes };
          const list = new Set(tributes[tributeType] || []);
          if (list.has(currentUser.id)) list.delete(currentUser.id);
          else list.add(currentUser.id);
          tributes[tributeType] = Array.from(list);
          return { ...e, tributes };
        })
      );
      await fetch(`/api/social/chat-cafe/guestbook/${entryId}/tribute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tributeType }),
      }).catch(() => {});
    },
    [currentUser]
  );

  // Open the moderation console: refresh reports + sanction lists so the
  // panel is current the moment it opens.
  const openModerationModal = useCallback(() => {
    setIsModerationModalOpen(true);
    refreshSanctionLists();
    fetch('/api/social/chat-cafe/reports')
      .then((r) => (r.ok ? r.json() : { reports: [] }))
      .then((data) => setReports(data.reports || []))
      .catch(() => {});
  }, [refreshSanctionLists]);

  // Merge reaction state into the message list for the child components.
  const messagesWithReactions = messages.map((m) => ({ ...m, reactions: reactionsByMessage[m.id] || {} }));

  const renderModals = () =>
    currentUser && (
      <>
        <AvatarPickerModal currentUser={currentUser} isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} onSaveProfile={handleSaveProfile} />

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

        <DrinkGiftModal
          isOpen={isDrinkModalOpen}
          onClose={() => setIsDrinkModalOpen(false)}
          activePatrons={activePatrons.filter((p) => p.id !== currentUser.id)}
          preselectedRecipient={drinkRecipient}
          onSendGift={handleSendDrinkGift}
        />

        <GuidedTopicModal isOpen={isTopicModalOpen} onClose={() => setIsTopicModalOpen(false)} onSelectTopic={handleSelectTopic} activeTableName={activeTable?.name || ''} />

        <AskBaristaModal isOpen={isAskBaristaOpen} onClose={() => setIsAskBaristaOpen(false)} currentUser={currentUser} activeTableName={activeTable?.name || ''} />

        <ReportModal message={reportingMessage} isOpen={!!reportingMessage} onClose={() => setReportingMessage(null)} onSubmitReport={handleReportMessage} />

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

        <WallOfFameModal
          isOpen={isWallOfFameOpen}
          onClose={() => setIsWallOfFameOpen(false)}
          currentUser={currentUser}
          activeTableId={activeTableId}
          activeTableName={activeTable?.name || ''}
          guestbookEntries={guestbookEntries}
          onSignGuestbook={handleSignGuestbook}
          onTribute={handleTributeGuestbook}
          isRetroMode={true}
        />
      </>
    );

  // -----------------------------------------------------------------------
  // Gates: waiting on auth, signed out, waiting on profile/tables, or banned.
  // The signed-out check must come before the tables-loading check: RLS
  // only allows `chat_cafe_tables` reads for authenticated users, so a
  // signed-out visitor would otherwise see an infinite "Brewing…" spinner
  // (tables.length staying 0 forever) instead of the sign-in prompt.
  // -----------------------------------------------------------------------
  if (authLoading) {
    return (
      <div className="w-full min-h-[420px] flex flex-col items-center justify-center gap-3 rounded-3xl border border-fuchsia-500/20 bg-[#181124] text-stone-300">
        <Loader2 className="w-6 h-6 animate-spin text-fuchsia-400" />
        <p className="text-sm">Brewing the café…</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="w-full min-h-[420px] flex flex-col items-center justify-center gap-3 rounded-3xl border border-fuchsia-500/20 bg-[#181124] text-stone-300 p-8 text-center">
        <Coffee className="w-8 h-8 text-fuchsia-400" />
        <h3 className="text-lg font-bold text-fuchsia-200">Sign in to enter Chat Café</h3>
        <p className="text-sm text-stone-400 max-w-sm">Create a free Celoris account or log in to grab a seat, pick a retro avatar, and start chatting.</p>
      </div>
    );
  }

  if (profileLoading || !tables.length) {
    return (
      <div className="w-full min-h-[420px] flex flex-col items-center justify-center gap-3 rounded-3xl border border-fuchsia-500/20 bg-[#181124] text-stone-300">
        <Loader2 className="w-6 h-6 animate-spin text-fuchsia-400" />
        <p className="text-sm">Brewing the café…</p>
      </div>
    );
  }

  if (myBanReason) {
    return (
      <div className="w-full min-h-[420px] flex flex-col items-center justify-center gap-3 rounded-3xl border border-rose-500/30 bg-[#181124] text-stone-300 p-8 text-center">
        <h3 className="text-lg font-bold text-rose-300">You've been barred from Chat Café</h3>
        <p className="text-sm text-stone-400 max-w-sm">{myBanReason}</p>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="w-full min-h-[420px] flex flex-col items-center justify-center gap-3 rounded-3xl border border-rose-500/30 bg-[#181124] text-stone-300 p-8 text-center">
        <h3 className="text-lg font-bold text-rose-300">Couldn't load your café profile</h3>
        <p className="text-sm text-stone-400 max-w-sm">{profileError || 'Something went wrong setting up your Chat Café persona. Try reloading the page.'}</p>
      </div>
    );
  }

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
      {notificationBanner && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded bg-amber-950/95 border-2 border-amber-400 text-amber-200 text-xs font-pixel shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{notificationBanner}</span>
        </div>
      )}

      <div className="w-full flex flex-col lg:flex-row items-center lg:items-start justify-center gap-4">
        <div className="w-full flex-1 max-w-4xl">
          <RetroYahooChatWindow
            tables={tables}
            activeTableId={activeTableId}
            onSelectTable={(id) => setActiveTableId(id)}
            messages={messagesWithReactions}
            currentUser={currentUser}
            activePatrons={activePatrons}
            onSendMessage={(text) => handleSendMessage(text)}
            onGiftDrinkToUser={(recipient) => {
              setDrinkRecipient(recipient);
              setIsDrinkModalOpen(true);
            }}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
            onOpenModerationModal={openModerationModal}
            onOpenAskBaristaModal={() => setIsAskBaristaOpen(true)}
            onOpenTopicModal={() => setIsTopicModalOpen(true)}
            onReportMessage={(msg) => setReportingMessage(msg)}
            onMuteUser={(uid, uname) => handleMuteUser(uid, uname, 10, 'Retro Window Mute')}
            onToggleArcadeCabinet={() => setRetroViewMode(retroViewMode === 'arcade_cabinet' ? 'retro_window' : 'arcade_cabinet')}
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

        {isArcadeGameOpen && (
          <div className="w-full lg:w-80 flex-shrink-0 animate-flicker-in">
            <RetroArcadeGame
              onClose={() => setIsArcadeGameOpen(false)}
              onPostScoreToChat={(score) => {
                handleSendMessage(`🕹️ [Arcade High Score] ${currentUser.name} scored ${score.toLocaleString()} on Cyber Invaders!`);
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
