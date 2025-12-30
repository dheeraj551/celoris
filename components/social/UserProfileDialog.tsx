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
    AlertTriangle
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useRouter } from "next/navigation"
import { AdUnit } from "@/components/AdUnit"
import InstagramPosts from "@/components/InstagramPosts"

interface UserProfileDialogProps {
    userId: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function UserProfileDialog({ userId, open, onOpenChange }: UserProfileDialogProps) {
    const [profile, setProfile] = useState<any>(null)
    const [currentUser, setCurrentUser] = useState<any>(null)
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
            // Reset state on close
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

            // Get current user
            const { data: { user } } = await supabase.auth.getUser()
            setCurrentUser(user)

            // Fetch profile by ID
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

            if (user && profileData) {
                // Check if they are already friends (matched)
                const { data: match } = await supabase
                    .from('matches')
                    .select('*')
                    .or(`and(user1_id.eq.${user.id},user2_id.eq.${profileData.id}),and(user1_id.eq.${profileData.id},user2_id.eq.${user.id})`)
                    .maybeSingle()

                if (match) {
                    setIsFriend(true)
                } else {
                    // Check if friend request sent
                    const { data: swipe } = await supabase
                        .from('swipes')
                        .select('*')
                        .eq('swiper_id', user.id)
                        .eq('target_user_id', profileData.id)
                        .eq('direction', 'like')
                        .maybeSingle()

                    if (swipe) {
                        setRequestSent(true)
                    }
                }

                // Check if already liked
                const { data: like } = await supabase
                    .from('swipes')
                    .select('*')
                    .eq('swiper_id', user.id)
                    .eq('target_user_id', profileData.id)
                    .eq('direction', 'like')
                    .maybeSingle()

                if (like) {
                    setIsLiked(true)
                }

                // Check if blocked
                const { data: block } = await supabase
                    .from('blocked_users')
                    .select('*')
                    .eq('blocker_id', user.id)
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

            // Insert like into swipes table (using 'like' as direction)
            const { error } = await supabase.from('swipes').insert({
                swiper_id: currentUser.id,
                target_user_id: profile.id,
                direction: 'like'
            } as any)

            if (error) throw error

            setIsLiked(true)
            setRequestSent(true)

            toast({
                title: "Profile Liked!",
                description: `You liked ${profile.full_name}'s profile.`,
                duration: 3000,
            })

        } catch (error) {
            console.error('Error liking profile:', error)
            toast({
                title: "Error",
                description: "Failed to like profile. Please try again.",
                variant: "destructive",
            })
        }
    }

    const handleSendMessage = () => {
        if (isFriend) {
            router.push('/social/matches')
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
                await supabase.from('matches').insert({
                    user1_id: currentUser.id,
                    user2_id: profile.id
                } as any)
                alert("It's a match! You are now friends.")
                setIsFriend(true)
            } else {
                // alert("Friend request sent!")
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

    const handleBlockUser = async () => {
        if (!currentUser || !profile) return

        if (!confirm("Are you sure you want to block this user? They will not be able to message you.")) return

        try {
            const supabase = createClient()
            const { error } = await supabase.from('blocked_users').insert({
                blocker_id: currentUser.id,
                blocked_id: profile.id
            } as any)

            if (error) throw error

            setIsBlocked(true)
            toast({
                title: "User Blocked",
                description: "You have blocked this user.",
            })
            onOpenChange(false)
        } catch (error) {
            console.error('Error blocking user:', error)
            toast({
                title: "Error",
                description: "Failed to block user.",
                variant: "destructive"
            })
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

            toast({
                title: "Report Sent",
                description: "Our support team will review this report.",
            })
            setShowReportView(false)
        } catch (error) {
            console.error('Error reporting user:', error)
            toast({
                title: "Error",
                description: "Failed to send report.",
                variant: "destructive"
            })
        } finally {
            setIsSubmittingReport(false)
        }
    }

    if (!open) return null

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-[#FDF8F3] p-0 border-none">
                {loading ? (
                    <div className="flex items-center justify-center p-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                    </div>
                ) : error ? (
                    <div className="p-12 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Error</h3>
                        <p className="text-gray-600">{error}</p>
                    </div>
                ) : profile ? (
                    <div className="relative pb-24">
                        {/* Cover Image & Profile Picture Wrapper */}
                        <div className="relative mb-20">
                            {/* Ad Banner Area */}
                            <div className="w-full h-auto min-h-[200px] overflow-hidden bg-white flex items-center justify-center">
                                <AdUnit format="horizontal" className="my-0" />
                            </div>

                            <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 z-10">
                                <div className="w-32 h-32 rounded-full border-4 border-[#FDF8F3] overflow-hidden shadow-xl bg-white">
                                    <img
                                        src={profile.profile_pic_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.full_name || profile.username)}&background=6366f1&color=fff&size=160`}
                                        alt={profile.full_name}
                                        className="w-full h-full object-cover select-none"
                                        onContextMenu={(e) => e.preventDefault()}
                                        draggable={false}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="px-6 md:px-8">
                            {/* Profile Header Info */}
                            <div className="text-center mb-8">
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">{profile.full_name}</h2>
                                <p className="text-gray-500 mb-4">@{profile.username}</p>

                                <div className="flex items-center justify-center gap-3">
                                    {profile.subscription_status === 'premium' && (
                                        <span className="bg-[#EAD8B1] text-[#8B7355] px-3 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                                            <Crown className="w-3 h-3 fill-current" /> Premium
                                        </span>
                                    )}
                                    {profile.verification_status === 'verified' && (
                                        <span className="bg-[#D1E7DD] text-[#0F5132] px-3 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                                            <CheckCircle2 className="w-3 h-3" /> Verified
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Left Column: Info */}
                                <div className="md:col-span-1 space-y-6">
                                    {/* About Section */}
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">About</h3>
                                        <p className="text-gray-700 text-sm leading-relaxed">
                                            {profile.bio || "No bio available."}
                                        </p>
                                    </div>

                                    {/* Contact Info Card */}
                                    <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden">
                                        <CardHeader className="pb-2 pt-4 px-4">
                                            <CardTitle className="text-base">Contact Info</CardTitle>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4 space-y-3">

                                            {profile.location && (
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{profile.location}</span>
                                                </div>
                                            )}
                                            <div
                                                className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:text-primary-600 transition-colors"
                                                onClick={handleAddFriend}
                                            >
                                                {requestSent ? <Check className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                                                <span>{requestSent ? 'Request Sent' : 'Add Friend'}</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                </div>

                                {/* Right Column: Social Highlights */}
                                <div className="md:col-span-2">
                                    <Card className="border-none shadow-sm bg-white rounded-xl overflow-hidden h-full min-h-[300px]">
                                        <CardHeader className="pt-4 px-4 pb-2">
                                            <div className="flex items-center gap-2">
                                                <Instagram className="w-5 h-5 text-pink-600" />
                                                <CardTitle className="text-lg">Social Highlights</CardTitle>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="px-4 pb-4">
                                            <InstagramPosts userId={profile.id} showHeader={false} displayMode="horizontal" autoScroll={false} />
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>

                            {/* Blocking & Reporting Section */}
                            <div className="mt-6 border-t border-gray-100 pt-6">
                                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <Shield className="h-4 w-4 text-purple-600" />
                                    Safety & Privacy
                                </h3>
                                <div className="flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-red-100 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        onClick={handleBlockUser}
                                        disabled={isBlocked}
                                    >
                                        <AlertTriangle className="w-4 h-4 mr-2" />
                                        {isBlocked ? 'Blocked' : 'Block User'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50"
                                        onClick={() => setShowReportView(true)}
                                    >
                                        <Flag className="w-4 h-4 mr-2" />
                                        Report User
                                    </Button>
                                </div>
                            </div>
                        </div>

                        {/* Report View Overlay */}
                        {showReportView && (
                            <div className="absolute inset-0 bg-white z-50 p-6 flex flex-col">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <Flag className="h-5 w-5 text-red-500" />
                                        Report User
                                    </h3>
                                    <Button variant="ghost" size="icon" onClick={() => setShowReportView(false)}>
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="space-y-6 flex-1 overflow-y-auto">
                                    <div className="space-y-4">
                                        <Label>Why are you reporting this user?</Label>
                                        <RadioGroup value={reportReason} onValueChange={setReportReason}>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="inappropriate_behavior" id="r1" />
                                                <Label htmlFor="r1">Inappropriate Behavior</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="spam" id="r2" />
                                                <Label htmlFor="r2">Spam or Scam</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="harassment" id="r3" />
                                                <Label htmlFor="r3">Harassment or Bullying</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="fake_profile" id="r4" />
                                                <Label htmlFor="r4">Fake Profile</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <RadioGroupItem value="other" id="r5" />
                                                <Label htmlFor="r5">Other</Label>
                                            </div>
                                        </RadioGroup>
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Additional Details</Label>
                                        <Textarea
                                            placeholder="Please provide more details about the issue..."
                                            value={reportDetails}
                                            onChange={(e) => setReportDetails(e.target.value)}
                                            rows={4}
                                        />
                                    </div>

                                    <div className="pt-4">
                                        <Button
                                            className="w-full bg-red-600 hover:bg-red-700 text-white"
                                            onClick={handleReportUser}
                                            disabled={isSubmittingReport}
                                        >
                                            {isSubmittingReport ? 'Sending Report...' : 'Submit Report'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Bottom Action Bar (Sticky in Dialog) */}
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur border-t border-gray-100 flex justify-center gap-4 z-50 md:absolute md:rounded-b-lg">
                            <Button
                                className={`flex-1 max-w-[200px] text-white ${isLiked ? 'bg-pink-600 hover:bg-pink-700' : 'bg-[#4A6755] hover:bg-[#3A5244]'}`}
                                onClick={handleLikeProfile}
                                disabled={isLiked}
                            >
                                <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                                {isLiked ? 'Liked' : 'Like Profile'}
                            </Button>
                            <Button
                                variant="outline"
                                className={`flex-1 max-w-[200px] border-[#1E293B] text-[#1E293B] hover:bg-gray-100 ${requestSent && !isFriend ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={isFriend ? handleSendMessage : handleAddFriend}
                                disabled={(requestSent && !isFriend) || sendingRequest}
                            >
                                {isFriend ? (
                                    <>
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        Send Message
                                    </>
                                ) : requestSent ? (
                                    <>
                                        <Check className="w-4 h-4 mr-2" />
                                        Request Sent
                                    </>
                                ) : (
                                    <>
                                        <UserPlus className="w-4 h-4 mr-2" />
                                        Add Friend
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                ) : null}
            </DialogContent>
        </Dialog>
    )
}
