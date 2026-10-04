"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Tv, 
  ChevronLeft, 
  PlayCircle, 
  ArrowUpRight, 
  Sparkles,
  BookOpen,
  Clock,
  User
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import Link from 'next/link';

interface CelorisTvViewProps {
  onBack: () => void;
  onClose: () => void;
}

interface TvVideo {
  id: string;
  title: string;
  description: string;
  youtubeId: string;
  thumbnailUrl: string;
  durationSeconds: number;
  subject: string;
  teacherName: string;
  viewCount: number;
  created_at: string;
}

export function CelorisTvView({ onBack, onClose }: CelorisTvViewProps) {
  const [videos, setVideos] = useState<TvVideo[]>([]);
  const [activeVideo, setActiveVideo] = useState<TvVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const fetchLiveVideos = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('celoris_tv_videos')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching Celoris TV videos:', error);
        return;
      }

      if (data && data.length > 0) {
        const formatted: TvVideo[] = data.map((v: any) => ({
          id: v.id,
          title: v.title || 'Celoris Lecture',
          description: v.description || '',
          youtubeId: v.youtube_id || '',
          thumbnailUrl: v.thumbnail_url || (v.youtube_id ? `https://img.youtube.com/vi/${v.youtube_id}/hqdefault.jpg` : '/Celoristv.png'),
          durationSeconds: v.duration_seconds || 300,
          subject: v.subject || 'Creative & Tech',
          teacherName: v.teacher_name || 'Celoris Faculty',
          viewCount: v.view_count || 0,
          created_at: v.created_at,
        }));
        setVideos(formatted);
        setActiveVideo(prev => {
          if (!prev) return formatted[0];
          const exists = formatted.find(f => f.id === prev.id);
          return exists || formatted[0];
        });
      }
    } catch (err) {
      console.error('Error in fetchLiveVideos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveVideos();

    // Realtime Supabase Subscription
    const supabase = createClient();
    const channel = supabase
      .channel('public:celoris_tv_videos:phone_os')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'celoris_tv_videos' }, () => {
        fetchLiveVideos();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-[#07090e] text-white select-none">
      {/* Top Header */}
      <div className="px-3 py-2.5 bg-[#120e14] border-b border-white/[0.08] flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1 rounded-full text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Back to Home Screen"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-md bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <Tv className="w-3 h-3" />
            </div>
            <span className="text-xs font-bold tracking-tight text-white">Celoris TV</span>
          </div>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-[8.5px] font-mono">
          <PlayCircle className="w-2.5 h-2.5" />
          <span>{loading ? 'SYNCING' : `${videos.length} LECTURES`}</span>
        </div>
      </div>

      {/* Hero Stream Banner */}
      <div className="p-3 bg-gradient-to-b from-[#180e14] to-transparent border-b border-white/[0.04]">
        {/* Video Player Box */}
        <div className="relative rounded-xl overflow-hidden border border-white/[0.12] bg-black/80 aspect-[16/9] shadow-lg group">
          {isPlaying && activeVideo?.youtubeId ? (
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
              title={activeVideo.title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div 
              onClick={() => setIsPlaying(true)}
              className="relative w-full h-full cursor-pointer"
            >
              <img
                src={activeVideo?.thumbnailUrl || '/Celoristv.png'}
                alt={activeVideo?.title || 'Celoris TV'}
                className="w-full h-full object-cover opacity-85 group-hover:opacity-95 group-hover:scale-105 transition-all duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.7)] group-hover:scale-110 transition-transform">
                  <PlayCircle className="w-5 h-5 fill-white text-black" />
                </div>
              </div>

              <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[9px]">
                <span className="px-1.5 py-0.5 rounded bg-red-600 text-[8px] font-black uppercase text-white tracking-wider">
                  WATCH NOW
                </span>
                <span className="text-white/90 font-mono text-[9px] bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
                  {activeVideo ? formatDuration(activeVideo.durationSeconds) : 'HD'} • Free
                </span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-2 text-left">
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[8.5px] px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 font-medium">
              {activeVideo?.subject || 'Featured'}
            </span>
            {activeVideo?.teacherName && (
              <span className="text-[8.5px] text-slate-400 flex items-center gap-0.5">
                <User className="w-2.5 h-2.5 text-slate-500" />
                {activeVideo.teacherName}
              </span>
            )}
          </div>
          <h4 className="text-[11.5px] font-bold text-white leading-tight line-clamp-2">
            {activeVideo?.title || (loading ? 'Loading lecture...' : 'Video Editing Masterclass')}
          </h4>
          {activeVideo?.description && (
            <p className="text-[9px] text-slate-400 mt-1 line-clamp-1">
              {activeVideo.description}
            </p>
          )}
        </div>
      </div>

      {/* Featured Channel / Live Lectures Guide */}
      <div className="flex-1 overflow-y-auto p-2.5 space-y-2 custom-scrollbar">
        <p className="text-[9px] font-mono uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
          <span>Live Lectures ({videos.length})</span>
          <span className="text-[8px] text-red-400 font-bold">Realtime</span>
        </p>

        {loading && videos.length === 0 ? (
          <div className="py-4 space-y-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] animate-pulse">
                <div className="h-3 w-4/5 bg-white/10 rounded mb-2" />
                <div className="h-2 w-1/2 bg-white/5 rounded" />
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <Tv className="w-6 h-6 mx-auto mb-2 opacity-40 text-red-400" />
            <p className="text-xs">No lectures published yet</p>
            <p className="text-[9px] text-slate-500 mt-0.5">New recordings sync automatically</p>
          </div>
        ) : (
          videos.map((vid) => {
            const isSelected = activeVideo?.id === vid.id;
            return (
              <button
                key={vid.id}
                type="button"
                onClick={() => {
                  setActiveVideo(vid);
                  setIsPlaying(true);
                }}
                className={`w-full text-left p-2 rounded-xl border transition-all group flex items-start gap-2.5 cursor-pointer ${
                  isSelected
                    ? 'bg-red-500/10 border-red-500/40 shadow-sm'
                    : 'bg-white/[0.03] hover:bg-white/[0.06] border-white/[0.06] hover:border-red-500/30'
                }`}
              >
                {/* Thumbnail mini preview */}
                <div className="w-14 h-10 rounded-lg overflow-hidden shrink-0 relative bg-black/60 border border-white/10">
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <PlayCircle className={`w-3.5 h-3.5 ${isSelected ? 'text-red-400 fill-red-400/40' : 'text-white/80'}`} />
                  </div>
                  <span className="absolute bottom-0.5 right-0.5 text-[7px] font-mono px-1 rounded bg-black/80 text-white/90">
                    {formatDuration(vid.durationSeconds)}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h5 className={`text-[10.5px] font-bold leading-tight line-clamp-1 transition-colors ${
                    isSelected ? 'text-red-300' : 'text-white group-hover:text-red-300'
                  }`}>
                    {vid.title}
                  </h5>
                  <div className="flex items-center gap-1.5 mt-1 text-[8.5px] text-slate-400">
                    <span className="text-red-400/90 font-medium">{vid.subject}</span>
                    <span>•</span>
                    <span className="truncate">{vid.teacherName}</span>
                  </div>
                </div>

                <div className="shrink-0 pt-1">
                  <ArrowUpRight className={`w-3 h-3 transition-colors ${
                    isSelected ? 'text-red-400' : 'text-neutral-500 group-hover:text-red-400'
                  }`} />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Bottom CTA */}
      <div className="p-2.5 bg-[#120e14] border-t border-white/[0.08]">
        <Link
          href="/celoris-tv"
          onClick={onClose}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-[11px] transition-transform hover:scale-[1.02] active:scale-98 shadow-lg shadow-red-600/20"
        >
          <PlayCircle className="w-3.5 h-3.5" />
          <span>Open Full Celoris TV Platform</span>
          <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </div>
  );
}
