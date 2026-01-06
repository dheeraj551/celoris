"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Mail, ChevronLeft, ChevronRight, Crown, ShieldCheck, MapPin, Instagram, Sparkles, Zap, ArrowLeft, MoreHorizontal, UserPlus } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { motion, AnimatePresence } from "framer-motion"
import { PageWrapper } from "@/components/PageWrapper"

interface UserProfile {
  user_id: string
  username: string
  full_name: string
  bio: string
  profile_pic_url: string
  location: string
  is_creator: boolean
  is_premium: boolean
  avatar_url?: string
}

interface SocialPost {
  id: string
  media_url: string
  caption: string
}

import { useAuth } from "@/components/providers/AuthProvider"

export default function DiscoverPage() {
  const { user, profile } = useAuth()
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [sendingRequest, setSendingRequest] = useState(false)
  const [liking, setLiking] = useState(false)
  const [socialPosts, setSocialPosts] = useState<SocialPost[]>([])
  const router = useRouter()

  const currentProfile = profiles[currentIndex]

  useEffect(() => {
    if (user) {
      loadProfiles()
    }
  }, [user])

  useEffect(() => {
    if (currentProfile) {
      loadSocialPosts(currentProfile.user_id)
    }
  }, [currentIndex, currentProfile])

  const loadProfiles = async () => {
    if (!user) return
    try {
      const supabase = createClient()
      const { data: swipedData } = await supabase
        .from('swipes')
        .select('target_user_id')
        .eq('swiper_id', user.id)

      const swipedIds = (swipedData as any[])?.map((s: any) => s.target_user_id) || []
      swipedIds.push(user.id)

      let query = supabase
        .from('users')
        .select('id, username, full_name, bio, profile_pic_url, location, subscription_status, verification_status')
        .neq('is_social_blocked', true)

      if (swipedIds.length > 0) {
        query = query.not('id', 'in', `(${swipedIds.join(',')})`)
      }

      const { data: availableProfiles } = await query.limit(50)

      if (availableProfiles) {
        const profilesWithAvatars = await Promise.all(
          (availableProfiles as any[]).map(async (profile: any) => {
            let avatar_url = undefined
            if (profile.profile_pic_url) {
              if (profile.profile_pic_url.startsWith('http')) {
                avatar_url = profile.profile_pic_url
              } else {
                const { data: publicUrlData } = supabase.storage
                  .from('avatars')
                  .getPublicUrl(profile.profile_pic_url)
                avatar_url = publicUrlData.publicUrl
              }
            }

            return {
              user_id: profile.id,
              username: profile.username,
              full_name: profile.full_name,
              bio: profile.bio,
              profile_pic_url: profile.profile_pic_url,
              location: profile.location,
              is_creator: profile.verification_status === 'verified',
              is_premium: profile.subscription_status === 'premium',
              avatar_url
            }
          })
        )
        setProfiles(profilesWithAvatars)
      }
    } catch (error) {
      console.error('Error loading profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSocialPosts = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data: posts } = await supabase
        .from('social_posts')
        .select('id, media_url, caption')
        .eq('user_id', userId)
        .limit(3)

      if (posts) {
        setSocialPosts(posts)
      }
    } catch (error) {
      console.error('Error loading social posts:', error)
      setSocialPosts([])
    }
  }

  const handleLikeProfile = async () => {
    if (!user || !currentProfile) return
    setLiking(true)
    try {
      const supabase = createClient()
      await supabase.from('swipes').insert({
        swiper_id: user.id,
        target_user_id: currentProfile.user_id,
        direction: 'like'
      } as any)

      const { data: oppositeSwipe } = await supabase
        .from('swipes')
        .select('*')
        .eq('swiper_id', currentProfile.user_id)
        .eq('target_user_id', user.id)
        .eq('direction', 'like')
        .single()

      if (oppositeSwipe) {
        await supabase.from('matches').insert({
          user1_id: user.id,
          user2_id: currentProfile.user_id
        } as any)
      }
      handleNext()
    } catch (error) {
      console.error('Error liking profile:', error)
    } finally {
      setLiking(false)
    }
  }

  const handleSendMessage = async () => {
    if (!user || !currentProfile) return
    setSendingRequest(true)
    try {
      const supabase = createClient()
      await supabase.from('swipes').insert({
        swiper_id: user.id,
        target_user_id: currentProfile.user_id,
        direction: 'like'
      } as any)

      const { data: oppositeSwipe } = await supabase
        .from('swipes')
        .select('*')
        .eq('swiper_id', currentProfile.user_id)
        .eq('target_user_id', user.id)
        .eq('direction', 'like')
        .single()

      if (oppositeSwipe) {
        await supabase.from('matches').insert({
          user1_id: user.id,
          user2_id: currentProfile.user_id
        } as any)
        router.push('/social/chat')
      } else {
        handleNext()
      }
    } catch (error) {
      console.error('Error sending request:', error)
    } finally {
      setSendingRequest(false)
    }
  }

  const handleNext = () => {
    if (currentIndex < profiles.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      setCurrentIndex(profiles.length)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full mx-auto mb-6"
          />
          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Finding New People...</p>
        </div>
      </div>
    )
  }

  if (currentIndex >= profiles.length) {
    return (
      <PageWrapper className="min-h-screen bg-[#050810] flex items-center justify-center p-6 text-white text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#0d1321]/60 backdrop-blur-2xl border border-white/5 rounded-[3rem] p-12 shadow-2xl"
        >
          <div className="w-24 h-24 bg-emerald-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 text-emerald-500 shadow-2xl shadow-emerald-500/10">
            <Sparkles size={48} />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4">No More Profiles</h2>
          <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
            You've seen everyone available for now! <br /> Check back soon to meet new people.
          </p>
          <Button
            onClick={() => router.push('/social')}
            className="bg-emerald-600 hover:bg-emerald-500 text-white h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/20"
          >
            Return to Social
          </Button>
        </motion.div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper className="min-h-screen bg-[#050810] py-12 px-6 relative overflow-hidden font-sans">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-teal-600/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px]"
        />
      </div>

      <div className="container mx-auto max-w-xl relative z-10">
        {/* Header/Navigation */}
        <header className="flex items-center justify-between mb-12">
          <motion.div whileHover={{ x: -2 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push('/social')}
              className="bg-white/5 hover:bg-white/10 rounded-2xl h-12 w-12 border border-white/5"
            >
              <ArrowLeft className="h-5 w-5 text-slate-300" />
            </Button>
          </motion.div>

          <div className="text-center space-y-1">
            <h1 className="text-xl font-black text-white italic uppercase tracking-tighter">Discover People</h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-1 w-20 bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-emerald-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentIndex + 1) / profiles.length) * 100}%` }}
                />
              </div>
              <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{currentIndex + 1} / {profiles.length}</span>
            </div>
          </div>

          <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-2xl h-12 w-12">
            <MoreHorizontal size={24} />
          </Button>
        </header>

        {/* Profile Card Area */}
        <div className="relative h-[650px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, x: liking ? 200 : -200, rotate: liking ? 10 : -10 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="absolute inset-0"
            >
              <Card className="h-full bg-[#0d1321]/80 backdrop-blur-3xl border-white/10 rounded-[3.5rem] overflow-hidden shadow-[0_32px_120px_rgba(0,0,0,0.5)] flex flex-col">
                <CardContent className="p-0 flex-1 flex flex-col relative">
                  {/* Profile Visuals */}
                  <div className="relative h-2/3">
                    <img
                      src={currentProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentProfile.full_name)}&background=6366f1&color=fff&size=400`}
                      alt={currentProfile.full_name}
                      className="w-full h-full object-cover select-none pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0d1321] via-[#0d1321]/20 to-transparent" />

                    {/* Status Overlays */}
                    <div className="absolute bottom-10 left-10 p-2 space-y-4">
                      <div className="flex gap-2">
                        {currentProfile.is_premium && (
                          <span className="inline-flex items-center gap-2 bg-emerald-600/90 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-md">
                            <Crown size={12} className="fill-white" /> ELITE
                          </span>
                        )}
                        {currentProfile.is_creator && (
                          <span className="inline-flex items-center gap-2 bg-emerald-500/90 text-white px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-2xl backdrop-blur-md">
                            <ShieldCheck size={12} /> VERIFIED
                          </span>
                        )}
                      </div>
                      <h2 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter drop-shadow-2xl">
                        {currentProfile.full_name}
                      </h2>
                      {currentProfile.location && (
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest bg-black/30 backdrop-blur-xl w-fit px-3 py-1.5 rounded-xl border border-white/5 shadow-2xl">
                          <MapPin size={12} className="text-emerald-500" />
                          {currentProfile.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bio & Actions */}
                  <div className="p-10 flex-1 flex flex-col justify-between">
                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                        <Sparkles size={12} className="text-emerald-500" /> About
                      </h3>
                      <p className="text-white text-sm leading-relaxed font-medium italic pr-6 h-12 overflow-hidden line-clamp-2">
                        "{currentProfile.bio || 'This user hasn\'t added a bio yet.'}"
                      </p>
                    </div>

                    {/* Action HUD */}
                    <div className="flex gap-4">
                      <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={handleSendMessage}
                          disabled={sendingRequest}
                          className="w-full h-16 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all"
                        >
                          {sendingRequest ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          ) : (
                            <>
                              <UserPlus size={18} className="text-emerald-500" />
                              Send Request
                            </>
                          )}
                        </Button>
                      </motion.div>
                      <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={handleLikeProfile}
                          disabled={liking}
                          className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all border-none"
                        >
                          {liking ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                          ) : (
                            <>
                              <Heart size={18} className="fill-white" />
                              LIKE
                            </>
                          )}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dynamic Social Grid (If available) */}
        {socialPosts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-3">
                <Instagram size={14} className="text-pink-400" />
                Recent Posts
              </h3>
              <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
                <ChevronRight className="h-5 w-5 text-slate-500" />
              </motion.div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-2 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-3xl shadow-2xl">
              {socialPosts.map((post, idx) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -5, scale: 1.05 }}
                  className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer border border-white/5"
                >
                  <img
                    src={post.media_url}
                    alt={post.caption || 'Signal fragment'}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                    <p className="text-[8px] font-black text-white uppercase italic tracking-tighter truncate w-full">
                      {post.caption || 'POST ' + (idx + 1)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer Navigation */}
        <footer className="mt-12 flex items-center justify-center gap-12">
          <motion.div whileHover={{ x: -10 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="group flex flex-col items-center gap-2 text-slate-600 hover:text-white transition-all disabled:opacity-20"
            >
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
                <ChevronLeft size={24} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Previous</span>
            </Button>
          </motion.div>

          <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              onClick={handleNext}
              disabled={currentIndex === profiles.length}
              className="group flex flex-col items-center gap-2 text-slate-600 hover:text-white transition-all disabled:opacity-20"
            >
              <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
                <ChevronRight size={24} />
              </div>
              <span className="text-[9px] font-black uppercase tracking-[0.2em]">Next</span>
            </Button>
          </motion.div>
        </footer>
      </div>
    </PageWrapper>
  )
}
