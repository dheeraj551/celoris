"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
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
    ArrowLeft
} from "lucide-react"

import { AdUnit } from "@/components/AdUnit"

export default function ChatLobbyPage() {
    const rooms = [
        {
            id: "socialize",
            title: "Socialize & Hangout",
            description: "A casual space to meet new people, share stories, and make friends from around the world.",
            icon: Coffee,
            color: "bg-green-500",
            activeCount: 342,
            tags: ["Casual", "Friends", "Global"],
            status: "Active"
        },
        {
            id: "networking",
            title: "Networking & Growth",
            description: "Connect with professionals, find mentors, and discuss career opportunities.",
            icon: Briefcase,
            color: "bg-blue-500",
            activeCount: 1205,
            tags: ["Professional", "Career", "Business"],
            status: "Active"
        },
        {
            id: "tech-trends",
            title: "Tech Trends Chat",
            description: "Discuss the latest in technology, AI, coding, and future innovations.",
            icon: Code,
            color: "bg-orange-500",
            activeCount: 892,
            tags: ["Tech", "AI", "Innovation"],
            status: "Hot"
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
                        <Card key={room.id} className="group hover:shadow-lg transition-all duration-300 border-slate-200 overflow-hidden">
                            <div className={`h-2 ${room.color}`} />
                            <CardHeader className="pb-4">
                                <div className="flex items-start justify-between mb-2">
                                    <div className={`p-3 rounded-xl ${room.color} bg-opacity-10 text-${room.color.replace('bg-', '')}`}>
                                        <room.icon className={`h-6 w-6 text-${room.color.replace('bg-', '')}-600`} />
                                    </div>
                                    <Badge variant={room.status === "Hot" ? "destructive" : "secondary"} className="uppercase text-[10px] tracking-wider">
                                        {room.status}
                                    </Badge>
                                </div>
                                <CardTitle className="text-xl text-slate-900 group-hover:text-primary-600 transition-colors">
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
                                        <span>{room.activeCount.toLocaleString()} online</span>
                                    </div>
                                    <Button asChild className={`${room.color} hover:opacity-90 text-white shadow-md`}>
                                        <Link href={`/social/chat/room/${room.id}`}>
                                            Join Room <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {/* Create Room Card (Placeholder for future) */}
                    <Card className="border-dashed border-2 border-slate-200 bg-slate-50 flex flex-col items-center justify-center p-8 text-center hover:border-slate-300 transition-colors">
                        <div className="h-12 w-12 bg-slate-200 rounded-full flex items-center justify-center mb-4 text-slate-400">
                            <Globe className="h-6 w-6" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">More Rooms Coming Soon</h3>
                        <p className="text-slate-500 text-sm max-w-xs mx-auto">
                            We are constantly adding new topics and communities. Stay tuned!
                        </p>
                    </Card>
                </div>

                {/* Sponsored Content / Ad */}
                <AdUnit slot="9266909448" className="mt-12" />
            </div>
        </div>
    )
}
