"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import InstagramManager from "@/components/InstagramManager"
import InstagramPosts from "@/components/InstagramPosts"

import {
  User,
  Instagram,
  Facebook,
  MapPin,
  Mail,
  Camera,
  Settings,
  Heart,
  Shield,
  Crown,
  Save,
  Eye,
  EyeOff
} from "lucide-react"


export default function SocialProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [preferences, setPreferences] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showSettings, setShowSettings] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    username: '',
    full_name: '',
    bio: '',
    location: '',
    gender: '',
    date_of_birth: '',
  })

  const [preferencesData, setPreferencesData] = useState({
    min_age: 18,
    max_age: 100,
    max_distance: 50,
    gender_preference: 'all',
    looking_for: 'friends',
    interests: [] as string[]
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size should be less than 5MB' })
        return
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' })
        return
      }

      setSelectedFile(file)
      uploadProfilePhoto(file)
    }
  }

  const uploadProfilePhoto = async (file: File) => {
    try {
      setUploadingPhoto(true)
      const supabase = createClient()

      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setMessage({ type: 'error', text: 'User not authenticated' })
        return
      }

      // Generate unique filename
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/profile-photo.${fileExt}`
      const filePath = `avatars/${fileName}`

      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        throw uploadError
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update user profile with new photo URL
      const { error: updateError } = await (supabase as any)
        .from('users')
        .update({ profile_pic_url: publicUrl })
        .eq('id', user.id)

      if (updateError) {
        throw updateError
      }

      // Refresh profile data
      await checkAuthAndLoadProfile()

      setMessage({ type: 'success', text: 'Profile photo updated successfully!' })
      console.log('Profile photo uploaded successfully. New URL:', publicUrl)
    } catch (error) {
      console.error('Error uploading photo:', error)
      console.error('Error details:', error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      setMessage({ type: 'error', text: `Failed to upload photo: ${errorMessage || 'Please try again.'}` })
    } finally {
      setUploadingPhoto(false)
      setSelectedFile(null)
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const triggerFileUpload = () => {
    fileInputRef.current?.click()
  }

  useEffect(() => {
    checkAuthAndLoadProfile()
  }, [])

  const checkAuthAndLoadProfile = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Load user profile - use maybeSingle() to handle cases where profile doesn't exist
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error loading profile:', profileError)
      }

      if (profile) {
        console.log('Profile data loaded:', profile)
        setProfile(profile)
        setFormData({
          username: (profile as any).username || '',
          full_name: (profile as any).full_name || '',
          bio: (profile as any).bio || '',
          location: (profile as any).location || '',
          gender: (profile as any).gender || '',
          date_of_birth: (profile as any).date_of_birth || '',
        })
      } else {
        console.log('No profile data found for user, creating profile...')

        // Create profile for user if it doesn't exist (only include fields that exist)
        const { data: newProfile, error: createError } = await (supabase as any)
          .from('users')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            username: user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`
          })
          .select()
          .single()

        if (createError) {
          console.error('Error creating profile:', createError)
          // Still set basic form data even if profile creation fails
          setFormData({
            username: user.email?.split('@')[0] || `user_${user.id.slice(0, 8)}`,
            full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
            bio: '',
            location: '',
            gender: '',
            date_of_birth: '',
          })
        } else {
          console.log('Profile created successfully:', newProfile)
          setProfile(newProfile)
          setFormData({
            username: newProfile.username || '',
            full_name: newProfile.full_name || '',
            bio: newProfile.bio || '',
            location: newProfile.location || '',
            gender: newProfile.gender || '',
            date_of_birth: newProfile.date_of_birth || '',
          })
        }
      }

      // Load user preferences - use maybeSingle() to handle cases where preferences don't exist
      const { data: userPrefs, error: prefsError } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

      if (prefsError && prefsError.code !== 'PGRST116') {
        console.error('Error loading preferences:', prefsError)
      }

      if (userPrefs) {
        setPreferences(userPrefs)
        setPreferencesData({
          min_age: (userPrefs as any).min_age || 18,
          max_age: (userPrefs as any).max_age || 100,
          max_distance: (userPrefs as any).max_distance || 50,
          gender_preference: (userPrefs as any).gender_preference || 'all',
          looking_for: (userPrefs as any).looking_for || 'friends',
          interests: (userPrefs as any).interests || []
        })
      } else {
        console.log('No user preferences found, will create on save')
      }

    } catch (error) {
      console.error('Error loading profile:', error)
      setMessage({ type: 'error', text: 'Failed to load profile' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePreferenceChange = (field: string, value: any) => {
    setPreferencesData(prev => ({ ...prev, [field]: value }))
  }

  const handleInterestToggle = (interest: string) => {
    setPreferencesData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }))
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const supabase = createClient()

      // Update user profile
      const { error: profileError } = await (supabase as any)
        .from('users')
        .update({
          username: formData.username,
          full_name: formData.full_name,
          bio: formData.bio,
          location: formData.location,
          gender: formData.gender,
          date_of_birth: formData.date_of_birth,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (profileError) throw profileError

      // Try to update or insert user preferences (optional - don't fail if this fails)
      try {
        await (supabase as any)
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            ...preferencesData,
            updated_at: new Date().toISOString()
          }, {
            onConflict: 'user_id'
          })
      } catch (prefsError) {
        console.warn('Preferences save failed (optional):', prefsError)
        // Continue without preferences - main profile is saved
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' })

      // Refresh data
      setTimeout(() => {
        checkAuthAndLoadProfile()
      }, 1000)

    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const availableInterests = [
    'art', 'design', 'photography', 'music', 'travel', 'food', 'fitness',
    'technology', 'startups', 'business', 'entrepreneurship', 'marketing',
    'writing', 'reading', 'gaming', 'movies', 'sports', 'cooking',
    'fashion', 'beauty', 'education', 'health', 'wellness', 'nature',
    'pets', 'cars', 'architecture', 'culture', 'history', 'science'
  ]

  const router = useRouter()

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

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-text-primary">Social Profile</h1>
            <p className="text-text-secondary">Manage your InstaLinkr profile and preferences</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => window.open(`/social/profile/preview/${profile?.username || user?.id}`, '_blank')}
              variant="outline"
              disabled={!profile && !user}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview Profile
            </Button>
            <Button onClick={() => setShowSettings(!showSettings)} variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              {showSettings ? 'Hide' : 'Show'} Settings
            </Button>
          </div>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
            'bg-red-50 text-red-700 border border-red-200'
            }`}>
            {message.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture and Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Camera className="h-5 w-5" />
                  <span>Profile Photo</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden bg-gray-200 relative group cursor-pointer" onClick={triggerFileUpload}>
                  {/* Profile image with enhanced error handling */}
                  <img
                    src={profile?.profile_pic_url && profile.profile_pic_url.trim() !== ''
                      ? `${profile.profile_pic_url}?t=${Date.now()}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || user?.email?.split('@')[0] || 'User')}&background=6366f1&color=fff&size=128&format=png`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // If image fails to load, use ui-avatars as fallback
                      const target = e.target as HTMLImageElement;
                      target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || user?.email?.split('@')[0] || 'User')}&background=6366f1&color=fff&size=128&format=png`;
                    }}
                  />
                  {uploadingPhoto && (
                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center rounded-full transition-all duration-200">
                    <Camera className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Button
                  onClick={triggerFileUpload}
                  disabled={uploadingPhoto}
                  className="w-full mt-3 bg-primary-500 hover:bg-primary-600 text-white border-0 shadow-lg"
                  size="default"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {uploadingPhoto ? 'Uploading...' : (profile?.profile_pic_url ? 'Change Photo' : 'Upload Photo')}
                </Button>
              </CardContent>
            </Card>

            {/* Account Status */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Account Status</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Subscription</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${profile?.subscription_status === 'premium'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                      }`}>
                      {profile?.subscription_status === 'premium' ? (
                        <><Crown className="h-3 w-3 inline mr-1" /> Premium</>
                      ) : (
                        'Free'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-secondary">Verification</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${profile?.verification_status === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                      }`}>
                      {profile?.verification_status || 'Pending'}
                    </span>
                  </div>
                  {profile?.subscription_status === 'free' && (
                    <Button size="sm" className="w-full mt-3" asChild>
                      <a href="/social/upgrade">Upgrade to Premium</a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
                <CardDescription>
                  This information will be visible to other users
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Username *
                    </label>
                    <Input
                      value={formData.username}
                      onChange={(e) => handleInputChange('username', e.target.value)}
                      placeholder="your_username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Full Name *
                    </label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      placeholder="Your full name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                  />
                  <p className="text-xs text-text-secondary mt-1">
                    {formData.bio.length}/500 characters
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      Location
                    </label>
                    <Input
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      placeholder="City, Country"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Gender
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-binary</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Matching Preferences */}
            {showSettings && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Heart className="h-5 w-5" />
                    <span>Matching Preferences</span>
                  </CardTitle>
                  <CardDescription>
                    Customize who you see and who can see you
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Min Age
                      </label>
                      <Input
                        type="number"
                        min="18"
                        max="100"
                        value={preferencesData.min_age}
                        onChange={(e) => handlePreferenceChange('min_age', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Max Age
                      </label>
                      <Input
                        type="number"
                        min="18"
                        max="100"
                        value={preferencesData.max_age}
                        onChange={(e) => handlePreferenceChange('max_age', parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Max Distance (km)
                      </label>
                      <Input
                        type="number"
                        min="1"
                        max="500"
                        value={preferencesData.max_distance}
                        onChange={(e) => handlePreferenceChange('max_distance', parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Show me
                      </label>
                      <select
                        value={preferencesData.gender_preference}
                        onChange={(e) => handlePreferenceChange('gender_preference', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="all">Everyone</option>
                        <option value="male">Men</option>
                        <option value="female">Women</option>
                        <option value="non-binary">Non-binary</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        I'm looking for
                      </label>
                      <select
                        value={preferencesData.looking_for}
                        onChange={(e) => handlePreferenceChange('looking_for', e.target.value)}
                        className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="friends">Friends</option>
                        <option value="networking">Networking</option>
                        <option value="dating">Dating</option>
                        <option value="collaboration">Collaboration</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Interests
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {availableInterests.map((interest) => (
                        <button
                          key={interest}
                          onClick={() => handleInterestToggle(interest)}
                          className={`px-3 py-1 rounded-full text-sm border transition-colors ${preferencesData.interests.includes(interest)
                            ? 'bg-purple-500 text-white border-purple-500'
                            : 'bg-white text-text-secondary border-border hover:border-purple-300'
                            }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}




            {/* Instagram Posts Management */}
            <InstagramManager user={user} />

            {/* Instagram Posts Display - Removed as it is already in InstagramManager */}

            {/* Save Button */}
            <div className="flex justify-end space-x-4">
              <Button variant="outline" asChild>
                <a href="/social">Cancel</a>
              </Button>
              <Button onClick={handleSave} disabled={saving}>
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
