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
  Target,
  Lock
} from "lucide-react"
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
        (presences as any[]).forEach(presence => {
          if (presence?.roomId && presence.roomId.startsWith('private-')) {
            if (!roomsMap[presence.roomId]) {
              roomsMap[presence.roomId] = []
            }
            if (!roomsMap[presence.roomId].some(u => u?.id === presence.user?.id)) {
              roomsMap[presence.roomId].push(presence.user)
            }
          }
        })
      })

      const rooms = Object.entries(roomsMap).map(([id, users]) => ({
        id,
        users
      })).sort((a, b) => a.id.localeCompare(b.id))

      setActivePrivateRooms(rooms)
    }).subscribe()

    return () => {
      socialChannel.unsubscribe()
      networkingChannel.unsubscribe()
      techChannel.unsubscribe()
      lobbyChannel.unsubscribe()
      tracker.unsubscribe()
    }
  }, [user, authLoading])

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
            className="w-12 h-12 border-4 border-emerald-500/10 border-t-emerald-600 rounded-full mx-auto mb-6"
          />
          <p className="text-emerald-400 text-[10px] font-bold uppercase tracking-widest">Connecting...</p>
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
        "name": "Play",
        "item": "https://www.celorisdesigns.com/social"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30 font-sans overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero Section */}
      <section className="relative py-20 px-8 overflow-hidden z-10 border-b border-white/5 bg-[#0d1321]/40 backdrop-blur-3xl">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8 shadow-sm backdrop-blur-md"
          >
            <Sparkles size={14} className="fill-emerald-400" />
            Social Media Marketplace
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="text-5xl md:text-7xl font-bold tracking-tight text-white italic uppercase"
            >
              Celoris <span className="text-emerald-500">Play</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg md:text-xl max-w-2xl mx-auto text-slate-400 font-medium leading-relaxed italic"
            >
              “Turn Followers into Customers.” The ultimate platform for “Sell Anywhere. Own Everywhere.”
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 flex flex-wrap justify-center gap-4"
          >
            <Button
              onClick={() => handleSafeNavigation("/social/swipe")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white h-14 px-10 rounded-2xl font-bold text-sm shadow-xl shadow-emerald-500/20 transition-all border-none"
            >
              Find customers <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              onClick={() => handleSafeNavigation("/social/lobby")}
              className="bg-white/5 border-white/10 text-white hover:bg-white/10 h-14 px-10 rounded-2xl font-bold text-sm"
            >
              Join Public Room
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Global Hubs Interaction Visualization */}
      <section className="py-24 px-8 relative z-10 overflow-hidden bg-[#0d1321]/30">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/5 rounded-[3rem] p-10 md:p-16 border border-white/5 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 overflow-hidden relative shadow-none">
            {/* Left Side: Dynamic Text */}
            <div className="flex-1 space-y-8 relative z-10">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center justify-center shadow-sm">
                <Globe className="h-8 w-8 text-emerald-400" />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white tracking-tight leading-tight italic uppercase">
                  Celoris <span className="text-emerald-500">Play Cafe</span>
                </h2>
                <p className="text-lg text-slate-400 leading-relaxed font-medium italic">
                  Join public rooms and talk with customers across Social Media
                </p>
              </div>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700 text-white h-14 px-10 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-3 transition-all shadow-xl shadow-emerald-500/20 border-none"
                onClick={() => handleSafeNavigation("/social/lobby")}
              >
                JOIN PLAY CAFE <Rocket className="h-4 w-4" />
              </Button>
            </div>

            {/* Right Side: Virtual Lobby Display */}
            <div className="flex-1 w-full max-w-xl relative group">
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[1, 2, 3, 4].map((num) => {
                  const roomSlot = activePrivateRooms[num - 1];
                  const isOccupied = !!roomSlot;
                  return (
                    <div
                      key={num}
                      className={`relative flex flex-col items-center p-6 rounded-[2rem] border transition-all duration-500 ${isOccupied
                        ? 'border-emerald-500/30 bg-emerald-500/10 shadow-none'
                        : 'border-white/5 bg-white/[0.02]'
                        }`}
                    >
                      <span className={`text-[8px] font-bold tracking-widest mb-4 uppercase ${isOccupied ? 'text-emerald-400' : 'text-slate-600'}`}>
                        STATION_{num.toString().padStart(2, '0')}
                      </span>

                      <div className="flex -space-x-2 mb-4 h-10 items-center">
                        {isOccupied ? (
                          roomSlot.users.map((u: any, i: number) => (
                            <div key={i} className="h-10 w-10 rounded-full border-2 border-[#050810] overflow-hidden bg-neutral-800 shadow-sm">
                              <img src={u?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id || i}`} alt="u" />
                            </div>
                          ))
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center border border-white/5">
                            <Lock className="h-3 w-3 text-slate-700" />
                          </div>
                        )}
                      </div>

                      <div className={`px-3 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest ${isOccupied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white/5 text-slate-600'
                        }`}>
                        {isOccupied ? 'BUSY' : 'READY'}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Lobby Status Plate */}
              <div className="bg-white/5 border border-white/10 p-6 rounded-[2rem] flex items-center justify-between shadow-none">
                <div className="flex items-center gap-4">
                  <div className="flex -space-x-2">
                    {roomData.lobby.users.slice(0, 3).map((u: any, i: number) => (
                      <div key={i} className="h-8 w-8 rounded-full border-2 border-[#050810] overflow-hidden shadow-sm">
                        <img src={u?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 45}`} alt="u" />
                      </div>
                    ))}
                  </div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    {roomData.lobby.count} Online Now
                  </div>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[8px] font-bold uppercase tracking-widest">
                  LIVE
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Perks - High End Grid */}
      <section className="py-24 px-8 relative z-10 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-4 italic uppercase">
              Premium Benefits
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium italic">
              Upgrade your plan to get professional tools and wider reach.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="border-white/10 bg-white/5 hover:border-emerald-500/30 transition-all rounded-[2rem] p-6 flex flex-col h-full shadow-none hover:shadow-2xl hover:shadow-emerald-500/10 group">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform">
                  <feature.icon className="h-8 w-8 text-emerald-500" />
                </div>
                <div className="text-center space-y-4 flex flex-col h-full">
                  <div className="space-y-2">
                    <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">{feature.badge}</span>
                    <h3 className="text-xl font-bold text-white tracking-tight italic uppercase">{feature.title}</h3>
                    <p className="text-slate-500 text-xs leading-relaxed italic">{feature.description}</p>
                  </div>
                  <Button
                    className="w-full mt-auto bg-white/5 text-white hover:bg-emerald-600 hover:text-white rounded-xl h-12 font-bold text-xs border border-white/10"
                    onClick={() => handleSafeNavigation("/social/upgrade")}
                  >
                    Upgrade Now
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrity Shield View */}
      <section className="py-24 px-8 relative z-10 border-t border-white/5 bg-[#0d1321]/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white tracking-tight mb-4 italic uppercase">
              Safe & Secure
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
              Your privacy and security are our top priorities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-10 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-none">
              <Shield className="h-12 w-12 text-emerald-500 mx-auto mb-6" />
              <h3 className="text-lg font-bold text-white mb-4 tracking-tight italic uppercase">Verified Users</h3>
              <p className="text-slate-500 text-sm leading-relaxed italic">
                Identity verification ensures you're connecting with real people.
              </p>
            </div>
            <div className="text-center p-10 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-none">
              <Award className="h-12 w-12 text-emerald-500 mx-auto mb-6" />
              <h3 className="text-lg font-bold text-white mb-4 tracking-tight italic uppercase">Smart Moderation</h3>
              <p className="text-slate-500 text-sm leading-relaxed italic">
                Our AI moderation system ensures a positive and helpful community environment.
              </p>
            </div>
            <div className="text-center p-10 bg-white/5 rounded-[2.5rem] border border-white/10 shadow-none">
              <Sparkles className="h-12 w-12 text-purple-500 mx-auto mb-6" />
              <h3 className="text-lg font-bold text-white mb-4 tracking-tight italic uppercase">Community Rules</h3>
              <p className="text-slate-500 text-sm leading-relaxed italic">
                Clearly defined guidelines to keep the network professional and friendly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Signal Section */}
      <section className="py-32 px-8 relative z-10 text-center bg-emerald-600 text-white rounded-[4rem] mx-8 mb-20 overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto backdrop-blur-md">
            <ZapOff className="h-12 w-12 text-white fill-current" />
          </div>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
            Start Your Play Journey
          </h2>
          <p className="text-xl text-emerald-100 max-w-2xl mx-auto font-medium italic">
            Join thousands of creators already growing their network on Celoris.
          </p>
          <Button
            className="bg-white text-emerald-600 hover:bg-emerald-50 h-16 px-12 rounded-2xl font-bold uppercase tracking-widest text-xs transition-all border-none"
            onClick={() => handleSafeNavigation(user ? "/social/chat" : "/login")}
          >
            {user ? 'GO TO SOCIAL HUB' : 'GET STARTED NOW'}
          </Button>
        </div>
      </section>
    </div>
  )
}
