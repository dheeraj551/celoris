"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
    Mic, MicOff, Video, VideoOff, PhoneOff, Hand, Users,
    MessageSquare, Send, Shield, ShieldAlert, Sparkles, LayoutGrid, AlertCircle, Calendar, Clock, Plus, X, BookOpen
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
    const [isAgoraJoined, setIsAgoraJoined] = useState(false)

    // Chat & Realtime
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [newMessage, setNewMessage] = useState('')
    const channelRef = useRef<any>(null) // Supabase Channel
    const chatEndRef = useRef<HTMLDivElement>(null)

    // Schedule State
    const [schedules, setSchedules] = useState<any[]>([])
    const [showScheduleModal, setShowScheduleModal] = useState(false)
    const [scheduleForm, setScheduleForm] = useState({
        topic: '',
        date: '',
        time: '',
        description: ''
    })

    // --- Effects ---

    useEffect(() => {
        setMounted(true)
        initializeUser()
        loadSchedules()

        // Realtime Subscription for Schedules
        const supabase = createClient()
        const scheduleChannel = supabase
            .channel('scheduled-classes-updates')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'scheduled_classes' },
                () => loadSchedules()
            )
            .subscribe()

        return () => {
            leaveRoom()
            if (channelRef.current) {
                channelRef.current.unsubscribe()
            }
            supabase.removeChannel(scheduleChannel)
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
            const guestId = `guest_${Math.floor(Math.random() * 1000)}`
            setCurrentUser({ id: guestId, email: 'guest@celoris.com', user_metadata: { full_name: 'Guest User' } })
        } else {
            setCurrentUser(user)
        }
    }

    const loadSchedules = async () => {
        const supabase = createClient()
        const { data } = await supabase
            .from('scheduled_classes')
            .select('*')
            .eq('subject', 'general')
            .gte('start_time', new Date().toISOString())
            .order('start_time', { ascending: true })

        if (data) setSchedules(data)
    }

    const handleCreateSchedule = async (e: React.FormEvent) => {
        e.preventDefault()
        const supabase = createClient()

        const startTime = new Date(`${scheduleForm.date}T${scheduleForm.time}`).toISOString()

        const { error } = await supabase.from('scheduled_classes').insert({
            topic: scheduleForm.topic,
            description: scheduleForm.description,
            start_time: startTime,
            teacher_id: currentUser?.id,
            teacher_name: currentUser?.user_metadata?.full_name || 'Teacher',
            subject: 'general'
        })

        if (error) {
            toast({ title: "Failed to schedule", description: error.message, variant: "destructive" })
        } else {
            toast({ title: "Class Scheduled", description: "The session has been added to the hub." })
            setShowScheduleModal(false)
            setScheduleForm({ topic: '', date: '', time: '', description: '' })
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
                const users = Object.values(state).flat() as any[]
                setOnlineUsers(users)

                // COST OPTIMIZATION: Only join Agora if a teacher (host) is present
                const hostPresent = users.some(u => u.role === 'host')
                if (hostPresent && role === 'audience' && !isAgoraJoined) {
                    initAgoraInternal('audience')
                } else if (!hostPresent && role === 'audience' && isAgoraJoined) {
                    // OPTIONAL: Disconnect Agora if teacher leaves to save costs
                    leaveAgoraOnly()
                }
            })
            .on('presence', { event: 'join' }, ({ newPresences }) => {
                const someHost = Object.values(newPresences).flat().some((p: any) => p.role === 'host')
                if (someHost && role === 'audience' && !isAgoraJoined) {
                    initAgoraInternal('audience')
                }
            })
            .on('presence', { event: 'leave' }, ({ leftPresences }) => {
                // Check if the host left
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

    const initConnection = async (selectedRole: UserRole) => {
        setIsConnected(true)
        setUserRole(selectedRole)

        // Step 1: Join Realtime first (Always ZERO cost)
        await initRealtime(selectedRole)

        // Step 2: If Host, start Agora immediately
        if (selectedRole === 'host') {
            await initAgoraInternal(selectedRole)
        }
        // If Student (audience), we wait for host presence (handled in initRealtime)
    }

    const initAgoraInternal = async (selectedRole: UserRole) => {
        if (isAgoraJoined) return

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
                    role: 'publisher'
                })
            })

            const { token, appId } = await tokenRes.json()

            if (!token) throw new Error("Failed to get token")

            await client.join(appId, ROOM_CHANNEL, token, uid)

            const agoraRole = selectedRole === 'host' ? 'host' : 'audience'
            await client.setClientRole(agoraRole)

            setIsAgoraJoined(true)

            if (selectedRole === 'host') {
                publishTracks()
            }

        } catch (err: any) {
            console.error("Agora Init Error:", err)
            // toast({ title: "Media Connection Failed", description: "Audio/Video might not be available.", variant: "destructive" })
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

    const leaveAgoraOnly = async () => {
        localAudioTrack?.close()
        localVideoTrack?.close()
        setLocalAudioTrack(null)
        setLocalVideoTrack(null)
        if (client && isAgoraJoined) {
            await client.leave()
        }
        setIsAgoraJoined(false)
        setRemoteUsers([])
    }

    const leaveRoom = async () => {
        await leaveAgoraOnly()
        setIsConnected(false)
        setUserRole('audience')
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
                            onClick={() => initConnection('audience')}
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
                            onClick={() => initConnection('host')}
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
        <div className="flex h-screen bg-[#050810] text-slate-200 overflow-hidden font-sans">

            {/* Left Sidebar: Video Feeds & Controls */}
            <aside className="w-80 flex-shrink-0 bg-[#0d1321]/50 border-r border-white/5 flex flex-col relative z-20">

                {/* Sidebar Header */}
                <div className="p-6 border-b border-white/5 bg-[#0d1321]/80 backdrop-blur-md">
                    <h1 className="font-black text-lg text-white flex items-center gap-3 italic uppercase tracking-tighter">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                            <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                        </div>
                        <div>
                            Academy AI
                            <span className="block text-[10px] text-emerald-500 font-bold tracking-widest not-italic">Virtual Classroom</span>
                        </div>
                    </h1>
                </div>

                {/* Video Grid (Vertical Stack) */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

                    {/* My Video */}
                    {(userRole === 'host' || userRole === 'speaker') && (
                        <div className="relative aspect-video bg-neutral-900 rounded-xl overflow-hidden border border-emerald-500/30 shadow-lg group">
                            <div ref={node => { if (node) localVideoTrack?.play(node) }} className="w-full h-full object-cover transform scale-x-[-1]" />
                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1.5 text-white">
                                <Shield className="w-3 h-3 text-emerald-400" />
                                You ({userRole})
                            </div>
                            {/* Overlay Controls */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white" onClick={toggleMic}>
                                    {isMicOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4 text-red-500" />}
                                </Button>
                                <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-black/60 hover:bg-black/80 border border-white/10 text-white" onClick={toggleCam}>
                                    {isCamOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4 text-red-500" />}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Remote Videos */}
                    {remoteUsers.map(user => (
                        <div key={user.uid} className="relative aspect-video bg-neutral-900 rounded-xl overflow-hidden border border-white/5 shadow-md">
                            <RemoteVideoTrack track={user.videoTrack} />
                            <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold flex items-center gap-1.5 text-white">
                                <Mic className="w-3 h-3 text-blue-400" />
                                User {user.uid}
                            </div>
                        </div>
                    ))}

                    {/* Empty State / Placeholders if needed */}
                    {remoteUsers.length === 0 && !(userRole === 'host' || userRole === 'speaker') && (
                        <div className="flex flex-col items-center justify-center h-48 text-center p-4 border border-dashed border-white/10 rounded-xl bg-white/5">
                            <Users className="w-8 h-8 text-slate-600 mb-2" />
                            <p className="text-xs text-slate-500 font-medium">No active speakers</p>
                        </div>
                    )}
                </div>

                {/* Bottom Action Bar (Sidebar) */}
                <div className="p-4 border-t border-white/5 bg-[#0d1321]/80 backdrop-blur-md">
                    <div className="flex items-center gap-2 mb-4">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {isConnected ? 'Live Connection' : 'Disconnected'}
                        </span>
                    </div>
                    <Button
                        variant="destructive"
                        onClick={leaveRoom}
                        className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 text-xs font-black uppercase tracking-widest h-10"
                    >
                        <PhoneOff className="w-4 h-4 mr-2" />
                        Leave Class
                    </Button>
                </div>
            </aside>

            {/* Main Content: Chat & Interaction */}
            <main className="flex-1 flex flex-col relative bg-[#050810] shadow-inner">

                {/* Main Header */}
                <header className="h-24 border-b border-white/5 bg-[#0d1321]/30 flex items-center justify-between px-8 z-10">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20">
                                <BookOpen className="w-4 h-4 text-blue-400" />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">
                                {schedules.length > 0 ? schedules[0].topic : "General Discussion & Collaboration"}
                            </h2>
                        </div>
                        <p className="text-[10px] font-black tracking-[0.2em] text-slate-500 uppercase pl-9">
                            {schedules.length > 0 ? "CURRENT SESSION" : "OPEN LOBBY"}
                        </p>
                    </div>

                    {/* Participants Pile */}
                    <div className="flex items-center gap-6">
                        <div className="flex -space-x-3">
                            {onlineUsers.slice(0, 5).map((u, i) => (
                                <Avatar key={u.id} className="w-10 h-10 border-2 border-[#050810] shadow-lg">
                                    <AvatarImage src={u.avatar_url} />
                                    <AvatarFallback className="bg-emerald-600 text-white text-xs font-bold">
                                        {u.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            ))}
                            {onlineUsers.length > 5 && (
                                <div className="w-10 h-10 rounded-full bg-[#0d1321] border-2 border-[#050810] flex items-center justify-center text-xs font-bold text-slate-400">
                                    +{onlineUsers.length - 5}
                                </div>
                            )}
                        </div>
                        <div className="text-right hidden md:block">
                            <div className="text-2xl font-black text-white leading-none">{onlineUsers.length}</div>
                            <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Active</div>
                        </div>
                    </div>
                </header>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar" ref={chatEndRef}>
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-600 opacity-50">
                            <MessageSquare className="w-12 h-12 mb-4" />
                            <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
                        </div>
                    ) : messages.map((m: any, idx) => {
                        const isMe = m.senderId === currentUser?.id;
                        return (
                            <div key={m.id || idx} className={`flex gap-4 max-w-3xl ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                                <Avatar className="w-10 h-10 border border-white/10 mt-1">
                                    <AvatarFallback className={`${isMe ? 'bg-emerald-600' : 'bg-indigo-600'} text-white text-xs font-bold`}>
                                        {m.senderName?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>

                                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-xs font-bold text-white">{m.senderName}</span>
                                        {/* <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 uppercase tracking-wider">Teacher</span> */}
                                        <span className="text-[10px] text-slate-500">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed ${isMe
                                        ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-900/20'
                                        : 'bg-white/5 text-slate-100 border border-white/5 rounded-tl-none'
                                        }`}>
                                        {m.content}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Input Area */}
                <div className="p-6 md:p-10 pb-12">
                    <div className="max-w-4xl mx-auto relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <form
                            onSubmit={sendMessage}
                            className="relative bg-[#0d1321] border border-white/10 rounded-[1.5rem] shadow-2xl flex items-center p-2 pr-3 transition-all focus-within:ring-2 focus-within:ring-emerald-500/50"
                        >
                            <div className="pl-4 pr-2">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className={`rounded-full transition-all ${handRaised ? 'bg-amber-500/10 text-amber-500 animate-pulse' : 'text-slate-400 hover:bg-white/5'}`}
                                    onClick={raiseHand}
                                    title="Raise Hand"
                                >
                                    <Hand className="w-5 h-5" />
                                </Button>
                            </div>

                            <input
                                className="flex-1 bg-transparent px-2 py-4 text-base text-white placeholder:text-slate-500 focus:outline-none"
                                placeholder="Raise your hand or ask a question..."
                                value={newMessage}
                                onChange={e => setNewMessage(e.target.value)}
                            />

                            <Button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="h-12 w-12 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all bg-gradient-to-br from-emerald-500 to-emerald-700"
                            >
                                <Send className="w-5 h-5 ml-0.5" />
                            </Button>
                        </form>
                        <p className="text-center text-[10px] font-medium text-slate-500 mt-4 tracking-wide">
                            Shift + Enter to send. This is an AI-powered educational simulation.
                        </p>
                    </div>
                </div>

                {/* Floating Schedule Button (Host Only) */}
                <AnimatePresence>
                    {userRole === 'host' && (
                        <div className="absolute top-24 right-8 z-30">
                            <Button
                                onClick={() => setShowScheduleModal(true)}
                                variant="outline"
                                className="bg-[#0d1321]/80 backdrop-blur border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300 text-xs font-black uppercase tracking-widest gap-2"
                            >
                                <Plus size={14} /> Schedule Class
                            </Button>
                        </div>
                    )}
                </AnimatePresence>

                {/* Schedule Modal (Teacher Only) */}
                <AnimatePresence>
                    {showScheduleModal && (
                        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="w-full max-w-md bg-[#0d1321] border border-white/10 rounded-[2.5rem] p-10 shadow-3xl"
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Schedule Class</h2>
                                    <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-slate-400 hover:text-white" onClick={() => setShowScheduleModal(false)}>
                                        <X size={18} />
                                    </Button>
                                </div>

                                <form onSubmit={handleCreateSchedule} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Class Topic</label>
                                        <input
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-emerald-500 outline-none text-white"
                                            placeholder="e.g. Master Calculus in 60mins"
                                            value={scheduleForm.topic}
                                            onChange={e => setScheduleForm({ ...scheduleForm, topic: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Date</label>
                                            <input
                                                required
                                                type="date"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-emerald-500 outline-none text-white color-scheme-dark"
                                                value={scheduleForm.date}
                                                onChange={e => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Time</label>
                                            <input
                                                required
                                                type="time"
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-emerald-500 outline-none text-white color-scheme-dark"
                                                value={scheduleForm.time}
                                                onChange={e => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest pl-1">Description</label>
                                        <textarea
                                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm focus:ring-1 focus:ring-emerald-500 outline-none min-h-[100px] text-white"
                                            placeholder="What will students learn?"
                                            value={scheduleForm.description}
                                            onChange={e => setScheduleForm({ ...scheduleForm, description: e.target.value })}
                                        />
                                    </div>
                                    <Button type="submit" className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-xs rounded-xl shadow-2xl shadow-emerald-500/20">
                                        Confirm Schedule
                                    </Button>
                                </form>
                            </motion.div>
                        </div>
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
