import React from 'react';
import Link from 'next/link';
import { Undo, Redo, MousePointer2, Hand, Share, CircleCheck, HelpCircle, Settings, ChevronDown, Cloud, Download, LogOut, LogIn, BookOpen, GraduationCap, Tv, Briefcase, Plus, Wallet, User as UserIcon } from 'lucide-react';
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
  isExporting
}: HeaderProps) {
  const { user, profile, loading, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#121212] shrink-0">
      <div className="flex items-center gap-4">
        {/* Logo placeholder */}
        <div className="w-8 h-8 bg-white text-black flex items-center justify-center font-bold text-xl rounded-sm">
          C
        </div>

        <div className="flex items-center gap-2 text-sm font-medium hover:bg-white/5 px-2 py-1 rounded cursor-pointer transition-colors">
          <Cloud className="w-4 h-4" />
          <span>Stunning video</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white/5 rounded-md p-1">
          <button
            onClick={() => setActiveTool('pointer')}
            className={`p-1.5 rounded transition-colors ${activeTool === 'pointer' ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
          >
            <MousePointer2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setActiveTool('hand')}
            className={`p-1.5 rounded transition-colors ${activeTool === 'hand' ? 'bg-white/20 text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'}`}
          >
            <Hand className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-sm relative group cursor-pointer">
          <select
            className="appearance-none bg-transparent text-gray-400 hover:text-white focus:outline-none cursor-pointer pr-6 py-1"
            value={canvasZoom}
            onChange={(e) => setCanvasZoom(Number(e.target.value))}
          >
            <option value={25}>25%</option>
            <option value={50}>50%</option>
            <option value={75}>75%</option>
            <option value={100}>100%</option>
            <option value={150}>150%</option>
            <option value={200}>200%</option>
          </select>
          <ChevronDown className="w-4 h-4 text-gray-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="h-4 w-px bg-white/10 mx-2"></div>

        <div className="flex items-center gap-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className={`p-1.5 rounded transition-colors ${canUndo ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className={`p-1.5 rounded transition-colors ${canRedo ? 'text-gray-400 hover:bg-white/10 hover:text-white' : 'text-gray-600 cursor-not-allowed'}`}
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onDownload}
          disabled={isExporting}
          className="bg-[#00a8ff] hover:bg-[#0097e6] disabled:bg-[#00a8ff]/50 text-white px-4 py-1.5 rounded text-sm font-medium flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>{isExporting ? 'Exporting...' : 'Download'}</span>
        </button>
        <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-1.5 rounded text-sm font-medium transition-colors">
          Share
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
          <CircleCheck className="w-5 h-5" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
          <HelpCircle className="w-5 h-5" />
        </button>
        <button className="p-1.5 hover:bg-white/10 rounded text-gray-400 hover:text-white transition-colors">
          <Settings className="w-5 h-5" />
        </button>
        {user && (
          <div className="hidden sm:flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full text-xs font-bold text-emerald-400 ml-1">
            <Plus className="w-3 h-3" />
            {profile?.wallet_balance?.toString() || '0'}
          </div>
        )}

        {loading ? (
          <div className="w-8 h-8 rounded-full bg-white/10 animate-pulse ml-2" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0 border border-white/10 overflow-hidden ml-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile?.full_name || user.email || 'User')}&background=10b981&color=fff`}
                    alt={profile?.full_name || 'User'}
                  />
                  <AvatarFallback className="bg-emerald-500 text-white text-[10px]">
                    {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#0d0d0d] border-white/5 text-slate-200" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-bold text-white leading-none italic uppercase">
                    {profile?.full_name || user.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] leading-none text-slate-500 font-medium">
                    {user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer">
                <Link href="/learn" className="flex items-center">
                  <BookOpen className="mr-2 h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-tight italic">Learn</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer">
                <Link href="/teach" className="flex items-center">
                  <GraduationCap className="mr-2 h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-tight italic">Teach</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer">
                <Link href="/celoris-tv" className="flex items-center">
                  <Tv className="mr-2 h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-tight italic">Celoris TV</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer">
                <Link href="/job-center" className="flex items-center">
                  <Briefcase className="mr-2 h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-tight italic">Job Center</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="focus:bg-white/5 cursor-pointer">
                <Link href="/social/profile" className="flex items-center">
                  <UserIcon className="mr-2 h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-tight italic">Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem className="cursor-default focus:bg-transparent">
                <Wallet className="mr-2 h-4 w-4 text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-tight italic">Credits: {profile?.wallet_balance || '0'}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5" />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-rose-500 focus:text-rose-400 focus:bg-rose-500/10">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="text-xs font-bold uppercase tracking-tight italic">Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/login">
            <Button
              size="sm"
              className="h-8 px-3 gap-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-black text-[10px] font-black uppercase tracking-widest rounded-full ml-2"
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
