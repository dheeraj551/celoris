"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle, X, AlertCircle, Sparkles, BookOpen } from 'lucide-react'

interface StudentInquiryFormProps {
    isOpen: boolean
    onClose: () => void
}

export default function StudentInquiryForm({ isOpen, onClose }: StudentInquiryFormProps) {
    const [submitting, setSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [inquiryId, setInquiryId] = useState('')

    useEffect(() => {
        const randomId = `#INQ-${Math.floor(100000 + Math.random() * 900000)}`
        setInquiryId(randomId)
    }, [])

    const [formData, setFormData] = useState({
        // 1. Student Details
        fullName: '',
        ageClass: '',
        gender: '',
        parentName: '',
        contactNumber: '',
        alternateNumber: '',
        email: '',

        // 2. Location
        city: '',
        areaLocality: '',
        address: '',

        // 3. Learning Requirement
        requirementType: [] as string[],
        learningMode: '',

        // 4. Subject/Course
        subject: '',
        classLevel: '',
        board: '',

        // 5. Learning Goals
        primaryGoal: '',
        specificTopics: '',

        // 6. Preferred Tutor
        tutorPreference: '',
        experiencePreference: '',
        languagePreference: [] as string[],

        // 7. Schedule
        daysRequired: [] as string[],
        timeSlot: [] as string[],
        classesPerWeek: '',

        // 8. Budget
        budgetRange: '',
        negotiable: '',

        // 9. Demo
        demoInterested: '',
        demoMode: '',

        // 10. Urgency
        urgency: '',

        // 11. Notes
        notes: ''
    })

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const toggleArrayItem = (field: keyof typeof formData, value: string) => {
        setFormData(prev => {
            const array = prev[field] as string[]
            if (array.includes(value)) {
                return { ...prev, [field]: array.filter((item: string) => item !== value) }
            } else {
                return { ...prev, [field]: [...array, value] }
            }
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            // Transform camelCase to snake_case for DB
            const payload = {
                inquiry_ref_id: inquiryId,
                full_name: formData.fullName,
                age_class: formData.ageClass,
                gender: formData.gender,
                parent_name: formData.parentName,
                contact_number: formData.contactNumber,
                alternate_number: formData.alternateNumber,
                email: formData.email,

                city: formData.city,
                area_locality: formData.areaLocality,
                address: formData.address,

                requirement_type: formData.requirementType,
                learning_mode: formData.learningMode,

                subject_course_needed: formData.subject,
                class_level: formData.classLevel,
                board_exam: formData.board,

                primary_goal: formData.primaryGoal,
                specific_topics: formData.specificTopics,

                tutor_preference: formData.tutorPreference,
                experience_preference: formData.experiencePreference,
                language_preference: formData.languagePreference,

                days_required: formData.daysRequired,
                preferred_time_slot: formData.timeSlot,
                classes_per_week: formData.classesPerWeek,

                budget_range: formData.budgetRange,
                negotiable: formData.negotiable === 'Yes',

                demo_interested: formData.demoInterested === 'Yes',
                demo_mode: formData.demoMode,

                urgency_level: formData.urgency,

                additional_notes: formData.notes
            }

            const response = await fetch('/api/student-inquiry', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const resData = await response.json()
                throw new Error(resData.error || 'Failed to submit inquiry')
            }

            setSubmitSuccess(true)
            setTimeout(() => {
                onClose()
            }, 3000)

        } catch (err: any) {
            console.error(err)
            setError(err.message || 'An error occurred')
        } finally {
            setSubmitting(false)
        }
    }

    // Components helpers
    const SectionTitle = ({ number, title }: { number: string, title: string }) => (
        <div className="flex items-center gap-3 mb-6 mt-8 border-b border-white/5 pb-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 font-black text-sm border border-indigo-500/20">
                {number}
            </div>
            <h3 className="text-lg font-bold text-white uppercase italic tracking-wider">{title}</h3>
        </div>
    )

    const RadioGroup = ({ options, selected, onChange }: { options: string[], selected: string, onChange: (val: string) => void }) => (
        <div className="flex flex-wrap gap-3">
            {options.map((opt: string) => (
                <label key={opt} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all ${selected === opt ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'}`}>
                    <div className={`w-3 h-3 rounded-full border ${selected === opt ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`} />
                    <input type="radio" className="hidden" checked={selected === opt} onChange={() => onChange(opt)} />
                    <span className="text-xs font-bold uppercase tracking-wider">{opt}</span>
                </label>
            ))}
        </div>
    )

    const CheckboxGroup = ({ options, selected, onChange }: { options: string[], selected: string[], onChange: (val: string) => void }) => (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {options.map((opt: string) => (
                <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected?.includes(opt) ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selected?.includes(opt) ? 'bg-indigo-500 border-indigo-500' : 'border-slate-500'}`}>
                        {selected?.includes(opt) && <CheckCircle size={10} className="text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={selected?.includes(opt)} onChange={() => onChange(opt)} />
                    <span className="text-xs font-medium text-slate-300">{opt}</span>
                </label>
            ))}
        </div>
    )

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 overflow-y-auto">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="w-full max-w-4xl bg-[#0d1321] border border-white/10 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                {/* Header */}
                <div className="p-8 border-b border-white/5 bg-[#0d1321] relative z-20 flex justify-between items-center bg-gradient-to-r from-indigo-900/10 to-transparent">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-2"
                        >
                            <BookOpen className="text-indigo-400 h-5 w-5" />
                            <span className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.3em] flex-grow">Student Inquiry <span className="text-slate-500 ml-2">{inquiryId}</span></span>
                        </motion.div>
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Learning Request</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-500 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
                    {submitSuccess ? (
                        <div className="flex flex-col items-center justify-center h-full py-20 text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mb-8 border border-indigo-500/30"
                            >
                                <CheckCircle className="w-12 h-12 text-indigo-400" />
                            </motion.div>
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Request Received!</h3>
                            <p className="text-slate-400 max-w-md mx-auto mb-8">
                                We have received your inquiry. Our academic counselors will analyze your requirements and contact you shortly.
                            </p>
                            <Button onClick={onClose} className="bg-indigo-600 font-bold">Close</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                                    <AlertCircle size={20} />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {/* 1. Student Details */}
                            <SectionTitle number="01" title="Student Details" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Student Full Name</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Age / Class</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.ageClass} onChange={e => handleChange('ageClass', e.target.value)} required />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Gender</Label>
                                    <RadioGroup options={['Male', 'Female', 'Other']} selected={formData.gender} onChange={val => handleChange('gender', val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Parent / Guardian Name</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.parentName} onChange={e => handleChange('parentName', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Contact Number (WhatsApp Preferred)</Label>
                                    <Input type="tel" className="bg-white/5 border-white/10" value={formData.contactNumber} onChange={e => handleChange('contactNumber', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Alternate Contact</Label>
                                    <Input type="tel" className="bg-white/5 border-white/10" value={formData.alternateNumber} onChange={e => handleChange('alternateNumber', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Email Address</Label>
                                    <Input type="email" className="bg-white/5 border-white/10" value={formData.email} onChange={e => handleChange('email', e.target.value)} required />
                                </div>
                            </div>

                            {/* 2. Location Details */}
                            <SectionTitle number="02" title="Location Details" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">City</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.city} onChange={e => handleChange('city', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Area / Locality</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.areaLocality} onChange={e => handleChange('areaLocality', e.target.value)} required />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Full Address (Optional for Online)</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.address} onChange={e => handleChange('address', e.target.value)} />
                                </div>
                            </div>

                            {/* 3. Learning Requirement */}
                            <SectionTitle number="03" title="Learning Requirement" />
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">What are you looking for?</Label>
                                    <CheckboxGroup options={['Home Tutor', 'Online Tutor', 'Online Course', 'Coaching / Institute', 'Corporate Training']} selected={formData.requirementType} onChange={val => toggleArrayItem('requirementType', val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Mode of Learning Preferred</Label>
                                    <RadioGroup options={['Online', 'Offline (Home Tuition)', 'Hybrid']} selected={formData.learningMode} onChange={val => handleChange('learningMode', val)} />
                                </div>
                            </div>

                            {/* 4. Subject / Course Details */}
                            <SectionTitle number="04" title="Subject / Course Details" />
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Subject / Course Needed</Label>
                                    <Input placeholder="e.g. Class 10 Maths, Python, etc." className="bg-white/5 border-white/10" value={formData.subject} onChange={e => handleChange('subject', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Class / Level</Label>
                                    <RadioGroup options={['Class 1–5', 'Class 6–8', 'Class 9–10', 'Class 11–12', 'Graduation', 'Skill-Based', 'Competitive Exam']} selected={formData.classLevel} onChange={val => handleChange('classLevel', val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Board / Exam (if applicable)</Label>
                                    <RadioGroup options={['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Other']} selected={formData.board} onChange={val => handleChange('board', val)} />
                                </div>
                            </div>

                            {/* 5. Learning Goals */}
                            <SectionTitle number="05" title="Learning Goals" />
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Primary Goal</Label>
                                    <RadioGroup options={['Exam Preparation', 'Concept Clarity', 'Skill Development', 'Career Upgrade', 'Hobby / Interest']} selected={formData.primaryGoal} onChange={val => handleChange('primaryGoal', val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Specific Topics / Weak Areas (Optional)</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.specificTopics} onChange={e => handleChange('specificTopics', e.target.value)} />
                                </div>
                            </div>

                            {/* 6. Preferred Tutor */}
                            <SectionTitle number="06" title="Preferred Tutor / Trainer" />
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Tutor Preference</Label>
                                    <RadioGroup options={['Male', 'Female', 'Any']} selected={formData.tutorPreference} onChange={val => handleChange('tutorPreference', val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Experience Preference</Label>
                                    <RadioGroup options={['Fresher', '1–3 Years', '3–5 Years', '5+ Years']} selected={formData.experiencePreference} onChange={val => handleChange('experiencePreference', val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Language Preference</Label>
                                    <CheckboxGroup options={['English', 'Hindi', 'Hinglish', 'Other']} selected={formData.languagePreference} onChange={val => toggleArrayItem('languagePreference', val)} />
                                </div>
                            </div>

                            {/* 7. Schedule */}
                            <SectionTitle number="07" title="Schedule & Availability" />
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Days Required</Label>
                                    <CheckboxGroup options={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} selected={formData.daysRequired} onChange={val => toggleArrayItem('daysRequired', val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Preferred Time Slot</Label>
                                    <CheckboxGroup options={['Morning', 'Afternoon', 'Evening', 'Night']} selected={formData.timeSlot} onChange={val => toggleArrayItem('timeSlot', val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Classes per Week</Label>
                                    <RadioGroup options={['2', '3', '4', '5', 'Flexible']} selected={formData.classesPerWeek} onChange={val => handleChange('classesPerWeek', val)} />
                                </div>
                            </div>

                            {/* 8. Budget */}
                            <SectionTitle number="08" title="Budget & Fees" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Monthly Budget Range</Label>
                                    <RadioGroup options={['₹2,000–₹4,000', '₹4,000–₹8,000', '₹8,000–₹15,000', 'Flexible']} selected={formData.budgetRange} onChange={val => handleChange('budgetRange', val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Open to Negotiation?</Label>
                                    <RadioGroup options={['Yes', 'No']} selected={formData.negotiable} onChange={val => handleChange('negotiable', val)} />
                                </div>
                            </div>

                            {/* 9. Demo Class */}
                            <SectionTitle number="09" title="Demo Class" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Interested in Free Demo?</Label>
                                    <RadioGroup options={['Yes', 'No']} selected={formData.demoInterested} onChange={val => handleChange('demoInterested', val)} />
                                </div>
                                {formData.demoInterested === 'Yes' && (
                                    <div className="space-y-2">
                                        <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Preferred Demo Mode</Label>
                                        <RadioGroup options={['Online', 'Offline']} selected={formData.demoMode} onChange={val => handleChange('demoMode', val)} />
                                    </div>
                                )}
                            </div>

                            {/* 10. Urgency */}
                            <SectionTitle number="10" title="Urgency Level" />
                            <div className="space-y-2">
                                <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">When to start?</Label>
                                <RadioGroup options={['Immediately', 'Within a Week', 'Within 15 Days', 'Flexible']} selected={formData.urgency} onChange={val => handleChange('urgency', val)} />
                            </div>

                            {/* 11. Notes */}
                            <SectionTitle number="11" title="Additional Notes" />
                            <div className="space-y-4">
                                <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Any specific requirements?</Label>
                                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-indigo-500 min-h-[100px]" placeholder="Exam focus, strict teacher, homework support, etc." value={formData.notes} onChange={e => handleChange('notes', e.target.value)} />
                            </div>

                            {/* Submit Button */}
                            <div className="pt-8">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full h-16 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.01]"
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Submitting Inquiry...
                                        </span>
                                    ) : 'Submit Inquiry'}
                                </Button>
                            </div>

                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
