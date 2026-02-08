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
    Lock,
    Sparkles,
    Signal,
    MoreHorizontal
} from "lucide-react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { PageWrapper } from "@/components/PageWrapper"

import { AdUnit } from "@/components/AdUnit"

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
}

const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0, scale: 0.95 },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.8,
            ease: [0.23, 1, 0.32, 1]
        }
    }
}

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
            title: "Hangout",
            description: "Meet new people, share stories, and grow your global community.",
            icon: Coffee,
            color: "from-emerald-500 to-teal-600",
            accent: "emerald",
            activeCount: socialOnlineCount,
            tags: ["Global", "Friends", "Vibe"],
            status: "Active",
            isAvailable: true
        },
        {
            id: "networking",
            title: "Professional",
            description: "Connect with experts and mentors to help grow your career.",
            icon: Briefcase,
            color: "from-teal-500 to-cyan-600",
            accent: "teal",
            activeCount: 0,
            tags: ["Career", "Mentorship", "Pro"],
            status: "Coming Soon",
            isAvailable: false
        },
        {
            id: "tech-trends",
            title: "Tech Trends",
            description: "Discuss the latest tech trends: AI, coding, and digital tools.",
            icon: Code,
            color: "from-emerald-600 to-emerald-900",
            accent: "emerald",
            activeCount: 0,
            tags: ["AI", "Innovation", "Code"],
            status: "Coming Soon",
            isAvailable: false
        }
    ]

    return (
        <PageWrapper className="min-h-screen bg-[#050810] text-slate-200 overflow-x-hidden relative font-sans">
            {/* Background Decorative Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.15, 0.1]
                    }}
                    transition={{ duration: 15, repeat: Infinity }}
                    className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-teal-600/10 rounded-full blur-[150px]"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.05, 0.1, 0.05]
                    }}
                    transition={{ duration: 20, repeat: Infinity, delay: 2 }}
                    className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[150px]"
                />
            </div>

            {/* Header */}
            <header className="relative z-20 border-b border-white/5 bg-[#050810]/40 backdrop-blur-3xl">
                <div className="container mx-auto px-4 md:px-6 py-6 md:py-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <Link href="/social">
                                <motion.div whileHover={{ scale: 1.1, x: -5 }} whileTap={{ scale: 0.9 }}>
                                    <Button variant="ghost" size="icon" className="rounded-2xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 h-14 w-14">
                                        <ArrowLeft className="h-6 w-6" />
                                    </Button>
                                </motion.div>
                            </Link>
                            <div className="space-y-1">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest"
                                >
                                    <Signal size={12} className="animate-pulse" />
                                    Social Network Online
                                </motion.div>
                                <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">Public Chat Rooms</h1>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4 md:px-6">
                            <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                                <Users className="text-emerald-500" size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Total Online</p>
                                <p className="text-xl font-black text-white italic leading-none">{socialOnlineCount}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 md:px-6 py-10 md:py-20 relative z-10">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
                >
                    {rooms.map((room) => (
                        <motion.div
                            key={room.id}
                            variants={itemVariants}
                            whileHover={{ y: -10 }}
                            className="group"
                        >
                            <Card className={`h-full flex flex-col bg-[#0d1321]/60 backdrop-blur-3xl border-white/10 hover:border-${room.accent}-500/30 transition-all duration-500 overflow-hidden shadow-2xl rounded-3xl md:rounded-[2.5rem]`}>
                                <div className={`h-1.5 bg-gradient-to-r ${room.isAvailable ? room.color : 'from-slate-800 to-slate-900 group-hover:from-slate-700'}`} />
                                <CardHeader className="p-10 pb-6">
                                    <div className="flex items-start justify-between mb-8">
                                        <div className={`p-5 rounded-[1.5rem] bg-gradient-to-br ${room.isAvailable ? room.color : 'from-slate-800 to-slate-900'} shadow-2xl group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-white/5`}>
                                            <room.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <Badge className={`uppercase text-[9px] font-black tracking-[0.2em] px-4 py-1.5 border-none shadow-sm rounded-full ${room.isAvailable ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-500'}`}>
                                            {room.status}
                                        </Badge>
                                    </div>
                                    <CardTitle className={`text-3xl font-black tracking-tighter italic uppercase mb-4 transition-colors ${room.isAvailable ? 'text-white' : 'text-slate-600'}`}>
                                        {room.title}
                                    </CardTitle>
                                    <CardDescription className="text-slate-400 font-medium leading-relaxed text-sm min-h-[64px] line-clamp-3 italic">
                                        "{room.description}"
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-10 pt-4 flex-1 flex flex-col justify-between">
                                    <div className="flex flex-wrap gap-2 mb-10">
                                        {room.tags.map((tag) => (
                                            <span key={tag} className="px-3 py-1 bg-white/5 border border-white/5 text-slate-500 text-[9px] font-black uppercase tracking-widest rounded-lg group-hover:text-slate-300 transition-colors">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        <div className="flex items-center justify-between px-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-2 w-2 rounded-full ${room.isAvailable ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)] animate-pulse' : 'bg-slate-800'}`} />
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{room.isAvailable ? `${room.activeCount} ONLINE` : 'OFFLINE'}</span>
                                            </div>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-700 hover:text-white rounded-full">
                                                <MoreHorizontal size={18} />
                                            </Button>
                                        </div>

                                        {room.isAvailable ? (
                                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                                <Button asChild className={`w-full h-16 bg-gradient-to-r ${room.color} hover:brightness-110 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-[1.25rem] shadow-2xl transition-all duration-300 border-none`}>
                                                    <Link href={`/social/chat/room/${room.id}`} className="flex items-center justify-center gap-3">
                                                        Join Chat <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
                                                    </Link>
                                                </Button>
                                            </motion.div>
                                        ) : (
                                            <Button disabled className="w-full h-16 bg-white/5 border border-white/5 text-slate-700 font-black uppercase tracking-[0.2em] text-[11px] rounded-[1.25rem] flex items-center justify-center gap-3">
                                                <Lock className="h-4 w-4" /> Locked
                                            </Button>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Sponsored Content / Ad */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.8 }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="bg-[#0d1321]/40 border border-white/5 rounded-[3rem] p-10 backdrop-blur-3xl shadow-2xl">
                        <div className="flex items-center gap-3 mb-8">
                            <Sparkles size={16} className="text-emerald-500" />
                            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Sponsored Feed</h3>
                        </div>
                        <AdUnit slot="9266909448" />
                    </div>
                </motion.section>
            </main>
        </PageWrapper>
    )
}
