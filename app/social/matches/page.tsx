"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Heart,
  MessageCircle,
  Video,
  Phone,
  MapPin,
  Clock,
  DollarSign,
  Gift,
  Crown,
  Star,
  Instagram,
  Eye,
  MoreHorizontal,
  X,
  UserPlus,
  Check,
  UserX,
  Sparkles,
  Zap,
  ArrowRight,
  Users
} from "lucide-react"
import { usePresence } from "@/components/providers/PresenceProvider"
import { useAuth } from "@/components/providers/AuthProvider"
import { motion, AnimatePresence } from "framer-motion"
import { PageWrapper } from "@/components/PageWrapper"

interface Match {
  id: string
  user1_id: string
  user2_id: string
  is_mutual: boolean
  created_at: string
  last_message_at?: string
  user: {
    id: string
    username: string
    full_name: string
    bio: string
    avatar_url?: string
    location?: string
    instagram_handle?: string
    is_verified?: boolean
    is_premium?: boolean
    is_creator?: boolean
    profession?: string
  }
  lastMessage?: {
    content: string
    created_at: string
    is_read: boolean
  }
}

interface Request {
  swiper_id: string
  created_at: string
  user: {
    id: string
    username: string
    full_name: string
    bio: string
    avatar_url?: string
    location?: string
    is_verified?: boolean
  }
}

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  const { user, profile } = useAuth()
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends')
  const [processingRequest, setProcessingRequest] = useState<string | null>(null)
  const { onlineUsers } = usePresence()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    if (!user) return
    try {
      const supabase = createClient()

      // 1. Load Matches (Friends)
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      // Get user details for each match
      const allMatches: Match[] = []
      if (matchesData) {
        for (const match of (matchesData as any[])) {
          const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id

          const { data: otherUser } = await supabase
            .from('users')
            .select('*')
            .eq('id', otherUserId)
            .neq('is_social_blocked', true)
            .maybeSingle()

          if (otherUser) {
            let avatar_url = undefined
            const userAny = otherUser as any
            if (userAny.profile_pic_url) {
              if (userAny.profile_pic_url.startsWith('http')) {
                avatar_url = userAny.profile_pic_url
              } else {
                const { data: publicUrlData } = supabase.storage
                  .from('avatars')
                  .getPublicUrl(userAny.profile_pic_url)
                avatar_url = publicUrlData.publicUrl
              }
            }

            allMatches.push({
              ...match,
              user: {
                id: userAny.id,
                username: userAny.username || '',
                full_name: userAny.full_name || '',
                bio: userAny.bio || '',
                avatar_url: avatar_url,
                location: userAny.location || '',
                instagram_handle: userAny.instagram_handle || '',
                is_verified: userAny.verification_status === 'verified',
                is_premium: userAny.subscription_status === 'premium',
                is_creator: userAny.verification_status === 'verified',
                profession: userAny.profession || ''
              }
            })
          }
        }
        setMatches(allMatches)
      }

      // 2. Load Requests
      const { data: incomingSwipes } = await supabase
        .from('swipes')
        .select('swiper_id, created_at')
        .eq('target_user_id', user.id)
        .eq('direction', 'like')

      if (incomingSwipes) {
        const matchedUserIds = new Set((matchesData as any[])?.map((m: any) =>
          m.user1_id === user.id ? m.user2_id : m.user1_id
        ) || [])

        const pendingSwipes = (incomingSwipes as any[])?.filter((s: any) => !matchedUserIds.has(s.swiper_id)) || []
        const pendingRequests: Request[] = []

        for (const swipe of pendingSwipes) {
          const { data: swiper } = await supabase
            .from('users')
            .select('*')
            .eq('id', swipe.swiper_id)
            .neq('is_social_blocked', true)
            .maybeSingle()

          if (swiper) {
            let avatar_url = undefined
            const swiperAny = swiper as any
            if (swiperAny.profile_pic_url) {
              if (swiperAny.profile_pic_url.startsWith('http')) {
                avatar_url = swiperAny.profile_pic_url
              } else {
                const { data: publicUrlData } = supabase.storage
                  .from('avatars')
                  .getPublicUrl(swiperAny.profile_pic_url)
                avatar_url = publicUrlData.publicUrl
              }
            }

            pendingRequests.push({
              swiper_id: swipe.swiper_id,
              created_at: swipe.created_at,
              user: {
                id: swiperAny.id,
                username: swiperAny.username,
                full_name: swiperAny.full_name,
                bio: swiperAny.bio,
                avatar_url: avatar_url,
                location: swiperAny.location,
                is_verified: swiperAny.verification_status === 'verified'
              }
            })
          }
        }
        setRequests(pendingRequests)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAcceptRequest = async (request: Request) => {
    if (!user) return
    setProcessingRequest(request.swiper_id)

    try {
      const supabase = createClient()
      await supabase.from('swipes').insert({
        swiper_id: user.id,
        target_user_id: request.swiper_id,
        direction: 'like'
      } as any)

      const { data: matchData, error: matchError } = await supabase.from('matches').insert({
        user1_id: user.id,
        user2_id: request.swiper_id
      } as any).select().single()

      if (matchError) throw matchError

      setRequests(prev => prev.filter((r: any) => r.swiper_id !== request.swiper_id))

      if (matchData) {
        const newMatch: Match = {
          ...(matchData as any),
          is_mutual: true,
          user: {
            ...request.user,
            is_premium: false,
            is_creator: false,
            profession: ''
          }
        }
        setMatches(prev => [newMatch, ...prev])
      }
    } catch (error) {
      console.error('Error accepting request:', error)
    } finally {
      setProcessingRequest(null)
    }
  }

  const handleDeclineRequest = async (request: Request) => {
    if (!user) return
    setProcessingRequest(request.swiper_id)
    try {
      const supabase = createClient()
      await supabase.from('swipes').insert({
        swiper_id: user.id,
        target_user_id: request.swiper_id,
        direction: 'left'
      } as any)
      setRequests(prev => prev.filter((r: any) => r.swiper_id !== request.swiper_id))
    } catch (error) {
      console.error('Error declining request:', error)
    } finally {
      setProcessingRequest(null)
    }
  }

  const getMatchAge = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return `${Math.ceil(diffDays / 30)} months ago`
  }

  const handleStartChat = (match: Match) => {
    router.push(`/social/chat/${match.id}`)
  }

  const renderProfileModal = () => {
    if (!showProfileModal || !selectedMatch) return null
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-[#050810]/95 backdrop-blur-xl flex items-center justify-center z-[100] p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 20, opacity: 0 }}
            className="bg-[#0d1321]/80 border border-white/10 rounded-[3rem] max-w-lg w-full max-h-[90vh] overflow-y-auto relative shadow-[0_32px_120px_rgba(0,0,0,0.8)]"
          >
            <div className="absolute top-6 right-6">
              <Button
                onClick={() => setShowProfileModal(false)}
                variant="ghost"
                size="icon"
                className="hover:bg-white/10 rounded-full"
              >
                <X className="w-6 h-6 text-slate-400" />
              </Button>
            </div>

            <div className="p-10 space-y-10">
              {/* Profile Image & Basic Info */}
              <div className="text-center">
                <div className="relative inline-block mb-8">
                  <img
                    src={selectedMatch.user.avatar_url || `/api/placeholder/150/150`}
                    alt={selectedMatch.user.full_name}
                    className="w-40 h-40 rounded-[2.5rem] mx-auto object-cover border-4 border-white/5 shadow-2xl"
                  />
                  {selectedMatch.user.is_verified && (
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center border-4 border-[#0d1321] shadow-xl">
                      <Crown className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <h4 className="text-3xl font-black text-white italic uppercase tracking-tighter">{selectedMatch.user.full_name}</h4>
                  {selectedMatch.user.location && (
                    <div className="flex items-center justify-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <MapPin className="w-3 h-3" />
                      <span>{selectedMatch.user.location}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Stats/Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</div>
                  <div className="text-sm font-black text-emerald-400 uppercase italic">
                    {onlineUsers.has(selectedMatch.user.id) ? 'Synchronized' : 'Offline'}
                  </div>
                </div>
                <div className="bg-white/5 border border-white/5 p-4 rounded-2xl text-center">
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Since</div>
                  <div className="text-sm font-black text-emerald-400 uppercase italic">{getMatchAge(selectedMatch.created_at)}</div>
                </div>
              </div>

              {/* Bio */}
              {selectedMatch.user.bio && (
                <div className="bg-white/5 border border-white/5 p-8 rounded-[2rem]">
                  <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                    <Sparkles size={12} className="text-emerald-500" /> Information Dossier
                  </h5>
                  <p className="text-slate-300 text-sm leading-relaxed font-medium italic">"{selectedMatch.user.bio}"</p>
                </div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-3 transition-all"
                  onClick={() => handleStartChat(selectedMatch)}
                >
                  <MessageCircle className="w-5 h-5" />
                  Establish Sync
                </Button>

                {selectedMatch.user.instagram_handle && (
                  <Button
                    className="w-full h-16 rounded-2xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 transition-all"
                    onClick={() => window.open(`https://instagram.com/${selectedMatch.user.instagram_handle}`, '_blank')}
                  >
                    <Instagram className="w-5 h-5" />
                    External Node
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    )
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
          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Calibrating Connections...</p>
        </div>
      </div>
    )
  }

  return (
    <PageWrapper className="min-h-screen bg-[#050810] py-12 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px]"
        />
      </div>

      <div className="container mx-auto max-w-3xl relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="space-y-2">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest"
            >
              <Users size={12} />
              Neural Network
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Your Connections</h1>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[10px] hidden sm:flex items-center gap-3 transition-all"
              onClick={() => router.push('/social/swipe')}
            >
              <UserPlus size={18} className="text-emerald-500" />
              Find New Nodes
            </Button>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-[#0d1321]/60 backdrop-blur-2xl p-2 rounded-[2rem] border border-white/5 mb-12 flex gap-2">
          {[
            { id: 'friends', label: 'Synced Hubs', count: matches.length, icon: Heart },
            { id: 'requests', label: 'Incoming Ping', count: requests.length, icon: Zap }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all
                        ${activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-2xl shadow-emerald-500/20 italic'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                }`}
            >
              <tab.icon size={16} />
              {tab.label} [{tab.count}]
            </button>
          ))}
        </div>

        {/* Content */}
        <AnimatePresence mode="wait">
          {activeTab === 'friends' ? (
            /* Friends List */
            matches.length === 0 ? (
              <motion.div
                key="no-friends"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-24 bg-white/5 border border-white/5 rounded-[3rem] backdrop-blur-xl"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl mx-auto flex items-center justify-center mb-8 border border-emerald-500/20">
                  <Heart className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Isolation Mode Active</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">No synchronized nodes detected in this layer.</p>
                <Button
                  className="bg-emerald-600 hover:bg-emerald-500 text-white h-14 px-10 rounded-[1.2rem] font-black uppercase tracking-widest text-[10px]"
                  onClick={() => router.push('/social/swipe')}
                >
                  Initialize Search
                </Button>
              </motion.div>
            ) : (
              <motion.div
                key="friends-list"
                variants={{
                  show: { transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 gap-4"
              >
                {matches.map((match) => (
                  <motion.div
                    key={match.id}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ x: 10 }}
                    className="p-1"
                  >
                    <div className="bg-[#0d1321]/40 border border-white/5 hover:border-emerald-500/30 backdrop-blur-3xl rounded-[2rem] p-6 transition-all group">
                      <div className="flex items-center gap-6">
                        <button
                          onClick={() => {
                            setSelectedMatch(match)
                            setShowProfileModal(true)
                          }}
                          className="relative group"
                        >
                          <img
                            src={match.user.avatar_url || `/api/placeholder/60/60`}
                            alt={match.user.full_name}
                            className="w-20 h-20 rounded-[1.5rem] object-cover border-2 border-white/5 group-hover:border-blue-500/50 transition-all shadow-xl"
                          />
                          {match.user.is_verified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-600 rounded-lg flex items-center justify-center border-2 border-[#0d1321]">
                              <Crown className="w-3 h-3 text-white" />
                            </div>
                          )}
                          {onlineUsers.has(match.user.id) && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-[#0d1321] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                          )}
                        </button>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xl font-black text-white italic uppercase tracking-tighter truncate group-hover:text-emerald-400 transition-colors">
                            {match.user.full_name}
                          </h4>
                          <div className="flex items-center gap-3 mt-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-emerald-500" />
                              <span>Sync {getMatchAge(match.created_at)}</span>
                            </div>
                            <span className="h-1 w-1 bg-white/10 rounded-full" />
                            <span className={onlineUsers.has(match.user.id) ? 'text-emerald-500' : 'text-slate-600 italic'}>
                              {onlineUsers.has(match.user.id) ? 'Active' : 'Standby'}
                            </span>
                          </div>
                        </div>

                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            onClick={() => handleStartChat(match)}
                            className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-emerald-600 text-white border border-white/10 group-hover:border-emerald-500 group-hover:shadow-2xl group-hover:shadow-emerald-500/20 transition-all"
                          >
                            <MessageCircle className="w-6 h-6" />
                          </Button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )
          ) : (
            /* Requests List */
            requests.length === 0 ? (
              <motion.div
                key="no-requests"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-24 bg-white/5 border border-white/5 rounded-[3rem] backdrop-blur-xl"
              >
                <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl mx-auto flex items-center justify-center mb-8 border border-emerald-500/20">
                  <Zap className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">No Incoming Signals</h3>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Your node is currently silent.</p>
              </motion.div>
            ) : (
              <motion.div
                key="requests-list"
                variants={{
                  show: { transition: { staggerChildren: 0.1 } }
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 gap-4"
              >
                {requests.map((request) => (
                  <motion.div
                    key={request.swiper_id}
                    variants={{
                      hidden: { opacity: 0, x: 20 },
                      show: { opacity: 1, x: 0 }
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="bg-[#0d1321]/40 border border-white/5 hover:border-emerald-500/30 backdrop-blur-3xl rounded-[2rem] p-6 transition-all">
                      <div className="flex items-center gap-6">
                        <img
                          src={request.user.avatar_url || `/api/placeholder/60/60`}
                          alt={request.user.full_name}
                          className="w-20 h-20 rounded-[1.5rem] object-cover border-2 border-white/5 shadow-2xl"
                        />

                        <div className="flex-1 min-w-0">
                          <h4 className="text-xl font-black text-white italic uppercase tracking-tighter truncate">
                            {request.user.full_name}
                          </h4>
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2 line-clamp-1">
                            {request.user.bio || 'IDENTIFICATION PENDING...'}
                          </p>
                        </div>

                        <div className="flex gap-3">
                          <Button
                            size="icon"
                            className="w-14 h-14 rounded-2xl bg-white/5 hover:bg-rose-600/20 text-slate-500 hover:text-rose-500 border border-white/10 hover:border-rose-500/50 transition-all"
                            onClick={() => handleDeclineRequest(request)}
                            disabled={processingRequest === request.swiper_id}
                          >
                            <X className="w-6 h-6" />
                          </Button>
                          <Button
                            size="icon"
                            className="w-14 h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 transition-all"
                            onClick={() => handleAcceptRequest(request)}
                            disabled={processingRequest === request.swiper_id}
                          >
                            {processingRequest === request.swiper_id ? (
                              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                            ) : (
                              <Check className="w-8 h-8 stroke-[3px]" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )
          )}
        </AnimatePresence>
      </div>

      {/* Profile Modal */}
      {renderProfileModal()}
    </PageWrapper>
  )
}
