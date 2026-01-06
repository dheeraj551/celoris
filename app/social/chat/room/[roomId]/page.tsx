"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { useMemo } from "react"
import {
    Send,
    ArrowLeft,
    Users,
    MoreVertical,
    Smile,
    Image as ImageIcon,
    Paperclip,
    LogOut,
    Info,
    Check,
    X,
    MessageCircle,
    ArrowRight,
    Search,
    Zap,
    Sparkles,
    Shield,
    Lock,
    Globe,
    Target,
    Rocket
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { UserProfileDialog } from "@/components/social/UserProfileDialog"
import { AdUnit } from "@/components/AdUnit"
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react'

const MSG_SOUND = "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
const JOIN_SOUND = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"
const LEAVE_SOUND = "https://assets.mixkit.co/active_storage/sfx/2572/2572-preview.mp3"

interface UserProfile {
    id: string
    name: string
    avatar_url?: string
    is_verified?: boolean
}

interface ChatMessage {
    id: string
    sender: UserProfile
    content: string
    timestamp: number
    type: 'text' | 'image'
}

const ROOM_DETAILS: Record<string, { title: string, description: string, color: string, accent: string }> = {
    "socialize": {
        title: "Socialize & Hangout",
        description: "Public node for spontaneous connections and social bridging.",
        color: "bg-emerald-500",
        accent: "#10b981"
    },
    "networking": {
        title: "Networking & Growth",
        description: "Professional frequency for career advancement and synergy.",
        color: "bg-emerald-500",
        accent: "#10b981"
    },
    "tech-trends": {
        title: "Tech Trends Chat",
        description: "Cutting-edge discussions on the latest digital evolution.",
        color: "bg-orange-500",
        accent: "#f59e0b"
    }
}

import { useAuth } from "@/components/providers/AuthProvider"

export default function PublicRoomPage() {
    const params = useParams()
    const router = useRouter()
    const roomId = params.roomId as string
    const room = ROOM_DETAILS[roomId] || { title: "Nexus Point", description: "Unknown social coordinate.", color: "bg-slate-500", accent: "#64748b" }

    const { user: authUser, profile: userProfileData, loading: authLoading } = useAuth()

    const user = useMemo<UserProfile | null>(() => {
        if (!authUser || !userProfileData) return null
        return {
            id: authUser.id,
            name: userProfileData.full_name || authUser.email?.split('@')[0] || 'Anonymous',
            avatar_url: userProfileData.profile_pic_url,
            is_verified: userProfileData.verification_status === 'verified'
        }
    }, [authUser, userProfileData])

    const isLoaded = !authLoading && !!user

    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [onlineCount, setOnlineCount] = useState(1)
    const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([])

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const channelRef = useRef<any>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const prevOnlineCount = useRef<number>(0)
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    // Invite & Private Room State
    const [incomingInvite, setIncomingInvite] = useState<any>(null)
    const [sentInvite, setSentInvite] = useState<any>(null)
    const [privateRoomsCount, setPrivateRoomsCount] = useState(0)
    const [activePrivateRooms, setActivePrivateRooms] = useState<{ id: string, users: UserProfile[] }[]>([])
    const { toast } = useToast()

    const isPrivate = roomId.startsWith('private-')

    useEffect(() => {
        if (!authLoading && !authUser) {
            router.push('/login')
        }
    }, [authUser, authLoading, router])

    // 1. Join Global Tracker (Optimized)
    useEffect(() => {
        if (!isLoaded || !user) return

        const supabase = createClient()
        const tracker = supabase.channel('global-rooms-tracker', {
            config: {
                presence: { key: user.id }
            }
        })

        tracker
            .on('presence', { event: 'sync' }, () => {
                const state = tracker.presenceState()
                const roomsMap: Record<string, UserProfile[]> = {}

                Object.values(state).forEach((presences: any) => {
                    const presence = presences[0]
                    if (presence?.status === 'busy' && presence.roomId) {
                        if (!roomsMap[presence.roomId]) {
                            roomsMap[presence.roomId] = []
                        }
                        roomsMap[presence.roomId].push(presence.user)
                    }
                })

                const rooms = Object.entries(roomsMap).map(([id, users]) => ({
                    id,
                    users
                })).sort((a, b) => a.id.localeCompare(b.id))

                setPrivateRoomsCount(rooms.length)
                setActivePrivateRooms(rooms)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await tracker.track({
                        user,
                        status: isPrivate ? 'busy' : 'available',
                        roomId: isPrivate ? roomId : null
                    })
                }
            })

        return () => {
            tracker.unsubscribe()
        }
    }, [isLoaded, user?.id, isPrivate, roomId])


    // 2. Join Chat Room (Optimized)
    useEffect(() => {
        if (!isLoaded || !user || !roomId) return

        const supabase = createClient()
        const channelName = `room:${roomId}`

        const channel = supabase.channel(channelName, {
            config: {
                broadcast: { self: true },
                presence: {
                    key: user.id,
                },
            },
        })

        channel
            .on('broadcast', { event: 'message' }, ({ payload }: { payload: any }) => {
                setMessages((prev) => {
                    if (prev.some(m => m.id === payload.id)) return prev
                    if (payload.sender.id !== user.id) {
                        new Audio(MSG_SOUND).play().catch(() => { })
                    }
                    return [...prev, payload as ChatMessage]
                })
            })
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                const users: UserProfile[] = []

                Object.values(state).forEach((presences: any) => {
                    const userPresence = presences[0]
                    if (userPresence && userPresence.user) {
                        users.push(userPresence.user)
                    }
                })

                setOnlineCount(users.length)
                setOnlineUsers(users)

                if (users.length > prevOnlineCount.current) {
                    new Audio(JOIN_SOUND).play().catch(() => { })
                } else if (users.length < prevOnlineCount.current) {
                    new Audio(LEAVE_SOUND).play().catch(() => { })
                }
                prevOnlineCount.current = users.length
            })
            .on('broadcast', { event: 'chat-invite' }, ({ payload }: { payload: any }) => {
                if (payload.targetUserId === user.id) {
                    setIncomingInvite(payload)
                }
            })
            .on('broadcast', { event: 'chat-invite-accepted' }, ({ payload }: { payload: any }) => {
                if (payload.senderUserId === user.id) {
                    toast({
                        title: "Datalink Successful",
                        description: "Joining private encrypted node...",
                    })
                    router.push(`/social/chat/room/${payload.roomId}`)
                }
            })
            .on('broadcast', { event: 'chat-invite-rejected' }, ({ payload }: { payload: any }) => {
                if (payload.senderUserId === user.id) {
                    setSentInvite(null)
                    toast({
                        title: "Sync Blocked",
                        description: `${payload.targetName} declined the interface.`,
                        variant: "destructive"
                    })
                }
            })
            .subscribe(async (status: string) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        user: user,
                        online_at: new Date().toISOString(),
                    })
                }
            })

        channelRef.current = channel

        return () => {
            channel.unsubscribe()
            channelRef.current = null
        }
    }, [isLoaded, user?.id, roomId, isPrivate, router, toast])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const sendMessage = async (content = newMessage, type: 'text' | 'image' = 'text') => {
        if (!content.trim() || !user || !channelRef.current) return

        const message: ChatMessage = {
            id: crypto.randomUUID(),
            sender: user,
            content: content.trim(),
            timestamp: Date.now(),
            type: type
        }

        await channelRef.current.send({
            type: 'broadcast',
            event: 'message',
            payload: message,
        })

        if (type === 'text') {
            setNewMessage("")
            setShowEmojiPicker(false)
        }
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (!file || !user) return

        if (!file.type.startsWith('image/')) {
            toast({ title: "Incompatible Format", description: "Required: Visual Data Stream.", variant: "destructive" })
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            toast({ title: "Payload Too Heavy", description: "Max capacity: 5MB.", variant: "destructive" })
            return
        }

        setIsUploading(true)
        try {
            const supabase = createClient()
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
            const filePath = `${roomId}/${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('chat-uploads')
                .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
                .from('chat-uploads')
                .getPublicUrl(filePath)

            await sendMessage(publicUrl, 'image')

        } catch (error) {
            console.error("Upload error:", error)
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage(prev => prev + emojiData.emoji)
    }

    const sendInvite = async (targetUser: UserProfile) => {
        if (privateRoomsCount >= 5) {
            toast({
                title: "Network Overload",
                description: "All private stations are currently saturated.",
                variant: "destructive"
            })
            return
        }

        if (!channelRef.current) return

        const invitePayload = {
            sender: user,
            targetUserId: targetUser.id,
            inviteId: crypto.randomUUID()
        }

        await channelRef.current.send({
            type: 'broadcast',
            event: 'chat-invite',
            payload: invitePayload
        })

        setSentInvite(targetUser)
        toast({
            title: "Sync Initiated",
            description: `Waiting for ${targetUser.name} to acknowledge...`,
        })
    }

    const acceptInvite = async () => {
        if (!incomingInvite || !channelRef.current || !user) return
        const newRoomId = `private-${incomingInvite.inviteId}`
        await channelRef.current.send({
            type: 'broadcast',
            event: 'chat-invite-accepted',
            payload: {
                senderUserId: incomingInvite.sender.id,
                targetUserId: user.id,
                roomId: newRoomId
            }
        })
        router.push(`/social/chat/room/${newRoomId}`)
    }

    const rejectInvite = async () => {
        if (!incomingInvite || !channelRef.current || !user) return
        await channelRef.current.send({
            type: 'broadcast',
            event: 'chat-invite-rejected',
            payload: {
                senderUserId: incomingInvite.sender.id,
                targetUserId: user.id,
                targetName: user.name
            }
        })
        setIncomingInvite(null)
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-[#050810] flex items-center justify-center">
                <div className="text-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full mx-auto mb-6"
                    />
                    <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Connecting to Social Plane...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 flex flex-col bg-[#050810] z-[60] text-slate-200 selection:bg-blue-500/30 overflow-hidden font-sans">
            {/* Premium Animated Background Elements */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-10%] w-[100%] h-[100%] bg-emerald-600/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1.2, 1, 1.2],
                        x: [0, -50, 0],
                        y: [0, -30, 0],
                        opacity: [0.05, 0.1, 0.05]
                    }}
                    transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-30%] right-[-10%] w-[120%] h-[120%] bg-emerald-600/10 rounded-full blur-[150px]"
                />
            </div>

            {/* Header - Advanced Glassmorphism */}
            <header className="flex-none border-b border-white/5 bg-[#050810]/40 backdrop-blur-3xl px-8 py-5 z-20 shadow-2xl">
                <div className="container mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <motion.div whileHover={{ x: -5 }} whileTap={{ scale: 0.95 }}>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push('/social/chat')}
                                className="rounded-2xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 h-11 w-11 shadow-lg"
                            >
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                        </motion.div>

                        <div className="flex items-center gap-5">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className={`h-14 w-14 rounded-3xl ${isPrivate ? 'bg-gradient-to-br from-emerald-500 to-teal-600 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-gradient-to-br from-emerald-400 to-teal-600 shadow-[0_0_30px_rgba(16,185,129,0.3)]'} flex items-center justify-center text-white font-black overflow-hidden relative group`}
                            >
                                <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                                {isPrivate ? <Lock className="h-6 w-6" /> : <Globe className="h-6 w-6" />}
                            </motion.div>

                            <div>
                                <h1 className="font-black text-white text-2xl italic uppercase tracking-tighter flex items-center gap-3">
                                    {isPrivate ? 'Private Sanctum' : room.title}
                                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                </h1>
                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
                                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-full border border-white/5">
                                        {isPrivate ? 'ENCRYPTED' : `${onlineCount} ACTIVE NODES`}
                                    </span>
                                    <span className="opacity-30">|</span>
                                    <span className={`tracking-widest ${isPrivate ? 'text-teal-400' : 'text-emerald-400'}`}>{isPrivate ? 'CONFIDENTIAL CHANNEL' : 'LOBBY BROADCAST'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {!isPrivate && (
                            <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-teal-600/10 border border-teal-500/20 rounded-full text-[9px] font-black text-teal-400 tracking-widest shadow-2xl">
                                <Zap className="h-3.5 w-3.5 fill-teal-400" />
                                {privateRoomsCount}/5 STATIONS OCCUPIED
                            </div>
                        )}

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white h-11 w-11 rounded-2xl bg-white/5 border border-white/5 shadow-lg lg:hidden">
                                    <Users className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="bg-[#050810]/95 backdrop-blur-3xl border-white/5 text-white w-full sm:max-w-md p-8">
                                <SheetHeader className="border-b border-white/5 pb-8 mb-8">
                                    <SheetTitle className="text-3xl font-black italic uppercase tracking-tighter text-white flex items-center gap-4">
                                        <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                                            <Users className="h-7 w-7 text-emerald-400" />
                                        </div>
                                        Active Nodes
                                    </SheetTitle>
                                    <SheetDescription className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
                                        {onlineCount} synchronized lifeforms detected.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-250px)] pr-2 custom-scrollbar">
                                    {onlineUsers.map((onlineUser) => (
                                        <motion.div
                                            key={onlineUser.id}
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center justify-between group p-4 bg-white/5 rounded-3xl border border-white/5 hover:border-emerald-500/30 transition-all shadow-lg"
                                        >
                                            <div
                                                className="flex items-center gap-4 cursor-pointer flex-1"
                                                onClick={() => setSelectedUserId(onlineUser.id)}
                                            >
                                                <div className="relative">
                                                    <Avatar className="h-12 w-12 border-2 border-white/10">
                                                        <AvatarImage src={onlineUser.avatar_url} />
                                                        <AvatarFallback className="bg-[#0d1321] text-emerald-400 font-black">{onlineUser.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#050810] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-white italic truncate max-w-[120px]">
                                                        {onlineUser.name}
                                                        {onlineUser.id === user?.id && <span className="text-emerald-500 font-normal ml-1">(YOU)</span>}
                                                    </span>
                                                    <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">
                                                        {onlineUser.is_verified ? 'VERIFIED NODE' : 'SYNCED EXPLORER'}
                                                    </span>
                                                </div>
                                            </div>
                                            {onlineUser.id !== user?.id && !isPrivate && (
                                                <Button
                                                    size="sm"
                                                    className="h-10 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                                                    onClick={() => sendInvite(onlineUser)}
                                                    disabled={privateRoomsCount >= 5}
                                                >
                                                    SYNC <ArrowRight className="h-3 w-3 ml-2" />
                                                </Button>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>

                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white h-11 w-11 rounded-2xl bg-white/5 border border-white/5 shadow-lg hidden sm:flex">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <div className="flex-1 flex overflow-hidden relative z-10">
                {/* Messages/Lobby Area */}
                <div className="flex-1 overflow-y-auto px-6 py-10 flex flex-col items-center custom-scrollbar">
                    <div className="w-full max-w-5xl space-y-16">
                        {/* Welcome/Discovery View */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center py-10"
                        >
                            <motion.div
                                animate={{
                                    boxShadow: isPrivate ? ["0 0 20px rgba(16,185,129,0.1)", "0 0 50px rgba(16,185,129,0.3)", "0 0 20px rgba(16,185,129,0.1)"] : ["0 0 20px rgba(16,185,129,0.1)", "0 0 50px rgba(16,185,129,0.3)", "0 0 20px rgba(16,185,129,0.1)"]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className={`inline-flex items-center justify-center h-28 w-28 rounded-[2.5rem] ${isPrivate ? 'bg-teal-500/20 border-teal-500/30' : 'bg-emerald-500/20 border-emerald-500/30'} border backdrop-blur-2xl mb-10 shadow-3xl relative group`}
                            >
                                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />
                                {isPrivate ? <Shield className="h-12 w-12 text-teal-400" /> : <Rocket className="h-12 w-12 text-emerald-400" />}
                            </motion.div>

                            <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-6 leading-none">
                                {isPrivate ? 'Confidential' : room.title}
                            </h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base font-medium leading-relaxed tracking-wide uppercase italic">
                                {isPrivate
                                    ? 'A temporary encrypted sanctuary. Signal termination wipes all records from the social plane.'
                                    : room.description}
                            </p>

                            {!isPrivate && (
                                <div className="mt-16 space-y-20">
                                    {/* Active User Cluster */}
                                    <div className="flex flex-col items-center gap-10">
                                        <div className="flex -space-x-5 p-4 bg-white/5 rounded-[2.5rem] border border-white/5 shadow-2xl backdrop-blur-2xl">
                                            {onlineUsers.slice(0, 8).map((u, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ opacity: 0, scale: 0.5, x: -30 }}
                                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                                    transition={{ delay: i * 0.08, type: "spring" }}
                                                    className="relative"
                                                    onClick={() => setSelectedUserId(u.id)}
                                                >
                                                    <Avatar className="h-14 w-14 ring-4 ring-[#050810] shadow-2xl hover:translate-y-[-8px] transition-transform cursor-pointer border border-white/10">
                                                        <AvatarImage src={u.avatar_url} />
                                                        <AvatarFallback className="bg-[#0b121e] text-emerald-400 font-bold">{u.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                </motion.div>
                                            ))}
                                            {onlineCount > 8 && (
                                                <div className="flex h-14 w-20 items-center justify-center rounded-3xl bg-emerald-600/20 text-emerald-400 text-xs font-black ring-4 ring-[#050810] border border-emerald-500/30 shadow-2xl backdrop-blur-xl">
                                                    +{onlineCount - 8}
                                                </div>
                                            )}
                                        </div>

                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="px-8 py-3 bg-white/5 border border-white/10 rounded-full flex items-center gap-3 shadow-2xl backdrop-blur-3xl"
                                        >
                                            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                                            <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">{onlineCount} NODES PULSING</span>
                                        </motion.div>
                                    </div>

                                    {/* Stations Grid - Premium Design */}
                                    <div className="w-full max-w-4xl mx-auto px-4">
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] italic">Encryption Stations</h3>
                                            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
                                            {[1, 2, 3, 4, 5].map((num) => {
                                                const roomSlot = activePrivateRooms[num - 1];
                                                const isOccupied = !!roomSlot;
                                                return (
                                                    <motion.div
                                                        key={num}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: num * 0.1 }}
                                                        whileHover={{ y: -10, scale: 1.02 }}
                                                        className={`relative flex flex-col items-center p-6 rounded-[2rem] border transition-all duration-500 group ${isOccupied
                                                            ? 'border-emerald-500/40 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.15)]'
                                                            : 'border-white/5 bg-white/[0.02] hover:bg-white/[0.05]'
                                                            }`}
                                                    >
                                                        {isOccupied && (
                                                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent -translate-y-full animate-[scan_3s_linear_infinite] pointer-events-none" />
                                                        )}

                                                        <span className={`text-[8px] font-black tracking-widest mb-6 uppercase ${isOccupied ? 'text-emerald-400' : 'text-slate-600'}`}>
                                                            NODE_{num.toString().padStart(2, '0')}
                                                        </span>

                                                        <div className="flex -space-x-2.5 mb-6 min-h-[44px] items-center">
                                                            {isOccupied ? (
                                                                roomSlot.users.map((u, i) => (
                                                                    <Avatar key={i} className="h-11 w-11 ring-4 ring-[#050810] shadow-2xl border border-white/10">
                                                                        <AvatarImage src={u.avatar_url} />
                                                                        <AvatarFallback className="text-[10px] bg-emerald-900/40 text-emerald-300 font-black">
                                                                            {u.name.charAt(0)}
                                                                        </AvatarFallback>
                                                                    </Avatar>
                                                                ))
                                                            ) : (
                                                                <div className="h-11 w-11 rounded-2xl bg-white/[0.02] flex items-center justify-center border border-white/5 group-hover:border-emerald-500/20 transition-all shadow-inner">
                                                                    <Target className="h-4 w-4 text-slate-800 group-hover:text-emerald-900/40 transition-colors" />
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className={`px-4 py-1.5 rounded-xl text-[8px] font-black uppercase tracking-widest italic ${isOccupied
                                                            ? 'bg-emerald-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]'
                                                            : 'bg-white/5 text-slate-600'
                                                            }`}>
                                                            {isOccupied ? 'BUSY' : 'READY'}
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>

                        {/* Ad Module */}
                        {!isPrivate && (
                            <div className="p-1 rounded-[2.5rem] bg-gradient-to-br from-white/10 to-transparent">
                                <AdUnit slot="9266909448" className="m-0 rounded-[2.4rem] overflow-hidden" />
                            </div>
                        )}

                        {/* Private Chat Stream */}
                        {isPrivate && (
                            <div className="space-y-10 pb-32">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg, index) => {
                                        const isMe = msg.sender.id === user.id
                                        const showAvatar = index === 0 || messages[index - 1].sender.id !== msg.sender.id

                                        return (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, scale: 0.9, y: 30, x: isMe ? 20 : -20 }}
                                                animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                                                className={`flex gap-6 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                                            >
                                                <div className={`flex-none ${!showAvatar ? 'w-12' : ''}`}>
                                                    {showAvatar && (
                                                        <motion.div whileHover={{ scale: 1.1 }}>
                                                            <Avatar className="h-12 w-12 border-2 border-white/10 shadow-2xl cursor-pointer" onClick={() => setSelectedUserId(msg.sender.id)}>
                                                                <AvatarImage src={msg.sender.avatar_url} />
                                                                <AvatarFallback className="bg-[#0b121e] text-emerald-400 font-black">{msg.sender.name.charAt(0)}</AvatarFallback>
                                                            </Avatar>
                                                        </motion.div>
                                                    )}
                                                </div>

                                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                                    {showAvatar && (
                                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3 px-2 italic">
                                                            {isMe ? 'SYNC TRANSMITTING' : msg.sender.name}
                                                        </span>
                                                    )}

                                                    <div
                                                        className={`relative overflow-hidden group px-6 py-4 rounded-3xl shadow-3xl transition-all duration-500 ${isMe
                                                            ? 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white rounded-tr-none border border-white/20'
                                                            : 'bg-white/5 backdrop-blur-3xl border border-white/10 text-slate-100 rounded-tl-none hover:bg-white/10'
                                                            }`}
                                                    >
                                                        {msg.type === 'image' ? (
                                                            <div className="relative group/img overflow-hidden rounded-2xl">
                                                                <img
                                                                    src={msg.content}
                                                                    alt="Satellite Data"
                                                                    className="max-w-full rounded-2xl max-h-[500px] object-cover cursor-pointer transition-transform duration-700 group-hover/img:scale-105"
                                                                    onClick={() => window.open(msg.content, '_blank')}
                                                                />
                                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                                                    <div className="p-3 bg-white/10 backdrop-blur-xl rounded-full border border-white/20">
                                                                        <Search className="h-6 w-6 text-white" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <p className="text-sm md:text-base font-medium leading-relaxed tracking-wide italic selection:bg-white/30">
                                                                {msg.content}
                                                            </p>
                                                        )}
                                                    </div>

                                                    <div className="flex items-center gap-3 mt-3 px-2">
                                                        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">
                                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                        {isMe && <Check className="h-2.5 w-2.5 text-emerald-500" />}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                                <div ref={messagesEndRef} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Desktop Lobby Sidebar */}
                {!isPrivate && (
                    <aside className="hidden lg:flex w-96 border-l border-white/5 flex-col bg-[#050810]/40 backdrop-blur-3xl relative z-20">
                        <div className="p-10 border-b border-white/5">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="font-black text-white text-2xl italic uppercase tracking-tighter flex items-center gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                        <Users className="h-6 w-6 text-blue-400" />
                                    </div>
                                    Lobby Sync
                                </h2>
                                <motion.span
                                    key={onlineCount}
                                    initial={{ scale: 1.5, color: '#3b82f6' }}
                                    animate={{ scale: 1, color: '#94a3b8' }}
                                    className="text-xs font-black bg-white/5 px-4 py-2 rounded-2xl border border-white/10"
                                >
                                    {onlineCount}
                                </motion.span>
                            </div>
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    placeholder="SCANNING FOR NODES..."
                                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-[10px] font-black text-white focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-slate-700 tracking-[0.2em]"
                                />
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                            <AnimatePresence>
                                {onlineUsers.map((onlineUser, idx) => (
                                    <motion.div
                                        key={onlineUser.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="flex items-center justify-between group p-4 hover:bg-white/5 rounded-[2rem] transition-all border border-transparent hover:border-white/10 shadow-lg"
                                    >
                                        <div
                                            className="flex items-center gap-5 cursor-pointer"
                                            onClick={() => setSelectedUserId(onlineUser.id)}
                                        >
                                            <div className="relative">
                                                <Avatar className="h-14 w-14 border-2 border-white/5 group-hover:border-blue-500/50 transition-all">
                                                    <AvatarImage src={onlineUser.avatar_url} />
                                                    <AvatarFallback className="bg-[#0b121e] text-blue-400 font-black">{onlineUser.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#050810] shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-white italic group-hover:text-blue-400 transition-colors">
                                                    {onlineUser.name}
                                                </span>
                                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mt-1">
                                                    {onlineUser.is_verified ? 'VERIFIED' : 'SYNCED'}
                                                </span>
                                            </div>
                                        </div>
                                        {onlineUser.id !== user?.id && (
                                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-10 w-10 rounded-xl bg-blue-600/10 text-blue-400 opacity-0 group-hover:opacity-100 transition-all border border-blue-500/20 hover:bg-blue-600 hover:text-white"
                                                    onClick={() => sendInvite(onlineUser)}
                                                    disabled={privateRoomsCount >= 5}
                                                >
                                                    <Zap className="h-4 w-4 fill-current" />
                                                </Button>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </aside>
                )}
            </div>

            {/* Inbound Sync Request Dialog */}
            <Dialog open={!!incomingInvite} onOpenChange={(open) => !open && setIncomingInvite(null)}>
                <DialogContent className="sm:max-w-md bg-[#050810]/95 border-white/10 text-white shadow-3xl backdrop-blur-3xl rounded-[3rem] p-10">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-5 text-3xl font-black italic uppercase tracking-tighter">
                            <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
                                <Sparkles className="h-8 w-8 text-blue-400" />
                            </div>
                            Inbound Sync
                        </DialogTitle>
                        <DialogDescription className="pt-6 text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">
                            Interface requested by <span className="text-blue-400">{incomingInvite?.sender.name}</span>. Encryption key pending.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center justify-center py-12">
                        <div className="relative group">
                            <motion.div
                                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="absolute inset-0 bg-blue-500/30 blur-3xl rounded-full"
                            />
                            <Avatar className="h-32 w-32 border-4 border-white/10 relative z-10 shadow-3xl">
                                <AvatarImage src={incomingInvite?.sender.avatar_url} />
                                <AvatarFallback className="bg-[#0b121e] text-blue-400 text-3xl font-black italic">{incomingInvite?.sender.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-2 -right-2 bg-blue-600 p-3 rounded-2xl border-4 border-[#050810] z-20 shadow-2xl">
                                <Zap className="h-6 w-6 text-white fill-current animate-pulse" />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="sm:justify-between gap-6 pt-4">
                        <Button
                            variant="ghost"
                            onClick={rejectInvite}
                            className="flex-1 border border-white/5 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-white rounded-2xl h-16 font-black uppercase tracking-widest text-[10px]"
                        >
                            REJECT
                        </Button>
                        <Button
                            onClick={acceptInvite}
                            className="flex-1 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-2xl h-16 font-black uppercase tracking-widest text-[10px] shadow-3xl shadow-blue-500/20"
                        >
                            ACKNOWLEDGE
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Chat HUD - Input Area */}
            {isPrivate && (
                <div className="flex-none bg-[#050810]/40 backdrop-blur-3xl border-t border-white/5 p-8 pb-10 z-30">
                    <div className="container mx-auto max-w-4xl">
                        <form
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                            className="flex items-end gap-5"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="text-slate-500 hover:text-blue-400 bg-white/5 rounded-2xl h-14 w-14 border border-white/5 shadow-lg"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isUploading}
                                >
                                    <Paperclip className={`h-6 w-6 ${isUploading ? 'animate-pulse text-blue-400' : ''}`} />
                                </Button>
                            </motion.div>

                            <div className="flex-1 bg-white/5 border border-white/10 rounded-[2rem] flex items-center px-6 py-4 focus-within:ring-2 focus-within:ring-blue-500/30 transition-all shadow-2xl relative">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="TRANSMIT DATA..."
                                    className="border-0 bg-transparent focus-visible:ring-0 px-0 h-auto py-1 text-white placeholder:text-slate-700 text-sm font-black uppercase tracking-widest"
                                />
                                <Button type="button" variant="ghost" size="icon" className="text-slate-500 hover:text-blue-400 rounded-full h-11 w-11 -mr-2" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                    <Smile className="h-6 w-6" />
                                </Button>
                                {showEmojiPicker && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                        animate={{ opacity: 1, scale: 1, y: 0 }}
                                        className="absolute bottom-[calc(100%+24px)] right-0 z-50 shadow-3xl rounded-3xl overflow-hidden border border-white/10"
                                    >
                                        <EmojiPicker theme={Theme.DARK} onEmojiClick={onEmojiClick} />
                                    </motion.div>
                                )}
                            </div>

                            <motion.div whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }}>
                                <Button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white rounded-[1.5rem] h-14 w-14 shadow-3xl shadow-blue-500/30 border border-white/10"
                                >
                                    <Send className="h-6 w-6 ml-1" />
                                </Button>
                            </motion.div>
                        </form>
                    </div>
                </div>
            )}

            <UserProfileDialog
                userId={selectedUserId}
                open={!!selectedUserId}
                onOpenChange={(open) => !open && setSelectedUserId(null)}
            />

            <style jsx global>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(200%); }
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
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
        </div >
    )
}
