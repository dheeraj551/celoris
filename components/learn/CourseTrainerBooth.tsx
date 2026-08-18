"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Users, ShieldCheck, Mail, Sparkles, Loader2, X } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase-client"
import { useToast } from "@/components/ui/use-toast"

interface Booth {
  id: string
  trainer_id: string
  expires_at: string
  trainer: {
    first_name: string
    last_name: string
    avatar_url: string
  }
}

export function CourseTrainerBooth({ courseId }: { courseId: string }) {
  const [booths, setBooths] = useState<Booth[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [claiming, setClaiming] = useState(false)
  const [messageModalOpen, setMessageModalOpen] = useState(false)
  const [selectedTrainer, setSelectedTrainer] = useState<Booth | null>(null)
  
  // Message state
  const [messageText, setMessageText] = useState("")
  const [senderName, setSenderName] = useState("")
  const [sending, setSending] = useState(false)
  const [onlineTrainers, setOnlineTrainers] = useState<Set<string>>(new Set())

  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadData()

    // Track online trainers via presence
    const channel = supabase.channel('booth:online_trainers')
    channel.on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      const onlineIds = new Set<string>()
      
      // state is an object where keys are presence ids and values are arrays of presence data
      Object.values(state).forEach((presences: any) => {
        presences.forEach((presence: any) => {
          if (presence.user_id) onlineIds.add(presence.user_id)
        })
      })
      setOnlineTrainers(onlineIds)
    })
    
    channel.subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [courseId])

  const loadData = async () => {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    setCurrentUser(session?.user || null)

    if (session?.user) {
      // Optional: Load user's profile to prepopulate name
      const { data: profile } = await supabase.from('profiles').select('first_name, last_name').eq('id', session.user.id).single()
      if (profile) {
        setSenderName(`${profile.first_name || ''} ${profile.last_name || ''}`.trim())
      }
    }

    // Fetch active booths (simulated join since we don't have FK to profiles setup in this example yet)
    // We'll fetch booths, then fetch profiles for those trainers
    const { data: activeBooths, error } = await supabase
      .from('course_trainer_booths')
      .select('*')
      .eq('course_id', courseId)
      .gt('expires_at', new Date().toISOString())

    if (!error && activeBooths) {
      // Fetch profiles from users table
      const trainerIds = activeBooths.map((b: any) => b.trainer_id)
      const { data: users } = await supabase
        .from('users')
        .select('id, full_name, profile_pic_url')
        .in('id', trainerIds)

      const profileMap = new Map(users?.map((p: any) => {
        const parts = (p.full_name || '').split(' ')
        return [p.id, {
          first_name: parts[0] || "Expert",
          last_name: parts.slice(1).join(' ') || "Trainer",
          avatar_url: p.profile_pic_url || ""
        }]
      }) || [])

      const enrichedBooths = activeBooths.map((b: any) => ({
        ...b,
        trainer: profileMap.get(b.trainer_id) || {
          first_name: "Expert",
          last_name: "Trainer",
          avatar_url: ""
        }
      }))
      setBooths(enrichedBooths)
    }
    setLoading(false)
  }

  const handleClaim = async () => {
    if (!currentUser) {
      toast({ title: "Authentication required", description: "Please login first", variant: "destructive" })
      return
    }

    setClaiming(true)
    try {
      const { data, error } = await supabase.rpc('claim_trainer_booth', {
        p_course_id: courseId,
        p_trainer_id: currentUser.id
      })

      if (error) {
        throw new Error(error.message)
      }
      
      toast({ title: "Booth Claimed!", description: "You are now a featured trainer for this course." })
      loadData()
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" })
    } finally {
      setClaiming(false)
    }
  }

  const [chatMessages, setChatMessages] = useState<any[]>([])
  
  // Track selected trainer's chat channel
  useEffect(() => {
    if (!selectedTrainer || !onlineTrainers.has(selectedTrainer.trainer_id)) {
      setChatMessages([])
      return
    }

    const channelId = `chat:${selectedTrainer.trainer_id}`
    const channel = supabase.channel(channelId)

    channel
      .on('broadcast', { event: 'message' }, ({ payload }: any) => {
        setChatMessages(prev => [...prev, payload])
      })
      .subscribe()

    return () => {
      channel.unsubscribe()
    }
  }, [selectedTrainer, onlineTrainers])

  const handleSendMessage = async () => {
    if (!selectedTrainer || !messageText.trim() || !senderName.trim()) return

    const isOnline = onlineTrainers.has(selectedTrainer.trainer_id)

    if (isOnline) {
      // Live chat broadcast
      const newMessage = {
        id: Date.now(),
        sender_id: currentUser?.id || 'anonymous_' + Date.now(),
        sender_name: senderName,
        text: messageText,
        timestamp: new Date().toISOString()
      }

      await supabase.channel(`chat:${selectedTrainer.trainer_id}`).send({
        type: 'broadcast',
        event: 'message',
        payload: newMessage
      })

      setChatMessages(prev => [...prev, newMessage])
      setMessageText("")
    } else {
      // Offline inquiry
      setSending(true)
      try {
        const response = await fetch('/api/inbox/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            trainerId: selectedTrainer.trainer_id,
            senderName,
            message: messageText
          })
        })
        if (!response.ok) throw new Error("Failed to send message")
        
        toast({ title: "Message Sent", description: "The trainer will get back to you soon." })
        setMessageModalOpen(false)
        setMessageText("")
      } catch (err: any) {
        toast({ title: "Error", description: err.message, variant: "destructive" })
      } finally {
        setSending(false)
      }
    }
  }

  if (loading) {
    return <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-emerald-500" /></div>
  }

  // Create array of 4 slots
  const slots = Array(4).fill(null).map((_, i) => booths[i] || null)

  return (
    <div className="py-12 border-t border-white/5 relative">
      <div className="mb-8">
        <h3 className="text-3xl font-bold text-white italic uppercase tracking-tight flex items-center gap-3">
          <ShieldCheck className="text-emerald-500" /> Trainer Booth
        </h3>
        <p className="text-slate-400 mt-2 font-medium">Connect with certified trainers available for this course.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {slots.map((booth, idx) => (
          <Card key={idx} className="bg-white/5 border-white/10 overflow-hidden group hover:border-emerald-500/50 transition-all duration-300">
            <CardContent className="p-6 flex flex-col items-center text-center h-full justify-center">
              {booth ? (
                <>
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-emerald-500/50 mb-4 shadow-[0_0_15px_rgba(16,185,129,0.3)] relative">
                    <img 
                      src={booth.trainer.avatar_url || `https://ui-avatars.com/api/?name=${booth.trainer.first_name}+${booth.trainer.last_name}&background=10b981&color=fff`} 
                      alt="Trainer" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-white font-bold text-lg mb-1">{booth.trainer.first_name} {booth.trainer.last_name}</h4>
                  
                  {onlineTrainers.has(booth.trainer_id) ? (
                    <div className="flex items-center gap-1.5 mb-6">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">Online Now</p>
                    </div>
                  ) : (
                    <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-6">Offline</p>
                  )}
                  
                  <Button 
                    onClick={() => { setSelectedTrainer(booth); setMessageModalOpen(true); }}
                    className={`w-full transition-all mt-auto border ${onlineTrainers.has(booth.trainer_id) ? 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500' : 'bg-white/5 hover:bg-white/10 text-white/70 border-white/10'}`}
                  >
                    <Mail size={16} className="mr-2" /> Message
                  </Button>
                </>
              ) : (
                <>
                  <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center mb-4 text-white/20 group-hover:text-white/40 transition-colors">
                    <Users size={32} />
                  </div>
                  <h4 className="text-white/40 font-bold mb-2">Available Slot</h4>
                  <p className="text-white/30 text-xs mb-6 px-4">Claim this slot to connect with students.</p>
                  
                  <Button 
                    onClick={handleClaim}
                    disabled={claiming}
                    className="w-full bg-white/5 hover:bg-white/10 text-white border border-white/10 transition-all mt-auto text-xs"
                  >
                    {claiming ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : <Sparkles className="w-4 h-4 mr-2 text-emerald-400" />}
                    Claim (500 Coins)
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Message Modal */}
      <AnimatePresence>
        {messageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0a0f1c] border border-white/10 p-8 rounded-3xl w-full max-w-md relative"
            >
              <button 
                onClick={() => setMessageModalOpen(false)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white"
              >
                <X size={24} />
              </button>
              
              {selectedTrainer && onlineTrainers.has(selectedTrainer.trainer_id) ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Chat with {selectedTrainer.trainer.first_name}
                  </h3>
                  <p className="text-slate-400 text-sm mb-6">Trainer is online now.</p>
                  
                  {!senderName ? (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Enter Your Name to Join</label>
                        <input 
                          type="text" 
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                          placeholder="Your name"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col h-[300px]">
                      <div className="flex-1 overflow-y-auto bg-white/5 rounded-xl border border-white/10 p-4 mb-4 space-y-3">
                        {chatMessages.length === 0 ? (
                          <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                            Say hello to {selectedTrainer.trainer.first_name}!
                          </div>
                        ) : (
                          chatMessages.map((m) => {
                            const isMe = m.sender_id === currentUser?.id || (!currentUser && m.sender_name === senderName)
                            return (
                              <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                  isMe 
                                    ? 'bg-emerald-600 text-white rounded-tr-none' 
                                    : 'bg-white/10 text-slate-200 rounded-tl-none'
                                }`}>
                                  {m.text}
                                </div>
                                <span className="text-[10px] text-slate-500 mt-1 px-1">
                                  {isMe ? 'You' : m.sender_name}
                                </span>
                              </div>
                            )
                          })
                        )}
                      </div>
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          value={messageText}
                          onChange={(e) => setMessageText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-white focus:outline-none focus:border-emerald-500"
                          placeholder="Type a message..."
                        />
                        <Button 
                          onClick={handleSendMessage}
                          disabled={!messageText.trim()}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl px-6"
                        >
                          Send
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-2">Message Trainer</h3>
                  <p className="text-slate-400 text-sm mb-6">Send an inquiry to {selectedTrainer?.trainer.first_name}.</p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Your Name</label>
                      <input 
                        type="text" 
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">Message</label>
                      <textarea 
                        value={messageText}
                        onChange={(e) => setMessageText(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 h-32 resize-none"
                        placeholder="What would you like to ask?"
                      />
                    </div>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={sending || !messageText.trim() || !senderName.trim()}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl h-12 mt-4"
                    >
                      {sending ? <Loader2 className="animate-spin" /> : 'Send Message'}
                    </Button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
