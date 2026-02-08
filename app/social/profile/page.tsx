"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import InstagramManager from "@/components/InstagramManager"
import {
  User,
  Instagram,
  MapPin,
  Camera,
  Settings,
  Heart,
  Shield,
  Crown,
  Save,
  Eye,
  Sparkles,
  ArrowLeft,
  Rocket,
  Globe,
  Zap,
  Target
} from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { motion, AnimatePresence } from "framer-motion"
import { PageWrapper } from "@/components/PageWrapper"

export default function SocialProfilePage() {
  const { user, profile: authProfile, refreshProfile, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [preferences, setPreferences] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [showSettings, setShowSettings] = useState(false)
  const [uploadingPhoto, setUploadingPhoto] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

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

  useEffect(() => {
    if (user) {
      loadProfile()
    }
  }, [user])

  const loadProfile = async () => {
    if (!user) return
    try {
      const supabase = createClient()
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle()

      if (profile) {
        const profileData = profile as any

        // Ensure profile pic public URL is resolved
        if (profileData.profile_pic_url && !profileData.profile_pic_url.startsWith('http')) {
          const { data: publicUrlData } = supabase.storage
            .from('avatars')
            .getPublicUrl(profileData.profile_pic_url)
          profileData.profile_pic_url = publicUrlData.publicUrl
        }

        setProfile(profileData)
        setFormData({
          username: profileData.username || '',
          full_name: profileData.full_name || '',
          bio: profileData.bio || '',
          location: profileData.location || '',
          gender: profileData.gender || '',
          date_of_birth: profileData.date_of_birth || '',
        })
      }

      const { data: userPrefs } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle()

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
      }
    } catch (error) {
      console.error('Error loading profile:', error)
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
    if (!user) return
    setSaving(true)
    setMessage({ type: '', text: '' })

    try {
      const supabase = createClient()
      const { error: profileError } = await (supabase as any)
        .from('users')
        .upsert({
          id: user.id,
          username: formData.username || user.user_metadata?.username || user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`,
          full_name: formData.full_name,
          bio: formData.bio,
          location: formData.location,
          gender: formData.gender,
          date_of_birth: formData.date_of_birth,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })

      if (profileError) throw profileError

      await (supabase as any)
        .from('user_preferences')
        .upsert({
          user_id: user.id,
          ...preferencesData,
          updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })

      setMessage({ type: 'success', text: 'Profile updated successfully.' })
      if (refreshProfile) refreshProfile()
      setTimeout(() => setMessage({ type: '', text: '' }), 5000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile.' })
    } finally {
      setSaving(false)
    }
  }

  const uploadProfilePhoto = async (file: File) => {
    try {
      setUploadingPhoto(true)
      const supabase = createClient()
      if (!user) return

      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/profile-photo.${fileExt}`
      const filePath = fileName // Removed redundant 'avatars/' prefix to avoid avatars/avatars/ doubling

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Add timestamp to bust cache
      const uniqueUrl = `${publicUrl}?t=${Date.now()}`

      const { error: updateError } = await (supabase as any)
        .from('users')
        .upsert({
          id: user.id,
          username: formData.username || user.user_metadata?.username || user.email?.split('@')[0] || `user_${user.id.substring(0, 8)}`,
          profile_pic_url: uniqueUrl,
          updated_at: new Date().toISOString()
        }, { onConflict: 'id' })

      if (updateError) throw updateError

      await loadProfile()
      if (refreshProfile) refreshProfile()
      setMessage({ type: 'success', text: 'Profile photo updated.' })
    } catch (error: any) {
      console.error('Upload error:', error)
      setMessage({ type: 'error', text: `Photo upload failed: ${error.message || 'Please try again.'}` })
    } finally {
      setUploadingPhoto(false)
    }
  }

  const availableInterests = [
    'ART', 'DESIGN', 'PHOTO', 'MUSIC', 'TRAVEL', 'FOOD', 'TECH',
    'STARTUPS', 'BIZ', 'WRITING', 'GAMING', 'MOVIES', 'SPORTS',
    'FASHION', 'BEAUTY', 'EDUCATION', 'HLTH', 'NATURE', 'PETS'
  ]

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full mx-auto mb-6"
          />
          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <PageWrapper className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30 overflow-x-hidden font-sans py-16 px-6 relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] bg-teal-600/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px]"
        />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10 px-4 md:px-0">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
          <div className="space-y-4">
            <motion.div whileHover={{ x: -2 }} className="w-fit">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/social')}
                className="bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </motion.div>
            <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Edit Profile</h1>
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] italic">Update your personal info and account settings.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => window.open(`/social/profile/preview/${profile?.username || user?.id}`, '_blank')}
              variant="ghost"
              className="h-14 px-8 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl"
            >
              <Eye className="h-4 w-4 mr-3 text-emerald-400" />
              Preview Profile
            </Button>
            <Button
              onClick={() => setShowSettings(!showSettings)}
              variant="ghost"
              className={`h-14 px-8 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl border transition-all ${showSettings ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'}`}
            >
              <Settings className={`h-4 w-4 mr-3 ${showSettings ? 'animate-spin' : ''}`} />
              {showSettings ? 'Close Settings' : 'Preferences'}
            </Button>
          </div>
        </div>

        {/* Feedback Message */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-6 rounded-3xl mb-12 flex items-center gap-4 border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'} shadow-3xl backdrop-blur-xl`}
            >
              <Zap className="h-5 w-5" />
              <span className="font-black uppercase tracking-widest text-xs italic">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Sidebar: Photo & Stats */}
          <div className="space-y-8">
            <Card className="bg-[#0d1321]/40 border-white/5 backdrop-blur-3xl rounded-3xl md:rounded-[3rem] p-6 sm:p-10 shadow-3xl overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="text-center p-0 mb-10">
                <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-10">Profile Picture</CardTitle>
                <div className="relative inline-block">
                  <div className="w-48 h-48 mx-auto rounded-[3rem] overflow-hidden bg-white/5 p-4 border border-white/10 group-hover:border-emerald-500/40 transition-all shadow-3xl relative">
                    <img
                      src={profile?.profile_pic_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || 'User')}&background=050810&color=10b981&size=256&format=png`}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-[2rem] transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || 'User')}&background=050810&color=10b981&size=256&format=png`;
                      }}
                    />
                    {uploadingPhoto && (
                      <div className="absolute inset-0 bg-[#050810]/80 flex items-center justify-center rounded-[2.5rem]">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-emerald-500 border-t-transparent shadow-3xl"></div>
                      </div>
                    )}
                    <div
                      className="absolute inset-0 bg-emerald-600/20 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-all rounded-[2.5rem]"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-10 w-10 text-white drop-shadow-3xl" />
                    </div>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && uploadProfilePhoto(e.target.files[0])}
                    className="hidden"
                  />
                </div>
                <div className="mt-10">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="w-full h-14 bg-white/5 hover:bg-emerald-600 text-white border border-white/5 hover:border-emerald-500 rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-3xl transition-all"
                  >
                    <Camera className="h-4 w-4 mr-3" />
                    {uploadingPhoto ? 'Uploading...' : 'Change Profile Photo'}
                  </Button>
                </div>
              </CardHeader>
            </Card>

            <Card className="bg-[#0d1321]/40 border-white/5 backdrop-blur-3xl rounded-3xl md:rounded-[3rem] p-6 sm:p-10 shadow-3xl">
              <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-10 text-center">Account Info</CardTitle>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Account Type</span>
                  <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${profile?.subscription_status === 'premium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-3xl' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'}`}>
                    {profile?.subscription_status === 'premium' ? <><Crown className="h-3 w-3" /> Verified Elite</> : 'Standard'}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-emerald-500/30 transition-all">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</span>
                  <span className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full ${profile?.verification_status === 'verified' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-3xl' : 'bg-yellow-500/10 text-yellow-500/80 border border-yellow-500/20'}`}>
                    <Zap className="h-3 w-3" /> {profile?.verification_status?.toUpperCase() || 'OFFLINE'}
                  </span>
                </div>
                {profile?.subscription_status === 'free' && (
                  <Button className="w-full h-14 bg-gradient-to-br from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white rounded-2xl font-black uppercase tracking-widest text-[9px] shadow-3xl shadow-emerald-500/20 mt-6" asChild>
                    <a href="/social/upgrade">Upgrade to Elite <ArrowLeft className="h-3 w-3 ml-2 rotate-180" /></a>
                  </Button>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content: Info & Preferences */}
          <div className="lg:col-span-2 space-y-12">
            {/* Basic Information */}
            <Card className="bg-[#0d1321]/40 border-white/5 backdrop-blur-3xl rounded-3xl md:rounded-[4rem] p-6 sm:p-12 shadow-3xl">
              <CardHeader className="p-0 mb-12">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                    <User className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">Public Profile</CardTitle>
                    <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">This information will be visible to everyone.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 italic">Username *</label>
                    <div className="relative group">
                      <Globe className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                      <Input
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-emerald-500/50 text-white rounded-2xl pl-14 h-14 font-bold uppercase italic tracking-wide"
                        placeholder="username"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 italic">Name *</label>
                    <Input
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-emerald-500/50 text-white rounded-2xl px-6 h-14 font-bold uppercase italic tracking-wide"
                      placeholder="Your Name"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 italic">Bio</label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-white/5 border border-white/10 focus:bg-white/10 focus:border-emerald-500/50 text-white rounded-[2rem] px-8 py-6 font-bold italic tracking-wide h-40 focus:outline-none transition-all resize-none"
                    maxLength={500}
                  />
                  <div className="flex justify-end pr-4">
                    <span className="text-[9px] font-black text-slate-700 tracking-widest uppercase">{formData.bio.length}/500 Characters</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 italic">Location</label>
                    <div className="relative group">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-700 group-focus-within:text-emerald-500 transition-colors" />
                      <Input
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-emerald-500/50 text-white rounded-2xl pl-14 h-14 font-bold uppercase italic tracking-wide"
                        placeholder="Your Location"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 italic">Birthday</label>
                    <Input
                      type="date"
                      value={formData.date_of_birth}
                      onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                      className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-emerald-500/50 text-white rounded-2xl px-6 h-14 font-bold uppercase italic tracking-wide"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Matching Preferences - Glassmorphic Animated Reveal */}
            <AnimatePresence>
              {showSettings && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <Card className="bg-[#0b121e]/80 border-emerald-500/20 backdrop-blur-3xl rounded-3xl md:rounded-[4rem] p-6 sm:p-12 shadow-[0_0_50px_rgba(16,185,129,0.1)]">
                    <CardHeader className="p-0 mb-12">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-teal-500/10 rounded-2xl border border-teal-500/20">
                          <Heart className="h-6 w-6 text-teal-400" />
                        </div>
                        <div>
                          <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter">Matching Filters</CardTitle>
                          <CardDescription className="text-slate-500 font-bold uppercase tracking-widest text-[9px]">Customize who you'd like to discover and connect with.</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <div className="space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Minimum Age</label>
                          <Input
                            type="number"
                            value={preferencesData.min_age}
                            onChange={(e) => handlePreferenceChange('min_age', parseInt(e.target.value))}
                            className="bg-white/5 border-white/10 focus:border-emerald-500/50 text-white rounded-2xl h-14 font-black text-center"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Maximum Age</label>
                          <Input
                            type="number"
                            value={preferencesData.max_age}
                            onChange={(e) => handlePreferenceChange('max_age', parseInt(e.target.value))}
                            className="bg-white/5 border-white/10 focus:border-emerald-500/50 text-white rounded-2xl h-14 font-black text-center"
                          />
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Distance Limit (KM)</label>
                          <Input
                            type="number"
                            value={preferencesData.max_distance}
                            onChange={(e) => handlePreferenceChange('max_distance', parseInt(e.target.value))}
                            className="bg-white/5 border-white/10 focus:border-emerald-500/50 text-white rounded-2xl h-14 font-black text-center"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Interested In</label>
                          <select
                            value={preferencesData.gender_preference}
                            onChange={(e) => handlePreferenceChange('gender_preference', e.target.value)}
                            className="w-full h-14 bg-white/5 border border-white/10 focus:border-emerald-500/50 text-white rounded-2xl px-6 font-black uppercase text-xs focus:outline-none appearance-none cursor-pointer"
                          >
                            <option value="all" className="bg-[#0d1321]">Everyone (All)</option>
                            <option value="male" className="bg-[#0d1321]">Men</option>
                            <option value="female" className="bg-[#0d1321]">Women</option>
                            <option value="non-binary" className="bg-[#0d1321]">Non-Binary</option>
                          </select>
                        </div>
                        <div className="space-y-4">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2">Looking For</label>
                          <select
                            value={preferencesData.looking_for}
                            onChange={(e) => handlePreferenceChange('looking_for', e.target.value)}
                            className="w-full h-14 bg-white/5 border border-white/10 focus:border-emerald-500/50 text-white rounded-2xl px-6 font-black uppercase text-xs focus:outline-none appearance-none cursor-pointer"
                          >
                            <option value="friends" className="bg-[#0d1321]">Friends</option>
                            <option value="networking" className="bg-[#0d1321]">Networking</option>
                            <option value="dating" className="bg-[#0d1321]">Dating</option>
                            <option value="collaboration" className="bg-[#0d1321]">Collaboration</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 italic flex items-center gap-3">
                          <Sparkles size={12} className="text-emerald-500" /> Interests & Tags
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {availableInterests.map((interest) => (
                            <motion.button
                              key={interest}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleInterestToggle(interest)}
                              className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-xl ${preferencesData.interests.includes(interest)
                                ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-500/20 italic'
                                : 'bg-white/5 border-white/10 text-slate-500 hover:text-white hover:border-white/20'
                                }`}
                            >
                              {interest}
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Instagram Feed Management */}
            <div className="relative group/insta p-1 rounded-[4rem] bg-gradient-to-br from-white/10 to-transparent">
              <div className="bg-[#050810] rounded-[3.9rem] p-1 shadow-3xl overflow-hidden relative">
                <InstagramManager user={user} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-6 pt-12">
              <motion.div whileHover={{ x: -5 }} className="w-full sm:w-auto">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full sm:w-auto h-16 px-12 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-500 hover:text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px]"
                >
                  <Link href="/social">Cancel</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto h-16 px-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-3xl shadow-emerald-500/30 border-none"
                >
                  {saving ? (
                    <div className="flex items-center gap-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent shadow-3xl"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <Save className="h-5 w-5" />
                      Save Profile
                    </div>
                  )}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
                input[type="date"]::-webkit-calendar-picker-indicator {
                    filter: invert(1);
                    opacity: 0.5;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
            `}</style>
    </PageWrapper>
  )
}
