"use client"

import { useState } from "react"
import { BookOpen, Users, TrendingUp, Loader2, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { useReCaptcha } from "@/components/ReCaptchaProvider"

import { AnimatePresence } from "framer-motion"
import StudentInquiryForm from "@/components/student/StudentInquiryForm"

export default function StudentInquiries() {
    const [open, setOpen] = useState(false)
    const [showInquiryForm, setShowInquiryForm] = useState(false)
    const [loading, setLoading] = useState(false)
    const [subject, setSubject] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")

    const { toast } = useToast()
    const { executeRecaptcha } = useReCaptcha()

    const handleOpen = (type: string) => {
        if (type === "Course Information Inquiry") {
            setShowInquiryForm(true)
        } else {
            setSubject(type)
            setOpen(true)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        // ... existing handleSubmit logic ...
        e.preventDefault()
        setLoading(true)

        try {
            const recaptchaToken = await executeRecaptcha("student_inquiry")

            const response = await fetch("/api/contact", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    subject,
                    message,
                    recaptchaToken,
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || "Failed to send inquiry")
            }

            toast({
                title: "Information Transmitted",
                description: "Your uplink request has been synchronized. Support will contact you shortly.",
            })

            setOpen(false)
            // Reset form
            setName("")
            setEmail("")
            setMessage("")
            setSubject("")

        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Transmission Error",
                description: error.message || "Uplink failed. Please check your signal.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="py-24 relative z-10">
            {/* ... existing Render ... */}
            <div className="container max-w-7xl mx-auto px-4">
                <div className="text-center mb-20">
                    <div className="flex items-center justify-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                        <Users size={14} /> Support Nexus
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-6">
                        Student Inquiries
                    </h2>
                    <p className="text-lg text-slate-400 max-w-2xl mx-auto font-medium italic">
                        Questions about our curriculum? Our support team is standing by to assist your growth journey.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {/* Student Inquiries (Previously Curriculum Data) */}
                    <Card className="bg-[#0d1321]/40 backdrop-blur-3xl border-white/5 hover:border-emerald-500/30 transition-all duration-500 rounded-[2.5rem] overflow-hidden group shadow-2xl">
                        <CardHeader className="p-10 pt-12">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-2xl shadow-emerald-500/10">
                                <BookOpen className="h-8 w-8 text-emerald-400" />
                            </div>
                            <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Student Inquiries</CardTitle>
                            <CardDescription className="text-slate-400 text-sm font-medium italic leading-relaxed">
                                Get detailed technical specs on course content, prerequisites, and learning outcomes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-0">
                            <Button
                                className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-emerald-500/10 transition-all border-none"
                                onClick={() => handleOpen("Course Information Inquiry")}
                            >
                                Post Request
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Technical Support */}
                    <Card className="bg-[#0d1321]/40 backdrop-blur-3xl border-white/5 hover:border-blue-500/30 transition-all duration-500 rounded-[2.5rem] overflow-hidden group shadow-2xl">
                        <CardHeader className="p-10 pt-12">
                            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-2xl shadow-blue-500/10">
                                <Users className="h-8 w-8 text-blue-400" />
                            </div>
                            <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Technical Support</CardTitle>
                            <CardDescription className="text-slate-400 text-sm font-medium italic leading-relaxed">
                                Support for platform navigation, signal stability, or assignment transmission.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-0">
                            <Button
                                className="w-full h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-500/10 transition-all border-none"
                                onClick={() => handleOpen("Technical Support Inquiry")}
                            >
                                Request Support
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Learning Support */}
                    <Card className="bg-[#0d1321]/40 backdrop-blur-3xl border-white/5 hover:border-purple-500/30 transition-all duration-500 rounded-[2.5rem] overflow-hidden group shadow-2xl">
                        <CardHeader className="p-10 pt-12">
                            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-2xl shadow-purple-500/10">
                                <TrendingUp className="h-8 w-8 text-purple-400" />
                            </div>
                            <CardTitle className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Growth Support</CardTitle>
                            <CardDescription className="text-slate-400 text-sm font-medium italic leading-relaxed">
                                Strategy planning for complex material. Get personalized direction from instructors.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 pt-0">
                            <Button
                                className="w-full h-14 bg-purple-600 hover:bg-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-purple-500/10 transition-all border-none"
                                onClick={() => handleOpen("Learning Support Inquiry")}
                            >
                                Request Mentorship
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-[500px] bg-[#0d1321] border-white/10 rounded-[2.5rem] p-10 overflow-hidden shadow-3xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
                        <DialogHeader className="relative z-10 mb-8">
                            <div className="h-12 w-12 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/20 mb-6">
                                <Sparkles className="text-emerald-400" size={24} />
                            </div>
                            <DialogTitle className="text-3xl font-black text-white italic uppercase tracking-tighter">Initialize Uplink</DialogTitle>
                            <DialogDescription className="text-slate-400 font-medium italic">
                                Transmission protocol: {subject}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-6 py-4 relative z-10">
                            <div className="grid gap-2">
                                <Label htmlFor="name" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Identifier</Label>
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
                                <Label htmlFor="email" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Interface (Email)</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@nexus.com"
                                    className="h-14 bg-white/5 border-white/10 rounded-2xl px-6 text-white text-sm placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-white/10 transition-all border"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="message" className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-4">Data Payload (Message)</Label>
                                <Textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Describe your requirement..."
                                    className="min-h-[120px] bg-white/5 border-white/10 rounded-2xl px-6 py-4 text-white text-sm placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-white/10 transition-all border"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-emerald-500/20 border-none mt-4 transition-all">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                        Transmitting...
                                    </>
                                ) : (
                                    "Establish Uplink"
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>

                <AnimatePresence>
                    {showInquiryForm && (
                        <StudentInquiryForm
                            isOpen={showInquiryForm}
                            onClose={() => setShowInquiryForm(false)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </section>
    )
}

