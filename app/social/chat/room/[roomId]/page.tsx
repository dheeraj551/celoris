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
    Info
} from "lucide-react"
import { UserProfileDialog } from "@/components/social/UserProfileDialog"
import { AdUnit } from "@/components/AdUnit"

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

    const [isLoaded, setIsLoaded] = useState(false)
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

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
    }, [])

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
            .on('broadcast', { event: 'message' }, ({ payload }) => {
                console.log("Received message:", payload)
                setMessages((prev) => {
                    // Avoid duplicates if any
                    if (prev.some(m => m.id === payload.id)) return prev
                    return [...prev, payload as ChatMessage]
                })
            })
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                console.log("Presence sync:", state)

                const users: UserProfile[] = []
                let count = 0

                Object.values(state).forEach((presences: any) => {
                    // presences is an array of objects for a specific key (userId)
                    // We only need one profile per user key, but let's just grab the first one
                    const userPresence = presences[0]
                    if (userPresence && userPresence.user) {
                        users.push(userPresence.user)
                    }
                    count += 1 // Count unique keys (users)
                })

                setOnlineCount(users.length) // Use users.length to be accurate to profiles
                setOnlineUsers(users)
            })
            .subscribe(async (status) => {
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
    }, [isLoaded, user, roomId])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const sendMessage = async () => {
        if (!newMessage.trim() || !user || !channelRef.current) return

        const message: ChatMessage = {
            id: crypto.randomUUID(),
            sender: user,
            content: newMessage.trim(),
            timestamp: Date.now(),
            type: 'text'
        }

        // Broadcast the message
        await channelRef.current.send({
            type: 'broadcast',
            event: 'message',
            payload: message,
        })

        setNewMessage("")
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
                <div className="container mx-auto max-w-4xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => router.push('/social/chat')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => router.push('/social/chat')}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>

                        <div className={`h-10 w-10 rounded-full ${room.color} flex items-center justify-center text-white font-bold shadow-sm`}>
                            {room.title.charAt(0)}
                        </div>

                        <div>
                            <h1 className="font-bold text-slate-900 leading-tight">{room.title}</h1>
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                                    {onlineCount} online
                                </span>
                                <span>•</span>
                                <span>Public Room</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
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
                                            className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 p-2 rounded-lg transition-colors"
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

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto bg-slate-50 relative px-4">
                <div className="container mx-auto max-w-4xl py-6 space-y-6">

                    {/* Welome Message */}
                    <div className="text-center py-8">
                        <div className={`inline-flex items-center justify-center h-16 w-16 rounded-full ${room.color} bg-opacity-10 mb-4`}>
                            <Users className={`h-8 w-8 text-${room.color.replace('bg-', '')}-600`} />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900">Welcome to {room.title}!</h3>
                        <p className="text-slate-500 max-w-xs mx-auto mt-2 text-sm">
                            {room.description}
                            <br />
                            <span className="text-xs text-slate-400 mt-2 block flex items-center justify-center gap-1">
                                <Info className="h-3 w-3" /> Messages in this room are ephemeral.
                            </span>
                        </p>
                    </div>

                    {/* Sponsored Content / Ad */}
                    <AdUnit slot="9266909448" className="mb-4" />

                    {/* Messages List */}
                    {messages.map((msg, index) => {
                        const isMe = msg.sender.id === user.id
                        const showAvatar = index === 0 || messages[index - 1].sender.id !== msg.sender.id

                        return (
                            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                {/* Avatar */}
                                <div className={`flex-none w-8 ${!showAvatar ? 'invisible' : ''}`}>
                                    <Avatar className="h-8 w-8 ring-2 ring-white">
                                        <AvatarImage src={msg.sender.avatar_url} />
                                        <AvatarFallback>{msg.sender.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </div>

                                {/* Message Content */}
                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[75%]`}>
                                    {showAvatar && (
                                        <span className="text-xs text-slate-400 mb-1 ml-1">{msg.sender.name}</span>
                                    )}
                                    <div
                                        className={`px-4 py-2.5 rounded-2xl shadow-sm text-sm ${isMe
                                            ? `${room.color} text-white rounded-tr-sm`
                                            : 'bg-white text-slate-800 border border-slate-100 rounded-tl-sm'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                    <span className="text-[10px] text-slate-400 mt-1 px-1">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <div className="flex-none bg-white border-t border-slate-200 p-4">
                <div className="container mx-auto max-w-4xl">
                    <form
                        onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                        className="flex items-end gap-2"
                    >
                        <Button type="button" variant="ghost" size="icon" className="text-slate-400 rounded-full shrink-0">
                            <Paperclip className="h-5 w-5" />
                        </Button>

                        <div className="flex-1 bg-slate-100 rounded-2xl flex items-center px-4 py-2 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500 transition-all">
                            <Input
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="border-0 bg-transparent focus-visible:ring-0 px-0 h-auto py-1 text-slate-900 placeholder:text-slate-400"
                            />
                            <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600 rounded-full h-8 w-8 -mr-1">
                                <Smile className="h-5 w-5" />
                            </Button>
                        </div>

                        <Button
                            type="submit"
                            disabled={!newMessage.trim()}
                            className={`${room.color} hover:opacity-90 text-white rounded-full h-11 w-11 shrink-0 shadow-sm flex items-center justify-center p-0 transition-transform active:scale-95`}
                        >
                            <Send className="h-5 w-5 ml-0.5" />
                        </Button>
                    </form>
                </div>
            </div>
        </div >
    )
}
