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
import { Loader2, Crown } from "lucide-react"

interface EliteUpgradeDialogProps {
    defaultName?: string
    defaultEmail?: string
    username?: string
    buttonClassName?: string
    buttonText?: string
}

export function EliteUpgradeDialog({ defaultName = "", defaultEmail = "", username, buttonClassName, buttonText = "Upgrade to Elite" }: EliteUpgradeDialogProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: defaultName,
        email: defaultEmail,
        phone: "",
        message: ""
    })
    const { toast } = useToast()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const response = await fetch("/api/elite-upgrade", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ...formData,
                    username
                })
            })

            if (response.ok) {
                toast({
                    title: "Request Sent!",
                    description: "Our team will reach out with Elite upgrade details soon.",
                    variant: "default",
                })
                setOpen(false)
                setFormData({ name: defaultName, email: defaultEmail, phone: "", message: "" })
            } else {
                throw new Error("Failed to send request")
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
            <DialogContent className="sm:max-w-[425px] bg-[#0d1424] text-slate-200 border-white/10">
                <DialogHeader>
                    <DialogTitle className="text-white flex items-center gap-2">
                        <Crown className="h-5 w-5 text-yellow-400" />
                        Upgrade to Elite
                    </DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Tell us a bit about yourself and our team will reach out with Elite membership details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="elite-name" className="text-slate-300">Name</Label>
                        <Input
                            id="elite-name"
                            placeholder="Your full name"
                            required
                            className="bg-white/5 border-white/10 text-white"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="elite-email" className="text-slate-300">Email</Label>
                        <Input
                            id="elite-email"
                            type="email"
                            placeholder="your@email.com"
                            required
                            className="bg-white/5 border-white/10 text-white"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="elite-phone" className="text-slate-300">Phone Number (Optional)</Label>
                        <Input
                            id="elite-phone"
                            type="tel"
                            placeholder="+91 00000 00000"
                            className="bg-white/5 border-white/10 text-white"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="elite-message" className="text-slate-300">Message (Optional)</Label>
                        <Textarea
                            id="elite-message"
                            placeholder="Any specific questions about Elite?"
                            className="bg-white/5 border-white/10 text-white min-h-[100px]"
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600 hover:opacity-90 text-white font-semibold h-12 rounded-full border-none"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : "Send Request"}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
