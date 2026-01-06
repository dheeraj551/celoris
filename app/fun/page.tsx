"use client"

import { Gamepad2, Trophy, Users, Star, TrendingUp, Play, MessageCircle, Heart, Sparkles, Zap, Target, Rocket, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PageWrapper } from "@/components/PageWrapper"
import { motion } from "framer-motion"

const games = [
  {
    id: 1,
    title: "Memory Match: Neural Drift",
    description: "Recalibrate your focus in this high-intensity neural synchronization challenge.",
    category: "Puzzle",
    difficulty: "Novice",
    image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    playCount: 15420,
    rating: 4.8,
    isMultiplayer: false,
    color: "from-blue-500 to-indigo-600"
  },
  {
    id: 2,
    title: "Code Blitz: Strike Protocol",
    description: "Execute precision algorithms in a battle of architectural dominance.",
    category: "Specialized",
    difficulty: "Advanced",
    image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    playCount: 8930,
    rating: 4.9,
    isMultiplayer: true,
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 3,
    title: "Lexicon: Nexus Hunt",
    description: "Decode hidden semantic patterns in this global vocabulary skirmish.",
    category: "Linguistic",
    difficulty: "Intermediate",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    playCount: 12450,
    rating: 4.7,
    isMultiplayer: true,
    color: "from-purple-500 to-pink-600"
  }
]

const gameCategories = [
  { name: "Simulation", count: 12, icon: Rocket, color: "text-blue-500" },
  { name: "Quantum", count: 18, icon: Zap, color: "text-amber-500" },
  { name: "Precision", count: 8, icon: Target, color: "text-rose-500" },
  { name: "Logic", count: 10, icon: Gamepad2, color: "text-emerald-500" }
]

const communityPosts = [
  {
    id: 1,
    author: "Sarah Johnson",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    title: "Neural Synergy Achieved!",
    content: "Just hit a 98% sync rate in Memory Match. The flow state is real!",
    likes: 24,
    comments: 8,
    timeAgo: "15m ago"
  },
  {
    id: 2,
    author: "Mike Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    title: "Code Blitz Optimization",
    content: "Discovered a shortcut in Level 4. Shaving 2s off the world record.",
    likes: 18,
    comments: 12,
    timeAgo: "2h ago"
  }
]

const leaderboard = [
  { rank: 1, user: "Alex Rodriguez", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80", totalScore: 15420, active: true },
  { rank: 2, user: "Jessica Park", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80", totalScore: 13890, active: true },
  { rank: 3, user: "David Kim", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80", totalScore: 12650, active: false }
]

export default function FunPage() {
  return (
    <PageWrapper className="min-h-screen bg-[#fafbfc]">
      {/* Hero Section */}
      <section className="bg-[#050810] text-white py-24 relative overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.3, 0.2]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-24 -right-24 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[120px]"
        />

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-purple-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles size={12} />
            Entertainment Nexus 2.0
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tighter"
          >
            Play. Connect. <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">Compete.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-slate-400 font-medium leading-relaxed"
          >
            The definitive hub for hyper-engaged entertainment. Recalibrate your focus,
            bridge community gaps, and ascend the global ranks.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Button size="lg" className="bg-white text-black hover:bg-purple-500 hover:text-white px-10 h-16 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-xl shadow-white/5" asChild>
              <Link href="/fun/games">Explore Arcade</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/10 bg-white/5 text-white hover:bg-white/10 px-10 h-16 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300" asChild>
              <Link href="/fun/community">Join The Pulse</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white relative">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {gameCategories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-purple-900/5 transition-all duration-500 rounded-[2.5rem] p-8 text-center cursor-pointer group h-full">
                  <div className={`w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 ${category.color}`}>
                    <category.icon size={32} strokeWidth={2.5} />
                  </div>
                  <h3 className="font-black text-slate-900 text-lg mb-2 uppercase tracking-tight">{category.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{category.count} Modules</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Games */}
      <section className="py-24 bg-[#fafbfc]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="text-left">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="flex items-center gap-2 text-purple-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4"
              >
                <Star size={14} className="fill-purple-600" />
                High Reliability Picks
              </motion.div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Active Deployments</h2>
            </div>
            <Button variant="ghost" className="font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-purple-600" asChild>
              <Link href="/fun/games">View Full Roster <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {games.map((game, index) => (
              <motion.div
                key={game.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[3rem] overflow-hidden group h-full">
                  <div className="aspect-[16/10] relative overflow-hidden">
                    <img src={game.image} alt={game.title} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
                    <div className="absolute bottom-6 left-6 flex items-center gap-2">
                      <span className="bg-white/10 backdrop-blur-md text-white text-[10px] font-black px-4 py-1.5 rounded-full border border-white/20 uppercase tracking-widest">
                        {game.category}
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <span className="text-xs font-black text-slate-900">{game.rating}</span>
                      </div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        {game.playCount.toLocaleString()} Syncs
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 mb-4 tracking-tight group-hover:text-purple-600 transition-colors uppercase italic">{game.title}</CardTitle>
                    <p className="text-slate-500 font-medium text-sm leading-relaxed mb-8">
                      {game.description}
                    </p>
                    <Button className="w-full bg-[#0d1321] hover:bg-purple-600 text-white rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] transition-all duration-300 shadow-lg shadow-black/5" asChild>
                      <Link href={`/fun/games/${game.id}`}>
                        <Play className="mr-2 h-4 w-4" />
                        Execute Build
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Leaderboard & Community Split */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Leaderboard */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center">
                  <Trophy className="text-amber-500" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Titan Ranks</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Daily Performance Metrics</p>
                </div>
              </div>

              <Card className="border-slate-100 rounded-[2.5rem] overflow-hidden shadow-inner bg-[#fafbfc]">
                <CardContent className="p-4 space-y-3">
                  {leaderboard.map((player) => (
                    <div key={player.rank} className="flex items-center gap-4 p-5 rounded-3xl bg-white border border-slate-100 hover:border-purple-500/30 transition-all group">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center font-black text-slate-400 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                        #{player.rank}
                      </div>
                      <img src={player.avatar} alt={player.user} className="w-14 h-14 rounded-2xl object-cover ring-4 ring-slate-50" />
                      <div className="flex-1">
                        <div className="font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase italic">
                          {player.user}
                          {player.active && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                        </div>
                        <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] mt-1">
                          Load: {player.totalScore.toLocaleString()} Nodes
                        </div>
                      </div>
                      <div className="text-2xl">
                        {player.rank === 1 && '👑'}
                        {player.rank === 2 && '👾'}
                        {player.rank === 3 && '🛡️'}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Community */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-4 mb-10">
                <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center">
                  <Users className="text-purple-500" size={28} />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Network Feed</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Real-time Engagement Logs</p>
                </div>
              </div>

              <div className="space-y-6">
                {communityPosts.map((post) => (
                  <Card key={post.id} className="border-slate-100 shadow-sm rounded-[2.5rem] hover:shadow-xl transition-all duration-500 overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-start gap-5">
                        <img src={post.avatar} alt={post.author} className="w-14 h-14 rounded-2xl object-cover" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex flex-col">
                              <span className="font-black text-slate-900 text-sm uppercase italic">{post.author}</span>
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{post.timeAgo}</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-400">
                              <button className="flex items-center gap-1.5 hover:text-rose-500 transition-colors">
                                <Heart className="h-4 w-4" />
                                <span className="text-[10px] font-black">{post.likes}</span>
                              </button>
                              <button className="flex items-center gap-1.5 hover:text-purple-500 transition-colors">
                                <MessageCircle className="h-4 w-4" />
                                <span className="text-[10px] font-black">{post.comments}</span>
                              </button>
                            </div>
                          </div>
                          <h3 className="font-black text-slate-900 mb-2 tracking-tight uppercase group-hover:text-purple-600 transition-colors">{post.title}</h3>
                          <p className="text-slate-500 font-medium text-sm leading-relaxed">{post.content}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#0d1321] text-white relative overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 5, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-purple-500 via-transparent to-emerald-500 pointer-events-none"
        />
        <div className="container text-center relative z-10">
          <h2 className="text-5xl font-black mb-8 tracking-tighter uppercase italic">
            Ascend To Elite
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto text-slate-400 font-medium leading-relaxed">
            Initialize your profile now to join the elite tier of visionaries on the leaderboard.
          </p>

          <Button
            className="bg-white text-black hover:bg-purple-600 hover:text-white h-16 px-16 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-white/5 transition-all duration-500"
            asChild
          >
            <Link href="/fun/games">Connect Global Lobby</Link>
          </Button>
        </div>
      </section>
    </PageWrapper>
  )
}