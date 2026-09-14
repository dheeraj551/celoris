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
  AiCharacter,
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

// AI characters don't have a real chat_cafe_profiles row — this builds a
// UserProfile-shaped stand-in (from either a raw ai_character DB row or the
// client-side AiCharacter shape) so every existing component that renders
// `message.sender` / patron cards keeps working unmodified.
function characterToUserProfile(character: any): UserProfile {
  return {
    id: `ai_${character.id}`,
    name: character.name,
    avatarId: character.avatar_id || character.avatarId,
    avatarColor: character.avatar_color || character.avatarColor || 'from-amber-400 to-orange-500',
    accessory: character.accessory || '',
    role: 'regular',
    statusText: '☕ Café regular',
    currentDrink: '',
    bubbleStyle: 'ceramic',
    joinedAt: Date.now(),
  };
}

function rowToAiCharacter(row: any): AiCharacter {
  return {
    id: row.id,
    tableId: row.table_id,
    name: row.name,
    avatarId: row.avatar_id,
    avatarColor: row.avatar_color,
    accessory: row.accessory || '',
    backstory: row.backstory || '',
    personality: row.personality || '',
    isActive: row.is_active,
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
    senderType: row.sender_type === 'ai' ? 'ai' : 'human',
    aiCharacterId: row.ai_character_id || undefined,
    whisperTo: row.whisper_to || undefined,
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

  // Admin-curated AI characters seated at the active table — powers the
  // moderator "speak as" panel. They only ever speak when someone (a
  // moderator here, or the admin dashboard) manually sends a line as them;
  // there's no automatic/AI-generated dialogue.
  const [aiCharacters, setAiCharacters] = useState<AiCharacter[]>([]);

  // A cache of every patron profile we've seen (message senders, presence,
  // realtime profile updates) so newly-arrived realtime rows that only
  // carry a sender_id can be resolved to a display name/avatar.
  const profilesCacheRef = useRef<Record<string, UserProfile>>({});
  // Same idea for AI characters, keyed by character id (not the synthetic
  // `ai_<id>` UserProfile id) so a realtime message carrying only
  // ai_character_id can be resolved without a network round trip.
  const aiCharacterCacheRef = useRef<Record<string, UserProfile>>({});

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

  // "X is typing…" — userId -> display name, expired individually a few
  // seconds after their last keystroke broadcast (see the typing effect).
  const [typingUsers, setTypingUsers] = useState<Record<string, string>>({});
  const typingChannelRef = useRef<any>(null);
  const typingTimeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});
  const lastTypingSentRef = useRef(0);
  const lastCharTypingSentRef = useRef<Record<string, number>>({});

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

  // Resolve an AI character id (from a realtime message row that only
  // carries ai_character_id) to a display-ready UserProfile stand-in.
  const resolveAiCharacterSender = useCallback(
    async (characterId: string): Promise<UserProfile> => {
      const cached = aiCharacterCacheRef.current[characterId];
      if (cached) return cached;
      const { data } = await supabase.from('chat_cafe_ai_characters').select('*').eq('id', characterId).maybeSingle();
      const profile = characterToUserProfile(data || { id: characterId, name: 'AI Regular' });
      aiCharacterCacheRef.current[characterId] = profile;
      return profile;
    },
    [supabase]
  );

  // ---------------------------------------------------------------------
  // 1. Load / create the caller's Chat Café persona.
  //
  // Keyed on authUser?.id (not the authUser object itself): Supabase's
  // client silently refreshes the auth token whenever the tab regains
  // focus (switching tabs, un-minimizing), and AuthProvider hands back a
  // brand-new `user` object on every one of those refreshes even though
  // it's the same account. If this effect depended on that object
  // directly, every tab-focus would look like a fresh sign-in, flip
  // profileLoading back to true, and swap the whole café out for the
  // "Brewing the café…" spinner — i.e. the room appearing to reload
  // itself just from switching away and back. loadedAuthIdRef guards
  // against re-fetching for an account we've already loaded.
  // ---------------------------------------------------------------------
  const loadedAuthIdRef = useRef<string | null>(null);
  useEffect(() => {
    if (authLoading) return;
    if (!authUser) {
      setProfileLoading(false);
      loadedAuthIdRef.current = null;
      return;
    }
    if (loadedAuthIdRef.current === authUser.id) return;
    loadedAuthIdRef.current = authUser.id;
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
        if (!cancelled) {
          setProfileError(err.message || 'Failed to load your café profile.');
          loadedAuthIdRef.current = null; // allow a retry on the next render
        }
      })
      .finally(() => !cancelled && setProfileLoading(false));
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser?.id, authLoading, cacheProfile]);

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
            nowPlaying: row.now_playing || null,
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
              ? {
                  ...t,
                  slowModeSeconds: row.slow_mode_seconds,
                  isLocked: row.is_locked,
                  nowPlaying: row.now_playing || null,
                  activeTopic,
                }
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
      .select('*, sender:chat_cafe_profiles(*), ai_character:chat_cafe_ai_characters(*)')
      .eq('table_id', activeTableId)
      .order('created_at', { ascending: true })
      .limit(150)
      .then(({ data, error }: any) => {
        if (cancelled || error || !data) return;
        const mapped = data.map((row: any) => {
          if (row.sender_type === 'ai') {
            const senderProfile = row.ai_character
              ? characterToUserProfile(row.ai_character)
              : characterToUserProfile({ id: row.ai_character_id, name: 'AI Regular' });
            if (row.ai_character_id) aiCharacterCacheRef.current[row.ai_character_id] = senderProfile;
            return rowToMessage(row, senderProfile);
          }
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

    // Self-healing subscribe: Supabase Realtime can drop a channel (a
    // client-side rate limit, a brief network blip, a server restart) and
    // otherwise the app would just go stale until the patron manually
    // reloads. On CHANNEL_ERROR/TIMED_OUT/CLOSED we tear the channel down
    // and reconnect after a short delay instead of leaving it dead.
    let channel: any = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const connectMessagesChannel = () => {
      if (cancelled) return;
      channel = supabase
        .channel(`chat-cafe-messages-${activeTableId}`)
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'chat_cafe_messages', filter: `table_id=eq.${activeTableId}` },
          async (payload: any) => {
            const row: any = payload.new;
            let sender: UserProfile | undefined;
            if (row.sender_type === 'ai' && row.ai_character_id) {
              sender = await resolveAiCharacterSender(row.ai_character_id);
            } else {
              sender = profilesCacheRef.current[row.sender_id];
              if (!sender) {
                const { data: senderRow } = await supabase.from('chat_cafe_profiles').select('*').eq('id', row.sender_id).maybeSingle();
                sender = senderRow ? rowToUserProfile(senderRow) : undefined;
                if (sender) cacheProfile(sender);
              }
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
        .subscribe((status: any, err: any) => {
          if (cancelled) return;
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.warn('Chat Café messages realtime channel dropped, reconnecting…', status, err);
            if (channel) supabase.removeChannel(channel);
            retryTimer = setTimeout(connectMessagesChannel, 3000);
          }
        });
    };
    connectMessagesChannel();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      if (channel) supabase.removeChannel(channel);
    };
  }, [supabase, activeTableId, currentUser, soundFxEnabled, cacheProfile, resolveAiCharacterSender]);

  // ---------------------------------------------------------------------
  // 4. Presence: who's currently at this table.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    let channel: any = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const connectPresence = () => {
      if (cancelled) return;
      channel = supabase.channel(`chat-cafe-presence-${activeTableId}`, {
        config: { presence: { key: currentUser.id } },
      });

      channel.on('presence', { event: 'sync' }, () => {
        const state: Record<string, Array<{ profile: UserProfile }>> = channel.presenceState();
        const patrons = Object.values(state).flatMap((entries) => entries.map((e: any) => e.profile));
        patrons.forEach(cacheProfile);
        setActivePatrons(sanitizePatrons(patrons));
      });

      channel.subscribe(async (status: any) => {
        if (cancelled) return;
        if (status === 'SUBSCRIBED') {
          await channel.track({ profile: currentUserRef.current });
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
          // Supabase enforces a per-client presence event rate limit — rapid
          // table-switching can trip it. Reconnect instead of leaving the
          // patron list (and, transitively, other realtime feel) stale.
          console.warn('Chat Café presence channel dropped, reconnecting…', status);
          if (presenceChannelRef.current === channel) presenceChannelRef.current = null;
          supabase.removeChannel(channel);
          retryTimer = setTimeout(connectPresence, 3000);
        }
      });

      presenceChannelRef.current = channel;
    };

    // Debounce the join slightly so quickly clicking through several table
    // tabs doesn't fire a burst of presence join/leave events back to back.
    const joinTimer = setTimeout(connectPresence, 250);

    return () => {
      cancelled = true;
      clearTimeout(joinTimer);
      if (retryTimer) clearTimeout(retryTimer);
      if (channel) {
        channel.untrack();
        supabase.removeChannel(channel);
      }
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

  // ---------------------------------------------------------------------
  // 7. AI characters seated at the active table (admin-curated). RLS on
  //    chat_cafe_ai_characters is SELECT-open to authenticated users, so
  //    this reads directly — only writes (admin CRUD, puppeting) go
  //    through API routes.
  // ---------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    const loadCharacters = () => {
      supabase
        .from('chat_cafe_ai_characters')
        .select('*')
        .eq('table_id', activeTableId)
        .eq('is_active', true)
        .order('name')
        .then(({ data, error }: any) => {
          if (cancelled || error || !data) return;
          const list = data.map(rowToAiCharacter);
          setAiCharacters(list);
          list.forEach((c: AiCharacter) => {
            aiCharacterCacheRef.current[c.id] = characterToUserProfile(c);
          });
        });
    };

    loadCharacters();

    let channel: any = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (cancelled) return;
      channel = supabase
        .channel(`chat-cafe-ai-characters-${activeTableId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'chat_cafe_ai_characters', filter: `table_id=eq.${activeTableId}` },
          () => loadCharacters()
        )
        .subscribe((status: any) => {
          if (cancelled) return;
          if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            if (channel) supabase.removeChannel(channel);
            retryTimer = setTimeout(connect, 3000);
          }
        });
    };
    connect();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      if (channel) supabase.removeChannel(channel);
    };
  }, [supabase, activeTableId]);

  // ---------------------------------------------------------------------
  // "X is typing…" — an ephemeral broadcast channel per table (no DB
  // writes). Each keystroke in the input nudges handleTyping(), which is
  // throttled and sends a broadcast; every other patron auto-expires that
  // user out of the indicator ~3s after their last broadcast, so there's
  // no explicit "stopped typing" event to send.
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (!currentUser) return;
    let cancelled = false;
    let channel: any = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;

    const connect = () => {
      if (cancelled) return;
      channel = supabase
        .channel(`chat-cafe-typing-${activeTableId}`)
        .on('broadcast', { event: 'typing' }, ({ payload }: any) => {
          if (!payload?.userId || payload.userId === currentUserRef.current?.id) return;
          setTypingUsers((prev) => ({ ...prev, [payload.userId]: payload.name || 'Someone' }));
          if (typingTimeoutsRef.current[payload.userId]) clearTimeout(typingTimeoutsRef.current[payload.userId]);
          typingTimeoutsRef.current[payload.userId] = setTimeout(() => {
            setTypingUsers((prev) => {
              const next = { ...prev };
              delete next[payload.userId];
              return next;
            });
            delete typingTimeoutsRef.current[payload.userId];
          }, 3000);
        })
        .subscribe((status: any) => {
          if (cancelled) return;
          if (status === 'SUBSCRIBED') {
            typingChannelRef.current = channel;
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            if (typingChannelRef.current === channel) typingChannelRef.current = null;
            supabase.removeChannel(channel);
            retryTimer = setTimeout(connect, 3000);
          }
        });
    };
    connect();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      if (channel) supabase.removeChannel(channel);
      typingChannelRef.current = null;
      Object.values(typingTimeoutsRef.current).forEach(clearTimeout);
      typingTimeoutsRef.current = {};
      setTypingUsers({});
    };
  }, [supabase, activeTableId, currentUser?.id]);

  const handleTyping = useCallback(() => {
    if (!currentUserRef.current) return;
    const now = Date.now();
    if (now - lastTypingSentRef.current < 1500) return; // throttle
    lastTypingSentRef.current = now;
    typingChannelRef.current?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: currentUserRef.current.id, name: currentUserRef.current.name },
    });
  }, []);

  // Same "X is typing…" broadcast, but for a moderator/admin drafting a
  // line as one of this table's AI characters from the Staff Console's
  // "speak as" box — reuses the already-connected typing channel above,
  // keyed by the same synthetic `ai_<id>` id used everywhere else an AI
  // character stands in for a UserProfile.
  const handleCharacterTyping = useCallback((characterId: string, characterName: string) => {
    const now = Date.now();
    const last = lastCharTypingSentRef.current[characterId] || 0;
    if (now - last < 1500) return; // throttle
    lastCharTypingSentRef.current[characterId] = now;
    typingChannelRef.current?.send({
      type: 'broadcast',
      event: 'typing',
      payload: { userId: `ai_${characterId}`, name: characterName },
    });
  }, []);

  // AI characters seated at the table are admin-curated "regulars" that
  // post through the same message stream as anyone else — the roster
  // shown in the chat window should include them too, so a moderator or
  // admin currently puppeting one doesn't disappear from the room's user
  // list. (Moderation-sensitive surfaces — the sidebar's mute/ban and the
  // staff console's Patrons tab — intentionally keep using the real,
  // presence-tracked `activePatrons` list, since an AI character has no
  // real chat_cafe_profiles row to mute or ban.)
  const displayRoster = useMemo(
    () => [...activePatrons, ...aiCharacters.map(characterToUserProfile)],
    [activePatrons, aiCharacters]
  );

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
    async (content: string, whisperTo?: { id: string; name: string }, replyTo?: ChatMessage, extra?: { drinkGift?: any; isDiscussionTopic?: boolean; discussionData?: any }) => {
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
          whisperTo,
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

  // Moderator "puppeting" — post a line as one of this table's AI
  // characters, from the live Staff Console. (The admin dashboard has its
  // own separate way to do this — see /admin/chat-cafe.) The server
  // (messages route) re-checks isModerator and table membership itself.
  const handleSendAsCharacter = useCallback(
    async (characterId: string, content: string, whisperTo?: { id: string; name: string }) => {
      if (!content.trim()) return;
      const res = await fetch('/api/social/chat-cafe/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tableId: activeTableId, content, asCharacterId: characterId, whisperTo }),
      });
      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || 'Could not send as that character.');
        return;
      }
      if (data.message) {
        const known = aiCharacterCacheRef.current[characterId];
        const sender = data.message.ai_character ? characterToUserProfile(data.message.ai_character) : known || currentUser!;
        aiCharacterCacheRef.current[characterId] = sender;
        setMessages((prev) => (prev.some((m) => m.id === data.message.id) ? prev : [...prev, rowToMessage(data.message, sender)]));
      }
    },
    [activeTableId, currentUser, showToast]
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
        showToast('User unmuted');
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
        showToast('Ban revoked for user');
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
          aiCharacters={aiCharacters}
          messages={messagesWithReactions}
          onResolveReport={handleResolveReport}
          onDeleteMessage={handleDeleteMessage}
          onMuteUser={handleMuteUser}
          onUnmuteUser={handleUnmuteUser}
          onBanUser={handleBanUser}
          onUnbanUser={handleUnbanUser}
          onSetSlowMode={handleSetSlowMode}
          onBroadcastHouseRules={handleBroadcastHouseRules}
          onSendAsCharacter={handleSendAsCharacter}
          onCharacterTyping={handleCharacterTyping}
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
      nowPlaying={activeTable?.nowPlaying}
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
            activePatrons={displayRoster}
            onSendMessage={(text, whisperTo) => handleSendMessage(text, whisperTo)}
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
            typingUsers={Object.values(typingUsers)}
            onTyping={handleTyping}
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
