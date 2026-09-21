"use client"

import { useState, useRef } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, UploadCloud, FileCheck2, LogIn } from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { createClient } from "@/lib/supabase-client"

interface CourseInquiryDialogProps {
    courseTitle: string
    buttonClassName?: string
    buttonText?: string
}

// Classes are free for students now, so applying is gated behind an
// uploaded student ID instead of a payment — this is what actually proves
// the applicant belongs to that free tier. The file goes straight from the
// browser to the private 'student-documents' Supabase Storage bucket
// (owner-scoped RLS, same shape as the trainer-documents/job-documents
// buckets), and only its storage path is sent to /api/courses/inquiry,
// which is what turns this into a real course_applications row an admin
// can review.
export function CourseInquiryDialog({ courseTitle, buttonClassName, buttonText = "Enroll in Course" }: CourseInquiryDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    })
    const [studentIdFile, setStudentIdFile] = useState<File | null>(null)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const { toast } = useToast()
    const { user, profile, loading: authLoading } = useAuth()
    const supabase = createClient()

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null
        if (file && file.size > 10 * 1024 * 1024) {
            toast({
                title: "File too large",
                description: "Please upload an image or PDF under 10MB.",
                variant: "destructive",
            })
            e.target.value = ""
            return
        }
        setStudentIdFile(file)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            toast({
                title: "Sign in required",
                description: "Please sign in first — we need an account to attach your student ID to.",
                variant: "destructive",
            })
            return
        }

        if (!studentIdFile) {
            toast({
                title: "Student ID required",
                description: "Upload a photo or scan of your student ID to apply for this free class.",
                variant: "destructive",
            })
            return
        }

        setLoading(true)

        try {
            // 1. Upload the ID straight to Storage — path is prefixed with the
            // user's own id, which is what the bucket's RLS policy checks.
            const cleanFileName = studentIdFile.name.replace(/[^a-zA-Z0-9.]/g, "_")
            const objectPath = `${user.id}/${Date.now()}_${cleanFileName}`

            const { error: uploadError } = await supabase.storage
                .from("student-documents")
                .upload(objectPath, studentIdFile, { upsert: false })

            if (uploadError) {
                throw new Error(uploadError.message || "Failed to upload your student ID.")
            }

            // 2. Submit the application — the server re-validates the path
            // belongs to this user and writes the course_applications row.
            const response = await fetch("/api/courses/inquiry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    courseTitle,
                    studentIdPath: objectPath,
                })
            })

            const result = await response.json().catch(() => ({}))

            if (response.ok) {
                toast({
                    title: "Application Sent!",
                    description: "We've received your application and student ID — our team will confirm your free seat shortly.",
                    variant: "default",
                })
                setOpen(false)
                setFormData({ name: "", email: "", phone: "", message: "" })
                setStudentIdFile(null)
                if (fileInputRef.current) fileInputRef.current.value = ""
            } else {
                throw new Error(result.error || "Failed to submit application")
            }
        } catch (error: any) {
            toast({
                title: "Error",
                description: error?.message || "Something went wrong. Please try again later.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                setOpen(next)
                if (next && user && profile?.full_name && !formData.name) {
                    setFormData((f) => ({ ...f, name: profile.full_name || f.name, email: user.email || f.email }))
                }
            }}
        >
            <DialogTrigger asChild>
                <Button className={buttonClassName}>
                    {buttonText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#020617] text-slate-200 border-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-white">Apply for a Free Seat</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        <span className="text-cyan-400 font-semibold">{courseTitle}</span> is free for students —
                        upload your student ID and our team will confirm your seat.
                    </DialogDescription>
                </DialogHeader>

                {!authLoading && !user ? (
                    <div className="py-6 space-y-4 text-center">
                        <p className="text-sm text-slate-300">
                            You'll need to sign in first — we attach your uploaded student ID to your account so our team can verify it.
                        </p>
                        <Button
                            asChild
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold h-11 rounded-xl"
                        >
                            <a href={`/login?redirect=${encodeURIComponent(typeof window !== "undefined" ? window.location.pathname : "/")}`}>
                                <LogIn className="mr-2 h-4 w-4" />
                                Sign In to Continue
                            </a>
                        </Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-slate-300">Name</Label>
                            <Input
                                id="name"
                                placeholder="Your full name"
                                required
                                className="bg-slate-900 border-slate-700 text-white"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                required
                                className="bg-slate-900 border-slate-700 text-white"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone" className="text-slate-300">Phone Number (Optional)</Label>
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="+91 00000 00000"
                                className="bg-slate-900 border-slate-700 text-white"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="studentId" className="text-slate-300">
                                Student ID <span className="text-cyan-400">(required — this class is free for students)</span>
                            </Label>
                            <label
                                htmlFor="studentId"
                                className={`flex items-center gap-2.5 w-full h-11 px-3 rounded-xl border cursor-pointer transition-colors ${
                                    studentIdFile
                                        ? "bg-emerald-950/30 border-emerald-600/50 text-emerald-300"
                                        : "bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-600"
                                }`}
                            >
                                {studentIdFile ? <FileCheck2 className="w-4 h-4 flex-shrink-0" /> : <UploadCloud className="w-4 h-4 flex-shrink-0" />}
                                <span className="text-sm truncate">
                                    {studentIdFile ? studentIdFile.name : "Upload a photo or scan (JPG, PNG or PDF)"}
                                </span>
                            </label>
                            <input
                                ref={fileInputRef}
                                id="studentId"
                                type="file"
                                accept="image/*,application/pdf"
                                required
                                className="hidden"
                                onChange={handleFileChange}
                            />
                            <p className="text-[11px] text-slate-500">
                                Only visible to the Celoris team for verification — never shown publicly.
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-slate-300">Message (Optional)</Label>
                            <Textarea
                                id="message"
                                placeholder="Any specific questions?"
                                className="bg-slate-900 border-slate-700 text-white min-h-[100px]"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold h-12 rounded-xl"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : "Submit Application"}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
