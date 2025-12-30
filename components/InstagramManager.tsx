'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Instagram,
  Video,
  Image as ImageIcon,
  Plus,
  Trash2,
  ExternalLink,
  Upload,
  Camera,
  Loader2
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import InstagramPosts from './InstagramPosts';

interface SocialPost {
  id: string;
  user_id: string;
  media_url: string;
  post_type: 'instagram' | 'video' | 'image';
  caption: string | null;
  created_at: string;
}

interface InstagramManagerProps {
  user: any;
}

export default function InstagramManager({ user }: InstagramManagerProps) {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Form State
  const [mediaUrl, setMediaUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [postType, setPostType] = useState<'instagram' | 'video' | 'image'>('image');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      const result = await supabase
        .from('instagram_posts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (result.error) throw result.error;
      setPosts(result.data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }

    try {
      setIsUploading(true);
      const supabase = createClient();

      // Create a unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = fileName;

      // Upload to Supabase Storage
      const { data, error: uploadError } = await supabase.storage
        .from('post-media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        if (uploadError.message === 'Bucket not found') {
          throw new Error('Support bucket "post-media" not found. Please ensure a public bucket named "post-media" exists in your Supabase dashboard.');
        }
        throw uploadError;
      }

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-media')
        .getPublicUrl(filePath);

      setMediaUrl(publicUrl);
      setPostType(file.type.startsWith('video/') ? 'video' : 'image');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(`Failed to upload media: ${error.message}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCreatePost = async () => {
    if (!mediaUrl) return;

    try {
      setIsSubmitting(true);
      const supabase = createClient();

      // Auto-detect type if needed, but we have a selector
      let finalType = postType;

      const { error } = await supabase
        .from('instagram_posts')
        .insert({
          user_id: user.id,
          media_url: mediaUrl,
          caption: caption,
          post_type: finalType
        } as any);

      if (error) throw error;

      // Reset form
      setMediaUrl('');
      setCaption('');
      setPostType('image');

      // Reload posts
      loadPosts();

      // Switch to posts tab (optional, or just show success)
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Failed to create post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('instagram_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Instagram className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Social Media Manager</h2>
            <p className="text-sm text-gray-600">Manage your social feed and content</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>Create Post</span>
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center space-x-2">
            <ExternalLink className="h-4 w-4" />
            <span>Manage Posts</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
              <CardDescription>
                Upload an image or video to share on your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Label>Media Content</Label>

                {/* Upload Section */}
                <div className="w-full">
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                      relative aspect-video rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all
                      ${mediaUrl ? 'border-primary-500 bg-primary-50/50' : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'}
                    `}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*,video/*"
                      className="hidden"
                    />

                    {isUploading ? (
                      <div className="flex flex-col items-center space-y-2">
                        <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
                        <span className="text-sm font-medium text-gray-600">Uploading to post-media...</span>
                      </div>
                    ) : mediaUrl ? (
                      <div className="relative w-full h-full p-2">
                        {postType === 'video' ? (
                          <video
                            src={mediaUrl}
                            className="w-full h-full object-contain rounded-lg"
                            controls
                          />
                        ) : (
                          <img
                            src={mediaUrl}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        )}
                        <div className="absolute top-4 right-4 bg-primary-500 text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform" onClick={(e) => { e.stopPropagation(); setMediaUrl(''); }}>
                          <Plus className="h-4 w-4 rotate-45" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-3">
                        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                          <Upload className="h-8 w-8 text-primary-600" />
                        </div>
                        <div className="text-center px-4">
                          <span className="block text-base font-semibold text-gray-900">Click to upload media</span>
                          <span className="block text-sm text-gray-500 mt-1">Images or Videos (max 5MB)</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption">Caption (Optional)</Label>
                <Textarea
                  id="caption"
                  placeholder="Write a caption..."
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  rows={3}
                />
              </div>

              <Button
                onClick={handleCreatePost}
                disabled={!mediaUrl || isSubmitting}
                className="w-full h-11 text-base font-medium"
              >
                {isSubmitting ? 'Creating...' : 'Create Post'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-6">
          <div className="space-y-4">
            {posts.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-gray-500">
                  No posts yet. Create one to get started!
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {posts.map((post) => (
                  <Card key={post.id} className="overflow-hidden">
                    <CardContent className="p-0 relative group">
                      {/* Preview based on type */}
                      <div className="aspect-square bg-gray-100 relative">
                        {post.post_type === 'image' && (
                          <img src={post.media_url} alt={post.caption || 'Post'} className="w-full h-full object-cover" />
                        )}
                        {post.post_type === 'video' && (
                          <video src={post.media_url} className="w-full h-full object-cover" />
                        )}
                        {post.post_type === 'instagram' && (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <Instagram className="h-12 w-12" />
                          </div>
                        )}

                        {/* Overlay Actions */}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDeletePost(post.id)}
                          >
                            <Trash2 className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="p-3">
                        <p className="text-sm text-gray-600 line-clamp-2">{post.caption || 'No caption'}</p>
                        <p className="text-xs text-gray-400 mt-1 capitalize">{post.post_type}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Live Preview of Feed */}
      <div className="mt-12">
        <h3 className="text-lg font-semibold mb-4">Your Feed Preview</h3>
        <InstagramPosts userId={user.id} showHeader={false} />
      </div>
    </div>
  );
}