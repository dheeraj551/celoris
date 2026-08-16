import React, { useState } from 'react';
import { Room } from './types';
import { Users, Lock, Sparkles, Plus, Search, MessageSquare, Flame, Trash2 } from 'lucide-react';

interface RoomsGridProps {
  rooms: Room[];
  onJoinRoom: (roomId: string) => void;
  onCreateRoom?: () => void;
  currentUser?: any;
  onDeleteRoom?: (roomId: string) => void;
}

type FilterCategory = 'all' | 'study' | 'course' | 'mixer' | 'night' | 'onboarding';

export default function RoomsGrid({ rooms, onJoinRoom, onCreateRoom, currentUser, onDeleteRoom }: RoomsGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { id: FilterCategory; label: string }[] = [
    { id: 'all', label: 'All Rooms' },
    { id: 'study', label: 'Study Tables' },
    { id: 'course', label: 'Course Lounges' },
    { id: 'mixer', label: 'Open Mixers' },
    { id: 'night', label: 'Night Owls' },
    { id: 'onboarding', label: 'Onboarding Hub' },
  ];

  const filteredRooms = rooms.filter((room) => {
    const matchesCategory = selectedCategory === 'all' || room.category === selectedCategory;
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          room.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          room.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Search and Filters bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0d0d0d]/80 backdrop-blur-md p-4 rounded-2xl border border-emerald-950/30 sticky top-0 z-30">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search rooms, courses, or skills (e.g. Figma, trading)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#121212] border border-emerald-950/40 focus:border-emerald-500/50 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
          />
        </div>

        {/* Categories filters for horizontal scroll on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`
                px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer
                ${selectedCategory === cat.id
                  ? 'bg-emerald-500 text-[#0a0a0a] shadow-[0_4px_12px_rgba(16,185,129,0.2)]'
                  : 'bg-[#121212] hover:bg-[#1a1a1a] text-gray-400 border border-emerald-950/20'}
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid count and quick stats */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-xs text-gray-400 font-medium">
            Showing <strong className="text-emerald-400">{filteredRooms.length}</strong> active student tables
          </span>
        </div>
        {onCreateRoom && (
          <button
            onClick={onCreateRoom}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Custom Table</span>
          </button>
        )}
      </div>

      {/* Rooms Grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredRooms.map((room) => (
            <div
              key={room.id}
              className="group relative overflow-hidden rounded-2xl bg-[#0f0f0f] border border-emerald-950/30 p-6 hover:border-emerald-500/40 hover:shadow-[0_15px_35px_-15px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col justify-between"
            >
              {/* Highlight effects */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-full blur-xl pointer-events-none"></div>

              <div>
                {/* Header info */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-mono">
                    {room.category === 'study' ? 'Silent Study' : room.category === 'course' ? 'Skill Lounge' : room.category === 'mixer' ? 'Mixer Chat' : room.category === 'night' ? 'Night Owl' : 'Onboarding'}
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {currentUser?.id && room.host?.id === currentUser.id && onDeleteRoom && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteRoom(room.id); }}
                        className="p-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                        title="Delete Room"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    {/* Status Indicator */}
                    <div className="flex items-center gap-1.5 bg-[#141414] border border-emerald-950/40 px-2 py-1 rounded-lg">
                      <span className={`w-1.5 h-1.5 rounded-full ${room.status === 'Full' ? 'bg-red-400' : 'bg-emerald-400 animate-pulse'}`}></span>
                      <span className="text-[11px] font-mono text-gray-400 font-semibold">{room.status}</span>
                    </div>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors mb-2 tracking-wide line-clamp-1">
                  {room.name}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3">
                  {room.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {room.tags.map((tag, i) => (
                    <span key={i} className="text-[10px] bg-[#141414] text-gray-400 px-2 py-0.5 rounded-md border border-emerald-950/10">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Section */}
              <div className="mt-auto pt-4 border-t border-emerald-950/20">
                {/* Host or Active Members overlay */}
                <div className="flex items-center justify-between mb-4">
                  {room.host ? (
                    <div className="flex items-center gap-2">
                      <img
                        src={room.host.avatar || undefined}
                        alt={room.host.name}
                        className="w-6 h-6 rounded-full border border-emerald-500/30 object-cover"
                      />
                      <div className="text-left">
                        <span className="block text-[10px] text-emerald-400 font-bold uppercase tracking-wider leading-none">Trainer Hosted</span>
                        <span className="text-xs text-gray-300 font-medium">{room.host.name}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2 overflow-hidden">
                        {room.participants.map((p, idx) => (
                          <img
                            key={p.id || idx}
                            src={p.avatar || undefined}
                            alt={p.name}
                            className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0f0f0f] object-cover"
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 font-medium">Inside now</span>
                    </div>
                  )}

                  {/* Online user count */}
                  <div className="flex items-center gap-1.5 text-gray-400">
                    <Users className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-xs font-mono font-bold text-white">{room.onlineCount}</span>
                  </div>
                </div>

                {/* Join button */}
                <button
                  disabled={room.status === 'Full'}
                  onClick={() => onJoinRoom(room.id)}
                  className={`
                    w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer
                    ${room.status === 'Full'
                      ? 'bg-zinc-800 text-gray-500 border border-zinc-700 cursor-not-allowed'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-[#0a0a0a] shadow-[0_4px_12px_rgba(16,185,129,0.15)] hover:scale-[1.02]'}
                  `}
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Join Conversation</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-[#0f0f0f] border border-emerald-950/20 rounded-2xl">
          <p className="text-gray-400 text-sm mb-2">No active tables match your search or filter.</p>
          <button
            onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
            className="text-xs font-bold text-emerald-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
}
