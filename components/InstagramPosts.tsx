'use client';

import React, { useState, useEffect } from 'react';
import './InstagramPosts.css';
import { Video, Image as ImageIcon, Instagram } from 'lucide-react';

// TypeScript declarations for Instagram global object
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process(): void;
      };
    };
  }
}

interface InstagramPost {
  id: string;
  media_url: string;
  post_type: 'instagram' | 'video' | 'image';
  embed_html?: string;
  thumbnail_url?: string;
  caption?: string;
  created_at: string;
}

interface InstagramPostsProps {
  userId?: string;
  showHeader?: boolean;
}

export default function InstagramPosts({ userId, showHeader = true }: InstagramPostsProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load posts
  const loadPosts = async () => {
    try {
      setLoading(true);
      setError('');

      let url = '/api/instagram-posts';
      if (userId) {
        url = `/api/public/instagram-posts?user_id=${userId}`;
      }

      const response = await fetch(url);

      if (!response.ok) {
        if (response.status === 401 && !userId) {
          setPosts([]);
          return;
        }
        throw new Error('Failed to fetch posts');
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error loading posts:', error);
      if (!userId) {
        setError('Failed to load posts');
      }
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Instagram script loading removed
  useEffect(() => {
    // No-op
  }, [userId, posts]);

  useEffect(() => {
    loadPosts();
  }, [userId]);

  const renderPost = (post: InstagramPost) => {
    // Default to instagram if type is missing (backward compatibility)
    const type = post.post_type || 'instagram';

    if (type === 'image') {
      return (
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
          <img
            src={post.media_url}
            alt={post.caption || 'Post'}
            className="w-full h-auto object-cover"
            loading="lazy"
          />
          {post.caption && (
            <div className="p-3">
              <p className="text-sm text-gray-800">{post.caption}</p>
            </div>
          )}
        </div>
      );
    }

    if (type === 'video') {
      return (
        <div className="w-full max-w-md mx-auto bg-black rounded-lg shadow-sm overflow-hidden">
          <video
            src={post.media_url}
            controls
            className="w-full h-auto max-h-[600px]"
            poster={post.thumbnail_url}
          >
            Your browser does not support the video tag.
          </video>
          {post.caption && (
            <div className="p-3 bg-white">
              <p className="text-sm text-gray-800">{post.caption}</p>
            </div>
          )}
        </div>
      );
    }

    // Instagram support removed - hide Instagram posts
    const instagramUrlPattern = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/.+/;
    if (type === 'instagram' || instagramUrlPattern.test(post.media_url)) {
      return null;
    }

    return null;
  };

  if (loading) {
    return (
      <div className="instagram-posts-section">
        {showHeader && (
          <h3 className="text-lg font-semibold mb-4">Social Feed</h3>
        )}
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="instagram-posts-section">
        {showHeader && (
          <h3 className="text-lg font-semibold mb-4">Social Feed</h3>
        )}
        <p className="text-red-500 text-center py-4">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="instagram-posts-section">
        {showHeader && (
          <h3 className="text-lg font-semibold mb-4">Social Feed</h3>
        )}
        <p className="text-gray-500 text-center py-8">
          No posts to display.
        </p>
      </div>
    );
  }

  return (
    <div className="instagram-posts-section">
      {showHeader && (
        <div className="flex items-center gap-2 mb-4">
          <Instagram className="w-6 h-6 text-pink-500" />
          <h3 className="text-lg font-semibold">Social Feed</h3>
        </div>
      )}

      <div className="flex flex-col gap-6">
        {posts.filter(post => {
          const type = post.post_type || 'instagram';
          const instagramUrlPattern = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/.+/;
          return !(type === 'instagram' || instagramUrlPattern.test(post.media_url));
        }).length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No posts to display.
          </p>
        ) : (
          posts.map((post) => {
            const content = renderPost(post);
            if (!content) return null;
            return (
              <div key={post.id} className="instagram-post-wrapper w-full">
                {content}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}