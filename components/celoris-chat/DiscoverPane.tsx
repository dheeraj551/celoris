"use client";

// Celoris Chat → Discover. Opt-in only: you appear here only after you turn
// it on, and only people who turned it on can see you. Students see students,
// trainers see trainers. The server (/api/celoris-chat/discover) applies all
// the rules; this component just shows the list.

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Check, Compass, EyeOff, Flag, Pencil, Search, ShieldCheck, Sparkles, UserPlus } from "lucide-react";
import { CHAT_INTERESTS, MAX_BIO_LENGTH, MAX_INTERESTS } from "@/lib/celoris-chat-interests";

export interface DiscoverPerson {
  id: string;
  name: string;
  avatarUrl: string | null;
  bio: string | null;
  interests: string[];
  shared?: number;
}

interface MySettings {
  discoverable: boolean;
  bio: string;
  interests: string[];
}

interface Props {
  settings: MySettings;
  isBanned: boolean;
  api: <T = any>(url: string, init?: RequestInit) => Promise<T>;
  flash: (kind: "ok" | "error", text: string) => void;
  onSettingsSaved: (s: MySettings) => void;
  onRequestSent: () => void;
  onReport: (p: DiscoverPerson) => void;
  Avatar: React.ComponentType<{ person: { id: string; name: string; avatarUrl: string | null }; size?: number }>;
  /** Bumped by the parent when someone should disappear from the list (e.g. after a block). */
  refreshKey: number;
}

function InterestChips({
  selected,
  onToggle,
  highlight,
}: {
  selected: string[];
  onToggle: (v: string) => void;
  highlight?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {CHAT_INTERESTS.map((i) => {
        const on = selected.indexOf(i) !== -1;
        return (
          <button
            type="button"
            key={i}
            onClick={() => onToggle(i)}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border transition-colors ${
              on
                ? "bg-sky-500/20 border-sky-400/50 text-sky-100"
                : `border-white/10 text-slate-400 hover:text-slate-200 hover:border-white/20 ${highlight ? "bg-white/[0.02]" : ""}`
            }`}
          >
            {on && <Check className="inline w-3 h-3 mr-0.5 -mt-0.5" />}
            {i}
          </button>
        );
      })}
    </div>
  );
}

export default function DiscoverPane({
  settings,
  isBanned,
  api,
  flash,
  onSettingsSaved,
  onRequestSent,
  onReport,
  Avatar,
  refreshKey,
}: Props) {
  const [editing, setEditing] = useState(!settings.discoverable);
  const [bioDraft, setBioDraft] = useState(settings.bio);
  const [interestsDraft, setInterestsDraft] = useState<string[]>(settings.interests);
  const [saving, setSaving] = useState(false);

  const [people, setPeople] = useState<DiscoverPerson[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [interest, setInterest] = useState<string | null>(null);
  const [sent, setSent] = useState<Record<string, "requested" | "friends">>({});
  const [busyId, setBusyId] = useState<string | null>(null);
  const reqSeq = useRef(0);

  // Keep the form in sync if settings change from outside (e.g. reload).
  useEffect(() => {
    if (!editing) {
      setBioDraft(settings.bio);
      setInterestsDraft(settings.interests);
    }
  }, [settings, editing]);

  const load = useCallback(
    async (nextPage: number, replace: boolean) => {
      const seq = ++reqSeq.current;
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (q.trim()) params.set("q", q.trim());
        if (interest) params.set("interest", interest);
        params.set("page", String(nextPage));
        const res = await api<{ needsOptIn: boolean; people: DiscoverPerson[]; hasMore: boolean }>(
          `/api/celoris-chat/discover?${params.toString()}`
        );
        if (seq !== reqSeq.current) return;
        setPeople((list) => (replace ? res.people : [...list, ...res.people.filter((p) => !list.some((x) => x.id === p.id))]));
        setHasMore(res.hasMore);
        setPage(nextPage);
      } catch (e: any) {
        if (seq === reqSeq.current) flash("error", e.message);
      } finally {
        if (seq === reqSeq.current) setLoading(false);
      }
    },
    [api, flash, q, interest]
  );

  // Reload when filters change (search is debounced).
  useEffect(() => {
    if (!settings.discoverable || isBanned) return;
    const t = window.setTimeout(() => load(0, true), q ? 350 : 0);
    return () => window.clearTimeout(t);
  }, [settings.discoverable, isBanned, q, interest, refreshKey, load]);

  const toggleInterest = (v: string) => {
    setInterestsDraft((list) => {
      if (list.indexOf(v) !== -1) return list.filter((x) => x !== v);
      if (list.length >= MAX_INTERESTS) {
        flash("error", `Pick up to ${MAX_INTERESTS} interests.`);
        return list;
      }
      return [...list, v];
    });
  };

  const save = async (discoverable: boolean) => {
    if (saving) return;
    if (discoverable && interestsDraft.length === 0) {
      flash("error", "Pick at least one interest so the right people find you.");
      return;
    }
    setSaving(true);
    try {
      const res = await api<MySettings & { filtered: boolean }>("/api/celoris-chat/discover", {
        method: "POST",
        body: JSON.stringify({ discoverable, bio: bioDraft, interests: interestsDraft }),
      });
      onSettingsSaved({ discoverable: res.discoverable, bio: res.bio, interests: res.interests });
      setBioDraft(res.bio);
      setEditing(!res.discoverable);
      if (res.filtered) flash("error", "Contact details were removed from your intro.");
      else flash("ok", res.discoverable ? "You’re in Discover now." : "You’re hidden from Discover.");
    } catch (e: any) {
      flash("error", e.message);
    } finally {
      setSaving(false);
    }
  };

  const sendRequest = async (p: DiscoverPerson) => {
    if (busyId) return;
    setBusyId(p.id);
    try {
      const res = await api<{ status: "requested" | "friends" }>("/api/celoris-chat/requests", {
        method: "POST",
        body: JSON.stringify({ userId: p.id }),
      });
      setSent((s) => ({ ...s, [p.id]: res.status }));
      flash("ok", res.status === "friends" ? `You and ${p.name} are now friends.` : `Request sent to ${p.name}.`);
      onRequestSent();
    } catch (e: any) {
      flash("error", e.message);
      // They may have left Discover or hit a limit — drop them from the list
      // if the server says they're gone.
      if (/isn’t in Discover/.test(e.message)) setPeople((list) => list.filter((x) => x.id !== p.id));
    } finally {
      setBusyId(null);
    }
  };

  if (isBanned) {
    return (
      <div className="flex-1 p-6 text-center text-sm text-slate-400">Discover isn’t available while your chat access is paused.</div>
    );
  }

  // ---------------------------------------------------------------------------
  // Opt-in / edit form
  // ---------------------------------------------------------------------------
  if (editing || !settings.discoverable) {
    return (
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
        <div className="rounded-xl border border-sky-500/20 bg-sky-500/[0.06] p-3.5">
          <p className="flex items-center gap-1.5 text-sm font-bold text-white">
            <Compass className="w-4 h-4 text-sky-300" /> Find people learning what you learn
          </p>
          <ul className="mt-2 space-y-1 text-[12px] text-slate-300 leading-relaxed">
            <li>• Only people who turn on Discover can see you, and you can see only them.</li>
            <li>• They see your name, photo, short intro and interests. Never your code, email or phone.</li>
            <li>• A request is just a request. Nobody can message you until you accept.</li>
            <li>• You can hide yourself again any time.</li>
          </ul>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">Short intro (optional)</label>
          <textarea
            value={bioDraft}
            onChange={(e) => setBioDraft(e.target.value.slice(0, MAX_BIO_LENGTH))}
            rows={2}
            placeholder="e.g. Learning web development, looking for a study buddy for React"
            className="mt-1.5 w-full resize-none bg-white/[0.05] border border-white/10 focus:border-sky-500/60 outline-none rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-500"
          />
          <p className="text-right text-[10px] text-slate-500">
            {bioDraft.length}/{MAX_BIO_LENGTH}
          </p>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-wider text-slate-500 font-bold">
            Interests <span className="normal-case tracking-normal font-normal">(pick up to {MAX_INTERESTS})</span>
          </label>
          <div className="mt-2">
            <InterestChips selected={interestsDraft} onToggle={toggleInterest} />
          </div>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            onClick={() => save(true)}
            disabled={saving || interestsDraft.length === 0}
            className="flex-1 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white text-sm font-bold"
          >
            {saving ? "Saving…" : settings.discoverable ? "Save" : "Turn on Discover"}
          </button>
          {settings.discoverable && (
            <button
              onClick={() => {
                setEditing(false);
                setBioDraft(settings.bio);
                setInterestsDraft(settings.interests);
              }}
              className="px-4 py-2.5 rounded-xl text-slate-300 hover:bg-white/10 text-sm font-semibold"
            >
              Cancel
            </button>
          )}
        </div>
        {settings.discoverable && (
          <button
            onClick={() => save(false)}
            disabled={saving}
            className="w-full inline-flex items-center justify-center gap-1.5 py-2 rounded-xl border border-white/10 text-slate-300 hover:text-white hover:bg-white/5 text-xs font-bold"
          >
            <EyeOff className="w-3.5 h-3.5" /> Hide me from Discover
          </button>
        )}
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // The list
  // ---------------------------------------------------------------------------
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="px-4 pt-3 space-y-2">
        <div className="flex items-center justify-between gap-2 text-[11px]">
          <span className="inline-flex items-center gap-1 text-emerald-300/90 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> You’re visible in Discover
          </span>
          <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-semibold">
            <Pencil className="w-3 h-3" /> Edit
          </button>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value.slice(0, 40))}
            placeholder="Search by name"
            className="w-full bg-white/[0.04] border border-white/[0.06] focus:border-sky-500/50 outline-none rounded-xl pl-8 pr-3 py-2 text-sm text-white placeholder:text-slate-500"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 [scrollbar-width:none]">
          <button
            onClick={() => setInterest(null)}
            className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
              interest === null ? "bg-sky-500/20 border-sky-400/50 text-sky-100" : "border-white/10 text-slate-400 hover:text-slate-200"
            }`}
          >
            All
          </button>
          {CHAT_INTERESTS.map((i) => (
            <button
              key={i}
              onClick={() => setInterest(interest === i ? null : i)}
              className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
                interest === i ? "bg-sky-500/20 border-sky-400/50 text-sky-100" : "border-white/10 text-slate-400 hover:text-slate-200"
              }`}
            >
              {i}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 px-4 py-2 space-y-2">
        {people.length === 0 && !loading && (
          <div className="py-10 text-center text-slate-400 text-sm">
            <Sparkles className="w-7 h-7 mx-auto mb-2 text-sky-400/70" />
            <p className="font-semibold text-slate-200">{q || interest ? "No one matches that yet" : "No one new here yet"}</p>
            <p className="mt-1 text-xs">Discover is new. Check back soon, or share your code with batchmates.</p>
          </div>
        )}

        {people.map((p) => {
          const state = sent[p.id];
          return (
            <div key={p.id} className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3">
              <div className="flex items-start gap-3">
                <Avatar person={p} size={42} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                  {p.bio && <p className="mt-0.5 text-xs text-slate-400 leading-snug break-words">{p.bio}</p>}
                </div>
                <button
                  onClick={() => onReport(p)}
                  title="Report"
                  className="p-1 rounded-lg text-slate-600 hover:text-amber-300 hover:bg-white/5 shrink-0"
                >
                  <Flag className="w-3.5 h-3.5" />
                </button>
              </div>
              {p.interests.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {p.interests.map((i) => {
                    const common = settings.interests.indexOf(i) !== -1;
                    return (
                      <span
                        key={i}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          common ? "bg-sky-500/15 text-sky-200" : "bg-white/[0.04] text-slate-400"
                        }`}
                      >
                        {i}
                      </span>
                    );
                  })}
                </div>
              )}
              <div className="mt-2.5">
                {state ? (
                  <p className="text-xs font-semibold text-emerald-300 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> {state === "friends" ? "Friends now" : "Request sent"}
                  </p>
                ) : (
                  <button
                    onClick={() => sendRequest(p)}
                    disabled={busyId === p.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white text-xs font-bold"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> {busyId === p.id ? "Sending…" : "Send friend request"}
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {loading && <p className="text-center text-xs text-slate-500 py-3">Loading…</p>}
        {hasMore && !loading && (
          <div className="flex justify-center py-2">
            <button onClick={() => load(page + 1, false)} className="text-xs text-sky-400 hover:text-sky-300 font-semibold">
              Show more people
            </button>
          </div>
        )}
      </div>

      <div className="px-4 py-2 text-[11px] text-slate-500 flex items-center gap-1.5 border-t border-white/[0.06]">
        <ShieldCheck className="w-3.5 h-3.5 text-sky-400/70 shrink-0" />
        Up to 10 requests a day from Discover. Report anyone who misuses it.
      </div>
    </div>
  );
}
