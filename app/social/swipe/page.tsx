"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Mail, ChevronLeft, ChevronRight, Crown, ShieldCheck, MapPin, Instagram } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
      console.log('Current user:', user.id)

      // Get IDs of users already swiped on
      const { data: swipedData, error: swipeError } = await supabase
        .from('swipes')
        .select('target_user_id')
        .eq('swiper_id', user.id)

      if (swipeError) {
        console.error('Error fetching swipes:', swipeError)
      }

      // Explicitly type swipedData as any[] to avoid 'never' inference if types are missing
      const swipedIds = (swipedData as any[])?.map((s: any) => s.target_user_id) || []
      swipedIds.push(user.id) // Exclude self
      console.log('Swiped IDs:', swipedIds)

      // Load potential matches from users table
      let query = supabase
        .from('users')
        .select('id, username, full_name, bio, profile_pic_url, location, subscription_status, verification_status')
        .neq('is_social_blocked', true)

      // Only filter if we have IDs to filter
      if (swipedIds.length > 0) {
        // Use a filter that doesn't break with large lists, though for now 'not.in' is fine
        query = query.not('id', 'in', `(${swipedIds.join(',')})`)
      }

      const { data: availableProfiles, error } = await query.limit(50)

      if (error) {
        console.error('Error fetching profiles:', error)
      } else {
        console.log('Fetched profiles:', availableProfiles?.length)
      }

      if (availableProfiles) {
        // Get avatar URLs from storage and map to expected format
        const profilesWithAvatars = await Promise.all(
          (availableProfiles as any[]).map(async (profile: any) => {
            let avatar_url = undefined
            if (profile.profile_pic_url) {
              console.log('Processing profile pic:', profile.profile_pic_url)
              // Check if it's already a full URL
              if (profile.profile_pic_url.startsWith('http')) {
                avatar_url = profile.profile_pic_url
              } else {
                const { data: publicUrlData } = supabase.storage
                  .from('avatars')
                  .getPublicUrl(profile.profile_pic_url)

                avatar_url = publicUrlData.publicUrl
                console.log('Generated public URL:', avatar_url)
              }
            } else {
              console.log('No profile pic for user:', profile.username)
            }

            // Map users table fields to expected profile format
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

      // Record the like (right swipe)
      const { error: insertError } = await supabase.from('swipes').insert({
        swiper_id: user.id,
        target_user_id: currentProfile.user_id,
        direction: 'like'
      } as any)

      if (insertError) {
        console.error('Error inserting like:', insertError)
        return
      }

      // Check for immediate match
      const { data: oppositeSwipe } = await supabase
        .from('swipes')
        .select('*')
        .eq('swiper_id', currentProfile.user_id)
        .eq('target_user_id', user.id)
        .eq('direction', 'like')
        .single()

      if (oppositeSwipe) {
        // Create match
        await supabase.from('matches').insert({
          user1_id: user.id,
          user2_id: currentProfile.user_id
        } as any)

        alert("It's a match! 🎉")
      }

      // Move to next profile
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

      // Record the friend request
      const { error: insertError } = await supabase.from('swipes').insert({
        swiper_id: user.id,
        target_user_id: currentProfile.user_id,
        direction: 'like'
      } as any)

      if (insertError) {
        console.error('Error inserting swipe:', insertError)
        alert('Failed to send request: ' + insertError.message)
        return
      }

      // Check for immediate match
      const { data: oppositeSwipe } = await supabase
        .from('swipes')
        .select('*')
        .eq('swiper_id', currentProfile.user_id)
        .eq('target_user_id', user.id)
        .eq('direction', 'like')
        .single()

      if (oppositeSwipe) {
        // Create match
        await supabase.from('matches').insert({
          user1_id: user.id,
          user2_id: currentProfile.user_id
        } as any)

        alert("It's a match! You can now message each other. 🎉")
        router.push('/social/chat')
      } else {
        alert("Friend request sent! ✓")
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
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Loading profiles...</p>
        </div>
      </div>
    )
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-gray-800 border-gray-700">
          <CardContent className="p-8 text-center">
            <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">No More Profiles</h2>
            <p className="text-gray-400 mb-6">
              You've seen all available profiles. Check back later for new people!
            </p>
            <Button onClick={() => router.push('/social')} className="bg-purple-600 hover:bg-purple-700">
              Back to Social
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
            className="text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            Previous
          </Button>
          <span className="text-white text-sm">
            {currentIndex + 1} / {profiles.length}
          </span>
          <Button
            variant="ghost"
            onClick={handleNext}
            disabled={currentIndex === profiles.length - 1}
            className="text-white hover:bg-white/10"
          >
            Next
            <ChevronRight className="h-5 w-5 ml-1" />
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="bg-gradient-to-b from-amber-50 to-amber-100 border-none shadow-2xl overflow-hidden">
          <CardContent className="p-8">
            {/* Profile Image */}
            <div className="flex justify-center mb-6">
              <Avatar className="h-48 w-48 border-4 border-white shadow-xl">
                <AvatarImage
                  src={currentProfile.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentProfile.full_name)}&background=6366f1&color=fff&size=400`}
                  alt={currentProfile.full_name}
                  className="select-none"
                  onContextMenu={(e: any) => e.preventDefault()}
                  draggable={false}
                />
                <AvatarFallback className="text-4xl bg-purple-500 text-white">
                  {currentProfile.full_name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Name and Username */}
            <div className="text-center mb-4">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {currentProfile.full_name}
              </h1>
              <p className="text-gray-600 text-lg">
                @{currentProfile.username || currentProfile.user_id.slice(0, 8)}
              </p>
            </div>

            {/* Badges */}
            <div className="flex justify-center gap-2 mb-6">
              {currentProfile.is_premium && (
                <span className="inline-flex items-center gap-1 bg-amber-200 text-amber-900 px-3 py-1 rounded-full text-sm font-medium">
                  <Crown className="h-4 w-4" />
                  Premium
                </span>
              )}
              {currentProfile.is_creator && (
                <span className="inline-flex items-center gap-1 bg-green-200 text-green-900 px-3 py-1 rounded-full text-sm font-medium">
                  <ShieldCheck className="h-4 w-4" />
                  verified
                </span>
              )}
            </div>

            {/* About Section */}
            {currentProfile.bio && (
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  About {currentProfile.full_name.split(' ')[0]}:
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {currentProfile.bio}
                </p>
              </div>
            )}

            {/* Location */}
            {currentProfile.location && (
              <div className="flex items-center justify-center text-gray-600 mb-6">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{currentProfile.location}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                onClick={handleLikeProfile}
                disabled={liking}
                className="bg-rose-400 hover:bg-rose-500 text-white py-6 text-lg font-medium"
              >
                {liking ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Heart className="h-5 w-5 mr-2" />
                    Like Profile
                  </>
                )}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={sendingRequest}
                className="bg-gray-800 hover:bg-gray-900 text-white py-6 text-lg font-medium"
              >
                {sendingRequest ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Mail className="h-5 w-5 mr-2" />
                    Add Friend
                  </>
                )}
              </Button>
            </div>
            {/* Social Highlights */}
            {socialPosts.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-inner">
                <div className="flex items-center gap-2 mb-4">
                  <Instagram className="h-5 w-5 text-gray-700" />
                  <h3 className="text-lg font-bold text-gray-900">Social Highlights</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  Posts shared by {currentProfile.full_name.split(' ')[0]}
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {socialPosts.map((post) => (
                    <div key={post.id} className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer">
                      <img
                        src={post.media_url}
                        alt={post.caption || 'Social post'}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 select-none"
                        onContextMenu={(e) => e.preventDefault()}
                        draggable={false}
                      />
                      {post.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2 truncate">
                          {post.caption}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}


          </CardContent>
        </Card>
      </div>
    </div>
  )
}
