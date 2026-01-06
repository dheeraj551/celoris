"use client"

import { useState, useEffect } from "react"
import { Briefcase, MapPin, Clock, DollarSign, Users, TrendingUp, Filter, Search, CheckCircle, AlertCircle, X, Laptop, Palette, LineChart, BarChart, Heart, Rocket, Settings, Sparkles, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import InterviewRooms from "@/components/InterviewRooms"
import { AdUnit } from "@/components/AdUnit"
import { PageWrapper } from "@/components/PageWrapper"
import { motion, AnimatePresence } from "framer-motion"

export default function EarnPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJob, setSelectedJob] = useState<any | null>(null)
  const [interestForm, setInterestForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job_id: selectedJob.id,
          ...interestForm
        })
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to submit application')
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        setSubmitSuccess(false)
        setSelectedJob(null)
        setInterestForm({ name: '', email: '', phone: '', message: '' })
      }, 2000)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
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

  const jobCategories = [
    { name: "Technology", count: 159, icon: Laptop, color: "text-blue-400", bg: "bg-blue-500/10" },
    { name: "Design", count: 83, icon: Palette, color: "text-rose-400", bg: "bg-rose-500/10" },
    { name: "Marketing", count: 124, icon: LineChart, color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { name: "Data Science", count: 67, icon: BarChart, color: "text-teal-400", bg: "bg-teal-500/10" },
    { name: "Sales", count: 98, icon: Briefcase, color: "text-amber-400", bg: "bg-amber-500/10" },
    { name: "Success", count: 45, icon: Heart, color: "text-red-400", bg: "bg-red-500/10" },
    { name: "Product", count: 78, icon: Rocket, color: "text-purple-400", bg: "bg-purple-500/10" },
    { name: "Operations", count: 30, icon: Settings, color: "text-slate-400", bg: "bg-slate-500/10" }
  ]

  return (
    <PageWrapper className="min-h-screen bg-[#050810] selection:bg-emerald-500/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-teal-600/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.05, 0.1, 0.05]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-emerald-600/10 rounded-full blur-[150px]"
        />
      </div>

      {/* Hero Section */}
      <section className="py-24 md:py-32 relative overflow-hidden z-10 border-b border-white/5 bg-[#0d1321]/40 backdrop-blur-3xl">
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.8, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
          >
            <Sparkles size={12} className="animate-pulse" /> Global Career Nexus
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-8xl font-black mb-8 tracking-tighter text-white italic uppercase"
          >
            Forge Your <br className="hidden md:block" /> Future Path
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl mb-12 max-w-2xl mx-auto text-slate-400 font-medium leading-relaxed italic"
          >
            Connect with industry-leading organizations and unlock career architectures that redefine your professional destiny.
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl px-12 h-16 font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-500/20">
                Browse Opportunities
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Job Categories */}
      <section className="py-32 relative z-10">
        <div className="container">
          <div className="text-center mb-24">
            <div className="flex items-center justify-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
              <Filter size={14} /> Career Domains
            </div>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase mb-6">
              Explore Sectors
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto font-medium italic">
              Strategic deployments across high-impact industry sectors.
            </p>
          </div>

          <motion.div
            variants={{
              show: { transition: { staggerChildren: 0.05 } }
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {jobCategories.map((category) => (
              <motion.div
                key={category.name}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { opacity: 1, y: 0 }
                }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-[#0d1321]/60 backdrop-blur-3xl border-white/5 hover:border-emerald-500/30 transition-all duration-500 rounded-[2.5rem] overflow-hidden group shadow-2xl">
                  <CardContent className="p-10 text-center flex flex-col items-center">
                    <div className={`w-20 h-20 ${category.bg} rounded-2xl flex items-center justify-center mb-8 border border-white/5 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-2xl shadow-emerald-500/5`}>
                      <category.icon size={32} className={category.color} />
                    </div>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-2 group-hover:text-emerald-400 transition-colors leading-none">{category.name}</h3>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] italic">{category.count} Postings</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className="py-12 relative z-10">
        <div className="container">
          <div className="bg-[#0d1321]/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden">
            <AdUnit slot="9266909448" />
          </div>
        </div>
      </section>

      <InterviewRooms />

      {/* Recent Job Listings */}
      <section className="py-32 relative z-10">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between mb-24 gap-10">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                <Rocket size={14} /> LIVE OPPORTUNITIES
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter italic uppercase">
                Active Uplinks
              </h2>
              <p className="text-lg text-slate-400 font-medium italic mt-4">
                High-priority roles from verified network partners.
              </p>
            </div>
            <div className="flex-1 h-[2px] bg-gradient-to-r from-emerald-500/10 via-white/5 to-transparent hidden md:block" />
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#050810] bg-[#0d1321] overflow-hidden">
                    <div className="w-full h-full bg-emerald-500/10 animate-pulse" />
                  </div>
                ))}
              </div>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">+2.4k Talents Engaged</span>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-32 bg-[#0d1321]/20 rounded-[3rem] border border-white/5">
              <div className="h-16 w-16 bg-emerald-500/20 border-2 border-emerald-500/50 border-t-emerald-500 rounded-full animate-spin mx-auto mb-8 shadow-2xl shadow-emerald-500/20" />
              <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px] italic">Synchronizing Career Matrix...</p>
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
                <motion.div
                  key={job.id}
                  variants={{
                    hidden: { opacity: 0, x: -20 },
                    show: { opacity: 1, x: 0 }
                  }}
                  whileHover={{ x: 10 }}
                  className="transition-all duration-500"
                >
                  <Card className="bg-[#0d1321]/40 backdrop-blur-3xl border-white/5 hover:border-emerald-500/30 transition-all duration-500 rounded-[3rem] overflow-hidden group shadow-[0_32px_120px_rgba(0,0,0,0.5)]">
                    <CardContent className="p-10 md:p-14">
                      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-12">
                        <div className="flex-1">
                          <div className="flex items-center gap-8 mb-10 flex-wrap">
                            <div className="w-24 h-24 rounded-[2rem] bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center shadow-2xl shadow-emerald-600/20 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 border border-white/10 shrink-0">
                              <Briefcase className="h-10 w-10 text-white" />
                            </div>
                            <div>
                              <div className="flex flex-wrap gap-2 mb-3">
                                {job.isRemote && (
                                  <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">REMOTE</Badge>
                                )}
                                {job.isFeatured && (
                                  <Badge className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg">PRIORITY</Badge>
                                )}
                              </div>
                              <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-1 leading-none">{job.title}</h3>
                              <p className="text-slate-500 font-black uppercase text-[10px] tracking-[0.3em] italic">{job.company}</p>
                            </div>
                          </div>

                          <p className="text-slate-400 mb-12 line-clamp-2 font-medium italic text-lg leading-relaxed max-w-4xl">
                            {job.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-10">
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                              <MapPin className="h-4 w-4 text-emerald-500" />
                              <span>{job.location}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-emerald-400 italic">
                              <DollarSign className="h-4 w-4" />
                              <span>{job.salary}</span>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500 italic">
                              <Clock className="h-4 w-4 text-emerald-500" />
                              <span>{job.employmentType}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col md:flex-row lg:flex-col items-stretch lg:items-end gap-8 shrink-0">
                          <div className="flex flex-wrap gap-3 lg:justify-end">
                            {job.skills?.slice(0, 3).map((skill: string) => (
                              <span
                                key={skill}
                                className="bg-white/5 border border-white/10 text-slate-400 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider italic"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-col items-stretch lg:items-end gap-6">
                            <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] flex items-center gap-2 italic">
                              <TrendingUp size={10} /> TRANSMITTED: {job.posted}
                            </span>
                            <Button
                              onClick={() => setSelectedJob(job)}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-[1.5rem] px-12 h-16 font-black uppercase tracking-widest text-xs shadow-3xl shadow-emerald-500/20 transition-all duration-300 border-none group"
                            >
                              Launch Uplink <ArrowRight size={16} className="ml-3 group-hover:translate-x-1 transition-transform" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

        </div>
      </section>

      {/* Application Modal */}
      <AnimatePresence>
        {selectedJob && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedJob(null)}
              className="absolute inset-0 bg-[#050810]/95 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="bg-[#0d1321] border border-white/10 rounded-[3.5rem] shadow-[0_64px_160px_rgba(0,0,0,0.9)] w-full max-w-2xl p-10 md:p-16 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-transparent pointer-events-none" />

              <button
                onClick={() => setSelectedJob(null)}
                className="absolute top-12 right-12 text-slate-600 hover:text-white transition-colors"
              >
                <X className="w-8 h-8" />
              </button>

              <div className="mb-14 relative z-10">
                <div className="flex items-center gap-4 mb-8">
                  <div className="h-16 w-16 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                    <Sparkles className="text-emerald-400" size={32} />
                  </div>
                  <div>
                    <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none mb-2">Protocol Deployment</h2>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic">Link established: {selectedJob.title} @ {selectedJob.company}</p>
                  </div>
                </div>
                <div className="h-[2px] w-40 bg-gradient-to-r from-emerald-500/50 to-transparent" />
              </div>

              {submitSuccess ? (
                <div className="text-center py-20 relative z-10">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="h-32 w-32 bg-emerald-500 rounded-[3rem] mx-auto flex items-center justify-center mb-10 shadow-3xl shadow-emerald-500/30">
                    <CheckCircle className="h-16 w-16 text-white" />
                  </motion.div>
                  <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-3">Transmission Successful</h3>
                  <p className="text-slate-400 text-lg font-medium italic">Your professional profile has been bridged to the recruitment nexus.</p>
                </div>
              ) : (
                <form onSubmit={handleApplySubmit} className="space-y-10 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="bg-emerald-500/5 border border-emerald-500/20 rounded-[2rem] p-8 flex items-start gap-6"
                  >
                    <AlertCircle className="w-8 h-8 flex-shrink-0 text-emerald-400" />
                    <div>
                      <h4 className="text-emerald-400 text-xs font-black uppercase tracking-widest mb-1">Network Transmission Protocol</h4>
                      <p className="text-slate-400 text-sm font-medium italic">
                        A <span className="text-white font-black">₹25 Uplink Fee</span> will be deducted from your secure vault to finalize this bridge.
                      </p>
                    </div>
                  </motion.div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-6 italic">Personnel Identifier</label>
                      <Input
                        required
                        placeholder="Full Name"
                        className="h-16 bg-white/5 border-white/10 rounded-[1.5rem] px-8 text-white text-lg placeholder:text-slate-700 focus:border-emerald-500/50 focus:bg-white/10 transition-all border outline-none font-bold"
                        value={interestForm.name}
                        onChange={(e) => setInterestForm({ ...interestForm, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-6 italic">Interface (Email)</label>
                      <Input
                        type="email"
                        required
                        placeholder="name@nexus.com"
                        className="h-16 bg-white/5 border-white/10 rounded-[1.5rem] px-8 text-white text-lg placeholder:text-slate-700 focus:border-emerald-500/50 focus:bg-white/10 transition-all border outline-none font-bold"
                        value={interestForm.email}
                        onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-6 italic">Communication Bridge (Phone)</label>
                    <Input
                      type="tel"
                      required
                      placeholder="+91 . . . ."
                      className="h-16 bg-white/5 border-white/10 rounded-[1.5rem] px-8 text-white text-lg placeholder:text-slate-700 focus:border-emerald-500/50 focus:bg-white/10 transition-all border outline-none font-bold"
                      value={interestForm.phone}
                      onChange={(e) => setInterestForm({ ...interestForm, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-6 italic">Engagement Parameters (Optional)</label>
                    <textarea
                      className="w-full p-8 bg-white/5 border border-white/10 rounded-[2rem] text-white placeholder:text-slate-700 focus:border-emerald-500/50 focus:bg-white/10 transition-all min-h-[160px] outline-none font-medium italic"
                      placeholder="Outline your strategic objectives..."
                      value={interestForm.message}
                      onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
                    />
                  </div>
                  <Button type="submit" className="w-full h-20 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-xs shadow-3xl shadow-emerald-500/30 border-none mt-4 transition-all" disabled={submitting}>
                    {submitting ? 'TRANSMITTING DATA...' : 'ESTABLISH SECURE UPLINK'}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageWrapper>
  )
}