"use client"

import React, { useState, useEffect, useRef, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail,
  MessageSquare,
  Send,
  Loader2,
  Shield,
  Clock,
  CheckCircle,
  PhoneCall,
  Video,
  Radio,
  ExternalLink,
  ChevronLeft,
  User,
  GraduationCap,
  Sparkles,
  BookOpen,
  Search,
  RefreshCw,
  ArrowRight,
  AlertCircle,
  LogIn,
} from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { formatDistanceToNow } from 'date-fns'

function StudentInboxContent() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email')?.trim() || ''

  const { user, profile, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<'messages' | 'inquiries'>('messages')
  const [loading, setLoading] = useState(true)
  const [messages, setMessages] = useState<any[]>([])
  const [inquiries, setInquiries] = useState<any[]>([])
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [replySending, setReplySending] = useState(false)
  const [replyError, setReplyError] = useState<string | null>(null)
  const [replySuccess, setReplySuccess] = useState(false)
  const [lookupEmail, setLookupEmail] = useState(emailParam)
  const [activeEmail, setActiveEmail] = useState(emailParam)
  const chatScrollRef = useRef<HTMLDivElement>(null)

  const fetchMessagesAndInquiries = async (emailToUse?: string) => {
    const targetEmail = (emailToUse || activeEmail || user?.email || lookupEmail || '').trim().toLowerCase()
    if (!targetEmail) {
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`/api/student/messages?email=${encodeURIComponent(targetEmail)}`)
      const data = await res.json()
      if (data.error) throw new Error(data.error)

      const fetchedMessages = data.messages || []
      const fetchedInquiries = data.inquiries || []
      setMessages(fetchedMessages)
      setInquiries(fetchedInquiries)
      setActiveEmail(targetEmail)
      setLookupEmail(targetEmail)

      // Auto-switch to inquiries if user has active course requests but no trainer messages yet
      if (fetchedMessages.length === 0 && fetchedInquiries.length > 0) {
        setActiveTab('inquiries')
      }

      // Auto-select first trainer conversation if none selected
      if (fetchedMessages.length > 0 && !selectedTrainerId) {
        const firstTrainerId = fetchedMessages[0].trainer_id
        setSelectedTrainerId(firstTrainerId)
      }
    } catch (err) {
      console.error('Failed to load student messages:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (emailParam) {
      setLookupEmail(emailParam)
      setActiveEmail(emailParam)
      fetchMessagesAndInquiries(emailParam)
    } else if (!authLoading) {
      if (user?.email) {
        setLookupEmail(user.email)
        setActiveEmail(user.email)
        fetchMessagesAndInquiries(user.email)
      } else {
        setLoading(false)
      }
    }
  }, [emailParam, user?.email, authLoading])

  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight
    }
  }, [messages, selectedTrainerId])

  // Group messages by trainerId
  const threadsByTrainer = React.useMemo(() => {
    const map = new Map<string, { trainerId: string; trainerName: string; trainerAvatar: string | null; specialization: string; lastMessage: any; messages: any[] }>()

    messages.forEach((m) => {
      const key = m.trainer_id || 'unknown'
      if (!map.has(key)) {
        map.set(key, {
          trainerId: key,
          trainerName: m.trainer_name || 'Verified Trainer',
          trainerAvatar: m.trainer_avatar,
          specialization: m.trainer_specialization || 'Celoris Instructor',
          lastMessage: m,
          messages: [],
        })
      }
      const thread = map.get(key)!
      thread.messages.push(m)
      thread.lastMessage = m
    })

    return Array.from(map.values())
  }, [messages])

  const activeThread = threadsByTrainer.find((t) => t.trainerId === selectedTrainerId) || threadsByTrainer[0]

  const handleSendReply = async () => {
    if (!replyText.trim() || !activeThread) return

    setReplySending(true)
    setReplyError(null)

    try {
      const res = await fetch('/api/student/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          trainerId: activeThread.trainerId,
          studentName: profile?.full_name || user?.user_metadata?.full_name || 'Student',
          studentEmail: user?.email || activeEmail,
          subject: `Re: ${activeThread.lastMessage?.subject || 'Course Training'}`,
          messageText: replyText.trim(),
        }),
      })

      const data = await res.json()
      if (!res.ok || data.error) {
        throw new Error(data.error || 'Failed to send reply')
      }

      setReplyText('')
      setReplySuccess(true)
      setTimeout(() => setReplySuccess(false), 3000)

      // Refresh messages
      await fetchMessagesAndInquiries(activeEmail)
    } catch (err: any) {
      setReplyError(err.message || 'Error sending reply')
    } finally {
      setReplySending(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-white">
      {/* Top Bar / Navigation Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.08] bg-[#07090e]/85 backdrop-blur-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to Academy</span>
            </Link>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h1 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                  <span>Student Mailbox</span>
                  <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.2 rounded-full">
                    Direct
                  </span>
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchMessagesAndInquiries(activeEmail)}
              disabled={loading}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              title="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">
              <Shield className="w-3.5 h-3.5" />
              <span>Contact Shield Protected</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Guest or Email Lookup Prompt */}
        {!user && !activeEmail && (
          <div className="mb-6 p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/20 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>Access Your Student Messages</span>
                </div>
                <h2 className="text-lg font-bold text-white">Track responses from trainers & class invitations</h2>
                <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
                  Sign in with your Google or Celoris account to automatically load messages, or enter the email address you used when requesting course information.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full md:w-auto">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="email"
                    placeholder="Enter your inquiry email..."
                    value={lookupEmail}
                    onChange={(e) => setLookupEmail(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && lookupEmail.trim() && fetchMessagesAndInquiries(lookupEmail.trim())}
                    className="w-full sm:w-64 pl-9 pr-3 py-2 text-xs bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={() => lookupEmail.trim() && fetchMessagesAndInquiries(lookupEmail.trim())}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-emerald-600/20 shrink-0"
                >
                  View Messages
                </button>
                <Link
                  href="/login"
                  className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-3 border-b border-white/[0.08] mb-6 pb-2">
          <button
            onClick={() => setActiveTab('messages')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'messages'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Trainer Conversations</span>
            {threadsByTrainer.length > 0 && (
              <span className="text-[10px] bg-emerald-500 text-black font-extrabold px-1.5 py-0.2 rounded-full">
                {threadsByTrainer.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('inquiries')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'inquiries'
                ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.15)]'
                : 'text-neutral-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>My Course Inquiries</span>
            {inquiries.length > 0 && (
              <span className="text-[10px] bg-white/10 text-neutral-300 font-bold px-1.5 py-0.2 rounded-full">
                {inquiries.length}
              </span>
            )}
          </button>
        </div>

        {/* Main Content Area */}
        {activeTab === 'messages' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
            {/* Left Column: Trainer Threads List (4 cols) */}
            <div className="lg:col-span-4 bg-[#0c0f17] border border-white/[0.08] rounded-3xl p-4 flex flex-col shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  Conversations ({threadsByTrainer.length})
                </span>
                {activeEmail && (
                  <span className="text-[11px] text-emerald-400 font-mono truncate max-w-[160px]" title={activeEmail}>
                    {activeEmail}
                  </span>
                )}
              </div>

              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-neutral-500 gap-3">
                  <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                  <span className="text-xs">Loading conversations...</span>
                </div>
              ) : threadsByTrainer.length === 0 ? (
                inquiries.length > 0 ? (
                  <div className="py-14 px-4 text-center text-neutral-400 space-y-3 my-auto">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto text-emerald-400">
                      <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white">Inquiries Under Review</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      We found {inquiries.length} course inquiry submitted under <span className="text-emerald-400 font-mono">{activeEmail}</span>. Trainers are reviewing your requirements.
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab('inquiries')}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-emerald-600/20"
                    >
                      <span>View My Inquiries ({inquiries.length})</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="py-16 px-4 text-center text-neutral-400 space-y-3 my-auto">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-500">
                      <MessageSquare className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white">No Messages Yet</h3>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      When trainers reach out regarding your learning requirements, their responses and call invitations will appear right here.
                    </p>
                    <Link
                      href="/learn"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors shadow-md shadow-emerald-600/20"
                    >
                      <span>Browse Courses</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                )
              ) : (
                <div className="space-y-2 overflow-y-auto flex-1 pr-1 max-h-[600px]">
                  {threadsByTrainer.map((thread) => {
                    const isSelected = thread.trainerId === activeThread?.trainerId
                    return (
                      <button
                        key={thread.trainerId}
                        type="button"
                        onClick={() => setSelectedTrainerId(thread.trainerId)}
                        className={`w-full text-left p-3.5 rounded-2xl transition-all border flex items-start gap-3 ${
                          isSelected
                            ? 'bg-emerald-500/10 border-emerald-500/30 shadow-[0_4px_20px_rgba(16,185,129,0.1)]'
                            : 'bg-white/[0.02] border-white/[0.04] hover:bg-white/[0.05] hover:border-white/[0.08]'
                        }`}
                      >
                        <div className="relative shrink-0">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-sm shadow-sm overflow-hidden">
                            {thread.trainerAvatar ? (
                              <img src={thread.trainerAvatar} alt={thread.trainerName} className="w-full h-full object-cover" />
                            ) : (
                              thread.trainerName.charAt(0).toUpperCase()
                            )}
                          </div>
                          <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-[#0c0f17] rounded-full" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1 mb-0.5">
                            <p className="text-xs font-bold text-white truncate">{thread.trainerName}</p>
                            <span className="text-[10px] text-neutral-500 shrink-0">
                              {thread.lastMessage?.created_at
                                ? formatDistanceToNow(new Date(thread.lastMessage.created_at), { addSuffix: true })
                                : ''}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-400 font-medium truncate mb-1">
                            {thread.lastMessage?.subject || thread.specialization}
                          </p>
                          <p className="text-[11px] text-neutral-400 truncate line-clamp-1">
                            {thread.lastMessage?.body || 'Message sent'}
                          </p>
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Right Column: Chat Conversation Stream & Composer (8 cols) */}
            <div className="lg:col-span-8 bg-[#0c0f17] border border-white/[0.08] rounded-3xl flex flex-col shadow-xl overflow-hidden min-h-[600px]">
              {activeThread ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 sm:p-5 border-b border-white/[0.08] bg-[#090b10] flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-base shadow-sm overflow-hidden">
                        {activeThread.trainerAvatar ? (
                          <img src={activeThread.trainerAvatar} alt={activeThread.trainerName} className="w-full h-full object-cover" />
                        ) : (
                          activeThread.trainerName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-white">{activeThread.trainerName}</h3>
                          <span className="text-[10px] bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold px-2 py-0.2 rounded-full">
                            Verified Trainer
                          </span>
                        </div>
                        <p className="text-xs text-neutral-400 mt-0.5">{activeThread.specialization}</p>
                      </div>
                    </div>

                    <div className="hidden sm:flex items-center gap-2">
                      <div className="px-3 py-1 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[11px] text-neutral-300">
                        Course: <strong className="text-white">{activeThread.lastMessage?.subject || 'Training'}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Chat Messages Stream */}
                  <div ref={chatScrollRef} className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[420px] bg-black/20">
                    <div className="text-center my-2">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-500 bg-white/[0.03] border border-white/[0.06] px-3 py-1 rounded-full">
                        Secure In-App Chat • Contact Shield Active
                      </span>
                    </div>

                    {activeThread.messages.map((msg, idx) => {
                      const isTrainer = msg.is_from_trainer
                      const isCallInvite = msg.body?.includes('/classrooms?room=call-') || msg.subject?.includes('Call Invitation')

                      return (
                        <div
                          key={msg.id || idx}
                          className={`flex gap-3 ${isTrainer ? 'justify-start' : 'justify-end'}`}
                        >
                          {isTrainer && (
                            <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-1">
                              {activeThread.trainerName.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div
                            className={`max-w-md sm:max-w-lg rounded-2xl p-4 text-xs leading-relaxed ${
                              isTrainer
                                ? 'bg-white/[0.06] border border-white/[0.1] text-neutral-200'
                                : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-900/30'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-75 font-semibold">
                              <span>{isTrainer ? activeThread.trainerName : 'You (Student)'}</span>
                              <span>
                                {msg.created_at ? formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }) : ''}
                              </span>
                            </div>

                            <p className="whitespace-pre-wrap text-sm">{msg.body}</p>

                            {/* Live Call Invitation Interactive Action */}
                            {isCallInvite && (
                              <div className="mt-3 p-3 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-indigo-300 font-bold text-xs">
                                  <Radio className="w-4 h-4 animate-pulse" />
                                  <span>1-on-1 Live Room Ready</span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const match = msg.body?.match(/\/classrooms\?room=[^\s]+/);
                                    if (match) window.open(match[0], '_blank');
                                  }}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                                >
                                  <span>Join Call</span>
                                  <ExternalLink className="w-3 h-3" />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Chat Composer */}
                  <div className="p-4 border-t border-white/[0.08] bg-[#090b10] space-y-2.5">
                    {replyError && (
                      <div className="p-2.5 bg-rose-500/15 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{replyError}</span>
                      </div>
                    )}
                    {replySuccess && (
                      <div className="p-2.5 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 shrink-0" />
                        <span>Reply delivered! Trainer has been notified.</span>
                      </div>
                    )}

                    <div className="flex items-end gap-2.5">
                      <div className="flex-1 bg-white/[0.04] border border-white/[0.1] rounded-2xl p-2 focus-within:border-emerald-500/60 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
                        <textarea
                          rows={2}
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault()
                              handleSendReply()
                            }
                          }}
                          placeholder={`Reply to ${activeThread.trainerName}... (e.g. batch availability, questions about course)`}
                          className="w-full bg-transparent border-0 text-xs text-white placeholder:text-neutral-500 focus:outline-none resize-none leading-relaxed"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={replySending || !replyText.trim()}
                        onClick={handleSendReply}
                        className="h-11 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl text-xs font-bold transition-all shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 shrink-0"
                      >
                        {replySending ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span className="hidden sm:inline">Send</span>
                          </>
                        )}
                      </button>
                    </div>

                    <p className="text-[10px] text-neutral-500 flex items-center gap-1.5">
                      <Shield className="w-3 h-3 text-emerald-500" />
                      <span>Phone numbers & personal emails remain shielded. Messages are delivered straight into the trainer's verified inbox.</span>
                    </p>
                  </div>
                </>
              ) : (
                <div className="m-auto py-20 text-center text-neutral-400 space-y-3">
                  <Mail className="w-10 h-10 text-neutral-600 mx-auto" />
                  <p className="text-sm font-semibold text-white">Select a conversation on the left</p>
                  <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                    Choose any message thread to read full messages from trainers and send replies.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Tab 2: My Course Inquiries & Learning Requests */
          <div className="bg-[#0c0f17] border border-white/[0.08] rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/[0.06]">
              <div>
                <h3 className="text-base font-bold text-white">Your Learning Requests</h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Requirements you submitted across the Celoris Academy and course pages ({inquiries.length} total)
                </p>
              </div>
              <Link
                href="/learn"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Post New Requirement</span>
              </Link>
            </div>

            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-neutral-500 gap-3">
                <Loader2 className="w-6 h-6 animate-spin text-emerald-500" />
                <span className="text-xs">Loading inquiries...</span>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="py-20 text-center text-neutral-400 space-y-3 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-neutral-500">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-white">No Inquiries Found</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  You haven't posted any learning requirements or course inquiries with this email address yet.
                </p>
                <Link
                  href="/learn"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <span>Explore Courses & Post Need</span>
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {inquiries.map((inq) => {
                  const status = inq.status || 'open'
                  const statusColors: Record<string, string> = {
                    open: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
                    contacted: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
                    converted: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
                  }
                  const statusText: Record<string, string> = {
                    open: 'Open • Matching Trainers',
                    contacted: 'Trainer Contacted • Message Waiting',
                    converted: 'Enrolled / Completed',
                  }

                  return (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500">
                            Course Interest
                          </span>
                          <h4 className="text-sm font-bold text-white mt-0.5">{inq.course || 'General Training'}</h4>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${
                            statusColors[status] || statusColors.open
                          }`}
                        >
                          {statusText[status] || status}
                        </span>
                      </div>

                      {inq.requirement && (
                        <p className="text-xs text-neutral-400 bg-white/[0.02] p-3 rounded-xl border border-white/[0.04] leading-relaxed">
                          "{inq.requirement}"
                        </p>
                      )}

                      <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-1 border-t border-white/[0.04]">
                        <span>Mode: <strong className="text-neutral-300">{inq.mode || 'Online'}</strong></span>
                        <span>
                          {inq.created_at ? formatDistanceToNow(new Date(inq.created_at), { addSuffix: true }) : ''}
                        </span>
                      </div>

                      {status === 'contacted' && (
                        <button
                          type="button"
                          onClick={() => setActiveTab('messages')}
                          className="w-full mt-2 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>View Trainer Response in Mailbox</span>
                        </button>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}

export default function StudentInboxPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#07090e] flex flex-col items-center justify-center text-neutral-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          <span className="text-xs">Loading Student Mailbox...</span>
        </div>
      }
    >
      <StudentInboxContent />
    </Suspense>
  )
}
