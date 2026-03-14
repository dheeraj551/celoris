"use client"

import { Smartphone, Download, Star, Users, Zap, Shield, Palette, TrendingUp, Sparkles, ArrowRight, Layout, Globe, Cpu } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PageWrapper } from "@/components/PageWrapper"
import { motion, AnimatePresence } from "framer-motion"

const mobileApps = [
  {
    id: 1,
    name: "Celoris Learn",
    description: "Architect your cognitive growth with our mobile-first education layer.",
    category: "Education",
    icon: Globe,
    rating: 4.8,
    downloads: "50K+",
    isFeatured: true,
    platforms: ["iOS", "Android"],
    features: ["Offline Sync", "Neural Tracking", "Interactive Modules"],
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 2,
    name: "Celoris Play",
    description: "The definitive entertainment and interactive layer for high-impact networking and discovery.",
    category: "Play",
    icon: Users,
    rating: 4.7,
    downloads: "100K+",
    isFeatured: true,
    platforms: ["iOS", "Android"],
    features: ["Global Mesh", "Real-time Sync", "Direct Connect"],
    color: "from-purple-500 to-pink-500"
  },
  {
    id: 3,
    name: "Celoris Nexus",
    description: "A centralized hub for enterprise-level task orchestration and goal alignment.",
    category: "Ops",
    icon: Cpu,
    rating: 4.6,
    downloads: "75K+",
    isFeatured: true,
    platforms: ["iOS", "Android"],
    features: ["Logic Gates", "Priority Sort", "Team Sync"],
    color: "from-emerald-500 to-teal-500"
  }
]

const categories = [
  { name: "Education", count: 12, icon: Globe, color: "text-blue-500", bg: "bg-blue-50" },
  { name: "Play", count: 8, icon: Users, color: "text-purple-500", bg: "bg-purple-50" },
  { name: "Ops", count: 15, icon: Cpu, color: "text-emerald-500", bg: "bg-emerald-50" },
  { name: "Creative", count: 6, icon: Palette, color: "text-rose-500", bg: "bg-rose-50" }
]

const featuredApps = mobileApps.filter(app => app.isFeatured)

export default function AppsPage() {
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
        "name": "Apps",
        "item": "https://www.celorisdesigns.com/apps"
      }
    ]
  };

  return (
    <PageWrapper className="min-h-screen bg-[#fafbfc]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      {/* Hero Section */}
      <section className="bg-[#030712] text-white py-24 relative overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -top-48 -right-48 w-[800px] h-[800px] bg-blue-600/20 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute -bottom-48 -left-48 w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[120px]"
        />

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
          >
            <Sparkles size={12} />
            Global Software Ecosystem
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tighter"
          >
            AI-Driven Software <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Next-Gen Ecosystem.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-slate-400 font-medium leading-relaxed"
          >
            Deploying high-impact mobile solutions across education, interactive
            play, and enterprise operations. Scalable, secure, and beautiful.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-6 justify-center"
          >
            <Button size="lg" className="bg-white text-black hover:bg-blue-600 hover:text-white px-10 h-16 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 shadow-xl shadow-white/5" asChild>
              <Link href="#all-apps">Browse Registry</Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white/10 bg-white/5 text-white hover:bg-white/10 px-10 h-16 rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300" asChild>
              <Link href="#">Developer Portal</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-24 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-500 rounded-[2.5rem] p-8 text-center cursor-pointer group">
                  <div className={`w-16 h-16 ${category.bg} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 ${category.color}`}>
                    <category.icon size={32} />
                  </div>
                  <h3 className="font-black text-slate-900 text-lg mb-2 uppercase tracking-tight">{category.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{category.count} Deployed</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Apps Section */}
      <section className="py-24 bg-[#fafbfc]">
        <div className="container">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="text-left">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                className="flex items-center gap-2 text-blue-600 text-[10px] font-black uppercase tracking-[0.2em] mb-4"
              >
                <Zap size={14} className="fill-blue-600" />
                Priority Flagship Selection
              </motion.div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Active AI Deployments</h2>
            </div>
            <Button variant="ghost" className="font-black uppercase tracking-widest text-[10px] text-slate-400 hover:text-blue-600" asChild>
              <Link href="#all-apps">Full Catalog <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {featuredApps.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[3rem] overflow-hidden group h-full">
                  <CardHeader className="p-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${app.color} flex items-center justify-center text-white shadow-xl shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500`}>
                        <app.icon size={40} />
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-center gap-1 mb-1">
                          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                          <span className="text-xs font-black text-slate-900">{app.rating}</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.downloads} Load</span>
                      </div>
                    </div>
                    <CardTitle className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase italic">{app.name}</CardTitle>
                    <CardDescription className="text-slate-500 font-medium text-sm leading-relaxed mb-6">
                      {app.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-10 pb-10">
                    <div className="space-y-6">
                      <div className="flex flex-wrap gap-2">
                        {app.features.map((feature) => (
                          <span key={feature} className="bg-slate-50 text-slate-400 text-[10px] font-black px-3 py-1.5 rounded-lg border border-slate-100 uppercase tracking-widest">
                            {feature}
                          </span>
                        ))}
                      </div>
                      <Button className="w-full bg-[#0d1321] hover:bg-blue-600 text-white rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] transition-all duration-300 shadow-lg shadow-black/5" asChild>
                        <Link href={app.id === 1 ? "/video-studio" : app.id === 2 ? "/image-studio" : `/apps/${app.id}`}>
                          Open Studio
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Prop Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="container relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight uppercase italic mb-4">AI Ecosystem Integrity</h2>
            <p className="text-slate-500 font-medium text-lg">Architected for maximum reliability and user impact.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Peak Efficiency", icon: Zap, color: "text-blue-500", bg: "bg-blue-50", desc: "Optimized for minimal latency and maximum throughput on all mobile hardware." },
              { title: "Secured Nodes", icon: Shield, color: "text-emerald-500", bg: "bg-emerald-50", desc: "End-to-end encryption protocols ensuring total data sovereignty." },
              { title: "Visual Precision", icon: Palette, color: "text-purple-500", bg: "bg-purple-50", desc: "Pixel-perfect interfaces designed for high-end digital experiences." }
            ].map((prop, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-center space-y-6 group">
                  <div className={`w-20 h-20 ${prop.bg} ${prop.color} rounded-[2rem] flex items-center justify-center mx-auto transition-transform duration-500 group-hover:scale-110 shadow-lg shadow-slate-100`}>
                    <prop.icon size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">{prop.title}</h3>
                  <p className="text-slate-500 font-medium text-sm leading-relaxed max-w-xs mx-auto">
                    {prop.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Global CTA */}
      <section className="py-24 bg-[#0d1321] text-white relative overflow-hidden">
        <motion.div
          animate={{
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0 bg-gradient-to-br from-blue-500 via-transparent to-emerald-500 pointer-events-none"
        />
        <div className="container text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-center mb-10">
              <div className="w-24 h-24 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] flex items-center justify-center shadow-2xl">
                <Smartphone size={48} className="text-white" />
              </div>
            </div>
            <h2 className="text-5xl font-black mb-8 tracking-tighter uppercase italic">
              Synchronize Now
            </h2>
            <p className="text-xl mb-12 text-slate-400 font-medium leading-relaxed">
              Join 500k+ visionaries today. Download the Celoris Unified App for
              the full ecosystem experience on the go.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button className="bg-white text-black hover:bg-blue-600 hover:text-white h-16 px-12 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-500" asChild>
                <Link href="#">App Store Relay</Link>
              </Button>
              <Button className="bg-black border border-white/10 text-white hover:bg-emerald-600 h-16 px-12 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-500" asChild>
                <Link href="#">Google Play Hub</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
