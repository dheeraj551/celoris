"use client"

import { BookOpen, Users, TrendingUp, Calculator, Atom, Sparkles, ArrowRight, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Courses } from "@/components/home-new/Courses"
import NoticeBoard from "@/components/NoticeBoard"
import StudentInquiries from "@/components/StudentInquiries"
import { PageWrapper } from "@/components/PageWrapper"
import { motion } from "framer-motion"


export default function LearnPage() {
  return (
    <PageWrapper className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30">
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
            Master New <br className="hidden md:block" /> Skills
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
            title="Popular Modules"
            description="Deep-dive into our most sought-after learning experiences"
            limit={4}
            featured={true}
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
              Interactive Study Hubs
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
              { title: "General Hub", icon: BookOpen, color: "from-emerald-600/20 to-teal-600/10", iconColor: "text-emerald-400", link: "/learn/ai-tutor/general", desc: "Collaborative space for cross-discipline knowledge sharing." },
              { title: "Quantum Math", icon: Calculator, color: "from-blue-600/20 to-indigo-600/10", iconColor: "text-blue-400", link: "/learn/ai-tutor/math", desc: "Deep-focus room for complex logic and mathematical modeling." },
              { title: "Physics Lab", icon: Atom, color: "from-amber-600/20 to-orange-600/10", iconColor: "text-amber-400", link: "/learn/ai-tutor/physics", desc: "Exploratory space for physical concepts and system mechanics." }
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
                    <p className="text-slate-400 mb-10 text-sm font-medium leading-relaxed italic flex-1">
                      {room.desc}
                    </p>
                    <Button className="w-full bg-white/5 hover:bg-emerald-600 text-slate-300 hover:text-white rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] transition-all duration-300 border border-white/5" asChild>
                      <Link href={room.link} className="flex items-center justify-center gap-3">
                        Enter Room <ArrowRight className="h-4 w-4" />
                      </Link>
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
            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-12 h-16 font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-500/20 relative z-10 transition-all duration-300" asChild>
              <Link href="/learn/study-room/my-study-room">
                Initialize Room
              </Link>
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
              Intelligence Feed
            </h2>
            <p className="text-lg text-slate-400 font-medium italic">
              Current tutoring opportunities and industry requirements.
            </p>
          </div>

          <NoticeBoard limit={6} />
        </div>
      </section>

      <StudentInquiries />
    </PageWrapper>
  )
}