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
  Paperclip
} from "lucide-react"
import { usePresence } from "@/components/providers/PresenceProvider"

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
  const { onlineUsers } = usePresence()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const params = useParams()
  const router = useRouter()

  const matchId = params.id as string

  useEffect(() => {
    checkAuthAndLoadMatch()
  }, [matchId])

  useEffect(() => {
    if (match) {
      loadMessages()
      return setupRealTimeSubscription()
    }
  }, [match])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const checkAuthAndLoadMatch = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Load match data
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .select('*')
        .eq('id', matchId)
        .single()

      if (matchError) throw matchError

      if (matchData) {
        const match = matchData as any
        const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id

        // Fetch other user details
        const { data: otherUser } = await supabase
          .from('users')
          .select('*')
          .eq('id', otherUserId)
          .single()

        if (otherUser) {
          const userData = otherUser as any
          // Get avatar URL if exists
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

      // Mark messages as read
      await (supabase
        .from('messages') as any)
        .update({ is_read: true })
        .eq('match_id', matchId)
        .neq('sender_id', user?.id)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const setupRealTimeSubscription = () => {
    const supabase = createClient()
    console.log(`Setting up realtime subscription for match: ${matchId}`)

    const subscription = supabase
      .channel(`messages:${matchId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        console.log('Realtime message received:', payload)
        setMessages(prev => {
          // Prevent duplicates
          if (prev.some(m => m.id === payload.new.id)) return prev
          return [...prev, payload.new as Message]
        })
      })
      .subscribe((status, err) => {
        console.log(`Subscription status for ${matchId}:`, status)
        if (err) {
          console.error('Subscription error:', err)
        }
      })

    return () => {
      console.log('Unsubscribing from channel')
      subscription.unsubscribe()
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !user) return

    setSending(true)
    try {
      const supabase = createClient()

      // Insert message
      const { error } = await (supabase
        .from('messages') as any)
        .insert({
          match_id: matchId,
          sender_id: user.id,
          content: newMessage.trim(),
          message_type: 'text'
        })

      if (error) throw error

      // Update match last_message_at
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
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffMinutes = Math.floor(diffTime / (1000 * 60))
    const diffHours = Math.floor(diffTime / (1000 * 60 * 60))
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffMinutes < 1) return 'now'
    if (diffMinutes < 60) return `${diffMinutes}m`
    if (diffHours < 24) return `${diffHours}h`
    if (diffDays < 7) return `${diffDays}d`
    return date.toLocaleDateString()
  }

  const isOwnMessage = (message: Message) => message.sender_id === user?.id

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Match not found</h2>
          <Button onClick={() => router.push('/social/matches')}>
            Back to Matches
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4 flex items-center gap-3">
        <button
          onClick={() => router.push('/social/matches')}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <img
          src={match.user.avatar_url || `/api/placeholder/40/40`}
          alt={match.user.full_name}
          className="w-10 h-10 rounded-full object-cover"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{match.user.full_name}</h3>
            {match.user.is_verified && (
              <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <Crown className="w-3 h-3 text-white" />
              </div>
            )}
            {match.user.is_premium && (
              <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                <Star className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onlineUsers.has(match.user.id) ? (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-xs text-green-600 font-medium">Online</p>
              </>
            ) : (
              <p className="text-xs text-gray-500">Offline</p>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Phone className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <Video className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <MoreHorizontal className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-purple-500" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              It's a match! 🎉
            </h4>
            <p className="text-gray-600 mb-6">
              Say hello to {match.user.full_name} and start a conversation!
            </p>

            {/* Quick Actions */}
            <div className="flex gap-3 justify-center">
              {match.user.instagram_handle && (
                <Button
                  variant="outline"
                  onClick={() => window.open(`https://instagram.com/${match.user.instagram_handle}`, '_blank')}
                >
                  <Instagram className="w-4 h-4 mr-2" />
                  View Instagram
                </Button>
              )}

              {match.user.location && (
                <Button
                  variant="outline"
                  onClick={() => {
                    const query = encodeURIComponent(`${match.user.location}`)
                    window.open(`https://maps.google.com/?q=${query}`, '_blank')
                  }}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  {match.user.location}
                </Button>
              )}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${isOwnMessage(message) ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isOwnMessage(message)
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-900'
                  }`}
              >
                <p className="text-sm">{message.content}</p>
                <p
                  className={`text-xs mt-1 ${isOwnMessage(message) ? 'text-purple-200' : 'text-gray-500'
                    }`}
                >
                  {formatMessageTime(message.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <Paperclip className="w-5 h-5" />
          </button>

          <div className="flex-1 relative">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`Message ${match.user.full_name}...`}
              className="w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              disabled={sending}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <Smile className="w-5 h-5" />
            </button>
          </div>

          {newMessage.trim() ? (
            <Button
              onClick={sendMessage}
              disabled={sending}
              className="bg-purple-500 hover:bg-purple-600 p-2 rounded-full"
            >
              <Send className="w-4 h-4" />
            </Button>
          ) : (
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <ImageIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Creator Monetization */}
        {match.user.is_creator && (
          <div className="mt-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crown className="w-4 h-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Support {match.user.full_name}
                </span>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="text-green-600 border-green-600">
                  <Gift className="w-3 h-3 mr-1" />
                  Tip
                </Button>
                <Button size="sm" variant="outline" className="text-purple-600 border-purple-600">
                  <Crown className="w-3 h-3 mr-1" />
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}