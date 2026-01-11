"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Mic, MicOff, Video, VideoOff, PhoneOff, Hand, Users,
    MessageSquare, Send, Shield, ShieldAlert, Sparkles, LayoutGrid, AlertCircle
} from 'lucide-react'
import AgoraRTC, {
    IAgoraRTCClient, ICameraVideoTrack, IMicrophoneAudioTrack,
    IRemoteVideoTrack, IRemoteAudioTrack
} from 'agora-rtc-sdk-ng'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/ui/use-toast'

// --- Types ---
type UserRole = 'host' | 'audience' | 'speaker'

interface RoomUser {
    uid: string
    name: string
    avatarUrl?: string
    role: UserRole
    isHandRaised: boolean
    isMuted: boolean
}

interface ChatMessage {
    id: string
    senderId: string
    senderName: string
    content: string
    timestamp: number
}

// --- Constants ---
const ROOM_CHANNEL = 'classroom_general'

// Agora Client (singleton)
let client: IAgoraRTCClient

export default function GeneralHubPage() {
    const router = useRouter()
    const { toast } = useToast()

    // --- State ---
    const [mounted, setMounted] = useState(false)

    // User & Connection
    const [currentUser, setCurrentUser] = useState<any>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [userRole, setUserRole] = useState<UserRole>('audience')

    // Media Tracks
    const [localAudioTrack, setLocalAudioTrack] = useState<IMicrophoneAudioTrack | null>(null)
    const [localVideoTrack, setLocalVideoTrack] = useState<ICameraVideoTrack | null>(null)

    // Room State
    const [remoteUsers, setRemoteUsers] = useState<any[]>([])
    const [handRaised, setHandRaised] = useState(false)

    // Controls
    const [isMicOn, setIsMicOn] = useState(false)
    const [isCamOn, setIsCamOn] = useState(false)
    const [showChat, setShowChat] = useState(true)
    const [showParticipants, setShowParticipants] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState<any[]>([])

    // Chat & Realtime
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [newMessage, setNewMessage] = useState('')
    const channelRef = useRef<any>(null) // Supabase Channel
    const chatEndRef = useRef<HTMLDivElement>(null)

    // --- Effects ---

    useEffect(() => {
        setMounted(true)
        initializeUser()

        return () => {
            leaveRoom()
            if (channelRef.current) {
                channelRef.current.unsubscribe()
            }
        }
    }, [])

    useEffect(() => {
        if (chatEndRef.current) {
            chatEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, showChat])

    // --- Initialization ---

    const initializeUser = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()

        if (!user) {
            // Guest fallback
            const guestId = `guest_${Math.floor(Math.random() * 1000)}`
            setCurrentUser({ id: guestId, email: 'guest@celoris.com', user_metadata: { full_name: 'Guest User' } })
        } else {
            setCurrentUser(user)
        }
    }

    // --- Realtime (Supabase) ---

    const initRealtime = async (role: UserRole) => {
        const supabase = createClient()
        const channel = supabase.channel(`room:${ROOM_CHANNEL}`, {
            config: {
                broadcast: { self: true },
                presence: { key: currentUser?.id }
            }
        })

        channel
            .on('broadcast', { event: 'chat-message' }, ({ payload }) => {
                setMessages(prev => [...prev, payload])
            })
            .on('broadcast', { event: 'raise-hand' }, ({ payload }) => {
                if (role === 'host') {
                    toast({
                        title: "✋ Hand Raised",
                        description: `${payload.userName} wants to speak.`,
                        action: (
                            <Button size="sm" onClick={() => promoteToSpeaker(payload.userId)}>
                                Allow
                            </Button>
                        )
                    })
                }
            })
            .on('broadcast', { event: 'promote-user' }, async ({ payload }) => {
                if (payload.userId === currentUser?.id) {
                    toast({ title: "🎤 You're Live!", description: "The teacher has enabled your microphone." })
                    await promoteSelfToSpeaker()
                }
            })
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                const users = Object.values(state).flat()
                setOnlineUsers(users)
            })
            .on('presence', { event: 'join' }, ({ newPresences }) => {
                // Optional: show join notifications
            })
            .on('presence', { event: 'leave' }, ({ leftPresences }) => {
                // Optional: show leave notifications
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        id: currentUser?.id,
                        name: currentUser?.user_metadata?.full_name || 'Guest User',
                        avatar_url: currentUser?.user_metadata?.avatar_url,
                        role: role
                    })
                }
            })

        channelRef.current = channel
    }

    // --- Actions (Realtime) ---

    const sendMessage = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (!newMessage.trim() || !channelRef.current) return

        const msg = {
            id: Date.now().toString(),
            senderId: currentUser?.id,
            senderName: currentUser?.user_metadata?.full_name || 'User',
            content: newMessage,
            timestamp: Date.now()
        }

        await channelRef.current.send({
            type: 'broadcast',
            event: 'chat-message',
            payload: msg
        })

        setNewMessage('')
    } // Note: Broadcast with self:true will trigger the listener to update local state

    const raiseHand = async () => {
        setHandRaised(!handRaised)
        if (!channelRef.current) return

        if (!handRaised) {
            await channelRef.current.send({
                type: 'broadcast',
                event: 'raise-hand',
                payload: {
                    userId: currentUser?.id,
                    userName: currentUser?.user_metadata?.full_name || 'Student'
                }
            })
            toast({ title: "Hand Raised", description: "Waiting for approval..." })
        }
    }

    const promoteToSpeaker = async (targetUserId: string) => {
        if (!channelRef.current) return
        await channelRef.current.send({
            type: 'broadcast',
            event: 'promote-user',
            payload: { userId: targetUserId }
        })
    }

    const promoteSelfToSpeaker = async () => {
        if (!client) return
        await client.setClientRole('host')
        setUserRole('speaker')
        await publishTracks()
    }

    // --- Agora Logic ---

    const initAgora = async (selectedRole: UserRole) => {
        if (!client) {
            client = AgoraRTC.createClient({ mode: 'live', codec: 'vp8' })
        }

        // Event Listeners
        client.on('user-published', handleUserPublished)
        client.on('user-unpublished', handleUserUnpublished)

        try {
            const uid = currentUser?.id || `user_${Math.floor(Math.random() * 10000)}`

            const tokenRes = await fetch('/api/agora/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    channelName: ROOM_CHANNEL,
                    uid: uid,
                    role: 'publisher' // Only asking for permission to publish potentially
                })
            })

            const { token, appId } = await tokenRes.json()

            if (!token) throw new Error("Failed to get token")

            await client.join(appId, ROOM_CHANNEL, token, uid)

            // Initial Role
            const agoraRole = selectedRole === 'host' ? 'host' : 'audience'
            await client.setClientRole(agoraRole)

            setUserRole(selectedRole)
            setIsConnected(true)

            // Realtime
            await initRealtime(selectedRole)

            if (selectedRole === 'host') {
                publishTracks()
            }

        } catch (err: any) {
            console.error("Agora Init Error:", err)
            toast({ title: "Connection Failed", description: err.message, variant: "destructive" })
        }
    }

    const publishTracks = async () => {
        try {
            const [mic, cam] = await AgoraRTC.createMicrophoneAndCameraTracks()
            setLocalAudioTrack(mic)
            setLocalVideoTrack(cam)
            setIsMicOn(true)
            setIsCamOn(true)

            await client.publish([mic, cam])
        } catch (err) {
            console.error("Publish Error:", err)
            toast({ title: "Media Error", description: "Check permissions.", variant: "destructive" })
        }
    }

    const leaveRoom = async () => {
        localAudioTrack?.close()
        localVideoTrack?.close()
        setLocalAudioTrack(null)
        setLocalVideoTrack(null)

        if (client) {
            await client.leave()
        }
        setIsConnected(false)
        setUserRole('audience')
        setRemoteUsers([])
        if (channelRef.current) channelRef.current.unsubscribe()
    }

    // --- Agora Events ---

    const handleUserPublished = async (user: any, mediaType: 'audio' | 'video') => {
        await client.subscribe(user, mediaType)
        if (mediaType === 'video') {
            setRemoteUsers(prev => {
                const exists = prev.find(u => u.uid === user.uid)
                if (exists) return prev
                return [...prev, user]
            })
        }
        if (mediaType === 'audio') {
            user.audioTrack?.play()
        }
    }

    const handleUserUnpublished = (user: any, mediaType: 'audio' | 'video') => {
        if (mediaType === 'video') {
            setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid))
        }
    }

    // --- Controls ---

    const toggleMic = async () => {
        if (localAudioTrack) {
            await localAudioTrack.setEnabled(!isMicOn)
            setIsMicOn(!isMicOn)
        }
    }

    const toggleCam = async () => {
        if (localVideoTrack) {
            await localVideoTrack.setEnabled(!isCamOn)
            setIsCamOn(!isCamOn)
        }
    }

    // --- Render ---

    if (!mounted) return <div className="bg-[#050810] min-h-screen" />

    if (!isConnected) {
        return (
            <div className="min-h-screen bg-[#050810] flex items-center justify-center p-4">
                <Card className="w-full max-w-md bg-[#0d1321]/80 backdrop-blur-xl border-white/10 p-8 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-8 h-8 text-emerald-400 animate-pulse" />
                        </div>
                        <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-2">General Hub</h1>
                        <p className="text-slate-400 font-medium">Join the live collaborative study session.</p>
                    </div>

                    <div className="space-y-4">
                        <Button
                            className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-xl transition-all hover:scale-[1.02]"
                            onClick={() => initAgora('audience')}
                        >
                            Join as Student
                        </Button>

                        <div className="relative py-4">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                            <div className="relative flex justify-center text-xs uppercase"><span className="bg-[#0d1321] px-2 text-slate-500 font-bold">Or</span></div>
                        </div>

                        <Button
                            variant="outline"
                            className="w-full h-14 border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white font-black uppercase tracking-widest text-xs rounded-xl"
                            onClick={() => initAgora('host')}
                        >
                            <Shield className="w-4 h-4 mr-2 text-amber-400" />
                            Join as Teacher (Host)
                        </Button>
                    </div>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#050810] relative text-white flex flex-col overflow-hidden">

            {/* Top Bar */}
            <header className="h-16 border-b border-white/5 bg-[#0d1321]/50 backdrop-blur-md flex items-center justify-between px-6 z-20">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white" onClick={leaveRoom}>
                        <PhoneOff className="w-5 h-5 text-red-500" />
                    </Button>
                    <div>
                        <h2 className="font-black italic uppercase tracking-tighter text-lg flex items-center gap-2">
                            General Hub
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                        </h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/5 text-xs font-bold transition-all ${showParticipants ? 'bg-white/10 text-white' : 'bg-white/5 text-slate-400'}`}
                        onClick={() => {
                            setShowParticipants(!showParticipants)
                            if (showChat && !showParticipants) setShowChat(false)
                        }}
                    >
                        <Users className="w-3 h-3" />
                        <span>{onlineUsers.length} Online</span>
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`${showChat ? 'bg-white/10 text-white' : 'text-slate-400'}`}
                        onClick={() => {
                            setShowChat(!showChat)
                            if (showParticipants && !showChat) setShowParticipants(false)
                        }}
                    >
                        <MessageSquare className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            {/* Main Stage */}
            <main className="flex-1 flex overflow-hidden">

                {/* Stage / Video Area */}
                <div className="flex-1 p-4 flex flex-col gap-4 relative">

                    {/* Active Speakers Grid */}
                    <div className={`grid gap-4 w-full h-full transition-all ${remoteUsers.length === 0 && userRole === 'audience' ? 'place-items-center' :
                        'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        }`}>

                        {/* If I am Host/Speaker, show my video */}
                        {(userRole === 'host' || userRole === 'speaker') && (
                            <div className="relative aspect-video bg-neutral-900 rounded-2xl overflow-hidden border border-emerald-500/30 shadow-2xl group">
                                <div ref={node => { if (node) localVideoTrack?.play(node) }} className="w-full h-full object-cover transform scale-x-[-1]" />

                                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                                    <Shield className="w-3 h-3 text-emerald-400" />
                                    You ({userRole})
                                </div>

                                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 border border-white/10" onClick={toggleMic}>
                                        {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-red-400" />}
                                    </Button>
                                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-black/50 hover:bg-black/70 border border-white/10" onClick={toggleCam}>
                                        {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4 text-red-400" />}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Remote Host/Speakers */}
                        {remoteUsers.map(user => (
                            <div key={user.uid} className="relative aspect-video bg-neutral-900 rounded-2xl overflow-hidden border border-white/5 shadow-xl">
                                <RemoteVideoTrack track={user.videoTrack} />
                                <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-2">
                                    <Mic className="w-3 h-3 text-blue-400" />
                                    Speaker {user.uid}
                                </div>
                            </div>
                        ))}

                        {/* Empty State */}
                        {remoteUsers.length === 0 && userRole === 'audience' && (
                            <div className="text-center space-y-4">
                                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto animate-pulse">
                                    <LayoutGrid className="w-10 h-10 text-slate-600" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-300">Classroom is Quiet</h3>
                                <p className="text-slate-500 text-sm">Waiting for the teacher to join the stage...</p>
                            </div>
                        )}
                    </div>

                    {/* Action Bar (Student) */}
                    {userRole === 'audience' && (
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-[#0d1321]/90 backdrop-blur-xl p-2 rounded-2xl border border-white/10 shadow-2xl z-30">
                            <Button
                                variant={handRaised ? "secondary" : "default"}
                                onClick={raiseHand}
                                className={`h-12 w-12 rounded-xl transition-all ${handRaised ? 'bg-amber-500/20 text-amber-500 hover:bg-amber-500/30' : 'bg-white/5 hover:bg-white/10'}`}
                            >
                                <Hand className={`w-6 h-6 ${handRaised ? 'fill-current' : ''}`} />
                            </Button>
                            {handRaised && <span className="text-xs font-bold text-amber-500 pr-3 animate-pulse">Requesting to Speak...</span>}
                        </div>
                    )}

                </div>

                {/* Chat & Participants Sidebar */}
                <AnimatePresence mode="wait">
                    {showChat && (
                        <motion.aside
                            key="chat"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 320, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="border-l border-white/5 bg-[#0d1321]/80 backdrop-blur-xl flex flex-col z-20"
                        >
                            <div className="p-4 border-b border-white/5 font-bold text-sm tracking-widest uppercase text-slate-400">
                                Live Chat
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto space-y-4" ref={chatEndRef}>
                                {messages.length === 0 ? (
                                    <div className="text-center text-slate-600 text-xs py-10 italic">
                                        No messages yet.
                                    </div>
                                ) : messages.map(m => (
                                    <div key={m.id} className="flex flex-col gap-1">
                                        <span className={`text-[10px] font-bold ${m.senderId === currentUser?.id ? 'text-emerald-400' : 'text-slate-400'}`}>
                                            {m.senderName}
                                        </span>
                                        <div className="bg-white/5 p-3 rounded-lg rounded-tl-none text-sm text-slate-300 break-words">
                                            {m.content}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-4 border-t border-white/5">
                                <form
                                    onSubmit={sendMessage}
                                    className="flex gap-2"
                                >
                                    <input
                                        className="flex-1 bg-white/5 rounded-lg px-3 py-2 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                                        placeholder="Type a message..."
                                        value={newMessage}
                                        onChange={e => setNewMessage(e.target.value)}
                                    />
                                    <Button size="icon" type="submit" className="bg-emerald-600 hover:bg-emerald-500 h-9 w-9">
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </motion.aside>
                    )}

                    {showParticipants && (
                        <motion.aside
                            key="participants"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 320, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="border-l border-white/5 bg-[#0d1321]/80 backdrop-blur-xl flex flex-col z-20"
                        >
                            <div className="p-4 border-b border-white/5 font-bold text-sm tracking-widest uppercase text-slate-400">
                                Classroom Sync ({onlineUsers.length})
                            </div>

                            <div className="flex-1 p-4 overflow-y-auto space-y-2">
                                {onlineUsers.map((u: any) => (
                                    <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 group hover:border-emerald-500/30 transition-all">
                                        <div className="flex items-center gap-3">
                                            <div className="relative">
                                                <Avatar className="h-8 w-8 border border-white/10">
                                                    <AvatarImage src={u.avatar_url} />
                                                    <AvatarFallback className="bg-neutral-800 text-[10px] font-black">{u.name?.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-[#0d1321] rounded-full" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-white leading-none">{u.name}</span>
                                                <span className="text-[9px] font-black text-slate-500 uppercase mt-1 tracking-tighter">
                                                    {u.role === 'host' ? 'Teacher' : u.role === 'speaker' ? 'Speaker' : 'Student'}
                                                </span>
                                            </div>
                                        </div>

                                        {userRole === 'host' && u.id !== currentUser?.id && u.role === 'audience' && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-7 px-2 text-[9px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                                                onClick={() => promoteToSpeaker(u.id)}
                                            >
                                                Unmute
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </motion.aside>
                    )}
                </AnimatePresence>

            </main>
        </div>
    )
}

function RemoteVideoTrack({ track }: { track: IRemoteVideoTrack | undefined }) {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (track && ref.current) {
            track.play(ref.current)
        }
    }, [track])

    return (
        <div ref={ref} className="w-full h-full object-cover transform scale-x-[-1]" />
    )
}
