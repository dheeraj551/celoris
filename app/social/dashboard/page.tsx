'use client'

import { useState, useEffect } from 'react'
import { createClient, createClientForBrowser } from '@/lib/supabase-client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import {
  MessageCircle,
  Video,
  Bell,
  MessageSquare,
  PhoneCall,
  VideoIcon,
  Users,
  Heart,
  Crown,
  Star,
  Phone,
  Settings,
  TrendingUp,
  Activity,
  Zap
} from 'lucide-react'
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
import CallManager from '@/components/CallManager'
import PushNotificationManager from '@/components/PushNotificationManager'
import WhatsAppIntegration from '@/components/WhatsAppIntegration'

interface SocialStats {
  totalMatches: number
  unreadMessages: number
  onlineMatches: number
  recentCalls: number
}

interface RecentActivity {
  id: string
  type: 'match' | 'message' | 'call' | 'like'
  title: string
  description: string
  timestamp: string
  user?: {
    full_name: string
    avatar_url?: string
  }
}

import { useAuth } from '@/components/providers/AuthProvider'

export default function SocialPlatformDashboard() {
  const { user, profile, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [socialStats, setSocialStats] = useState<SocialStats>({
    totalMatches: 0,
    unreadMessages: 0,
    onlineMatches: 0,
    recentCalls: 0
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null)
  const [showCallManager, setShowCallManager] = useState(false)

  useEffect(() => {
    if (profile) {
      loadSocialData()
    }
  }, [profile])

  const loadSocialData = async () => {
    if (!profile) return

    setLoading(true)
    try {
      const supabase = createClient()

      // Load matches
      const { data: matchesData } = await supabase
        .from('matches')
        .select(`
          *,
          user1:social_profiles!matches_user1_id_fkey(*),
          user2:social_profiles!matches_user2_id_fkey(*)
        `)
        .or(`user1_id.eq.${profile.id},user2_id.eq.${profile.id}`)
        .order('created_at', { ascending: false })

      if (matchesData) {
        const processedMatches = matchesData.map((match: any) => ({
          ...match,
          otherUser: match.user1_id === profile.id ? match.user2 : match.user1
        }))
        setMatches(processedMatches)
      }

      // Load social statistics
      await loadSocialStats(supabase)

      // Load recent activity
      await loadRecentActivity(supabase)

    } catch (error) {
      console.error('Error loading social data:', error)
      toast.error('Failed to load social data')
    } finally {
      setLoading(false)
    }
  }

  const loadSocialStats = async (supabase: any) => {
    try {
      // Total matches
      const { count: totalMatches } = await supabase
        .from('matches')
        .select('*', { count: 'exact', head: true })
        .or(`user1_id.eq.${profile?.id},user2_id.eq.${profile?.id}`)

      // Unread messages
      const { count: unreadMessages } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('is_read', false)
        .neq('sender_id', profile?.id)
        .in('match_id', matches.map(m => m.id))

      // Online matches
      const { count: onlineMatches } = await supabase
        .from('user_presence')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'online')
        .in('user_id', matches.map(m => m.otherUser.id))

      // Recent calls (last 24 hours)
      const dayAgo = new Date()
      dayAgo.setDate(dayAgo.getDate() - 1)
      const { count: recentCalls } = await supabase
        .from('call_logs')
        .select('*', { count: 'exact', head: true })
        .gte('started_at', dayAgo.toISOString())
        .or(`caller_id.eq.${profile?.id},callee_id.eq.${profile?.id}`)

      setSocialStats({
        totalMatches: totalMatches || 0,
        unreadMessages: unreadMessages || 0,
        onlineMatches: onlineMatches || 0,
        recentCalls: recentCalls || 0
      })
    } catch (error) {
      console.error('Error loading social stats:', error)
    }
  }

  const loadRecentActivity = async (supabase: any) => {
    try {
      const activities: RecentActivity[] = []

      // Recent matches
      const { data: recentMatches } = await supabase
        .from('matches')
        .select(`
          *,
          user1:social_profiles!matches_user1_id_fkey(*),
          user2:social_profiles!matches_user2_id_fkey(*)
        `)
        .or(`user1_id.eq.${profile?.id},user2_id.eq.${profile?.id}`)
        .order('created_at', { ascending: false })
        .limit(5)

      if (recentMatches) {
        recentMatches.forEach((match: any) => {
          const otherUser = match.user1_id === profile?.id ? match.user2 : match.user1
          activities.push({
            id: `match-${match.id}`,
            type: 'match',
            title: 'New Match!',
            description: `You matched with ${otherUser.full_name}`,
            timestamp: match.created_at,
            user: {
              full_name: otherUser.full_name,
              avatar_url: otherUser.avatar_url
            }
          })
        })
      }

      // Recent messages
      const { data: recentMessages } = await supabase
        .from('messages')
        .select(`
          *,
          matches!inner(*),
          sender:social_profiles!messages_sender_id_fkey(*)
        `)
        .neq('sender_id', profile?.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (recentMessages) {
        recentMessages.forEach((message: any) => {
          activities.push({
            id: `message-${message.id}`,
            type: 'message',
            title: 'New Message',
            description: `${message.sender.full_name}: ${message.content.substring(0, 50)}...`,
            timestamp: message.created_at,
            user: {
              full_name: message.sender.full_name,
              avatar_url: message.sender.avatar_url
            }
          })
        })
      }

      // Recent calls
      const { data: recentCalls } = await supabase
        .from('call_logs')
        .select(`
          *,
          caller:social_profiles!call_logs_caller_id_fkey(*),
          callee:social_profiles!call_logs_callee_id_fkey(*)
        `)
        .or(`caller_id.eq.${profile?.id},callee_id.eq.${profile?.id}`)
        .eq('status', 'completed')
        .order('started_at', { ascending: false })
        .limit(3)

      if (recentCalls) {
        recentCalls.forEach((call: any) => {
          const otherUser = call.caller_id === profile?.id ? call.callee : call.caller
          activities.push({
            id: `call-${call.id}`,
            type: 'call',
            title: `${call.call_type} call completed`,
            description: `Call with ${otherUser.full_name} (${Math.floor(call.duration / 60)}m ${call.duration % 60}s)`,
            timestamp: call.started_at,
            user: {
              full_name: otherUser.full_name,
              avatar_url: otherUser.avatar_url
            }
          })
        })
      }

      // Sort by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setRecentActivity(activities.slice(0, 10))

    } catch (error) {
      console.error('Error loading recent activity:', error)
    }
  }

  const handleStartCall = (matchId: string, isVideo: boolean = true) => {
    setSelectedMatch(matchId)
    setShowCallManager(true)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInSeconds = Math.floor((now.getTime() - time.getTime()) / 1000)

    if (diffInSeconds < 60) return 'just now'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'match': return <Heart className="w-4 h-4 text-pink-500" />
      case 'message': return <MessageCircle className="w-4 h-4 text-blue-500" />
      case 'call': return <Phone className="w-4 h-4 text-green-500" />
      default: return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050810]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-400">Loading social platform...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050810] text-slate-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">
            Social Platform Dashboard
          </h1>
          <p className="text-slate-400 font-medium">
            Welcome back, {profile?.full_name || 'User'}! Here's what's happening in your social world.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-[#0d1321] border border-white/5">
            <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white uppercase tracking-widest text-[10px] font-black">Overview</TabsTrigger>
            <TabsTrigger value="messages" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white uppercase tracking-widest text-[10px] font-black">Messages</TabsTrigger>
            <TabsTrigger value="notifications" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white uppercase tracking-widest text-[10px] font-black">Notifications</TabsTrigger>
            <TabsTrigger value="integrations" className="data-[state=active]:bg-emerald-600 data-[state=active]:text-white uppercase tracking-widest text-[10px] font-black">Integrations</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Matches</p>
                      <p className="text-3xl font-black text-white italic">{socialStats.totalMatches}</p>
                    </div>
                    <Users className="w-8 h-8 text-emerald-500" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Unread Messages</p>
                      <p className="text-3xl font-black text-white italic">{socialStats.unreadMessages}</p>
                    </div>
                    <MessageCircle className="w-8 h-8 text-emerald-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Online Now</p>
                      <p className="text-3xl font-black text-white italic">{socialStats.onlineMatches}</p>
                    </div>
                    <Zap className="w-8 h-8 text-yellow-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Recent Calls</p>
                      <p className="text-3xl font-black text-white italic">{socialStats.recentCalls}</p>
                    </div>
                    <Phone className="w-8 h-8 text-teal-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white font-black italic uppercase tracking-tighter">
                  <Activity className="w-5 h-5 text-emerald-500" />
                  <span>Recent Activity</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentActivity.length > 0 ? (
                  <div className="space-y-4">
                    {recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
                        {activity.user?.avatar_url ? (
                          <img
                            src={activity.user.avatar_url}
                            alt={activity.user.full_name}
                            className="w-10 h-10 rounded-full object-cover border border-white/10"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                            <span className="text-emerald-400 font-bold">
                              {activity.user?.full_name?.charAt(0) || '?'}
                            </span>
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            {getActivityIcon(activity.type)}
                            <h4 className="font-bold text-white text-sm">{activity.title}</h4>
                            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
                              {activity.type}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-400">{activity.description}</p>
                          <p className="text-xs text-slate-600 uppercase tracking-wider font-bold">{formatTimeAgo(activity.timestamp)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No recent activity</h3>
                    <p className="text-slate-500">Start swiping to see your activity here!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="text-white font-black italic uppercase tracking-tighter">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    onClick={() => window.location.href = '/social/swipe'}
                    className="h-24 flex-col space-y-2 bg-emerald-600/10 hover:bg-emerald-600/20 border-emerald-500/20 text-emerald-400 hover:text-emerald-300"
                    variant="outline"
                  >
                    <Heart className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Start Swiping</span>
                  </Button>

                  <Button
                    onClick={() => window.location.href = '/social/profile'}
                    className="h-24 flex-col space-y-2 bg-white/5 hover:bg-white/10 border-white/10 text-white"
                    variant="outline"
                  >
                    <Settings className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Edit Profile</span>
                  </Button>

                  <Button
                    onClick={() => setActiveTab('notifications')}
                    className="h-24 flex-col space-y-2 bg-white/5 hover:bg-white/10 border-white/10 text-white"
                    variant="outline"
                  >
                    <Bell className="w-6 h-6" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Notifications</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            <Card className="bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-white font-black italic uppercase tracking-tighter">
                  <span>Your Matches</span>
                  <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{matches.length} matches</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {matches.length > 0 ? (
                  <div className="grid gap-4">
                    {matches.map((match) => (
                      <div key={match.id} className="flex items-center justify-between p-4 border border-white/5 rounded-2xl hover:bg-white/5 transition-colors group bg-[#050810]/50">
                        <div className="flex items-center space-x-4">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-[1rem] overflow-hidden bg-emerald-500/10 border-2 border-white/10 group-hover:border-emerald-500/50 transition-colors">
                              {match.otherUser.avatar_url ? (
                                <img
                                  src={match.otherUser.avatar_url}
                                  alt={match.otherUser.full_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <span className="text-emerald-400 font-bold text-lg">
                                    {match.otherUser.full_name.charAt(0)}
                                  </span>
                                </div>
                              )}
                            </div>
                            {/* Online indicator would go here */}
                          </div>

                          <div>
                            <h3 className="font-bold text-white flex items-center space-x-2 text-lg italic">
                              <span>{match.otherUser.full_name}</span>
                              {match.otherUser.is_verified && <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />}
                              {match.otherUser.is_premium && <Crown className="w-4 h-4 text-yellow-400 fill-yellow-400" />}
                            </h3>
                            <p className="text-sm text-slate-400">@{match.otherUser.username}</p>
                            {match.last_message_at && (
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                                Last message {formatTimeAgo(match.last_message_at)}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* <div className="flex items-center space-x-2">
                           <Button
                             size="sm"
                             onClick={() => handleStartCall(match.id, false)}
                           >
                             <Phone className="w-4 h-4" />
                           </Button>
                           <Button
                             size="sm"
                             onClick={() => handleStartCall(match.id, true)}
                           >
                             <Video className="w-4 h-4" />
                           </Button>
                           <Button
                             size="sm"
                             onClick={() => window.location.href = `/social/chat/${match.id}`}
                           >
                             <MessageCircle className="w-4 h-4" />
                           </Button>
                         </div> */}
                        <Button
                          size="sm"
                          onClick={() => window.location.href = `/social/chat/${match.id}`}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white border-none rounded-full px-6"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Users className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-white mb-2">No matches yet</h3>
                    <p className="text-slate-500">Start swiping to find your matches!</p>
                    <Button
                      onClick={() => window.location.href = '/social/swipe'}
                      className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white border-none"
                    >
                      Start Swiping
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calls Tab */}
          <TabsContent value="calls" className="space-y-6">
            <Card className="bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white font-black italic uppercase tracking-tighter">
                  <PhoneCall className="w-5 h-5 text-emerald-500" />
                  <span>Video & Voice Calls</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedMatch && showCallManager ? (
                  <CallManager
                    matchId={selectedMatch}
                    otherUserId={matches.find(m => m.id === selectedMatch)?.otherUser.id || ''}
                    onCallEnd={() => {
                      setShowCallManager(false)
                      setSelectedMatch(null)
                    }}
                  />
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-400">
                      Start a video or voice call with your matches. All calls are powered by Agora for high-quality communication.
                    </p>

                    {matches.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-bold text-white">Available for calls:</h4>
                        <div className="grid gap-2">
                          {matches.slice(0, 3).map((match) => (
                            <div key={match.id} className="flex items-center justify-between p-3 border border-white/5 rounded-lg bg-[#050810]/50">
                              <span className="text-white font-medium">{match.otherUser.full_name}</span>
                              <div className="space-x-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-white/10 text-slate-300 hover:bg-white/10 hover:text-white"
                                  onClick={() => handleStartCall(match.id, false)}
                                >
                                  <Phone className="w-4 h-4 mr-1" />
                                  Voice
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white border-none"
                                  onClick={() => handleStartCall(match.id, true)}
                                >
                                  <VideoIcon className="w-4 h-4 mr-1" />
                                  Video
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {matches.length === 0 && (
                      <div className="text-center py-8">
                        <PhoneCall className="w-16 h-16 text-slate-700 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-white mb-2">No matches to call</h3>
                        <p className="text-slate-500">Match with someone to start calling!</p>
                        <Button
                          onClick={() => window.location.href = '/social/swipe'}
                          className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white border-none"
                        >
                          Start Matching
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid gap-6">
              <PushNotificationManager
                onNotificationReceived={(notification) => {
                  console.log('Notification received:', notification)
                  toast.info('New notification received!')
                }}
              />

              <WhatsAppIntegration
                userPhone="+1234567890"
                onMessageSent={(success, messageId) => {
                  if (success) {
                    toast.success('WhatsApp message sent successfully!')
                  } else {
                    toast.error('Failed to send WhatsApp message')
                  }
                }}
              />
            </div>
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid gap-6">
              {/* Agora Integration Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Video Calling (Agora)</span>
                    <Badge variant="secondary">Configured</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    High-quality video and voice calling powered by Agora RTC SDK.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Calls Today</span>
                      <span className="text-sm text-gray-600">{socialStats.recentCalls}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Firebase/FCM Integration Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Push Notifications (Firebase)</span>
                    <Badge variant="secondary">Configured</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Real-time push notifications via Firebase Cloud Messaging.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Service</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Unread Messages</span>
                      <span className="text-sm text-gray-600">{socialStats.unreadMessages}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* WhatsApp Integration Status */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>WhatsApp Integration</span>
                    <Badge variant="outline">Demo Mode</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    WhatsApp Business API integration for notifications and messaging.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Configuration</span>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                        Demo
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">API Status</span>
                      <span className="text-sm text-gray-600">Simulated</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}