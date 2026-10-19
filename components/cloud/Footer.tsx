import React from 'react';
import Link from 'next/link';
import { CelorisLogo } from './CelorisLogo';
import { ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#030303] border-t border-white/[0.08] text-neutral-400 text-xs py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.06]">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <a href="#" className="inline-block">
              <CelorisLogo size="md" />
            </a>
            <p className="text-neutral-400 text-xs leading-relaxed max-w-sm">
              High-speed, ad-free managed WordPress cloud hosting built specifically for Indian students, design learners, freshers, and solo creators.
            </p>
            <div className="flex items-center gap-2 text-neutral-400 text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>All Cloud Systems Operational · Asia-South1 (Mumbai)</span>
            </div>
            <div className="pt-2 text-neutral-400 text-[11px]">
              A product initiative by{' '}
              <a
                href="https://celorisdesigns.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 font-semibold inline-flex items-center gap-1"
              >
                <span>Celoris Designs LLP</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Hosting Column */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Cloud Hosting
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
                  High-Speed NVMe Cloud
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
                  1-Click WordPress Deploy
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-amber-400 transition-colors">
                  Free Active Subdomains
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-amber-400 transition-colors">
                  Why Celoris Cloud?
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-amber-400 transition-colors">
                  Custom Domain Connect
                </a>
              </li>
            </ul>
          </div>

          {/* Education & Community */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Learners & Community
            </div>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/classrooms"
                  className="hover:text-amber-400 transition-colors flex items-center gap-1"
                >
                  <span>Celoris Live Classes</span>
                </Link>
              </li>
              <li>
                <a href="#faq" className="hover:text-amber-400 transition-colors">
                  Student FAQ
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-amber-400 transition-colors">
                  How Deployment Works
                </a>
              </li>
              <li>
                <Link href="/courses" className="hover:text-amber-400 transition-colors">
                  Design &amp; Code Courses
                </Link>
              </li>
              <li>
                <Link href="/open-psd-online" className="text-amber-400/90 hover:text-amber-300 font-medium transition-colors">
                  Open PSD Online (Free)
                </Link>
              </li>
              <li>
                <Link href="/free-image-editor" className="hover:text-amber-400 transition-colors">
                  Free Image Editor
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <div className="text-xs font-semibold text-white uppercase tracking-wider font-mono">
              Trust & Legal
            </div>
            <ul className="space-y-2">
              <li>
                <span className="text-amber-400 font-medium">100% Ad-Free Guarantee</span>
              </li>
              <li>
                <span className="text-neutral-400">Zero Auto-Debit Policy</span>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-amber-400 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/cloud/acceptable-use" className="hover:text-amber-400 transition-colors">
                  Acceptable Use Policy
                </Link>
              </li>
              <li>
                <a href="mailto:abuse@celorisdesigns.com" className="text-rose-400 hover:text-rose-300 transition-colors">
                  Report Abuse
                </a>
              </li>
              <li>
                <Link href="/terms" className="hover:text-amber-400 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/refund-policy" className="hover:text-amber-400 transition-colors">
                  Refund & Cancellation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <div>
            © {new Date().getFullYear()} Celoris Designs LLP. Built with pride for Indian creators & students.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-amber-400 transition-colors">
              celorisdesigns.com
            </Link>
            <span>·</span>
            <span className="text-neutral-400">cloud.celoris.in</span>
            <span>·</span>
            <span className="text-neutral-400">High-Speed NVMe Cloud</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
