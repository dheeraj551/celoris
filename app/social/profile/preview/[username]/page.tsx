"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import InstagramPosts from "@/components/InstagramPosts"
import {
  User,
  Instagram,
  MapPin,
  Mail,
  Heart,
  Shield,
  Crown,
  Calendar,
  ArrowLeft
} from "lucide-react"
import Link from "next/link"


export default function ProfilePreviewPage() {
  const params = useParams()
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfile()
  }, [params.username])

  const loadProfile = async () => {
    try {
      const supabase = createClient()
      const username = params.username as string

      console.log('Loading profile for:', username)

      // Try to find by username first
      let { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('username', username)
        .maybeSingle()

      console.log('Username query result:', { profileData, profileError })

      // If not found by username and no error, try by id
      if (!profileData && !profileError && username) {
        const { data, error: idError } = await supabase
          .from('users')
          .select('*')
          .eq('id', username)
          .maybeSingle()

        console.log('ID query result:', { data, idError })

        if (idError && idError.code !== 'PGRST116') {
          console.error('Error loading profile by ID:', idError)
          setError('Failed to load profile')
          return
        }
        profileData = data
      }

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError)
        setError('Failed to load profile')
        return
      }

      if (!profileData) {
        console.log('No profile data found for:', username)
        setError('Profile not found')
        return
      }

      console.log('Profile loaded successfully:', profileData)
      setProfile(profileData)
    } catch (error) {
      console.error('Error loading profile:', error)
      setError('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Profile Not Found</h1>
          <p className="text-text-secondary mb-6">{error}</p>
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
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/social/profile">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Edit Profile
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture and Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200">
                  {profile.profile_pic_url && profile.profile_pic_url.trim() !== '' ? (
                    <img
                      src={`${profile.profile_pic_url}?t=${Date.now()}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || profile.username || 'User')}&background=6366f1&color=fff&size=128`;
                      }}
                    />
                  ) : (
                    <img
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || profile.username || 'User')}&background=6366f1&color=fff&size=128`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  )}
                </div>
                <CardTitle className="text-xl">{profile.full_name}</CardTitle>
                <CardDescription>@{profile.username}</CardDescription>

                {/* Account Status */}
                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile.subscription_status === 'premium'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-gray-100 text-gray-800'
                    }`}>
                    {profile.subscription_status === 'premium' ? (
                      <><Crown className="h-3 w-3 inline mr-1" /> Premium</>
                    ) : (
                      'Free'
                    )}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${profile.verification_status === 'verified'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-yellow-100 text-yellow-800'
                    }`}>
                    <Shield className="h-3 w-3 inline mr-1" />
                    {profile.verification_status || 'Pending'}
                  </span>
                </div>
              </CardHeader>
            </Card>
          </div>

          {/* Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {profile.bio && (
              <Card>
                <CardHeader>
                  <CardTitle>About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-text-secondary">{profile.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.instagram_handle && (
                  <div className="flex items-center gap-3">
                    <Instagram className="h-5 w-5 text-primary-500" />
                    <span className="text-text-secondary">@{profile.instagram_handle}</span>
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-primary-500" />
                    <span className="text-text-secondary">{profile.location}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Personal Info */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.gender && (
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-primary-500" />
                    <span className="text-text-secondary capitalize">{profile.gender}</span>
                  </div>
                )}
                {profile.date_of_birth && (
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-primary-500" />
                    <span className="text-text-secondary">
                      {new Date(profile.date_of_birth).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Posts */}
            {profile.id && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Instagram className="h-5 w-5 text-pink-500" />
                    Social Posts
                  </CardTitle>
                  <CardDescription>
                    Posts shared by {profile.full_name || profile.username}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InstagramPosts userId={profile.id} showHeader={false} />
                </CardContent>
              </Card>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button className="flex-1">
                <Heart className="h-4 w-4 mr-2" />
                Like Profile
              </Button>
              <Button variant="outline" className="flex-1">
                <Mail className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}