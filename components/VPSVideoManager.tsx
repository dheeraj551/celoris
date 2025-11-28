'use client';

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Upload, Video, Image, X, Check, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase-client';

interface VPSVideoManagerProps {
  user: any;
  onUploadComplete?: (videoData: any) => void;
}

interface VideoUpload {
  id: string;
  file: File;
  thumbnail: string | null;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  error?: string;
  vpsUrl?: string;
}

export default function VPSVideoManager({ user, onUploadComplete }: VPSVideoManagerProps) {
  const [videos, setVideos] = useState<VideoUpload[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [videoDescription, setVideoDescription] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'followers' | 'private'>('public');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('video/')) {
        const videoId = Math.random().toString(36).substr(2, 9);
        const newVideo: VideoUpload = {
          id: videoId,
          file,
          thumbnail: null,
          progress: 0,
          status: 'uploading'
        };
        setVideos(prev => [...prev, newVideo]);
        processVideoUpload(newVideo);
      }
    });

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const processVideoUpload = async (videoUpload: VideoUpload) => {
    try {
      setIsUploading(true);

      // Step 1: Upload video to VPS storage
      const formData = new FormData();
      formData.append('video', videoUpload.file);
      formData.append('user_id', user.id);
      formData.append('description', videoDescription);

      const uploadResponse = await fetch('/api/vps/video/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Upload failed');
      }

      const uploadResult = await uploadResponse.json();

      // Update video status
      setVideos(prev => prev.map(v => 
        v.id === videoUpload.id 
          ? { ...v, progress: 50, status: 'processing', vpsUrl: uploadResult.vps_url }
          : v
      ));

      // Step 2: Generate thumbnail if not provided
      let thumbnailUrl = null;
      if (!videoUpload.thumbnail) {
        thumbnailUrl = await generateVideoThumbnail(videoUpload.file);
      }

      // Step 3: Save metadata to Supabase
      const supabase = createClient();
      const { data, error } = await (supabase
        .from('vps_videos') as any)
        .insert({
          user_id: user.id,
          vps_url: uploadResult.vps_url,
          thumbnail_url: thumbnailUrl,
          description: videoDescription,
          privacy_level: privacy,
          file_name: videoUpload.file.name,
          file_size: videoUpload.file.size,
          duration: uploadResult.duration || null,
          dimensions: uploadResult.dimensions || null
        })
        .select()
        .single();

      if (error) throw error;

      // Final update
      setVideos(prev => prev.map(v => 
        v.id === videoUpload.id 
          ? { ...v, progress: 100, status: 'completed' }
          : v
      ));

      if (onUploadComplete) {
        onUploadComplete(data);
      }

    } catch (error) {
      console.error('Video upload error:', error);
      setVideos(prev => prev.map(v => 
        v.id === videoUpload.id 
          ? { ...v, status: 'error', error: error instanceof Error ? error.message : 'Unknown error' }
          : v
      ));
    } finally {
      setIsUploading(false);
    }
  };

  const generateVideoThumbnail = async (file: File): Promise<string | null> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadedmetadata = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        video.currentTime = Math.min(2, video.duration / 4); // Capture at 2 seconds or 1/4 of duration
      };

      video.onseeked = () => {
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const thumbnail = canvas.toDataURL('image/jpeg', 0.8);
          resolve(thumbnail);
        } else {
          resolve(null);
        }
      };

      video.onerror = () => resolve(null);

      video.src = URL.createObjectURL(file);
    });
  };

  const removeVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  const getStatusIcon = (status: VideoUpload['status']) => {
    switch (status) {
      case 'uploading':
      case 'processing':
        return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>;
      case 'completed':
        return <Check className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5 text-blue-500" />
            Upload Videos to VPS Storage
          </CardTitle>
          <CardDescription>
            Upload videos directly to our high-performance VPS storage. 
            Videos are stored on dedicated servers with unlimited bandwidth.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Video Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Video Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Add a description for your video..."
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Privacy Settings */}
          <div className="space-y-2">
            <Label htmlFor="privacy">Privacy Level</Label>
            <select
              id="privacy"
              value={privacy}
              onChange={(e) => setPrivacy(e.target.value as any)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="public">Public - Anyone can view</option>
              <option value="followers">Followers Only</option>
              <option value="private">Private - Only you</option>
            </select>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="video-upload">Select Videos</Label>
            <input
              ref={fileInputRef}
              id="video-upload"
              type="file"
              accept="video/*"
              multiple
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose Video Files
            </Button>
            <p className="text-sm text-gray-500">
              Supports MP4, MOV, AVI, WebM. Max file size: 500MB per video
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Upload Queue */}
      {videos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Queue</CardTitle>
            <CardDescription>
              {videos.length} video{videos.length !== 1 ? 's' : ''} in queue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {videos.map((video) => (
                <div key={video.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    {getStatusIcon(video.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {video.file.name}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeVideo(video.id)}
                        disabled={video.status === 'uploading' || video.status === 'processing'}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500">
                      {(video.file.size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                    {video.status === 'uploading' || video.status === 'processing' ? (
                      <Progress value={video.progress} className="mt-2" />
                    ) : video.status === 'error' ? (
                      <p className="text-sm text-red-500 mt-1">{video.error}</p>
                    ) : video.status === 'completed' ? (
                      <p className="text-sm text-green-500 mt-1">Upload completed!</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Benefits */}
      <Card>
        <CardHeader>
          <CardTitle>VPS Storage Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Unlimited Storage</p>
                <p className="text-sm text-gray-600">No storage limits like Supabase</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">High Performance</p>
                <p className="text-sm text-gray-600">Dedicated VPS servers</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Fast Streaming</p>
                <p className="text-sm text-gray-600">CDN-optimized delivery</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Check className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">Better Control</p>
                <p className="text-sm text-gray-600">Custom Instagram-style interface</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}