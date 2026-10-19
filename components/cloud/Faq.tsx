"use client";

import React, { useState } from 'react';
import { ChevronDown, Search, MessageCircle } from 'lucide-react';

export const Faq: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const faqs = [
    {
      q: 'Is the free tier really free forever?',
      a: 'Yes. The Starter tier is 100% free forever while active. We do not ask for a credit card, and we will never auto-bill or lock your content behind sudden paywalls. Sites inactive for 30 consecutive days are safely archived after 2 automated email reminders to free up server storage for active creators. You only pay if you choose to connect a custom .com/.in domain or require multi-site agency storage.',
      tag: 'Pricing & Guarantee',
    },
    {
      q: 'Will there be ads on my website?',
      a: 'Never. Your website is 100% clean and ad-free. Traditional free hosts inject popups, banner ads, and third-party trackers. Celoris Cloud guarantees zero ads, zero injected scripts, and zero brand watermarks on your live website.',
      tag: 'Ad-Free Policy',
    },
    {
      q: 'Can I connect my own domain later?',
      a: 'Yes! You can start on your free yourname.celoris.in subdomain right away. Whenever you purchase a custom .com, .in, or .org domain (from any registrar), you can connect it seamlessly with 1 click by upgrading to our Pro Creator tier (₹149/mo).',
      tag: 'Domains & DNS',
    },
    {
      q: 'What can I install on my website?',
      a: 'You get complete, unhindered WordPress Admin (wp-admin) access! You can install Elementor, Astra, Spectra, Gutenberg block themes, portfolio plugins, contact forms (WPForms, Fluent Forms), and standard WordPress repositories.',
      tag: 'WordPress Access',
    },
    {
      q: 'How much storage space do I get on the free plan?',
      a: 'Every free Starter account receives 3 GB of dedicated high-speed NVMe PCIe storage with server-side caching and Cloudflare edge routing. 3 GB easily accommodates thousands of high-res design screenshots, portfolios, Gutenberg block themes, and WordPress media. If you require expanded storage (15 GB+) or custom domain mapping, you can upgrade to Celoris Pro for ₹149/mo.',
      tag: 'Storage & Capacity',
    },
    {
      q: 'What happens if I don’t use or update my website for a while?',
      a: 'To guarantee that Celoris Cloud servers remain blazing-fast and protected against spam or bot abandonware, free sites follow an active-use cycle. If a site has no admin logins or updates for 7 consecutive days, it enters power-saving sleep mode to conserve VPS resources. The site owner can wake it up anytime in 1 click! If a site remains untouched for 30 consecutive days, it is safely archived after 2 automated email reminders to free up server storage for active creators. If you need 100% Always-On 24/7 uptime that never sleeps, you can upgrade to Celoris Pro for ₹149/mo.',
      tag: 'Inactivity & Lifecycle',
    },
    {
      q: 'How does Celoris Cloud keep my site fast?',
      a: 'Our cloud servers run high-performance NVMe PCIe Gen4 SSDs with Docker containerization, OPcache, and Cloudflare CDN edge caching. Our edge nodes deliver median response times of under 45ms across India, ensuring your portfolio scores 95+ on Google PageSpeed Insights.',
      tag: 'Performance & Speed',
    },
    {
      q: 'Do I get free SSL (HTTPS) protection?',
      a: 'Yes, every single subdomain created on *.celoris.in automatically receives an automated, hardware-accelerated Let’s Encrypt TLS 1.3 certificate. Your visitors and recruiters will always see the trusted secure green lock in their browser.',
      tag: 'Security & SSL',
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section id="faq" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="text-xs font-mono font-semibold text-amber-400 tracking-wider uppercase mb-2">
            Clear Answers · Zero Fine Print
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight [text-wrap:balance]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-neutral-300">
            Everything you need to know about Celoris Cloud free WordPress hosting.
          </p>

          {/* Search Bar */}
          <div className="mt-6 max-w-md mx-auto relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. SSL, Elementor, custom domain)..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-[#101010] border border-white/10 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;

            return (
              <div
                key={idx}
                className={`rounded-xl border transition-all duration-200 overflow-hidden ${
                  isOpen
                    ? 'bg-[#121212] border-amber-500/40 shadow-lg'
                    : 'bg-[#0D0D0D] border-white/[0.08] hover:border-amber-500/25'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-white">
                    {faq.q}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className="text-[11px] font-mono text-neutral-400 hidden sm:inline">
                      {faq.tag}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-amber-400' : ''
                      }`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-neutral-300 leading-relaxed border-t border-white/5 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}

          {filteredFaqs.length === 0 && (
            <div className="p-8 text-center text-neutral-400 text-sm bg-[#0D0D0D] rounded-xl border border-white/5">
              No matching questions found for "{searchQuery}". Try asking our support team below.
            </div>
          )}
        </div>

        {/* Support Help Card */}
        <div className="mt-12 p-6 rounded-2xl bg-[#0D0D0D] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">Have a specific question about your project?</h4>
              <p className="text-xs text-neutral-400">Our student success team answers questions daily in the Celoris Community.</p>
            </div>
          </div>
          <a
            href="https://wa.me/919084718101?text=Hi%20Celoris%20Cloud!%20I%20have%20a%20question%20about%20free%20WordPress%20hosting."
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 text-xs font-semibold text-amber-400 hover:text-black hover:bg-amber-400 border border-amber-500/30 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Chat on WhatsApp →</span>
          </a>
        </div>
      </div>
    </section>
  );
};
