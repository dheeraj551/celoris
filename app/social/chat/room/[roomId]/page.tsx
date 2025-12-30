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
    ArrowRight
} from "lucide-react"
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
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react'

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

const ROOM_DETAILS: Record<string, { title: string, description: string, color: string }> = {
    "socialize": {
        title: "Socialize & Hangout",
        description: "Meet new people and make friends.",
        color: "bg-green-500"
    },
    "networking": {
        title: "Networking & Growth",
        description: "Professional networking and career discussions.",
        color: "bg-blue-500"
    },
    "tech-trends": {
        title: "Tech Trends Chat",
        description: "Everything about technology and innovation.",
        color: "bg-orange-500"
    }
}

export default function PublicRoomPage() {
    const params = useParams()
    const router = useRouter()
    const roomId = params.roomId as string
    const room = ROOM_DETAILS[roomId] || { title: "Unknown Room", description: "", color: "bg-slate-500" }

    const [user, setUser] = useState<any>(null)
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

    const [isLoaded, setIsLoaded] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

    // Invite & Private Room State
    const [incomingInvite, setIncomingInvite] = useState<any>(null)
    const [sentInvite, setSentInvite] = useState<any>(null)
    const [privateRoomsCount, setPrivateRoomsCount] = useState(0)
    const [activePrivateRooms, setActivePrivateRooms] = useState<{ id: string, users: UserProfile[] }[]>([])
    const { toast } = useToast()

    const isPrivate = roomId.startsWith('private-')

    useEffect(() => {
        // 1. Check Auth and Get User Profile
        const initUser = async () => {
            const supabase = createClient()
            const { data: { user: authUser } } = await supabase.auth.getUser()

            if (!authUser) {
                router.push('/login')
                return
            }

            const { data: profile } = await supabase
                .from('users')
                .select('full_name, profile_pic_url, verification_status')
                .eq('id', authUser.id)
                .single()

            const userProfile: UserProfile = {
                id: authUser.id,
                name: profile?.full_name || authUser.email?.split('@')[0] || 'Anonymous',
                avatar_url: profile?.profile_pic_url,
                is_verified: profile?.verification_status === 'verified'
            }

            setUser(userProfile)
            setIsLoaded(true)
        }

        initUser()
    }, [router])

    useEffect(() => {
        // Tracker for Global Rooms
        if (!isLoaded || !user) return

        const supabase = createClient()
        const trackerChannel = supabase.channel('global-rooms-tracker', {
            config: {
                presence: { key: user.id }
            }
        })

        trackerChannel
            .on('presence', { event: 'sync' }, () => {
                const state = trackerChannel.presenceState()
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
                })).sort((a, b) => a.id.localeCompare(b.id)) // Consistent order

                setPrivateRoomsCount(rooms.length)
                setActivePrivateRooms(rooms)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await trackerChannel.track({
                        user,
                        status: isPrivate ? 'busy' : 'available',
                        roomId: isPrivate ? roomId : null
                    })
                }
            })

        return () => {
            trackerChannel.unsubscribe()
        }
    }, [isLoaded, user, isPrivate])

    useEffect(() => {
        // 2. Join Room only after User is loaded
        if (!isLoaded || !user || !roomId) return

        const supabase = createClient()
        const channelName = `room:${roomId}`

        console.log(`Joining room: ${channelName} as ${user.name}`)

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
                console.log("Received message:", payload)
                setMessages((prev) => {
                    // Avoid duplicates if any
                    if (prev.some(m => m.id === payload.id)) return prev
                    if (payload.sender.id !== user.id) {
                        new Audio(MSG_SOUND).play().catch(() => { })
                    }
                    return [...prev, payload as ChatMessage]
                })
            })
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                console.log("Presence sync:", state)

                const users: UserProfile[] = []
                let count = 0

                Object.values(state).forEach((presences: any) => {
                    const userPresence = presences[0]
                    if (userPresence && userPresence.user) {
                        users.push(userPresence.user)
                    }
                    count += 1
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
            .subscribe(async (status: string) => {
                console.log(`Channel status: ${status}`)
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        user: user,
                        online_at: new Date().toISOString(),
                    })
                }
            })

        channelRef.current = channel

        return () => {
            console.log(`Leaving room: ${channelName}`)
            channel.unsubscribe()
            channelRef.current = null
        }
    }, [isLoaded, user, roomId, isPrivate, router, toast])

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

        // Broadcast the message
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

        // Validate file type
        if (!file.type.startsWith('image/')) {
            toast({
                title: "Invalid file type",
                description: "Please upload an image file.",
                variant: "destructive"
            })
            return
        }

        // Validate file size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Max file size is 5MB.",
                variant: "destructive"
            })
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
            toast({
                title: "Upload failed",
                description: "Could not upload image. Please try again.",
                variant: "destructive"
            })
        } finally {
            setIsUploading(false)
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const onEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage(prev => prev + emojiData.emoji)
        // Keep picker open or close it? Standard is often to keep open or close. User didn't specify. I'll NOT close it immediately to allow multiple emojis, but maybe better to keep focus.
        // Actually for simplicity, let's keep it open, but user can close via button.
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
        if (!incomingInvite || !channelRef.current) return

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
        if (!incomingInvite || !channelRef.current) return

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
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
                    <div className="h-4 w-32 bg-slate-200 rounded"></div>
                    <p className="text-slate-400 text-sm mt-2">Connecting to chat...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed top-16 left-0 right-0 bottom-0 flex flex-col bg-white z-30">
            {/* Header */}
            <header className="flex-none border-b border-slate-200 bg-white px-4 py-3 shadow-sm z-10">
                <div className="container mx-auto max-w-6xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => router.push('/social/chat')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>

                        <div className={`h-10 w-10 rounded-full ${isPrivate ? 'bg-purple-500' : room.color} flex items-center justify-center text-white font-bold shadow-sm`}>
                            {isPrivate ? 'P' : room.title.charAt(0)}
                        </div>

                        <div>
                            <h1 className="font-bold text-slate-900 leading-tight">
                                {isPrivate ? 'Private Chat' : room.title}
                            </h1>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    {isPrivate ? '2 users' : `${onlineCount} online`}
                                </span>
                                <span>•</span>
                                <span>{isPrivate ? 'Confidential' : 'Available for Chat'}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {!isPrivate && (
                            <div className="hidden sm:flex items-center gap-2 mr-4 px-3 py-1 bg-slate-100 rounded-full text-[10px] font-medium text-slate-600">
                                <span className="flex items-center gap-1">
                                    <MessageCircle className="h-3 w-3" />
                                    {privateRoomsCount}/5 Rooms Used
                                </span>
                            </div>
                        )}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 lg:hidden">
                                    <Users className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent>
                                <SheetHeader>
                                    <SheetTitle>Online Users ({onlineCount})</SheetTitle>
                                    <SheetDescription>
                                        Currently active people in this room.
                                    </SheetDescription>
                                </SheetHeader>
                                <div className="mt-6 flex flex-col gap-4">
                                    {onlineUsers.map((onlineUser) => (
                                        <div
                                            key={onlineUser.id}
                                            className="flex items-center justify-between group"
                                        >
                                            <div
                                                className="flex items-center gap-3 cursor-pointer flex-1"
                                                onClick={() => setSelectedUserId(onlineUser.id)}
                                            >
                                                <div className="relative">
                                                    <Avatar>
                                                        <AvatarImage src={onlineUser.avatar_url} />
                                                        <AvatarFallback>{onlineUser.name.charAt(0)}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-medium text-slate-900 leading-none">
                                                        {onlineUser.name}
                                                        {onlineUser.id === user?.id && " (You)"}
                                                    </span>
                                                    {onlineUser.is_verified && (
                                                        <span className="text-[10px] text-blue-500 font-medium mt-0.5">Verified</span>
                                                    )}
                                                </div>
                                            </div>
                                            {onlineUser.id !== user?.id && !isPrivate && (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    className="h-8 text-xs gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    onClick={() => sendInvite(onlineUser)}
                                                    disabled={privateRoomsCount >= 5}
                                                >
                                                    Invite <ArrowRight className="h-3 w-3" />
                                                </Button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </SheetContent>
                        </Sheet>
                        <UserProfileDialog
                            userId={selectedUserId}
                            open={!!selectedUserId}
                            onOpenChange={(open) => !open && setSelectedUserId(null)}
                        />
                        <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                            <MoreVertical className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Area with Sidebar */}
            <div className="flex-1 flex overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto bg-slate-50 relative px-4 text-center">
                    <div className="container mx-auto max-w-4xl py-6 space-y-6 text-left">

                        {/* Professional Ad Placement for Private Rooms */}
                        {isPrivate && (
                            <div className="mb-6 mx-auto max-w-2xl bg-white p-3 rounded-lg border border-slate-100 shadow-sm">
                                <div className="text-[10px] text-slate-400 font-medium tracking-wider uppercase mb-2 text-center">Sponsored</div>
                                <div className="min-h-[90px] flex items-center justify-center bg-slate-50 rounded">
                                    <AdUnit slot="9266909448" className="w-full" />
                                </div>
                            </div>
                        )}

                        {/* Welcome Message */}
                        <div className="text-center py-12">
                            <div className={`inline-flex items-center justify-center h-20 w-20 rounded-full ${isPrivate ? 'bg-purple-500' : room.color} bg-opacity-10 mb-6`}>
                                <Users className={`h-10 w-10 text-${isPrivate ? 'purple' : room.color.replace('bg-', '')}-600`} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">
                                {isPrivate ? 'Private Conversation' : `${room.title} Lobby`}
                            </h3>
                            <p className="text-slate-500 max-w-md mx-auto mt-4 text-base leading-relaxed">
                                {isPrivate
                                    ? 'This chat is private and temporary. Messages will vanish when you leave.'
                                    : 'You are now visible in the lobby. Other users can see you and invite you to a private 1-on-1 chat.'}
                            </p>
                            {!isPrivate && (
                                <div className="mt-8 flex flex-col items-center gap-4">
                                    <div className="flex -space-x-3 overflow-hidden p-2">
                                        {onlineUsers.slice(0, 5).map((u, i) => (
                                            <Avatar key={i} className="inline-block h-10 w-10 ring-2 ring-white">
                                                <AvatarImage src={u.avatar_url} />
                                                <AvatarFallback>{u.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        ))}
                                        {onlineCount > 5 && (
                                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-xs font-medium text-slate-600 ring-2 ring-white">
                                                +{onlineCount - 5}
                                            </div>
                                        )}
                                    </div>
                                    <p className="text-sm font-medium text-green-600 animate-pulse bg-green-50 px-4 py-1.5 rounded-full border border-green-100">
                                        {onlineCount} users are currently ready to chat
                                    </p>
                                    <p className="text-xs text-slate-400 mt-4 max-w-xs">
                                        To start a conversation, click on a user in the <strong>Online Lobby</strong> sidebar and send an invite.
                                    </p>

                                    {/* symbolic rooms display */}
                                    <div className="grid grid-cols-5 gap-3 mt-10 w-full max-w-2xl px-4">
                                        {[1, 2, 3, 4, 5].map((num) => {
                                            const roomSlot = activePrivateRooms[num - 1];
                                            const isOccupied = !!roomSlot;
                                            return (
                                                <div
                                                    key={num}
                                                    className={`relative flex flex-col items-center p-3 rounded-xl border-2 transition-all shadow-sm ${isOccupied
                                                        ? 'border-purple-200 bg-purple-50 scale-105 ring-4 ring-purple-500/10'
                                                        : 'border-slate-100 bg-white opacity-60'
                                                        }`}
                                                >
                                                    <span className={`text-[10px] uppercase font-black tracking-widest mb-3 ${isOccupied ? 'text-purple-600' : 'text-slate-400'}`}>
                                                        Room {num}
                                                    </span>

                                                    <div className="flex -space-x-2 mb-3">
                                                        {isOccupied ? (
                                                            roomSlot.users.map((u, i) => (
                                                                <Avatar key={i} className="h-8 w-8 ring-2 ring-white shadow-sm">
                                                                    <AvatarImage src={u.avatar_url} />
                                                                    <AvatarFallback className="text-[10px] bg-purple-100 text-purple-700 font-bold">
                                                                        {u.name.charAt(0)}
                                                                    </AvatarFallback>
                                                                </Avatar>
                                                            ))
                                                        ) : (
                                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center border border-dashed border-slate-300">
                                                                <Users className="h-4 w-4 text-slate-300" />
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className={`mt-auto px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${isOccupied ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-400'
                                                        }`}>
                                                        {isOccupied ? `${roomSlot.users.length} Active` : 'Available'}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Sponsored Content / Ad */}
                        {!isPrivate && <AdUnit slot="9266909448" className="mb-4" />}

                        {/* Messages List - Only visible in Private Rooms */}
                        {isPrivate ? (
                            messages.map((msg, index) => {
                                const isMe = msg.sender.id === user.id
                                const showAvatar = index === 0 || messages[index - 1].sender.id !== msg.sender.id

                                return (
                                    <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                        <div className={`flex-none w-8 ${!showAvatar ? 'invisible' : ''}`}>
                                            <Avatar className="h-8 w-8 ring-2 ring-white">
                                                <AvatarImage src={msg.sender.avatar_url} />
                                                <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                        </div>

                                        <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                            {showAvatar && (
                                                <span className="text-xs text-slate-400 mb-1 ml-1">{msg.sender.name}</span>
                                            )}
                                            <div
                                                className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${isMe
                                                    ? 'bg-purple-600 text-white rounded-tr-sm'
                                                    : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
                                                    }`}
                                            >
                                                {msg.type === 'image' ? (
                                                    <img
                                                        src={msg.content}
                                                        alt="Attachment"
                                                        className="max-w-full rounded-lg max-h-60 object-cover cursor-pointer hover:opacity-95 transition-opacity"
                                                        onClick={() => window.open(msg.content, '_blank')}
                                                    />
                                                ) : (
                                                    msg.content
                                                )}
                                            </div>
                                            <span className="text-[10px] text-slate-400 mt-1 px-1">
                                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            null
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Desktop Sidebar (Lobby) */}
                {!isPrivate && (
                    <aside className="hidden lg:flex w-80 border-l border-slate-200 flex-col bg-white">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                            <h2 className="font-bold text-slate-900 flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Online Lobby
                                <span className="ml-auto text-xs font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                                    {onlineCount}
                                </span>
                            </h2>
                            <p className="text-[11px] text-slate-500 mt-1">Invite anyone below for a private 1-on-1 chat.</p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {onlineUsers.map((onlineUser) => (
                                <div
                                    key={onlineUser.id}
                                    className="flex items-center justify-between group p-2 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100"
                                >
                                    <div
                                        className="flex items-center gap-3 cursor-pointer"
                                        onClick={() => setSelectedUserId(onlineUser.id)}
                                    >
                                        <div className="relative">
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={onlineUser.avatar_url} />
                                                <AvatarFallback>{onlineUser.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-900">
                                                {onlineUser.name}
                                                {onlineUser.id === user?.id && <span className="text-slate-400 font-normal"> (You)</span>}
                                            </span>
                                            {onlineUser.is_verified && (
                                                <span className="text-[10px] text-blue-500 font-medium">Verified User</span>
                                            )}
                                        </div>
                                    </div>
                                    {onlineUser.id !== user?.id && (
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-8 w-8 p-0 rounded-full hover:bg-green-100 hover:text-green-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => sendInvite(onlineUser)}
                                            disabled={privateRoomsCount >= 5}
                                            title={privateRoomsCount >= 5 ? "Rooms full" : "Invite to chat"}
                                        >
                                            <MessageCircle className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </div>
                        {privateRoomsCount >= 5 && (
                            <div className="p-4 bg-orange-50 border-t border-orange-100">
                                <p className="text-xs text-orange-700 flex items-center gap-2">
                                    <Info className="h-4 w-4" />
                                    All 5 private rooms are full. Please wait.
                                </p>
                            </div>
                        )}
                    </aside>
                )}
            </div>

            {/* Invite Dialog */}
            <Dialog open={!!incomingInvite} onOpenChange={(open) => !open && setIncomingInvite(null)}>
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
                    <DialogFooter className="sm:justify-between gap-2">
                        <Button
                            variant="outline"
                            onClick={rejectInvite}
                            className="flex-1 border-slate-200 hover:bg-slate-50 text-slate-600"
                        >
                            <X className="mr-2 h-4 w-4" />
                            Decline
                        </Button>
                        <Button
                            onClick={acceptInvite}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Accept
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Input Area - Only visible in Private Rooms */}
            {isPrivate && (
                <div className="flex-none bg-white border-t border-slate-200 p-4">
                    <div className="container mx-auto max-w-4xl">
                        <form
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                            className="flex items-end gap-2"
                        >
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-slate-400 rounded-full shrink-0"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                <Paperclip className={`h-5 w-5 ${isUploading ? 'animate-pulse text-purple-500' : ''}`} />
                            </Button>

                            <div className="flex-1 bg-slate-100 rounded-2xl flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 transition-all">
                                <Input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="border-0 bg-transparent focus-visible:ring-0 px-0 h-auto py-1 text-slate-900 placeholder:text-slate-400"
                                />
                                <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 rounded-full h-8 w-8 -mr-1" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                                    <Smile className="h-5 w-5" />
                                </Button>
                                {showEmojiPicker && (
                                    <div className="absolute bottom-16 right-0 z-50">
                                        <EmojiPicker onEmojiClick={onEmojiClick} />
                                    </div>
                                )}
                            </div>

                            <Button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="bg-purple-600 hover:opacity-90 text-white rounded-full h-11 w-11 shrink-0 shadow-sm flex items-center justify-center p-0 transition-transform active:scale-95"
                            >
                                <Send className="h-5 w-5 ml-0.5" />
                            </Button>
                        </form>
                    </div>
                </div>
            )}
        </div >
    )
}
