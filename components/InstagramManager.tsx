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
  Loader2,
  Sparkles,
  Zap,
  Target,
  ArrowRight
} from 'lucide-react';
import { createClient } from '@/lib/supabase-client';
import InstagramPosts from './InstagramPosts';
import { motion, AnimatePresence } from 'framer-motion';

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

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit.');
      return;
    }

    try {
      setIsUploading(true);
      const supabase = createClient();
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      const filePath = fileName;

      const { data, error: uploadError } = await supabase.storage
        .from('post-media')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('post-media')
        .getPublicUrl(filePath);

      setMediaUrl(publicUrl);
      setPostType(file.type.startsWith('video/') ? 'video' : 'image');
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(`Upload failure: ${error.message}`);
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
      const { error } = await supabase
        .from('instagram_posts')
        .insert({
          user_id: user.id,
          media_url: mediaUrl,
          caption: caption,
          post_type: postType
        } as any);

      if (error) throw error;

      setMediaUrl('');
      setCaption('');
      setPostType('image');
      loadPosts();
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      const supabase = createClient();
      const { error } = await supabase.from('instagram_posts').delete().eq('id', id);
      if (error) throw error;
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-10 bg-white/5 border border-white/5 rounded-[3rem] backdrop-blur-3xl shadow-3xl">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-3xl">
            <Instagram className="h-8 w-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Social Feed</h2>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Share your recent photos and videos with the community.</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white/5 p-2 rounded-[2rem] border border-white/5 mb-10 h-16">
          <TabsTrigger value="create" className="rounded-2xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-2xl transition-all font-black uppercase tracking-widest text-[9px]">
            <Plus className="h-3 w-3 mr-2" /> Add Post
          </TabsTrigger>
          <TabsTrigger value="manage" className="rounded-2xl data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-2xl transition-all font-black uppercase tracking-widest text-[9px]">
            <Target className="h-3 w-3 mr-2" /> Manage Feed
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-0">
          <Card className="bg-[#0b121e]/80 border-white/5 backdrop-blur-3xl rounded-[3.5rem] p-10 shadow-3xl">
            <CardHeader className="p-0 mb-10">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles size={14} className="text-blue-400" />
                <CardTitle className="text-xl font-black text-white italic uppercase tracking-tighter">Upload Media</CardTitle>
              </div>
              <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Add a new photo or video to your social feed.</CardDescription>
            </CardHeader>
            <CardContent className="p-0 space-y-10">
              <div className="space-y-4">
                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 italic">Select Media</Label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                      relative aspect-video rounded-[2.5rem] border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all overflow-hidden group/upload
                      ${mediaUrl ? 'border-blue-500/50 bg-blue-500/5' : 'border-white/10 hover:border-blue-500/40 bg-white/[0.02] hover:bg-white/[0.05]'}
                    `}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,video/*" className="hidden" />

                  {isUploading ? (
                    <div className="flex flex-col items-center space-y-4 animate-pulse">
                      <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />
                      <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.3em]">Uploading...</span>
                    </div>
                  ) : mediaUrl ? (
                    <div className="relative w-full h-full">
                      {postType === 'video' ? (
                        <video src={mediaUrl} className="w-full h-full object-cover" controls />
                      ) : (
                        <img src={mediaUrl} alt="P" className="w-full h-full object-cover" />
                      )}
                      <div className="absolute top-6 right-6 p-4 bg-[#050810]/80 backdrop-blur-3xl rounded-2xl border border-white/10 text-white shadow-3xl hover:scale-110 transition-transform" onClick={(e) => { e.stopPropagation(); setMediaUrl(''); }}>
                        <Plus className="h-4 w-4 rotate-45" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center space-y-6">
                      <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center border border-blue-500/20 group-hover/upload:scale-110 transition-transform">
                        <Upload className="h-8 w-8 text-blue-400" />
                      </div>
                      <div className="text-center">
                        <span className="block text-sm font-black text-white italic uppercase tracking-tighter">Select Photo or Video</span>
                        <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest mt-2">{'{ Image | Video | Max 10MB }'}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <Label htmlFor="caption" className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 italic">Caption</Label>
                <Textarea
                  id="caption"
                  placeholder="What's on your mind?"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-blue-500/50 text-white rounded-[1.5rem] px-6 py-4 font-bold tracking-tight h-24 focus:outline-none transition-all resize-none shadow-inner"
                />
              </div>

              <div className="pt-4">
                <Button
                  onClick={handleCreatePost}
                  disabled={!mediaUrl || isSubmitting}
                  className="w-full h-16 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl shadow-blue-500/20 border-none transition-all"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating post...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Zap className="h-4 w-4" />
                      Share Post
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="mt-0">
          <div className="space-y-8">
            {posts.length === 0 ? (
              <Card className="bg-white/5 border-white/10 rounded-[3rem] p-16 text-center italic font-black uppercase tracking-widest text-[10px] text-slate-600">
                No posts found in your feed.
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={post.id}
                    className="group/item relative rounded-[2.5rem] overflow-hidden bg-white/5 border border-white/5 shadow-3xl h-[400px]"
                  >
                    {post.post_type === 'image' && (
                      <img src={post.media_url} alt="N" className="w-full h-full object-cover transition-transform duration-700 group-hover/item:scale-110" />
                    )}
                    {post.post_type === 'video' && (
                      <video src={post.media_url} className="w-full h-full object-cover" controls />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity flex flex-col justify-end p-8 gap-4">
                      <p className="text-xs font-bold text-white uppercase italic tracking-tight line-clamp-2">
                        {post.caption || 'No caption'}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-black text-blue-400 uppercase tracking-widest">{post.post_type.toUpperCase()}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletePost(post.id)}
                          className="h-10 w-10 bg-rose-500/20 hover:bg-rose-500 text-rose-500 hover:text-white rounded-xl transition-all border border-rose-500/20"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Live Preview of Feed */}
      <div className="mt-24 space-y-10">
        <div className="flex items-center gap-4 px-2">
          <div className="h-1.5 w-12 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
          <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Live Preview</h3>
        </div>
        <div className="p-10 bg-white/[0.02] border border-white/5 rounded-[4rem] backdrop-blur-3xl shadow- inner">
          <InstagramPosts userId={user.id} showHeader={false} />
        </div>
      </div>
    </div>
  );
}