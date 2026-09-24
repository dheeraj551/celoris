"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  ChevronLeft, 
  Send, 
  Loader2, 
  Phone, 
  HelpCircle, 
  CheckCircle2, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { WHATSAPP_SUPPORT_NUMBER } from '../data';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

type Intent = 'student' | 'teacher' | 'jobseeker' | 'customer' | null;
type SupportSubTab = 'chat' | 'lead' | 'faq';

const GREETING: ChatMessage = {
  role: 'assistant',
  content: "Hi! I'm Celoris Support 👋 To point you the right way fastest, which of these best describes you? (Or just type your question below.)",
};

const INTENT_OPTIONS: { key: Exclude<Intent, null>; label: string; seed: string }[] = [
  { key: 'student', label: "🎓 I'm a student", seed: "I'm a student looking to learn something new." },
  { key: 'teacher', label: "🧑‍🏫 I'm a teacher", seed: "I'm a teacher and want to know about teaching on Celoris." },
  { key: 'jobseeker', label: "💼 Looking for a job", seed: "I'm looking for a job or freelance work." },
  { key: 'customer', label: "👋 Existing customer", seed: "I'm already a Celoris customer." },
];

const FAQ_ITEMS = [
  {
    q: "Are the creative tools and courses really free?",
    a: "Students can start free, and no card is needed to sign up. Recorded courses, the job portal and all exams are free; premium AI tools and professional live classes use credits or a paid plan.",
  },
  {
    q: "How do I get hired through Job Center?",
    a: "Browse verified job postings in Job Center, complete quick skill assessments, and connect directly with clients without middleman commissions.",
  },
  {
    q: "Can I become an instructor and teach on Celoris?",
    a: "Yes! Anyone with creative or tech skills can apply under 'Teach'. We help publish your course and monetize your expertise.",
  },
  {
    q: "What is Celoris TV?",
    a: "Celoris TV is our lecture library: watch recorded classes and tutorials on demand, build your own study queue, and ask questions under each lecture.",
  },
];

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function buildWhatsAppLink(messages: ChatMessage[]): string {
  const lastUserMessage = [...messages].reverse().find(m => m.role === "user")?.content;
  const text = lastUserMessage
    ? `Hi! I was chatting with Celoris Support and wanted to continue here. My question: ${lastUserMessage}`
    : "Hi! I'd like to know more about Celoris.";
  return `https://wa.me/${WHATSAPP_SUPPORT_NUMBER}?text=${encodeURIComponent(text)}`;
}

interface SupportViewProps {
  onBack: () => void;
  onClose: () => void;
}

export function SupportView({ onBack, onClose }: SupportViewProps) {
  const [subTab, setSubTab] = useState<SupportSubTab>('chat');
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING]);
  const [intent, setIntent] = useState<Intent>(null);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [leadData, setLeadData] = useState({ name: '', email: '', phone: '', message: '' });
  const [leadSending, setLeadSending] = useState(false);
  const [leadSent, setLeadSent] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current && subTab === 'chat') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, subTab]);

  const showIntentOptions = intent === null && messages.length === 1;

  const sendMessage = async (text: string, effectiveIntent: Intent) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }];
    setMessages(nextMessages);
    setSending(true);

    setMessages(prev => [...prev, { role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/support-bot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages, intent: effectiveIntent }),
      });

      if (!res.ok || !res.body) {
        throw new Error('Support bot request failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        full += decoder.decode(value, { stream: true });
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: full };
          return updated;
        });
      }
    } catch (err) {
      setMessages(prev => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, I ran into a problem answering that. Please try again, or reach us below by WhatsApp or email.',
        };
        return updated;
      });
    } finally {
      setSending(false);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed) return;
    setInput('');
    await sendMessage(trimmed, intent);
  };

  const handleIntentSelect = async (option: (typeof INTENT_OPTIONS)[number]) => {
    setIntent(option.key);
    await sendMessage(option.seed, option.key);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.name || !leadData.email) return;
    setLeadSending(true);

    try {
      const res = await fetch('/api/support-bot/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...leadData, transcript: messages }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || 'Something went wrong. Please try again later.');
      }

      setLeadSent(true);
      toast({
        title: 'Callback Scheduled!',
        description: 'Our team will contact you shortly.',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: err instanceof Error ? err.message : 'Something went wrong. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setLeadSending(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#07090e] text-white select-none">
      {/* Top Header */}
      <div className="px-3 py-2.5 bg-[#0e111a] border-b border-white/[0.08] flex items-center justify-between shadow-sm">
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
            <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Bot className="w-3.5 h-3.5" />
            </div>
            <div>
              <span className="text-xs font-bold tracking-tight text-white block">Celoris Support</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[8.5px] font-mono">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>AI Online</span>
        </div>
      </div>

      {/* Sub Tabs: AI Chat | Call Back | FAQ */}
      <div className="px-3 py-1.5 bg-[#090c13] border-b border-white/[0.06] flex items-center gap-1">
        {[
          { id: 'chat', label: 'AI Chat', icon: MessageSquare },
          { id: 'lead', label: 'Call Back', icon: Phone },
          { id: 'faq', label: 'Help & FAQ', icon: HelpCircle },
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setSubTab(tab.id as any)}
              className={`flex-1 py-1 px-2 rounded-lg text-[9.5px] font-medium transition-colors flex items-center justify-center gap-1 ${
                subTab === tab.id
                  ? 'bg-emerald-600 text-white font-bold shadow-sm'
                  : 'bg-white/[0.03] text-slate-400 hover:bg-white/[0.07] hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* VIEW 1: AI STREAMING CHAT */}
      {subTab === 'chat' && (
        <div className="flex-1 flex flex-col min-h-0">
          <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-2 custom-scrollbar">
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3 py-1.5 text-[11px] leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-br-xs shadow-md'
                      : 'bg-white/[0.06] border border-white/[0.08] text-neutral-200 rounded-bl-xs'
                  }`}
                >
                  {m.content || (
                    <span className="inline-flex gap-1 py-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" />
                    </span>
                  )}
                </div>
              </motion.div>
            ))}

            {showIntentOptions && (
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {INTENT_OPTIONS.map(option => (
                  <button
                    key={option.key}
                    onClick={() => handleIntentSelect(option)}
                    disabled={sending}
                    className="text-left text-[9.5px] rounded-xl border border-white/10 bg-white/[0.04] p-1.5 text-neutral-300 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* WhatsApp Escalation Bar */}
          <div className="px-3 py-1 bg-black/40 border-t border-white/5 flex items-center justify-between text-[9.5px]">
            <button
              type="button"
              onClick={() => setSubTab('lead')}
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
            >
              Request call
            </button>
            <a
              href={buildWhatsAppLink(messages)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#25D366] hover:text-[#20bc5a] font-medium"
            >
              <WhatsAppIcon className="h-3 w-3" />
              <span>WhatsApp agent</span>
            </a>
          </div>

          {/* Chat Form */}
          <form onSubmit={handleSend} className="p-2 border-t border-white/[0.08] flex items-center gap-1.5 bg-[#06070a]">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Celoris AI anything..."
              className="bg-white/[0.04] border-white/10 text-white text-[11px] h-8 rounded-full px-3 focus-visible:ring-emerald-500/50"
              disabled={sending}
            />
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.4)]"
              disabled={sending || !input.trim()}
            >
              {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
            </Button>
          </form>
        </div>
      )}

      {/* VIEW 2: REQUEST CALLBACK FORM */}
      {subTab === 'lead' && (
        <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
          {leadSent ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-2.5 py-6">
              <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.4)]">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-white">Callback Scheduled!</p>
              <p className="text-[10px] text-neutral-400 max-w-[200px]">
                Our team will contact you shortly at {leadData.email || leadData.phone}.
              </p>
              <Button
                size="sm"
                variant="outline"
                className="mt-1 h-7 text-[10px] rounded-full border-white/20 text-white hover:bg-white/10"
                onClick={() => { setSubTab('chat'); setLeadSent(false); }}
              >
                Back to Chat
              </Button>
            </div>
          ) : (
            <form onSubmit={handleLeadSubmit} className="space-y-2">
              <a
                href={buildWhatsAppLink(messages)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[#25D366] hover:bg-[#20bc5a] text-black font-bold text-[11px] transition-colors shadow-md"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" />
                <span>Instant WhatsApp Chat</span>
              </a>

              <div className="flex items-center gap-2 py-0.5">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[8.5px] text-neutral-400 uppercase tracking-widest font-mono">or direct callback</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="support-lead-name" className="text-neutral-300 text-[10px]">Your Name</Label>
                <Input
                  id="support-lead-name"
                  required
                  placeholder="John Doe"
                  className="bg-white/[0.04] border-white/10 text-white h-7.5 text-[11px] rounded-lg"
                  value={leadData.name}
                  onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="support-lead-email" className="text-neutral-300 text-[10px]">Email</Label>
                <Input
                  id="support-lead-email"
                  type="email"
                  required
                  placeholder="you@email.com"
                  className="bg-white/[0.04] border-white/10 text-white h-7.5 text-[11px] rounded-lg"
                  value={leadData.email}
                  onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="support-lead-phone" className="text-neutral-300 text-[10px]">Phone (optional)</Label>
                <Input
                  id="support-lead-phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="bg-white/[0.04] border-white/10 text-white h-7.5 text-[11px] rounded-lg"
                  value={leadData.phone}
                  onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="support-lead-msg" className="text-neutral-300 text-[10px]">How can we help?</Label>
                <Textarea
                  id="support-lead-msg"
                  placeholder="Courses, tools, or partnerships..."
                  className="bg-white/[0.04] border-white/10 text-white text-[11px] min-h-[46px] rounded-lg resize-none"
                  value={leadData.message}
                  onChange={(e) => setLeadData({ ...leadData, message: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                disabled={leadSending}
                className="w-full h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-[11px] shadow-lg cursor-pointer"
              >
                {leadSending ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Scheduling...
                  </span>
                ) : 'Request Callback'}
              </Button>
            </form>
          )}
        </div>
      )}

      {/* VIEW 3: FAQ ACCORDION */}
      {subTab === 'faq' && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
          {FAQ_ITEMS.map((item, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] transition-colors cursor-pointer"
              onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
            >
              <div className="flex items-center justify-between gap-1.5">
                <p className="text-[11px] font-bold text-white leading-snug">{item.q}</p>
                {expandedFaq === idx ? (
                  <ChevronUp className="w-3 h-3 text-neutral-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-3 h-3 text-neutral-400 shrink-0" />
                )}
              </div>
              {expandedFaq === idx && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-[10px] text-neutral-300 leading-relaxed mt-1.5 pt-1.5 border-t border-white/5"
                >
                  {item.a}
                </motion.p>
              )}
            </div>
          ))}

          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setSubTab('chat')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-medium hover:bg-emerald-500/25 transition-colors cursor-pointer"
            >
              <Bot className="w-3 h-3" />
              <span>Ask Celoris AI Assistant</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
