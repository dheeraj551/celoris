"use client"

import { useState, useEffect, useRef } from "react"
import { BookOpen, Users, TrendingUp, Calculator, Bot, Sparkles, ArrowRight, Zap, X, Send, MessageSquare } from "lucide-react"
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
import { PostLearningNeedModal } from "@/components/learn/PostLearningNeedModal"




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



function BoothChatDrawer({ trainer, onClose }: { trainer: any; onClose: () => void }) {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const { profile } = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!trainer) return;

    const supabase = createClient();
    // Unique channel for this student-trainer pair
    // In a real production app, you'd use a UUID for the session
    const channelId = `chat:${trainer.user_id}`;
    const channel = supabase.channel(channelId);

    channel
      .on('broadcast', { event: 'message' }, ({ payload }: any) => {
        setMessages((prev) => [...prev, payload]);
      })
      .subscribe();

    // Scroll to bottom
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    return () => {
      channel.unsubscribe();
    };
  }, [trainer]);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender_id: profile?.id,
      sender_name: profile?.full_name || 'Student',
      text: input,
      timestamp: new Date().toISOString()
    };

    const supabase = createClient();
    const channelId = `chat:${trainer.user_id}`;
    
    await supabase.channel(channelId).send({
      type: 'broadcast',
      event: 'message',
      payload: newMessage,
    });

    setMessages((prev) => [...prev, newMessage]);
    setInput('');
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      className="fixed top-0 right-0 h-full w-full md:w-[450px] bg-[#0d1321] border-l border-white/5 z-[100] shadow-2xl flex flex-col"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-[#050810]/50 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 overflow-hidden">
            <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="text-white font-bold leading-none mb-1">{trainer.name}</h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-black uppercase tracking-widest">Active Booth</span>
            </div>
          </div>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-10">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
               <MessageSquare className="text-emerald-500" size={24} />
            </div>
            <h4 className="text-white font-bold italic uppercase mb-2">Start the conversation</h4>
            <p className="text-slate-500 text-xs italic">Say hello to {trainer.name.split(' ')[0]} and ask about {trainer.role}.</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className={`flex flex-col ${m.sender_id === profile?.id ? 'items-end' : 'items-start'}`}>
              <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                m.sender_id === profile?.id 
                  ? 'bg-emerald-600 text-white rounded-tr-none' 
                  : 'bg-white/5 text-slate-200 border border-white/5 rounded-tl-none'
              }`}>
                {m.text}
              </div>
              <span className="text-[9px] text-slate-600 font-black uppercase mt-2 tracking-widest italic">
                {m.sender_id === profile?.id ? 'Sent' : m.sender_name} • {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Input */}
      <div className="p-6 bg-[#050810]/50 backdrop-blur-xl border-t border-white/5">
        <div className="relative flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your question..."
            className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 h-14 text-sm text-white focus:outline-none focus:border-emerald-500/50 transition-all"
          />
          <Button onClick={sendMessage} className="h-14 w-14 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white p-0 shrink-0 shadow-lg shadow-emerald-500/20">
            <Send size={20} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

function OnlineTrainersList({ onConnect }: { onConnect: (trainer: any) => void }) {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [isSyncing, setIsSyncing] = useState(true);

  useEffect(() => {
    let channel: any = null;
    try {
      const supabase = createClient();
      channel = supabase.channel('booth:online_trainers');

      const updatePresence = () => {
        const state = channel.presenceState();
        const presences = Object.values(state).flat() as any[];
        const uniqueTrainers = presences
          .filter(Boolean)
          .filter((v, i, a) => a.findIndex(t => t.user_id === v.user_id) === i);

        setTrainers(uniqueTrainers);
        setIsSyncing(false);
      };

      channel
        .on('presence', { event: 'sync' }, updatePresence)
        .on('presence', { event: 'join' }, updatePresence)
        .on('presence', { event: 'leave' }, updatePresence)
        .subscribe();
    } catch (err) {
      console.error('Failed to initialize OnlineTrainers subscription:', err);
    }

    return () => {
      if (channel) channel.unsubscribe();
    };
  }, []);

  if (isSyncing) {
    return (
      <div className="flex gap-8 overflow-hidden py-12">
        {[1, 2, 3].map((i) => (
          <div key={i} className="min-w-[320px] h-[350px] bg-white/5 rounded-[2.5rem] animate-pulse" />
        ))}
      </div>
    );
  }

  if (trainers.length === 0) {
    return (
      <div className="py-20 text-center bg-[#0d1321]/30 rounded-[2.5rem] border border-white/5 border-dashed">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <Users className="text-slate-600" size={32} />
        </div>
        <h3 className="text-xl font-bold text-white mb-2 italic uppercase">Booth Currently Quiet</h3>
        <p className="text-slate-500 max-w-sm mx-auto text-sm italic">Our trainers are currently in live sessions. Check back in a few minutes or join a hub below!</p>
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {trainers.map((trainer, idx) => (
        <Card key={trainer.user_id || idx} className="min-w-[320px] bg-[#0d1321]/80 backdrop-blur-xl border-white/5 hover:border-emerald-500/30 transition-all rounded-[2.5rem] overflow-visible shadow-none hover:shadow-2xl hover:shadow-emerald-500/10 snap-center group relative cursor-pointer mt-12">
          <CardContent className="pt-0 pb-10 px-8 flex flex-col items-center text-center">
            <div className="relative -mt-12 mb-8">
              <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[24px] opacity-20 group-hover:opacity-50 transition-opacity duration-500" />
              <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-emerald-400 to-emerald-900 shadow-2xl relative z-10 transform group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-500">
                <div className="w-full h-full rounded-full border-4 border-[#0d1321] overflow-hidden bg-neutral-800">
                  <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-[#0d1321] border border-emerald-500/30 rounded-full px-4 py-2 flex items-center gap-2 z-20 shadow-xl group-hover:-translate-y-2 transition-transform duration-500">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none">Live Chat</span>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white mb-3 truncate italic uppercase tracking-tight w-full">{trainer.name}</h3>
            <div className="bg-white/5 border border-white/5 px-5 py-2 rounded-xl mb-8">
              <p className="text-emerald-400 text-[11px] font-black uppercase tracking-widest text-center truncate w-full">{trainer.role}</p>
            </div>

            <div className="flex gap-3 w-full">
              <Button 
                onClick={() => onConnect(trainer)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl h-14 font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 gap-2"
              >
                Connect
              </Button>
              <Button variant="outline" className="w-14 px-0 shrink-0 bg-[#0d1321] border-white/5 hover:bg-white/5 text-white rounded-2xl h-14">
                <Zap size={18} className="text-emerald-400" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function LearnClient({ initialCourses, initialNotices }: { initialCourses: any[], initialNotices: any[] }) {
  const { profile, user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeChatTrainer, setActiveChatTrainer] = useState<any>(null)

  const handleConnect = (trainer: any) => {
    if (!user) {
      router.push("/login")
      return
    }
    setActiveChatTrainer(trainer)
  }

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
        {/* Background glow effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-12 w-[600px] h-[300px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
        <div className="absolute top-0 right-1/3 w-[500px] h-[300px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-[400px] h-[250px] bg-cyan-500/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_70%_50%,rgba(16,185,129,0.04)_0%,transparent_60%)] pointer-events-none" />
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        
        <div className="max-w-6xl mx-auto text-center relative z-10">
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
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white italic uppercase"
          >
            Master Your Future — <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(52,211,153,0.3)]">Learn Any Skill</span> from Real Trainers
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
            <Button size="lg" className="bg-[#0d1321] hover:bg-white/5 border border-white/10 text-white rounded-2xl px-10 h-14 font-bold text-sm shadow-xl" asChild>
              <Link href="/learn/courses" className="flex items-center gap-2">
                Explore Academy <ArrowRight size={16} />
              </Link>
            </Button>
            <PostLearningNeedModal />
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-12 relative z-10 border-b border-white/5 bg-[#050810]/50"
      >
        <div className="container relative z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
          <Courses
            title="Most Popular Free and Paid Courses"
            description="Deep-dive into our most sought-after learning experiences"
            limit={6}
            featured={true}
            initialCourses={initialCourses}
          />
        </div>
      </motion.section>

      {/* Free Online Classes - Upcoming Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="py-12 relative z-10 border-b border-white/5"
      >
        <div className="max-w-6xl mx-auto">
          <FreeOnlineClasses initialCourses={initialCourses} />
        </div>
      </motion.section>



      <BenefitBanner />

      <StudentInquiries />
    </div>
  )
}
