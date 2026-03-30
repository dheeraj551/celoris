"use client"

import { useState, useEffect } from "react"
import { BookOpen, Users, TrendingUp, Calculator, Bot, Sparkles, ArrowRight, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Courses } from "@/components/home-new/Courses"
import StudentInquiries from "@/components/StudentInquiries"
import { FreeOnlineClasses } from "@/components/learn/FreeOnlineClasses"
import { BenefitBanner } from "@/components/learn/BenefitBanner"
import { PageWrapper } from "@/components/PageWrapper"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/components/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase-client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"




function RoomPresence({ channelName, hasAiAgent }: { channelName: string; hasAiAgent?: boolean }) {
  const [users, setUsers] = useState<any[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    let channel: any = null;
    try {
      const supabase = createClient();
      channel = supabase.channel(channelName);

      const updatePresence = () => {
        const state = channel.presenceState();
        const presences = Object.values(state).flat() as any[];
        const uniqueUsers = presences
          .filter(Boolean)
          .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

        setUsers(uniqueUsers.slice(0, 3));
        setCount(uniqueUsers.length);
      };

      channel
        .on('presence', { event: 'sync' }, updatePresence)
        .on('presence', { event: 'join' }, updatePresence)
        .on('presence', { event: 'leave' }, updatePresence)
        .subscribe();
    } catch (err) {
      console.error('Failed to initialize RoomPresence subscription:', err);
    }

    return () => {
      if (channel) channel.unsubscribe();
    };
  }, [channelName]);

  if (count === 0) return (
    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest italic mb-6">
      <div className={`w-1.5 h-1.5 rounded-full ${hasAiAgent ? 'bg-indigo-500 animate-pulse' : 'bg-slate-700'}`} />
      <span className={hasAiAgent ? 'text-indigo-400' : 'text-slate-500'}>
        {hasAiAgent ? 'Support agent online' : 'Room Empty'}
      </span>
    </div>
  );

  return (
    <div className="flex items-center justify-between gap-4 mb-6 bg-white/5 p-3 rounded-2xl border border-white/5">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">
          {count} Online Now
        </span>
      </div>
      <div className="flex -space-x-2">
        {users.map((u: any, i: number) => (
          <div key={u.id || i} className="w-6 h-6 rounded-full border border-[#0d1321] overflow-hidden bg-neutral-800">
            <img
              src={u.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id || i}`}
              alt="u"
              className="w-full h-full object-cover"
            />
          </div>
        ))}
        {count > 3 && (
          <div className="w-6 h-6 rounded-full border border-[#0d1321] bg-neutral-800 flex items-center justify-center text-[8px] font-black text-white">
            +{count - 3}
          </div>
        )}
      </div>
    </div>
  );
}

export default function LearnClient({ initialCourses, initialNotices }: { initialCourses: any[], initialNotices: any[] }) {
  const { profile, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const handleRoomEntry = (link: string) => {
    if (!user) {
      router.push("/login")
      return
    }

    const balance = profile?.wallet_balance || 0
    if (balance < 100) {
      toast({
        title: "Top-up Required",
        description: `Entering a study hub requires ₹100.00. Your current balance is ₹${balance.toFixed(2)}.`,
        variant: "destructive"
      })
      return
    }

    router.push(link)
  }

  const handleInitializeRoom = () => {
    if (!user) {
      router.push("/login")
      return
    }

    const balance = profile?.wallet_balance || 0
    if (balance < 1000) {
      toast({
        title: "Top-up Required",
        description: `Creating a Study Group requires ₹1000.00. Your current balance is ₹${balance.toFixed(2)}.`,
        variant: "destructive"
      })
      return
    }

    router.push("/learn/study-room/my-study-room")
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
        "name": "Learn",
        "item": "https://www.celorisdesigns.com/learn"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      {/* Hero Section */}
      <section className="py-20 px-8 relative overflow-hidden z-10 border-b border-white/5 bg-[#0d1321]/40 backdrop-blur-3xl">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8"
          >
            <Sparkles size={12} className="animate-pulse" /> Celoris Academy
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white italic uppercase"
          >
            Free Online Classes — Learn Any Skill from Real Trainers
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-slate-400 font-medium leading-relaxed italic"
          >
            Free classes with real trainers. Learn video editing, AI tools, Excel, spoken English and more. First session free — no credit card needed.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-10 h-14 font-bold text-sm shadow-xl shadow-emerald-500/20" asChild>
              <Link href="/learn/courses" className="flex items-center gap-2">
                Explore Academy <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Free Online Classes - Upcoming Section */}
      <section className="py-24 relative z-10 border-b border-white/5">
        <div className="max-w-6xl mx-auto">
          <FreeOnlineClasses initialCourses={initialCourses} />
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 relative z-10">
        <div className="container">
          <Courses
            title="Most Popular Free and Paid Courses"
            description="Deep-dive into our most sought-after learning experiences"
            limit={4}
            featured={true}
            initialCourses={initialCourses}
          />
        </div>
      </section>

      {/* Interactive Study Hubs Section */}
      <section className="py-24 relative z-10 border-y border-white/5 bg-[#0d1321]/30">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4">
              <Sparkles size={14} /> Live Classes
            </div>
            <h2 className="text-4xl font-bold text-white tracking-tight mb-4 italic uppercase">Live Classrooms</h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium italic">
              Join live rooms for real-time collaboration and group mastery sessions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            {[
              { title: "General Hub", icon: BookOpen, color: "bg-emerald-500/10", iconColor: "text-emerald-500", link: "/learn/ai-tutor/general", desc: "Collaborative space for cross-discipline knowledge sharing.", channel: "room:classroom_general", hasAi: false },
              { title: "Science Hub", icon: Calculator, color: "bg-blue-500/10", iconColor: "text-blue-500", link: "/learn/ai-tutor/quantum-science", desc: "Unified hub for Physics, Chemistry, and Advanced Mathematics.", channel: "room:classroom_quantum-science", hasAi: true },
              { title: "Learn AI", icon: Bot, color: "bg-purple-500/10", iconColor: "text-purple-500", link: "/learn/ai-tutor/ai-courses", desc: "Explore AI technology courses and find your perfect learning path.", channel: "room:classroom_ai-courses", hasAi: true }
            ].map((room, idx) => (
              <Card key={idx} className="bg-white/5 border-white/5 hover:border-emerald-500/30 transition-all rounded-[2rem] overflow-hidden shadow-none hover:shadow-2xl hover:shadow-emerald-500/10 group">
                <CardContent className="pt-10 pb-8 px-8 flex flex-col h-full text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-6">
                    <div className={`w-16 h-16 ${room.color} rounded-2xl flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform`}>
                      <room.icon size={28} className={room.iconColor} />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 truncate italic uppercase tracking-tight">{room.title}</h3>
                  <p className="text-slate-400 mb-6 text-sm font-medium leading-relaxed italic flex-1">
                    {room.desc}
                  </p>

                  <RoomPresence channelName={room.channel} hasAiAgent={room.hasAi} />
                  <Button
                    onClick={() => handleRoomEntry(room.link)}
                    className="w-full bg-white/5 hover:bg-emerald-600 text-white rounded-xl h-12 font-bold text-xs transition-all border border-white/5"
                  >
                    <div className="flex flex-col items-center">
                      <span className="flex items-center gap-2">Enter Room <ArrowRight className="h-4 w-4" /></span>
                      <span className="text-[8px] opacity-60 mt-0.5">Entry Fee: ₹100</span>
                    </div>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Footer Banner */}
          <div className="bg-white/5 border border-white/5 rounded-[2rem] p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />
            <div className="flex items-center gap-8 relative z-10">
              <div className="p-4 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-sm">
                <Sparkles className="h-8 w-8 text-emerald-400 animate-pulse" />
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-2xl font-bold tracking-tight mb-1 text-white italic uppercase">Create Your Own Study Group</h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Invite friends • Better Focus • Always Online</p>
              </div>
            </div>
            <Button
              onClick={handleInitializeRoom}
              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl px-10 h-14 font-bold text-sm shadow-xl shadow-emerald-500/20 relative z-10 transition-all border-none"
            >
              <div className="flex flex-col items-center">
                <span>Create Room</span>
                <span className="text-[8px] opacity-80 mt-0.5 tracking-widest uppercase">Setup Fee: ₹1000</span>
              </div>
            </Button>
          </div>
        </div>
      </section>


      <BenefitBanner />

      <StudentInquiries />
    </div>
  )
}
