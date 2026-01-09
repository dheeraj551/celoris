"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Briefcase, User, MapPin, Mail, Phone, Calendar,
    GraduationCap, Award, FileText, CheckCircle, X,
    AlertCircle, Sparkles, Building2, Globe
} from 'lucide-react'
import { createClientForBrowser } from '@/lib/supabase-client'

interface JobApplicationFormProps {
    jobId?: string
    jobTitle?: string
    isOpen: boolean
    onClose: () => void
}

export default function JobApplicationForm({ jobId, jobTitle, isOpen, onClose }: JobApplicationFormProps) {
    const [submitting, setSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [applicationId, setApplicationId] = useState('')

    useEffect(() => {
        const randomId = `#JOB-${Math.floor(100000 + Math.random() * 900000)}`
        setApplicationId(randomId)
    }, [])

    const [formData, setFormData] = useState({
        // 1. Personal Details
        fullName: '',
        dateOfBirth: '',
        gender: '', // Male, Female, Other
        mobileNumber: '',
        email: '',
        currentCity: '',
        currentAddress: '',

        // 2. Job Application Details
        department: '',
        employmentType: '',
        workMode: '',

        // 3. Professional Summary
        summary: '',

        // 4. Education
        education: {
            tenth: { qualification: '10th', degree: '', specialization: '', institute: '', year: '' },
            twelfth: { qualification: '12th', degree: '', specialization: '', institute: '', year: '' },
            graduation: { qualification: 'Graduation', degree: '', specialization: '', institute: '', year: '' },
            postGraduation: { qualification: 'Post-Graduation', degree: '', specialization: '', institute: '', year: '' }
        },

        // 5. Skills & Expertise
        primarySkills: '',
        secondarySkills: '',
        toolsKnown: '',
        skillLevel: '',

        // 6. Work Experience
        totalExperience: '',
        lastJobCompany: '',
        lastJobRole: '',
        lastJobDuration: '',
        lastJobResponsibilities: ''
    })

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    const handleEducationChange = (level: string, field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            education: {
                ...prev.education,
                [level]: {
                    ...(prev.education as any)[level],
                    [field]: value
                }
            }
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            const payload = {
                application_ref_id: applicationId,
                job_id: jobId,
                job_title: jobTitle,

                full_name: formData.fullName,
                date_of_birth: formData.dateOfBirth,
                gender: formData.gender,
                mobile_number: formData.mobileNumber,
                email: formData.email,
                current_city: formData.currentCity,
                current_address: formData.currentAddress,

                department: formData.department,
                employment_type_preferred: formData.employmentType,
                work_mode_preference: formData.workMode,

                professional_summary: formData.summary,

                education_details: formData.education,

                primary_skills: formData.primarySkills,
                secondary_skills: formData.secondarySkills,
                tools_known: formData.toolsKnown,
                skill_level: formData.skillLevel,

                total_experience: formData.totalExperience,
                last_job_company: formData.lastJobCompany,
                last_job_role: formData.lastJobRole,
                last_job_duration: formData.lastJobDuration,
                last_job_responsibilities: formData.lastJobResponsibilities
            }

            const response = await fetch('/api/job-application', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })

            if (!response.ok) {
                const resData = await response.json()
                throw new Error(resData.error || 'Failed to submit application')
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

    // Helper Components
    const SectionTitle = ({ number, title }: { number: string, title: string }) => (
        <div className="flex items-center gap-3 mb-6 mt-8 border-b border-white/5 pb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black text-sm border border-emerald-500/20">
                {number}
            </div>
            <h3 className="text-lg font-bold text-white uppercase italic tracking-wider">{title}</h3>
        </div>
    )

    const RadioGroup = ({ options, selected, onChange }: { options: string[], selected: string, onChange: (val: string) => void }) => (
        <div className="flex flex-wrap gap-3">
            {options.map(opt => (
                <label key={opt} className={`flex items-center gap-2 px-4 py-2 rounded-xl border cursor-pointer transition-all ${selected === opt ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/10'}`}>
                    <div className={`w-3 h-3 rounded-full border ${selected === opt ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}`} />
                    <input type="radio" className="hidden" checked={selected === opt} onChange={() => onChange(opt)} />
                    <span className="text-xs font-bold uppercase tracking-wider">{opt}</span>
                </label>
            ))}
        </div>
    )

    const CheckboxGroup = ({ options, selected, onChange }: { options: string[], selected: string[], onChange: (val: string) => void }) => (
        <div className="grid grid-cols-2 gap-3">
            {options.map(opt => (
                <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected?.includes(opt) ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selected?.includes(opt) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}`}>
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
                <div className="p-8 border-b border-white/5 bg-[#0d1321] relative z-20 flex justify-between items-center bg-gradient-to-r from-emerald-900/10 to-transparent">
                    <div>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-3 mb-2"
                        >
                            <Sparkles className="text-emerald-400 h-5 w-5" />
                            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] flex-grow">Official Candidate Application <span className="text-slate-500 ml-2">{applicationId}</span></span>
                        </motion.div>
                        <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Job Application</h2>
                            {jobTitle && (
                                <p className="text-slate-400 text-sm">
                                    Position: <span className="text-white font-bold">{jobTitle}</span>
                                </p>
                            )}
                        </div>
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
                                className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mb-8 border border-emerald-500/30"
                            >
                                <CheckCircle className="w-12 h-12 text-emerald-400" />
                            </motion.div>
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">Application Submitted!</h3>
                            <p className="text-slate-400 max-w-md mx-auto mb-8">
                                Your application has been successfully transmitted to our recruitment team. Good luck!
                            </p>
                            <Button onClick={onClose} className="bg-emerald-600 font-bold">Return to Jobs</Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-400">
                                    <AlertCircle size={20} />
                                    <p className="text-sm font-medium">{error}</p>
                                </div>
                            )}

                            {/* 1. Personal Information */}
                            <SectionTitle number="01" title="Personal Details" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Full Name</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.fullName} onChange={e => handleChange('fullName', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Date of Birth</Label>
                                    <Input type="date" className="bg-white/5 border-white/10" value={formData.dateOfBirth} onChange={e => handleChange('dateOfBirth', e.target.value)} required />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Gender</Label>
                                    <RadioGroup options={['Male', 'Female', 'Other']} selected={formData.gender} onChange={val => handleChange('gender', val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Mobile Number (WhatsApp Preferred)</Label>
                                    <Input type="tel" className="bg-white/5 border-white/10" value={formData.mobileNumber} onChange={e => handleChange('mobileNumber', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Email Address</Label>
                                    <Input type="email" className="bg-white/5 border-white/10" value={formData.email} onChange={e => handleChange('email', e.target.value)} required />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Current City</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.currentCity} onChange={e => handleChange('currentCity', e.target.value)} required />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Current Address (City, State, Country)</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.currentAddress} onChange={e => handleChange('currentAddress', e.target.value)} />
                                </div>
                            </div>

                            {/* 2. Job Application Details */}
                            <SectionTitle number="02" title="Job Application Details" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Department / Category</Label>
                                    <RadioGroup options={['IT / Tech', 'Marketing', 'Design', 'Sales', 'Education', 'Operations', 'Other']} selected={formData.department} onChange={val => handleChange('department', val)} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Employment Type Preferred</Label>
                                    <RadioGroup options={['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship']} selected={formData.employmentType} onChange={val => handleChange('employmentType', val)} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Work Mode Preference</Label>
                                    <RadioGroup options={['Remote', 'On-site', 'Hybrid']} selected={formData.workMode} onChange={val => handleChange('workMode', val)} />
                                </div>
                            </div>

                            {/* 3. Professional Summary */}
                            <SectionTitle number="03" title="Professional Summary" />
                            <div className="space-y-4">
                                <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Brief Profile Summary (2-4 lines)</Label>
                                <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 min-h-[100px]" value={formData.summary} onChange={e => handleChange('summary', e.target.value)} />
                            </div>

                            {/* 4. Education Details */}
                            <SectionTitle number="04" title="Education Details" />
                            <div className="space-y-8">
                                {['tenth', 'twelfth', 'graduation', 'postGraduation'].map((level) => (
                                    <div key={level} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                        <div className="mb-3">
                                            <span className="text-emerald-400 font-bold uppercase tracking-wider text-xs">{(formData.education as any)[level].qualification}</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            {level !== 'tenth' && level !== 'twelfth' && (
                                                <div className="space-y-1">
                                                    <Input placeholder="Degree (e.g. B.Tech)" className="bg-black/20 border-white/10 text-xs h-9" value={(formData.education as any)[level].degree} onChange={e => handleEducationChange(level, 'degree', e.target.value)} />
                                                </div>
                                            )}
                                            {level !== 'tenth' && (
                                                <div className="space-y-1">
                                                    <Input placeholder="Specialization" className="bg-black/20 border-white/10 text-xs h-9" value={(formData.education as any)[level].specialization} onChange={e => handleEducationChange(level, 'specialization', e.target.value)} />
                                                </div>
                                            )}
                                            <div className="space-y-1">
                                                <Input placeholder="Institute / Board" className="bg-black/20 border-white/10 text-xs h-9" value={(formData.education as any)[level].institute} onChange={e => handleEducationChange(level, 'institute', e.target.value)} />
                                            </div>
                                            <div className="space-y-1">
                                                <Input placeholder="Year of Passing" className="bg-black/20 border-white/10 text-xs h-9" value={(formData.education as any)[level].year} onChange={e => handleEducationChange(level, 'year', e.target.value)} />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* 5. Skills & Expertise */}
                            <SectionTitle number="05" title="Skills & Expertise" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Primary Skills (Comma Separated)</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.primarySkills} onChange={e => handleChange('primarySkills', e.target.value)} required />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Secondary Skills</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.secondarySkills} onChange={e => handleChange('secondarySkills', e.target.value)} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Tools / Tech Known</Label>
                                    <Input placeholder="Excel, Photoshop, React, etc." className="bg-white/5 border-white/10" value={formData.toolsKnown} onChange={e => handleChange('toolsKnown', e.target.value)} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Overall Skill Level</Label>
                                    <RadioGroup options={['Beginner', 'Intermediate', 'Advanced', 'Expert']} selected={formData.skillLevel} onChange={val => handleChange('skillLevel', val)} />
                                </div>
                            </div>

                            {/* 6. Work Experience */}
                            <SectionTitle number="06" title="Work Experience" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Total Experience</Label>
                                    <RadioGroup options={['Fresher', '0–1 yr', '1–3 yrs', '3–5 yrs', '5+ yrs']} selected={formData.totalExperience} onChange={val => handleChange('totalExperience', val)} />
                                </div>
                                {formData.totalExperience !== 'Fresher' && (
                                    <>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Last / Current Company</Label>
                                            <Input className="bg-white/5 border-white/10" value={formData.lastJobCompany} onChange={e => handleChange('lastJobCompany', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Job Role / Designation</Label>
                                            <Input className="bg-white/5 border-white/10" value={formData.lastJobRole} onChange={e => handleChange('lastJobRole', e.target.value)} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Duration (From - To)</Label>
                                            <Input className="bg-white/5 border-white/10" value={formData.lastJobDuration} onChange={e => handleChange('lastJobDuration', e.target.value)} />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Key Responsibilities</Label>
                                            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500 min-h-[100px]" value={formData.lastJobResponsibilities} onChange={e => handleChange('lastJobResponsibilities', e.target.value)} />
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="pt-8">
                                <Button
                                    type="submit"
                                    disabled={submitting}
                                    className="w-full h-16 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.01]"
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Submitting Application...
                                        </span>
                                    ) : 'Submit Application'}
                                </Button>
                            </div>

                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
