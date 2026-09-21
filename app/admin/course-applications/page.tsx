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
import { ArrowLeft, Eye, FileText, Check, X } from "lucide-react"
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
}

const statusStyles: Record<CourseApplication['status'], string> = {
    pending: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20',
    approved: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20',
    rejected: 'border-red-500/20 bg-red-500/10 text-red-500 hover:bg-red-500/20',
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

    const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
        setUpdatingId(id)
        try {
            const response = await fetch('/api/admin/course-applications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status }),
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

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-white" onClick={() => router.push('/admin/dashboard')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Course Applications</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Free-class applications, gated behind an uploaded student ID — review and approve below.
                            </p>
                        </div>
                    </div>
                </div>

                <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center text-slate-400 py-8">Loading...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-700 hover:bg-slate-800">
                                        <TableHead className="text-slate-300">Course</TableHead>
                                        <TableHead className="text-slate-300">Name</TableHead>
                                        <TableHead className="text-slate-300">Email</TableHead>
                                        <TableHead className="text-slate-300">Phone</TableHead>
                                        <TableHead className="text-slate-300">Status</TableHead>
                                        <TableHead className="text-slate-300">Applied</TableHead>
                                        <TableHead className="text-slate-300">Actions</TableHead>
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
                                                <TableCell className="font-medium text-white">{app.course_title}</TableCell>
                                                <TableCell className="text-slate-300">{app.full_name}</TableCell>
                                                <TableCell className="text-slate-300">{app.email}</TableCell>
                                                <TableCell className="text-slate-300">{app.phone || '—'}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className={statusStyles[app.status]}>
                                                        {app.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-slate-300">{new Date(app.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setSelectedApp(app)}
                                                                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                                                >
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    View
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-lg bg-slate-900 border-slate-700 text-slate-200">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-white">Application Details</DialogTitle>
                                                                </DialogHeader>
                                                                {selectedApp && (
                                                                    <div className="space-y-4">
                                                                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-2 text-sm">
                                                                            <p><span className="text-slate-400">Course:</span> {selectedApp.course_title}</p>
                                                                            <p><span className="text-slate-400">Name:</span> {selectedApp.full_name}</p>
                                                                            <p><span className="text-slate-400">Email:</span> {selectedApp.email}</p>
                                                                            <p><span className="text-slate-400">Phone:</span> {selectedApp.phone || 'Not provided'}</p>
                                                                            {selectedApp.message && (
                                                                                <p><span className="text-slate-400">Message:</span> {selectedApp.message}</p>
                                                                            )}
                                                                        </div>

                                                                        <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                                                                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Student ID</h3>
                                                                            {signedUrl ? (
                                                                                <a href={signedUrl} target="_blank" rel="noreferrer" className="text-emerald-400 text-sm hover:underline flex items-center gap-1.5">
                                                                                    <FileText size={14} /> View uploaded ID
                                                                                </a>
                                                                            ) : (
                                                                                <span className="text-xs text-slate-500">Loading document...</span>
                                                                            )}
                                                                        </div>

                                                                        <div className="flex items-center justify-end gap-2">
                                                                            <Button
                                                                                variant="outline"
                                                                                className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                                                                                disabled={updatingId === selectedApp.id}
                                                                                onClick={() => updateStatus(selectedApp.id, 'rejected')}
                                                                            >
                                                                                <X className="h-4 w-4 mr-2" /> Reject
                                                                            </Button>
                                                                            <Button
                                                                                className="bg-emerald-600 hover:bg-emerald-700"
                                                                                disabled={updatingId === selectedApp.id}
                                                                                onClick={() => updateStatus(selectedApp.id, 'approved')}
                                                                            >
                                                                                <Check className="h-4 w-4 mr-2" /> Approve
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
