"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ArrowLeft, Eye, EyeOff, FileText, Check, X, Ticket, ShieldAlert } from "lucide-react"
import { useRouter } from "next/navigation"
import { createClientForBrowser } from "@/lib/supabase-client"

interface CourseApplication {
    id: string
    created_at: string
    user_id: string | null
    course_title: string
    course_slug: string | null
    full_name: string
    email: string
    phone: string | null
    message: string | null
    student_id_url: string
    status: 'pending' | 'approved' | 'rejected'
    reviewed_at: string | null
    offer_pass?: boolean
    intent?: string | null
}

const statusStyles: Record<CourseApplication['status'], string> = {
    pending: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    approved: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
    rejected: 'border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20',
}

function maskEmail(email?: string | null) {
    if (!email) return '—'
    const parts = email.split('@')
    if (parts.length !== 2) return '••••••'
    const user = parts[0]
    const domain = parts[1]
    const visible = user.length > 2 ? user.slice(0, 2) : user.slice(0, 1)
    return `${visible}••••@${domain}`
}

function maskPhone(phone?: string | null) {
    if (!phone) return '—'
    const cleaned = phone.trim()
    if (cleaned.length < 6) return '••••••'
    return cleaned.slice(0, -5) + '•••••'
}

export default function AdminCourseApplicationsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
            <CourseApplicationsContent />
        </Suspense>
    )
}

function CourseApplicationsContent() {
    const [applications, setApplications] = useState<CourseApplication[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedApp, setSelectedApp] = useState<CourseApplication | null>(null)
    const [signedUrl, setSignedUrl] = useState<string | null>(null)
    const [updatingId, setUpdatingId] = useState<string | null>(null)
    const [showContacts, setShowContacts] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchApplications()
    }, [])

    const fetchApplications = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/course-applications')
            const result = await response.json()

            if (!response.ok) {
                console.error('API Error:', result.error)
                return
            }

            setApplications(result.applications || [])
        } catch (error) {
            console.error('Error fetching course applications:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (selectedApp) loadSignedUrl()
        else setSignedUrl(null)
    }, [selectedApp])

    const loadSignedUrl = async () => {
        if (!selectedApp) return
        const supabase = createClientForBrowser()
        const { data } = await supabase.storage
            .from('student-documents')
            .createSignedUrl(selectedApp.student_id_url, 3600)
        setSignedUrl(data?.signedUrl || null)
    }

    const updateStatus = async (id: string, status: 'approved' | 'rejected', extra?: { offer_pass?: boolean; intent?: string }) => {
        setUpdatingId(id)
        try {
            const body: any = { id, status }
            if (extra) {
                if (typeof extra.offer_pass === 'boolean') body.offer_pass = extra.offer_pass
                if (extra.intent) body.intent = extra.intent
            }
            const response = await fetch('/api/admin/course-applications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
            if (!response.ok) throw new Error('Failed to update status')
            const { application } = await response.json()
            setApplications((prev) => prev.map((a) => (a.id === id ? application : a)))
            setSelectedApp((prev) => (prev && prev.id === id ? application : prev))
        } catch (error) {
            console.error('Error updating application status:', error)
            alert('Failed to update status. Try again.')
        } finally {
            setUpdatingId(null)
        }
    }

    const updatePass = async (id: string, offer_pass: boolean, intent: string) => {
        setUpdatingId(id)
        try {
            const response = await fetch('/api/admin/course-applications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, offer_pass, intent }),
            })
            if (!response.ok) throw new Error('Failed to update pass')
            const { application } = await response.json()
            setApplications((prev) => prev.map((a) => (a.id === id ? application : a)))
            setSelectedApp((prev) => (prev && prev.id === id ? application : prev))
        } catch (error) {
            console.error('Error updating pass status:', error)
            alert('Failed to update pass. Try again.')
        } finally {
            setUpdatingId(null)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-white hover:bg-slate-800" onClick={() => router.push('/admin/dashboard')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Course Applications</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Free-class applications, gated behind an uploaded student ID — review, approve, and manage passes below.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setShowContacts(!showContacts)}
                            className="border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white"
                        >
                            {showContacts ? (
                                <>
                                    <EyeOff className="mr-2 h-4 w-4 text-emerald-400" />
                                    Mask Contacts (Privacy Mode)
                                </>
                            ) : (
                                <>
                                    <Eye className="mr-2 h-4 w-4 text-slate-400" />
                                    Reveal Student Contacts
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                <Card className="bg-slate-800 border-slate-700">
                    <CardHeader className="flex flex-row items-center justify-between border-b border-slate-700/60 pb-4">
                        <div>
                            <CardTitle className="text-white text-xl">Applications</CardTitle>
                            <p className="text-xs text-slate-400 mt-1">
                                {applications.length} total applicant{applications.length === 1 ? '' : 's'} · {applications.filter(a => a.offer_pass).length} Free Pass holder{applications.filter(a => a.offer_pass).length === 1 ? '' : 's'}
                            </p>
                        </div>
                        {!showContacts && (
                            <div className="flex items-center gap-1.5 text-xs text-emerald-400/90 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg">
                                <ShieldAlert size={14} />
                                <span>Privacy Mode Active (Emails & Phones Masked)</span>
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="pt-6">
                        {loading ? (
                            <div className="text-center text-slate-400 py-8">Loading...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-700 hover:bg-slate-800">
                                        <TableHead className="text-slate-300">Course & Offer</TableHead>
                                        <TableHead className="text-slate-300">Student Name</TableHead>
                                        <TableHead className="text-slate-300">Email</TableHead>
                                        <TableHead className="text-slate-300">Phone</TableHead>
                                        <TableHead className="text-slate-300">Status</TableHead>
                                        <TableHead className="text-slate-300">Applied</TableHead>
                                        <TableHead className="text-slate-300 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-slate-500 py-8">No applications yet.</TableCell>
                                        </TableRow>
                                    ) : (
                                        applications.map((app) => (
                                            <TableRow key={app.id} className="border-slate-700 hover:bg-slate-750">
                                                <TableCell className="font-medium text-white max-w-xs">
                                                    <div className="truncate" title={app.course_title}>{app.course_title}</div>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        {app.offer_pass ? (
                                                            <Badge variant="outline" className="border-amber-400/40 bg-amber-400/10 text-amber-300 text-[10px] flex items-center gap-1">
                                                                <Ticket size={10} /> Free Pass
                                                            </Badge>
                                                        ) : app.intent === 'waitlist' ? (
                                                            <Badge variant="outline" className="border-sky-400/40 bg-sky-400/10 text-sky-300 text-[10px]">
                                                                Waitlist
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="border-slate-600 bg-slate-800 text-slate-400 text-[10px]">
                                                                Standard
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-slate-200 font-semibold">{app.full_name}</TableCell>
                                                <TableCell className="text-slate-300 font-mono text-xs">
                                                    {showContacts ? app.email : maskEmail(app.email)}
                                                </TableCell>
                                                <TableCell className="text-slate-300 font-mono text-xs">
                                                    {showContacts ? (app.phone || '—') : maskPhone(app.phone)}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={statusStyles[app.status]}>
                                                        {app.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-300 text-xs">{new Date(app.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {app.offer_pass ? (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={updatingId === app.id}
                                                                onClick={() => updatePass(app.id, false, 'waitlist')}
                                                                className="border-slate-700 bg-slate-800 text-amber-300/80 hover:bg-slate-700 hover:text-amber-200 text-xs h-8"
                                                                title="Revoke Free Pass & move to waitlist"
                                                            >
                                                                Revoke Pass
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                disabled={updatingId === app.id}
                                                                onClick={() => updatePass(app.id, true, 'pass')}
                                                                className="border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-xs h-8"
                                                                title="Grant Free Pass to this student"
                                                            >
                                                                + Grant Pass
                                                            </Button>
                                                        )}
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setSelectedApp(app)}
                                                                    className="border-slate-600 text-slate-300 hover:bg-slate-700 h-8"
                                                                >
                                                                    <Eye className="h-3.5 w-3.5 mr-1" />
                                                                    View
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-lg bg-slate-900 border-slate-700 text-slate-200">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-white flex items-center justify-between">
                                                                        <span>Application Details</span>
                                                                        <Badge variant="outline" className={statusStyles[selectedApp?.status || 'pending']}>
                                                                            {selectedApp?.status}
                                                                        </Badge>
                                                                    </DialogTitle>
                                                                </DialogHeader>
                                                                {selectedApp && (
                                                                    <div className="space-y-4">
                                                                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-2 text-sm">
                                                                            <p><span className="text-slate-400">Course:</span> <span className="font-semibold text-white">{selectedApp.course_title}</span></p>
                                                                            <p><span className="text-slate-400">Name:</span> <span className="text-white font-medium">{selectedApp.full_name}</span></p>
                                                                            <p>
                                                                                <span className="text-slate-400">Email:</span>{' '}
                                                                                <span className="font-mono text-emerald-300">
                                                                                    {showContacts ? selectedApp.email : maskEmail(selectedApp.email)}
                                                                                </span>
                                                                            </p>
                                                                            <p>
                                                                                <span className="text-slate-400">Phone:</span>{' '}
                                                                                <span className="font-mono text-slate-200">
                                                                                    {showContacts ? (selectedApp.phone || 'Not provided') : maskPhone(selectedApp.phone)}
                                                                                </span>
                                                                            </p>
                                                                            {selectedApp.message && (
                                                                                <p><span className="text-slate-400">Message:</span> {selectedApp.message}</p>
                                                                            )}
                                                                        </div>

                                                                        <div className="p-4 bg-slate-800/90 rounded-xl border border-slate-700 flex items-center justify-between">
                                                                            <div>
                                                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pass Status</p>
                                                                                <div className="mt-1 flex items-center gap-2">
                                                                                    {selectedApp.offer_pass ? (
                                                                                        <Badge variant="outline" className="border-amber-400/40 bg-amber-400/10 text-amber-300 font-bold">
                                                                                            ✓ Free Pass Granted
                                                                                        </Badge>
                                                                                    ) : selectedApp.intent === 'waitlist' ? (
                                                                                        <Badge variant="outline" className="border-sky-400/40 bg-sky-400/10 text-sky-300">
                                                                                            On Waitlist
                                                                                        </Badge>
                                                                                    ) : (
                                                                                        <Badge variant="outline" className="border-slate-500 bg-slate-800 text-slate-300">
                                                                                            Standard
                                                                                        </Badge>
                                                                                    )}
                                                                                </div>
                                                                            </div>
                                                                            <div>
                                                                                {selectedApp.offer_pass ? (
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        disabled={updatingId === selectedApp.id}
                                                                                        onClick={() => updatePass(selectedApp.id, false, 'waitlist')}
                                                                                        className="border-amber-500/40 text-amber-300 hover:bg-amber-500/10 text-xs"
                                                                                    >
                                                                                        Revoke Pass (Move to Waitlist)
                                                                                    </Button>
                                                                                ) : (
                                                                                    <Button
                                                                                        variant="outline"
                                                                                        size="sm"
                                                                                        disabled={updatingId === selectedApp.id}
                                                                                        onClick={() => updatePass(selectedApp.id, true, 'pass')}
                                                                                        className="border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 text-xs font-bold"
                                                                                    >
                                                                                        + Grant Free Pass
                                                                                    </Button>
                                                                                )}
                                                                            </div>
                                                                        </div>

                                                                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                                                                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Student ID</h3>
                                                                            {signedUrl ? (
                                                                                <a href={signedUrl} target="_blank" rel="noreferrer" className="text-emerald-400 text-sm hover:underline flex items-center gap-1.5 font-medium">
                                                                                    <FileText size={16} /> View uploaded student verification document
                                                                                </a>
                                                                            ) : (
                                                                                <span className="text-xs text-slate-500">Loading document...</span>
                                                                            )}
                                                                        </div>

                                                                        <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-slate-700/60">
                                                                            <Button
                                                                                variant="outline"
                                                                                className="border-red-600/60 text-red-400 hover:bg-red-600 hover:text-white"
                                                                                disabled={updatingId === selectedApp.id}
                                                                                onClick={() => updateStatus(selectedApp.id, 'rejected')}
                                                                            >
                                                                                <X className="h-4 w-4 mr-2" /> Reject
                                                                            </Button>
                                                                            <Button
                                                                                variant="outline"
                                                                                className="border-slate-600 text-slate-200 hover:bg-slate-700"
                                                                                disabled={updatingId === selectedApp.id}
                                                                                onClick={() => updateStatus(selectedApp.id, 'approved', { offer_pass: false, intent: 'waitlist' })}
                                                                            >
                                                                                <Check className="h-4 w-4 mr-2" /> Approve (Waitlist)
                                                                            </Button>
                                                                            <Button
                                                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                                                                                disabled={updatingId === selectedApp.id}
                                                                                onClick={() => updateStatus(selectedApp.id, 'approved', { offer_pass: true, intent: 'pass' })}
                                                                            >
                                                                                <Check className="h-4 w-4 mr-2" /> Approve & Grant Free Pass
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
