"use client"

import { useState } from "react"
import { BookOpen, Users, TrendingUp, Loader2 } from "lucide-react"
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

export default function StudentInquiries() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [subject, setSubject] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState("")

    const { toast } = useToast()
    const { executeRecaptcha } = useReCaptcha()

    const handleOpen = (type: string) => {
        setSubject(type)
        setOpen(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
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
                title: "Inquiry Sent",
                description: "We've received your inquiry and will get back to you shortly.",
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
                title: "Error",
                description: error.message || "Something went wrong. Please try again.",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="py-16 bg-gray-50">
            <div className="container max-w-6xl mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-text-primary mb-4">
                        Students Inquiries
                    </h2>
                    <p className="text-lg text-text-secondary max-w-2xl mx-auto">
                        Have questions about our courses? Our student support team is here to help you succeed in your learning journey.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {/* Course Information */}
                    <Card className="card-hover">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center mb-4">
                                <BookOpen className="h-6 w-6 text-green-600" />
                            </div>
                            <CardTitle>Course Information</CardTitle>
                            <CardDescription>
                                Get detailed information about course content, prerequisites, and learning outcomes.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full bg-green-600 hover:bg-green-700"
                                onClick={() => handleOpen("Course Information Inquiry")}
                            >
                                Contact Now
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Technical Support */}
                    <Card className="card-hover">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <CardTitle>Technical Support</CardTitle>
                            <CardDescription>
                                Need help with platform navigation, video playback, or assignment submissions?
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                onClick={() => handleOpen("Technical Support Inquiry")}
                            >
                                Contact Now
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Learning Support */}
                    <Card className="card-hover">
                        <CardHeader>
                            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center mb-4">
                                <TrendingUp className="h-6 w-6 text-purple-600" />
                            </div>
                            <CardTitle>Learning Support</CardTitle>
                            <CardDescription>
                                Struggling with course material? Get personalized help from our instructors.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button
                                className="w-full bg-purple-600 hover:bg-purple-700"
                                onClick={() => handleOpen("Learning Support Inquiry")}
                            >
                                Contact Now
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Send Inquiry</DialogTitle>
                            <DialogDescription>
                                Fill out the form below to send your inquiry to our support team.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@example.com"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    placeholder="Inquiry Subject"
                                    required
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="message">Message</Label>
                                <Textarea
                                    id="message"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="How can we help you?"
                                    className="min-h-[100px]"
                                    required
                                />
                            </div>
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    "Send Inquiry"
                                )}
                            </Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </section>
    )
}
