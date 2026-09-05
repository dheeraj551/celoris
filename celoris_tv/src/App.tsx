import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ExploreView } from './components/Explore/ExploreView';
import { WatchView } from './components/VideoPlayer/WatchView';
import { PlaylistsView } from './components/Playlists/PlaylistsView';
import { PlaylistDetailView } from './components/Playlists/PlaylistDetailView';
import { GlobalQAHub } from './components/QAHub/GlobalQAHub';
import { TeacherStudioView } from './components/TeacherStudio/TeacherStudioView';
import { NotesHistoryView } from './components/Notes/NotesHistoryView';

const MainContent: React.FC = () => {
  const { currentView, selectedPlaylistForDetail, playlists } = useApp();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Derive unique key so playlist detail transitions properly between different playlists
  const activeViewKey =
    currentView === 'playlist-detail'
      ? `playlist-${selectedPlaylistForDetail?.id || 'default'}`
      : currentView;

  return (
    <div className="min-h-screen bg-[#0D0F0D] text-[#E0E5E0] flex flex-col font-sans transition-colors">
      {/* Top Navigation Bar */}
      <Navbar onToggleSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      <div className="flex-1 flex w-full">
        {/* Sidebar */}
        <Sidebar
          isOpenOnMobile={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main View Area with Entrance Fade-in and Slide-up */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeViewKey}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              {currentView === 'explore' && <ExploreView />}
              {currentView === 'watch' && <WatchView />}
              {currentView === 'playlists' && <PlaylistsView />}
              {currentView === 'playlist-detail' && (
                <PlaylistDetailView playlist={selectedPlaylistForDetail || playlists[0]} />
              )}
              {currentView === 'qa-hub' && <GlobalQAHub />}
              {currentView === 'teacher-studio' && <TeacherStudioView />}
              {(currentView === 'notes' || currentView === 'history') && <NotesHistoryView />}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
