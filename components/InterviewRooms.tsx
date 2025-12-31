"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Video, ArrowRight, Clock, Share2 } from "lucide-react"
import Link from "next/link"

const rooms = [
    {
        id: "interview_marketing",
        title: "Marketing Role Interview",
        participants: "2805 +",
        status: "Always On",
        cta: "Best Marketing Roles Marketing",
        avatars: [
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie"
        ]
    },
    {
        id: "interview_tech",
        title: "Tech Role Interview",
        participants: "2128 +",
        status: "Always On",
        cta: "Browse Jobs",
        avatars: [
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Eva",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Finn",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Ruby",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha"
        ]
    },
    {
        id: "interview_mock",
        title: "Mock Interview Practice",
        participants: "2086 +",
        status: "Always On",
        cta: "Upgrade Skills",
        avatars: [
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Toby",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Hugo",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivy",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Otis"
        ]
    }
]

export default function InterviewRooms() {
    return (
        <section className="py-16 bg-slate-50/50">
            <div className="container px-4 text-center">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Live Interview Rooms</h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Join our always-on voice and video rooms to practice mock interviews,
                        discuss tech roles, or network with other marketing professionals.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {rooms.map((room) => (
                        <Card key={room.id} className="border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all duration-300 group">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="bg-emerald-50 p-3 rounded-2xl group-hover:bg-emerald-100 transition-colors">
                                        <Video className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div className="flex items-center gap-2 bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-xs font-semibold text-slate-600">{room.status}</span>
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold text-slate-800 mb-2 text-left">{room.title}</h3>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex -space-x-3">
                                        {room.avatars.slice(0, 4).map((avatar, i) => (
                                            <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-100">
                                                <img src={avatar} alt={`User ${i}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                            +
                                        </div>
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        <span className="font-bold text-slate-700">{room.participants}</span> online
                                    </div>
                                </div>

                                <Button asChild className="w-full bg-slate-900 group-hover:bg-emerald-600 transition-colors">
                                    <Link href={`/earn/interview-room/${room.id}`}>
                                        {room.cta} <ArrowRight className="w-4 h-4 ml-2" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
