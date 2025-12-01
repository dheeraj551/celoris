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
  UserX
} from "lucide-react"

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
  const [user, setUser] = useState<any>(null)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'friends' | 'requests'>('friends')
  const [processingRequest, setProcessingRequest] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // 1. Load Matches (Friends)
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select(`
          *,
          user1:social_profiles!matches_user1_id_fkey(*),
          user2:social_profiles!matches_user2_id_fkey(*)
        `)
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (matchesError) {
        console.error('Error loading matches:', matchesError)
      } else if (matchesData) {
        const allMatches = matchesData
          .map((match: any) => {
            const otherUser = match.user1_id === user.id ? match.user2 : match.user1
            if (!otherUser) return null
            return {
              ...match,
              user: {
                id: otherUser.user_id,
                username: otherUser.username || '',
                full_name: otherUser.full_name || '',
                bio: otherUser.bio || '',
                avatar_url: otherUser.profile_pic_url || otherUser.avatar_url || '',
                location: otherUser.location || '',
                instagram_handle: otherUser.instagram_handle || '',
                is_verified: otherUser.is_verified || false,
                is_premium: otherUser.is_premium || false,
                is_creator: otherUser.is_creator || false,
                profession: otherUser.profession || ''
              }
            }
          })
          .filter(Boolean) as Match[]
        setMatches(allMatches)
      }

      // 2. Load Requests (Incoming Swipes that are not matches)
      // First get all people who swiped right on me
      const { data: incomingSwipes } = await supabase
        .from('swipes')
        .select(`
          swiper_id,
          created_at,
          swiper:social_profiles!swipes_swiper_id_fkey(*)
        `)
        .eq('swiped_id', user.id)
        .eq('direction', 'right')

      // Then filter out those who are already matched
      // (This is a simplified approach; ideally we'd do a left join or "not in" query)
      if (incomingSwipes) {
        const matchedUserIds = new Set(matchesData?.map((m: any) =>
          m.user1_id === user.id ? m.user2_id : m.user1_id
        ) || [])

        const pendingRequests = incomingSwipes
          .filter((s: any) => !matchedUserIds.has(s.swiper_id))
          .map((s: any) => ({
            swiper_id: s.swiper_id,
            created_at: s.created_at,
            user: {
              id: s.swiper.user_id,
              username: s.swiper.username,
              full_name: s.swiper.full_name,
              bio: s.swiper.bio,
              avatar_url: s.swiper.profile_pic_url,
              location: s.swiper.location,
              is_verified: s.swiper.is_verified
            }
          }))

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

      // 1. Swipe right back
      await supabase.from('swipes').insert({
        swiper_id: user.id,
        swiped_id: request.swiper_id,
        direction: 'right'
      } as any)

      // 2. Create match
      await supabase.from('matches').insert({
        user1_id: user.id,
        user2_id: request.swiper_id
      } as any)

      // 3. Update UI
      setRequests(prev => prev.filter(r => r.swiper_id !== request.swiper_id))

      // Add to matches list (optimistic update)
      const newMatch: Match = {
        id: 'temp-' + Date.now(),
        user1_id: user.id,
        user2_id: request.swiper_id,
        is_mutual: true,
        created_at: new Date().toISOString(),
        user: {
          ...request.user,
          is_premium: false,
          is_creator: false,
          profession: ''
        }
      }
      setMatches(prev => [newMatch, ...prev])

      alert(`You are now friends with ${request.user.full_name}!`)

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

      // Swipe left
      await supabase.from('swipes').insert({
        swiper_id: user.id,
        swiped_id: request.swiper_id,
        direction: 'left'
      } as any)

      // Update UI
      setRequests(prev => prev.filter(r => r.swiper_id !== request.swiper_id))

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
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex items-center justify-between">
            <h3 className="text-lg font-bold">{selectedMatch.user.full_name}</h3>
            <button
              onClick={() => setShowProfileModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Image & Basic Info */}
            <div className="text-center">
              <img
                src={selectedMatch.user.avatar_url || `/api/placeholder/150/150`}
                alt={selectedMatch.user.full_name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <div className="flex items-center justify-center gap-2 mb-2">
                <h4 className="text-xl font-bold">{selectedMatch.user.full_name}</h4>
                {selectedMatch.user.is_verified && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <Crown className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {selectedMatch.user.location && (
                <div className="flex items-center justify-center gap-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{selectedMatch.user.location}</span>
                </div>
              )}
            </div>

            {/* Bio */}
            {selectedMatch.user.bio && (
              <div>
                <h5 className="font-semibold mb-2">About</h5>
                <p className="text-gray-700">{selectedMatch.user.bio}</p>
              </div>
            )}

            {/* Quick Actions */}
            <div className="space-y-3">
              <Button
                className="w-full flex items-center justify-center gap-2"
                onClick={() => handleStartChat(selectedMatch)}
              >
                <MessageCircle className="w-4 h-4" />
                Send Message
              </Button>

              {selectedMatch.user.instagram_handle && (
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => window.open(`https://instagram.com/${selectedMatch.user.instagram_handle}`, '_blank')}
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Connections</h1>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/social/swipe')}
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Find Friends
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'friends'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Friends ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === 'requests'
              ? 'bg-white text-purple-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Requests ({requests.length})
          </button>
        </div>

        {/* Content */}
        {activeTab === 'friends' ? (
          /* Friends List */
          matches.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No friends yet</h3>
              <p className="text-gray-600 mb-6">Start connecting with people to make friends!</p>
              <Button onClick={() => router.push('/social/swipe')}>
                <UserPlus className="w-4 h-4 mr-2" />
                Find Friends
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {matches.map((match) => (
                <Card key={match.id} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => {
                          setSelectedMatch(match)
                          setShowProfileModal(true)
                        }}
                        className="relative"
                      >
                        <img
                          src={match.user.avatar_url || `/api/placeholder/60/60`}
                          alt={match.user.full_name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        {match.user.is_verified && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {match.user.full_name}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Matched {getMatchAge(match.created_at)}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleStartChat(match)}
                          className="bg-purple-500 hover:bg-purple-600"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        ) : (
          /* Requests List */
          requests.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No pending requests</h3>
              <p className="text-gray-600">When people add you, they'll appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.swiper_id} className="card-hover">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={request.user.avatar_url || `/api/placeholder/60/60`}
                        alt={request.user.full_name}
                        className="w-16 h-16 rounded-full object-cover"
                      />

                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {request.user.full_name}
                        </h4>
                        <p className="text-sm text-gray-500 truncate">
                          {request.user.bio || 'No bio'}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500 border-red-200 hover:bg-red-50"
                          onClick={() => handleDeclineRequest(request)}
                          disabled={processingRequest === request.swiper_id}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-500 hover:bg-green-600 text-white"
                          onClick={() => handleAcceptRequest(request)}
                          disabled={processingRequest === request.swiper_id}
                        >
                          {processingRequest === request.swiper_id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
        )}
      </div>

      {/* Profile Modal */}
      {renderProfileModal()}
    </div>
  )
}