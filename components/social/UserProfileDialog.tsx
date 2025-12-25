"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import InstagramPosts from "@/components/InstagramPosts"
import {
    User,
    Instagram,
    Facebook,
    MapPin,
    Calendar,
    Heart,
    Crown,
    CheckCircle2,
    Check,
    UserPlus,
    X,
    MessageCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { AdUnit } from "@/components/AdUnit"

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
                // A match exists if A liked B AND B liked A
                // We can check the 'matches' table directly if you have one, or check swipes.
                // Assuming 'matches' table is the source of truth for friendship
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
                        .eq('direction', 'right')
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
            // As requested, redirect to matches page to avoid ID mismatch issues
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
                direction: 'right'
            } as any)

            if (error) throw error

            // Check for match (if they already swiped right on us)
            const { data: oppositeSwipe } = await supabase
                .from('swipes')
                .select('*')
                .eq('swiper_id', profile.id)
                .eq('target_user_id', currentUser.id)
                .eq('direction', 'right')
                .single()

            if (oppositeSwipe) {
                await supabase.from('matches').insert({
                    user1_id: currentUser.id,
                    user2_id: profile.id
                } as any)
                alert("It's a match! You are now friends.")
                setIsFriend(true) // Immediately update UI to show "Send Message"
            } else {
                // alert("Friend request sent!")
            }

            setRequestSent(true)
        } catch (error) {
            console.error('Error sending friend request:', error)
            alert('Failed to send friend request')
        } finally {
            setSendingRequest(false)
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

                        {/* Close Button */}
                        <button
                            onClick={() => onOpenChange(false)}
                            className="absolute top-4 right-4 z-50 p-2 bg-white/50 hover:bg-white rounded-full transition-colors"
                        >
                            <X className="h-6 w-6 text-gray-800" />
                        </button>

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
                                        className="w-full h-full object-cover"
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
                                            {profile.instagram_handle && (
                                                <a
                                                    href={profile.instagram_handle.startsWith('http') ? profile.instagram_handle : `https://instagram.com/${profile.instagram_handle.replace('@', '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-pink-600 transition-colors"
                                                >
                                                    <Instagram className="h-4 w-4" />
                                                    <span>{profile.instagram_handle.startsWith('http') ? 'Instagram Profile' : `@${profile.instagram_handle}`}</span>
                                                </a>
                                            )}
                                            {profile.facebook_handle && (
                                                <a
                                                    href={profile.facebook_handle.startsWith('http') ? profile.facebook_handle : `https://facebook.com/${profile.facebook_handle.replace('@', '')}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 transition-colors"
                                                >
                                                    <Facebook className="h-4 w-4" />
                                                    <span>{profile.facebook_handle.startsWith('http') ? 'Facebook Profile' : `@${profile.facebook_handle}`}</span>
                                                </a>
                                            )}
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
                        </div>

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
