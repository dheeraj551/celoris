"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import {
  User,
  MapPin,
  Mail,
  Instagram,
  Facebook,
  Heart,
  Shield,
  Crown,
  Calendar,
  ArrowLeft,
  CheckCircle2,
  UserPlus,
  Check
} from "lucide-react"
import Link from "next/link"
import { AdUnit } from "@/components/AdUnit"
import InstagramPosts from "@/components/InstagramPosts"

export default function ProfilePreviewPage() {
  const params = useParams()
  const [profile, setProfile] = useState<any>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [requestSent, setRequestSent] = useState(false)
  const [sendingRequest, setSendingRequest] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    loadProfile()
  }, [params.username])

  const loadProfile = async () => {
    try {
      const supabase = createClient()
      const username = params.username as string

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUser(user)

      let profileData = null

      // 1. Try to find by username (case-insensitive)
      const { data: byUsername } = await supabase
        .from('users')
        .select('*')
        .ilike('username', username)
        .maybeSingle()

      if (byUsername) {
        profileData = byUsername
      } else {
        // 2. If not found and input is a valid UUID, try by ID
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(username)
        if (isUuid) {
          const { data: byId } = await supabase
            .from('users')
            .select('*')
            .eq('id', username)
            .maybeSingle()
          profileData = byId
        }
      }

      if (!profileData || (profileData as any).is_social_blocked) {
        setError('Profile unavailable or not found')
        return
      }

      // Fix relative profile picture URLs
      if ((profileData as any).profile_pic_url && !(profileData as any).profile_pic_url.startsWith('http')) {
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl((profileData as any).profile_pic_url)

        if (data) {
          (profileData as any).profile_pic_url = data.publicUrl
        }
      }

      setProfile(profileData)

      // Check if friend request already sent (swipe right)
      if (user && profileData) {
        const profileAny = profileData as any
        const { data: swipe } = await supabase
          .from('swipes')
          .select('*')
          .eq('swiper_id', user.id)
          .eq('target_user_id', profileAny.id)
          .eq('direction', 'like')
          .maybeSingle()

        if (swipe) {
          setRequestSent(true)
        }
      }

      // Check if already liked
      if (user && profileData) {
        const profileAny = profileData as any
        const { data: like } = await supabase
          .from('swipes')
          .select('*')
          .eq('swiper_id', user.id)
          .eq('target_user_id', profileAny.id)
          .eq('direction', 'like')
          .maybeSingle()

        if (like) {
          setIsLiked(true)
        }
      }

    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleLikeProfile = async () => {
    if (!currentUser || !profile || isLiked) return

    try {
      const supabase = createClient()

      // Insert like into swipes table (using 'like' as direction)
      const { error } = await supabase.from('swipes').insert({
        swiper_id: currentUser.id,
        target_user_id: profile.id,
        direction: 'like'
      } as any)

      if (error) throw error

      setIsLiked(true)
      setRequestSent(true)
      alert("Profile Liked!")

    } catch (error) {
      console.error('Error liking profile:', error)
      alert("Failed to like profile")
    }
  }

  const handleAddFriend = async () => {
    if (!currentUser || !profile || requestSent || sendingRequest) return

    setSendingRequest(true)
    try {
      const supabase = createClient()

      // Record the swipe (friend request)
      const { error } = await supabase.from('swipes').insert({
        swiper_id: currentUser.id,
        target_user_id: profile.id,
        direction: 'like'
      } as any)

      if (error) throw error

      // Check for match (if they already swiped right on us)
      const { data: oppositeSwipe } = await supabase
        .from('swipes')
        .select('*')
        .eq('swiper_id', profile.id)
        .eq('target_user_id', currentUser.id)
        .eq('direction', 'like')
        .single()


      if (oppositeSwipe) {
        // Create match
        await supabase.from('matches').insert({
          user1_id: currentUser.id,
          user2_id: profile.id
        } as any)
        alert("It's a match! You are now friends.")
      } else {
        alert("Friend request sent!")
      }

      setRequestSent(true)
      setIsLiked(true)
    } catch (error) {
      console.error('Error sending friend request:', error)
      alert('Failed to send friend request')
    } finally {
      setSendingRequest(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Found</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button asChild>
            <Link href="/social/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Profile
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FDF8F3] font-sans pt-8">
      <div className="container max-w-6xl mx-auto px-4 pb-24">
        {/* Cover Image & Profile Picture Wrapper */}
        <div className="relative mb-20">
          {/* Ad Banner Area */}
          <div className="w-full h-auto min-h-[250px] rounded-3xl overflow-hidden shadow-lg bg-white flex items-center justify-center">
            <AdUnit format="horizontal" className="my-0" />
          </div>

          {/* Profile Picture (Absolute to wrapper, NOT inside overflow-hidden container) */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#FDF8F3] overflow-hidden shadow-xl bg-white">
              <img
                src={profile.profile_pic_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || profile.username)}&background=6366f1&color=fff&size=160`}
                alt={profile.full_name}
                className="w-full h-full object-cover select-none"
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || profile.username)}&background=6366f1&color=fff&size=160`;
                }}
              />
            </div>
          </div>
        </div>

        {/* Profile Header Info */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{profile.full_name}</h1>
          <p className="text-gray-500 mb-4">@{profile.username}</p>

          <div className="flex items-center justify-center gap-3">
            {profile.subscription_status === 'premium' && (
              <span className="bg-[#EAD8B1] text-[#8B7355] px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <Crown className="w-3 h-3 fill-current" /> Premium
              </span>
            )}
            {profile.verification_status === 'verified' && (
              <span className="bg-[#D1E7DD] text-[#0F5132] px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}


        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Info */}
          <div className="space-y-6">
            {/* About Section */}
            <div className="bg-transparent">
              <h3 className="text-xl font-bold text-gray-900 mb-4">About {profile.full_name?.split(' ')[0]}</h3>
              <p className="text-gray-700 leading-relaxed">
                {profile.bio || "No bio available."}
              </p>
            </div>

            {/* Contact Info Card */}
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                {profile.location && (
                  <div className="flex items-center gap-3 text-gray-700">
                    <MapPin className="h-5 w-5" />
                    <span>{profile.location}</span>
                  </div>
                )}
                <div
                  className="flex items-center gap-3 text-gray-700 cursor-pointer hover:text-primary-600 transition-colors"
                  onClick={handleAddFriend}
                >
                  {requestSent ? <Check className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                  <span>{requestSent ? 'Request Sent' : 'Add Friend'}</span>
                </div>
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Social Highlights */}
          <div className="lg:col-span-2">
            <Card className="border-none shadow-sm bg-white rounded-2xl overflow-hidden h-full">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Instagram className="w-6 h-6 text-pink-600" />
                  <CardTitle className="text-xl">Social Highlights</CardTitle>
                </div>
                <p className="text-sm text-gray-500">Posts shared by {profile.full_name}</p>
              </CardHeader>
              <CardContent>
                <InstagramPosts userId={profile.id} showHeader={false} displayMode="horizontal" autoScroll={true} />
              </CardContent>
            </Card>
          </div>


        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#FDF8F3] border-t border-gray-200 p-4 z-40">
        <div className="container max-w-4xl mx-auto flex gap-4">
          <Button
            className={`flex-1 ${isLiked ? 'bg-pink-600 hover:bg-pink-700' : 'bg-[#4A6755] hover:bg-[#3A5244]'} text-white rounded-lg h-12 text-lg`}
            onClick={handleLikeProfile}
            disabled={isLiked}
          >
            <Heart className={`w-5 h-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
            {isLiked ? 'Liked' : 'Like Profile'}
          </Button>
          <Button
            variant="outline"
            className={`flex-1 border-[#1E293B] text-[#1E293B] hover:bg-gray-100 rounded-lg h-12 text-lg ${requestSent ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={handleAddFriend}
            disabled={requestSent || sendingRequest}
          >
            {requestSent ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Request Sent
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Add Friend
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}