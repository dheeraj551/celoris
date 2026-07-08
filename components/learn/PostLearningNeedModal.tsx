"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase-client"
import { Loader2, PlusCircle } from "lucide-react"

export function PostLearningNeedModal() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    course: "",
    mode: "Online",
    requirement: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('leads')
        .insert([{
          name: formData.name,
          phone: formData.contact, // Storing in phone, but could be email
          course: formData.course,
          mode: formData.mode,
          requirement: formData.requirement,
          source: 'website_learn_page',
          status: 'open'
        }])

      if (error) throw error

      toast({
        title: "Request Submitted!",
        description: "Your learning need has been posted successfully. We'll connect you with a trainer soon.",
      })
      
      setOpen(false)
      setFormData({ name: "", contact: "", course: "", mode: "Online", requirement: "" })
    } catch (error: any) {
      console.error("Error submitting lead:", error)
      toast({
        title: "Submission Failed",
        description: error.message || "Something went wrong while posting your request.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl h-14 px-8 font-bold text-sm uppercase tracking-widest transition-all shadow-lg shadow-emerald-500/20 gap-2">
          <PlusCircle size={18} /> Post a Learning Request
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#0d1321] text-white border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold italic uppercase">What do you want to learn?</DialogTitle>
          <DialogDescription className="text-slate-400">
            Tell us what you're looking for, and we'll match you with the right trainer.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-300">Your Name</label>
            <Input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Rahul Sharma"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-300">Contact Info (Phone/Email)</label>
            <Input 
              name="contact" 
              value={formData.contact} 
              onChange={handleChange} 
              required 
              placeholder="How can we reach you?"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-300">Topic / Course</label>
            <Input 
              name="course" 
              value={formData.course} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Advanced Excel, React JS, Yoga"
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-300">Preferred Mode</label>
            <select 
              name="mode" 
              value={formData.mode} 
              onChange={handleChange}
              className="w-full bg-[#162032] border border-white/10 text-white rounded-md h-10 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="Online">Online Classes</option>
              <option value="Offline">Offline / Home Tuition</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-300">Details / Requirements</label>
            <Textarea 
              name="requirement" 
              value={formData.requirement} 
              onChange={handleChange} 
              required 
              placeholder="Describe your current level and what you want to achieve..."
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-500 min-h-[100px]"
            />
          </div>

          <Button 
            type="submit" 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white h-12 font-bold uppercase tracking-widest mt-4"
          >
            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...</> : "Post Request"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
