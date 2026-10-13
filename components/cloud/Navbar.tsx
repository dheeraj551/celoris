"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, LogIn, LogOut, LayoutDashboard, Briefcase, User as UserIcon } from 'lucide-react';
import { CelorisLogo } from './CelorisLogo';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface NavbarProps {
  onClaimClick: (subdomain?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onClaimClick }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const { user, profile, loading, signOut } = useAuth();

  const navItems = [
    { id: 'infrastructure', label: 'Infrastructure' },
    { id: 'comparison', label: 'Why Celoris' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'pricing', label: 'Pricing' },
    { id: 'faq', label: 'FAQ' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);

      // Scroll-spy calculation with navbar clearance offset
      const scrollPosition = window.scrollY + 140;
      let currentSection = '';

      for (let i = navItems.length - 1; i >= 0; i--) {
        const item = navItems[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            currentSection = item.id;
            break;
          }
        }
      }

      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      setActiveSection(id);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-[#050505]/95 backdrop-blur-md border-b border-white/[0.08] shadow-lg shadow-black/40 py-3.5'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Strict 3-Zone Top Bar Contract separated by gap-8 */}
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Brand Zone */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-neutral-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors border border-white/5"
              title="Back to Celoris main website"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Celoris Main</span>
            </Link>
            <Link
              href="/cloud"
              className="flex items-center whitespace-nowrap shrink-0 group focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-lg"
              aria-label="Celoris Cloud Home"
            >
              <CelorisLogo size="md" />
            </Link>
          </div>

          {/* Zone 2: Navigation Links with Scroll-Spy indicator */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleNavClick(e, item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'text-emerald-400 font-semibold'
                      : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                  aria-current={isActive ? 'location' : undefined}
                >
                  {item.label}
                  {isActive && (
                    <span
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-emerald-400 rounded-full"
                      aria-hidden="true"
                    />
                  )}
                </a>
              );
            })}
          </nav>

          {/* Zone 3: User Authentication & Claim Action */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {loading ? (
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 animate-pulse" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="relative h-8 w-8 rounded-full p-0 border border-white/20 hover:border-emerald-400/60 transition-all duration-200 hover:scale-105 shadow-[0_0_12px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden group focus:outline-none focus:ring-2 focus:ring-emerald-400/50"
                    aria-label="User Account"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user.email || 'User')}&background=10b981&color=fff`}
                        alt={profile?.full_name || 'User'}
                      />
                      <AvatarFallback className="bg-gradient-to-tr from-emerald-500 to-teal-400 text-black font-bold text-[10px]">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-64 bg-[#0a0d14]/95 backdrop-blur-3xl border border-white/[0.12] text-slate-200 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] z-50 p-2 mt-2"
                >
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.08] mb-2 flex items-center gap-2.5">
                    <Avatar className="h-8 w-8 border border-white/15 shrink-0">
                      <AvatarImage
                        src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user.email || 'User')}&background=10b981&color=fff`}
                        alt={profile?.full_name || 'User'}
                      />
                      <AvatarFallback className="bg-emerald-500 text-black font-bold text-xs">
                        {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white tracking-tight truncate">
                        {profile?.full_name || user.email?.split('@')[0]}
                      </p>
                      <p className="text-[10px] text-neutral-400 truncate mt-0.5">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem asChild className="rounded-xl p-2 hover:bg-white/[0.06] focus:bg-white/[0.06] cursor-pointer text-xs">
                    <Link href="/dashboard" className="flex items-center gap-2 text-neutral-300 hover:text-white">
                      <LayoutDashboard className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Main Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl p-2 hover:bg-white/[0.06] focus:bg-white/[0.06] cursor-pointer text-xs">
                    <Link href="/job-center" className="flex items-center gap-2 text-neutral-300 hover:text-white">
                      <Briefcase className="w-3.5 h-3.5 text-blue-400" />
                      <span>Job Center</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="rounded-xl p-2 hover:bg-white/[0.06] focus:bg-white/[0.06] cursor-pointer text-xs">
                    <Link href="/social/profile" className="flex items-center gap-2 text-neutral-300 hover:text-white">
                      <UserIcon className="w-3.5 h-3.5 text-purple-400" />
                      <span>Creator Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <div className="h-[1px] bg-white/[0.08] my-1" />
                  <DropdownMenuItem
                    onClick={() => signOut()}
                    className="rounded-xl p-2 text-neutral-400 hover:text-rose-300 hover:bg-rose-500/10 focus:text-rose-300 focus:bg-rose-500/10 cursor-pointer text-xs flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login?redirect=/cloud"
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors border border-white/10"
              >
                <LogIn className="w-3.5 h-3.5 text-emerald-400" />
                <span>Sign In</span>
              </Link>
            )}

            <button
              onClick={() => onClaimClick()}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-black bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm shadow-emerald-500/25 transition-all duration-150 active:scale-95 whitespace-nowrap shrink-0 cursor-pointer"
            >
              Claim Free Site
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
