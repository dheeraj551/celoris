import React from 'react';
import { useApp } from '../context/AppContext';
import { ViewMode } from '../types';
import { CATEGORIES } from '../data/mockData';
import {
  Compass,
  PlaySquare,
  ListMusic,
  HelpCircle,
  GraduationCap,
  Sparkles,
  BookOpen,
  Layers,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';

interface Props {
  isOpenOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<Props> = ({ isOpenOnMobile, onCloseMobile }) => {
  const {
    currentView,
    setCurrentView,
    playlists,
    currentRole,
    currentUser,
    setSelectedPlaylistForDetail,
    selectedCategory,
    setSelectedCategory,
  } = useApp();

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode; badge?: string }[] = [
    { id: 'explore', label: 'Explore Lectures', icon: <Compass className="w-4 h-4" /> },
    { id: 'watch', label: 'Video Player', icon: <PlaySquare className="w-4 h-4" /> },
    {
      id: 'playlists',
      label: 'Study Playlists',
      icon: <ListMusic className="w-4 h-4" />,
      badge: `${playlists.length}`,
    },
    {
      id: 'qa-hub',
      label: 'Academic Q&A',
      icon: <HelpCircle className="w-4 h-4" />,
    },
    {
      id: 'teacher-studio',
      label: 'Teacher Studio',
      icon: <GraduationCap className="w-4 h-4" />,
      badge: currentRole === 'teacher' ? 'Active' : undefined,
    },
  ];

  const handleNavClick = (view: ViewMode) => {
    setCurrentView(view);
    if (onCloseMobile) onCloseMobile();
  };

  const handlePlaylistClick = (playlist: any) => {
    setSelectedPlaylistForDetail(playlist);
    setCurrentView('playlist-detail');
    if (onCloseMobile) onCloseMobile();
  };

  const userPlaylists = playlists.filter(
    p => p.isPersonal || p.authorId === currentUser.id || currentUser.customPlaylistIds.includes(p.id)
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenOnMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-14 sm:top-16 left-0 z-40 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] w-64 bg-[#0a0d14]/95 border-r border-white/[0.08] backdrop-blur-xl p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar transition-transform duration-300 select-none ${
          isOpenOnMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 px-3 block mb-1 font-mono">
              Navigation
            </span>
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-extrabold shadow-[0_0_15px_rgba(52,211,153,0.3)]'
                      : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-black' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        isActive
                          ? 'bg-black/25 text-black'
                          : 'bg-white/[0.06] text-emerald-400 border border-white/[0.08]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* User's Personalized Playlists */}
          <div className="space-y-2 pt-4 border-t border-white/[0.08]">
            <div className="flex items-center justify-between px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                Study Playlists
              </span>
              <button
                onClick={() => handleNavClick('playlists')}
                className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                All
              </button>
            </div>

            <div className="space-y-1">
              {userPlaylists.slice(0, 5).map(playlist => (
                <button
                  key={playlist.id}
                  onClick={() => handlePlaylistClick(playlist)}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-slate-400 hover:bg-white/[0.05] hover:text-white transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0 group-hover:scale-125 transition-transform shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                    <span className="truncate group-hover:text-slate-200 transition-colors">
                      {playlist.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 flex-shrink-0">
                    {playlist.videoIds.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Academic Subjects */}
          <div className="space-y-2 pt-4 border-t border-white/[0.08]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono px-3 block">
              Subjects
            </span>
            <div className="flex flex-wrap gap-1.5 px-1">
              {CATEGORIES.filter(c => c !== 'All Subjects').map(sub => (
                <button
                  key={sub}
                  onClick={() => {
                    setSelectedCategory(sub);
                    handleNavClick('explore');
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
                    selectedCategory === sub
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs font-bold'
                      : 'bg-white/[0.04] text-slate-400 hover:text-white hover:bg-white/[0.08] border border-white/[0.06]'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info badge */}
        <div className="pt-4 border-t border-white/[0.08] text-[11px] text-slate-500 text-center">
          <p className="font-semibold text-slate-400">Celoris TV</p>
          <span className="text-[10px] text-slate-500">Academic Video & Q&A Hub</span>
        </div>
      </aside>
    </>
  );
};
