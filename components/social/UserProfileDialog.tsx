"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"

import {
    User,
    MapPin,
    Calendar,
    Instagram,
    Facebook,
    Heart,
    Crown,
    CheckCircle2,
    Check,
    UserPlus,
    X,
    MessageCircle,
    Shield,
    Flag,
    AlertTriangle,
    Sparkles,
    Zap,
    ShieldCheck,
    MoreHorizontal,
    Globe,
    Target
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { AdUnit } from "@/components/AdUnit"
import InstagramPosts from "@/components/InstagramPosts"
import { motion, AnimatePresence } from "framer-motion"

interface UserProfileDialogProps {
    userId: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

import { useAuth } from "@/components/providers/AuthProvider"

export function UserProfileDialog({ userId, open, onOpenChange }: UserProfileDialogProps) {
    const { user: currentUser } = useAuth()
    const [profile, setProfile] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [requestSent, setRequestSent] = useState(false)
    const [sendingRequest, setSendingRequest] = useState(false)

    const [isFriend, setIsFriend] = useState(false)
    const [isLiked, setIsLiked] = useState(false)

    // Safety Features State
    const [isBlocked, setIsBlocked] = useState(false)
    const [showReportView, setShowReportView] = useState(false)
    const [reportReason, setReportReason] = useState('inappropriate_behavior')
    const [reportDetails, setReportDetails] = useState('')
    const [isSubmittingReport, setIsSubmittingReport] = useState(false)

    const { toast } = useToast()
    const router = useRouter()

    useEffect(() => {
        if (open && userId) {
            loadProfile()
        } else {
            setProfile(null)
            setLoading(true)
            setError('')
            setIsFriend(false)
            setIsLiked(false)
            setIsBlocked(false)
            setShowReportView(false)
            setReportReason('inappropriate_behavior')
            setReportDetails('')
        }
    }, [open, userId])

    const loadProfile = async () => {
        if (!userId) return
        try {
            setLoading(true)
            const supabase = createClient()
            const { data: profileData, error: profileError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .maybeSingle()

            if (profileError) throw profileError
            if (!profileData) {
                setError('Profile not found')
                return
            }
            setProfile(profileData)

            if (currentUser && profileData) {
                const { data: match } = await supabase
                    .from('matches')
                    .select('*')
                    .or(`and(user1_id.eq.${currentUser.id},user2_id.eq.${profileData.id}),and(user1_id.eq.${profileData.id},user2_id.eq.${currentUser.id})`)
                    .maybeSingle()

                if (match) {
                    setIsFriend(true)
                } else {
                    const { data: swipe } = await supabase
                        .from('swipes')
                        .select('*')
                        .eq('swiper_id', currentUser.id)
                        .eq('target_user_id', profileData.id)
                        .eq('direction', 'like')
                        .maybeSingle()

                    if (swipe) setRequestSent(true)
                }

                const { data: like } = await supabase
                    .from('swipes')
                    .select('*')
                    .eq('swiper_id', currentUser.id)
                    .eq('target_user_id', profileData.id)
                    .eq('direction', 'like')
                    .maybeSingle()

                if (like) setIsLiked(true)

                const { data: block } = await supabase
                    .from('blocked_users')
                    .select('*')
                    .eq('blocker_id', currentUser.id)
                    .eq('blocked_id', profileData.id)
                    .maybeSingle()

                if (block) setIsBlocked(true)
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
            const { error } = await supabase.from('swipes').insert({
                swiper_id: currentUser.id,
                target_user_id: profile.id,
                direction: 'like'
            } as any)
            if (error) throw error
            setIsLiked(true)
            setRequestSent(true)
            toast({ title: "Profile Liked!", description: `Profile marked as high interest.`, duration: 3000 })
        } catch (error) {
            console.error('Error liking profile:', error)
            toast({ title: "Error", description: "Failed to initiate sync.", variant: "destructive" })
        }
    }

    const handleSendMessage = () => {
        if (isFriend) router.push('/social/matches')
    }

    const handleAddFriend = async () => {
        if (!currentUser || !profile || requestSent || sendingRequest) return
        setSendingRequest(true)
        try {
            const supabase = createClient()
            const { error } = await supabase.from('swipes').insert({
                swiper_id: currentUser.id,
                target_user_id: profile.id,
                direction: 'like'
            } as any)

            if (error) throw error

            const { data: oppositeSwipe } = await supabase
                .from('swipes')
                .select('*')
                .eq('swiper_id', profile.id)
                .eq('target_user_id', currentUser.id)
                .eq('direction', 'like')
                .single()

            if (oppositeSwipe) {
                await supabase.from('matches').insert({
                    user1_id: currentUser.id,
                    user2_id: profile.id
                } as any)
                setIsFriend(true)
                toast({ title: "Datalink Established!", description: "Target node is now matched. Channel open." })
            }
            setRequestSent(true)
            setIsLiked(true)
        } catch (error) {
            console.error('Error sending friend request:', error)
        } finally {
            setSendingRequest(false)
        }
    }

    const handleBlockUser = async () => {
        if (!currentUser || !profile) return
        if (!confirm("Terminate ALL sync and block this node? Action is irreversible via standard protocols.")) return
        try {
            const supabase = createClient()
            const { error } = await supabase.from('blocked_users').insert({
                blocker_id: currentUser.id,
                blocked_id: profile.id
            } as any)
            if (error) throw error
            setIsBlocked(true)
            toast({ title: "Node Terminated", description: "All communication syncs have been severed." })
            onOpenChange(false)
        } catch (error) {
            console.error('Error blocking user:', error)
        }
    }

    const handleReportUser = async () => {
        if (!currentUser || !profile) return
        setIsSubmittingReport(true)
        try {
            const response = await fetch('/api/social/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetUserId: profile.id,
                    reason: reportReason,
                    details: reportDetails
                })
            })
            if (!response.ok) throw new Error('Failed to report')
            toast({ title: "Incident Logged", description: "Protocol breach reported to central authority." })
            setShowReportView(false)
        } catch (error) {
            console.error('Error reporting user:', error)
        } finally {
            setIsSubmittingReport(false)
        }
    }

    if (!open) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#050810] p-0 border-white/5 rounded-[3.5rem] shadow-[0_32px_120px_rgba(0,0,0,0.8)] overflow-hidden">
                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center p-32 space-y-6">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full"
                            />
                            <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Downloading Dossier...</p>
                        </div>
                    ) : error ? (
                        <div className="p-20 text-center space-y-4">
                            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                                <AlertTriangle className="text-red-500" size={40} />
                            </div>
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Protocol Error</h3>
                            <p className="text-slate-500 text-sm font-medium">{error}</p>
                        </div>
                    ) : profile ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative pb-32 flex flex-col"
                        >
                            {/* High-End Social Header/Ad Area */}
                            <div className="relative h-64 w-full bg-[#0d1321] overflow-hidden flex items-center justify-center border-b border-white/5">
                                <div className="absolute inset-0 pointer-events-none">
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
                                        transition={{ duration: 10, repeat: Infinity }}
                                        className="absolute top-[-50%] left-[-20%] w-[150%] h-[150%] bg-emerald-600/10 rounded-full blur-[100px]"
                                    />
                                </div>
                                <AdUnit format="horizontal" className="z-10" />

                                <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-20">
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        className="w-40 h-40 rounded-[2.5rem] border-8 border-[#050810] overflow-hidden shadow-2xl bg-[#0d1321] relative group"
                                    >
                                        <img
                                            src={profile.profile_pic_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || profile.username)}&background=10b981&color=fff&size=200`}
                                            alt={profile.full_name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                            onContextMenu={(e) => e.preventDefault()}
                                            draggable={false}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                                    </motion.div>
                                </div>
                            </div>

                            <div className="px-10 pt-24">
                                {/* Profile Identities */}
                                <div className="text-center mb-12">
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">{profile.full_name}</h2>
                                        {profile.verification_status === 'verified' && (
                                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                                <ShieldCheck className="w-4 h-4 text-white" />
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-slate-500 text-sm font-black uppercase tracking-[0.2em] mb-6">@{profile.username}</p>

                                    <div className="flex items-center justify-center gap-3">
                                        {profile.subscription_status === 'premium' && (
                                            <span className="bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2 shadow-2xl">
                                                <Crown className="w-3.5 h-3.5 fill-emerald-400" /> ELITE LEVEL
                                            </span>
                                        )}
                                        <span className="bg-white/5 border border-white/10 text-slate-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                            <Target className="w-3.5 h-3.5" /> SYNC ID: {profile.id.slice(0, 8)}
                                        </span>
                                    </div>
                                </div>

                                {/* Info Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    {/* Bio Module */}
                                    <div className="md:col-span-1 space-y-8">
                                        <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                                            <CardHeader className="p-8 pb-4">
                                                <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Sparkles size={12} className="text-emerald-500" /> Internal Dossier
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8 pt-0">
                                                <p className="text-slate-300 text-sm leading-relaxed font-medium italic">
                                                    "{profile.bio || 'IDENTIFICATION PENDING. SIGNAL STRENGTH NOMINAL.'}"
                                                </p>
                                            </CardContent>
                                        </Card>

                                        <Card className="bg-white/5 border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
                                            <CardHeader className="p-8 pb-4">
                                                <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                                    <Globe size={12} className="text-emerald-500" /> Geo Location
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="p-8 pt-0 space-y-4">
                                                {profile.location ? (
                                                    <div className="flex items-center gap-3 text-white font-bold text-sm tracking-tight italic">
                                                        <MapPin className="h-5 w-5 text-emerald-500" />
                                                        {profile.location}
                                                    </div>
                                                ) : (
                                                    <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">COORDINATES CLASSIFIED</p>
                                                )}

                                                <div
                                                    className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 cursor-pointer hover:bg-white/10 transition-all"
                                                    onClick={handleAddFriend}
                                                >
                                                    <div className="h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                                                        {requestSent ? <Check size={16} className="stroke-[3px]" /> : <UserPlus size={16} />}
                                                    </div>
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                                                        {requestSent ? 'Sync Requested' : 'Initiate Sync'}
                                                    </span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Media Module */}
                                    <div className="md:col-span-2">
                                        <Card className="bg-[#0b121e] border-white/10 rounded-[2.5rem] overflow-hidden backdrop-blur-3xl shadow-[0_32px_120px_rgba(0,0,0,0.5)] h-full min-h-[400px]">
                                            <CardHeader className="p-10 pb-6 border-b border-white/5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Instagram className="w-6 h-6 text-emerald-500" />
                                                        <CardTitle className="text-xl font-black text-white italic uppercase tracking-tighter">Metadata Stream</CardTitle>
                                                    </div>
                                                    <Button size="icon" variant="ghost" className="text-slate-500 hover:text-white rounded-xl">
                                                        <MoreHorizontal />
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-6">
                                                <InstagramPosts userId={profile.id} showHeader={false} displayMode="horizontal" autoScroll={false} />
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>

                                {/* Safety & Governance */}
                                <div className="mt-12 space-y-8">
                                    <div className="flex items-center gap-4">
                                        <Shield size={16} className="text-emerald-500" />
                                        <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Governance & Privacy Protocols</h3>
                                        <div className="h-[1px] flex-1 bg-white/5" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Button
                                            variant="outline"
                                            className="h-16 rounded-2xl bg-white/5 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 font-black uppercase tracking-widest text-[10px] transition-all"
                                            onClick={handleBlockUser}
                                            disabled={isBlocked}
                                        >
                                            <AlertTriangle className="w-4 h-4 mr-3" />
                                            {isBlocked ? 'ACCESS SEVERED' : 'TERMINATE SYNC'}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            className="h-16 rounded-2xl bg-white/5 border-white/10 text-slate-500 hover:bg-white/10 hover:text-white font-black uppercase tracking-widest text-[10px] transition-all"
                                            onClick={() => setShowReportView(true)}
                                        >
                                            <Flag className="w-4 h-4 mr-3" />
                                            LOG INCIDENT
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            {/* Report View Overlay */}
                            <AnimatePresence>
                                {showReportView && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 50 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 50 }}
                                        className="absolute inset-x-0 bottom-0 bg-[#0d1321] z-[100] p-10 rounded-t-[3.5rem] border-t border-white/10 shadow-[0_-32px_120px_rgba(0,0,0,0.8)]"
                                    >
                                        <div className="flex items-center justify-between mb-10">
                                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                                                <Flag className="h-8 w-8 text-red-500" />
                                                Incident Report
                                            </h3>
                                            <Button variant="ghost" size="icon" onClick={() => setShowReportView(false)} className="rounded-2xl hover:bg-white/5 text-slate-500">
                                                <X className="h-6 w-6" />
                                            </Button>
                                        </div>

                                        <div className="space-y-8 max-w-2xl mx-auto">
                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Select Protocol Breach</Label>
                                                <RadioGroup value={reportReason} onValueChange={setReportReason} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {[
                                                        { id: 'r1', val: 'inappropriate_behavior', label: 'Improper Conduct' },
                                                        { id: 'r2', val: 'spam', label: 'Spam Attack' },
                                                        { id: 'r3', val: 'harassment', label: 'Direct Harassment' },
                                                        { id: 'r4', val: 'fake_profile', label: 'Identity Mimicry' },
                                                        { id: 'r5', val: 'other', label: 'Unspecified' }
                                                    ].map((opt) => (
                                                        <div key={opt.id} className="flex items-center space-x-3 p-4 bg-white/5 border border-white/5 rounded-2xl cursor-pointer hover:bg-white/10 transition-all">
                                                            <RadioGroupItem value={opt.val} id={opt.id} className="border-slate-700 text-emerald-500" />
                                                            <Label htmlFor={opt.id} className="text-white font-bold tracking-tight cursor-pointer uppercase text-[11px]">{opt.label}</Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            </div>

                                            <div className="space-y-4">
                                                <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Breach Details (Encrypted)</Label>
                                                <Textarea
                                                    placeholder="Describe the incident sequence for review..."
                                                    value={reportDetails}
                                                    onChange={(e) => setReportDetails(e.target.value)}
                                                    rows={5}
                                                    className="bg-white/5 border-white/10 text-white rounded-2xl p-6 focus:ring-emerald-500"
                                                />
                                            </div>

                                            <Button
                                                className="w-full h-16 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-red-500/20"
                                                onClick={handleReportUser}
                                                disabled={isSubmittingReport}
                                            >
                                                {isSubmittingReport ? 'LOGGING...' : 'COMMIT REPORT'}
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Premium Action HUD */}
                            <div className="fixed bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#050810] to-transparent flex justify-center gap-6 z-[60] md:absolute md:rounded-b-[3.5rem]">
                                <motion.div className="flex-1 max-w-[280px]" whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        className={`w-full h-20 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all border-none ${isLiked ? 'bg-emerald-600 text-white shadow-emerald-500/30' : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/10'}`}
                                        onClick={handleLikeProfile}
                                        disabled={isLiked}
                                    >
                                        <Heart size={20} className={`mr-3 ${isLiked ? 'fill-white' : ''}`} />
                                        {isLiked ? 'INTEREST LOGGED' : 'MARK INTEREST'}
                                    </Button>
                                </motion.div>

                                <motion.div className="flex-1 max-w-[280px]" whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }}>
                                    <Button
                                        className={`w-full h-20 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl transition-all border-none ${isFriend ? 'bg-emerald-600 text-white shadow-emerald-500/30' : (requestSent ? 'bg-white/5 text-emerald-400 opacity-60' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20')}`}
                                        onClick={isFriend ? handleSendMessage : handleAddFriend}
                                        disabled={(requestSent && !isFriend) || sendingRequest}
                                    >
                                        {isFriend ? (
                                            <>
                                                <MessageCircle size={20} className="mr-3" />
                                                SYNC CHANNEL
                                            </>
                                        ) : requestSent ? (
                                            <>
                                                <Check size={20} className="mr-3" />
                                                SYNC WAITING
                                            </>
                                        ) : (
                                            <>
                                                <Zap size={20} className="mr-3 fill-white" />
                                                INITIALIZE SYNC
                                            </>
                                        )}
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : null}
                </AnimatePresence>
            </DialogContent>
        </Dialog>
    )
}
