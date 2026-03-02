"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import {
    Send,
    Users,
    MoreVertical,
    Smile,
    ArrowLeft,
    Sparkles,
    Zap,
    MessageCircle,
    Check,
    Info,
    ArrowRight,
    Lock
} from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/providers/AuthProvider"
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'
import { motion, AnimatePresence } from "framer-motion"
import { PageWrapper } from "@/components/PageWrapper"

// --- AUDIO ASSETS ---
const MSG_SOUND = "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
const JOIN_SOUND = "https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3"

interface UserProfile {
    id: string
    name: string
    avatar_url?: string
    is_verified?: boolean
    is_bot?: boolean
}

interface ChatMessage {
    id: string
    sender: UserProfile
    content: string
    timestamp: number
    type: 'text' | 'image'
}

export default function GlobalLobbyPage() {
    const router = useRouter()
    const { toast } = useToast()
    const { user: authUser, profile: userProfileData, loading: authLoading } = useAuth()

    const user = useMemo<UserProfile | null>(() => {
        if (!authUser) return null
        return {
            id: authUser.id,
            name: userProfileData?.full_name || authUser.email?.split('@')[0] || 'Anonymous',
            avatar_url: userProfileData?.profile_pic_url,
            is_verified: userProfileData?.verification_status === 'verified',
            is_bot: false
        }
    }, [authUser, userProfileData])

    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [onlineCount, setOnlineCount] = useState(1)
    const [onlineUsers, setOnlineUsers] = useState<UserProfile[]>([])
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [lastActivityAt, setLastActivityAt] = useState<number>(Date.now())

    // Private Room State
    const [incomingInvite, setIncomingInvite] = useState<any>(null)
    const [sentInvite, setSentInvite] = useState<any>(null)
    const [activePrivateRooms, setActivePrivateRooms] = useState<{ id: string, users: UserProfile[] }[]>([])
    const [privateRoomsCount, setPrivateRoomsCount] = useState(0)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const channelRef = useRef<any>(null)
    const prevOnlineCount = useRef<number>(0)

    // --- EFFECT: Connection & Realtime ---
    useEffect(() => {
        if (authLoading) return
        if (!user) {
            router.push('/login')
            return
        }

        const supabase = createClient()

        // 1. Join Global Lobby & Private Invite System
        const channel = supabase.channel('room:lobby', {
            config: {
                presence: { key: user.id },
                broadcast: { self: true }
            }
        })

        channel
            .on('broadcast', { event: 'message' }, ({ payload }: { payload: ChatMessage }) => {
                setMessages((prev) => {
                    if (prev.some((m: ChatMessage) => m.id === payload.id)) return prev
                    if (payload.sender.id !== user.id) {
                        new Audio(MSG_SOUND).play().catch(() => { })
                    }
                    return [...prev, payload]
                })
                setLastActivityAt(Date.now())
            })
            // Invite Events
            .on('broadcast', { event: 'chat-invite' }, ({ payload }: { payload: any }) => {
                if (payload.targetUserId === user.id) {
                    setIncomingInvite(payload)
                    new Audio(JOIN_SOUND).play().catch(() => { })
                }
            })
            .on('broadcast', { event: 'chat-invite-accepted' }, ({ payload }: { payload: any }) => {
                if (payload.senderUserId === user.id) {
                    toast({
                        title: "Invite Accepted!",
                        description: "Joining private room...",
                    })
                    router.push(`/social/chat/room/${payload.roomId}`)
                }
            })
            .on('broadcast', { event: 'chat-invite-rejected' }, ({ payload }: { payload: any }) => {
                if (payload.senderUserId === user.id) {
                    setSentInvite(null)
                    toast({
                        title: "Invite Declined",
                        description: `${payload.targetName} declined your invite.`,
                        variant: "destructive"
                    })
                }
            })
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                const newUsers: UserProfile[] = []

                // Add Real Users
                Object.values(state).forEach((presences: any) => {
                    presences.forEach((p: any) => {
                        if (p.user) newUsers.push(p.user)
                    })
                })

                setOnlineUsers(newUsers)
                setOnlineCount(newUsers.length)

                // Play sound for new real users joining
                if (newUsers.length > prevOnlineCount.current) {
                    new Audio(JOIN_SOUND).play().catch(() => { })
                }
                prevOnlineCount.current = newUsers.length
            })
            .subscribe(async (status: any) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        user: user,
                        online_at: new Date().toISOString()
                    })
                }
            })

        channelRef.current = channel

        // 2. Track Private Room Occupancy
        const tracker = supabase.channel('global-rooms-tracker')
        tracker
            .on('presence', { event: 'sync' }, () => {
                const state = tracker.presenceState()
                const roomsMap: Record<string, UserProfile[]> = {}

                Object.values(state).forEach((presences: any) => {
                    const presence = presences[0]
                    // If user is 'busy' in a private room
                    if (presence?.roomId && presence.roomId.startsWith('private-')) {
                        if (!roomsMap[presence.roomId]) roomsMap[presence.roomId] = []
                        roomsMap[presence.roomId].push(presence.user)
                    }
                })

                const rooms = Object.entries(roomsMap).map(([id, users]: [string, UserProfile[]]) => ({
                    id,
                    users
                })).sort((a: any, b: any) => a.id.localeCompare(b.id))

                setPrivateRoomsCount(rooms.length)
                setActivePrivateRooms(rooms)
            })
            .subscribe()

        return () => {
            channel.unsubscribe()
            tracker.unsubscribe()
        }
    }, [user?.id, authLoading, router, toast])

    // --- AUTO-SCROLL ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // --- FUNCTIONS ---

    const sendMessage = async () => {
        if (!newMessage.trim() || !user || !channelRef.current) return
        const msgContent = newMessage.trim()
        const message: ChatMessage = {
            id: crypto.randomUUID(),
            sender: user,
            content: msgContent,
            timestamp: Date.now(),
            type: 'text'
        }
        await channelRef.current.send({
            type: 'broadcast',
            event: 'message',
            payload: message,
        })
        setNewMessage("")
        setShowEmojiPicker(false)
        setLastActivityAt(Date.now())
    }

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage(prev => prev + emojiData.emoji)
    }

    const sendInvite = async (targetUser: UserProfile) => {
        if (privateRoomsCount >= 5) {
            toast({
                title: "Rooms Full",
                description: "All private rooms are currently occupied. Please wait.",
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
            title: "Invite Sent",
            description: `Waiting for ${targetUser.name} to accept...`,
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

    if (authLoading || !user) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#050810]">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-emerald-500/20 rounded-full mb-4"></div>
                    <div className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Loading Lobby...</div>
                </div>
            </div>
        )
    }

    return (
        <PageWrapper className="fixed inset-0 flex flex-col bg-[#050810] z-40 text-white font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity }}
                    className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-600/20 rounded-full blur-[120px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.05, 0.1, 0.05]
                    }}
                    transition={{ duration: 15, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px]"
                />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay"></div>
            </div>

            {/* --- HEADER --- */}
            <header className="bg-[#0d1321]/60 backdrop-blur-2xl border-b border-white/5 px-6 py-4 flex items-center justify-between z-20 relative shadow-2xl">
                <div className="flex items-center gap-6">
                    <motion.div whileHover={{ x: -2 }}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push('/social/chat')}
                            className="bg-white/5 hover:bg-white/10 rounded-xl"
                        >
                            <ArrowLeft className="h-5 w-5 text-slate-400" />
                        </Button>
                    </motion.div>
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-600 to-indigo-600 flex items-center justify-center text-white shadow-xl shadow-emerald-500/20 italic font-black">
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h1 className="font-black text-xl tracking-tighter uppercase italic">Public Chat Lobby</h1>
                            <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
                                <span className="flex items-center gap-2">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                    </span>
                                    {onlineCount} People Online
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-2 border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 rounded-xl">
                                <Users className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[300px] bg-[#0d1321] border-white/5 text-white">
                            <SheetHeader>
                                <SheetTitle className="text-white font-black uppercase tracking-tight italic">Online Now ({onlineCount})</SheetTitle>
                            </SheetHeader>
                            <div className="mt-8 space-y-2">
                                {onlineUsers.map(u => (
                                    <motion.div
                                        key={u.id}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center justify-between p-3 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 transition-all group"
                                    >
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <Avatar className="h-9 w-9 rounded-xl border border-white/10 shadow-lg">
                                                <AvatarImage src={u.avatar_url} />
                                                <AvatarFallback className="bg-slate-800 font-black">{u.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="text-sm font-black uppercase italic truncate">{u.name}</p>
                                            </div>
                                        </div>
                                        {u.id !== user.id && (
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-emerald-400 hover:text-emerald-300 rounded-lg" onClick={() => sendInvite(u)}>
                                                <MessageCircle className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-white rounded-xl">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">
                {/* --- CHAT AREA --- */}
                <div className="flex-1 flex flex-col relative overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-6 py-10 z-10 scroll-smooth custom-scrollbar">
                        <div className="max-w-4xl mx-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center py-12 mb-12 backdrop-blur-3xl bg-white/5 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-emerald-600/5 pointer-events-none" />
                                <div className="w-20 h-20 bg-gradient-to-tr from-emerald-600 to-indigo-700 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500 italic font-black">
                                    <MessageCircle className="h-10 w-10 text-white" />
                                </div>
                                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Public Group Chat</h2>
                                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] max-w-sm mx-auto mt-4 leading-relaxed">
                                    Chat with creators and professionals from around the world. <br />
                                    Share ideas and grow your community.
                                </p>
                            </motion.div>

                            <div className="space-y-6 pb-6">
                                <AnimatePresence initial={false}>
                                    {messages.map((msg, idx) => {
                                        const isMe = msg.sender.id === user.id;
                                        const showHeader = idx === 0 || messages[idx - 1].sender.id !== msg.sender.id;

                                        return (
                                            <motion.div
                                                key={msg.id}
                                                initial={{ opacity: 0, x: isMe ? 20 : -20, scale: 0.95 }}
                                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                                className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}
                                            >
                                                <div className={`flex-none w-10 ${!showHeader ? 'invisible h-0' : ''}`}>
                                                    <Avatar className="h-10 w-10 rounded-xl border border-white/10 shadow-2xl ring-4 ring-white/5">
                                                        <AvatarImage src={msg.sender.avatar_url} />
                                                        <AvatarFallback className="bg-slate-800 font-black">{msg.sender.name[0]}</AvatarFallback>
                                                    </Avatar>
                                                </div>

                                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                                    {showHeader && (
                                                        <div className="flex items-center gap-3 mb-2 px-2">
                                                            <span className="text-[10px] font-black text-slate-300 uppercase italic tracking-wider">
                                                                {msg.sender.name}
                                                            </span>
                                                            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest opacity-50">
                                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                    )}

                                                    <div
                                                        className={`px-6 py-3.5 text-sm shadow-2xl font-medium tracking-tight
                                                            ${isMe
                                                                ? 'bg-emerald-600 text-white rounded-[1.5rem] rounded-tr-none'
                                                                : 'bg-white/5 border border-white/10 backdrop-blur-xl text-slate-200 rounded-[1.5rem] rounded-tl-none'
                                                            }
                                                        `}
                                                    >
                                                        {msg.content}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            </div>
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>

                {/* --- DESKTOP SIDEBAR --- */}
                <aside className="hidden lg:flex w-[380px] border-l border-white/5 bg-[#0d1321]/40 backdrop-blur-3xl flex-col z-20 relative">
                    <div className="p-8 border-b border-white/5 bg-white/5">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="font-black text-sm uppercase italic tracking-tighter flex items-center gap-3">
                                <Users className="h-5 w-5 text-emerald-500" />
                                Private Chat Rooms
                            </h2>
                            <div className="flex gap-1.5">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <motion.div
                                        key={n}
                                        animate={{ opacity: activePrivateRooms[n - 1] ? [1, 0.5, 1] : 0.3 }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className={`h-2.5 w-2.5 rounded-full ${activePrivateRooms[n - 1] ? 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]'}`}
                                    />
                                ))}
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-relaxed">
                            Start a private chat with anyone online. There are 5 private rooms available right now.
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 space-y-3 custom-scrollbar">
                        {onlineUsers.map((u) => (
                            <motion.div
                                key={u.id}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ scale: 1.02, x: -4 }}
                                className="flex items-center justify-between group p-4 bg-white/5 border border-white/5 rounded-3xl transition-all cursor-pointer hover:bg-white/10 hover:border-white/10"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <Avatar className="h-12 w-12 rounded-2xl border border-white/10 shadow-xl">
                                            <AvatarImage src={u.avatar_url} />
                                            <AvatarFallback className="bg-slate-800 font-black">{u.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-4 border-[#0d1321] shadow-lg shadow-emerald-500/20" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-black text-white uppercase italic truncate max-w-[140px]">
                                            {u.name}
                                        </span>
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
                                            {u.id === user?.id ? 'You' : 'Online'}
                                        </span>
                                    </div>
                                </div>

                                {u.id !== user?.id && (
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className="h-10 w-10 rounded-xl border-white/10 bg-white/5 hover:bg-emerald-600 hover:border-emerald-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                        onClick={() => sendInvite(u)}
                                        disabled={privateRoomsCount >= 5}
                                    >
                                        <Lock className="h-4 w-4" />
                                    </Button>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-6 bg-white/5 border-t border-white/5 text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] text-center italic">
                        {onlineCount} PEOPLE ONLINE • {privateRoomsCount}/5 ROOMS BUSY
                    </div>
                </aside>
            </div>

            {/* --- INPUT AREA --- */}
            <div className="bg-[#0d1321]/80 backdrop-blur-3xl px-8 py-6 border-t border-white/5 z-20 relative">
                <div className="max-w-4xl mx-auto flex items-center gap-6">
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`text-slate-500 hover:text-emerald-400 hover:bg-white/5 rounded-2xl h-14 w-14 transition-all ${showEmojiPicker ? 'text-emerald-400 bg-white/5' : ''}`}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <Smile size={28} />
                        </Button>
                        <AnimatePresence>
                            {showEmojiPicker && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                    className="absolute bottom-20 left-0 shadow-[0_32px_64px_rgba(0,0,0,0.5)] rounded-3xl z-50 overflow-hidden border border-white/10"
                                >
                                    <EmojiPicker theme={'dark' as any} onEmojiClick={onEmojiClick} width={320} height={400} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex-1 relative group">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type a message..."
                            className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-emerald-500/50 text-white placeholder:text-slate-600 rounded-[2rem] pl-8 pr-16 h-14 font-medium tracking-tight shadow-inner transition-all"
                        />
                        <Button
                            size="icon"
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className="absolute right-2 top-2 h-10 w-10 rounded-2xl bg-emerald-600 hover:bg-emerald-500 p-0 shadow-2xl shadow-emerald-500/20 disabled:bg-slate-800 disabled:opacity-50 transition-all active:scale-95"
                        >
                            <Send className="h-5 w-5 text-white" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Invite Dialog */}
            <Dialog open={!!incomingInvite} onOpenChange={(open) => !open && rejectInvite()}>
                <DialogContent className="max-w-md bg-[#0d1321] border-white/10 text-white rounded-[3rem] p-10 shadow-[0_32px_120px_rgba(0,0,0,0.8)] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-emerald-600/10 pointer-events-none" />
                    <DialogHeader className="relative z-10 text-center space-y-4">
                        <div className="w-20 h-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-emerald-500/20 italic font-black">
                            <Lock size={36} />
                        </div>
                        <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter">Chat Invitation</DialogTitle>
                        <DialogDescription className="text-slate-400 font-medium pt-2">
                            <span className="font-black text-emerald-400 uppercase italic">[{incomingInvite?.sender.name}]</span> wants to start a private chat with you.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex items-center justify-center py-10 relative z-10">
                        <div className="relative">
                            <Avatar className="h-24 w-24 rounded-[2rem] border-4 border-emerald-500/20 shadow-2xl ring-8 ring-emerald-500/5">
                                <AvatarImage src={incomingInvite?.sender.avatar_url} />
                                <AvatarFallback className="bg-slate-800 font-black text-2xl">{incomingInvite?.sender.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="absolute -bottom-2 -right-2 bg-emerald-500 p-2 rounded-xl border-4 border-[#0d1321] shadow-xl"
                            >
                                <Check className="h-5 w-5 text-white stroke-[3px]" />
                            </motion.div>
                        </div>
                    </div>

                    <DialogFooter className="flex flex-col sm:flex-row gap-4 relative z-10">
                        <Button variant="outline" onClick={rejectInvite} className="w-full h-14 rounded-2xl border-white/10 bg-white/5 text-slate-300 font-black uppercase tracking-widest text-[10px] hover:bg-white/10">
                            Decline
                        </Button>
                        <Button onClick={acceptInvite} className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/20">
                            Accept
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </PageWrapper>
    )
}
