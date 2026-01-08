"use client"

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    User, CheckCircle, Upload, Calendar, Phone, Mail,
    MapPin, BookOpen, Clock, DollarSign, Languages, FileText,
    ChevronRight, ChevronLeft, X, AlertCircle, Sparkles, GraduationCap
} from 'lucide-react'
import { createClientForBrowser } from '@/lib/supabase-client'

interface TrainerRegistrationFormProps {
    noticeId?: string
    subject?: string
    studentName?: string
    isOpen: boolean
    onClose: () => void
}

export default function TrainerRegistrationForm({ noticeId, subject, studentName, isOpen, onClose }: TrainerRegistrationFormProps) {
    const [step, setStep] = useState(1)
    const [submitting, setSubmitting] = useState(false)
    const [submitSuccess, setSubmitSuccess] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [applicationId, setApplicationId] = useState('')

    useEffect(() => {
        // Generate random App ID: #APP-XXXXXX
        const randomId = `#APP-${Math.floor(100000 + Math.random() * 900000)}`
        setApplicationId(randomId)
    }, [])

    // File refs
    const idProofRef = useRef<HTMLInputElement>(null)
    const photoRef = useRef<HTMLInputElement>(null)

    const [formData, setFormData] = useState({
        // 1. Personal Info
        fullName: '',
        gender: '', // Male, Female, Other
        dateOfBirth: '',
        mobileNumber: '',
        alternateContact: '',
        email: '',
        currentCity: '',
        // Removed fullAddress

        // 2. Identity
        verificationLater: false, // New option
        govIdType: '', // Aadhaar, PAN, Passport, DL
        govIdNumber: '',
        idProofFile: null as File | null,
        photoFile: null as File | null,

        // 3. Education
        education: {
            tenth: { board: '', year: '', percentage: '' },
            twelfth: { board: '', year: '', percentage: '' },
            graduation: { degree: '', university: '', year: '' },
            postGraduation: { degree: '', university: '', year: '' }
        },
        additionalCertifications: '',

        // 4. Experience
        totalExperience: '',
        experienceType: [] as string[],
        previouslyTaughtAt: '',

        // 5. Subjects
        subjectsAcademic: [] as string[],
        classes: [] as string[],
        subjectsSkill: [] as string[],
        otherSubjects: '',

        // 6. Teaching Mode
        teachingMode: '', // Home, Online, Both
        preferredLocation: '',
        onlineTools: [] as string[],

        // 7. Availability
        daysAvailable: [] as string[],
        timeSlots: [] as string[],

        // 8. Fees
        expectedFees: '',
        minimumFee: '',
        freeDemo: '', // Yes, No
        paymentModes: [] as string[],

        // 9. Language
        languages: [] as string[],
        proficiency: '',

        // 10. Additional
        whyChooseYou: '',
        achievements: '',
        reference: '',

        // 11. Declaration
        declarationAccepted: false
    })

    const handleChange = (section: string, field: string, value: any) => {
        if (section === 'education') {
            setFormData(prev => ({
                ...prev,
                education: {
                    ...prev.education,
                    [field]: value
                }
            }))
        } else {
            setFormData(prev => ({ ...prev, [field]: value }))
        }
    }

    const toggleArrayItem = (field: keyof typeof formData, value: string) => {
        setFormData(prev => {
            const array = prev[field] as string[]
            if (array.includes(value)) {
                return { ...prev, [field]: array.filter(item => item !== value) }
            } else {
                return { ...prev, [field]: [...array, value] }
            }
        })
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, field: 'idProofFile' | 'photoFile') => {
        if (e.target.files && e.target.files[0]) {
            setFormData(prev => ({ ...prev, [field]: e.target.files![0] }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            const supabase = createClientForBrowser()

            // 1. Upload Files (only if not verifying later)
            let idProofUrl = ''
            let photoUrl = ''

            if (!formData.verificationLater) {
                if (formData.idProofFile) {
                    const fileName = `${Date.now()}_id_proof_${formData.idProofFile.name}`
                    const { data, error } = await supabase.storage
                        .from('trainer-documents') // Assuming 'documents' bucket exists, user should create it or use 'post-media' if public
                        .upload(`trainer-docs/${fileName}`, formData.idProofFile)

                    if (error) throw error
                    idProofUrl = data.path
                }

                if (formData.photoFile) {
                    const fileName = `${Date.now()}_photo_${formData.photoFile.name}`
                    const { data, error } = await supabase.storage
                        .from('trainer-documents')
                        .upload(`trainer-docs/${fileName}`, formData.photoFile)

                    if (error) throw error
                    photoUrl = data.path
                }
            }

            // 2. Submit Data
            const payload = {
                application_ref_id: applicationId,
                notice_id: noticeId,
                full_name: formData.fullName,
                gender: formData.gender,
                date_of_birth: formData.dateOfBirth,
                mobile_number: formData.mobileNumber,
                alternate_contact_number: formData.alternateContact,
                email: formData.email,
                current_city: formData.currentCity,
                // Removed full_address

                verification_later: formData.verificationLater,
                gov_id_type: formData.verificationLater ? null : formData.govIdType,
                gov_id_number: formData.verificationLater ? null : formData.govIdNumber,
                id_proof_front_url: formData.verificationLater ? null : idProofUrl,
                profile_photo_url: formData.verificationLater ? null : photoUrl,

                education_details: formData.education,
                additional_certifications: formData.additionalCertifications,

                total_experience: formData.totalExperience,
                experience_type: formData.experienceType,
                previously_taught_at: formData.previouslyTaughtAt,

                subjects_academic: formData.subjectsAcademic,
                classes: formData.classes,
                subjects_skill: formData.subjectsSkill,
                other_subjects: formData.otherSubjects,

                teaching_mode: formData.teachingMode,
                preferred_location: formData.preferredLocation,
                online_tools_known: formData.onlineTools,

                days_available: formData.daysAvailable,
                time_slots: formData.timeSlots,

                expected_fees: formData.expectedFees,
                minimum_fee: formData.minimumFee,
                free_demo: formData.freeDemo === 'Yes',
                payment_modes: formData.paymentModes,

                languages: formData.languages,
                language_proficiency: formData.proficiency,

                why_choose_you: formData.whyChooseYou,
                achievements: formData.achievements,
                reference: formData.reference,

                declaration_accepted: formData.declarationAccepted
            }

            const response = await fetch('/api/trainer-registration', {
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
            setError(err.message || 'An error occurred during submission')
        } finally {
            setSubmitting(false)
        }
    }

    // Helper components
    const SectionTitle = ({ number, title }: { number: string, title: string }) => (
        <div className="flex items-center gap-3 mb-6 mt-8 border-b border-white/5 pb-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 font-black text-sm border border-emerald-500/20">
                {number}
            </div>
            <h3 className="text-lg font-bold text-white uppercase italic tracking-wider">{title}</h3>
        </div>
    )

    const CheckboxGroup = ({ options, selected, onChange }: { options: string[], selected: string[], onChange: (val: string) => void }) => (
        <div className="grid grid-cols-2 gap-3">
            {options.map(opt => (
                <label key={opt} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selected.includes(opt) ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/5 hover:border-white/10'}`}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${selected.includes(opt) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-500'}`}>
                        {selected.includes(opt) && <CheckCircle size={10} className="text-white" />}
                    </div>
                    <input type="checkbox" className="hidden" checked={selected.includes(opt)} onChange={() => onChange(opt)} />
                    <span className="text-xs font-medium text-slate-300">{opt}</span>
                </label>
            ))}
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
                            <span className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] flex-grow">Official Application <span className="text-slate-500 ml-2">{applicationId}</span></span>
                        </motion.div>
                        <div className="flex flex-col md:flex-row md:items-baseline gap-2">
                            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Trainer Application</h2>
                            {subject && (
                                <p className="text-slate-400 text-sm">
                                    Applying for: <span className="text-white font-bold">{subject}</span>
                                    {studentName && <span className="ml-1 text-slate-500"> (Student: {studentName})</span>}
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
                                Your profile has been received. Our team will verify your details and get back to you shortly. A nominal fee has been deducted from your wallet.
                            </p>
                            <Button onClick={onClose} className="bg-emerald-600 font-bold">Return to Feed</Button>
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
                            <SectionTitle number="01" title="Personal Information" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Full Name (as per ID)</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.fullName} onChange={e => handleChange('personal', 'fullName', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Gender</Label>
                                    <RadioGroup options={['Male', 'Female', 'Other']} selected={formData.gender} onChange={val => handleChange('personal', 'gender', val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Date of Birth</Label>
                                    <Input type="date" className="bg-white/5 border-white/10" value={formData.dateOfBirth} onChange={e => handleChange('personal', 'dateOfBirth', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Mobile Number</Label>
                                    <Input type="tel" placeholder="WhatsApp Preferred" className="bg-white/5 border-white/10" value={formData.mobileNumber} onChange={e => handleChange('personal', 'mobileNumber', e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Alternate Contact</Label>
                                    <Input type="tel" className="bg-white/5 border-white/10" value={formData.alternateContact} onChange={e => handleChange('personal', 'alternateContact', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Email Address</Label>
                                    <Input type="email" className="bg-white/5 border-white/10" value={formData.email} onChange={e => handleChange('personal', 'email', e.target.value)} required />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Current City</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.currentCity} onChange={e => handleChange('personal', 'currentCity', e.target.value)} required />
                                </div>
                            </div>

                            {/* 2. Identity & Verification */}
                            <SectionTitle number="02" title="Identity & Verification" />

                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-4 mb-6">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="mt-1 w-4 h-4 rounded border-emerald-500/50 bg-emerald-500/10 text-emerald-500 focus:ring-emerald-500"
                                        checked={formData.verificationLater}
                                        onChange={e => setFormData(prev => ({ ...prev, verificationLater: e.target.checked }))}
                                    />
                                    <div>
                                        <p className="text-sm font-bold text-white uppercase tracking-wide">Complete Verification Later</p>
                                        <p className="text-xs text-slate-400 mt-1">Check this if you want to submit your basic details now and complete ID verification before starting your first class.</p>
                                    </div>
                                </label>
                            </div>

                            <AnimatePresence>
                                {!formData.verificationLater && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-hidden"
                                    >
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Government ID Type</Label>
                                            <RadioGroup options={['Aadhaar', 'PAN', 'Passport', 'Driving License']} selected={formData.govIdType} onChange={val => handleChange('identity', 'govIdType', val)} />
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">ID Number</Label>
                                            <Input className="bg-white/5 border-white/10" value={formData.govIdNumber} onChange={e => handleChange('identity', 'govIdNumber', e.target.value)} required={!formData.verificationLater} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Upload ID Proof (Front & Back)</Label>
                                            <div className="border border-dashed border-white/20 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer" onClick={() => idProofRef.current?.click()}>
                                                <Upload className="mx-auto h-8 w-8 text-slate-500 mb-2" />
                                                <p className="text-xs text-slate-400">{formData.idProofFile ? formData.idProofFile.name : 'Click to Upload ID File'}</p>
                                            </div>
                                            <input type="file" ref={idProofRef} onChange={e => handleFileUpload(e, 'idProofFile')} className="hidden" accept="image/*,.pdf" required={!formData.verificationLater} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Passport Photo</Label>
                                            <div className="border border-dashed border-white/20 rounded-xl p-6 text-center hover:bg-white/5 transition-colors cursor-pointer" onClick={() => photoRef.current?.click()}>
                                                <User className="mx-auto h-8 w-8 text-slate-500 mb-2" />
                                                <p className="text-xs text-slate-400">{formData.photoFile ? formData.photoFile.name : 'Click to Upload Photo'}</p>
                                            </div>
                                            <input type="file" ref={photoRef} onChange={e => handleFileUpload(e, 'photoFile')} className="hidden" accept="image/*" required={!formData.verificationLater} />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>


                            {/* 3. Educational Qualification */}
                            <SectionTitle number="03" title="Educational Qualification" />
                            <div className="space-y-4">
                                <div className="grid grid-cols-12 gap-4 text-[10px] items-center font-bold text-slate-500 uppercase tracking-wider mb-2">
                                    <div className="col-span-3">Level</div>
                                    <div className="col-span-9">Details (Board/University, Year)</div>
                                </div>
                                {['tenth', 'twelfth', 'graduation', 'postGraduation'].map((level) => (
                                    <div key={level} className="grid grid-cols-12 gap-4 items-start">
                                        <div className="col-span-3 pt-3">
                                            <span className="text-sm font-medium text-white capitalize">{level.replace('tenth', '10th').replace('twelfth', '12th').replace('graduation', 'Graduation').replace('postGraduation', 'Post Grad')}</span>
                                        </div>
                                        <div className="col-span-9 grid grid-cols-2 gap-2">
                                            <Input placeholder="Institution/Board" className="bg-white/5 border-white/10"
                                                value={level === 'tenth' || level === 'twelfth' ? (formData.education as any)[level].board : (formData.education as any)[level].university}
                                                onChange={(e) => {
                                                    const field = level === 'tenth' || level === 'twelfth' ? 'board' : 'university';
                                                    const newEdu = { ...formData.education, [level]: { ...(formData.education as any)[level], [field]: e.target.value } };
                                                    setFormData({ ...formData, education: newEdu });
                                                }}
                                            />
                                            <Input placeholder="Year" className="bg-white/5 border-white/10"
                                                value={(formData.education as any)[level].year}
                                                onChange={(e) => {
                                                    const newEdu = { ...formData.education, [level]: { ...(formData.education as any)[level], year: e.target.value } };
                                                    setFormData({ ...formData, education: newEdu });
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="space-y-2 mt-4">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Additional Certifications</Label>
                                    <Input placeholder="B.Ed, CTET, NET, IELTS, etc." className="bg-white/5 border-white/10" value={formData.additionalCertifications} onChange={e => handleChange('edu', 'additionalCertifications', e.target.value)} />
                                </div>
                            </div>

                            {/* 4. Teaching Experience */}
                            <SectionTitle number="04" title="Teaching Experience" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Total Experience</Label>
                                    <RadioGroup options={['Fresher', '0–1 yr', '1–3 yrs', '3–5 yrs', '5+ yrs']} selected={formData.totalExperience} onChange={val => handleChange('exp', 'totalExperience', val)} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Experience Type</Label>
                                    <CheckboxGroup options={['Home Tuition', 'Online Classes', 'School', 'Coaching Institute']} selected={formData.experienceType} onChange={val => toggleArrayItem('experienceType', val)} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Previously Taught At (Optional)</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.previouslyTaughtAt} onChange={e => handleChange('exp', 'previouslyTaughtAt', e.target.value)} />
                                </div>
                            </div>

                            {/* 5. Subjects */}
                            <SectionTitle number="05" title="Subjects You Can Teach" />
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Academic Subjects</Label>
                                    <CheckboxGroup options={['Maths', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi', 'Accounts', 'Economics', 'Computer Science']} selected={formData.subjectsAcademic} onChange={val => toggleArrayItem('subjectsAcademics' as any, val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Classes</Label>
                                    <CheckboxGroup options={['Class 1–5', 'Class 6–8', 'Class 9–10', 'Class 11–12', 'Graduation', 'Competitive Exams']} selected={formData.classes} onChange={val => toggleArrayItem('classes', val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Skill / Professional Courses</Label>
                                    <CheckboxGroup options={['IELTS / Spoken English', 'Microsoft Excel', 'Coding / Programming', 'Digital Marketing', 'AI / Data Science', 'Yoga / Fitness', 'Music / Dance']} selected={formData.subjectsSkill} onChange={val => toggleArrayItem('subjectsSkill', val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Other (Specify)</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.otherSubjects} onChange={e => handleChange('sub', 'otherSubjects', e.target.value)} />
                                </div>
                            </div>

                            {/* 6. Teaching Mode */}
                            <SectionTitle number="06" title="Teaching Mode Preference" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Mode of Teaching</Label>
                                    <RadioGroup options={['Home Tuition', 'Online Classes', 'Both']} selected={formData.teachingMode} onChange={val => handleChange('mode', 'teachingMode', val)} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Preferred Location</Label>
                                    <Input placeholder="Areas you can travel to" className="bg-white/5 border-white/10" value={formData.preferredLocation} onChange={e => handleChange('mode', 'preferredLocation', e.target.value)} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Online Teaching Tools Known</Label>
                                    <CheckboxGroup options={['Zoom', 'Google Meet', 'MS Teams', 'Whiteboard Tools']} selected={formData.onlineTools} onChange={val => toggleArrayItem('onlineTools', val)} />
                                </div>
                            </div>

                            {/* 7. Availability */}
                            <SectionTitle number="07" title="Availability" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Days Available</Label>
                                    <CheckboxGroup options={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']} selected={formData.daysAvailable} onChange={val => toggleArrayItem('daysAvailable', val)} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Preferred Time Slots</Label>
                                    <CheckboxGroup options={['Morning (6–10 AM)', 'Afternoon (10 AM–3 PM)', 'Evening (3–7 PM)', 'Night (7–10 PM)']} selected={formData.timeSlots} onChange={val => toggleArrayItem('timeSlots', val)} />
                                </div>
                            </div>

                            {/* 8. Fees & Payment */}
                            <SectionTitle number="08" title="Fees & Payment Details" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Expected Fees (per hour/month)</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.expectedFees} onChange={e => handleChange('fees', 'expectedFees', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Minimum Fee You Accept</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.minimumFee} onChange={e => handleChange('fees', 'minimumFee', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Willing to Offer Free Demo Class?</Label>
                                    <RadioGroup options={['Yes', 'No']} selected={formData.freeDemo} onChange={val => handleChange('fees', 'freeDemo', val)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Payment Mode Accepted</Label>
                                    <CheckboxGroup options={['UPI', 'Bank Transfer', 'Cash', 'Platform Wallet']} selected={formData.paymentModes} onChange={val => toggleArrayItem('paymentModes', val)} />
                                </div>
                            </div>

                            {/* 9. Language Proficiency */}
                            <SectionTitle number="09" title="Language Proficiency" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Languages You Can Teach In</Label>
                                    <CheckboxGroup options={['English', 'Hindi', 'Hinglish', 'Other']} selected={formData.languages} onChange={val => toggleArrayItem('languages', val)} />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Comfort Level</Label>
                                    <RadioGroup options={['Basic', 'Fluent', 'Expert']} selected={formData.proficiency} onChange={val => handleChange('lang', 'proficiency', val)} />
                                </div>
                            </div>

                            {/* 10. Additional Info */}
                            <SectionTitle number="10" title="Additional Information" />
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Why should students choose you? (100–150 words)</Label>
                                    <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-emerald-500" rows={4} value={formData.whyChooseYou} onChange={e => handleChange('add', 'whyChooseYou', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Special Achievements / Results</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.achievements} onChange={e => handleChange('add', 'achievements', e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-slate-500 tracking-wider font-bold">Reference (optional)</Label>
                                    <Input className="bg-white/5 border-white/10" value={formData.reference} onChange={e => handleChange('add', 'reference', e.target.value)} />
                                </div>
                            </div>

                            {/* 11. Declaration */}
                            <SectionTitle number="11" title="Declaration" />
                            <div className="space-y-6">
                                <label className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 cursor-pointer hover:bg-white/10 transition-colors">
                                    <input
                                        type="checkbox"
                                        className="mt-1 w-5 h-5 rounded border-slate-500 bg-transparent text-emerald-500 focus:ring-emerald-500 border"
                                        checked={formData.declarationAccepted}
                                        onChange={e => setFormData(prev => ({ ...prev, declarationAccepted: e.target.checked }))}
                                        required
                                    />
                                    <p className="text-sm text-slate-300 leading-relaxed">
                                        I hereby declare that all the information provided above is true and correct to the best of my knowledge. I agree to follow the platform’s rules and code of conduct.
                                    </p>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <div className="pt-8">
                                <Button
                                    type="submit"
                                    disabled={submitting || !formData.declarationAccepted}
                                    className="w-full h-16 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-black uppercase tracking-widest text-sm shadow-2xl shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.01]"
                                >
                                    {submitting ? (
                                        <span className="flex items-center gap-2">
                                            <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                            Submitting Application...
                                        </span>
                                    ) : 'Submit Registration'}
                                </Button>
                            </div>

                        </form>
                    )}
                </div>
            </motion.div>
        </div>
    )
}
