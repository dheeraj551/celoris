"use client"

import { useState } from "react"
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
import { Loader2 } from "lucide-react"

interface CourseInquiryDialogProps {
    courseTitle: string
    buttonClassName?: string
    buttonText?: string
}

export function CourseInquiryDialog({ courseTitle, buttonClassName, buttonText = "Enroll in Course" }: CourseInquiryDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        message: ""
    })
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/courses/inquiry", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    courseTitle
                })
            })

            if (response.ok) {
                toast({
                    title: "Inquiry Sent!",
                    description: "We've received your inquiry and will get back to you soon.",
                    variant: "default",
                })
                setOpen(false)
                setFormData({ name: "", email: "", phone: "", message: "" })
            } else {
                throw new Error("Failed to send inquiry")
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Something went wrong. Please try again later.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className={buttonClassName}>
                    {buttonText}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-[#020617] text-slate-200 border-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-white">Course Inquiry</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Interested in <span className="text-cyan-400 font-semibold">{courseTitle}</span>?
                        Fill out the form below and our team will contact you with enrollment details.
                    </DialogDescription>
                </DialogHeader>
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
                                Sending...
                            </>
                        ) : "Send Inquiry"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
