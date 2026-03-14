'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

interface InstagramPost {
  id: number;
  instagram_url: string;
  embed_html: string;
  thumbnail_url: string;
  created_at: string;
}

interface InstagramManagerProps {
  user?: any;
}

export default function InstagramManager({ user }: InstagramManagerProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState('');
  const [adding, setAdding] = useState(false);

  // Create Supabase client with service role bypass
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });

  // Load Instagram posts
  const loadPosts = async () => {
    try {
      console.log('OPEN: Loading Instagram posts without authentication');
      
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Load posts error:', error);
        setError(`Failed to load posts: ${error.message}`);
      } else {
        console.log('OPEN: Posts loaded successfully:', data?.length || 0);
        setPosts(data || []);
        setError(null);
      }
    } catch (err) {
      console.error('Load posts exception:', err);
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Add new Instagram post
  const addPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setAdding(true);
    setError(null);

    try {
      console.log('OPEN: Adding Instagram post:', url);

      // Simple Instagram URL validation
      if (!url.includes('instagram.com/')) {
        throw new Error('Please enter a valid Instagram URL');
      }

      // Generate simple embed HTML (simplified version)
      const embedHtml = `<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="${url}" data-instgrm-version="14"><div><a href="${url}" target="_blank">View this post on Instagram</a></div></blockquote><script async src="//www.instagram.com/embed.js"></script>`;
      
      const thumbnailUrl = url.includes('reel') ? 
        'https://via.placeholder.com/400x400?text=Reel' : 
        'https://via.placeholder.com/400x400?text=Post';

      const postData = {
        instagram_url: url,
        embed_html: embedHtml,
        thumbnail_url: thumbnailUrl,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('instagram_posts')
        .insert([postData])
        .select()
        .single();

      if (error) {
        console.error('Add post error:', error);
        throw new Error(error.message);
      }

      console.log('OPEN: Post added successfully:', data);
      setPosts(prev => [data, ...prev]);
      setUrl('');
      setError(null);

    } catch (err) {
      console.error('Add post error:', err);
      setError(`Failed to add post: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setAdding(false);
    }
  };

  // Delete Instagram post
  const deletePost = async (id: number) => {
    if (!confirm('Are you sure you want to delete this Instagram post?')) {
      return;
    }

    try {
      console.log('OPEN: Deleting Instagram post:', id);

      const { error } = await supabase
        .from('instagram_posts')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Delete post error:', error);
        throw new Error(error.message);
      }

      console.log('OPEN: Post deleted successfully');
      setPosts(prev => prev.filter(post => post.id !== id));
      setError(null);

    } catch (err) {
      console.error('Delete post error:', err);
      setError(`Failed to delete post: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  // Initialize - load posts without authentication
  useEffect(() => {
    loadPosts();
  }, []);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Instagram Posts</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Instagram Posts</h3>
      
      {/* Add new post form */}
      <form onSubmit={addPost} className="mb-6">
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.instagram.com/p/ABC123/ or https://www.instagram.com/reel/ABC123/"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
            disabled={adding}
          />
          <button
            type="submit"
            disabled={adding || !url.trim()}
            className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {adding ? 'Adding...' : 'Add Post'}
          </button>
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2">{error}</p>
        )}
      </form>

      {/* Posts list */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No Instagram posts added yet. Add your first post above!
          </p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 break-all">{post.instagram_url}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Added on {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => deletePost(post.id)}
                  className="ml-2 text-red-500 hover:text-red-700 p-1"
                  title="Remove Instagram post"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="mt-3">
                <div 
                  className="instagram-embed-container"
                  dangerouslySetInnerHTML={{ __html: post.embed_html }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
