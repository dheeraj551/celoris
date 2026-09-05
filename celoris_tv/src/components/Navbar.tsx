import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Moon,
  Sun,
  GraduationCap,
  BookOpen,
  Plus,
  ListPlus,
  Bell,
  User,
  ShieldCheck,
  Check,
  Sparkles,
  Upload,
  Video as VideoIcon,
  Menu,
} from 'lucide-react';
import { CreatePlaylistModal } from './Modals/CreatePlaylistModal';

interface Props {
  onToggleSidebar?: () => void;
}

export const Navbar: React.FC<Props> = ({ onToggleSidebar }) => {
  const {
    theme,
    toggleTheme,
    currentRole,
    setCurrentRole,
    currentUser,
    searchQuery,
    setSearchQuery,
    setCurrentView,
    questions,
  } = useApp();

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const teacherUnansweredCount = questions.filter(
    q => q.answers.length === 0 && !q.isResolved
  ).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#121512]/90 backdrop-blur-md border-b border-[#242A24] px-4 lg:px-8 py-3 select-none text-[#E0E5E0] transition-colors">
      <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
        {/* Left: Mobile Menu Toggle & Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-[#95A395] hover:text-white rounded-xl hover:bg-[#1E231E] transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div
            onClick={() => setCurrentView('explore')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7F9172] via-[#6F8162] to-[#55644C] flex items-center justify-center text-[#0D0F0D] font-black shadow-lg shadow-[#7F9172]/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5 text-[#0D0F0D]" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
                Celoris TV
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-[#7F9172]/20 text-[#A8B89C] border border-[#7F9172]/30">
                  Academic
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:flex flex-1 max-w-lg mx-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#7F9172] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search lectures, topics, professors, proofs, or Q&A..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                if (e.target.value.trim()) {
                  // switch to explore if not already
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-[#181D18] border border-[#2A322A] rounded-2xl text-xs text-white placeholder-[#5E6C5E] focus:outline-hidden focus:ring-2 focus:ring-[#7F9172] focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#95A395] hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Right Controls: Role Switcher, Create Button, Theme Toggle, Profile */}
        <div className="flex items-center gap-2.5">
          {/* Role Switcher (Student / Teacher toggle) */}
          <div className="p-1 bg-[#181D18] border border-[#2A322A] rounded-xl flex items-center">
            <button
              onClick={() => setCurrentRole('student')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currentRole === 'student'
                  ? 'bg-[#7F9172] text-[#0D0F0D] shadow-xs'
                  : 'text-[#95A395] hover:text-white'
              }`}
              title="Student View: Enroll in courses, personalize study queues, ask doubts"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Student</span>
            </button>

            <button
              onClick={() => {
                setCurrentRole('teacher');
                setCurrentView('teacher-studio');
              }}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                currentRole === 'teacher'
                  ? 'bg-[#D2B48C] text-[#0D0F0D] shadow-xs'
                  : 'text-[#95A395] hover:text-white'
              }`}
              title="Teacher Mode: Publish lectures, manage course syllabi, verify Q&A"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Teacher</span>
              {teacherUnansweredCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#D2B48C] animate-ping" />
              )}
            </button>
          </div>

          {/* Quick Action Button */}
          {currentRole === 'teacher' ? (
            <button
              onClick={() => setCurrentView('teacher-studio')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-[#7F9172] hover:bg-[#91A582] text-[#0D0F0D] rounded-xl text-xs font-bold shadow-md shadow-[#7F9172]/20 transition-all hover:scale-102"
            >
              <Upload className="w-3.5 h-3.5 text-[#0D0F0D]" />
              <span>Upload Lecture</span>
            </button>
          ) : (
            <button
              onClick={() => setShowCreateModal(true)}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 bg-[#7F9172] hover:bg-[#91A582] text-[#0D0F0D] rounded-xl text-xs font-bold shadow-md shadow-[#7F9172]/20 transition-all hover:scale-102"
            >
              <ListPlus className="w-3.5 h-3.5 text-[#0D0F0D]" />
              <span>New Playlist</span>
            </button>
          )}

          {/* Dark / Light Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-[#181D18] border border-[#2A322A] text-[#A8B89C] hover:text-white hover:bg-[#222922] transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-[#D2B48C]" /> : <Moon className="w-4 h-4 text-[#7F9172]" />}
          </button>

          {/* User Profile Avatar Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1 rounded-xl hover:bg-[#181D18] transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-8 h-8 rounded-full object-cover border border-[#2A322A]"
              />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#161B16] border border-[#2A322A] rounded-2xl shadow-2xl p-4 z-50 text-[#E0E5E0] animate-fadeIn">
                <div className="flex items-center gap-3 pb-3 border-b border-[#2A322A]">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#7F9172]/40"
                  />
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                    <p className="text-[10px] text-[#95A395] truncate">{currentUser.email}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-semibold text-[#A8B89C]">
                      {currentUser.role === 'teacher' ? 'Faculty Instructor' : 'Enrolled Student'}
                    </span>
                  </div>
                </div>

                <div className="py-2 space-y-1 text-xs">
                  <p className="text-[11px] text-[#95A395] px-2 py-1 leading-tight">
                    🏛️ {currentUser.institution}
                  </p>
                  <button
                    onClick={() => {
                      setCurrentView('notes');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#1E231E] text-[#95A395] hover:text-white transition-colors"
                  >
                    My Study Notes ({currentUser.role === 'student' ? 'Active' : 'Archived'})
                  </button>
                  <button
                    onClick={() => {
                      setCurrentView('playlists');
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg hover:bg-[#1E231E] text-[#95A395] hover:text-white transition-colors"
                  >
                    Personalized Playlists
                  </button>
                </div>

                <div className="pt-2 border-t border-[#2A322A] text-[10px] text-[#5E6C5E] text-center">
                  Active Mode: <strong className="text-[#A8B89C] capitalize">{currentRole}</strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </header>
  );
};
