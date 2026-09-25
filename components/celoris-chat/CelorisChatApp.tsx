"use client";

// Celoris Chat — private 1:1 chat between friends.
// Friends are added with a share code (CEL-XXXXXXXX): you enter someone's
// code, they accept, and only then can you message each other. All rules
// (friends only, no trainer<->student friendships, blocks, contact filter,
// rate limits) are enforced by /api/celoris-chat/* on the server.

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Ban,
  Check,
  Copy,
  Flag,
  Lock,
  MessagesSquare,
  MoreVertical,
  Phone,
  RefreshCw,
  Search,
  Send,
  Share2,
  ShieldCheck,
  UserMinus,
  UserPlus,
  Video,
  X,
} from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { createClient } from "@/lib/supabase-client";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Person {
  id: string;
  name: string;
  avatarUrl: string | null;
}
interface Friend extends Person {
  lastMessage: { body: string; at: string; fromMe: boolean } | null;
  unread: number;
}
interface MeData {
  me: { id: string; name: string; avatarUrl: string | null; shareCode: string; isBanned: boolean };
  friends: Friend[];
  incoming: { id: string; from: Person; createdAt: string }[];
  outgoing: { id: string; to: Person; createdAt: string }[];
  blocked: Person[];
}
interface Message {
  id: string;
  body: string;
  fromMe: boolean;
  filtered: boolean;
  createdAt: string;
  readAt: string | null;
}

const REPORT_REASONS: { value: string; label: string }[] = [
  { value: "sharing_contacts", label: "Asking for phone number / contact details" },
  { value: "selling_outside", label: "Offering deals or classes outside Celoris" },
  { value: "harassment", label: "Harassment or bullying" },
  { value: "inappropriate", label: "Inappropriate messages" },
  { value: "spam", label: "Spam" },
  { value: "other", label: "Something else" },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || "Something went wrong. Please try again.");
  return data as T;
}

function initials(name: string) {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "C"
  );
}

function Avatar({ person, size = 40 }: { person: Person; size?: number }) {
  const [broken, setBroken] = useState(false);
  if (person.avatarUrl && !broken) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={person.avatarUrl}
        alt=""
        width={size}
        height={size}
        onError={() => setBroken(true)}
        className="rounded-full object-cover shrink-0 bg-slate-800"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full shrink-0 bg-gradient-to-br from-sky-500 to-indigo-600 text-white font-bold flex items-center justify-center"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials(person.name)}
    </div>
  );
}

function timeLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { day: "numeric", month: "short" });
}

function dayLabel(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  if (d.toDateString() === now.toDateString()) return "Today";
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return d.toLocaleDateString([], { weekday: "short", day: "numeric", month: "short", year: "numeric" });
}

// Highlights the "[contact hidden]" marker the server puts in filtered messages.
function MessageBody({ text }: { text: string }) {
  const parts = text.split(/(\[contact hidden\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p === "[contact hidden]" ? (
          <span key={i} className="inline-flex items-center gap-0.5 rounded bg-amber-500/15 px-1 text-amber-300 text-[0.85em]">
            <ShieldCheck className="w-3 h-3" /> contact hidden
          </span>
        ) : (
          <React.Fragment key={i}>{p}</React.Fragment>
        )
      )}
    </>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function CelorisChatApp() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [data, setData] = useState<MeData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<"chats" | "requests">("chats");
  const [search, setSearch] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [addCode, setAddCode] = useState("");
  const [addBusy, setAddBusy] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportReason, setReportReason] = useState(REPORT_REASONS[0].value);
  const [reportDetails, setReportDetails] = useState("");
  const [reportAlsoBlock, setReportAlsoBlock] = useState(true);
  const [copied, setCopied] = useState(false);

  const activeIdRef = useRef<string | null>(null);
  activeIdRef.current = activeId;
  const bottomRef = useRef<HTMLDivElement>(null);

  // Signed-out visitors go to login (the chat is members-only).
  useEffect(() => {
    if (!authLoading && !user) router.replace("/login");
  }, [authLoading, user, router]);

  const flash = useCallback((kind: "ok" | "error", text: string) => {
    setNotice({ kind, text });
    window.setTimeout(() => setNotice((n) => (n?.text === text ? null : n)), 4500);
  }, []);

  const loadMe = useCallback(async () => {
    try {
      const d = await api<MeData>("/api/celoris-chat/me");
      setData(d);
      setLoadError(null);
    } catch (e: any) {
      setLoadError(e.message);
    }
  }, []);

  useEffect(() => {
    if (user) loadMe();
  }, [user, loadMe]);

  // ?add=CEL-XXXXXXXX (from a shared invite link) opens the add dialog prefilled.
  useEffect(() => {
    try {
      const code = new URLSearchParams(window.location.search).get("add");
      if (code) {
        setAddCode(code);
        setAddOpen(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const markRead = useCallback((otherId: string) => {
    api("/api/celoris-chat/read", { method: "POST", body: JSON.stringify({ with: otherId }) }).catch(() => {});
    setData((d) => (d ? { ...d, friends: d.friends.map((f) => (f.id === otherId ? { ...f, unread: 0 } : f)) } : d));
  }, []);

  // Open a conversation
  const openChat = useCallback(
    async (id: string) => {
      setActiveId(id);
      setMenuOpen(false);
      setMessages([]);
      setLoadingMessages(true);
      try {
        const res = await api<{ messages: Message[]; hasMore: boolean }>(`/api/celoris-chat/messages?with=${id}`);
        if (activeIdRef.current !== id) return;
        setMessages(res.messages);
        setHasMore(res.hasMore);
        markRead(id);
      } catch (e: any) {
        flash("error", e.message);
      } finally {
        setLoadingMessages(false);
      }
    },
    [flash, markRead]
  );

  const loadOlder = async () => {
    if (!activeId || messages.length === 0) return;
    try {
      const res = await api<{ messages: Message[]; hasMore: boolean }>(
        `/api/celoris-chat/messages?with=${activeId}&before=${encodeURIComponent(messages[0].createdAt)}`
      );
      setMessages((m) => [...res.messages, ...m]);
      setHasMore(res.hasMore);
    } catch (e: any) {
      flash("error", e.message);
    }
  };

  // Scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, activeId]);

  // Live updates: new messages to me, and friend requests changing.
  useEffect(() => {
    if (!user) return;
    const supabase: any = createClient();
    const channel = supabase
      .channel(`celoris-chat-${user.id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "celoris_chat_messages", filter: `recipient_id=eq.${user.id}` },
        (payload: any) => {
          const m = payload.new;
          const msg: Message = {
            id: m.id,
            body: m.body,
            fromMe: false,
            filtered: m.filtered,
            createdAt: m.created_at,
            readAt: m.read_at,
          };
          if (activeIdRef.current === m.sender_id) {
            setMessages((list) => (list.some((x) => x.id === msg.id) ? list : [...list, msg]));
            markRead(m.sender_id);
          }
          setData((d) => {
            if (!d) return d;
            const known = d.friends.some((f) => f.id === m.sender_id);
            if (!known) {
              loadMe();
              return d;
            }
            const friends = d.friends
              .map((f) =>
                f.id === m.sender_id
                  ? {
                      ...f,
                      lastMessage: { body: m.body, at: m.created_at, fromMe: false },
                      unread: activeIdRef.current === m.sender_id ? 0 : f.unread + 1,
                    }
                  : f
              )
              .sort((a, b) => (b.lastMessage?.at || "").localeCompare(a.lastMessage?.at || ""));
            return { ...d, friends };
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "celoris_chat_requests", filter: `to_user=eq.${user.id}` },
        () => loadMe()
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "celoris_chat_requests", filter: `from_user=eq.${user.id}` },
        () => loadMe()
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, loadMe, markRead]);

  // ---------------------------------------------------------------------------
  // Actions
  // ---------------------------------------------------------------------------

  const send = async () => {
    const text = draft.trim();
    if (!text || !activeId || sending) return;
    setSending(true);
    try {
      const res = await api<{ message: Message }>("/api/celoris-chat/messages", {
        method: "POST",
        body: JSON.stringify({ to: activeId, body: text }),
      });
      setDraft("");
      setMessages((m) => [...m, res.message]);
      if (res.message.filtered) flash("error", "Contact details are hidden automatically on Celoris Chat.");
      setData((d) =>
        d
          ? {
              ...d,
              friends: d.friends
                .map((f) =>
                  f.id === activeId ? { ...f, lastMessage: { body: res.message.body, at: res.message.createdAt, fromMe: true } } : f
                )
                .sort((a, b) => (b.lastMessage?.at || "").localeCompare(a.lastMessage?.at || "")),
            }
          : d
      );
    } catch (e: any) {
      flash("error", e.message);
    } finally {
      setSending(false);
    }
  };

  const addFriend = async () => {
    if (!addCode.trim() || addBusy) return;
    setAddBusy(true);
    try {
      const res = await api<{ status: string }>("/api/celoris-chat/requests", {
        method: "POST",
        body: JSON.stringify({ code: addCode }),
      });
      flash("ok", res.status === "friends" ? "You’re now friends. Say hi!" : "Request sent. You can chat once they accept.");
      setAddCode("");
      setAddOpen(false);
      try {
        const url = new URL(window.location.href);
        if (url.searchParams.has("add")) {
          url.searchParams.delete("add");
          window.history.replaceState(null, "", url.toString());
        }
      } catch {
        // ignore
      }
      loadMe();
    } catch (e: any) {
      flash("error", e.message);
    } finally {
      setAddBusy(false);
    }
  };

  const respond = async (id: string, action: "accept" | "decline" | "cancel") => {
    try {
      await api(`/api/celoris-chat/requests/${id}`, { method: "POST", body: JSON.stringify({ action }) });
      if (action === "accept") flash("ok", "Friend added. You can chat now.");
      loadMe();
    } catch (e: any) {
      flash("error", e.message);
      loadMe();
    }
  };

  const resetCode = async () => {
    if (!window.confirm("Get a new code? Your old code will stop working.")) return;
    try {
      const res = await api<{ shareCode: string }>("/api/celoris-chat/code", { method: "POST" });
      setData((d) => (d ? { ...d, me: { ...d.me, shareCode: res.shareCode } } : d));
      flash("ok", "New code ready. Your old code no longer works.");
    } catch (e: any) {
      flash("error", e.message);
    }
  };

  const inviteLink = data ? `${typeof window !== "undefined" ? window.location.origin : ""}/chat?add=${data.me.shareCode}` : "";

  const copyCode = async () => {
    if (!data) return;
    try {
      await navigator.clipboard.writeText(data.me.shareCode);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      flash("error", "Couldn’t copy. Select the code and copy it manually.");
    }
  };

  const shareInvite = async () => {
    if (!data) return;
    const text = `Add me on Celoris Chat — my code is ${data.me.shareCode}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Celoris Chat", text, url: inviteLink });
        return;
      }
      await navigator.clipboard.writeText(`${text}\n${inviteLink}`);
      flash("ok", "Invite link copied.");
    } catch {
      // user cancelled share
    }
  };

  const unfriend = async () => {
    if (!activeId || !active) return;
    if (!window.confirm(`Remove ${active.name} from your friends? You won’t be able to message each other.`)) return;
    try {
      await api("/api/celoris-chat/unfriend", { method: "POST", body: JSON.stringify({ userId: activeId }) });
      setActiveId(null);
      setMenuOpen(false);
      loadMe();
    } catch (e: any) {
      flash("error", e.message);
    }
  };

  const setBlock = async (userId: string, block: boolean) => {
    try {
      await api("/api/celoris-chat/block", { method: "POST", body: JSON.stringify({ userId, block }) });
      if (block && activeId === userId) setActiveId(null);
      setMenuOpen(false);
      flash("ok", block ? "Blocked. They can’t message you or send requests." : "Unblocked.");
      loadMe();
    } catch (e: any) {
      flash("error", e.message);
    }
  };

  const submitReport = async () => {
    if (!activeId) return;
    try {
      await api("/api/celoris-chat/report", {
        method: "POST",
        body: JSON.stringify({ userId: activeId, reason: reportReason, details: reportDetails }),
      });
      setReportOpen(false);
      setReportDetails("");
      if (reportAlsoBlock) await setBlock(activeId, true);
      flash("ok", "Thanks — the Celoris team will review this conversation.");
    } catch (e: any) {
      flash("error", e.message);
    }
  };

  // ---------------------------------------------------------------------------
  // Derived
  // ---------------------------------------------------------------------------

  const active = useMemo(() => data?.friends.find((f) => f.id === activeId) || null, [data, activeId]);
  const filteredFriends = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (data?.friends || []).filter((f) => !q || f.name.toLowerCase().includes(q));
  }, [data, search]);
  const requestCount = data?.incoming.length || 0;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  if (authLoading || !user || (!data && !loadError)) {
    return (
      <div className="flex items-center justify-center h-[calc(100dvh-65px)] bg-[#070a10]">
        <div className="h-10 w-10 border-4 border-sky-500/15 border-t-sky-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-[calc(100dvh-65px)] bg-[#070a10] text-slate-300 px-6 text-center">
        <p>{loadError}</p>
        <button onClick={loadMe} className="px-4 py-2 rounded-xl bg-sky-600 text-white text-sm font-bold">
          Try again
        </button>
      </div>
    );
  }

  const listPane = (
    <aside
      className={`${activeId ? "hidden md:flex" : "flex"} flex-col w-full md:w-[340px] lg:w-[380px] shrink-0 border-r border-white/[0.06] bg-[#0a0e16] min-h-0`}
    >
      {/* My header */}
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.06]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar person={data.me} size={36} />
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{data.me.name}</p>
              <p className="text-[11px] text-sky-300/80 flex items-center gap-1">
                <MessagesSquare className="w-3 h-3" /> Celoris Chat
              </p>
            </div>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold transition-colors"
          >
            <UserPlus className="w-3.5 h-3.5" /> Add friend
          </button>
        </div>

        {/* My share code */}
        <div className="mt-3 rounded-xl border border-sky-500/20 bg-sky-500/[0.06] p-3">
          <p className="text-[10px] uppercase tracking-wider text-sky-300/80 font-bold">Your share code</p>
          <div className="mt-1 flex items-center justify-between gap-2">
            <span className="font-mono text-lg font-extrabold tracking-wider text-white select-all">{data.me.shareCode}</span>
            <div className="flex items-center gap-1">
              <button onClick={copyCode} title="Copy code" className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button onClick={shareInvite} title="Share invite" className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10">
                <Share2 className="w-4 h-4" />
              </button>
              <button onClick={resetCode} title="Get a new code" className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="mt-1 text-[11px] text-slate-400">Share it with a batchmate. You can chat once they accept.</p>
        </div>

        {/* Tabs */}
        <div className="mt-3 grid grid-cols-2 gap-1 rounded-xl bg-white/[0.04] p-1">
          {(["chats", "requests"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`py-1.5 rounded-lg text-xs font-bold transition-colors ${
                tab === t ? "bg-[#131a28] text-white" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {t === "chats" ? "Chats" : "Requests"}
              {t === "requests" && requestCount > 0 && (
                <span className="ml-1.5 inline-flex min-w-4 h-4 px-1 items-center justify-center rounded-full bg-sky-500 text-[10px] text-white">
                  {requestCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {data.me.isBanned && (
        <div className="mx-4 mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
          Your Celoris Chat access has been paused by the Celoris team. Contact support if you think this is a mistake.
        </div>
      )}

      {tab === "chats" ? (
        <>
          <div className="px-4 pt-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search friends"
                className="w-full bg-white/[0.04] border border-white/[0.06] focus:border-sky-500/50 outline-none rounded-xl pl-8 pr-3 py-2 text-sm text-white placeholder:text-slate-500"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto min-h-0 py-2">
            {filteredFriends.length === 0 ? (
              <div className="px-6 py-10 text-center text-slate-400 text-sm">
                {data.friends.length === 0 ? (
                  <>
                    <MessagesSquare className="w-8 h-8 mx-auto mb-2 text-sky-400/70" />
                    <p className="font-semibold text-slate-200">No friends yet</p>
                    <p className="mt-1 text-xs">Share your code with a batchmate, or tap “Add friend” and enter theirs.</p>
                  </>
                ) : (
                  <p>No friends match “{search}”.</p>
                )}
              </div>
            ) : (
              filteredFriends.map((f) => (
                <button
                  key={f.id}
                  onClick={() => openChat(f.id)}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                    activeId === f.id ? "bg-sky-500/10" : "hover:bg-white/[0.03]"
                  }`}
                >
                  <Avatar person={f} size={44} />
                  <div className="flex-1 min-w-0 border-b border-white/[0.04] pb-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-semibold text-white truncate">{f.name}</span>
                      {f.lastMessage && (
                        <span className={`text-[11px] shrink-0 ${f.unread ? "text-sky-400 font-bold" : "text-slate-500"}`}>
                          {timeLabel(f.lastMessage.at)}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-0.5">
                      <span className="text-xs text-slate-400 truncate">
                        {f.lastMessage ? `${f.lastMessage.fromMe ? "You: " : ""}${f.lastMessage.body}` : "Say hi 👋"}
                      </span>
                      {f.unread > 0 && (
                        <span className="min-w-5 h-5 px-1.5 rounded-full bg-sky-500 text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                          {f.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-5">
          <section>
            <h3 className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-2">Received</h3>
            {data.incoming.length === 0 ? (
              <p className="text-xs text-slate-500">No pending requests.</p>
            ) : (
              <div className="space-y-2">
                {data.incoming.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5">
                    <Avatar person={r.from} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{r.from.name}</p>
                      <p className="text-[11px] text-slate-500">{timeLabel(r.createdAt)}</p>
                    </div>
                    <button
                      onClick={() => respond(r.id, "accept")}
                      className="px-2.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => respond(r.id, "decline")}
                      title="Decline"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section>
            <h3 className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-2">Sent</h3>
            {data.outgoing.length === 0 ? (
              <p className="text-xs text-slate-500">No requests waiting.</p>
            ) : (
              <div className="space-y-2">
                {data.outgoing.map((r) => (
                  <div key={r.id} className="flex items-center gap-3 rounded-xl bg-white/[0.03] border border-white/[0.06] p-2.5">
                    <Avatar person={r.to} size={36} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">{r.to.name}</p>
                      <p className="text-[11px] text-slate-500">Waiting for them to accept</p>
                    </div>
                    <button
                      onClick={() => respond(r.id, "cancel")}
                      className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-xs font-bold"
                    >
                      Cancel
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {data.blocked.length > 0 && (
            <section>
              <h3 className="text-[11px] uppercase tracking-wider text-slate-500 font-bold mb-2">Blocked</h3>
              <div className="space-y-2">
                {data.blocked.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 rounded-xl bg-white/[0.02] border border-white/[0.05] p-2.5">
                    <Avatar person={p} size={32} />
                    <p className="flex-1 min-w-0 text-sm text-slate-300 truncate">{p.name}</p>
                    <button
                      onClick={() => setBlock(p.id, false)}
                      className="px-2.5 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 text-xs font-bold"
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <div className="px-4 py-2.5 border-t border-white/[0.06] text-[11px] text-slate-500 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-400/70 shrink-0" />
        Phone numbers, emails and outside chat links are hidden automatically.
      </div>
    </aside>
  );

  const conversationPane = active ? (
    <section className={`${activeId ? "flex" : "hidden md:flex"} flex-1 flex-col min-w-0 min-h-0 bg-[#070a10]`}>
      {/* Conversation header */}
      <header className="relative flex items-center gap-3 px-3 md:px-4 py-2.5 border-b border-white/[0.06] bg-[#0a0e16]">
        <button onClick={() => setActiveId(null)} className="md:hidden p-1.5 rounded-lg text-slate-300 hover:bg-white/10" title="Back">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <Avatar person={active} size={38} />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-white truncate">{active.name}</p>
          <p className="text-[11px] text-slate-500">Friend on Celoris Chat</p>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            title="Voice calls are coming soon for Premium members"
            onClick={() => flash("ok", "Voice and video calls are coming soon for Premium members.")}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5"
          >
            <Phone className="w-4.5 h-4.5" />
            <Lock className="w-2.5 h-2.5 absolute bottom-1 right-1 text-amber-400" />
          </button>
          <button
            title="Video calls are coming soon for Premium members"
            onClick={() => flash("ok", "Voice and video calls are coming soon for Premium members.")}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5"
          >
            <Video className="w-4.5 h-4.5" />
            <Lock className="w-2.5 h-2.5 absolute bottom-1 right-1 text-amber-400" />
          </button>
          <button onClick={() => setMenuOpen((o) => !o)} className="p-2 rounded-lg text-slate-300 hover:bg-white/10" title="More">
            <MoreVertical className="w-4.5 h-4.5" />
          </button>
        </div>

        {menuOpen && (
          <div className="absolute right-3 top-full mt-1 z-20 w-52 rounded-xl border border-white/10 bg-[#111725] shadow-2xl py-1 text-sm">
            <button
              onClick={() => {
                setReportOpen(true);
                setMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-200 hover:bg-white/5"
            >
              <Flag className="w-4 h-4 text-amber-400" /> Report
            </button>
            <button onClick={() => setBlock(active.id, true)} className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-200 hover:bg-white/5">
              <Ban className="w-4 h-4 text-rose-400" /> Block
            </button>
            <button onClick={unfriend} className="w-full flex items-center gap-2 px-3 py-2 text-left text-slate-200 hover:bg-white/5">
              <UserMinus className="w-4 h-4 text-slate-400" /> Remove friend
            </button>
          </div>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto min-h-0 px-3 md:px-6 py-4 space-y-1.5" onClick={() => setMenuOpen(false)}>
        {hasMore && (
          <div className="flex justify-center pb-2">
            <button onClick={loadOlder} className="text-xs text-sky-400 hover:text-sky-300 font-semibold">
              Load earlier messages
            </button>
          </div>
        )}
        {loadingMessages && <p className="text-center text-xs text-slate-500 py-6">Loading…</p>}
        {!loadingMessages && messages.length === 0 && (
          <div className="mx-auto max-w-sm text-center text-slate-400 text-sm py-10">
            <p className="font-semibold text-slate-200">You’re now friends with {active.name}</p>
            <p className="mt-1 text-xs">Say hi! Keep chats friendly — contact details are hidden automatically.</p>
          </div>
        )}
        {messages.map((m, i) => {
          const showDay = i === 0 || dayLabel(messages[i - 1].createdAt) !== dayLabel(m.createdAt);
          return (
            <React.Fragment key={m.id}>
              {showDay && (
                <div className="flex justify-center py-2">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-white/[0.05] text-slate-400">{dayLabel(m.createdAt)}</span>
                </div>
              )}
              <div className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] md:max-w-[65%] rounded-2xl px-3 py-1.5 text-sm leading-relaxed whitespace-pre-wrap break-words ${
                    m.fromMe ? "bg-sky-600 text-white rounded-br-md" : "bg-[#151c2b] text-slate-100 rounded-bl-md"
                  }`}
                >
                  <MessageBody text={m.body} />
                  <span className={`ml-2 align-bottom text-[10px] ${m.fromMe ? "text-sky-100/70" : "text-slate-500"}`}>
                    {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    {m.fromMe && m.readAt ? " · Seen" : ""}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="flex items-end gap-2 px-3 md:px-4 py-3 border-t border-white/[0.06] bg-[#0a0e16]"
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value.slice(0, 2000))}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send();
            }
          }}
          rows={1}
          disabled={data.me.isBanned}
          placeholder={data.me.isBanned ? "Chat access paused" : "Type a message"}
          className="flex-1 resize-none max-h-32 bg-white/[0.05] border border-white/[0.06] focus:border-sky-500/50 outline-none rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-slate-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!draft.trim() || sending || data.me.isBanned}
          className="h-10 w-10 shrink-0 rounded-full bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white flex items-center justify-center"
          title="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </section>
  ) : (
    <section className="hidden md:flex flex-1 flex-col items-center justify-center text-center bg-[#070a10] px-8">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-sky-500/20">
        <MessagesSquare className="w-8 h-8 text-white" />
      </div>
      <h2 className="mt-4 text-xl font-extrabold text-white">Celoris Chat</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-400">
        Private chats with your friends on Celoris. Add a friend with their share code, then pick a chat on the left.
      </p>
      <Link href="/classrooms?tab=cafe" className="mt-5 text-xs text-sky-400 hover:text-sky-300 font-semibold">
        Looking for your class? Open Classrooms →
      </Link>
    </section>
  );

  return (
    <div className="relative flex h-[calc(100dvh-65px)] min-h-[480px] overflow-hidden bg-[#070a10] text-slate-200">
      {listPane}
      {conversationPane}

      {/* Toast */}
      {notice && (
        <div
          className={`absolute left-1/2 -translate-x-1/2 bottom-20 z-40 max-w-[90%] rounded-xl px-4 py-2.5 text-sm shadow-2xl border ${
            notice.kind === "ok" ? "bg-[#0f1a2e] border-sky-500/30 text-sky-100" : "bg-[#2a1116] border-rose-500/30 text-rose-100"
          }`}
        >
          {notice.text}
        </div>
      )}

      {/* Add friend dialog */}
      {addOpen && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setAddOpen(false)}>
          <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d1320] p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-white">Add a friend</h3>
              <button onClick={() => setAddOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="mt-1 text-xs text-slate-400">Enter your friend’s Celoris Chat code. They’ll get a request to accept.</p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addFriend();
              }}
              className="mt-4 space-y-3"
            >
              <input
                autoFocus
                value={addCode}
                onChange={(e) => setAddCode(e.target.value.toUpperCase().slice(0, 16))}
                placeholder="CEL-7K2M9QAB"
                className="w-full font-mono tracking-wider text-center text-lg bg-white/[0.05] border border-white/10 focus:border-sky-500/60 outline-none rounded-xl px-3 py-3 text-white placeholder:text-slate-600"
              />
              <button
                type="submit"
                disabled={!addCode.trim() || addBusy}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold text-sm"
              >
                {addBusy ? "Sending…" : "Send request"}
              </button>
            </form>
            <p className="mt-3 text-[11px] text-slate-500">Trainers and students can’t be added as friends.</p>
          </div>
        </div>
      )}

      {/* Report dialog */}
      {reportOpen && active && (
        <div className="absolute inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setReportOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0d1320] p-5 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-extrabold text-white">Report {active.name}</h3>
            <p className="mt-1 text-xs text-slate-400">
              The Celoris team will see this report and your recent messages with this person — nothing else.
            </p>
            <div className="mt-4 space-y-1.5">
              {REPORT_REASONS.map((r) => (
                <label key={r.value} className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 hover:bg-white/[0.03] cursor-pointer text-sm text-slate-200">
                  <input
                    type="radio"
                    name="reason"
                    value={r.value}
                    checked={reportReason === r.value}
                    onChange={() => setReportReason(r.value)}
                    className="accent-sky-500"
                  />
                  {r.label}
                </label>
              ))}
            </div>
            <textarea
              value={reportDetails}
              onChange={(e) => setReportDetails(e.target.value.slice(0, 1000))}
              rows={3}
              placeholder="Anything else we should know? (optional)"
              className="mt-3 w-full resize-none bg-white/[0.05] border border-white/10 focus:border-sky-500/60 outline-none rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500"
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input type="checkbox" checked={reportAlsoBlock} onChange={(e) => setReportAlsoBlock(e.target.checked)} className="accent-sky-500" />
              Also block {active.name}
            </label>
            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => setReportOpen(false)} className="px-4 py-2 rounded-xl text-slate-300 hover:bg-white/10 text-sm font-semibold">
                Cancel
              </button>
              <button onClick={submitReport} className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold">
                Send report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
