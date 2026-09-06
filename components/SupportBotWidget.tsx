"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { MessageCircle, X, Send, Loader2, ArrowLeft, Bot } from "lucide-react"

type ChatMessage = {
    role: "user" | "assistant"
    content: string
}

type Intent = "student" | "teacher" | "jobseeker" | "customer" | null

// Same number used on the homepage's "WhatsApp Us" CTA and in the site's
// contact schema (app/layout.tsx).
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

const INTENT_OPTIONS: { key: Exclude<Intent, null>; label: string; seed: string }[] = [
    { key: "student", label: "🎓 I'm a student", seed: "I'm a student looking to learn something new." },
    { key: "teacher", label: "🧑‍🏫 I'm a teacher", seed: "I'm a teacher and want to know about teaching on Celoris." },
    { key: "jobseeker", label: "💼 Looking for a job", seed: "I'm looking for a job or freelance work." },
    { key: "customer", label: "👋 Existing customer", seed: "I'm already a Celoris customer." },
]

const optionListVariants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
}
const optionItemVariants = {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0 },
}

export function SupportBotWidget() {
    const [open, setOpen] = useState(false)
    const [view, setView] = useState<"chat" | "lead">("chat")
    const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
    const [intent, setIntent] = useState<Intent>(null)
    const [input, setInput] = useState("")
    const [sending, setSending] = useState(false)
    const [leadData, setLeadData] = useState({ name: "", email: "", phone: "", message: "" })
    const [leadSending, setLeadSending] = useState(false)
    const [leadSent, setLeadSent] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const { toast } = useToast()
    const reduceMotion = useReducedMotion()

    useEffect(() => {
        if (scrollRef.current) {
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

        // Placeholder assistant bubble we'll stream tokens into as they arrive.
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

    return (
        <div className="fixed bottom-5 right-5 z-[60] flex flex-col items-end">
            <AnimatePresence>
                {open && (
                    <motion.div
                        key="panel"
                        initial={{ opacity: 0, y: 18, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.96 }}
                        transition={
                            reduceMotion
                                ? { duration: 0 }
                                : { type: "spring", stiffness: 320, damping: 28, mass: 0.9 }
                        }
                        className="mb-3 w-[92vw] max-w-sm h-[520px] max-h-[75vh] flex flex-col rounded-2xl border border-slate-800 bg-[#020617] shadow-2xl overflow-hidden origin-bottom-right"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-slate-800 bg-gradient-to-r from-emerald-500/10 to-emerald-600/10">
                            <div className="flex items-center gap-2 min-w-0">
                                {view === "lead" ? (
                                    <button
                                        onClick={() => setView("chat")}
                                        className="text-slate-400 hover:text-white transition-colors shrink-0"
                                        aria-label="Back to chat"
                                    >
                                        <ArrowLeft className="h-4 w-4" />
                                    </button>
                                ) : (
                                    <div className="relative h-8 w-8 shrink-0">
                                        <motion.div
                                            className="absolute inset-0 rounded-full bg-emerald-400"
                                            animate={reduceMotion ? undefined : { scale: [1, 1.35, 1], opacity: [0.35, 0, 0.35] }}
                                            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                                        />
                                        <div className="relative h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                                            <Bot className="h-4 w-4 text-white" />
                                        </div>
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="text-sm font-semibold text-white truncate">
                                        {view === "lead" ? "Talk to our team" : "Celoris Support"}
                                    </p>
                                    <p className="text-xs text-slate-400 truncate">
                                        {view === "lead" ? "WhatsApp or email" : "Usually replies instantly"}
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setOpen(false)}
                                className="text-slate-400 hover:text-white transition-colors shrink-0"
                                aria-label="Close chat"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <AnimatePresence mode="wait" initial={false}>
                            {view === "chat" ? (
                                <motion.div
                                    key="chat"
                                    initial={{ opacity: 0, x: -14 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -14 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.18 }}
                                    className="flex flex-col flex-1 min-h-0"
                                >
                                    {/* Messages */}
                                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
                                        {messages.map((m, i) => (
                                            <motion.div
                                                key={i}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: reduceMotion ? 0 : 0.25, ease: "easeOut" }}
                                                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                                            >
                                                <div
                                                    className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed whitespace-pre-wrap ${m.role === "user"
                                                        ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-br-sm"
                                                        : "bg-slate-900 border border-slate-800 text-slate-200 rounded-bl-sm"
                                                        }`}
                                                >
                                                    {m.content || (
                                                        <span className="inline-flex gap-1">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.3s]" />
                                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce [animation-delay:-0.15s]" />
                                                            <span className="h-1.5 w-1.5 rounded-full bg-slate-500 animate-bounce" />
                                                        </span>
                                                    )}
                                                </div>
                                            </motion.div>
                                        ))}

                                        {showIntentOptions && (
                                            <motion.div
                                                variants={optionListVariants}
                                                initial="hidden"
                                                animate="show"
                                                className="grid grid-cols-2 gap-2 pt-1"
                                            >
                                                {INTENT_OPTIONS.map(option => (
                                                    <motion.button
                                                        key={option.key}
                                                        variants={optionItemVariants}
                                                        whileHover={reduceMotion ? undefined : { scale: 1.03 }}
                                                        whileTap={reduceMotion ? undefined : { scale: 0.97 }}
                                                        onClick={() => handleIntentSelect(option)}
                                                        disabled={sending}
                                                        className="text-left text-xs sm:text-sm rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-slate-200 hover:border-emerald-500 hover:bg-emerald-500/10 hover:text-white transition-colors disabled:opacity-50"
                                                    >
                                                        {option.label}
                                                    </motion.button>
                                                ))}
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Talk to a human, always available */}
                                    <div className="px-4 pb-2 flex items-center gap-3 flex-wrap">
                                        <button
                                            onClick={() => setView("lead")}
                                            className="text-xs text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
                                        >
                                            Email our team
                                        </button>
                                        <a
                                            href={buildWhatsAppLink(messages)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-xs text-[#25D366] hover:text-[#20bc5a] font-medium"
                                        >
                                            <WhatsAppIcon className="h-3.5 w-3.5" />
                                            WhatsApp us
                                        </a>
                                    </div>

                                    {/* Input */}
                                    <form onSubmit={handleSend} className="flex items-center gap-2 px-4 py-3 border-t border-slate-800">
                                        <Input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            placeholder="Ask a question..."
                                            className="bg-slate-900 border-slate-700 text-white text-sm h-10"
                                            disabled={sending}
                                        />
                                        <motion.div whileHover={reduceMotion ? undefined : { scale: 1.05 }} whileTap={reduceMotion ? undefined : { scale: 0.93 }}>
                                            <Button
                                                type="submit"
                                                size="icon"
                                                className="h-10 w-10 shrink-0 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500"
                                                disabled={sending || !input.trim()}
                                            >
                                                <AnimatePresence mode="wait" initial={false}>
                                                    <motion.span
                                                        key={sending ? "loading" : "idle"}
                                                        initial={{ opacity: 0, scale: 0.7 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        exit={{ opacity: 0, scale: 0.7 }}
                                                        transition={{ duration: 0.15 }}
                                                        className="flex items-center justify-center"
                                                    >
                                                        {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                                    </motion.span>
                                                </AnimatePresence>
                                            </Button>
                                        </motion.div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="lead"
                                    initial={{ opacity: 0, x: 14 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 14 }}
                                    transition={{ duration: reduceMotion ? 0 : 0.18 }}
                                    className="flex-1 overflow-y-auto px-4 py-4"
                                >
                                    {leadSent ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="h-full flex flex-col items-center justify-center text-center gap-2"
                                        >
                                            <motion.div
                                                initial={{ scale: 0, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 15 }}
                                                className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center"
                                            >
                                                <Send className="h-4 w-4 text-emerald-400" />
                                            </motion.div>
                                            <p className="text-sm text-white font-medium">Message sent!</p>
                                            <p className="text-xs text-slate-400">Our team will get back to you at {leadData.email}.</p>
                                            <Button
                                                variant="outline"
                                                className="mt-2 border-slate-700 text-slate-300 hover:text-white"
                                                onClick={() => { setView("chat"); setLeadSent(false); }}
                                            >
                                                Back to chat
                                            </Button>
                                        </motion.div>
                                    ) : (
                                        <form onSubmit={handleLeadSubmit} className="space-y-3">
                                            <motion.a
                                                whileHover={reduceMotion ? undefined : { scale: 1.02 }}
                                                whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                                                href={buildWhatsAppLink(messages)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bc5a] text-black font-bold text-sm transition-colors"
                                            >
                                                <WhatsAppIcon className="h-4 w-4" />
                                                Chat on WhatsApp instead
                                            </motion.a>
                                            <div className="flex items-center gap-2 py-1">
                                                <div className="h-px flex-1 bg-slate-800" />
                                                <span className="text-[10px] text-slate-500 uppercase tracking-wide">or email us</span>
                                                <div className="h-px flex-1 bg-slate-800" />
                                            </div>
                                            <p className="text-xs text-slate-400">
                                                Leave your details and our team will follow up by email.
                                            </p>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="sb-name" className="text-slate-300 text-xs">Name</Label>
                                                <Input
                                                    id="sb-name"
                                                    required
                                                    className="bg-slate-900 border-slate-700 text-white h-9 text-sm"
                                                    value={leadData.name}
                                                    onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="sb-email" className="text-slate-300 text-xs">Email</Label>
                                                <Input
                                                    id="sb-email"
                                                    type="email"
                                                    required
                                                    className="bg-slate-900 border-slate-700 text-white h-9 text-sm"
                                                    value={leadData.email}
                                                    onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="sb-phone" className="text-slate-300 text-xs">Phone (optional)</Label>
                                                <Input
                                                    id="sb-phone"
                                                    type="tel"
                                                    className="bg-slate-900 border-slate-700 text-white h-9 text-sm"
                                                    value={leadData.phone}
                                                    onChange={(e) => setLeadData({ ...leadData, phone: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="sb-message" className="text-slate-300 text-xs">What can we help with? (optional)</Label>
                                                <Textarea
                                                    id="sb-message"
                                                    className="bg-slate-900 border-slate-700 text-white text-sm min-h-[70px]"
                                                    value={leadData.message}
                                                    onChange={(e) => setLeadData({ ...leadData, message: e.target.value })}
                                                />
                                            </div>
                                            <motion.div whileHover={reduceMotion ? undefined : { scale: 1.01 }} whileTap={reduceMotion ? undefined : { scale: 0.98 }}>
                                                <Button
                                                    type="submit"
                                                    className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-semibold h-10 rounded-xl"
                                                    disabled={leadSending}
                                                >
                                                    {leadSending ? (
                                                        <>
                                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                            Sending...
                                                        </>
                                                    ) : "Send to our team"}
                                                </Button>
                                            </motion.div>
                                        </form>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle button */}
            <div className="relative">
                {!open && (
                    <motion.span
                        className="absolute inset-0 rounded-full bg-emerald-400 pointer-events-none"
                        animate={reduceMotion ? undefined : { scale: [1, 1.6, 1.6], opacity: [0.4, 0, 0] }}
                        transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
                    />
                )}
                <motion.button
                    onClick={() => setOpen(o => !o)}
                    whileHover={reduceMotion ? undefined : { scale: 1.08 }}
                    whileTap={reduceMotion ? undefined : { scale: 0.92 }}
                    className="relative h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-500/30 flex items-center justify-center text-white"
                    aria-label={open ? "Close Celoris Support chat" : "Open Celoris Support chat"}
                >
                    <AnimatePresence mode="wait" initial={false}>
                        <motion.span
                            key={open ? "close" : "open"}
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: reduceMotion ? 0 : 0.2 }}
                            className="flex items-center justify-center"
                        >
                            {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
                        </motion.span>
                    </AnimatePresence>
                </motion.button>
            </div>
        </div>
    )
}
