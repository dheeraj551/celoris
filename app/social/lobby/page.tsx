
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
    ArrowRight
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
                    if (prev.some(m => m.id === payload.id)) return prev
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
                const users: UserProfile[] = []
                Object.values(state).forEach((presences: any) => {
                    const p = presences[0]
                    if (p?.user) users.push(p.user)
                })
                setOnlineUsers(users)
                setOnlineCount(users.length)

                if (users.length > prevOnlineCount.current) {
                    new Audio(JOIN_SOUND).play().catch(() => { })
                }
                prevOnlineCount.current = users.length
            })
            .subscribe(async (status) => {
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

                const rooms = Object.entries(roomsMap).map(([id, users]) => ({
                    id,
                    users
                })).sort((a, b) => a.id.localeCompare(b.id))

                setPrivateRoomsCount(rooms.length)
                setActivePrivateRooms(rooms)
            })
            .subscribe()

        return () => {
            channel.unsubscribe()
            tracker.unsubscribe()
        }
    }, [user, authLoading, router, toast])

    // --- EFFECT: Silence Breaker ---
    useEffect(() => {
        const checkSilence = async () => {
            const now = Date.now()
            const silenceDuration = now - lastActivityAt
            if (silenceDuration > 45000 && Math.random() < 0.05) {
                await triggerBot('silence')
                setLastActivityAt(now)
            }
        }
        const interval = setInterval(checkSilence, 10000)
        return () => clearInterval(interval)
    }, [lastActivityAt])

    // --- AUTO-SCROLL ---
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    // --- FUNCTIONS ---

    const triggerBot = async (type: 'response' | 'silence', sentMessage?: string) => {
        try {
            const history = messages.slice(-5)
            await fetch('/api/lobby/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: sentMessage,
                    history,
                    triggerType: type,
                    user: user
                })
            })
        } catch (e) {
            console.error("Bot trigger failed", e)
        }
    }

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
        triggerBot('response', msgContent)
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
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-indigo-200 rounded-full mb-4"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 flex flex-col bg-slate-50 z-40">
            {/* --- HEADER --- */}
            <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 px-4 py-3 shadow-sm flex items-center justify-between z-20">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/social/chat')} className="hover:bg-indigo-50">
                        <ArrowLeft className="h-5 w-5 text-indigo-600" />
                    </Button>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                            <Sparkles className="h-5 w-5" />
                        </div>
                        <div>
                            <h1 className="font-bold text-slate-800 text-lg leading-tight">Public Main Lobby</h1>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                                <span className="flex items-center gap-1.5">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                    </span>
                                    {onlineCount} Online
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    {/* Mobile Member List */}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="sm" className="lg:hidden flex items-center gap-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50">
                                <Users className="h-4 w-4" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-[300px]">
                            <SheetHeader>
                                <SheetTitle>Lobby Members ({onlineCount})</SheetTitle>
                            </SheetHeader>
                            <div className="mt-6 flex flex-col gap-3">
                                {onlineUsers.map(u => (
                                    <div key={u.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg transition-colors">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={u.avatar_url} />
                                                <AvatarFallback>{u.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium truncate">{u.name}</p>
                                            </div>
                                        </div>
                                        {u.id !== user.id && !u.is_bot && (
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-indigo-500" onClick={() => sendInvite(u)}>
                                                <MessageCircle className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </SheetContent>
                    </Sheet>
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600">
                        <MoreVertical className="h-5 w-5" />
                    </Button>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden relative">

                {/* --- CHAT AREA --- */}
                <div className="flex-1 flex flex-col relative overflow-hidden">
                    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                        <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-purple-200/30 rounded-full blur-3xl" />
                        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-200/30 rounded-full blur-3xl" />
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-6 z-10 scroll-smooth">
                        <div className="max-w-3xl mx-auto space-y-6">
                            <div className="text-center py-8 mb-8 backdrop-blur-sm bg-white/50 rounded-2xl border border-white/50 shadow-sm mx-4">
                                <div className="w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-lg shadow-indigo-200 rotate-3">
                                    <MessageCircle className="h-8 w-8 text-white" />
                                </div>
                                <h2 className="text-xl font-bold text-slate-800">Welcome to the Lobby!</h2>
                                <p className="text-slate-500 text-sm max-w-sm mx-auto mt-2">
                                    Jump into the conversation. Ask questions, share jokes, or just hang out.
                                    <br /> <span className="text-xs text-indigo-400 font-medium">✨ AI assistants are active to help.</span>
                                </p>
                            </div>

                            <div className="flex flex-col gap-4 pb-4">
                                {messages.map((msg, idx) => {
                                    const isMe = msg.sender.id === user.id;
                                    const isBot = msg.sender.is_bot;
                                    const showHeader = idx === 0 || messages[idx - 1].sender.id !== msg.sender.id;

                                    return (
                                        <motion.div
                                            key={msg.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                                        >
                                            <div className={`flex-none w-8 ${!showHeader ? 'invisible h-0' : ''}`}>
                                                <Avatar className="h-8 w-8 ring-2 ring-white shadow-sm">
                                                    <AvatarImage src={msg.sender.avatar_url} />
                                                    <AvatarFallback className={isBot ? "bg-indigo-100 text-indigo-700" : ""}>{msg.sender.name[0]}</AvatarFallback>
                                                </Avatar>
                                            </div>

                                            <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[80%]`}>
                                                {showHeader && (
                                                    <div className="flex items-center gap-2 mb-1 px-1">
                                                        <span className={`text-xs font-semibold ${isBot ? "text-indigo-600 flex items-center gap-1" : "text-slate-600"}`}>
                                                            {msg.sender.name}
                                                            {isBot && <Zap className="h-3 w-3 fill-indigo-100" />}
                                                        </span>
                                                        <span className="text-[10px] text-slate-400">
                                                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                )}

                                                <div
                                                    className={`px-4 py-2 text-sm shadow-sm
                                                        ${isMe
                                                            ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-2xl rounded-tr-none'
                                                            : isBot
                                                                ? 'bg-white border-none shadow-indigo-100 text-slate-800 rounded-2xl rounded-tl-none ring-1 ring-indigo-50'
                                                                : 'bg-white text-slate-800 rounded-2xl rounded-tl-none border border-slate-100'
                                                        }
                                                    `}
                                                >
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )
                                })}
                            </div>
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>

                {/* --- DESKTOP SIDEBAR --- */}
                <aside className="hidden lg:flex w-80 border-l border-slate-200 bg-white flex-col z-20">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                        <h2 className="font-bold text-slate-900 flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Private Rooms
                            <div className="ml-auto flex gap-1">
                                {[1, 2, 3, 4, 5].map(n => (
                                    <div key={n} className={`h-2 w-2 rounded-full ${activePrivateRooms[n - 1] ? 'bg-red-500' : 'bg-green-300'}`} />
                                ))}
                            </div>
                        </h2>
                        <p className="text-[11px] text-slate-500 mt-1">
                            Invite users below to a private 1-on-1 room.
                        </p>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        {/* Users List */}
                        {onlineUsers.map((u) => (
                            <div
                                key={u.id}
                                className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={u.avatar_url} />
                                            <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <span className="text-sm font-semibold text-slate-900 truncate max-w-[120px]">
                                            {u.name}
                                        </span>
                                        {u.id === user?.id && <span className="text-xs text-slate-400">You</span>}
                                    </div>
                                </div>

                                {u.id !== user?.id && !u.is_bot && (
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className="h-8 w-8 p-0 rounded-full hover:bg-green-100 hover:text-green-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => sendInvite(u)}
                                        disabled={privateRoomsCount >= 5}
                                        title="Invite to Private Room"
                                    >
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer Info */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 text-xs text-slate-400 text-center">
                        {onlineCount} users online • {privateRoomsCount} private rooms busy
                    </div>
                </aside>
            </div>

            {/* --- INPUT AREA --- */}
            <div className="bg-white px-4 py-3 border-t border-slate-100 z-20">
                <div className="max-w-3xl mx-auto flex items-center gap-3">
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`text-slate-400 hover:text-indigo-500 hover:bg-indigo-50 transition-colors ${showEmojiPicker ? 'text-indigo-500 bg-indigo-50' : ''}`}
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                            <Smile className="h-5 w-5" />
                        </Button>
                        <AnimatePresence>
                            {showEmojiPicker && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute bottom-12 left-0 shadow-xl rounded-2xl z-50"
                                >
                                    <EmojiPicker onEmojiClick={onEmojiClick} width={300} height={400} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    <div className="flex-1 relative">
                        <Input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                            placeholder="Type a message..."
                            className="bg-slate-50 border-slate-200 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 rounded-full pl-5 pr-12 h-11"
                        />
                        <Button
                            size="sm"
                            onClick={sendMessage}
                            disabled={!newMessage.trim()}
                            className="absolute right-1 top-1 h-9 w-9 rounded-full bg-indigo-600 hover:bg-indigo-700 p-0 shadow-sm"
                        >
                            <Send className="h-4 w-4 text-white" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Invite Dialog */}
            <Dialog open={!!incomingInvite} onOpenChange={(open) => !open && rejectInvite()}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <MessageCircle className="h-5 w-5 text-green-500" />
                            New Chat Invite
                        </DialogTitle>
                        <DialogDescription className="pt-2">
                            <span className="font-bold text-slate-900">{incomingInvite?.sender.name}</span> wants to start a private chat with you.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex items-center justify-center py-4">
                        <div className="relative">
                            <Avatar className="h-20 w-20 ring-4 ring-green-100">
                                <AvatarImage src={incomingInvite?.sender.avatar_url} />
                                <AvatarFallback>{incomingInvite?.sender.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="absolute -bottom-1 -right-1 bg-green-500 p-1.5 rounded-full border-4 border-white">
                                <Check className="h-4 w-4 text-white" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2 sm:justify-center">
                        <Button variant="outline" onClick={rejectInvite} className="w-full sm:w-auto">
                            Decline
                        </Button>
                        <Button onClick={acceptInvite} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
                            Accept & Join Room
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
