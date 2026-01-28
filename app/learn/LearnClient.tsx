"use client"

import { useState, useEffect } from "react"
import { BookOpen, Users, TrendingUp, Calculator, Bot, Sparkles, ArrowRight, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Courses } from "@/components/home-new/Courses"
import NoticeBoard from "@/components/NoticeBoard"
import StudentInquiries from "@/components/StudentInquiries"
import { PageWrapper } from "@/components/PageWrapper"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/components/providers/AuthProvider"
import { useRouter } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase-client"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"


const TRANSACTIONS = [
  "Aarav Sharma paid For The Python Basics Course – Tutor: Ritika Malhotra",
  "Meera Iyer paid For The Digital Marketing Bootcamp – Tutor: Sahil Khanna",
  "Rohan Patel paid For The Data Science Program – Tutor: Ananya Desai",
  "Simran Kaur paid For The Spoken English Training – Tutor: Neha Collins",
  "Aditya Verma paid For The Full Stack Web Development – Tutor: Kunal Mehta",
  "Pooja Nair paid For The UI/UX Design Course – Tutor: Sneha Roy",
  "Vikram Singh paid For The Cybersecurity Fundamentals – Tutor: Arjun Rao",
  "Neel Joshi paid For The AI & Machine Learning Track – Tutor: Priyanka Bose",
  "Ishita Banerjee paid For The Content Writing Masterclass – Tutor: Rahul Sen",
  "Manav Kapoor paid For The Fitness & Nutrition Coaching – Tutor: Rhea Mathur"
]

function ScrollingTicker() {
  return (
    <div className="w-full overflow-hidden bg-emerald-500/5 border-y border-emerald-500/10 py-3 mb-16 relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050810] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050810] to-transparent z-10" />

      <motion.div
        animate={{
          x: [0, -1000],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex whitespace-nowrap gap-12 items-center"
      >
        {[...TRANSACTIONS, ...TRANSACTIONS].map((text, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-emerald-400 italic">
              {text}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

function RoomPresence({ channelName, hasAiAgent }: { channelName: string; hasAiAgent?: boolean }) {
  const [users, setUsers] = useState<any[]>([]);
  const [count, setCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase.channel(channelName);

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

    return () => {
      channel.unsubscribe();
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
        title: "Insufficient Wallet Balance",
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
        title: "Insufficient Wallet Balance",
        description: `Creating a Study Nexus requires ₹1000.00. Your current balance is ₹${balance.toFixed(2)}.`,
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
    <PageWrapper className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-teal-600/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px]"
        />
      </div>

      {/* Hero Section */}
      <section className="py-24 md:py-32 relative overflow-hidden z-10 border-b border-white/5 bg-[#0d1321]/40 backdrop-blur-3xl">
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Sparkles size={12} className="animate-pulse" /> The Knowledge Nexus
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white italic uppercase"
          >
            Celoris Academy <br className="hidden md:block" /> & Classrooms
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-400 font-medium leading-relaxed italic"
          >
            Access legendary courses designed by industry disruptors. Learn at your own pace
            and bridge the gap to your future self.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-12 h-16 font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-500/20" asChild>
                <Link href="/learn/courses" className="flex items-center gap-3">
                  Explore Academy <ArrowRight size={16} />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-24 relative z-10">
        <div className="container">
          <Courses
            title="Popular Courses"
            description="Deep-dive into our most sought-after learning experiences"
            limit={4}
            featured={true}
            initialCourses={initialCourses}
          />
        </div>
      </section>

      {/* Interactive Study Hubs Section */}
      <section className="py-32 relative z-10 border-y border-white/5 bg-[#0d1321]/20">
        <div className="container">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <Sparkles size={14} /> Live Synergy
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase italic"
            >
              live classrooms
            </motion.h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium italic">
              Join live rooms for real-time collaboration and group mastery sessions.
            </p>
          </div>

          <motion.div
            variants={{
              show: { transition: { staggerChildren: 0.1 } }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20"
          >
            {[
              { title: "General Hub", icon: BookOpen, color: "from-emerald-600/20 to-teal-600/10", iconColor: "text-emerald-400", link: "/learn/ai-tutor/general", desc: "Collaborative space for cross-discipline knowledge sharing.", channel: "room:classroom_general", hasAi: false },
              { title: "Quantum Science", icon: Calculator, color: "from-blue-600/20 to-indigo-600/10", iconColor: "text-blue-400", link: "/learn/ai-tutor/quantum-science", desc: "Unified hub for Physics, Chemistry, and Advanced Mathematics.", channel: "room:classroom_quantum-science", hasAi: true },
              { title: "AI ROOM", icon: Bot, color: "from-purple-600/20 to-pink-600/10", iconColor: "text-purple-400", link: "/learn/ai-tutor/ai-courses", desc: "Explore AI technology courses and find your perfect learning path.", channel: "room:classroom_ai-courses", hasAi: true }
            ].map((room, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <Card className="bg-[#0d1321]/60 backdrop-blur-3xl border-white/5 hover:border-emerald-500/30 transition-all duration-500 rounded-[3rem] overflow-hidden h-full shadow-2xl">
                  <CardContent className="pt-12 pb-10 px-10 flex flex-col h-full">
                    <div className="flex justify-center md:justify-start mb-8">
                      <div className={`w-20 h-20 bg-gradient-to-br ${room.color} rounded-2xl flex items-center justify-center border border-white/5 shadow-inner group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}>
                        <room.icon size={36} className={room.iconColor} />
                      </div>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-4 tracking-tighter uppercase italic">{room.title}</h3>
                    <p className="text-slate-400 mb-8 text-sm font-medium leading-relaxed italic flex-1">
                      {room.desc}
                    </p>

                    <RoomPresence channelName={room.channel} hasAiAgent={room.hasAi} />
                    <Button
                      onClick={() => handleRoomEntry(room.link)}
                      className="w-full bg-white/5 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] transition-all duration-300 border border-white/5"
                    >
                      <div className="flex flex-col items-center">
                        <span className="flex items-center gap-3">Enter Room <ArrowRight className="h-4 w-4" /></span>
                        <span className="text-[8px] opacity-60 mt-1">₹100 Required in Wallet</span>
                      </div>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer Banner */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-[#0d1321]/60 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 md:p-14 flex flex-col md:flex-row items-center justify-between gap-8 shadow-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-emerald-600/10 to-transparent pointer-events-none" />
            <div className="flex items-center gap-8 relative z-10">
              <div className="p-5 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                <Sparkles className="h-10 w-10 text-emerald-400 animate-pulse" />
              </div>
              <div className="text-center md:text-left">
                <h4 className="text-2xl font-black tracking-tighter mb-2 text-white uppercase italic">Create Your Own Study Nexus</h4>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Invite peers via link • End-to-end Focus • Always Online</p>
              </div>
            </div>
            <Button
              onClick={handleInitializeRoom}
              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-12 h-16 font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-500/20 relative z-10 transition-all duration-300"
            >
              <div className="flex flex-col items-center">
                <span>Initialize Room</span>
                <span className="text-[8px] opacity-80 mt-1 tracking-widest">₹1000 Required</span>
              </div>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Notice Board Section */}
      <section className="py-32 relative z-10">
        <div className="container">
          <div className="text-center mb-20">
            <div className="flex items-center justify-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <Zap size={14} /> Global Feed
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-6 uppercase italic">
              Notice Board
            </h2>
            <p className="text-lg text-slate-400 font-medium italic">
              Current tutoring opportunities and industry requirements.
            </p>
          </div>

          <ScrollingTicker />

          <NoticeBoard limit={6} initialNotices={initialNotices} />
        </div>
      </section>

      <StudentInquiries />
    </PageWrapper>
  )
}