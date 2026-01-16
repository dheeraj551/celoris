"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Video, ArrowRight, Clock, Share2 } from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"

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
    const { profile, user } = useAuth()
    const router = useRouter()
    const { toast } = useToast()

    const handleRoomEntry = (roomId: string) => {
        if (!user) {
            router.push("/login")
            return
        }

        const balance = profile?.wallet_balance || 0
        if (balance < 100) {
            toast({
                title: "Insufficient Wallet Balance",
                description: `Entering an interview room requires ₹100.00. Your current balance is ₹${balance.toFixed(2)}.`,
                variant: "destructive"
            })
            return
        }

        router.push(`/earn/interview-room/${roomId}`)
    }

    return (
        <section className="py-32 relative z-10 bg-[#050810]/50">
            <div className="container px-4">
                <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-10">
                    <div className="text-center md:text-left">
                        <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                            <Video size={14} /> LIVE NEXUS ROOMS
                        </div>
                        <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase">
                            Interview Rooms
                        </h2>
                        <p className="text-lg text-slate-400 font-medium italic mt-4 max-w-2xl">
                            Deploy into always-on collaborative environments for real-time skill verification and professional networking.
                        </p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {rooms.map((room) => (
                        <Card key={room.id} className="bg-[#0d1321]/40 backdrop-blur-3xl border-white/5 hover:border-emerald-500/30 transition-all duration-500 rounded-[3rem] overflow-hidden group shadow-2xl">
                            <CardContent className="p-10">
                                <div className="flex justify-between items-start mb-10">
                                    <div className="bg-emerald-500/10 p-5 rounded-2xl border border-emerald-500/20 group-hover:scale-110 transition-transform">
                                        <Video className="w-8 h-8 text-emerald-500" />
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/10">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 italic">{room.status}</span>
                                    </div>
                                </div>

                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4 text-left leading-none group-hover:text-emerald-400 transition-colors">{room.title}</h3>

                                <div className="flex items-center gap-4 mb-10">
                                    <div className="flex -space-x-3">
                                        {room.avatars.slice(0, 4).map((avatar, i) => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0d1321] overflow-hidden bg-white/5">
                                                <img src={avatar} alt={`User ${i}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                        <div className="w-10 h-10 rounded-full border-2 border-[#0d1321] bg-white/5 flex items-center justify-center text-[10px] font-black text-slate-500">
                                            +
                                        </div>
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                                        <span className="text-white">{room.participants}</span> NODES ACTIVE
                                    </div>
                                </div>

                                <div className="mt-auto">
                                    <Button
                                        onClick={() => handleRoomEntry(room.id)}
                                        className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-3xl shadow-emerald-500/20 border-none group"
                                    >
                                        <div className="flex flex-col items-center">
                                            <span className="flex items-center gap-2">Enter room <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></span>
                                            <span className="text-[8px] opacity-60 mt-1">₹100 Required in Wallet</span>
                                        </div>
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    )
}
