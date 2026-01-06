'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, MapPin, Clock, AlertCircle, CheckCircle, Star, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface NoticeBoardItem {
  id: string
  title: string
  student_name: string
  subject: string
  location: string
  contact_number?: string | null
  description?: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  category: string
  requirements?: string
  duration?: string
  created_at: string
}

interface NoticeBoardResponse {
  data: NoticeBoardItem[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

const priorityConfig = {
  urgent: {
    label: 'URGENT',
    icon: AlertCircle,
    bgColor: 'bg-red-500/10',
    textColor: 'text-red-400',
    borderColor: 'border-l-red-500',
    iconColor: 'text-red-500'
  },
  high: {
    label: 'HIGH',
    icon: Star,
    bgColor: 'bg-orange-500/10',
    textColor: 'text-orange-400',
    borderColor: 'border-l-orange-500',
    iconColor: 'text-orange-500'
  },
  normal: {
    label: 'NORMAL',
    icon: CheckCircle,
    bgColor: 'bg-emerald-500/10',
    textColor: 'text-emerald-400',
    borderColor: 'border-l-emerald-500',
    iconColor: 'text-emerald-500'
  },
  low: {
    label: 'LOW',
    icon: Clock,
    bgColor: 'bg-blue-500/10',
    textColor: 'text-blue-400',
    borderColor: 'border-l-blue-500',
    iconColor: 'text-blue-500'
  }
}

const categoryIcons: { [key: string]: React.ElementType } = {
  tutoring: BookOpen,
  group_classes: Users,
  online: BookOpen,
  exam_prep: Star,
  language: BookOpen,
  music: BookOpen,
  sports: Users
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString()
  }
}

export default function NoticeBoard({ limit = 6 }: { limit?: number }) {
  const [notices, setNotices] = useState<NoticeBoardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/notice-board?limit=${limit}`)

        if (!response.ok) {
          throw new Error('Failed to fetch notice board data')
        }

        const result: NoticeBoardResponse = await response.json()
        setNotices(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [limit])

  const [selectedNotice, setSelectedNotice] = useState<NoticeBoardItem | null>(null)
  const [interestForm, setInterestForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedNotice) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/notice-board/interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notice_id: selectedNotice.id,
          ...interestForm
        })
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to submit interest')
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        setSubmitSuccess(false)
        setSelectedNotice(null)
        setInterestForm({ name: '', email: '', phone: '', message: '' })
      }, 2000)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex overflow-x-auto pb-6 gap-6 px-4 snap-x snap-mandatory scrollbar-hide">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="card-hover min-w-[300px] w-[350px] bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
            <CardContent className="p-10">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-white/10 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-white/10 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-white/10 rounded"></div>
                  <div className="h-3 bg-white/10 rounded w-5/6"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 bg-[#0d1321]/40 rounded-[2rem] border border-white/5">
        <div className="text-red-400 mb-6">
          <AlertCircle className="h-12 w-12 mx-auto mb-4" />
          <p className="font-bold uppercase tracking-widest text-[10px]">Error loading feed: {error}</p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
          className="border-white/10 text-white hover:bg-white/5"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex overflow-x-auto pb-10 gap-8 px-4 snap-x snap-mandatory scrollbar-hide">
        {notices.length === 0 ? (
          <div className="w-full text-center py-20 bg-[#0d1321]/40 rounded-[3rem] border border-white/5">
            <div className="text-slate-500">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="font-black uppercase tracking-[0.2em] text-[10px]">No entries available at the moment.</p>
            </div>
          </div>
        ) : (
          notices.map((notice) => {
            const config = priorityConfig[notice.priority]
            const CategoryIcon = categoryIcons[notice.category] || BookOpen

            return (
              <Card key={notice.id} className={`group border-l-4 ${config.borderColor} bg-[#0d1321]/60 backdrop-blur-3xl border-white/5 hover:border-emerald-500/30 transition-all duration-500 flex flex-col min-w-[320px] w-[400px] snap-center rounded-[2.5rem] overflow-hidden shadow-2xl`}>
                <CardHeader className="p-10 pb-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-10 h-10 ${config.bgColor} rounded-xl flex items-center justify-center border border-white/5`}>
                      <CategoryIcon className={`w-5 h-5 ${config.iconColor}`} />
                    </div>
                    <Badge className={`${config.bgColor} ${config.textColor} text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border-none`}>
                      {notice.priority}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl font-black text-white italic uppercase tracking-tighter line-clamp-2 leading-tight">
                    {notice.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-10 pt-4 flex-grow">
                  <div className="space-y-4 text-xs font-medium italic">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-slate-500 uppercase tracking-widest text-[10px] font-black">Student</span>
                      <span className="text-white">{notice.student_name}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-slate-500 uppercase tracking-widest text-[10px] font-black">Subject</span>
                      <span className="text-emerald-400">{notice.subject}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <span className="text-slate-500 uppercase tracking-widest text-[10px] font-black">Location</span>
                      <div className="flex items-center gap-2 text-white">
                        <MapPin size={12} className="text-emerald-500" />
                        <span>{notice.location}</span>
                      </div>
                    </div>

                    {notice.duration && (
                      <div className="flex items-center justify-between py-2 border-b border-white/5">
                        <span className="text-slate-500 uppercase tracking-widest text-[10px] font-black">Duration</span>
                        <span className="text-white">{notice.duration}</span>
                      </div>
                    )}

                    {notice.requirements && (
                      <div className="mt-4 p-4 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-slate-500 uppercase tracking-widest text-[10px] font-black block mb-2">Requirements</span>
                        <p className="text-slate-300 text-[11px] leading-relaxed line-clamp-3">{notice.requirements}</p>
                      </div>
                    )}

                    <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-6 flex items-center gap-2">
                      <Clock size={10} /> {getTimeAgo(notice.created_at)}
                    </div>
                  </div>
                </CardContent>
                <div className="p-10 pt-0 mt-auto">
                  <Button
                    className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/10 transition-all border-none"
                    onClick={() => setSelectedNotice(notice)}
                  >
                    Show Interest
                  </Button>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Interest Dialog */}
      {selectedNotice && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#0d1321] border border-white/10 rounded-[3rem] shadow-[0_32px_120px_rgba(0,0,0,0.8)] w-full max-w-md p-10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-transparent to-transparent pointer-events-none" />
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"
            >
              <Users size={24} />
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="h-12 w-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                <Sparkles className="text-emerald-400" size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Show Interest</h2>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">{selectedNotice.subject}</p>
              </div>
            </div>

            {submitSuccess ? (
              <div className="text-center py-12">
                <div className="h-20 w-20 bg-emerald-500 rounded-3xl mx-auto flex items-center justify-center mb-6 shadow-2xl shadow-emerald-500/20">
                  <CheckCircle className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-2">Interest Recorded</h3>
                <p className="text-slate-400 text-sm font-medium">We'll notify the student immediately.</p>
              </div>
            ) : (
              <form onSubmit={handleInterestSubmit} className="space-y-6 relative z-10">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-4 text-xs">
                  <AlertCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <p className="text-slate-300 font-medium">
                    Note: <span className="text-emerald-400 font-black">₹25</span> Protocol Fee will be deducted from your wallet to establish this link.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter your name"
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-white/10 transition-all outline-none"
                      value={interestForm.name}
                      onChange={(e) => setInterestForm({ ...interestForm, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="name@nexus.com"
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-white/10 transition-all outline-none"
                      value={interestForm.email}
                      onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Phone Link</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 . . . ."
                      className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-white placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-white/10 transition-all outline-none"
                      value={interestForm.phone}
                      onChange={(e) => setInterestForm({ ...interestForm, phone: e.target.value })}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-emerald-500/20 border-none mt-6" disabled={submitting}>
                  {submitting ? 'Transmitting...' : 'Confirm Interest'}
                </Button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </>
  )
}