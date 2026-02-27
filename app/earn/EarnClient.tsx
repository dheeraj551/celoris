"use client"

import { useState, useEffect } from "react"
import { Briefcase, MapPin, Clock, DollarSign, Users, TrendingUp, Filter, Search, CheckCircle, AlertCircle, X, Rocket, Sparkles, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import InterviewRooms from "@/components/InterviewRooms"
import { AdUnit } from "@/components/AdUnit"
import { PageWrapper } from "@/components/PageWrapper"
import { motion, AnimatePresence } from "framer-motion"
import JobApplicationForm from "@/components/earn/JobApplicationForm"
import { createClient } from "@/lib/supabase-client"

const HIRING_FEEDS = [
  "TechNova Solutions hired Aarav Mehta for AI-Powered Chatbot Development",
  "BlueWave Systems hired Neha Sharma for Cloud Infrastructure Migration",
  "CodeCraft Labs hired Rohan Verma for E-commerce Web App Revamp",
  "NextGen Infotech hired Priya Iyer for Data Analytics Dashboard",
  "PixelCore Technologies hired Kunal Singh for Mobile App UI/UX Redesign",
  "InnoSoft Pvt Ltd hired Sneha Kapoor for CRM System Integration",
  "Skyline Digital hired Aditya Malhotra for Blockchain Wallet Development",
  "QuantumByte Solutions hired Pooja Nair for Machine Learning Model Optimization",
  "HexaTech Global hired Vikram Joshi for Cybersecurity Risk Assessment",
  "Vertex IT Services hired Ananya Gupta for SaaS Platform Performance Optimization"
]

function ScrollingTicker() {
  return (
    <div className="w-full overflow-hidden bg-emerald-500/5 border-y border-emerald-500/10 py-3 mb-16 relative">
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#050810] to-transparent z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#050810] to-transparent z-10" />

      <motion.div
        animate={{
          x: [0, -2000],
        }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex whitespace-nowrap gap-12 items-center"
      >
        {[...HIRING_FEEDS, ...HIRING_FEEDS].map((text, i) => (
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


export default function EarnClient({ initialJobs = [] }: { initialJobs?: any[] }) {
  const [jobs, setJobs] = useState<any[]>(initialJobs)
  const [loading, setLoading] = useState(initialJobs.length === 0)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJob, setSelectedJob] = useState<any | null>(null)
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({})

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }))
  }

  useEffect(() => {
    // Initial fetch
    loadJobs()

    // Set up real-time subscription
    const supabase = createClient()
    const channel = supabase
      .channel('jobs-realtime-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs'
        },
        (payload) => {
          console.log('Jobs table changed, refreshing...', payload)
          loadJobs()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/jobs?limit=6')
      const result = await response.json()

      if (result.success) {
        setJobs(result.data)
      }
    } catch (error) {
      console.error('Error loading jobs:', error)
    } finally {
      setLoading(false)
    }
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
        "name": "Earn",
        "item": "https://www.celorisdesigns.com/earn"
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
            animate={{ opacity: 0.8, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-8"
          >
            <Sparkles size={12} className="animate-pulse" /> Global Career Nexus
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight text-white italic uppercase"
          >
            Earn Online — Fresh Freelance Opportunities Every Day
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl mb-10 max-w-2xl mx-auto text-slate-400 font-medium leading-relaxed italic"
          >
            Connect with industry-leading organizations and unlock career architectures that redefine your professional destiny.
          </motion.p>
        </div>
      </section>



      <InterviewRooms />

      {/* Recent Job Listings */}
      <section className="py-24 relative z-10 bg-[#0d1321]/30">
        <div className="max-w-6xl mx-auto px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8 text-center md:text-left">
            <div>
              <div className="inline-flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-4">
                <Rocket size={14} /> LIVE OPPORTUNITIES
              </div>
              <h2 className="text-4xl font-bold text-white tracking-tight italic uppercase">Active Jobs</h2>
              <p className="text-lg text-slate-400 font-medium italic mt-2">
                High-priority roles from verified network partners.
              </p>
            </div>
          </div>

          <ScrollingTicker />

          {loading ? (
            <div className="text-center py-20 bg-[#050810] rounded-[2rem] border border-white/5">
              <div className="h-12 w-12 border-4 border-emerald-500/10 border-t-emerald-600 rounded-full animate-spin mx-auto mb-6" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Matrix...</p>
            </div>
          ) : (
            <motion.div
              variants={{
                show: { transition: { staggerChildren: 0.1 } }
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="space-y-12"
            >
              {jobs.map((job) => (
                <div key={job.id} className="transition-all">
                  <Card className="bg-white/5 border-white/5 hover:border-emerald-500/30 transition-all rounded-[2rem] overflow-hidden group shadow-none hover:shadow-2xl hover:shadow-emerald-500/10">
                    <CardContent className="p-8 md:p-10">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
                        <div className="flex-1">
                          <div className="flex items-center gap-6 mb-8 flex-wrap">
                            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-500 shrink-0">
                              <Briefcase className="h-8 w-8 text-emerald-500" />
                            </div>
                            <div>
                              <div className="flex flex-wrap gap-2 mb-2">
                                {job.isRemote && (
                                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[8px] font-bold uppercase tracking-widest">REMOTE</Badge>
                                )}
                                {job.isFeatured && (
                                  <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[8px] font-bold uppercase tracking-widest">PRIORITY</Badge>
                                )}
                              </div>
                              <h3 className="text-2xl font-bold text-white tracking-tight mb-1 italic uppercase">{job.title}</h3>
                              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest">{job.company}</p>
                            </div>
                          </div>

                          <div className="relative">
                            <p className={`text-slate-400 mb-6 font-medium italic text-base leading-relaxed max-w-4xl transition-all duration-500 ${expandedJobs[job.id] ? 'line-clamp-none' : 'line-clamp-2'}`}>
                              {job.description}
                            </p>

                            <button
                              onClick={() => toggleJobExpansion(job.id)}
                              className="text-emerald-500 text-[9px] font-bold uppercase tracking-widest mb-10 hover:text-emerald-400 flex items-center gap-1"
                            >
                              {expandedJobs[job.id] ? (
                                <>HIDE DETAILS <ChevronUp size={12} /></>
                              ) : (
                                <>VIEW DETAILS <ChevronDown size={12} /></>
                              )}
                            </button>

                            <AnimatePresence>
                              {expandedJobs[job.id] && (
                                <motion.div
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: "auto" }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden mb-10 space-y-6"
                                >
                                  {job.responsibilities && job.responsibilities.length > 0 && (
                                    <div className="space-y-3">
                                      <h4 className="text-white font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 italic">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Responsibilities
                                      </h4>
                                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {job.responsibilities.map((resp: string, idx: number) => (
                                          <li key={idx} className="flex gap-2 text-slate-500 text-xs italic font-medium">
                                            <span className="text-emerald-500">•</span> {resp}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {job.requirements && job.requirements.length > 0 && (
                                    <div className="space-y-3">
                                      <h4 className="text-slate-900 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Requirements
                                      </h4>
                                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {job.requirements.map((req: string, idx: number) => (
                                          <li key={idx} className="flex gap-2 text-slate-500 text-xs italic font-medium">
                                            <span className="text-emerald-500">•</span> {req}
                                          </li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}

                                  {job.benefits && job.benefits.length > 0 && (
                                    <div className="space-y-3">
                                      <h4 className="text-white font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 italic">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Benefits
                                      </h4>
                                      <div className="flex flex-wrap gap-2">
                                        {job.benefits.map((benefit: string, idx: number) => (
                                          <span key={idx} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider italic">
                                            {benefit}
                                          </span>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          <div className="flex flex-wrap items-center gap-8">
                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 italic">
                              <MapPin className="h-3.5 w-3.5 text-emerald-500" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-emerald-600 italic">
                              <DollarSign className="h-3.5 w-3.5" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-400 italic">
                              <Clock className="h-3.5 w-3.5 text-emerald-500" />
                              <span>{job.employmentType}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row lg:flex-col items-stretch lg:items-end gap-6 shrink-0">
                          <div className="flex flex-wrap gap-2 lg:justify-end">
                            {job.skills?.slice(0, 3).map((skill: string) => (
                              <span
                                key={skill}
                                className="bg-white/5 border border-white/10 text-slate-400 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider italic"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-col items-stretch lg:items-end gap-4">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2 italic">
                              <TrendingUp size={10} /> TRANSMITTED: {job.posted}
                            </span>
                            <Button
                              onClick={() => setSelectedJob(job)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-10 h-14 font-bold text-sm shadow-xl shadow-emerald-500/10 transition-all border-none group"
                            >
                              Apply Now <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </motion.div>
          )}

        </div>
      </section>

      {/* Application Form */}
      <AnimatePresence>
        {selectedJob && (
          <JobApplicationForm
            isOpen={true}
            onClose={() => setSelectedJob(null)}
            jobId={selectedJob.id}
            jobTitle={selectedJob.title}
          />
        )}
      </AnimatePresence>
    </div>
  )
}