"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { useAuth } from "@/components/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Heart,
  MessageCircle,
  Users,
  Smartphone,
  Video,
  Phone,
  Instagram,
  Zap,
  Crown,
  MapPin,
  Star,
  ArrowRight,
  UserPlus,
  Shield,
  Award,
  MessageSquare,
  Sparkles,
  Rocket,
  Globe,
  ZapOff,
  Target
} from "lucide-react"
import { PageWrapper } from "@/components/PageWrapper"
import { motion, AnimatePresence } from "framer-motion"

export default function SocialPage() {
  const { user, profile, loading: authLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleSafeNavigation = (path: string) => {
    if (!user) {
      router.push("/login")
      return
    }

    const balance = profile?.wallet_balance || 0
    if (balance < 100) {
      toast({
        title: "Access Restricted",
        description: `Participation in social activities requires a minimum balance of ₹100.00. Current balance: ₹${balance.toFixed(2)}.`,
        variant: "destructive"
      })
      return
    }

    router.push(path)
  }

  const [roomData, setRoomData] = useState<any>({
    social: { count: 0, users: [] },
    networking: { count: 0, users: [] },
    tech: { count: 0, users: [] },
    lobby: { count: 0, users: [] }
  })
  const [activePrivateRooms, setActivePrivateRooms] = useState<any[]>([])

  useEffect(() => {
    if (authLoading || !user) return

    const supabase = createClient()

    const socialChannel = supabase.channel('room:socialize')
    socialChannel.on('presence', { event: 'sync' }, () => {
      const state = socialChannel.presenceState()
      const presences = Object.values(state).flat() as any[]
      setRoomData((prev: any) => ({
        ...prev,
        social: {
          count: presences.length,
          users: presences.map(p => p.user).filter(Boolean).slice(0, 4)
        }
      }))
    }).subscribe()

    const networkingChannel = supabase.channel('room:networking')
    networkingChannel.on('presence', { event: 'sync' }, () => {
      const state = networkingChannel.presenceState()
      const presences = Object.values(state).flat() as any[]
      setRoomData((prev: any) => ({
        ...prev,
        networking: {
          count: presences.length,
          users: presences.map(p => p.user).filter(Boolean).slice(0, 4)
        }
      }))
    }).subscribe()

    const techChannel = supabase.channel('room:tech-trends')
    techChannel.on('presence', { event: 'sync' }, () => {
      const state = techChannel.presenceState()
      const presences = Object.values(state).flat() as any[]
      setRoomData((prev: any) => ({
        ...prev,
        tech: {
          count: presences.length,
          users: presences.map(p => p.user).filter(Boolean).slice(0, 4)
        }
      }))
    }).subscribe()

    const lobbyChannel = supabase.channel('room:lobby')
    lobbyChannel.on('presence', { event: 'sync' }, () => {
      const state = lobbyChannel.presenceState()
      const presences = Object.values(state).flat() as any[]
      setRoomData((prev: any) => ({
        ...prev,
        lobby: {
          count: presences.length,
          users: presences.map(p => p.user).filter(Boolean).slice(0, 10)
        }
      }))
    }).subscribe()

    const tracker = supabase.channel('global-rooms-tracker')
    tracker.on('presence', { event: 'sync' }, () => {
      const state = tracker.presenceState()
      const roomsMap: Record<string, any[]> = {}
      Object.values(state).forEach((presences: any) => {
        const presence = presences[0]
        if (presence?.roomId && presence.roomId.startsWith('private-')) {
          if (!roomsMap[presence.roomId]) roomsMap[presence.roomId] = []
          roomsMap[presence.roomId].push(presence.user)
        }
      })
      setActivePrivateRooms(Object.values(roomsMap))
    }).subscribe()

    return () => {
      socialChannel.unsubscribe()
      networkingChannel.unsubscribe()
      techChannel.unsubscribe()
      lobbyChannel.unsubscribe()
      tracker.unsubscribe()
    }
  }, [user, authLoading])

  const platformFeatures = [
    {
      icon: Heart,
      title: "Discovery",
      description: "Find and connect with creators and experts tailored to your interests.",
      color: "from-pink-500 to-rose-600",
      action: "Start Browsing",
      href: "/social/swipe"
    },
    {
      icon: Instagram,
      title: "Profile Sync",
      description: "Connect your social accounts and showcase your work to the community.",
      color: "from-purple-500 to-indigo-600",
      action: "Update Profile",
      href: "/social/profile"
    },
    {
      icon: MessageCircle,
      title: "Private Chat",
      description: "Secure, real-time messaging with your friends and connections.",
      color: "from-emerald-500 to-teal-600",
      action: "Open Chats",
      href: "/social/chat"
    },
    {
      icon: Video,
      title: "Video Calls",
      description: "Crystal clear video calling for face-to-face meetings and collab.",
      color: "from-emerald-500 to-teal-600",
      action: "Go Premium",
      premium: true,
      href: "/social/upgrade"
    },
    {
      icon: Smartphone,
      title: "Notifications",
      description: "Instant alerts for new messages, likes, and profile updates.",
      color: "from-orange-500 to-amber-600",
      action: "Enable Alerts",
      premium: true,
      href: "/social/upgrade"
    },
    {
      icon: Users,
      title: "Expert Network",
      description: "Direct access to verified leaders and industry professionals.",
      color: "from-indigo-500 to-purple-600",
      action: "Join Network",
      premium: true,
      href: "/social/upgrade"
    }
  ]

  const premiumFeatures = [
    {
      icon: Crown,
      title: "Unlimited Likes",
      description: "Break the daily limits and connect with as many people as you want.",
      badge: "ELITE"
    },
    {
      icon: Zap,
      title: "Profile Boost",
      description: "Get up to 300% more visibility in the discovery section.",
      badge: "PRO"
    },
    {
      icon: Video,
      title: "HD Video Calls",
      description: "Unlock high-definition video and audio for all your calls.",
      badge: "ELITE"
    },
    {
      icon: MapPin,
      title: "Global Reach",
      description: "Change your location to find and meet people from around the world.",
      badge: "PRO"
    }
  ]

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full mx-auto mb-6"
          />
          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Connecting to Social Network...</p>
        </div>
      </div>
    )
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.celorisdesigns.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Social",
        "item": "https://www.celorisdesigns.com/social"
      }
    ]
  };

  return (
    <PageWrapper className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-emerald-600/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-[-10%] right-[-5%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[150px]"
        />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-48 px-6 overflow-hidden z-10">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase tracking-[0.4em] mb-12 shadow-3xl backdrop-blur-3xl"
          >
            <Sparkles size={14} className="fill-emerald-400" />
            Social Networking Redefined
          </motion.div>

          <div className="max-w-5xl mx-auto space-y-12">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.8] text-white"
            >
              Celoris <span className="text-emerald-500 drop-shadow-[0_0_50px_rgba(16,185,129,0.3)]">Social</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-base md:text-xl max-w-3xl mx-auto text-slate-400 font-medium leading-relaxed italic uppercase tracking-wide"
            >
              "Swipe. Connect. Grow." The ultimate platform for finding creators,
              building influence, and professional networking.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-16 flex flex-wrap justify-center gap-6"
          >
            <Button
              onClick={() => handleSafeNavigation("/social/swipe")}
              className="bg-emerald-600 hover:bg-emerald-500 text-white h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl shadow-emerald-500/20 transition-all"
            >
              Find People <ArrowRight className="ml-3 h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => handleSafeNavigation("/social/lobby")}
              className="bg-white/5 border border-white/10 text-white hover:bg-white/10 h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-[10px]"
            >
              Join Chat Rooms
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Core Protocol Components */}
      <section className="py-32 relative z-10 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-block p-4 bg-emerald-500/10 rounded-[2rem] border border-emerald-500/20 mb-8"
            >
              <Target className="h-10 w-10 text-emerald-400" />
            </motion.div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic mb-6">
              Ecosystem Core Features
            </h2>
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-black uppercase tracking-widest text-[10px]">
              A unified platform bridging discovery and professional networking.
            </p>
          </div>

          <motion.div
            variants={{
              show: { transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="group h-full"
              >
                <Card className="bg-[#0d1321]/40 border-white/5 hover:border-emerald-500/30 backdrop-blur-3xl shadow-3xl rounded-[3rem] overflow-hidden h-full flex flex-col transition-all duration-500">
                  <CardHeader className="pt-12 px-10 flex-col items-center text-center">
                    <div className={`w-20 h-20 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center mb-10 shadow-3xl group-hover:scale-110 transition-transform duration-500 relative`}>
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <CardTitle className="text-2xl font-black text-white tracking-tighter uppercase italic">{feature.title}</CardTitle>
                        {feature.premium && (
                          <span className="bg-emerald-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-lg">
                            ELITE
                          </span>
                        )}
                      </div>
                      <CardDescription className="text-slate-500 font-bold text-sm leading-relaxed uppercase tracking-wide">
                        {feature.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="px-10 pb-12 mt-auto">
                    <Button
                      className="w-full bg-white text-[#050810] hover:bg-emerald-600 hover:text-white rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] transition-all duration-300 shadow-2xl"
                      onClick={() => handleSafeNavigation(feature.href || "#")}
                    >
                      {feature.action} <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Global Hubs Interaction Visualization */}
      <section className="py-32 px-6 relative z-10 overflow-hidden">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white/5 backdrop-blur-3xl rounded-[4rem] p-10 md:p-24 border border-white/5 flex flex-col lg:flex-row items-center gap-20 overflow-hidden relative shadow-3xl"
          >
            {/* Animated Mesh Background */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1)_0%,transparent_50%)]" />
            </div>

            {/* Left Side: Dynamic Text */}
            <div className="flex-1 space-y-12 relative z-10">
              <motion.div
                animate={{ rotate: [0, 5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center shadow-3xl"
              >
                <Globe className="h-10 w-10 text-emerald-400" />
              </motion.div>
              <div className="space-y-6">
                <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-[0.9] uppercase italic">
                  Celoris <br /><span className="text-emerald-400 drop-shadow-[0_0_30px_rgba(52,211,153,0.3)]">Chat Cafe</span>
                </h2>
                <p className="text-xl text-slate-400 leading-relaxed font-bold uppercase tracking-wide">
                  Join public chat rooms and talk with people across the globe in real-time.
                </p>
              </div>
              <Button
                className="bg-emerald-600 hover:bg-emerald-500 text-white h-16 px-12 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-5 transition-all shadow-3xl shadow-emerald-500/20"
                onClick={() => handleSafeNavigation("/social/lobby")}
              >
                OPEN CHAT CAFE <Rocket className="h-5 w-5" />
              </Button>
            </div>

            {/* Right Side: Virtual Lobby Display */}
            <div className="flex-1 w-full max-w-2xl relative group">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
                {/* Room Slot: Socialize */}
                <motion.div whileHover={{ y: -15, scale: 1.05 }} className="bg-[#0d1321]/60 p-8 rounded-[3rem] border border-white/5 hover:border-emerald-500/30 shadow-3xl transition-all cursor-pointer relative overflow-hidden group/card">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/5 to-transparent -translate-y-full group-hover/card:animate-[scan_3s_linear_infinite] pointer-events-none" />
                  <div className="flex -space-x-3 mb-8 overflow-hidden">
                    {roomData.social.users.length > 0 ? (
                      roomData.social.users.map((u: any, i: number) => (
                        <div key={i} className="h-14 w-14 rounded-2xl ring-4 ring-[#0d1321] overflow-hidden bg-white/10 shadow-2xl">
                          <img src={u?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 15}`} alt="n" className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-white/5 rounded-2xl text-[10px] text-slate-700 font-black uppercase tracking-widest">IDLE_LOBBY</div>
                    )}
                  </div>
                  <h4 className="font-black text-white text-xl uppercase italic tracking-tighter mb-4">Socialize</h4>
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                      ACTIVE
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                      <Users size={12} className="text-slate-500" />
                      {roomData.social.count}
                    </div>
                  </div>
                </motion.div>

                {/* Room Slot: Networking */}
                <motion.div whileHover={{ y: -15, scale: 1.05 }} className="bg-[#0d1321]/60 p-8 rounded-[3rem] border border-white/5 hover:border-teal-500/30 shadow-3xl transition-all cursor-pointer relative overflow-hidden group/card">
                  <div className="flex -space-x-3 mb-8 overflow-hidden">
                    {roomData.networking.users.length > 0 ? (
                      roomData.networking.users.map((u: any, i: number) => (
                        <div key={i} className="h-14 w-14 rounded-2xl ring-4 ring-[#0d1321] overflow-hidden bg-white/10 shadow-2xl">
                          <img src={u?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 25}`} alt="n" className="w-full h-full object-cover" />
                        </div>
                      ))
                    ) : (
                      <div className="p-4 bg-white/5 rounded-2xl text-[10px] text-slate-700 font-black uppercase tracking-widest">IDLE_LOBBY</div>
                    )}
                  </div>
                  <h4 className="font-black text-white text-xl uppercase italic tracking-tighter mb-4">Networking</h4>
                  <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                    <div className="flex items-center gap-2 text-teal-400">
                      <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(45,212,191,0.8)]" />
                      SYNCED
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                      <Users size={12} className="text-slate-500" />
                      {roomData.networking.count}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Lobby Status Plate */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="bg-white/5 backdrop-blur-2xl p-8 rounded-[3rem] border border-white/5 flex items-center justify-between shadow-3xl"
              >
                <div className="flex items-center gap-6">
                  <div className="flex -space-x-3">
                    {roomData.lobby.users.slice(0, 5).map((u: any, i: number) => (
                      <div key={i} className="h-10 w-10 rounded-full ring-2 ring-[#050810] overflow-hidden shadow-xl">
                        <img src={u?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 45}`} alt="u" />
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                    {roomData.lobby.count} People Online
                  </div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest animate-pulse">
                  SYSTEM ONLINE
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Premium Perks - High End Grid */}
      <section className="py-32 px-6 bg-[#0d1321]/30 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic mb-8">
              Premium Benefits
            </h2>
            <div className="h-2 w-32 bg-emerald-600 mx-auto rounded-full mb-10 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
            <p className="text-lg text-slate-500 max-w-2xl mx-auto font-black uppercase tracking-widest text-[11px] italic">
              Upgrade your plan to get professional tools and wider reach.
            </p>
          </div>

          <motion.div
            variants={{
              show: { transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  show: { opacity: 1, scale: 1 }
                }}
                whileHover={{ y: -15 }}
                className="group h-full"
              >
                <Card className="text-center border-white/5 bg-white/5 backdrop-blur-3xl rounded-[3rem] p-6 flex flex-col h-full transition-all duration-500 hover:bg-white/10 hover:border-emerald-500/30 shadow-3xl">
                  <CardHeader className="pt-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-teal-700 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-3xl group-hover:scale-110 transition-transform duration-500">
                      <feature.icon className="h-10 w-10 text-white" />
                    </div>
                    <div className="mb-6">
                      <span className="bg-emerald-600/10 text-emerald-400 text-[9px] font-black uppercase tracking-[0.3em] px-5 py-2 rounded-full border border-emerald-500/20">
                        {feature.badge}
                      </span>
                    </div>
                    <CardTitle className="text-2xl font-black text-white tracking-tighter uppercase italic mb-4">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <CardDescription className="text-slate-500 font-bold uppercase tracking-wide text-xs leading-relaxed mb-12">
                      {feature.description}
                    </CardDescription>
                    <Button
                      className="w-full mt-auto bg-white text-[#050810] hover:bg-emerald-600 hover:text-white rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] transition-all"
                      onClick={() => handleSafeNavigation("/social/upgrade")}
                    >
                      Upgrade Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Integrity Shield View */}
      <section className="py-32 px-6 relative z-10">
        <div className="container mx-auto">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-6">
              Safe & Secure
            </h2>
            <p className="text-slate-500 font-black uppercase tracking-[0.2em] text-[10px]">
              Your privacy and security are our top priorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            <motion.div whileHover={{ y: -10 }} className="text-center p-12 bg-white/5 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl shadow-3xl">
              <Shield className="h-16 w-16 text-emerald-500 mx-auto mb-8 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
              <h3 className="text-xl font-black text-white mb-6 tracking-tighter uppercase italic">Verified Users</h3>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wide leading-relaxed">
                Identity verification ensures you're connecting with real people.
              </p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="text-center p-12 bg-white/5 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl shadow-3xl">
              <Award className="h-16 w-16 text-emerald-500 mx-auto mb-8 drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]" />
              <h3 className="text-xl font-black text-white mb-6 tracking-tighter uppercase italic">Smart Moderation</h3>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wide leading-relaxed">
                Our AI moderation system ensures a positive and helpful community environment.
              </p>
            </motion.div>
            <motion.div whileHover={{ y: -10 }} className="text-center p-12 bg-white/5 rounded-[3.5rem] border border-white/5 backdrop-blur-3xl shadow-3xl">
              <Sparkles className="h-16 w-16 text-purple-500 mx-auto mb-8 drop-shadow-[0_0_15px_rgba(168,85,247,0.3)]" />
              <h3 className="text-xl font-black text-white mb-6 tracking-tighter uppercase italic">Community Rules</h3>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-wide leading-relaxed">
                Clearly defined guidelines to keep the network professional and friendly.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Signal Section */}
      <section className="py-48 px-6 relative z-10 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-600/5 to-transparent pointer-events-none" />
        <div className="container mx-auto max-w-4xl space-y-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="w-32 h-32 bg-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_80px_rgba(16,185,129,0.4)]"
          >
            <ZapOff className="h-14 w-14 text-white fill-current" />
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-[0.85]">
            Start Your <br /><span className="text-emerald-500">Social Journey</span>
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto font-black uppercase tracking-widest text-xs leading-relaxed italic">
            Join thousands of creators already growing their network on Celoris.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="bg-emerald-600 hover:bg-emerald-500 text-white h-20 px-16 rounded-3xl font-black uppercase tracking-[0.4em] text-xs shadow-3xl shadow-emerald-500/30 transition-all border-none"
              onClick={() => handleSafeNavigation(user ? "/social/chat" : "/login")}
            >
              {user ? 'GO TO SOCIAL HUB' : 'GET STARTED NOW'}
            </Button>
          </motion.div>
        </div>
      </section>

      <style jsx global>{`
                @keyframes scan {
                    0% { transform: translateY(-100%); }
                    100% { transform: translateY(300%); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.1);
                }
            `}</style>
    </PageWrapper>
  )
}
