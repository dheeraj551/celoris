"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase-client"
import { Loader2, PlusCircle, Sparkles, CheckCircle2 } from "lucide-react"
import { maskContactInfo } from "@/lib/contact-shield"

export function PostLearningNeedModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
    mode: "Online",
    location: "",
    requirement: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const payload = {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim() || null,
        contact: formData.phone.trim() + (formData.email.trim() ? ` / ${formData.email.trim()}` : ''),
        course: formData.course.trim(),
        mode: formData.mode,
        location: formData.location.trim() || null,
        requirement: maskContactInfo(formData.requirement.trim()),
        source: 'website_learn_page'
      }

      let succeeded = false

      // Primary: Post via secure server API endpoint (bypasses client RLS & triggers email alert)
      try {
        const response = await fetch('/api/leads/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })

        if (response.ok) {
          succeeded = true
        } else {
          const resJson = await response.json().catch(() => ({}))
          console.warn('API lead submission returned non-200, attempting client fallback:', resJson)
        }
      } catch (apiErr) {
        console.warn('API lead submission network error, attempting client fallback:', apiErr)
      }

      // Fallback: Direct client-side insert into Supabase leads table if API failed
      if (!succeeded) {
        const supabase = createClient()
        const { error } = await supabase
          .from('leads')
          .insert([{
            name: payload.name,
            phone: payload.phone,
            email: payload.email,
            contact_info: payload.contact,
            course: payload.course,
            mode: payload.mode,
            location: payload.location,
            requirement: payload.requirement,
            source: payload.source,
            status: 'open'
          }])

        if (error) throw error
      }

      setSubmitted(true)
      toast({
        title: "Requirement Posted Successfully!",
        description: "Your request is now live in the Teach section. Trainers will review your requirement and reach out.",
      })

      setTimeout(() => {
        setOpen(false)
        setSubmitted(false)
        setFormData({ name: "", phone: "", email: "", course: "", mode: "Online", location: "", requirement: "" })
      }, 1800)
    } catch (error: any) {
      console.error("Error submitting lead:", error)
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong while posting your request. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val)
      if (!val) setSubmitted(false)
    }}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl h-14 px-8 font-bold text-sm uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 gap-2">
          <PlusCircle size={18} /> Post a Learning Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px] bg-[#0d1321] text-white border-white/10 rounded-3xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles size={14} /> Direct Trainer Connect
          </div>
          <DialogTitle className="text-2xl font-black italic uppercase tracking-tight">Post Your Learning Need</DialogTitle>
          <DialogDescription className="text-slate-400 text-xs sm:text-sm">
            Tell us what skill or topic you want to master. We'll directly post it to our public leads board for qualified trainers.
          </DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 border border-emerald-500/30 animate-in zoom-in">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-tight text-white">Requirement Live!</h3>
            <p className="text-sm text-slate-300 max-w-xs">
              Your requirement has been posted to the public leads table connected to the Teach section. Trainers will contact you shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Your Full Name *</label>
              <Input 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                placeholder="e.g. Rahul Sharma"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-11 rounded-xl"
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-300">WhatsApp / Phone *</label>
                <Input 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  required 
                  type="tel"
                  placeholder="+91 98765 43210"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-11 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Email Address (Optional)</label>
                <Input 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  type="email"
                  placeholder="name@email.com"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-11 rounded-xl"
                />
              </div>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Skill / Course Wanted *</label>
              <Input 
                name="course" 
                value={formData.course} 
                onChange={handleChange} 
                required 
                placeholder="e.g. Video Editing, Advanced Excel, React JS, Spoken English"
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-11 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Preferred Mode *</label>
                <select 
                  name="mode" 
                  value={formData.mode} 
                  onChange={handleChange}
                  className="w-full bg-[#162032] border border-white/10 text-white rounded-xl h-11 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
                >
                  <option value="Online">Online Classes (1-on-1 / Batch)</option>
                  <option value="Offline">Offline / Home Tuition</option>
                  <option value="Hybrid">Hybrid (Online + Offline)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-widest text-slate-300">City / Location</label>
                <Input 
                  name="location" 
                  value={formData.location} 
                  onChange={handleChange} 
                  placeholder="e.g. Delhi, Noida, Gurgaon, or Remote"
                  className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-300">Details / Specific Goals *</label>
              <Textarea 
                name="requirement" 
                value={formData.requirement} 
                onChange={handleChange} 
                required 
                placeholder="Mention your current skill level, availability (weekdays/weekends), and what specific topics you want to learn..."
                className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 min-h-[90px] rounded-xl text-xs sm:text-sm"
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 font-bold uppercase tracking-widest mt-2 rounded-xl transition-all shadow-lg shadow-emerald-600/20"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting Request...
                </>
              ) : (
                "Post Request to Trainers"
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
