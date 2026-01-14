"use client"

import { useState, useEffect } from "react"
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
import { ArrowLeft, Eye, FileText, Download } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientForBrowser } from "@/lib/supabase-client"
import { Suspense } from "react"

interface TrainerApplication {
    id: string
    created_at: string
    full_name: string
    email: string
    mobile_number: string
    subject?: string // notice_id link not resolved here but maybe we can fetch it or just show generic
    application_ref_id?: string

    // Details
    gender: string
    date_of_birth: string
    current_city: string
    education_details: any
    total_experience: string
    subjects_academic: string[]
    teaching_mode: string
    expected_fees: string

    verification_later: boolean
    id_proof_front_url?: string
    profile_photo_url?: string
    user_id: string

    // ... other fields as needed
}

export default function AdminTrainerApplications() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading...</div>}>
            <TrainerApplicationsContent />
        </Suspense>
    )
}

function TrainerApplicationsContent() {
    const [applications, setApplications] = useState<TrainerApplication[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedApp, setSelectedApp] = useState<TrainerApplication | null>(null)
    const router = useRouter()
    const searchParams = useSearchParams()
    const filterUserId = searchParams.get('userId')

    useEffect(() => {
        fetchApplications()
    }, [])

    const fetchApplications = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/trainer-registration')
            const result = await response.json()

            if (!response.ok) {
                console.error('API Error:', result.error)
                return
            }

            if (result.data) {
                setApplications(result.data)
            }
        } catch (error) {
            console.error('Error fetching applications:', error)
        } finally {
            setLoading(false)
        }
    }

    // Helper to load signed URLs
    const [signedUrls, setSignedUrls] = useState<{ front: string | null, photo: string | null }>({ front: null, photo: null })

    useEffect(() => {
        if (selectedApp) {
            loadSignedUrls()
        }
    }, [selectedApp])

    const loadSignedUrls = async () => {
        if (!selectedApp) return
        // We need supabase client here. Since this is a client component, we import createClientForBrowser
        // But we need to dynamic import or use the hook from lib if available. 
        // I'll assume generic usage.
        const supabase = createClientForBrowser() // Need to ensure import

        let front = null
        let photo = null

        if (selectedApp.id_proof_front_url) {
            const { data } = await supabase.storage.from('trainer-documents').createSignedUrl(selectedApp.id_proof_front_url, 3600)
            front = data?.signedUrl || null
        }

        if (selectedApp.profile_photo_url) {
            const { data } = await supabase.storage.from('trainer-documents').createSignedUrl(selectedApp.profile_photo_url, 3600)
            photo = data?.signedUrl || null
        }

        setSignedUrls({ front, photo })
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
                            <h1 className="text-3xl font-bold text-white">Trainer Applications</h1>
                            {filterUserId && (
                                <div className="flex items-center gap-2 mt-2">
                                    <Badge variant="outline" className="text-emerald-400 border-emerald-400">
                                        Filtering by User ID: {filterUserId}
                                    </Badge>
                                    <Button
                                        variant="link"
                                        size="sm"
                                        className="text-slate-400 hover:text-white p-0 h-auto"
                                        onClick={() => router.push('/admin/trainer-applications')}
                                    >
                                        Clear Filter
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">Recent Applications</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center text-slate-400 py-8">Loading...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-700 hover:bg-slate-800">
                                        <TableHead className="text-slate-300">App ID</TableHead>
                                        <TableHead className="text-slate-300">Name</TableHead>
                                        <TableHead className="text-slate-300">Email</TableHead>
                                        <TableHead className="text-slate-300">Mobile</TableHead>
                                        <TableHead className="text-slate-300">Verification</TableHead>
                                        <TableHead className="text-slate-300">Applied Date</TableHead>
                                        <TableHead className="text-slate-300">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.filter(app => !filterUserId || app.user_id === filterUserId).length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center text-slate-500 py-8">No applications found.</TableCell>
                                        </TableRow>
                                    ) : (
                                        applications
                                            .filter(app => !filterUserId || (app as any).user_id === filterUserId)
                                            .map((app) => (
                                                <TableRow key={app.id} className="border-slate-700 hover:bg-slate-750">
                                                    <TableCell className="font-mono text-emerald-400 text-xs">{app.application_ref_id || 'N/A'}</TableCell>
                                                    <TableCell className="font-medium text-white">{app.full_name}</TableCell>
                                                    <TableCell className="text-slate-300">{app.email}</TableCell>
                                                    <TableCell className="text-slate-300">{app.mobile_number}</TableCell>
                                                    <TableCell>
                                                        {app.verification_later ? (
                                                            <Badge variant="outline" className="border-yellow-500/20 bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20">Pending (Later)</Badge>
                                                        ) : (
                                                            <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20">Submitted</Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-slate-300">{new Date(app.created_at).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        <Dialog>
                                                            <DialogTrigger asChild>
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => setSelectedApp(app)}
                                                                    className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                                                >
                                                                    <Eye className="h-4 w-4 mr-2" />
                                                                    View Details
                                                                </Button>
                                                            </DialogTrigger>
                                                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-slate-700 text-slate-200">
                                                                <DialogHeader>
                                                                    <DialogTitle className="text-2xl font-bold text-white mb-4">Application Details</DialogTitle>
                                                                </DialogHeader>

                                                                {selectedApp && (
                                                                    <div className="space-y-6">
                                                                        <div className="grid grid-cols-2 gap-6">
                                                                            <div className="space-y-4">
                                                                                <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                                                                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Personal Info</h3>
                                                                                    <div className="space-y-2 text-sm">
                                                                                        <p><span className="text-slate-400">Name:</span> {selectedApp.full_name}</p>
                                                                                        <p><span className="text-slate-400">Gender:</span> {selectedApp.gender}</p>
                                                                                        <p><span className="text-slate-400">DOB:</span> {selectedApp.date_of_birth}</p>
                                                                                        <p><span className="text-slate-400">Email:</span> {selectedApp.email}</p>
                                                                                        <p><span className="text-slate-400">Mobile:</span> {selectedApp.mobile_number}</p>
                                                                                        <p><span className="text-slate-400">Address:</span> {selectedApp.current_city}</p>
                                                                                    </div>
                                                                                </div>

                                                                                <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                                                                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Teaching Profile</h3>
                                                                                    <div className="space-y-2 text-sm">
                                                                                        <p><span className="text-slate-400">Experience:</span> {selectedApp.total_experience}</p>
                                                                                        <p><span className="text-slate-400">Mode:</span> {selectedApp.teaching_mode}</p>
                                                                                        <p><span className="text-slate-400">Expected Fees:</span> {selectedApp.expected_fees}</p>
                                                                                        <p><span className="text-slate-400">Subjects:</span> {Array.isArray(selectedApp.subjects_academic) ? selectedApp.subjects_academic.join(', ') : selectedApp.subjects_academic}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>

                                                                            <div className="space-y-4">
                                                                                <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                                                                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Documents</h3>
                                                                                    {selectedApp.verification_later ? (
                                                                                        <div className="text-sm text-yellow-500 bg-yellow-500/10 p-3 rounded-lg border border-yellow-500/20">
                                                                                            <p className="font-bold">Verification Pending</p>
                                                                                            <p className="text-xs mt-1">Applicant opted to complete ID verification later.</p>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <div className="space-y-4">
                                                                                            <div>
                                                                                                <p className="text-xs text-slate-400 mb-1">Profile Photo</p>
                                                                                                {signedUrls.photo ? (
                                                                                                    <img src={signedUrls.photo} alt="Profile" className="w-24 h-24 object-cover rounded-lg border border-slate-600" />
                                                                                                ) : selectedApp.profile_photo_url ? (
                                                                                                    <span className="text-xs text-slate-500">Loading image...</span>
                                                                                                ) : <span className="text-xs text-slate-500">Not uploaded</span>}
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="text-xs text-slate-400 mb-1">ID Proof</p>
                                                                                                {signedUrls.front ? (
                                                                                                    <a href={signedUrls.front} target="_blank" rel="noreferrer" className="text-emerald-400 text-xs hover:underline flex items-center gap-1">
                                                                                                        <FileText size={14} /> View ID Proof
                                                                                                    </a>
                                                                                                ) : selectedApp.id_proof_front_url ? (
                                                                                                    <span className="text-xs text-slate-500">Loading document...</span>
                                                                                                ) : <span className="text-xs text-slate-500">Not uploaded</span>}
                                                                                            </div>
                                                                                        </div>
                                                                                    )}
                                                                                </div>

                                                                                <div className="p-4 bg-slate-800 rounded-xl border border-slate-700">
                                                                                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">Education</h3>
                                                                                    <div className="space-y-2 text-sm">
                                                                                        {selectedApp.education_details && typeof selectedApp.education_details === 'object' && (
                                                                                            Object.entries(selectedApp.education_details).map(([level, details]: [string, any]) => (
                                                                                                <div key={level} className="border-b border-white/5 pb-1 mb-1">
                                                                                                    <p className="font-semibold capitalize">{level}</p>
                                                                                                    <p className="text-xs text-slate-400">{details.board || details.university} ({details.year})</p>
                                                                                                </div>
                                                                                            ))
                                                                                        )}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>

                                                                        <div className="text-right">
                                                                            <Button>Approve Application</Button>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </DialogContent>
                                                        </Dialog>
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
