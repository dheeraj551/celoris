"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, UserPlus, Phone, MapPin, IndianRupee, Mail, FileSpreadsheet, Sparkles } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog"
import { useReCaptcha } from "@/components/ReCaptchaProvider"
import { useAuth } from "@/components/providers/AuthProvider"
import { useRouter } from "next/navigation"

type Lead = {
    id?: string
    name: string
    course?: string
    mode?: string
    requirement?: string // Keeping for backward compatibility or manual add
    location?: string
    budget?: string
    contact_info?: string
    status: 'open' | 'contacted' | 'closed' | 'booked'
    source: string
    created_at?: string
}

export default function LeadCenter() {
    const [leads, setLeads] = useState<Lead[]>([])
    const [loading, setLoading] = useState(true)

    // Contact Form States
    const [open, setOpen] = useState(false)
    const [submitLoading, setSubmitLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")
    const [processingId, setProcessingId] = useState<string | null>(null)

    const { toast } = useToast()
    const { executeRecaptcha } = useReCaptcha()
    const { user, profile, refreshProfile } = useAuth()
    const router = useRouter()

    const fetchLeads = async () => {
        try {
            const res = await fetch('/api/leads')
            if (res.ok) {
                const data = await res.json()
                setLeads(data)
            }
        } catch (error) {
            console.error("Failed to fetch leads", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLeads()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitLoading(true)

        try {
            const recaptchaToken = await executeRecaptcha("lead_center_support")

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    email,
                    subject: "Celoris Connect Support Request",
                    message,
                    recaptchaToken,
                }),
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.error || "Failed to send inquiry")

            toast({
                title: "Support Request Sent",
                description: "Our team has received your message and will contact you shortly.",
            })

            setOpen(false)
            setName("")
            setEmail("")
            setMessage("")

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Submission Error",
                description: error.message || "Failed to send request.",
            })
        } finally {
            setSubmitLoading(false)
        }
    }

    const handleShowInterest = async (lead: Lead) => {
        if (!user) {
            router.push("/login")
            return
        }

        if (lead.id) setProcessingId(lead.id)

        try {
            const res = await fetch('/api/leads/interest', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    leadId: lead.id,
                    leadName: lead.name,
                    leadRequirement: lead.course || lead.requirement,
                    userId: user.id,
                    userEmail: user.email
                })
            })

            const data = await res.json()

            if (res.status === 402) {
                toast({
                    title: "Insufficient Balance",
                    description: "You need ₹100 in your wallet to show interest.",
                    variant: "destructive"
                })
                return
            }

            if (!res.ok) throw new Error(data.error || "Request failed")

            toast({
                title: "Request Accepted",
                description: "Your interest has been registered. ₹100 deducted.",
            })

            await refreshProfile()
            fetchLeads() // Refresh leads to show updated status

        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Something went wrong.",
                variant: "destructive"
            })
        } finally {
            setProcessingId(null)
        }
    }

    return (
        <section className="space-y-6 pt-12 pb-24 relative z-10">
            <div className="container">
                <div className="flex flex-col md:flex-row items-end justify-between gap-4 mb-8">
                    <div>
                        <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                            <UserPlus size={14} /> Growth Engine
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase italic">
                            Celoris <span className="text-emerald-500">Connect</span>
                        </h2>
                        <p className="text-slate-400 mt-2 font-medium italic">Unified dashboard for student tracking and earn online.</p>
                    </div>

                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wide gap-2">
                                <Mail size={16} /> Contact Support
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px] bg-[#0d1321] border-white/10 rounded-[2.5rem] p-10 overflow-hidden shadow-3xl">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                            <DialogHeader className="relative z-10 mb-8">
                                <div className="h-12 w-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/20 mb-6">
                                    <Sparkles className="text-emerald-400" size={24} />
                                </div>
                                <DialogTitle className="text-3xl font-black text-white italic uppercase tracking-tighter">Request Support</DialogTitle>
                                <DialogDescription className="text-slate-400 font-medium italic">
                                    Need help with your leads or account? Send us a message directly.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="grid gap-6 py-4 relative z-10">
                                <div className="grid gap-2">
                                    <Label htmlFor="name" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Name</Label>
                                    <Input
                                        id="name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Your full name"
                                        className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 text-white text-sm placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-white/10 transition-all border"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 text-white text-sm placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-white/10 transition-all border"
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="message" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Message</Label>
                                    <Textarea
                                        id="message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Describe your issue..."
                                        className="min-h-[120px] bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white text-sm placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-white/10 transition-all border"

                                        required
                                    />
                                </div>
                                <Button type="submit" disabled={submitLoading} className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-500/20 border-none mt-4 transition-all">
                                    {submitLoading ? (
                                        <>
                                            <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                            Transmitting...
                                        </>
                                    ) : (
                                        "Send Request"
                                    )}
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-emerald-500" />
                    </div>
                ) : leads.length === 0 ? (
                    <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/20">
                        <FileSpreadsheet className="h-16 w-16 mx-auto text-slate-600 mb-4" />
                        <h3 className="text-xl font-bold text-slate-400">No Leads Found</h3>
                        <p className="text-sm text-slate-500 mt-2">Sync a Google Sheet to get started.</p>
                    </div>
                ) : (
                    <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-emerald-500/20 scrollbar-track-slate-900/40">
                        {leads.map((lead, i) => (
                            <Card key={i} className="min-w-[300px] max-w-[300px] snap-center bg-slate-900/50 border-slate-800 hover:border-emerald-500/30 transition-all group flex flex-col justify-between">
                                <div>
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                                <span className="text-emerald-400 font-black text-sm">{lead.name ? lead.name.charAt(0) : 'L'}</span>
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${lead.status === 'open' ? 'bg-blue-500/10 text-blue-400' :
                                                lead.status === 'contacted' ? 'bg-yellow-500/10 text-yellow-400' :
                                                    lead.status === 'booked' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-400'
                                                }`}>
                                                {lead.status === 'booked' ? 'BOOKED' : lead.status}
                                            </span>
                                        </div>
                                        <CardTitle className="text-lg text-white mt-3 truncate">{lead.name || "Unknown Lead"}</CardTitle>
                                        <div className="min-h-[3rem]">
                                            <CardDescription className="line-clamp-2 text-emerald-400 font-medium">
                                                {lead.course || lead.requirement || "General Inquiry"}
                                            </CardDescription>
                                            {lead.mode && <p className="text-xs text-slate-500 mt-0.5">{lead.mode}</p>}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3 text-sm text-slate-400">
                                        {lead.location && (
                                            <div className="flex items-center gap-2">
                                                <MapPin size={14} className="text-slate-500" /> {lead.location}
                                            </div>
                                        )}
                                        {lead.contact_info && (
                                            <div className="flex items-center gap-2">
                                                <Phone size={14} className="text-slate-500" /> {lead.contact_info}
                                            </div>
                                        )}
                                    </CardContent>
                                </div>
                                <div className="p-4 pt-0">
                                    <Button
                                        size="sm"
                                        onClick={() => handleShowInterest(lead)}
                                        disabled={!!processingId || lead.status === 'booked'}
                                        className={`w-full text-xs font-bold uppercase tracking-wider transition-all ${lead.status === 'booked'
                                                ? 'bg-red-500/10 text-red-500 border border-red-500/20 cursor-not-allowed'
                                                : 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20'
                                            }`}
                                    >
                                        {processingId === lead.id ? (
                                            <>
                                                <Loader2 className="mr-2 h-3 w-3 animate-spin" /> Processing
                                            </>
                                        ) : lead.status === 'booked' ? "BOOKED" : "Show Interest"}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
