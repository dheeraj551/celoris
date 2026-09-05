import React from 'react';
import { useApp } from '../context/AppContext';
import { ViewMode } from '../types';
import { CATEGORIES } from '../data/mockData';
import {
  Compass,
  PlaySquare,
  ListMusic,
  HelpCircle,
  Bookmark,
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
    { id: 'watch', label: 'Active Video Player', icon: <PlaySquare className="w-4 h-4" /> },
    {
      id: 'playlists',
      label: 'Personal Playlists',
      icon: <ListMusic className="w-4 h-4" />,
      badge: `${playlists.length}`,
    },
    {
      id: 'qa-hub',
      label: 'Academic Q&A Hub',
      icon: <HelpCircle className="w-4 h-4" />,
    },
    { id: 'notes', label: 'My Study Notes', icon: <Bookmark className="w-4 h-4" /> },
    {
      id: 'teacher-studio',
      label: 'Teacher Studio',
      icon: <GraduationCap className="w-4 h-4 text-amber-400" />,
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
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:sticky top-[61px] left-0 z-40 h-[calc(100vh-61px)] w-64 bg-[#121512] border-r border-[#242A24] p-4 flex flex-col justify-between overflow-y-auto custom-scrollbar transition-transform duration-300 ${
          isOpenOnMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#95A395] px-3 block mb-1">
              Menu
            </span>
            {navItems.map(item => {
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#7F9172] text-[#0D0F0D] shadow-md shadow-[#7F9172]/20 font-bold'
                      : 'text-[#95A395] hover:bg-[#1E231E] hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[#0D0F0D]' : 'text-[#7F9172]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${
                        isActive
                          ? 'bg-[#0D0F0D]/25 text-[#0D0F0D]'
                          : 'bg-[#1E231E] text-[#A8B89C]'
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
          <div className="space-y-2 pt-4 border-t border-[#242A24]">
            <div className="flex items-center justify-between px-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#95A395]">
                Study Playlists
              </span>
              <button
                onClick={() => handleNavClick('playlists')}
                className="text-[11px] font-bold text-[#A8B89C] hover:text-[#7F9172]"
              >
                All
              </button>
            </div>

            <div className="space-y-1">
              {userPlaylists.slice(0, 4).map(playlist => (
                <button
                  key={playlist.id}
                  onClick={() => handlePlaylistClick(playlist)}
                  className="w-full flex items-center justify-between p-2 rounded-xl text-xs text-[#95A395] hover:bg-[#1E231E] hover:text-white transition-colors text-left group"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="w-2 h-2 rounded-full bg-[#7F9172] flex-shrink-0" />
                    <span className="truncate group-hover:text-[#A8B89C] transition-colors">
                      {playlist.title}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#5E6C5E] flex-shrink-0">
                    {playlist.videoIds.length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Academic Subjects */}
          <div className="space-y-2 pt-4 border-t border-[#242A24]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#95A395] px-3 block">
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
                      ? 'bg-[#7F9172]/20 text-[#A8B89C] border border-[#7F9172]/40'
                      : 'bg-[#181D18] text-[#95A395] hover:text-white hover:bg-[#222922]'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer info badge */}
        <div className="pt-4 border-t border-[#242A24] text-[11px] text-[#5E6C5E] text-center">
          <p className="font-semibold text-[#95A395]">Celoris TV Platform</p>
          <span className="text-[10px]">Academic Streaming & Q&A</span>
        </div>
      </aside>
    </>
  );
};
