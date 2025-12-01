"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, UserPlus, MapPin, Search, UserCheck } from "lucide-react"
import { Input } from "@/components/ui/input"

interface UserProfile {
  user_id: string
  username: string
  full_name: string
  bio: string
  instagram_handle: string
  profile_pic_url: string
  location: string
  is_creator: boolean
  is_premium: boolean
}

export default function DiscoverPage() {
  const [user, setUser] = useState<any>(null)
  const [profiles, setProfiles] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingRequest, setSendingRequest] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [sentRequests, setSentRequests] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoadProfiles()
  }, [])

  const checkAuthAndLoadProfiles = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Get IDs of users already swiped on
      const { data: swipedData } = await supabase
        .from('swipes')
        .select('swiped_id')
        .eq('swiper_id', user.id)

      const swipedIds = swipedData?.map(s => s.swiped_id) || []
      swipedIds.push(user.id) // Exclude self

      // Load potential matches (random profiles excluding current user and already swiped)
      // Note: In a real app with many users, we'd want server-side filtering or pagination
      let query = supabase
        .from('social_profiles')
        .select('user_id, username, full_name, bio, instagram_handle, profile_pic_url, location, is_creator, is_premium')

      if (swipedIds.length > 0) {
        // If too many IDs, this might fail, but for now it's fine
        query = query.not('user_id', 'in', `(${swipedIds.join(',')})`)
      }

      const { data: availableProfiles, error } = await query.limit(50)

      if (error) {
        console.error('Error fetching profiles:', error)
      }

      if (availableProfiles) {
        setProfiles(availableProfiles)
      }
    } catch (error) {
      console.error('Error loading profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSendRequest = async (targetUserId: string) => {
    if (!user) return

    setSendingRequest(targetUserId)

    try {
      const supabase = createClient()

      // Record the swipe (Right swipe = Friend Request)
      await supabase.from('swipes').insert({
        swiper_id: user.id,
        swiped_id: targetUserId,
        direction: 'right'
      } as any)

      // Check for immediate match
      const { data: oppositeSwipe } = await supabase
        .from('swipes')
        .select('*')
        .eq('swiper_id', targetUserId)
        .eq('swiped_id', user.id)
        .eq('direction', 'right')
        .single()

      if (oppositeSwipe) {
        // Create match
        await supabase.from('matches').insert({
          user1_id: user.id,
          user2_id: targetUserId
        } as any)

        alert("It's a match! You are now friends.")
      }

      // Update local state
      setSentRequests(prev => new Set(prev).add(targetUserId))

      // Optional: Remove from list or keep as "Requested"
      // setProfiles(prev => prev.filter(p => p.user_id !== targetUserId))

    } catch (error) {
      console.error('Error sending request:', error)
    } finally {
      setSendingRequest(null)
    }
  }

  const filteredProfiles = profiles.filter(profile => {
    if (!searchTerm) return true
    const term = searchTerm.toLowerCase()
    return (
      profile.full_name?.toLowerCase().includes(term) ||
      profile.username?.toLowerCase().includes(term) ||
      profile.location?.toLowerCase().includes(term)
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading people...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Discover People</h1>
            <p className="text-gray-600">Find friends and connect with people</p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search people..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" onClick={() => router.push('/social/matches')}>
              <Heart className="h-4 w-4 mr-2" />
              Matches
            </Button>
          </div>
        </div>

        {/* Grid */}
        {filteredProfiles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No profiles found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {searchTerm ? "Try adjusting your search terms." : "We couldn't find any new people to show you right now. Check back later!"}
            </p>
            {searchTerm && (
              <Button variant="link" onClick={() => setSearchTerm('')} className="mt-2">
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfiles.map((profile) => (
              <Card key={profile.user_id} className="overflow-hidden hover:shadow-md transition-shadow duration-200">
                <div className="aspect-square relative bg-gray-200">
                  <img
                    src={profile.profile_pic_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name)}&background=6366f1&color=fff&size=400`}
                    alt={profile.full_name}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => window.open(`/social/profile/preview/${profile.username || profile.user_id}`, '_blank')}
                  />
                  {profile.is_creator && (
                    <div className="absolute top-3 right-3 bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                      CREATOR
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="mb-3">
                    <h3 className="font-bold text-lg text-gray-900 truncate">{profile.full_name}</h3>
                    {profile.location && (
                      <div className="flex items-center text-gray-500 text-sm mt-1">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="truncate">{profile.location}</span>
                      </div>
                    )}
                  </div>

                  {profile.bio && (
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                      {profile.bio}
                    </p>
                  )}

                  {sentRequests.has(profile.user_id) ? (
                    <Button className="w-full bg-gray-100 text-gray-600 hover:bg-gray-200" disabled>
                      <UserCheck className="h-4 w-4 mr-2" />
                      Request Sent
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                      onClick={() => handleSendRequest(profile.user_id)}
                      disabled={sendingRequest === profile.user_id}
                    >
                      {sendingRequest === profile.user_id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Friend
                        </>
                      )}
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
