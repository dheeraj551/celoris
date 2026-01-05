"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { useAuth } from "@/components/providers/AuthProvider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    MessageSquare,
    Users,
    Hash,
    ArrowRight,
    Globe,
    Zap,
    Coffee,
    Briefcase,
    Code,
    ArrowLeft,
    Lock
} from "lucide-react"

import { AdUnit } from "@/components/AdUnit"

export default function ChatLobbyPage() {
    const [socialOnlineCount, setSocialOnlineCount] = useState(0)

    const { user, loading } = useAuth()

    useEffect(() => {
        if (loading || !user) return

        const supabase = createClient()
        const channel = supabase.channel('room:socialize', {
            config: {
                presence: {
                    key: 'lobby-monitor',
                },
            },
        })

        channel
            .on('presence', { event: 'sync' }, () => {
                const state = channel.presenceState()
                const count = Object.keys(state).length
                setSocialOnlineCount(count)
            })
            .subscribe()

        return () => {
            channel.unsubscribe()
        }
    }, [user, loading])

    const rooms = [
        {
            id: "socialize",
            title: "Socialize & Hangout",
            description: "A casual space to meet new people, share stories, and make friends from around the world.",
            icon: Coffee,
            color: "bg-green-500",
            activeCount: socialOnlineCount,
            tags: ["Casual", "Friends", "Global"],
            status: "Active",
            isAvailable: true
        },
        {
            id: "networking",
            title: "Networking & Growth",
            description: "Connect with professionals, find mentors, and discuss career opportunities.",
            icon: Briefcase,
            color: "bg-blue-500",
            activeCount: 0,
            tags: ["Professional", "Career", "Business"],
            status: "Coming Soon",
            isAvailable: false
        },
        {
            id: "tech-trends",
            title: "Tech Trends Chat",
            description: "Discuss the latest in technology, AI, coding, and future innovations.",
            icon: Code,
            color: "bg-orange-500",
            activeCount: 0,
            tags: ["Tech", "AI", "Innovation"],
            status: "Coming Soon",
            isAvailable: false
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center gap-4 mb-4">
                        <Link href="/social">
                            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100">
                                <ArrowLeft className="h-6 w-6 text-slate-600" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Public Chat Rooms</h1>
                            <p className="text-slate-500">Join the conversation in real-time</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <Card key={room.id} className={`group hover:shadow-lg transition-all duration-300 border-slate-200 overflow-hidden ${!room.isAvailable && 'opacity-75 grayscale-[0.5]'}`}>
                            <div className={`h-2 ${room.isAvailable ? room.color : 'bg-slate-300'}`} />
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className={`p-3 rounded-xl ${room.isAvailable ? room.color : 'bg-slate-100'} bg-opacity-10`}>
                                        <room.icon className={`h-6 w-6 ${room.isAvailable ? `text-${room.color.replace('bg-', '')}-600` : 'text-slate-400'}`} />
                                    </div>
                                    <Badge variant={room.isAvailable ? "secondary" : "outline"} className="uppercase text-[10px] tracking-wider">
                                        {room.status}
                                    </Badge>
                                </div>
                                <CardTitle className={`text-xl transition-colors ${room.isAvailable ? 'text-slate-900 group-hover:text-primary-600' : 'text-slate-400'}`}>
                                    {room.title}
                                </CardTitle>
                                <CardDescription className="text-slate-600 mt-2">
                                    {room.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {room.tags.map((tag) => (
                                        <span key={tag} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2 text-sm text-slate-500">
                                        <Users className="h-4 w-4" />
                                        <span>{room.isAvailable ? `${room.activeCount} online` : 'Offline'}</span>
                                    </div>
                                    {room.isAvailable ? (
                                        <Button asChild className={`${room.color} hover:opacity-90 text-white shadow-md`}>
                                            <Link href={`/social/chat/room/${room.id}`}>
                                                Join Room <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    ) : (
                                        <Button disabled variant="outline" className="gap-2">
                                            <Lock className="h-4 w-4" /> Locked
                                        </Button>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Sponsored Content / Ad */}
                <AdUnit slot="9266909448" className="mt-12" />
            </div>
        </div>
    )
}
