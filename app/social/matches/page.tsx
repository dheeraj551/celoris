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
  X
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

export default function MatchesPage() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'all' | 'creators' | 'recent'>('all')
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoadMatches()
  }, [])

  const checkAuthAndLoadMatches = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // 1. Load raw matches first (without joins)
      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select('*')
        .or(`user1_id.eq.${user.id},user2_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (matchesError) {
        console.error('Error loading matches:', matchesError)
        return
      }

      if (!matchesData || matchesData.length === 0) {
        setMatches([])
        return
      }

      // 2. Collect all unique user IDs to fetch
      const userIdsToFetch = new Set<string>()
      matchesData.forEach((match: any) => {
        if (match.user1_id !== user.id) userIdsToFetch.add(match.user1_id)
        if (match.user2_id !== user.id) userIdsToFetch.add(match.user2_id)
      })

      // 3. Fetch user details
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, username, full_name, bio, profile_pic_url, location, instagram_handle')
        .in('id', Array.from(userIdsToFetch))

      if (usersError) {
        console.error('Error loading user details:', usersError)
      }

      // Create a map for easy lookup
      const usersMap = new Map()
      usersData?.forEach((u: any) => usersMap.set(u.id, u))

      // 4. Process matches and attach user data
      const allMatches = matchesData
        .map((match: any) => {
          const otherUserId = match.user1_id === user.id ? match.user2_id : match.user1_id
          const otherUser = usersMap.get(otherUserId)

          if (!otherUser) return null // Skip if user data not found

          return {
            ...match,
            user: {
              id: otherUser.id,
              username: otherUser.username || '',
              full_name: otherUser.full_name || '',
              bio: otherUser.bio || '',
              avatar_url: otherUser.profile_pic_url || '',
              location: otherUser.location || '',
              instagram_handle: otherUser.instagram_handle || '',
              is_verified: false,
              is_premium: false,
              is_creator: false,
              profession: ''
            }
          }
        })
        .filter(Boolean) as Match[] // Filter out nulls

      setMatches(allMatches)
    } catch (error) {
      console.error('Error loading matches:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMatches = matches.filter(match => {
    if (activeTab === 'creators') return match.user.is_creator === true
    if (activeTab === 'recent') {
      const dayAgo = new Date()
      dayAgo.setDate(dayAgo.getDate() - 1)
      return new Date(match.created_at) > dayAgo
    }
    return true
  })

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
    // Navigate to chat with this match
    router.push(`/social/chat/${match.id}`)
  }

  const handleSendTip = (match: Match) => {
    // Navigate to tip page
    router.push(`/social/tip/${match.id}`)
  }

  const handleSubscribe = (match: Match) => {
    // Navigate to subscription page
    router.push(`/social/subscribe/${match.id}`)
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
                {selectedMatch.user.is_premium && (
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Star className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>

              {selectedMatch.user.profession && (
                <p className="text-gray-600 mb-1">
                  {selectedMatch.user.profession}
                </p>
              )}

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
              <h5 className="font-semibold">Quick Actions</h5>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  className="flex items-center gap-2"
                  onClick={() => handleStartChat(selectedMatch)}
                >
                  <MessageCircle className="w-4 h-4" />
                  Chat
                </Button>

                {selectedMatch.user.instagram_handle && (
                  <Button
                    variant="outline"
                    className="flex items-center gap-2"
                    onClick={() => window.open(`https://instagram.com/${selectedMatch.user.instagram_handle}`, '_blank')}
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </Button>
                )}
              </div>
            </div>

            {/* Monetization Options */}
            <div className="space-y-3">
              <h5 className="font-semibold">Support {selectedMatch.user.full_name}</h5>
              <div className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => handleSendTip(selectedMatch)}
                >
                  <Gift className="w-4 h-4 mr-2" />
                  Send Tip
                </Button>


                {selectedMatch.user.is_creator === true && (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleSubscribe(selectedMatch)}
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Subscribe
                  </Button>
                )}
              </div>
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
          <p className="text-gray-600">Loading matches...</p>
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
            <h1 className="text-2xl font-bold">Matches</h1>
            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm font-medium">
              {matches.length}
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/social/swipe')}
          >
            <Heart className="w-4 h-4 mr-2" />
            Keep Swiping
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'all', label: 'All', count: matches.length },
            { key: 'creators', label: 'Creators', count: matches.filter(m => m.user.is_creator === true).length },
            {
              key: 'recent', label: 'Recent', count: matches.filter(m => {
                const dayAgo = new Date()
                dayAgo.setDate(dayAgo.getDate() - 1)
                return new Date(m.created_at) > dayAgo
              }).length
            }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === tab.key
                ? 'bg-white text-purple-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
                }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        {/* Matches List */}
        {filteredMatches.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {activeTab === 'creators' ? 'No creator matches yet' :
                activeTab === 'recent' ? 'No recent matches' : 'No matches yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === 'creators' ? 'Keep swiping to find amazing creators!' :
                activeTab === 'recent' ? 'Check back tomorrow for new matches!' :
                  'Start swiping to find your perfect connections!'}
            </p>
            <Button onClick={() => router.push('/social/swipe')}>
              <Heart className="w-4 h-4 mr-2" />
              Start Swiping
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMatches.map((match) => (
              <Card key={match.id} className="card-hover">
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Profile Image */}
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

                    {/* User Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-gray-900 truncate">
                          {match.user.full_name}
                        </h4>
                        {match.user.is_premium && (
                          <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Star className="w-3 h-3 text-white" />
                          </div>
                        )}
                        {match.user.is_creator && (
                          <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                            <Crown className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      {match.user.profession && (
                        <p className="text-sm text-gray-600 truncate">
                          {match.user.profession}
                        </p>
                      )}

                      <div className="flex items-center gap-2 mt-1">
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-500">
                          {getMatchAge(match.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleStartChat(match)}
                        className="bg-purple-500 hover:bg-purple-600"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </Button>


                      {match.user.is_creator === true && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendTip(match)}
                          className="text-green-600 border-green-600 hover:bg-green-50"
                        >
                          <Gift className="w-4 w-4" />
                        </Button>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedMatch(match)
                          setShowProfileModal(true)
                        }}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Creator Tips Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-3 mb-4">
            <Crown className="w-6 h-6 text-yellow-600" />
            <h3 className="text-lg font-bold text-yellow-800">Support Your Favorite Creators</h3>
          </div>
          <p className="text-yellow-700 text-sm mb-4">
            Show some love to creators by sending tips or subscribing to their exclusive content.
          </p>
          <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
            <Gift className="w-4 h-4 mr-2" />
            Learn About Tips
          </Button>
        </div>
      </div>

      {/* Profile Modal */}
      {renderProfileModal()}
    </div>
  )
}