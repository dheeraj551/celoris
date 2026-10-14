import type { Metadata } from 'next';
import Link from 'next/link';
import React from 'react';
import { ShieldCheck, AlertTriangle, Scale, Clock, Mail, ArrowLeft, ExternalLink, CheckCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Acceptable Use Policy & Abuse Reporting | Celoris Cloud',
  description:
    'Hosting Terms of Service, Acceptable Use Policy, and Grievance Officer details for Celoris Cloud in compliance with the Information Technology (Intermediary Guidelines) Rules, 2021.',
  alternates: {
    canonical: 'https://celorisdesigns.com/cloud/acceptable-use',
  },
};

export default function AcceptableUsePage() {
  return (
    <div className="min-h-screen bg-[#050505] text-neutral-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Top Bar */}
      <header className="border-b border-white/[0.08] bg-[#080808]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/cloud"
            className="flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span>Back to Celoris Cloud</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-mono font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Intermediary Compliance</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Document Header */}
        <div className="border-b border-white/[0.08] pb-10">
          <span className="text-xs font-mono font-semibold text-emerald-400 tracking-wider uppercase">
            Legal & Trust Framework
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            Hosting Terms & Acceptable Use Policy (AUP)
          </h1>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            Published pursuant to Rule 3(1) of the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021 under the Information Technology Act, 2000.
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-500">
            <span>Last Updated: October 2026</span>
            <span>·</span>
            <span>Entity: Celoris Designs LLP (LLPIN: AAP-3965)</span>
          </div>
        </div>

        {/* Rapid Notice Alert */}
        <div id="report" className="mt-10 p-5 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Notice: Zero Tolerance for Phishing, Financial Scams & Impersonation</span>
          </div>
          <p className="text-xs text-neutral-300 leading-relaxed">
            Celoris Cloud is provided strictly for educational websites, creative design portfolios, student assignments, and verified small business showcases. Any site discovered running phishing kits, banking clones, KYC fraud, payment scams, or malicious code is terminated immediately without notice, and the associated IP data is preserved for law enforcement.
          </p>
        </div>

        {/* Section Breakdown */}
        <div className="mt-12 space-y-12 text-neutral-300 text-xs sm:text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">01.</span>
              <span>Scope & Intermediary Status</span>
            </h2>
            <p>
              Celoris Cloud operates as an “Intermediary” as defined under Section 2(1)(w) of the Information Technology Act, 2000. These Hosting Terms govern all subdomains hosted under the <code className="text-emerald-300 bg-white/5 px-1.5 py-0.5 rounded">*.celoris.in</code> network and custom domains routed through Celoris Cloud infrastructure.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">02.</span>
              <span>Strictly Prohibited Uses</span>
            </h2>
            <p>Users must not host, display, upload, modify, or transmit any content that:</p>
            <ul className="space-y-2.5 pl-4 list-disc text-neutral-400">
              <li>
                <strong className="text-neutral-200">Phishing & Impersonation:</strong> Deceptive login portals, fake banking pages (SBI, HDFC, ICICI, etc.), payment/wallet clones (Paytm, PhonePe, Google Pay), government service clones (Aadhaar, PAN, Income Tax), or brand impersonation.
              </li>
              <li>
                <strong className="text-neutral-200">Financial Fraud & Deception:</strong> Unauthorized investment schemes, Ponzi/MLM scams, cryptocurrency fraud, gambling, or deceptive prize giveaways.
              </li>
              <li>
                <strong className="text-neutral-200">Malware & Botnets:</strong> Distributing malicious payloads, ransomware, trojans, keyloggers, or acting as command-and-control nodes.
              </li>
              <li>
                <strong className="text-neutral-200">Spam & Mail Abuse:</strong> Bulk unsolicited emails, transactional relay attacks, or running unauthorized email dispatchers.
              </li>
              <li>
                <strong className="text-neutral-200">Harmful / Illegal Content:</strong> Child Sexual Abuse Material (CSAM), non-consensual intimate imagery, hate speech inciting violence, or content threatening the sovereignty or integrity of India.
              </li>
              <li>
                <strong className="text-neutral-200">Intellectual Property Infringement:</strong> Pirated software, unlicensed digital assets, or counterfeit brand representations.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">03.</span>
              <span>Grievance Officer & Takedown SLA</span>
            </h2>
            <p>
              In accordance with the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, Celoris Designs LLP has designated a Grievance Officer to address abuse reports, copyright notices, and law enforcement requests.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase font-mono">
                  <Clock className="w-4 h-4" />
                  <span>Enforcement Timelines</span>
                </div>
                <ul className="space-y-1.5 text-xs text-neutral-400">
                  <li>• Acknowledgement of complaint: <strong className="text-white">Within 24 Hours</strong></li>
                  <li>• Investigation & Takedown: <strong className="text-white">Within 36 Hours</strong></li>
                  <li>• CSAM / Urgent security threats: <strong className="text-rose-400">Immediate Termination</strong></li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-[#0A0A0A] border border-white/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase font-mono">
                  <Mail className="w-4 h-4" />
                  <span>Grievance Contacts</span>
                </div>
                <div className="text-xs space-y-1 text-neutral-400">
                  <p>Abuse Inquiries: <a href="mailto:abuse@celorisdesigns.com" className="text-emerald-400 hover:underline">abuse@celorisdesigns.com</a></p>
                  <p>Grievance Officer: <a href="mailto:grievance@celorisdesigns.com" className="text-emerald-400 hover:underline">grievance@celorisdesigns.com</a></p>
                  <p className="text-[11px] text-neutral-500 pt-1">Entity: Celoris Designs LLP · Uttar Pradesh, India</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="text-emerald-400 font-mono">04.</span>
              <span>Inactivity & Recycling Policy</span>
            </h2>
            <p>
              To maintain cloud hardware health and optimize storage on our NVMe servers, free tier websites follow an active-use cycle:
            </p>
            <ul className="space-y-1.5 pl-4 list-disc text-neutral-400 text-xs sm:text-sm">
              <li>Free sites with no updates or logins for <strong className="text-neutral-200">7 days</strong> enter power-saving sleep mode. The owner can wake it up in 1 click from their account.</li>
              <li>Free sites untouched for <strong className="text-neutral-200">30 days</strong> are safely archived after 2 automated email reminders, and the subdomain is released.</li>
              <li>Upgrading to Celoris Pro (₹149/mo) provides <strong className="text-emerald-400">100% Always-On 24/7</strong> uptime with zero sleep cycles.</li>
            </ul>
          </section>
        </div>

        {/* Reporting Action Box */}
        <div className="mt-14 p-6 rounded-2xl bg-[#0A0A0A] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-bold text-white">Need to report a phishing or infringing subsite?</h3>
            <p className="text-xs text-neutral-400 mt-0.5">Please provide the exact subdomain URL and a description of the violation.</p>
          </div>
          <a
            href="mailto:abuse@celorisdesigns.com?subject=Abuse%20Report%20-%20Celoris%20Cloud"
            className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shrink-0 whitespace-nowrap"
          >
            Submit Abuse Report →
          </a>
        </div>
      </main>
    </div>
  );
}
