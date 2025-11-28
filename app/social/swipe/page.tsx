"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, X, Instagram, MapPin, User, MessageCircle, Phone, Video, Shield } from "lucide-react"

interface UserProfile {
  id: string
  username: string
  full_name: string
  bio: string
  instagram_handle: string
  profile_pic_url: string
  location: string
  subscription_status: string
}

export default function SwipePage() {
  const [user, setUser] = useState<any>(null)
  const [currentProfile, setCurrentProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [swipeLoading, setSwipeLoading] = useState(false)
  const [swipeDirection, setSwipeDirection] = useState<string | null>(null)
  const [profileIndex, setProfileIndex] = useState(0)
  const [profiles, setProfiles] = useState<UserProfile[]>([])
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

      // Load potential matches (random profiles excluding current user and already swiped)
      const { data: availableProfiles } = await supabase
        .from('users')
        .select('id, username, full_name, bio, instagram_handle, profile_pic_url, location, subscription_status')
        .neq('id', user.id)
        .limit(20)

      if (availableProfiles) {
        setProfiles(availableProfiles)
        if (availableProfiles.length > 0) {
          setCurrentProfile(availableProfiles[0])
        }
      }
    } catch (error) {
      console.error('Error loading profiles:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSwipe = async (direction: 'left' | 'right' | 'super_like') => {
    if (!currentProfile || !user) return

    setSwipeLoading(true)
    setSwipeDirection(direction)

    try {
      const supabase = createClient()

      // Record the swipe
      await supabase.from('swipes').insert({
        swiper_id: user.id,
        swiped_id: currentProfile.id,
        direction: direction === 'super_like' ? 'super_like' : direction
      } as any)

      // If it's a right swipe, check for immediate match
      if (direction === 'right') {
        const { data: oppositeSwipe } = await supabase
          .from('swipes')
          .select('*')
          .eq('swiper_id', currentProfile.id)
          .eq('swiped_id', user.id)
          .eq('direction', 'right')
          .single()

        if (oppositeSwipe) {
          // Create match
          await supabase.from('matches').insert({
            user1_id: user.id,
            user2_id: currentProfile.id
          } as any)

          // Show match notification
          showMatchNotification(currentProfile)
        }
      }

      // Move to next profile
      setTimeout(() => {
        nextProfile()
      }, 500)

    } catch (error) {
      console.error('Error recording swipe:', error)
    } finally {
      setSwipeLoading(false)
      setSwipeDirection(null)
    }
  }

  const nextProfile = () => {
    const nextIndex = profileIndex + 1
    if (nextIndex < profiles.length) {
      setProfileIndex(nextIndex)
      setCurrentProfile(profiles[nextIndex])
    } else {
      // No more profiles
      setCurrentProfile(null)
    }
  }

  const showMatchNotification = (matchedUser: UserProfile) => {
    // Create a more detailed notification with navigation options
    const shouldNavigateToMatches = confirm(`🎉 It's a Match! You and ${matchedUser.full_name} both liked each other!\n\nWould you like to view your matches now?`)
    
    if (shouldNavigateToMatches) {
      router.push('/social/matches')
    }
  }

  const handleInstagramClick = (handle: string) => {
    window.open(`https://instagram.com/${handle}`, '_blank')
  }

  const handleMessage = () => {
    // In production, this would navigate to chat page
    alert('Chat feature coming soon!')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading your matches...</p>
        </div>
      </div>
    )
  }

  if (!currentProfile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-12 w-12 text-purple-500" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">No more profiles!</h2>
          <p className="text-text-secondary mb-6">
            You've seen everyone in your area. Check back later for new users or expand your search preferences.
          </p>
          <div className="flex flex-col gap-3">
            <Button asChild>
              <a href="/social/profile">Update Profile</a>
            </Button>
            <Button variant="outline" asChild>
              <a href="/social">Back to Social</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="container max-w-md mx-auto py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-text-primary">InstaLinkr</h1>
          </div>
          <div className="flex items-center space-x-2 text-sm text-text-secondary">
            <span>{profileIndex + 1} of {profiles.length}</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="relative mb-8">
          <Card className={`overflow-hidden transition-all duration-500 ${
            swipeDirection === 'left' ? '-translate-x-full rotate-[-15deg] opacity-0' :
            swipeDirection === 'right' ? 'translate-x-full rotate-[15deg] opacity-0' :
            swipeDirection === 'super_like' ? 'translate-y-[-50px] scale-110 opacity-0' :
            ''
          }`}>
            <CardContent className="p-0">
              <div className="relative">
                <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
                  <img
                    src={currentProfile.profile_pic_url || `https://ui-avatars.com/api/?name=${currentProfile.full_name}&background=6366f1&color=fff&size=300`}
                    alt={currentProfile.full_name}
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  {/* Instagram badge */}
                  {currentProfile.instagram_handle && (
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => handleInstagramClick(currentProfile.instagram_handle!)}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 hover:shadow-lg transition-all"
                      >
                        <Instagram className="h-3 w-3" />
                        <span>@{currentProfile.instagram_handle}</span>
                      </button>
                    </div>
                  )}

                  {/* Profile info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h2 className="text-2xl font-bold mb-1">{currentProfile.full_name}</h2>
                    {currentProfile.location && (
                      <div className="flex items-center space-x-1 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span className="text-sm">{currentProfile.location}</span>
                      </div>
                    )}
                    <p className="text-sm opacity-90 line-clamp-2">{currentProfile.bio}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Super Like Badge */}
          {swipeDirection === 'super_like' && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
              <div className="bg-blue-500 text-white px-6 py-3 rounded-full font-bold text-xl border-4 border-white shadow-lg">
                SUPER LIKE
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center space-x-6 mb-8">
          <button
            onClick={() => handleSwipe('left')}
            disabled={swipeLoading}
            className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:shadow-xl transition-all disabled:opacity-50"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={() => handleSwipe('super_like')}
            disabled={swipeLoading || user?.subscription_status !== 'premium'}
            className={`w-16 h-16 rounded-full shadow-lg flex items-center justify-center transition-all disabled:opacity-50 ${
              user?.subscription_status === 'premium' 
                ? 'bg-blue-500 text-white hover:bg-blue-600 hover:shadow-xl' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title={user?.subscription_status !== 'premium' ? 'Premium feature' : 'Super Like'}
          >
            <Heart className="h-6 w-6" />
          </button>

          <button
            onClick={() => handleSwipe('right')}
            disabled={swipeLoading}
            className="w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400 hover:text-green-500 hover:shadow-xl transition-all disabled:opacity-50"
          >
            <Heart className="h-6 w-6" />
          </button>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-3 gap-4">
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 h-12"
            onClick={() => router.push('/social/matches')}
          >
            <Heart className="h-4 w-4" />
            <span>Matches</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 h-12"
            onClick={() => handleInstagramClick(currentProfile.instagram_handle!)}
            disabled={!currentProfile.instagram_handle}
          >
            <Instagram className="h-4 w-4" />
            <span>Instagram</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center space-x-2 h-12"
            onClick={handleMessage}
          >
            <MessageCircle className="h-4 w-4" />
            <span>Message</span>
          </Button>
        </div>

        {/* Premium Call-to-Action */}
        {user?.subscription_status === 'free' && (
          <div className="mt-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-3 mb-3">
              <Shield className="h-5 w-5 text-yellow-600" />
              <span className="font-medium text-yellow-800">Unlock Premium Features</span>
            </div>
            <p className="text-sm text-yellow-700 mb-3">
              Get unlimited likes, super likes, video calls, and more!
            </p>
            <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-600" asChild>
              <a href="/social/upgrade">Upgrade Now</a>
            </Button>
          </div>
        )}

        {/* Back Navigation */}
        <div className="mt-8 text-center">
          <Button variant="ghost" asChild>
            <a href="/social">← Back to Social</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
