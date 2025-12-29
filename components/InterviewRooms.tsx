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
            <div className="container px-4">
                {/* Header Section */}
                <div className="flex items-start gap-4 mb-2">
                    <div className="w-14 h-14 bg-[#2C7A4F] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100 flex-shrink-0">
                        <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-3xl md:text-4xl font-extrabold text-[#212529] tracking-tight">
                                Join Premium Interview Rooms
                            </h2>
                            <div className="px-3 py-1 bg-amber-100 border border-amber-200 text-amber-800 text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
                                Premium
                            </div>
                        </div>
                        <p className="text-lg text-slate-500 font-medium">
                            Upgrade for private audio/video-enabled rooms for job interviews, mock interviews, and hiring sessions.
                        </p>
                    </div>
                </div>

                {/* Space */}
                <div className="h-10" />

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {rooms.map((room, idx) => (
                        <Card key={idx} className="border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300 rounded-2xl overflow-hidden bg-white group/card">
                            <CardContent className="p-7">
                                {/* Avatars Stack */}
                                <div className="flex -space-x-3 mb-8">
                                    {room.avatars.map((avatar, aIdx) => (
                                        <div
                                            key={aIdx}
                                            className="w-11 h-11 rounded-full border-2 border-white overflow-hidden bg-slate-50 shadow-sm transition-transform hover:scale-110 hover:z-10"
                                        >
                                            <img src={avatar} alt="Participant" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                    <div className="w-11 h-11 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 shadow-sm">
                                        +12
                                    </div>
                                </div>

                                {/* Title and Icon */}
                                <div className="flex items-start justify-between mb-5">
                                    <h3 className="text-xl font-bold text-slate-800 group-hover/card:text-[#2C7A4F] transition-colors line-clamp-1">{room.title}</h3>
                                    <div className="p-2 bg-slate-50 rounded-xl group-hover/card:bg-emerald-50 transition-colors">
                                        <Share2 className="w-4 h-4 text-slate-400 group-hover/card:text-[#2C7A4F]" />
                                    </div>
                                </div>

                                {/* Info Pills */}
                                <div className="flex items-center gap-3 mb-8 text-xs font-semibold">
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full text-slate-600 border border-slate-100">
                                        <Users className="w-3.5 h-3.5 text-[#2C7A4F]" />
                                        <span>{room.participants}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 rounded-full text-slate-600 border border-slate-100">
                                        <Clock className="w-3.5 h-3.5 text-[#2C7A4F]" />
                                        <span>{room.status}</span>
                                    </div>
                                </div>

                                {/* Button */}
                                <Button
                                    asChild
                                    className="w-full bg-[#2C7A4F] hover:bg-[#215B3B] text-white font-bold py-7 rounded-2xl group transition-all transform active:scale-[0.98] shadow-lg shadow-emerald-50"
                                    variant="default"
                                >
                                    <Link href={`/earn/interview-room/${room.id}`}>
                                        <span className="flex-1 text-center">{room.cta}</span>
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Bottom Banner */}
                <div className="mt-12 group">
                    <div className="bg-white rounded-[2.5rem] p-4 pl-8 pr-4 border border-slate-100 shadow-xl shadow-slate-200/30 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:shadow-2xl hover:shadow-slate-300/40 border-l-8 border-l-[#2C7A4F]">
                        <div className="flex items-center gap-6">
                            <div className="w-16 h-12 bg-slate-900 rounded-2xl flex items-center justify-center transform transition-transform group-hover:rotate-3 shadow-lg">
                                <Video className="w-8 h-8 text-white" />
                            </div>
                            <p className="text-lg md:text-xl font-bold text-slate-800 leading-tight">
                                Host or join professional, private interview rooms <br className="hidden md:block" />
                                <span className="text-slate-400 font-medium text-base md:text-lg">equipped with audio, video, and screen sharing.</span>
                            </p>
                        </div>
                        <Button size="lg" className="bg-[#2C7A4F] hover:bg-[#215B3B] text-white px-10 py-8 rounded-[1.8rem] text-xl font-black shadow-2xl shadow-emerald-200/50 group/btn h-auto" asChild>
                            <Link href="/social/upgrade">
                                Upgrade & Join
                                <ArrowRight className="w-6 h-6 ml-3 group-hover/btn:translate-x-2 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
