'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VPSVideo {
  id: string;
  user_id: string;
  vps_url: string;
  thumbnail_url: string | null;
  description: string | null;
  privacy_level: 'public' | 'followers' | 'private';
  file_name: string;
  file_size: number;
  duration: number | null;
  dimensions: { width: number; height: number } | null;
  view_count: number;
  like_count: number;
  comment_count: number;
  created_at: string;
  user_profile?: {
    id: string;
    full_name: string;
    username: string;
    avatar_url: string | null;
  };
  user_has_liked?: boolean;
}

interface InstagramVideoPlayerProps {
  video: VPSVideo;
  showHeader?: boolean;
  onLike?: (videoId: string) => void;
  onComment?: (videoId: string) => void;
  onShare?: (videoId: string) => void;
  className?: string;
}

export default function InstagramVideoPlayer({ 
  video, 
  showHeader = true, 
  onLike, 
  onComment, 
  onShare,
  className 
}: InstagramVideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isLiked, setIsLiked] = useState(video.user_has_liked || false);
  const [likeCount, setLikeCount] = useState(video.like_count);
  const [viewCount, setViewCount] = useState(video.view_count);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateTime = () => setCurrentTime(videoElement.currentTime);
    const updateDuration = () => setDuration(videoElement.duration);
    const handleEnded = () => setIsPlaying(false);
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    videoElement.addEventListener('timeupdate', updateTime);
    videoElement.addEventListener('loadedmetadata', updateDuration);
    videoElement.addEventListener('ended', handleEnded);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);

    return () => {
      videoElement.removeEventListener('timeupdate', updateTime);
      videoElement.removeEventListener('loadedmetadata', updateDuration);
      videoElement.removeEventListener('ended', handleEnded);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
    };
  }, []);

  useEffect(() => {
    // Track view when video starts playing
    if (isPlaying && viewCount === video.view_count) {
      // Increment view count
      fetch(`/api/videos/${video.id}/view`, { method: 'POST' });
      setViewCount(prev => prev + 1);
    }
  }, [isPlaying, video.id, video.view_count, viewCount]);

  const togglePlay = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    if (isPlaying) {
      videoElement.pause();
    } else {
      videoElement.play();
    }
  };

  const toggleMute = () => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.muted = !videoElement.muted;
    setIsMuted(videoElement.muted);
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    if (onLike) onLike(video.id);
  };

  const handleShare = () => {
    if (onShare) onShare(video.id);
    
    // Copy to clipboard for demo
    const url = `${window.location.origin}/social/profile/${video.user_profile?.username || video.user_id}`;
    navigator.clipboard.writeText(url);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div 
      ref={containerRef}
      className={cn(
        "bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden",
        "max-w-md mx-auto",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setShowControls(false)}
    >
      {showHeader && (
        <div className="flex items-center justify-between p-3 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={video.user_profile?.avatar_url || ''} />
              <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white text-sm">
                {video.user_profile?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {video.user_profile?.username || 'user'}
              </p>
              <p className="text-xs text-gray-500">
                {new Date(video.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Video Container */}
      <div className="relative bg-black aspect-[4/5] max-h-[600px]">
        <video
          ref={videoRef}
          src={video.vps_url}
          poster={video.thumbnail_url || undefined}
          className="w-full h-full object-cover"
          playsInline
          muted={isMuted}
          loop
          onClick={togglePlay}
        />

        {/* Play/Pause Overlay */}
        {!isPlaying && (
          <div 
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 cursor-pointer"
            onClick={togglePlay}
          >
            <div className="w-16 h-16 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
              <Play className="h-8 w-8 text-gray-900 ml-1" />
            </div>
          </div>
        )}

        {/* Controls */}
        <div 
          className={cn(
            "absolute inset-0 transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Top Controls */}
          <div className="absolute top-4 right-4 flex space-x-2">
            <Button
              variant="secondary"
              size="sm"
              className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
              onClick={toggleMute}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="bg-black bg-opacity-50 text-white hover:bg-opacity-70"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </div>

          {/* Bottom Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            {/* Progress Bar */}
            <div className="mb-3">
              <div className="w-full bg-gray-600 bg-opacity-50 h-1 rounded-full">
                <div 
                  className="bg-white h-1 rounded-full transition-all duration-100"
                  style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }}
                />
              </div>
              <div className="flex justify-between text-xs text-white mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between">
              <div className="flex space-x-4">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white hover:bg-opacity-20"
                >
                  <Download className="h-5 w-5" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white hover:bg-opacity-20"
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info & Actions */}
      <div className="p-4">
        {/* Description */}
        {video.description && (
          <p className="text-sm text-gray-900 mb-3">
            <span className="font-semibold mr-2">
              {video.user_profile?.username || 'user'}
            </span>
            {video.description}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto"
              onClick={toggleLike}
            >
              <Heart 
                className={cn(
                  "h-6 w-6 transition-colors",
                  isLiked ? "fill-red-500 text-red-500" : "text-gray-900"
                )} 
              />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto"
              onClick={() => onComment && onComment(video.id)}
            >
              <MessageCircle className="h-6 w-6 text-gray-900" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="p-0 h-auto"
              onClick={handleShare}
            >
              <Share className="h-6 w-6 text-gray-900" />
            </Button>
          </div>
          <Button variant="ghost" size="sm" className="p-0 h-auto">
            <MoreHorizontal className="h-6 w-6 text-gray-900" />
          </Button>
        </div>

        {/* Stats */}
        <div className="text-sm text-gray-900">
          <p className="font-semibold mb-1">
            {formatCount(likeCount)} likes
          </p>
          <p className="text-gray-500 text-xs">
            {formatCount(viewCount)} views • {formatFileSize(video.file_size)} • {video.duration ? `${video.duration}s` : 'Unknown duration'}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            VPS Storage • High Performance Streaming
          </p>
        </div>
      </div>
    </div>
  );
}