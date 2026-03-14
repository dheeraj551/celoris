"use client"

import { useState, useEffect, useRef } from "react"
import { createClient } from "@/lib/supabase-client"
import { Instagram, Video, Image as ImageIcon, X, Sparkles, Maximize2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

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
  displayMode?: 'grid' | 'horizontal'
  autoScroll?: boolean
}

export default function InstagramPosts({ userId, showHeader = true, displayMode = 'grid', autoScroll = false }: InstagramPostsProps) {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPost, setSelectedPost] = useState<SocialPost | null>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (displayMode === 'horizontal' && autoScroll && !isHovered && posts.length > 0) {
      const scrollContainer = scrollContainerRef.current
      if (!scrollContainer) return

      let animationFrameId: number;

      const scroll = () => {
        if (scrollContainer) {
          if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth) {
            scrollContainer.scrollLeft = 0;
          } else {
            scrollContainer.scrollLeft += 0.5;
          }
          animationFrameId = requestAnimationFrame(scroll);
        }
      };

      animationFrameId = requestAnimationFrame(scroll);

      return () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
      }
    }
  }, [displayMode, autoScroll, isHovered, posts.length])

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
    if (post.post_type === 'image' || post.post_type === 'video') {
      return (
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          className="group/card relative rounded-[2rem] overflow-hidden bg-[#0d1321]/40 border border-white/5 backdrop-blur-3xl shadow-3xl h-full"
          onClick={() => setSelectedPost(post)}
        >
          <div className="aspect-square relative flex items-center justify-center overflow-hidden">
            {post.post_type === 'image' ? (
              <img
                src={post.media_url}
                alt={post.caption || 'Post'}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                draggable={false}
              />
            ) : (
              <video
                src={post.media_url}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
              />
            )}

            {/* Dark Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#050810]/90 via-[#050810]/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex flex-col justify-end p-6 gap-3">
              <div className="flex items-center gap-2">
                <Maximize2 size={12} className="text-blue-400" />
                <span className="text-[9px] font-black text-white uppercase tracking-widest">EXPAND_FRAGMENT</span>
              </div>
              {post.caption && (
                <p className="text-white text-[11px] font-bold italic line-clamp-2 leading-relaxed">
                  "{post.caption}"
                </p>
              )}
            </div>

            {/* Type Icon Badge */}
            <div className="absolute top-4 right-4 bg-[#050810]/60 backdrop-blur-xl p-2.5 rounded-xl border border-white/10 shadow-3xl text-blue-400">
              {post.post_type === 'video' ? <Video className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
            </div>
          </div>

          {post.caption && (
            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest line-clamp-1 italic">
                {post.caption}
              </p>
            </div>
          )}
        </motion.div>
      )
    }
    return null
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent shadow-3xl"></div>
        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">RETRIEVING_DATA_STREAM...</span>
      </div>
    );
  }

  const filteredPosts = posts.filter(post => {
    const type = post.post_type || 'instagram';
    const instagramUrlPattern = /^https?:\/\/(www\.)?instagram\.com\/(p|reel|tv)\/.+/;
    return !(type === 'instagram' || instagramUrlPattern.test(post.media_url));
  });

  return (
    <div className="w-full relative">
      {showHeader && (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-pink-500/10 rounded-2xl border border-pink-500/20 shadow-3xl">
              <Instagram className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Identity Log</h3>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">NESTED NEURAL FRAGMENTS DETECTED.</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 px-6 py-2.5 rounded-full border border-white/5">
            <Sparkles size={12} className="text-blue-400" />
            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest italic">{filteredPosts.length} FRAGMENTS</span>
          </div>
        </div>
      )}

      <div
        ref={scrollContainerRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={displayMode === 'grid'
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          : "flex overflow-x-auto gap-8 pb-10 snap-x custom-scrollbar-h"
        }>
        {filteredPosts.length === 0 ? (
          <div className="p-20 text-center col-span-full w-full bg-white/[0.02] border border-white/5 rounded-[3rem] italic">
            <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
              NO FRAGMENTS CACHED IN THIS SECTOR.
            </p>
          </div>
        ) : (
          filteredPosts.map((post) => (
            <div key={post.id} className={displayMode === 'grid'
              ? "instagram-post-wrapper w-full h-full"
              : "instagram-post-wrapper w-72 flex-shrink-0 snap-center h-full"
            }>
              {renderPost(post)}
            </div>
          ))
        )}
      </div>

      {/* Modern Dark Zoom Modal */}
      <AnimatePresence>
        {selectedPost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#050810]/95 backdrop-blur-2xl z-[100] flex items-center justify-center p-6 md:p-12"
            onClick={() => setSelectedPost(null)}
          >
            <div className="absolute top-10 right-10 flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedPost(null)}
                className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-white/10 text-white shadow-3xl"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="max-w-5xl w-full h-full flex flex-col md:flex-row items-stretch bg-[#0d1321] rounded-[4rem] overflow-hidden shadow-[0_64px_200px_rgba(0,0,0,0.8)] border border-white/10"
              onClick={e => e.stopPropagation()}
            >
              {/* Visual Content */}
              <div className="flex-[1.5] bg-black relative flex items-center justify-center overflow-hidden">
                {selectedPost.post_type === 'image' ? (
                  <img
                    src={selectedPost.media_url}
                    alt="Full"
                    className="max-w-full max-h-full object-contain shadow-2xl"
                  />
                ) : (
                  <video
                    src={selectedPost.media_url}
                    controls
                    autoPlay
                    className="max-w-full max-h-full"
                  />
                )}
                <div className="absolute top-8 left-8 p-3 bg-blue-600 rounded-2xl shadow-3xl">
                  {selectedPost.post_type === 'video' ? <Video className="w-5 h-5 text-white" /> : <ImageIcon className="w-5 h-5 text-white" />}
                </div>
              </div>

              {/* Metadata Content */}
              <div className="flex-1 p-12 flex flex-col justify-between border-l border-white/5">
                <div className="space-y-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Sparkles size={14} className="text-blue-500" />
                      <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">FRAGMENT_DETAILS</h4>
                    </div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-tight pr-10">
                      NODE_DATA_{selectedPost.id.slice(0, 8).toUpperCase()}
                    </h2>
                  </div>

                  <div className="space-y-4">
                    <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">DESCRIPTIVE_ANNOTATION</span>
                    <p className="text-lg text-slate-300 font-medium italic leading-relaxed">
                      {selectedPost.caption ? `"${selectedPost.caption}"` : 'NO_DESCRIPTION_CACHED.'}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <span className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">TYPE: {selectedPost.post_type.toUpperCase()}</span>
                    <span className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-[9px] font-black text-slate-400 uppercase tracking-widest">SYNC_DATE: {new Date(selectedPost.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                <div className="pt-10">
                  <Button
                    onClick={() => setSelectedPost(null)}
                    className="w-full h-16 bg-white/5 hover:bg-white/10 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] border border-white/10 transition-all"
                  >
                    CLOSE_BROADCAST
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar-h::-webkit-scrollbar {
            height: 4px;
        }
        .custom-scrollbar-h::-webkit-scrollbar-track {
            background: transparent;
        }
        .custom-scrollbar-h::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.05);
            border-radius: 10px;
        }
        .custom-scrollbar-h::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.1);
        }
      `}</style>
    </div>
  )
}
