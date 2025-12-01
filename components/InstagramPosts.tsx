"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { Instagram, Video, Image as ImageIcon, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface SocialPost {
  id: string
  user_id: string
  media_url: string
  post_type: 'instagram' | 'video' | 'image'
  caption: string | null
  created_at: string
}

interface InstagramPostsProps {
  userId: string
  showHeader?: boolean
}

export default function InstagramPosts({ userId, showHeader = true }: InstagramPostsProps) {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null)

  useEffect(() => {
    if (userId) {
      loadPosts()
    }
  }, [userId])

  const loadPosts = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('instagram_posts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPosts(data || [])
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderPost = (post: SocialPost) => {
    // For images and videos, we render a preview card
    if (post.post_type === 'image' || post.post_type === 'video') {
      return (
        <Card
          className="overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => setSelectedPost(post)}
        >
          <CardContent className="p-0 relative aspect-square group">
            {post.post_type === 'image' ? (
              <img
                src={post.media_url}
                alt={post.caption || 'Post'}
                className="w-full h-full object-cover"
              />
            ) : (
              <video
                src={post.media_url}
                className="w-full h-full object-cover"
              />
            )}
            {post.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-white text-xs truncate">{post.caption}</p>
              </div>
            )}
            <div className="absolute top-2 right-2 bg-black/50 p-1 rounded-full">
              {post.post_type === 'video' ? <Video className="w-3 h-3 text-white" /> : <ImageIcon className="w-3 h-3 text-white" />}
            </div>
          </CardContent>
          {post.caption && (
            <div className="p-3 border-t">
              <p className="text-sm text-gray-600 line-clamp-2">{post.caption}</p>
            </div>
          )}
        </Card>
      )
    }

    return null
  }

  if (loading) {
    return <div className="text-center py-4">Loading posts...</div>
  }

  return (
    <div className="w-full">
      {showHeader && (
        <div className="flex items-center gap-2 mb-4">
          <Instagram className="w-6 h-6 text-pink-600" />
          <h3 className="text-xl font-bold">My Instagram Posts</h3>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.filter(post => {
          const type = post.post_type || 'instagram';
          const instagramUrlPattern = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/.+/;
          return !(type === 'instagram' || instagramUrlPattern.test(post.media_url));
        }).length === 0 ? (
          <p className="text-gray-500 text-center py-8 col-span-full">
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

      {/* Zoom Modal */}
      {selectedPost && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPost(null)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 p-2"
            onClick={() => setSelectedPost(null)}
          >
            <X className="w-8 h-8" />
          </button>

          <div
            className="max-w-4xl w-full max-h-[90vh] flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <div className="relative w-full h-full flex items-center justify-center bg-black rounded-lg overflow-hidden">
              {selectedPost.post_type === 'image' ? (
                <img
                  src={selectedPost.media_url}
                  alt={selectedPost.caption || 'Full size post'}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              ) : (
                <video
                  src={selectedPost.media_url}
                  controls
                  autoPlay
                  className="max-w-full max-h-[80vh]"
                />
              )}
            </div>

            {selectedPost.caption && (
              <div className="mt-4 bg-white/10 backdrop-blur-sm p-4 rounded-lg w-full max-w-2xl">
                <p className="text-white text-center">{selectedPost.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}