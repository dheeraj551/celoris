import React, { useEffect, useState } from 'react';
import { X, Send, CheckCircle2, Briefcase, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';

// "Post a Project" form for the Job Center. Sends the brief to the Celoris
// support team (see app/api/job-center/post-project), who follow up with the
// poster and list it.

const PROJECT_TYPES = [
  'Video editing',
  'Web development',
  'Mobile app',
  'Graphic design',
  'Digital marketing',
  '3D / animation',
  'AI / automation',
  'Other',
];
const BUDGETS = ['Under ₹5,000', '₹5,000 – ₹20,000', '₹20,000 – ₹50,000', '₹50,000 – ₹1,00,000', 'Above ₹1,00,000', 'Not sure yet'];
const WORK_MODES = ['Remote', 'On-site', 'Hybrid'];

interface Props {
  open: boolean;
  onClose: () => void;
}

const EMPTY = {
  name: '',
  email: '',
  phone: '',
  company: '',
  title: '',
  projectType: '',
  budget: '',
  timeline: '',
  workMode: 'Remote',
  location: '',
  skills: '',
  description: '',
  referenceLink: '',
  website_url: '', // honeypot
};

const inputCls =
  'w-full rounded-xl border border-white/[0.1] bg-[#131622] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all';
const labelCls = 'block text-xs font-bold text-slate-300 mb-1.5';

export const PostProjectModal: React.FC<Props> = ({ open, onClose }) => {
  const { user, profile } = useAuth();
  const [form, setForm] = useState(EMPTY);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  // Prefill name/email for signed-in users.
  useEffect(() => {
    if (!open) return;
    setForm((f) => ({
      ...f,
      name: f.name || profile?.full_name || (user?.user_metadata as any)?.full_name || '',
      email: f.email || user?.email || '',
    }));
  }, [open, user, profile]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const close = () => {
    onClose();
    if (sent) {
      setSent(false);
      setForm(EMPTY);
    }
    setError(null);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending) return;
    setSending(true);
    setError(null);
    try {
      const res = await fetch('/api/job-center/post-project', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.error || 'Could not send your project. Please try again.');
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-6" onClick={close}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="post-project-title"
        className="w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-2xl bg-[#0c0e17] shadow-2xl border border-white/[0.12] text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-5 py-4 border-b border-white/[0.08] bg-[#121522]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Briefcase className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 id="post-project-title" className="text-base font-bold text-white">
                Post a Project
              </h2>
              <p className="text-xs text-slate-400">Tell us what you need. Our team will review it and get back to you.</p>
            </div>
          </div>
          <button onClick={close} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-12 text-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="mt-3 text-lg font-bold text-white">Project sent!</h3>
            <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
              The Celoris team has your project details and will contact you at {form.email} soon.
            </p>
            <button onClick={close} className="mt-6 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black text-sm font-extrabold shadow-lg shadow-emerald-500/20">
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="px-5 py-5 space-y-5">
            {/* Honeypot (hidden from people) */}
            <input
              type="text"
              name="website_url"
              value={form.website_url}
              onChange={set('website_url')}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            <section className="space-y-3">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-emerald-400">Project details</h3>
              <div>
                <label className={labelCls} htmlFor="pp-title">
                  Project title *
                </label>
                <input id="pp-title" required maxLength={150} value={form.title} onChange={set('title')} placeholder="e.g. Edit 10 Instagram Reels for our brand" className={inputCls} />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} htmlFor="pp-type">
                    Project type *
                  </label>
                  <select id="pp-type" required value={form.projectType} onChange={set('projectType')} className={inputCls}>
                    <option value="">Select…</option>
                    {PROJECT_TYPES.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="pp-budget">
                    Budget
                  </label>
                  <select id="pp-budget" value={form.budget} onChange={set('budget')} className={inputCls}>
                    <option value="">Select…</option>
                    {BUDGETS.map((b) => (
                      <option key={b}>{b}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls} htmlFor="pp-timeline">
                    Timeline / deadline
                  </label>
                  <input id="pp-timeline" maxLength={100} value={form.timeline} onChange={set('timeline')} placeholder="e.g. 2 weeks, by 15 Oct" className={inputCls} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="pp-mode">
                    Work mode
                  </label>
                  <select id="pp-mode" value={form.workMode} onChange={set('workMode')} className={inputCls}>
                    {WORK_MODES.map((m) => (
                      <option key={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
              {form.workMode !== 'Remote' && (
                <div>
                  <label className={labelCls} htmlFor="pp-location">
                    Location
                  </label>
                  <input id="pp-location" maxLength={120} value={form.location} onChange={set('location')} placeholder="City / area" className={inputCls} />
                </div>
              )}
              <div>
                <label className={labelCls} htmlFor="pp-skills">
                  Skills needed
                </label>
                <input id="pp-skills" maxLength={300} value={form.skills} onChange={set('skills')} placeholder="e.g. Premiere Pro, CapCut, motion graphics" className={inputCls} />
              </div>
              <div>
                <label className={labelCls} htmlFor="pp-desc">
                  Description *
                </label>
                <textarea
                  id="pp-desc"
                  required
                  minLength={20}
                  maxLength={5000}
                  rows={5}
                  value={form.description}
                  onChange={set('description')}
                  placeholder="What needs to be done, deliverables, style, anything the freelancer should know…"
                  className={`${inputCls} resize-y`}
                />
              </div>
              <div>
                <label className={labelCls} htmlFor="pp-link">
                  Reference link
                </label>
                <input id="pp-link" type="url" maxLength={500} value={form.referenceLink} onChange={set('referenceLink')} placeholder="https://… (brief, examples, drive folder)" className={inputCls} />
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-emerald-400">Your details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className={labelCls} htmlFor="pp-name">
                    Your name *
                  </label>
                  <input id="pp-name" required maxLength={100} value={form.name} onChange={set('name')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="pp-company">
                    Company / brand
                  </label>
                  <input id="pp-company" maxLength={150} value={form.company} onChange={set('company')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="pp-email">
                    Email *
                  </label>
                  <input id="pp-email" type="email" required maxLength={200} value={form.email} onChange={set('email')} className={inputCls} />
                </div>
                <div>
                  <label className={labelCls} htmlFor="pp-phone">
                    Phone
                  </label>
                  <input id="pp-phone" type="tel" maxLength={30} value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" className={inputCls} />
                </div>
              </div>
            </section>

            {error && <p className="text-sm text-rose-300 bg-rose-500/10 border border-rose-500/30 rounded-xl px-3 py-2">{error}</p>}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button type="button" onClick={close} className="px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] text-sm font-semibold transition-colors">
                Cancel
              </button>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-60 text-black text-sm font-extrabold shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02]"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {sending ? 'Sending…' : 'Send to Celoris'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
