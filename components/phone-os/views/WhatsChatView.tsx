"use client";

// Phone OS → Celoris Chat launcher.
// Shows the signed-in user's real friends (from /api/celoris-chat/me, only
// fetched when this app is opened) and opens the full chat at /chat. The
// Helpdesk row is Celoris's official WhatsApp Business support number.

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, HelpCircle, MessagesSquare, ShieldCheck, UserPlus, ArrowUpRight, ExternalLink } from 'lucide-react';
import { WHATSAPP_SUPPORT_NUMBER } from '../data';

interface WhatsChatViewProps {
  onBack: () => void;
  onClose: () => void;
}

interface FriendPreview {
  id: string;
  name: string;
  avatarUrl: string | null;
  lastMessage: { body: string; at: string; fromMe: boolean } | null;
  unread: number;
}

type LoadState =
  | { kind: 'loading' }
  | { kind: 'signed-out' }
  | { kind: 'error' }
  | { kind: 'ready'; friends: FriendPreview[]; requests: number; shareCode: string };

function initials(name: string) {
  return name.split(/\s+/).filter(Boolean).slice(0, 2).map(w => w[0]?.toUpperCase()).join('') || 'C';
}

function shortTime(iso: string) {
  const d = new Date(iso);
  return d.toDateString() === new Date().toDateString()
    ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}

export function WhatsChatView({ onBack, onClose }: WhatsChatViewProps) {
  const [state, setState] = useState<LoadState>({ kind: 'loading' });

  useEffect(() => {
    let cancelled = false;
    fetch('/api/celoris-chat/me', { cache: 'no-store' })
      .then(async res => {
        if (cancelled) return;
        if (res.status === 401) return setState({ kind: 'signed-out' });
        if (!res.ok) return setState({ kind: 'error' });
        const d = await res.json();
        setState({ kind: 'ready', friends: (d.friends || []).slice(0, 6), requests: (d.incoming || []).length, shareCode: d.me?.shareCode || '' });
      })
      .catch(() => !cancelled && setState({ kind: 'error' }));
    return () => {
      cancelled = true;
    };
  }, []);

  const openHelpdesk = () => {
    const url = `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent('Hi Celoris Team! I would like some help.')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#0a101c] text-white select-none">
      {/* App bar */}
      <div className="px-3 py-2.5 bg-[#101a2c] border-b border-white/[0.08] flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Back to Home Screen"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div>
            <span className="text-xs font-bold tracking-tight text-sky-400">Celoris Chat</span>
            <p className="text-[9px] text-slate-400">Private chats with your friends</p>
          </div>
        </div>
        {state.kind === 'ready' && (
          <Link
            href="/chat"
            onClick={onClose}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-sky-500 to-blue-500 text-black text-[10px] font-bold"
          >
            <UserPlus className="w-2.5 h-2.5" /> Add
          </Link>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {state.kind === 'loading' && (
          <div className="p-3 space-y-2">
            {[0, 1, 2].map(i => (
              <div key={i} className="h-11 rounded-xl bg-white/[0.04] animate-pulse" />
            ))}
          </div>
        )}

        {state.kind === 'signed-out' && (
          <div className="px-4 py-6 text-center">
            <div className="w-11 h-11 mx-auto rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
              <MessagesSquare className="w-5 h-5 text-white" />
            </div>
            <p className="mt-3 text-[12px] font-bold">Chat with your batchmates</p>
            <p className="mt-1 text-[10px] text-slate-400 leading-relaxed">
              Every member gets a share code. Swap codes with a friend and chat privately once they accept.
            </p>
            <Link
              href="/login"
              onClick={onClose}
              className="mt-3 inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-[11px] font-bold"
            >
              Sign in to start chatting
            </Link>
          </div>
        )}

        {state.kind === 'error' && (
          <p className="px-4 py-6 text-center text-[10.5px] text-slate-400">Couldn’t load your chats right now.</p>
        )}

        {state.kind === 'ready' && (
          <>
            {state.requests > 0 && (
              <Link
                href="/chat"
                onClick={onClose}
                className="mx-3 mt-2.5 flex items-center justify-between rounded-xl border border-sky-500/30 bg-sky-500/10 px-3 py-2 text-[10.5px]"
              >
                <span className="font-bold text-sky-200">
                  {state.requests} friend request{state.requests > 1 ? 's' : ''} waiting
                </span>
                <ArrowUpRight className="w-3 h-3 text-sky-300" />
              </Link>
            )}

            {state.friends.length === 0 ? (
              <div className="px-4 py-5 text-center">
                <p className="text-[11px] font-bold">No friends yet</p>
                <p className="mt-1 text-[10px] text-slate-400">Your code</p>
                <p className="font-mono text-[13px] font-extrabold tracking-wider text-sky-300">{state.shareCode}</p>
                <p className="mt-1 text-[9.5px] text-slate-500">Share it with a batchmate to start chatting.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04] mt-1">
                {state.friends.map(f => (
                  <Link
                    key={f.id}
                    href="/chat"
                    onClick={onClose}
                    className="p-2.5 flex items-center gap-2.5 hover:bg-white/[0.04] transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold shrink-0">
                      {initials(f.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold truncate">{f.name}</span>
                        {f.lastMessage && <span className="text-[9px] text-slate-400 font-mono shrink-0">{shortTime(f.lastMessage.at)}</span>}
                      </div>
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-[9.5px] text-slate-300 truncate">
                          {f.lastMessage ? `${f.lastMessage.fromMe ? 'You: ' : ''}${f.lastMessage.body}` : 'Say hi 👋'}
                        </p>
                        {f.unread > 0 && (
                          <span className="min-w-4 h-4 px-1 rounded-full bg-sky-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
                            {f.unread}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}

        {/* Official helpdesk (WhatsApp Business) */}
        <div className="px-3 pt-3 pb-2">
          <p className="text-[9px] font-mono uppercase tracking-wider text-slate-500 mb-1">Need help?</p>
          <button
            type="button"
            onClick={openHelpdesk}
            className="w-full p-2.5 flex items-center gap-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] text-left"
          >
            <div className="w-9 h-9 rounded-full bg-teal-600 flex items-center justify-center shrink-0">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1">
                <span className="text-[11px] font-bold">Celoris Official Helpdesk</span>
                <ShieldCheck className="w-3 h-3 text-sky-400" />
              </div>
              <p className="text-[9.5px] text-slate-400">Opens our official WhatsApp Business</p>
            </div>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="p-2.5 bg-[#101a2c] border-t border-white/[0.08]">
        <Link
          href="/chat"
          onClick={onClose}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-extrabold text-[11px]"
        >
          <MessagesSquare className="w-3.5 h-3.5" />
          <span>Open Celoris Chat</span>
        </Link>
      </div>
    </div>
  );
}
