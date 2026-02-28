"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import TestimonialsDisplay from "@/components/TestimonialsDisplay"
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Target,
  Award,
  TrendingUp,
  Sparkles,
  Rocket,
  Globe,
  ShieldCheck,
  CheckCircle2
} from "lucide-react"
import { motion } from "framer-motion"
import { PageWrapper } from "@/components/PageWrapper"

export default function AboutClient({ initialTestimonials }: { initialTestimonials: any[] }) {
  const missionImage = "/images/about/mission.png"
  const visionImage = "/images/about/vision.png"
  const frameworkImage = "/images/about/framework.png"

  const features = [
    {
      icon: Users,
      title: "Learn",
      description: "Master new skills with our comprehensive courses and interactive lessons.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Target,
      title: "Earn",
      description: "Find your dream job or freelance opportunities in our curated marketplace.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: Award,
      title: "Social",
      description: "Connect with community, enjoy engaging games, and climb leaderboards.",
      color: "from-emerald-500 to-teal-600"
    },
    {
      icon: TrendingUp,
      title: "Apps",
      description: "Boost productivity with our collection of useful tools and utilities.",
      color: "from-emerald-500 to-teal-600"
    }
  ]

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
        "name": "About",
        "item": "https://www.celorisdesigns.com/about"
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

      <div className="container relative z-10 py-8 md:py-16">
        {/* Header Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6 mb-12"
        >
          <Button
            variant="ghost"
            asChild
            className="rounded-2xl border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 h-10 w-10 p-0 flex items-center justify-center transition-all"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <div className="text-emerald-500 text-[8px] font-black uppercase tracking-[0.3em] mb-1">Company Dossier</div>
            <h1 className="text-xl md:text-2xl font-black text-white italic uppercase tracking-tighter leading-none">About Celoris</h1>
          </div>
        </motion.div>

        <div className="max-w-6xl mx-auto space-y-24 md:space-y-32">
          {/* Mission Section with Image */}
          <section>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest">
                  <Sparkles size={10} /> Our Mission
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">Empowering <br />Digital Futures</h2>
                <p className="text-base md:text-lg text-slate-400 leading-relaxed font-medium italic uppercase tracking-wide">
                  At Celoris, we believe in empowering individuals and businesses through comprehensive
                  digital transformation. Our platform brings together learning, earning opportunities,
                  and engaging experiences in one unified ecosystem.
                </p>
                <div className="flex items-center gap-4 py-4 border-y border-white/5">
                  <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                    <Rocket className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                    Accelerating Local Nodes <br />Into The Global Grid
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                className="relative aspect-square md:aspect-video lg:aspect-square rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl group"
              >
                <img
                  src={missionImage}
                  alt="Digital Transformation"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050810] via-transparent to-transparent opacity-60" />
                <div className="absolute bottom-8 left-8 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                  <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">System Protocol</div>
                  <div className="text-xs font-bold text-white uppercase italic">Active Node Deployment</div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Features Grid & Framework Image */}
          <section>
            <div className="text-center mb-16 px-4">
              <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-4">The Celoris Framework</h2>
              <div className="h-1 w-20 bg-emerald-600 mx-auto rounded-full shadow-[0_0_20px_rgba(16,185,129,0.5)] mb-12" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="grid grid-cols-1 gap-8 lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ y: -5, scale: 1.01 }}
                      className="bg-[#0d1321]/40 border border-white/5 hover:border-emerald-500/30 backdrop-blur-3xl shadow-3xl rounded-[2rem] p-8 transition-all duration-500 group"
                    >
                      <div className={`w-12 h-12 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <h3 className="text-lg font-black text-white italic uppercase tracking-tighter mb-2">{feature.title}</h3>
                      <p className="text-xs text-slate-500 font-bold leading-relaxed uppercase tracking-wide">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="hidden lg:block relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-3xl h-full"
              >
                <img
                  src={frameworkImage}
                  alt="Infrastructure"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-emerald-900/10 mix-blend-overlay" />
              </motion.div>
            </div>
          </section>

          {/* Vision Section with Wide Image */}
          <section>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden shadow-3xl"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 items-stretch">
                <div className="relative h-64 lg:h-auto overflow-hidden">
                  <img
                    src={visionImage}
                    alt="Global Vision"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#050810]/80 hidden lg:block" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#050810]/80 lg:hidden" />
                </div>
                <div className="p-8 md:p-16 flex flex-col justify-center items-center lg:items-start text-center lg:text-left space-y-8">
                  <Globe className="h-12 w-12 text-emerald-500 mb-2 animate-pulse" />
                  <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">Our Global Vision</h2>
                  <p className="text-sm md:text-base text-slate-400 font-bold uppercase tracking-wide italic leading-relaxed">
                    "To be the leading platform that democratizes access to quality education,
                    employment opportunities, and digital tools, enabling anyone to build their
                    digital future regardless of their background or location."
                  </p>
                  <div className="flex items-center gap-3">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Universal Node Access Authorized</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>

          {/* Corporate Information */}
          <section>
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[2.5rem]" />
              <div className="relative bg-[#0d1321]/40 border border-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest">
                      <Award size={10} /> Corporate Identity
                    </div>
                    <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                      Legal <br /><span className="text-emerald-500">Foundation</span>
                    </h2>
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-wide leading-relaxed">
                      Celoris is operated by Celoris Designs LLP,<br />
                      a legally registered Indian company since 2019.
                    </p>
                    <div className="flex items-center gap-4 text-[10px] font-black text-slate-500 uppercase tracking-widest pt-4 border-t border-white/5">
                      Verifiable at: <Link href="https://mca.gov.in" target="_blank" className="text-emerald-400 hover:text-emerald-300 transition-colors underline decoration-emerald-500/30">mca.gov.in</Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/5 rounded-3xl p-6 border border-white/5">
                    <div className="space-y-1">
                      <p className="text-[8px] text-emerald-500 font-black uppercase tracking-[0.2em]">Legal Name</p>
                      <p className="text-xs font-bold text-white uppercase italic">Celoris Designs LLP</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] text-emerald-500 font-black uppercase tracking-[0.2em]">LLP ID No</p>
                      <p className="text-xs font-bold text-white uppercase italic">AAP-3965</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] text-emerald-500 font-black uppercase tracking-[0.2em]">GST Reg No</p>
                      <p className="text-xs font-bold text-white uppercase italic">09AAOFC5435B1ZJ</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[8px] text-emerald-500 font-black uppercase tracking-[0.2em]">Incorporated</p>
                      <p className="text-xs font-bold text-white uppercase italic">23rd May 2019</p>
                    </div>
                    <div className="sm:col-span-2 space-y-1 pt-4 border-t border-white/5">
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em]">Registered Under</p>
                      <p className="text-[10px] font-bold text-slate-300 uppercase italic leading-tight">
                        Limited Liability Partnership Act, 2008<br />
                        Ministry of Corporate Affairs, Government of India
                      </p>
                    </div>
                  </div>
                </div>

                {/* Decorative background logo/brand element */}
                <div className="absolute -bottom-12 -right-12 text-[#10b981]/5 select-none pointer-events-none transform rotate-12">
                  <Target scale={10} size={240} />
                </div>
              </div>
            </motion.div>
          </section>

          {/* Testimonials Section - Balanced Layout */}
          <section>
            <div className="text-center mb-16 px-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest mb-6">
                <ShieldCheck size={10} /> Verified Pulse
              </div>
              <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase tracking-tighter mb-4">Customer Feedback</h2>
              <p className="text-slate-500 font-black uppercase tracking-widest text-[8px] italic">
                Direct transmissions from our synchronized node network.
              </p>
            </div>

            <TestimonialsDisplay
              type="all"
              page="all"
              limit={3}
              layout="grid"
              showFeatured={false}
              showImages={false}
              className="mb-12"
              initialTestimonials={initialTestimonials}
            />
          </section>

          {/* Contact CTA - Refined Sizes */}
          <section className="pb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center space-y-10"
            >
              <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                Ready to Connect <br /><span className="text-emerald-500 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">with Celoris ?</span>
              </h2>
              <p className="text-base text-slate-400 max-w-xl mx-auto font-bold uppercase tracking-widest italic">
                Get in touch with our team to start your transformation.
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  asChild
                  className="bg-emerald-600 hover:bg-emerald-500 text-white h-16 px-12 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-3xl shadow-emerald-500/30 transition-all border-none"
                >
                  <Link href="/contact" className="flex items-center gap-3">
                    Establish Contact <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </motion.div>
          </section>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(300%); }
        }
      `}</style>
    </PageWrapper>
  )
}