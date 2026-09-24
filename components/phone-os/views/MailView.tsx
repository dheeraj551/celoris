"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  ChevronLeft, 
  Briefcase, 
  Wallet, 
  GraduationCap, 
  ShieldCheck, 
  ArrowUpRight, 
  CheckCircle2, 
  ExternalLink,
  Reply,
  Trash2,
  Clock
} from 'lucide-react';
import { INITIAL_EMAILS } from '../data';
import { EmailItem } from '../types';
import Link from 'next/link';

interface MailViewProps {
  onBack: () => void;
  onClose: () => void;
}

export function MailView({ onBack, onClose }: MailViewProps) {
  const [emails, setEmails] = useState<EmailItem[]>(INITIAL_EMAILS);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'offers'>('all');

  const unreadCount = emails.filter(e => !e.read).length;

  const handleSelectEmail = (email: EmailItem) => {
    setSelectedEmail(email);
    // Mark as read
    setEmails(prev => prev.map(e => e.id === email.id ? { ...e, read: true } : e));
  };

  const filteredEmails = emails.filter(email => {
    if (filter === 'unread') return !email.read;
    if (filter === 'offers') return email.senderType === 'employer' || email.senderType === 'freelancer';
    return true;
  });

  const getSenderBadge = (type: EmailItem['senderType']) => {
    switch (type) {
      case 'employer':
        return { label: 'Job Alert', bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30', icon: Briefcase };
      case 'freelancer':
        return { label: 'Escrow Paid', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', icon: Wallet };
      case 'academy':
        return { label: 'Classroom', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30', icon: GraduationCap };
      default:
        return { label: 'Official', bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30', icon: ShieldCheck };
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#07090e] text-white select-none">
      <AnimatePresence mode="wait">
        {!selectedEmail ? (
          // ================= VIEW: INBOX LIST =================
          <motion.div
            key="mail-inbox"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Mail Header */}
            <div className="px-3 py-2.5 bg-[#0d1017] border-b border-white/[0.08] flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onBack}
                  className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Back to Home Screen"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold tracking-tight text-white">Mailbox</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full bg-blue-500 text-[9px] font-bold text-white font-mono">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </div>

              <span className="text-[9px] text-slate-400 font-mono">inbox@celoris</span>
            </div>

            {/* Filter Pills */}
            <div className="px-3 py-1.5 bg-[#0b0e14] border-b border-white/[0.04] flex items-center gap-1.5">
              {[
                { id: 'all', label: 'All Mail' },
                { id: 'unread', label: `Unread (${unreadCount})` },
                { id: 'offers', label: 'Gigs & Escrow' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id as any)}
                  className={`px-2 py-0.5 rounded-full text-[9px] font-medium transition-colors ${
                    filter === tab.id
                      ? 'bg-blue-600 text-white font-bold'
                      : 'bg-white/[0.04] text-slate-400 hover:bg-white/[0.08] hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Email List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04] custom-scrollbar">
              {filteredEmails.map(email => {
                const badge = getSenderBadge(email.senderType);
                const BadgeIcon = badge.icon;
                return (
                  <motion.div
                    key={email.id}
                    whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.03)' }}
                    onClick={() => handleSelectEmail(email)}
                    className="p-3 cursor-pointer transition-colors relative group"
                  >
                    <div className="flex items-start justify-between gap-1 mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        {!email.read && (
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0 shadow-[0_0_6px_rgba(59,130,246,0.8)]" />
                        )}
                        <span className={`text-[11px] truncate ${!email.read ? 'font-bold text-white' : 'font-medium text-slate-300'}`}>
                          {email.senderName}
                        </span>
                      </div>
                      <span className="text-[8.5px] text-slate-500 font-mono shrink-0">{email.time}</span>
                    </div>

                    <p className={`text-[10px] leading-snug mb-1 truncate ${!email.read ? 'font-bold text-blue-200' : 'text-slate-200'}`}>
                      {email.subject}
                    </p>

                    <p className="text-[9px] text-slate-400 line-clamp-1 leading-normal mb-1.5">
                      {email.preview}
                    </p>

                    <div className="flex items-center gap-1.5">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[8px] font-semibold border ${badge.bg}`}>
                        <BadgeIcon className="w-2.5 h-2.5" />
                        <span>{badge.label}</span>
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Mailbox Footer */}
            <div className="p-2 bg-[#0d1017] border-t border-white/[0.06] text-center text-[9px] text-slate-500 font-mono">
              Synced with Celoris Node • 4 active threads
            </div>
          </motion.div>
        ) : (
          // ================= VIEW: EMAIL DETAIL =================
          <motion.div
            key="mail-detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex-1 flex flex-col min-h-0 bg-[#080a10]"
          >
            {/* Detail Top Bar */}
            <div className="px-3 py-2 bg-[#0e121a] border-b border-white/[0.08] flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedEmail(null)}
                className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 font-medium cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Inbox</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-[9px] text-slate-400 font-mono">{selectedEmail.time}</span>
              </div>
            </div>

            {/* Email Header Details */}
            <div className="p-3 border-b border-white/[0.06] bg-white/[0.01]">
              <h3 className="text-xs font-bold text-white leading-snug mb-2">
                {selectedEmail.subject}
              </h3>

              <div className="flex items-center justify-between text-[10px]">
                <div>
                  <span className="font-bold text-white block">{selectedEmail.senderName}</span>
                  <span className="text-[9px] text-slate-400 font-mono">{selectedEmail.senderRole}</span>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[8.5px] font-bold border ${getSenderBadge(selectedEmail.senderType).bg}`}>
                  {getSenderBadge(selectedEmail.senderType).label}
                </span>
              </div>
            </div>

            {/* Email Content Body */}
            <div className="flex-1 overflow-y-auto p-3 text-[10.5px] text-slate-200 leading-relaxed space-y-3 whitespace-pre-line custom-scrollbar">
              {selectedEmail.body}
            </div>

            {/* Direct Action Bar */}
            {selectedEmail.actionHref && (
              <div className="p-3 bg-[#0d1017] border-t border-white/[0.08] space-y-2">
                {selectedEmail.actionType === 'chat' || (selectedEmail.actionType as any) === 'whatsapp' ? (
                  <a
                    href={selectedEmail.actionHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-bold text-[11px] transition-transform hover:scale-[1.02] active:scale-98 shadow-md"
                  >
                    <span>{selectedEmail.actionText || 'Connect on WhatsChat'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <Link
                    href={selectedEmail.actionHref}
                    onClick={onClose}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-[11px] transition-transform hover:scale-[1.02] active:scale-98 shadow-md"
                  >
                    <span>{selectedEmail.actionText || 'View Details'}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </Link>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedEmail(null)}
                  className="w-full py-1 text-center text-[10px] text-slate-400 hover:text-white transition-colors"
                >
                  Return to Inbox
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
