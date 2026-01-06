"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Send,
  Phone,
  Video,
  Gift,
  MoreHorizontal,
  Smile,
  Image as ImageIcon,
  Heart,
  MapPin,
  Instagram,
  Crown,
  Star,
  ArrowLeft,
  Paperclip,
  Sparkles,
  Zap,
  Check,
  MoreVertical,
  X,
  Target,
  Rocket
} from "lucide-react"
import { usePresence } from "@/components/providers/PresenceProvider"
import { useAuth } from "@/components/providers/AuthProvider"
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { motion, AnimatePresence } from "framer-motion"
import { PageWrapper } from "@/components/PageWrapper"

const MSG_SOUND = "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
const JOIN_SOUND = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"
const LEAVE_SOUND = "https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3"

interface Message {
  id: string
  match_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'image' | 'voice' | 'video' | 'gif'
  media_url?: string
  is_read: boolean
  created_at: string
}

interface Match {
  id: string
  user1_id: string
  user2_id: string
  user: {
    id: string
    username: string
    full_name: string
    bio: string
    avatar_url?: string
    location?: string
    instagram_handle?: string
    is_verified: boolean
    is_premium: boolean
    is_creator: boolean
    profession?: string
  }
}

export default function ChatPage() {
  const [match, setMatch] = useState<Match | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const { onlineUsers } = usePresence()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const wasOnlineRef = useRef<boolean>(false)
  const params = useParams()
  const router = useRouter()

  const matchId = params.id as string
  const { user: currentUser } = useAuth()

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser)
      loadMatch()
    }
  }, [matchId, currentUser])

  useEffect(() => {
    if (match) {
      loadMessages()
      return setupRealTimeSubscription()
    }
  }, [match])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!match) return
    const isOnline = onlineUsers.has(match.user.id)
    if (wasOnlineRef.current !== isOnline) {
      if (isOnline) {
        new Audio(JOIN_SOUND).play().catch(() => { })
      } else {
        new Audio(LEAVE_SOUND).play().catch(() => { })
      }
      wasOnlineRef.current = isOnline
    }
  }, [onlineUsers, match])

  const onEmojiClick = (emojiData: EmojiClickData) => {
    setNewMessage(prev => prev + emojiData.emoji)
    setShowEmojiPicker(false)
  }

  const loadMatch = async () => {
    if (!currentUser) return
    try {
      const supabase = createClient()
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single()

      if (matchError) throw matchError

      if (matchData) {
        const match = matchData as any
        const otherUserId = match.user1_id === currentUser.id ? match.user2_id : match.user1_id

        const { data: otherUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', otherUserId)
          .single()

        if (otherUser) {
          const userData = otherUser as any
          let avatar_url = undefined
          if (userData.profile_pic_url) {
            if (userData.profile_pic_url.startsWith('http')) {
              avatar_url = userData.profile_pic_url
            } else {
              const { data: publicUrlData } = supabase.storage
                .from('avatars')
                .getPublicUrl(userData.profile_pic_url)
              avatar_url = publicUrlData.publicUrl
            }
          }

          setMatch({
            ...match,
            user: {
              id: userData.id,
              username: userData.username || '',
              full_name: userData.full_name || '',
              bio: userData.bio || '',
              avatar_url: avatar_url,
              location: userData.location || '',
              instagram_handle: userData.instagram_handle || '',
              is_verified: userData.verification_status === 'verified',
              is_premium: userData.subscription_status === 'premium',
              is_creator: userData.verification_status === 'verified',
              profession: userData.profession || ''
            }
          })
        }
      }
    } catch (error) {
      console.error('Error loading match:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMessages = async () => {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('messages')
        .select('*')
        .eq('match_id', matchId)
        .order('created_at', { ascending: true })

      setMessages(data || [])

      await (supabase
        .from('messages') as any)
        .update({ is_read: true })
        .eq('match_id', matchId)
        .neq('sender_id', currentUser?.id)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const setupRealTimeSubscription = () => {
    const supabase = createClient()
    const subscription = supabase
      .channel(`messages:${matchId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        setMessages(prev => {
          if (prev.some(m => m.id === payload.new.id)) return prev
          if (payload.new.sender_id !== currentUser?.id) {
            new Audio(MSG_SOUND).play().catch(() => { })
          }
          return [...prev, payload.new as Message]
        })
      })
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !user) return
    setSending(true)
    try {
      const supabase = createClient()
      const { error } = await (supabase
        .from('messages') as any)
        .insert({
          match_id: matchId,
          sender_id: user.id,
          content: newMessage.trim(),
          message_type: 'text'
        })

      if (error) throw error

      await (supabase
        .from('matches') as any)
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', matchId)

      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const isOwnMessage = (message: Message) => message.sender_id === currentUser?.id

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full mx-auto mb-6"
          />
          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Initializing Secure Channel...</p>
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-black text-white italic uppercase tracking-tighter mb-4">Channel Unavailable</h2>
          <Button onClick={() => router.push('/social/matches')} className="bg-emerald-600 hover:bg-emerald-500">
            Back to Connections
          </Button>
        </div>
      </div>
    )
  }

  return (
    <PageWrapper className="h-screen bg-[#050810] flex flex-col relative overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-teal-600/10 rounded-full blur-[150px]"
        />
      </div>

      {/* Header */}
      <div className="bg-[#0d1321]/80 backdrop-blur-2xl border-b border-white/5 p-5 flex items-center gap-4 relative z-10">
        <button
          onClick={() => router.push('/social/matches')}
          className="p-3 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/5"
        >
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>

        <div className="relative">
          <img
            src={match.user.avatar_url || `/api/placeholder/40/40`}
            alt={match.user.full_name}
            className="w-12 h-12 rounded-2xl object-cover border-2 border-white/5"
          />
          {onlineUsers.has(match.user.id) && (
            <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0d1321] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter truncate">{match.user.full_name}</h3>
            {match.user.is_verified && (
              <Crown className="w-4 h-4 text-emerald-500 fill-emerald-500" />
            )}
            {match.user.is_premium && (
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[9px] font-black uppercase tracking-widest ${onlineUsers.has(match.user.id) ? 'text-emerald-500' : 'text-slate-500'}`}>
              {onlineUsers.has(match.user.id) ? 'Active Sync' : 'Standby Mode'}
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="p-3 hover:bg-white/10 rounded-2xl transition-all border border-transparent hover:border-white/5 text-slate-400">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10 scrollbar-hide">
        {messages.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20 px-10"
          >
            <div className="w-24 h-24 bg-emerald-500/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
              <Sparkles className="w-12 h-12 text-emerald-500" />
            </div>
            <h4 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">
              Secure Match Established
            </h4>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10 leading-relaxed">
              Datalink active. Encrypted communication ready with {match.user.full_name}.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-3 justify-center">
              {match.user.instagram_handle && (
                <Button
                  variant="outline"
                  className="bg-white/5 hover:bg-white/10 border-white/10 rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[9px] text-white"
                  onClick={() => window.open(`https://instagram.com/${match.user.instagram_handle}`, '_blank')}
                >
                  <Instagram className="w-4 h-4 mr-2 text-pink-500" />
                  Access Node
                </Button>
              )}

              {match.user.location && (
                <Button
                  variant="outline"
                  className="bg-white/5 hover:bg-white/10 border-white/10 rounded-2xl h-12 px-6 font-black uppercase tracking-widest text-[9px] text-white"
                  onClick={() => {
                    const query = encodeURIComponent(`${match.user.location}`)
                    window.open(`https://maps.google.com/?q=${query}`, '_blank')
                  }}
                >
                  <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
                  {match.user.location}
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, idx) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.05 }}
                className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] flex flex-col ${isOwnMessage(message) ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`px-5 py-3 rounded-2xl text-sm font-medium shadow-2xl relative
                            ${isOwnMessage(message)
                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-emerald-500/10'
                        : 'bg-white/10 backdrop-blur-3xl text-white rounded-tl-none border border-white/5'
                      }`}
                  >
                    <p className="leading-relaxed">{message.content}</p>
                    <div className="absolute top-0 right-[-8px] border-t-[8px] border-t-emerald-600 border-r-[8px] border-r-transparent hidden" />
                  </div>
                  <div className="flex items-center gap-2 mt-2 px-1">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest">
                      {formatMessageTime(message.created_at)}
                    </span>
                    {isOwnMessage(message) && message.is_read && (
                      <Check size={10} className="text-emerald-500 stroke-[3px]" />
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area */}
      <div className="bg-[#0d1321]/90 backdrop-blur-3xl border-t border-white/5 p-6 relative z-20">
        <div className="max-w-4xl mx-auto space-y-4">
          {/* Input Row */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl h-12 w-12 shrink-0">
              <Paperclip size={20} />
            </Button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder={`Transmitting to ${match.user.full_name}...`}
                className="w-full bg-white/5 border border-white/10 text-white placeholder:text-slate-600 px-6 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all text-sm font-medium"
                disabled={sending}
              />
              <button
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-all"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <Smile size={20} />
              </button>
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="absolute bottom-20 right-0 z-[100] shadow-[0_32px_120px_rgba(0,0,0,0.8)]"
                  >
                    <EmojiPicker theme={undefined as any} onEmojiClick={onEmojiClick} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              {newMessage.trim() ? (
                <motion.div
                  key="send-btn"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  <Button
                    onClick={sendMessage}
                    disabled={sending}
                    className="h-14 w-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-2xl shadow-emerald-500/20 shrink-0"
                  >
                    <Send size={20} />
                  </Button>
                </motion.div>
              ) : (
                <motion.div
                  key="media-btn"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                >
                  <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white hover:bg-white/5 rounded-2xl h-12 w-12 shrink-0">
                    <ImageIcon size={20} />
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Creator Toolkit */}
          {match.user.is_creator && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-600/10 border border-emerald-500/20 rounded-2xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-600/20 rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Creator Support System</p>
                  <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">Initialize transaction protocols</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button size="sm" variant="ghost" className="text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-400 font-black uppercase tracking-widest text-[9px] h-10 px-6 rounded-xl border border-emerald-500/20">
                  <Zap className="w-3 h-3 mr-2" />
                  Tip Node
                </Button>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[9px] h-10 px-6 rounded-xl shadow-xl shadow-emerald-500/10">
                  <Rocket className="w-3 h-3 mr-2" />
                  Force Sync
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}