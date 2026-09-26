"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Undo, 
  Redo, 
  MousePointer2, 
  Hand, 
  Share2, 
  HelpCircle, 
  Settings, 
  ChevronDown, 
  Cloud, 
  Download, 
  LogOut, 
  LogIn, 
  BookOpen, 
  GraduationCap, 
  Tv, 
  Briefcase, 
  Plus, 
  Wallet, 
  User as UserIcon, 
  Sparkles,
  ChevronLeft,
  Check,
  Edit2
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeTool: 'pointer' | 'hand';
  setActiveTool: (tool: 'pointer' | 'hand') => void;
  canvasZoom: number;
  setCanvasZoom: (zoom: number) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDownload?: () => void;
  isExporting?: boolean;
  viewMode?: 'editor' | 'cdance';
  onViewModeChange?: (mode: 'editor' | 'cdance') => void;
}

export default function Header({
  activeTool,
  setActiveTool,
  canvasZoom,
  setCanvasZoom,
  undo,
  redo,
  canUndo,
  canRedo,
  onDownload,
  isExporting,
  viewMode = 'editor',
  onViewModeChange
}: HeaderProps) {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();

  const [projectName, setProjectName] = useState('Stunning Video');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [copiedShare, setCopiedShare] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  return (
    <header className="h-14 border-b border-white/[0.08] bg-[#090b10] flex items-center justify-between px-3.5 shrink-0 z-30 shadow-[0_4px_24px_rgba(0,0,0,0.6)]">
      
      {/* ------------------------------------------------------------- */}
      {/* LEFT: BACK BUTTON + CELORIS LOGO + PROJECT TITLE */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center gap-3">
        
        {/* Back Button */}
        <Link
          href="/"
          title="Back to Celoris Home"
          className="p-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all flex items-center gap-1 shadow-xs group"
        >
          <ChevronLeft className="w-4 h-4 text-slate-400 group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
          <span className="hidden sm:inline text-[11px] font-semibold text-slate-300 group-hover:text-white pr-1">Exit</span>
        </Link>

        {/* Official Celoris Logo */}
        <Link href="/" className="flex items-center gap-2 group shrink-0">
          <img
            src="/celoris-logo.png"
            alt="Celoris Logo"
            className="h-7 w-auto object-contain group-hover:opacity-90 group-hover:scale-102 transition-all duration-200"
          />
        </Link>

        {/* Studio Suite Badge */}
        <div className="hidden xl:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[9px] font-mono font-bold text-emerald-400 uppercase tracking-widest pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
          <span>4K Studio</span>
        </div>

        <div className="h-4 w-px bg-white/10 mx-0.5 hidden sm:block" />

        {/* Project Name & Cloud Autosave Status */}
        <div className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-white/[0.04] transition-colors group">
          <Cloud className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          {isEditingTitle ? (
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onBlur={() => setIsEditingTitle(false)}
              onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
              autoFocus
              className="bg-black/60 border border-white/20 rounded px-1.5 py-0.5 text-xs text-white font-medium focus:outline-none w-32"
            />
          ) : (
            <div 
              onClick={() => setIsEditingTitle(true)}
              className="flex items-center gap-1.5 cursor-pointer"
              title="Click to rename project"
            >
              <span className="text-xs font-semibold text-slate-200 group-hover:text-white max-w-[140px] truncate">
                {projectName}
              </span>
              <Edit2 className="w-2.5 h-2.5 text-slate-500 group-hover:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
          <span className="hidden md:inline text-[9px] font-mono text-slate-500">Saved</span>
        </div>

        {/* View Switcher: Editor vs C-Dance 2.5 Pro */}
        <div className="hidden sm:flex items-center bg-[#131620] border border-white/10 rounded-xl p-0.5 ml-1 shadow-inner">
          <button
            type="button"
            onClick={() => onViewModeChange?.('editor')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              viewMode === 'editor'
                ? 'bg-white/15 text-white shadow-sm font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Timeline Editor
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange?.('cdance')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              viewMode === 'cdance'
                ? 'bg-[#ccff00] text-black shadow-sm font-black'
                : 'text-slate-300 hover:text-[#ccff00] hover:bg-white/[0.04]'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${viewMode === 'cdance' ? 'text-black fill-black' : 'text-[#ccff00]'}`} />
            <span>C-Dance 2.5</span>
            <span className={`text-[8.5px] px-1 py-0.2 rounded font-mono font-bold ${
              viewMode === 'cdance' ? 'bg-black text-[#ccff00]' : 'bg-[#ccff00] text-black'
            }`}>
              PRO
            </span>
          </button>
        </div>

      </div>

      {/* ------------------------------------------------------------- */}
      {/* CENTER: CANVAS & EDITING TOOLS */}
      {/* ------------------------------------------------------------- */}
      <div className="hidden lg:flex items-center gap-3">
        {/* Pointer / Hand Tools */}
        <div className="flex items-center gap-1 bg-[#131620] border border-white/10 rounded-xl p-1 shadow-inner">
          <button
            type="button"
            onClick={() => setActiveTool('pointer')}
            title="Selection Tool (V)"
            className={`p-1.5 rounded-lg transition-all ${
              activeTool === 'pointer' 
                ? 'bg-white/20 text-white shadow-xs' 
                : 'text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <MousePointer2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setActiveTool('hand')}
            title="Hand / Pan Tool (H)"
            className={`p-1.5 rounded-lg transition-all ${
              activeTool === 'hand' 
                ? 'bg-white/20 text-white shadow-xs' 
                : 'text-slate-400 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Zoom Selector */}
        <div className="flex items-center gap-1 bg-[#131620] border border-white/10 rounded-xl px-2.5 py-1 text-xs text-slate-300 relative group cursor-pointer shadow-inner">
          <select
            className="appearance-none bg-transparent text-slate-300 hover:text-white focus:outline-none cursor-pointer pr-5 py-0.5 font-mono text-xs"
            value={canvasZoom}
            onChange={(e) => setCanvasZoom(Number(e.target.value))}
          >
            <option value={25} className="bg-[#12141c] text-white">25%</option>
            <option value={50} className="bg-[#12141c] text-white">50%</option>
            <option value={75} className="bg-[#12141c] text-white">75%</option>
            <option value={100} className="bg-[#12141c] text-white">100% (Fit)</option>
            <option value={125} className="bg-[#12141c] text-white">125%</option>
            <option value={150} className="bg-[#12141c] text-white">150%</option>
            <option value={200} className="bg-[#12141c] text-white">200%</option>
          </select>
          <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="h-4 w-px bg-white/10"></div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className={`p-1.5 rounded-lg transition-colors ${
              canUndo ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <Undo className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className={`p-1.5 rounded-lg transition-colors ${
              canRedo ? 'text-slate-300 hover:bg-white/10 hover:text-white' : 'text-slate-600 cursor-not-allowed'
            }`}
          >
            <Redo className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* RIGHT: WALLET CREDITS + SHARE + EXPORT + AVATAR */}
      {/* ------------------------------------------------------------- */}
      <div className="flex items-center gap-2.5">
        
        {/* Wallet Balance Badge */}
        {user && (
          <Link
            href="/social/profile"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 hover:bg-emerald-500/15 text-xs font-bold text-emerald-400 transition-all shadow-xs"
            title="Your Celoris AI Credits"
          >
            <Wallet className="w-3.5 h-3.5" />
            <span className="font-mono">{profile?.wallet_balance?.toString() || '304'}</span>
            <span className="text-[10px] text-emerald-400/70 font-sans">Credits</span>
          </Link>
        )}

        {/* Share Button */}
        <button 
          type="button"
          onClick={handleShare}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-slate-200 text-xs font-semibold transition-all shadow-xs"
          title="Share Project Link"
        >
          {copiedShare ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </>
          )}
        </button>

        {/* Export / Download Master Button */}
        <button 
          type="button"
          onClick={onDownload}
          disabled={isExporting}
          className="bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 disabled:opacity-60 text-black font-extrabold text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-[0_0_20px_rgba(52,211,153,0.35)] transition-all cursor-pointer active:scale-98"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Exporting...' : 'Export 4K'}</span>
        </button>

        {/* User Account Dropdown */}
        {loading ? (
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse ml-1" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 border border-white/15 overflow-hidden ml-1 hover:border-white/30 transition-all">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user.email || 'User')}&background=10b981&color=fff`}
                    alt={profile?.full_name || 'User'}
                  />
                  <AvatarFallback className="bg-emerald-500 text-white text-[10px] font-bold">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#0e1118] border-white/10 text-slate-200 shadow-2xl backdrop-blur-xl" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold text-white leading-none">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] leading-none text-slate-400 font-mono">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer">
                <Link href="/learn" className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-semibold">Academy & Courses</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer">
                <Link href="/job-center" className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-semibold">Job Center</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer">
                <Link href="/social/profile" className="flex items-center">
                  <UserIcon className="mr-2 h-4 w-4 text-emerald-400" />
                  <span className="text-xs font-semibold">Creator Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="cursor-default focus:bg-transparent">
                <Wallet className="mr-2 h-4 w-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-400">Balance: {profile?.wallet_balance || '304'} Credits</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-rose-400 focus:text-rose-300 focus:bg-rose-500/10">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="text-xs font-semibold">Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button
              size="sm"
              className="h-8 px-3 gap-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-[10px] font-black uppercase tracking-widest rounded-xl ml-1 shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </Button>
          </Link>
        )}

      </div>
    </header>
  );
}
