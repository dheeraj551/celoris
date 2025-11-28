'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Instagram, 
  Video, 
  Upload,
  BarChart3,
  Settings,
  Plus,
  Eye,
  Heart,
  MessageCircle
} from 'lucide-react';
import VPSVideoManager from './VPSVideoManager';
import InstagramVideoPlayer from './InstagramVideoPlayer';
import { createClient } from '@/lib/supabase-client';

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
}

interface InstagramManagerProps {
  user: any;
}

export default function InstagramManager({ user }: InstagramManagerProps) {
  const [videos, setVideos] = useState<VPSVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0
  });

  useEffect(() => {
    loadVideos();
    loadStats();
  }, []);

  const loadVideos = async () => {
    try {
      setLoading(true);
      const supabase = createClient();
      
      const result = await supabase
        .from('vps_videos')
        .select(`
          *,
          user_profile:profiles!vps_videos_user_id_fkey (
            id,
            full_name,
            username,
            avatar_url
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (result.error) throw result.error;
      setVideos(result.data || []);
    } catch (error) {
      console.error('Error loading videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const supabase = createClient();
      
      const statsResult = await supabase
        .from('vps_videos')
        .select('view_count, like_count, comment_count')
        .eq('user_id', user.id);

      if (statsResult.error) throw statsResult.error;

      const data = statsResult.data as Array<{view_count: number, like_count: number, comment_count: number}> | null;
      const totalViews = data?.reduce((sum, video) => sum + (video.view_count || 0), 0) || 0;
      const totalLikes = data?.reduce((sum, video) => sum + (video.like_count || 0), 0) || 0;
      const totalComments = data?.reduce((sum, video) => sum + (video.comment_count || 0), 0) || 0;

      setStats({
        totalVideos: data?.length || 0,
        totalViews,
        totalLikes,
        totalComments
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const handleVideoUpload = (videoData: any) => {
    loadVideos();
    loadStats();
  };

  const handleVideoLike = async (videoId: string) => {
    try {
      const response = await fetch(`/api/videos/${videoId}/like`, {
        method: 'POST'
      });

      if (response.ok) {
        const result = await response.json();
        // Update local state
        setVideos(prev => prev.map(video => 
          video.id === videoId 
            ? { ...video, like_count: result.like_count }
            : video
        ));
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleVideoComment = (videoId: string) => {
    // Open comment modal or navigate to comment section
    console.log('Open comments for video:', videoId);
  };

  const handleVideoShare = (videoId: string) => {
    // Share functionality
    console.log('Share video:', videoId);
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Video className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">VPS Video Manager</h2>
            <p className="text-sm text-gray-600">Instagram-style video platform</p>
          </div>
        </div>
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          VPS Storage Active
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Video className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Videos</p>
                <p className="text-lg font-semibold">{stats.totalVideos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Views</p>
                <p className="text-lg font-semibold">{formatCount(stats.totalViews)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Likes</p>
                <p className="text-lg font-semibold">{formatCount(stats.totalLikes)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Comments</p>
                <p className="text-lg font-semibold">{formatCount(stats.totalComments)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="upload" className="flex items-center space-x-2">
            <Upload className="h-4 w-4" />
            <span>Upload</span>
          </TabsTrigger>
          <TabsTrigger value="videos" className="flex items-center space-x-2">
            <Video className="h-4 w-4" />
            <span>My Videos</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4" />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <VPSVideoManager user={user} onUploadComplete={handleVideoUpload} />
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <div className="space-y-6">
            {videos.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No videos yet</h3>
                  <p className="text-gray-600 mb-4">
                    Upload your first video to get started with your Instagram-style feed.
                  </p>
                  <Button onClick={() => (document.querySelector('[value="upload"]') as HTMLButtonElement)?.click()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <InstagramVideoPlayer
                    key={video.id}
                    video={{
                      ...video,
                      user_profile: video.user_profile || {
                        id: user.id,
                        full_name: user.user_metadata?.full_name || user.email,
                        username: user.email?.split('@')[0] || 'user',
                        avatar_url: user.user_metadata?.avatar_url || null
                      }
                    }}
                    onLike={handleVideoLike}
                    onComment={handleVideoComment}
                    onShare={handleVideoShare}
                    showHeader={false}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Analytics</CardTitle>
              <CardDescription>
                Detailed insights about your video performance and audience engagement.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900">Best Performing Video</h4>
                    <p className="text-sm text-blue-700">
                      {videos.length > 0 
                        ? videos.reduce((best, current) => 
                            (current.view_count || 0) > (best.view_count || 0) ? current : best
                          ).description || 'Untitled video'
                        : 'No videos yet'
                      }
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-900">Average Engagement</h4>
                    <p className="text-sm text-green-700">
                      {stats.totalVideos > 0 
                        ? `${((stats.totalLikes + stats.totalComments) / stats.totalViews * 100).toFixed(1)}%`
                        : '0%'
                      }
                    </p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Storage Usage</h4>
                  <p className="text-sm text-gray-600">
                    Videos are stored on high-performance VPS servers with unlimited bandwidth.
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Current storage: {videos.length} videos • 
                    Total size: {formatCount(videos.reduce((sum, video) => sum + video.file_size, 0))} • 
                    VPS Storage
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}