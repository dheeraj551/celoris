"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import {
    MessageCircle,
    X,
    Send,
    Loader2,
    ArrowLeft,
    Bot,
    Bell,
    ChevronUp,
    ChevronDown,
    Search,
    Phone,
    HelpCircle,
    Wifi,
    Battery,
    ChevronLeft,
    ExternalLink,
    CheckCircle2,
} from "lucide-react"

type ChatMessage = {
    role: "user" | "assistant"
    content: string
}

type Intent = "student" | "teacher" | "jobseeker" | "customer" | null
type PhoneView = "home" | "chat" | "lead" | "faq"

const WHATSAPP_NUMBER = "919084718101"

function buildWhatsAppLink(messages: ChatMessage[]): string {
    const lastUserMessage = [...messages].reverse().find(m => m.role === "user")?.content
    const text = lastUserMessage
        ? `Hi! I was chatting with Celoris Support and wanted to continue here. My question: ${lastUserMessage}`
        : "Hi! I'd like to know more about Celoris."
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    )
}

const GREETING: ChatMessage = {
    role: "assistant",
    content:
        "Hi! I'm Celoris Support 👋 To point you the right way fastest, which of these best describes you? (Or just type your question below.)",
}

const TEASER_PREVIEW = "Hi! Need help picking a course, finding a gig, or using AI tools?"
const TEASER_DELAY_MS = 4500
const TEASER_SEEN_KEY = "celoris-support-teaser-seen"

const INTENT_OPTIONS: { key: Exclude<Intent, null>; label: string; seed: string }[] = [
    { key: "student", label: "🎓 I'm a student", seed: "I'm a student looking to learn something new." },
    { key: "teacher", label: "🧑‍🏫 I'm a teacher", seed: "I'm a teacher and want to know about teaching on Celoris." },
    { key: "jobseeker", label: "💼 Looking for a job", seed: "I'm looking for a job or freelance work." },
    { key: "customer", label: "👋 Existing customer", seed: "I'm already a Celoris customer." },
]

const FAQ_ITEMS = [
    {
        q: "Are the creative tools and courses really free?",
        a: "Yes, 100% free to start! No credit card is ever required. You get daily credits to use our 20+ creative AI models and attend free online courses.",
    },
    {
        q: "How do I get hired through Job Center?",
        a: "Browse verified job postings in Job Center, complete quick skill assessments, and connect directly with clients without middleman commissions.",
    },
    {
        q: "Can I become an instructor and teach on Celoris?",
        a: "Yes! Anyone with creative or tech skills can apply under 'Teach'. We help publish your course and monetize your expertise.",
    },
    {
        q: "What is Celoris TV?",
        a: "Celoris TV is a 24/7 free live streaming channel featuring 4K video editing tutorials, masterclasses, and digital marketing walkthroughs.",
    },
]

export function SupportBotWidget() {
    const [open, setOpen] = useState(false)
    const [view, setView] = useState<PhoneView>("home")
    const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
    const [intent, setIntent] = useState<Intent>(null)
    const [input, setInput] = useState("")
    const [sending, setSending] = useState(false)
    const [leadData, setLeadData] = useState({ name: "", email: "", phone: "", message: "" })
    const [leadSending, setLeadSending] = useState(false)
    const [leadSent, setLeadSent] = useState(false)
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
    const [currentTime, setCurrentTime] = useState("10:00")
    const [currentDate, setCurrentDate] = useState("SUN, SEP 20")
    const scrollRef = useRef<HTMLDivElement>(null)
    const phoneRef = useRef<HTMLDivElement>(null)
    const { toast } = useToast()
    const reduceMotion = useReducedMotion()

    const [teaserVisible, setTeaserVisible] = useState(false)
    const [hasUnread, setHasUnread] = useState(false)

    // Outside click and Escape key listeners to tuck phone back down
    useEffect(() => {
        if (!open) return
        const handleClickOutside = (e: MouseEvent) => {
            if (phoneRef.current && !phoneRef.current.contains(e.target as Node)) {
                setOpen(false)
            }
        }
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false)
        }
        document.addEventListener("mousedown", handleClickOutside)
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [open])

    // Digital clock updater for the smartphone status bar
    useEffect(() => {
        const updateClock = () => {
            const now = new Date()
            setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }))
            setCurrentDate(now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase())
        }
        updateClock()
        const timer = setInterval(updateClock, 10000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        let alreadySeen = false
        try {
            alreadySeen = sessionStorage.getItem(TEASER_SEEN_KEY) === "1"
        } catch {
            // best-effort
        }
        if (alreadySeen) return

        const timer = setTimeout(() => {
            setTeaserVisible(true)
            setHasUnread(true)
            try {
                sessionStorage.setItem(TEASER_SEEN_KEY, "1")
            } catch {
                // best-effort
            }
        }, TEASER_DELAY_MS)

        return () => clearTimeout(timer)
    }, [])

    const dismissTeaser = () => setTeaserVisible(false)

    const openFromTeaser = () => {
        setTeaserVisible(false)
        setHasUnread(false)
        setView("chat")
        setOpen(true)
    }

    useEffect(() => {
        if (scrollRef.current && view === "chat") {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
    }, [messages, view, open])

    const showIntentOptions = intent === null && messages.length === 1

    const sendMessage = async (text: string, effectiveIntent: Intent) => {
        const trimmed = text.trim()
        if (!trimmed || sending) return

        const nextMessages: ChatMessage[] = [...messages, { role: "user", content: trimmed }]
        setMessages(nextMessages)
        setSending(true)

        setMessages(prev => [...prev, { role: "assistant", content: "" }])

        try {
            const res = await fetch("/api/support-bot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ messages: nextMessages, intent: effectiveIntent }),
            })

            if (!res.ok || !res.body) {
                throw new Error("Support bot request failed")
            }

            const reader = res.body.getReader()
            const decoder = new TextDecoder()
            let full = ""

            while (true) {
                const { done, value } = await reader.read()
                if (done) break
                full += decoder.decode(value, { stream: true })
                setMessages(prev => {
                    const updated = [...prev]
                    updated[updated.length - 1] = { role: "assistant", content: full }
                    return updated
                })
            }
        } catch (err) {
            setMessages(prev => {
                const updated = [...prev]
                updated[updated.length - 1] = {
                    role: "assistant",
                    content:
                        "Sorry, I ran into a problem answering that. Please try again, or reach us below by WhatsApp or email.",
                }
                return updated
            })
        } finally {
            setSending(false)
        }
    }

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault()
        const trimmed = input.trim()
        if (!trimmed) return
        setInput("")
        await sendMessage(trimmed, intent)
    }

    const handleIntentSelect = async (option: (typeof INTENT_OPTIONS)[number]) => {
        setIntent(option.key)
        await sendMessage(option.seed, option.key)
    }

    const handleLeadSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!leadData.name || !leadData.email) return
        setLeadSending(true)

        try {
            const res = await fetch("/api/support-bot/lead", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...leadData, transcript: messages }),
            })

            if (!res.ok) throw new Error("Failed to send")

            setLeadSent(true)
            toast({
                title: "Message sent!",
                description: "Our team will get back to you soon.",
            })
        } catch (err) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again later.",
                variant: "destructive",
            })
        } finally {
            setLeadSending(false)
        }
    }

    // Home bar click behavior: in an app -> go to phone home; on phone home -> slide phone down
    const handleHomeBarClick = () => {
        if (view !== "home") {
            setView("home")
        } else {
            setOpen(false)
        }
    }

    return (
        <>
            {/* Proactive "unread message" preview teaser */}
            <AnimatePresence>
                {teaserVisible && !open && (
                    <motion.div
                        key="teaser"
                        initial={{ opacity: 0, y: 12, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 340, damping: 26 }}
                        className="fixed bottom-[56px] right-4 sm:right-6 z-[60] w-[270px] max-w-[85vw] flex items-center gap-2.5 rounded-2xl border border-white/[0.12] bg-[#08090d]/95 backdrop-blur-2xl shadow-[0_15px_35px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.18)] pl-3 pr-2 py-2 select-none"
                    >
                        <button
                            onClick={openFromTeaser}
                            className="flex items-center gap-2.5 flex-1 min-w-0 text-left cursor-pointer"
                        >
                            <div className="relative h-8 w-8 shrink-0">
                                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                                    <Bot className="h-4 w-4 text-white" />
                                </div>
                                <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-rose-500 border border-[#0b1220]" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-1">
                                    <p className="text-xs font-semibold text-white truncate">Celoris Phone</p>
                                    <span className="text-[9px] text-slate-500 shrink-0">now</span>
                                </div>
                                <p className="text-[10px] text-slate-400 truncate">{TEASER_PREVIEW}</p>
                            </div>
                        </button>
                        <button
                            onClick={dismissTeaser}
                            aria-label="Dismiss"
                            className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors p-1 cursor-pointer"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* GTA V RP Interactive Smartphone Chassis (Compact & Peeking at Bottom) */}
            <motion.div
                ref={phoneRef}
                initial={false}
                animate={{
                    y: open ? 0 : 434, // In a 480px frame, shifts down by 434px so exactly 46px peeks out
                }}
                whileHover={!open ? { y: 426 } : undefined} // Peeks up 8px on hover
                transition={
                    reduceMotion
                        ? { duration: 0.1 }
                        : { type: "spring", stiffness: 350, damping: 28, mass: 0.8 }
                }
                className="fixed bottom-0 right-4 sm:right-6 z-50 w-[270px] sm:w-[280px] h-[480px] rounded-t-[36px] rounded-b-[24px] border-[4px] border-b-0 border-[#222534] bg-[#07080c] shadow-[0_20px_70px_rgba(0,0,0,0.95),0_0_0_1px_rgba(255,255,255,0.08),inset_0_1px_2px_rgba(255,255,255,0.25)] flex flex-col overflow-hidden origin-bottom select-none"
            >
                {/* Smartphone Glass Bezel & Top Status Bar */}
                <div
                    onClick={() => {
                        if (!open) {
                            setOpen(true)
                            setTeaserVisible(false)
                        }
                    }}
                    className={`pt-2 pl-6 pr-4 pb-1.5 flex items-center justify-between z-30 bg-[#07080c] text-white/80 text-[10px] font-mono select-none transition-colors ${
                        !open ? "cursor-pointer hover:bg-white/[0.04]" : "border-b border-white/[0.06]"
                    }`}
                    title={!open ? "Click to open Celoris Phone" : undefined}
                >
                    {/* Left: Time & notification dot */}
                    <div className="flex items-center gap-1.5">
                        <span className="font-bold tracking-tight text-white">{currentTime}</span>
                        {hasUnread && !open && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-[0_0_6px_rgba(244,63,94,0.9)] animate-pulse" />
                        )}
                    </div>

                    {/* Center Apple Dynamic Island Pill */}
                    <div
                        className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-black/90 border border-white/10 shadow-inner cursor-pointer"
                        onClick={(e) => {
                            if (open) {
                                e.stopPropagation()
                                setOpen(false)
                            }
                        }}
                        title={open ? "Click to minimize phone" : undefined}
                    >
                        {/* Camera lens dot */}
                        <div className="w-2 h-2 rounded-full bg-[#050508] border border-blue-400/30 relative flex items-center justify-center">
                            <div className="w-0.5 h-0.5 rounded-full bg-blue-500/60" />
                        </div>
                        {/* Speaker slit */}
                        <div className="w-5 h-0.5 rounded-full bg-white/20" />
                        {/* Active mic/live status dot */}
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                    </div>

                    {/* Right: 5G, Battery, & Chevron Indicator */}
                    <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold text-neutral-400">5G</span>
                        <div className="w-4 h-2 rounded-2xs border border-white/40 p-0.5 flex items-center">
                            <div className="h-full w-4/5 bg-emerald-400 rounded-3xs" />
                        </div>
                        {open ? (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setOpen(false)
                                }}
                                className="p-0.5 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                title="Minimize phone"
                            >
                                <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                        ) : (
                            <ChevronUp className="w-3 h-3 text-emerald-400 animate-bounce" />
                        )}
                    </div>
                </div>

                {/* Phone Screen Canvas */}
                <div className="flex-1 flex flex-col min-h-0 bg-gradient-to-b from-[#0a0c14] via-[#08090e] to-[#050608] relative overflow-hidden">

                    {/* VIEW 1: GTA V RP SMARTPHONE HOME SCREEN */}
                    {view === "home" && (
                        <motion.div
                            key="phone-home"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                            className="flex-1 flex flex-col justify-between p-3.5 text-white"
                        >
                            {/* Phone Header & Lock Screen Widget */}
                            <div className="pt-1 text-center">
                                <div className="text-[10px] font-mono font-bold text-emerald-400 tracking-widest uppercase mb-0.5">
                                    {currentDate}
                                </div>
                                <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white drop-shadow">
                                    {currentTime}
                                </div>
                                <div className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[9px] font-mono text-neutral-400">
                                    <span>Celoris OS 2.6</span>
                                </div>
                            </div>

                            {/* Interactive Apps Launcher Grid */}
                            <div className="grid grid-cols-2 gap-2.5 my-auto">
                                {/* App 1: AI Chat */}
                                <button
                                    type="button"
                                    onClick={() => { setView("chat"); setHasUnread(false); }}
                                    className="p-2.5 rounded-2xl bg-gradient-to-b from-emerald-500/15 to-emerald-500/5 hover:from-emerald-500/25 hover:to-emerald-500/10 border border-emerald-400/30 hover:border-emerald-400/60 transition-all flex flex-col items-center text-center group cursor-pointer shadow-md shadow-black/40 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white mb-1.5 shadow-[0_0_14px_rgba(16,185,129,0.4)] group-hover:scale-105 transition-transform">
                                        <Bot className="w-4.5 h-4.5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-white block">Celoris AI</span>
                                    <span className="text-[8.5px] text-emerald-300/80 mt-0.5">Instant Chat</span>
                                </button>

                                {/* App 2: WhatsApp Support */}
                                <a
                                    href={buildWhatsAppLink(messages)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-2.5 rounded-2xl bg-gradient-to-b from-[#25D366]/15 to-[#25D366]/5 hover:from-[#25D366]/25 hover:to-[#25D366]/10 border border-[#25D366]/30 hover:border-[#25D366]/60 transition-all flex flex-col items-center text-center group cursor-pointer shadow-md shadow-black/40 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-[#25D366] flex items-center justify-center text-black mb-1.5 shadow-[0_0_14px_rgba(37,211,102,0.4)] group-hover:scale-105 transition-transform">
                                        <WhatsAppIcon className="w-4.5 h-4.5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-white block">WhatsApp</span>
                                    <span className="text-[8.5px] text-emerald-300/80 mt-0.5">Human Agent</span>
                                </a>

                                {/* App 3: Request Call */}
                                <button
                                    type="button"
                                    onClick={() => setView("lead")}
                                    className="p-2.5 rounded-2xl bg-gradient-to-b from-blue-500/15 to-blue-500/5 hover:from-blue-500/25 hover:to-blue-500/10 border border-blue-400/30 hover:border-blue-400/60 transition-all flex flex-col items-center text-center group cursor-pointer shadow-md shadow-black/40 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white mb-1.5 shadow-[0_0_14px_rgba(59,130,246,0.4)] group-hover:scale-105 transition-transform">
                                        <Phone className="w-4.5 h-4.5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-white block">Call Back</span>
                                    <span className="text-[8.5px] text-blue-300/80 mt-0.5">Direct Team</span>
                                </button>

                                {/* App 4: FAQ & Guides */}
                                <button
                                    type="button"
                                    onClick={() => setView("faq")}
                                    className="p-2.5 rounded-2xl bg-gradient-to-b from-amber-500/15 to-amber-500/5 hover:from-amber-500/25 hover:to-amber-500/10 border border-amber-400/30 hover:border-amber-400/60 transition-all flex flex-col items-center text-center group cursor-pointer shadow-md shadow-black/40 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white mb-1.5 shadow-[0_0_14px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform">
                                        <HelpCircle className="w-4.5 h-4.5" />
                                    </div>
                                    <span className="text-[11px] font-bold text-white block">Fast Help</span>
                                    <span className="text-[8.5px] text-amber-300/80 mt-0.5">FAQ & Guides</span>
                                </button>
                            </div>

                            {/* Push Notification Card */}
                            <div
                                onClick={() => { setView("chat"); setHasUnread(false); }}
                                className="p-2.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] hover:border-emerald-400/30 transition-all cursor-pointer backdrop-blur-xl flex items-center gap-2"
                            >
                                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-400 shrink-0">
                                    <Bell className="w-3 h-3" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10.5px] font-bold text-white">Support Notification</span>
                                        <span className="text-[8.5px] text-neutral-400">now</span>
                                    </div>
                                    <p className="text-[9.5px] text-neutral-300 leading-tight truncate mt-0.5">
                                        Guidance on 4K Video Studio & AI tools • Tap here
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* VIEW 2: AI CHAT APP */}
                    {view === "chat" && (
                        <motion.div
                            key="phone-chat"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.18 }}
                            className="flex-1 flex flex-col min-h-0"
                        >
                            {/* App Bar Header */}
                            <div className="px-3 py-2 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setView("home")}
                                    className="inline-flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    <span>Home</span>
                                </button>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                    <span className="text-[11px] font-bold text-white">Celoris Bot</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                    title="Close"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {/* Chat Messages */}
                            <div ref={scrollRef} className="flex-1 overflow-y-auto px-3 py-2 space-y-2 custom-scrollbar">
                                {messages.map((m, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0, y: 6 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                    >
                                        <div
                                            className={`max-w-[88%] rounded-2xl px-3 py-1.5 text-[11px] leading-relaxed whitespace-pre-wrap ${m.role === "user"
                                                ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-br-xs shadow-md"
                                                : "bg-white/[0.06] border border-white/[0.08] text-neutral-200 rounded-bl-xs"
                                            }`}
                                        >
                                            {m.content || (
                                                <span className="inline-flex gap-1 py-1">
                                                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.3s]" />
                                                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce [animation-delay:-0.15s]" />
                                                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" />
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {showIntentOptions && (
                                    <div className="grid grid-cols-2 gap-1.5 pt-1">
                                        {INTENT_OPTIONS.map(option => (
                                            <button
                                                key={option.key}
                                                onClick={() => handleIntentSelect(option)}
                                                disabled={sending}
                                                className="text-left text-[10px] rounded-xl border border-white/10 bg-white/[0.04] p-1.5 text-neutral-300 hover:border-emerald-400/50 hover:bg-emerald-500/10 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Human Escalation Bar */}
                            <div className="px-3 py-1 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px]">
                                <button
                                    type="button"
                                    onClick={() => setView("lead")}
                                    className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2 cursor-pointer"
                                >
                                    Request callback
                                </button>
                                <a
                                    href={buildWhatsAppLink(messages)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-[#25D366] hover:text-[#20bc5a] font-medium"
                                >
                                    <WhatsAppIcon className="h-3 w-3" />
                                    <span>WhatsApp</span>
                                </a>
                            </div>

                            {/* Message Input */}
                            <form onSubmit={handleSend} className="p-2 border-t border-white/[0.08] flex items-center gap-1.5 bg-[#06070a]">
                                <Input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="bg-white/[0.04] border-white/10 text-white text-[11px] h-8 rounded-full px-3 focus-visible:ring-emerald-500/50"
                                    disabled={sending}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    className="h-8 w-8 shrink-0 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white cursor-pointer shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                                    disabled={sending || !input.trim()}
                                >
                                    {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                                </Button>
                            </form>
                        </motion.div>
                    )}

                    {/* VIEW 3: REQUEST CALLBACK / LEAD APP */}
                    {view === "lead" && (
                        <motion.div
                            key="phone-lead"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.18 }}
                            className="flex-1 flex flex-col min-h-0"
                        >
                            <div className="px-3 py-2 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setView("home")}
                                    className="inline-flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    <span>Home</span>
                                </button>
                                <span className="text-[11px] font-bold text-white">Direct Callback</span>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                    title="Close"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
                                {leadSent ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center gap-2.5 py-6">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shadow-[0_0_16px_rgba(16,185,129,0.4)]">
                                            <CheckCircle2 className="w-5 h-5" />
                                        </div>
                                        <p className="text-xs font-bold text-white">Callback Scheduled!</p>
                                        <p className="text-[10px] text-neutral-400 max-w-[200px]">
                                            Our team will contact you shortly at {leadData.email || leadData.phone}.
                                        </p>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="mt-1 h-7 text-[10px] rounded-full border-white/20 text-white hover:bg-white/10"
                                            onClick={() => { setView("home"); setLeadSent(false); }}
                                        >
                                            Back to Home
                                        </Button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleLeadSubmit} className="space-y-2">
                                        <a
                                            href={buildWhatsAppLink(messages)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-full bg-[#25D366] hover:bg-[#20bc5a] text-black font-bold text-[11px] transition-colors shadow-md"
                                        >
                                            <WhatsAppIcon className="h-3.5 w-3.5" />
                                            <span>Instant WhatsApp Chat</span>
                                        </a>

                                        <div className="flex items-center gap-2 py-0.5">
                                            <div className="h-px flex-1 bg-white/10" />
                                            <span className="text-[9px] text-neutral-400 uppercase tracking-widest font-mono">or callback</span>
                                            <div className="h-px flex-1 bg-white/10" />
                                        </div>

                                        <div className="space-y-0.5">
                                            <Label htmlFor="lead-name" className="text-neutral-300 text-[10px]">Your Name</Label>
                                            <Input
                                                id="lead-name"
                                                required
                                                placeholder="John Doe"
                                                className="bg-white/[0.04] border-white/10 text-white h-7.5 text-[11px] rounded-lg"
                                                value={leadData.name}
                                                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-0.5">
                                            <Label htmlFor="lead-email" className="text-neutral-300 text-[10px]">Email</Label>
                                            <Input
                                                id="lead-email"
                                                type="email"
                                                required
                                                placeholder="you@email.com"
                                                className="bg-white/[0.04] border-white/10 text-white h-7.5 text-[11px] rounded-lg"
                                                value={leadData.email}
                                                onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-0.5">
                                            <Label htmlFor="lead-phone" className="text-neutral-300 text-[10px]">Phone (optional)</Label>
                                            <Input
                                                id="lead-phone"
                                                type="tel"
                                                placeholder="+91 98765 43210"
                                                className="bg-white/[0.04] border-white/10 text-white h-7.5 text-[11px] rounded-lg"
                                                value={leadData.phone}
                                                onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                                            />
                                        </div>

                                        <div className="space-y-0.5">
                                            <Label htmlFor="lead-msg" className="text-neutral-300 text-[10px]">How can we help?</Label>
                                            <Textarea
                                                id="lead-msg"
                                                placeholder="Courses, tools, or partnerships..."
                                                className="bg-white/[0.04] border-white/10 text-white text-[11px] min-h-[48px] rounded-lg resize-none"
                                                value={leadData.message}
                                                onChange={(e) => setLeadData({ ...leadData, message: e.target.value })}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            disabled={leadSending}
                                            className="w-full h-8 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-[11px] shadow-lg cursor-pointer"
                                        >
                                            {leadSending ? (
                                                <span className="flex items-center gap-1.5">
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                    Sending...
                                                </span>
                                            ) : "Send Request"}
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* VIEW 4: FAQ APP */}
                    {view === "faq" && (
                        <motion.div
                            key="phone-faq"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.18 }}
                            className="flex-1 flex flex-col min-h-0"
                        >
                            <div className="px-3 py-2 border-b border-white/[0.08] bg-white/[0.02] flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => setView("home")}
                                    className="inline-flex items-center gap-1 text-[11px] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                                >
                                    <ChevronLeft className="w-3.5 h-3.5" />
                                    <span>Home</span>
                                </button>
                                <span className="text-[11px] font-bold text-white">Help &amp; FAQs</span>
                                <button
                                    type="button"
                                    onClick={() => setOpen(false)}
                                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                    title="Close"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                                {FAQ_ITEMS.map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] transition-colors cursor-pointer"
                                        onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                                    >
                                        <div className="flex items-center justify-between gap-1.5">
                                            <p className="text-[11px] font-bold text-white leading-snug">{item.q}</p>
                                            {expandedFaq === idx ? (
                                                <ChevronUp className="w-3 h-3 text-neutral-400 shrink-0" />
                                            ) : (
                                                <ChevronDown className="w-3 h-3 text-neutral-400 shrink-0" />
                                            )}
                                        </div>
                                        {expandedFaq === idx && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                className="text-[10px] text-neutral-300 leading-relaxed mt-1.5 pt-1.5 border-t border-white/5"
                                            >
                                                {item.a}
                                            </motion.p>
                                        )}
                                    </div>
                                ))}

                                <div className="pt-1.5 text-center">
                                    <button
                                        type="button"
                                        onClick={() => setView("chat")}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 text-[10px] font-medium hover:bg-emerald-500/25 transition-colors cursor-pointer"
                                    >
                                        <Bot className="w-3 h-3" />
                                        <span>Still need help? Chat with AI</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                </div>

                {/* Bottom Apple Home Indicator Bar (Click to return home or close phone) */}
                <div
                    onClick={handleHomeBarClick}
                    className="py-2 flex items-center justify-center bg-transparent cursor-pointer group hover:bg-white/[0.02] transition-colors"
                    title={view === "home" ? "Click to slide down phone" : "Click to return to home screen"}
                >
                    <div className="w-24 h-1 rounded-full bg-white/40 group-hover:bg-white/80 transition-colors shadow-sm" />
                </div>
            </motion.div>
        </>
    )
}
