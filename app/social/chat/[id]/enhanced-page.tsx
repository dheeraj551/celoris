"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
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
  Mic,
  MoreVertical,
  PhoneCall,
  VideoIcon
} from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"

// Simple toast function
const toast = {
  success: (message: string) => {
    console.log('✅ Success:', message)
    alert(message)
  },
  error: (message: string) => {
    console.error('❌ Error:', message)
    alert('Error: ' + message)
  },
  info: (message: string) => {
    console.log('ℹ️ Info:', message)
    alert(message)
  }
}

interface Message {
  id: string
  match_id: string
  sender_id: string
  content: string
  message_type: 'text' | 'image' | 'voice' | 'video' | 'gif'
  media_url?: string
  is_read: boolean
  created_at: string
  read_at?: string
}

interface Match {
  id: string
  user1_id: string
  user2_id: string
  last_message_at?: string
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

interface TypingIndicator {
  userId: string
  isTyping: boolean
  timestamp: number
}

interface UserPresence {
  userId: string
  status: 'online' | 'away' | 'offline'
  lastSeen?: string
}

export default function EnhancedChatPage() {
  const [match, setMatch] = useState<Match | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isTyping, setIsTyping] = useState(false)
  const [otherUserTyping, setOtherUserTyping] = useState(false)
  const [typingUsers, setTypingUsers] = useState<TypingIndicator[]>([])
  const [userPresence, setUserPresence] = useState<UserPresence[]>([])
  const [readReceipts, setReadReceipts] = useState<{ [key: string]: string }>({})
  const [onlineStatus, setOnlineStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting')

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
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
      setupAdvancedRealTimeSubscription()
      updateUserPresence()
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [match])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Handle typing indicator timeout
    if (isTyping) {
      const timeout = setTimeout(() => {
        setIsTyping(false)
        sendTypingIndicator(false)
      }, 3000)

      typingTimeoutRef.current = timeout
    }

    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }, [isTyping])



  const loadMatch = async () => {
    if (!currentUser) return
    try {
      const supabase = createClient()
      // Load match data
      const { data: matchData } = await supabase
        .from('matches')
        .select(`
          *,
          user1:social_profiles!matches_user1_id_fkey(*),
          user2:social_profiles!matches_user2_id_fkey(*)
        `)
        .eq('id', matchId)
        .single()

      if (matchData) {
        const matchWithUsers = matchData as Match & {
          user1_id: string
          user2_id: string
          user1: Match['user']
          user2: Match['user']
        }
        const otherUser = matchWithUsers.user1_id === currentUser.id ? matchWithUsers.user2 : matchWithUsers.user1
        setMatch({ ...matchWithUsers, user: otherUser })
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

      if (data) {
        setMessages(data)

        // Update read receipts
        const receipts: { [key: string]: string } = {}
        data.forEach((message: Message) => {
          if (message.is_read && message.sender_id === user?.id) {
            receipts[message.id] = message.read_at || message.created_at
          }
        })
        setReadReceipts(receipts)
      }

      // Mark messages as read
      await (supabase
        .from('messages') as any)
        .update({ is_read: true, read_at: new Date().toISOString() })
        .eq('match_id', matchId)
        .neq('sender_id', user?.id)
    } catch (error) {
      console.error('Error loading messages:', error)
    }
  }

  const setupAdvancedRealTimeSubscription = () => {
    const supabase = createClient()

    // Messages subscription
    const messageSubscription = supabase
      .channel(`messages:${matchId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `match_id=eq.${matchId}`
      }, (payload) => {
        const newMessage = payload.new as Message
        setMessages(prev => [...prev, newMessage])

        // Mark as read if not our message
        if (newMessage.sender_id !== user?.id) {
          (supabase
            .from('messages') as any)
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq('id', newMessage.id)
            .single()
        }

        // Send push notification
        if (match?.user) {
          sendPushNotification(newMessage)
        }
      })
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          setOnlineStatus('connected')
        } else if (status === 'CHANNEL_ERROR') {
          setOnlineStatus('disconnected')
        }
      })

    // Typing indicators subscription
    const typingSubscription = supabase
      .channel(`typing:${matchId}`)
      .on('broadcast', {
        event: 'typing'
      }, (payload) => {
        const { userId, isTyping } = payload.payload as { userId: string, isTyping: boolean }

        if (userId !== user?.id) {
          if (isTyping) {
            setOtherUserTyping(true)
            // Clear typing indicator after 3 seconds
            setTimeout(() => setOtherUserTyping(false), 3000)
          } else {
            setOtherUserTyping(false)
          }
        }
      })
      .subscribe()

    // Presence subscription
    const presenceSubscription = supabase
      .channel(`presence:${matchId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = presenceSubscription.presenceState()
        const onlineUsers = Object.keys(state).map(userId => ({
          userId,
          status: 'online' as const,
          lastSeen: new Date().toISOString()
        }))
        setUserPresence(onlineUsers)
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('User joined:', key, newPresences)
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('User left:', key, leftPresences)
        setUserPresence(prev => prev.filter(p => p.userId !== key))
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await presenceSubscription.track({
            userId: user?.id,
            status: 'online',
            lastSeen: new Date().toISOString()
          })
        }
      })

    return () => {
      messageSubscription.unsubscribe()
      typingSubscription.unsubscribe()
      presenceSubscription.unsubscribe()
    }
  }

  const updateUserPresence = async () => {
    // Update user presence in database
    try {
      const supabase = createClient()
      await (supabase
        .from('user_presence') as any)
        .upsert({
          user_id: user?.id,
          status: 'online',
          last_seen: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Error updating presence:', error)
    }
  }

  const sendTypingIndicator = async (isTyping: boolean) => {
    try {
      const supabase = createClient()
      const typingChannel = supabase.channel(`typing:${matchId}`)
      await typingChannel.send({
        type: 'broadcast',
        event: 'typing',
        payload: { userId: user?.id, isTyping }
      })
    } catch (error) {
      console.error('Error sending typing indicator:', error)
    }
  }

  const handleMessageChange = (value: string) => {
    setNewMessage(value)

    if (!isTyping && value.trim()) {
      setIsTyping(true)
      sendTypingIndicator(true)
    }
  }

  const sendMessage = async () => {
    if (!newMessage.trim() || sending || !user) return

    setSending(true)
    setIsTyping(false)
    sendTypingIndicator(false)

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

      // Update match last_message_at
      await (supabase
        .from('matches') as any)
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', matchId)

      setNewMessage('')

      // Send push notification
      if (match?.user) {
        sendPushNotification({
          sender_id: user.id,
          content: newMessage.trim(),
          message_type: 'text'
        } as Message)
      }

    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } finally {
      setSending(false)
    }
  }

  const sendPushNotification = async (message: Partial<Message>) => {
    try {
      await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: match?.user.id,
          title: `New message from ${user?.user_metadata?.full_name || 'Someone'}`,
          body: message.content || 'sent a message',
          type: 'new_message',
          data: {
            matchId,
            messageId: message.id
          }
        })
      })
    } catch (error) {
      console.error('Error sending push notification:', error)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const isOtherUserOnline = () => {
    return userPresence.some(p => p.userId === match?.user.id && p.status === 'online')
  }

  const startVideoCall = () => {
    // Integrate with CallManager component
    toast.info('Starting video call...')
    // This would integrate with the CallManager component we created earlier
  }

  const startVoiceCall = () => {
    toast.info('Starting voice call...')
    // This would integrate with the CallManager component
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Match not found</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/social/matches')}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>

              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-pink-200 to-purple-200">
                    {match.user.avatar_url ? (
                      <img src={match.user.avatar_url} alt={match.user.full_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-gray-400 font-bold">
                          {match.user.full_name?.charAt(0) || '?'}
                        </span>
                      </div>
                    )}
                  </div>
                  {isOtherUserOnline() && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>

                <div>
                  <h2 className="font-bold text-gray-800 flex items-center space-x-2">
                    <span>{match.user.full_name}</span>
                    {match.user.is_verified && <Star className="w-4 h-4 text-blue-500 fill-blue-500" />}
                    {match.user.is_premium && <Crown className="w-4 h-4 text-yellow-500" />}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {isOtherUserOnline() ? (
                      <span className="text-green-600">● Online</span>
                    ) : (
                      'Last seen recently'
                    )}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Connection Status */}
              <div className={`w-2 h-2 rounded-full ${onlineStatus === 'connected' ? 'bg-green-500' :
                onlineStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                  'bg-red-500'
                }`} />

              {/* <Button variant="ghost" size="sm" onClick={startVoiceCall}>
                <Phone className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm" onClick={startVideoCall}>
                <VideoIcon className="w-5 h-5" />
              </Button> */}
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          {messages.length > 0 ? (
            <div className="space-y-4">
              {messages.map((message) => {
                const isOwn = message.sender_id === user?.id
                return (
                  <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
                      <div className={`px-4 py-2 rounded-2xl ${isOwn
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                        : 'bg-white text-gray-800 shadow-sm'
                        }`}>
                        <p>{message.content}</p>
                      </div>
                      <div className="flex items-center justify-between mt-1 px-2">
                        <p className={`text-xs ${isOwn ? 'text-gray-200' : 'text-gray-500'
                          }`}>
                          {formatMessageTime(message.created_at)}
                        </p>
                        {isOwn && (
                          <div className="flex items-center space-x-1">
                            {readReceipts[message.id] ? (
                              <div className="w-4 h-4 text-gray-200">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                </svg>
                              </div>
                            ) : (
                              <div className="w-4 h-4 text-gray-200">
                                <svg viewBox="0 0 24 24" fill="currentColor">
                                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                                </svg>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>
          ) : (
            <div className="text-center py-12">
              <Heart className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Start your conversation</h3>
              <p className="text-gray-600">Say hi to {match.user.full_name}!</p>
            </div>
          )}

          {/* Typing Indicator */}
          {otherUserTyping && (
            <div className="flex justify-start">
              <div className="bg-white rounded-2xl px-4 py-2 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Input */}
      <div className="bg-white border-t border-gray-200 flex-shrink-0">
        <div className="container mx-auto px-4 py-4 max-w-4xl">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Paperclip className="w-5 h-5" />
            </Button>

            <Input
              type="text"
              value={newMessage}
              onChange={(e) => handleMessageChange(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`Message ${match.user.full_name}...`}
              className="flex-1"
            />

            <Button variant="ghost" size="sm">
              <Smile className="w-5 h-5" />
            </Button>

            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || sending}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              {sending ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}