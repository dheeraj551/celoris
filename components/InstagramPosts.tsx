'use client';

import React, { useState, useEffect } from 'react';
import './InstagramPosts.css';

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
  id: number;
  instagram_url: string;
  embed_html: string;
  thumbnail_url: string;
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

  // Load Instagram posts
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
          // No session for admin view - this is expected
          setPosts([]);
          return;
        }
        throw new Error('Failed to fetch Instagram posts');
      }

      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error loading Instagram posts:', error);
      if (!userId) {
        setError('Failed to load Instagram posts');
      }
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load Instagram embed script properly
  useEffect(() => {
    if (userId && posts.length > 0) {
      const loadInstagramScript = () => {
        // Check if script already exists
        const existingScript = document.querySelector('script[src*="instagram.com/embed"]');
        
        if (!existingScript) {
          // Load the Instagram embed script with proper protocol
          const script = document.createElement('script');
          script.src = 'https://www.instagram.com/embed.js';
          script.async = true;
          script.onload = () => {
            console.log('Instagram embed script loaded successfully');
            // Process embeds after script loads
            setTimeout(() => {
              if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === 'function') {
                window.instgrm.Embeds.process();
                console.log('Instagram embeds processed');
              }
            }, 200);
          };
          script.onerror = () => {
            console.error('Failed to load Instagram embed script');
          };
          document.head.appendChild(script);
        } else {
          // Script already loaded, process immediately
          setTimeout(() => {
            if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === 'function') {
              window.instgrm.Embeds.process();
              console.log('Instagram embeds processed (script existed)');
            }
          }, 200);
        }
      };

      // Load script after a small delay to ensure DOM is ready
      setTimeout(loadInstagramScript, 200);
    }
  }, [userId, posts.length]);

  useEffect(() => {
    loadPosts();
  }, [userId]);

  // Process Instagram embeds when posts change
  useEffect(() => {
    if (userId && posts.length > 0) {
      setTimeout(() => {
        if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === 'function') {
          window.instgrm.Embeds.process();
        }
      }, 200);
    }
  }, [posts]);

  // Public view - use official Instagram embed structure
  const createPublicEmbed = (url: string) => {
    const instagramUrlPattern = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/.+/;
    if (!instagramUrlPattern.test(url)) {
      return null;
    }

    return (
      <div className="instagram-embed-wrapper w-full flex justify-center">
        <div className="instagram-post-container max-w-md w-full">
          <blockquote 
            className="instagram-media" 
            data-instgrm-permalink={url}
            data-instgrm-version="14"
            data-instgrm-captioned="true"
            style={{ 
              background: '#fff', 
              border: '0', 
              borderRadius: '3px', 
              boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)', 
              margin: '1px', 
              maxWidth: '540px', 
              minWidth: '326px', 
              padding: '0',
              width: 'calc(100% - 2px)'
            }}
          />
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="instagram-posts-section">
        {showHeader && (
          <h3 className="text-lg font-semibold mb-4">Instagram Posts</h3>
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
          <h3 className="text-lg font-semibold mb-4">Instagram Posts</h3>
        )}
        <p className="text-red-500 text-center py-4">{error}</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="instagram-posts-section">
        {showHeader && (
          <h3 className="text-lg font-semibold mb-4">Instagram Posts</h3>
        )}
        <p className="text-gray-500 text-center py-8">
          No Instagram posts to display.
        </p>
      </div>
    );
  }

  return (
    <div className="instagram-posts-section">
      {showHeader && (
        <div className="flex items-center gap-2 mb-4">
          <svg className="w-6 h-6 text-pink-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <h3 className="text-lg font-semibold">Instagram Posts</h3>
        </div>
      )}
      
      <div className="flex flex-col gap-6">
        {posts.map((post) => (
          <div key={post.id} className="instagram-post-wrapper w-full">
            {userId ? (
              // Public view - use responsive embed
              createPublicEmbed(post.instagram_url)
            ) : (
              // Admin view - use stored embed HTML
              <div 
                className="instagram-embed-container"
                dangerouslySetInnerHTML={{ __html: post.embed_html }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}