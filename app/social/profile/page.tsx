"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  User,
  MapPin,
  Camera,
  Crown,
  Save,
  ArrowLeft,
  AtSign,
  FileText,
  Calendar,
  Lightbulb,
  Layers,
  Activity,
  CheckCircle2,
  AlertCircle
} from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { motion, AnimatePresence } from "framer-motion"
import { PageWrapper } from "@/components/PageWrapper"
import { EliteUpgradeDialog } from "@/components/EliteUpgradeDialog"

export default function SocialProfilePage() {
  const { user, profile: authProfile, refreshProfile, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<any>(null)
  const [preferences, setPreferences] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })
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

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-400 rounded-full mx-auto mb-6"
          />
          <p className="text-blue-300 text-sm font-medium">Loading profile...</p>
        </div>
      </div>
    )
  }

  const isPremium = profile?.subscription_status === 'premium'

  return (
    <PageWrapper className="min-h-screen bg-[#050810] text-slate-200 selection:bg-blue-500/30 overflow-x-hidden font-sans py-16 px-6 relative">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.22, 0.15] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-32 -right-32 w-[550px] h-[550px] bg-gradient-to-br from-teal-400/30 via-blue-500/20 to-purple-600/10 rounded-full blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1.15, 1, 1.15], opacity: [0.1, 0.18, 0.1] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -bottom-32 -left-32 w-[550px] h-[550px] bg-gradient-to-tr from-purple-600/25 via-blue-600/15 to-transparent rounded-full blur-[130px]"
        />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10 px-4 md:px-0">
        {/* Decorative handwritten accent */}
        <div className="hidden lg:block absolute -top-2 right-0 text-right pointer-events-none select-none">
          <span className="italic font-serif text-slate-500/60 text-lg leading-tight">Make it<br />you</span>
          <svg width="70" height="14" viewBox="0 0 70 14" className="ml-auto mt-1 text-emerald-400/50" fill="none">
            <path d="M2 8C15 2 30 12 45 6C52 3 60 5 68 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>

        {/* Header */}
        <div className="mb-16">
          <div className="space-y-4">
            <motion.div whileHover={{ x: -2 }} className="w-fit">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/social')}
                className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-full border border-white/10 px-5 mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Back
              </Button>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Edit <span className="bg-gradient-to-r from-teal-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">Profile</span>
            </h1>
            <p className="text-slate-400 text-sm md:text-base">Update your personal info and account settings.</p>
          </div>
        </div>

        {/* Feedback Message */}
        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-5 rounded-2xl mb-12 flex items-center gap-3 border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-rose-500/10 border-rose-500/20 text-rose-300'} shadow-xl backdrop-blur-xl`}
            >
              {message.type === 'success' ? <CheckCircle2 className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
              <span className="text-sm font-medium">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sidebar: Photo & Stats */}
          <div className="space-y-6">
            <Card className="relative overflow-hidden bg-gradient-to-br from-[#131b2e] to-[#0c1120] border border-white/10 rounded-[2rem] p-8 shadow-2xl">
              <div className="absolute -top-10 -right-10 w-56 h-56 bg-gradient-to-br from-teal-400/30 via-blue-500/20 to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-40 h-40 rounded-full p-[3px] bg-gradient-to-tr from-teal-400 via-blue-500 to-purple-500 shadow-xl">
                    <div className="w-full h-full rounded-full bg-[#0a0e1f] flex items-center justify-center overflow-hidden relative">
                      <img
                        src={profile?.profile_pic_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || 'User')}&background=0a0e1f&color=2dd4bf&size=256&format=png`}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.full_name || 'User')}&background=0a0e1f&color=2dd4bf&size=256&format=png`;
                        }}
                      />
                      {uploadingPhoto && (
                        <div className="absolute inset-0 bg-[#0a0e1f]/80 flex items-center justify-center rounded-full">
                          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-400 border-t-transparent"></div>
                        </div>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center hover:bg-white/20 transition-all"
                  >
                    <Camera className="h-4 w-4 text-white" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && uploadProfilePhoto(e.target.files[0])}
                    className="hidden"
                  />
                </div>
                <h3 className="mt-6 text-lg font-bold text-white">Your Profile Picture</h3>
                <p className="text-sm text-slate-400 mt-1">A picture helps others recognize you.</p>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  className="mt-6 w-full h-12 rounded-full bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 hover:opacity-90 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 border-none transition-opacity"
                >
                  <Camera className="h-4 w-4 mr-2" />
                  {uploadingPhoto ? 'Uploading...' : 'Change Photo'}
                </Button>
              </div>
            </Card>

            <Card className="bg-[#0d1424]/70 border border-white/10 rounded-[2rem] p-6 shadow-xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Account Info</h3>
                  <p className="text-xs text-slate-400">Manage your account settings.</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="flex items-center gap-2 text-sm text-slate-300"><Layers className="h-4 w-4 text-slate-500" /> Account Type</span>
                  <span className={`flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full ${isPremium ? 'bg-yellow-500 text-black' : 'bg-blue-600 text-white'}`}>
                    {isPremium && <Crown className="h-3 w-3" />}
                    {isPremium ? 'Elite' : 'Standard'}
                  </span>
                </div>
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl border border-white/5">
                  <span className="flex items-center gap-2 text-sm text-slate-300"><Activity className="h-4 w-4 text-slate-500" /> Status</span>
                  <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500 text-white">
                    <span className="w-1.5 h-1.5 rounded-full bg-white/90" />
                    Online
                  </span>
                </div>
                {profile?.subscription_status === 'free' && (
                  <EliteUpgradeDialog
                    defaultName={formData.full_name}
                    defaultEmail={user?.email || ''}
                    username={formData.username}
                    buttonClassName="w-full h-12 rounded-full bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 hover:opacity-90 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 border-none mt-4 transition-opacity"
                  />
                )}
              </div>
            </Card>

            <div className="px-2 pt-2">
              <p className="italic text-slate-500 text-sm leading-relaxed">&ldquo;A better you builds a brighter tomorrow.&rdquo;</p>
              <div className="w-10 h-0.5 bg-gradient-to-r from-teal-400 to-transparent mt-3 rounded-full" />
            </div>
          </div>

          {/* Main Content: Info & Preferences */}
          <div className="lg:col-span-2 space-y-8">
            {/* Basic Information */}
            <Card className="bg-[#0d1424]/70 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-10 shadow-xl">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">Public Profile</h2>
                  <p className="text-sm text-slate-400">This information will be visible to everyone.</p>
                </div>
              </div>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 px-1">Username *</label>
                    <div className="relative">
                      <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                        className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-blue-500/50 text-white rounded-xl pl-11 h-12"
                        placeholder="username"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 px-1">Name *</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        value={formData.full_name}
                        onChange={(e) => handleInputChange('full_name', e.target.value)}
                        className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-blue-500/50 text-white rounded-xl pl-11 h-12"
                        placeholder="Your Name"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 px-1">Bio</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-4 h-4 w-4 text-slate-500" />
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell us about yourself..."
                      className="w-full bg-white/5 border border-white/10 focus:bg-white/10 focus:border-blue-500/50 text-white rounded-2xl pl-11 pr-5 py-4 h-32 focus:outline-none transition-all resize-none text-sm"
                      maxLength={500}
                    />
                  </div>
                  <div className="flex justify-end pr-1">
                    <span className="text-xs text-slate-500">{formData.bio.length}/500 characters</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 px-1">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-blue-500/50 text-white rounded-xl pl-11 h-12"
                        placeholder="Your Location"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300 px-1">Birthday</label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                      <Input
                        type="date"
                        value={formData.date_of_birth}
                        onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                        className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-blue-500/50 text-white rounded-xl pl-11 h-12"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-5 py-4">
                  <Lightbulb className="h-5 w-5 text-amber-300 flex-shrink-0" />
                  <p className="text-sm text-slate-400">A complete profile helps you connect with the right people and get the best experience.</p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-4">
              <motion.div whileHover={{ x: -5 }} className="w-full sm:w-auto">
                <Button
                  variant="ghost"
                  asChild
                  className="w-full sm:w-auto h-12 px-10 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white rounded-full font-semibold text-sm"
                >
                  <Link href="/social">Cancel</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full sm:w-auto h-12 px-10 bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 hover:opacity-90 text-white rounded-full font-semibold text-sm shadow-lg shadow-blue-500/20 border-none transition-opacity"
                >
                  {saving ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Saving...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
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
