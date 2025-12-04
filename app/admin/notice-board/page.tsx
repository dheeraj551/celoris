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
import { Plus, Trash2, Users, Eye, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface NoticeBoardItem {
    id: string
    title: string
    student_name: string
    subject: string
    priority: 'low' | 'normal' | 'high' | 'urgent'
    category: string
    created_at: string
    is_active: boolean
}

interface Interest {
    id: string
    user_name: string
    user_email: string
    user_phone: string
    message: string
    created_at: string
}

export default function AdminNoticeBoard() {
    const [notices, setNotices] = useState<NoticeBoardItem[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedNoticeId, setSelectedNoticeId] = useState<string | null>(null)
    const [interests, setInterests] = useState<Interest[]>([])
    const [loadingInterests, setLoadingInterests] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetchNotices()
    }, [])

    const fetchNotices = async () => {
        try {
            const response = await fetch('/api/notice-board?all=true&limit=100')
            const data = await response.json()
            setNotices(data.data)
        } catch (error) {
            console.error('Error fetching notices:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchInterests = async (noticeId: string) => {
        setLoadingInterests(true)
        setSelectedNoticeId(noticeId)
        try {
            const response = await fetch(`/api/notice-board/interest?noticeId=${noticeId}`)
            const data = await response.json()
            setInterests(data.data)
        } catch (error) {
            console.error('Error fetching interests:', error)
        } finally {
            setLoadingInterests(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this notice?')) return

        try {
            // Note: You might need to implement DELETE endpoint in /api/notice-board/route.ts
            // For now assuming it exists or we just hide it
            // actually I haven't implemented DELETE yet.
            alert('Delete functionality not implemented yet')
        } catch (error) {
            console.error('Error deleting notice:', error)
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
                        <h1 className="text-3xl font-bold text-white">Notice Board Management</h1>
                    </div>
                    <Button asChild className="bg-green-600 hover:bg-green-700">
                        <Link href="/admin/notice-board/create">
                            <Plus className="mr-2 h-4 w-4" />
                            Create Notice
                        </Link>
                    </Button>
                </div>

                <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">All Notices</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center text-slate-400 py-8">Loading...</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-700 hover:bg-slate-800">
                                        <TableHead className="text-slate-300">Title</TableHead>
                                        <TableHead className="text-slate-300">Student</TableHead>
                                        <TableHead className="text-slate-300">Subject</TableHead>
                                        <TableHead className="text-slate-300">Priority</TableHead>
                                        <TableHead className="text-slate-300">Status</TableHead>
                                        <TableHead className="text-slate-300">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {notices.map((notice) => (
                                        <TableRow key={notice.id} className="border-slate-700 hover:bg-slate-750">
                                            <TableCell className="font-medium text-white">{notice.title}</TableCell>
                                            <TableCell className="text-slate-300">{notice.student_name}</TableCell>
                                            <TableCell className="text-slate-300">{notice.subject}</TableCell>
                                            <TableCell>
                                                <Badge variant={
                                                    notice.priority === 'urgent' ? 'destructive' :
                                                        notice.priority === 'high' ? 'default' : // default is usually primary color
                                                            notice.priority === 'normal' ? 'secondary' : 'outline'
                                                }>
                                                    {notice.priority}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={notice.is_active ? 'default' : 'secondary'} className={notice.is_active ? 'bg-green-600' : 'bg-gray-600'}>
                                                    {notice.is_active ? 'Active' : 'Inactive'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => fetchInterests(notice.id)}
                                                                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                                            >
                                                                <Users className="h-4 w-4 mr-2" />
                                                                Interests
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                                                            <DialogHeader>
                                                                <DialogTitle>Interested Users for: {notice.title}</DialogTitle>
                                                            </DialogHeader>
                                                            <div className="mt-4">
                                                                {loadingInterests ? (
                                                                    <div className="text-center py-4">Loading interests...</div>
                                                                ) : interests.length === 0 ? (
                                                                    <div className="text-center py-4 text-gray-500">No interests submitted yet.</div>
                                                                ) : (
                                                                    <Table>
                                                                        <TableHeader>
                                                                            <TableRow>
                                                                                <TableHead>Name</TableHead>
                                                                                <TableHead>Email</TableHead>
                                                                                <TableHead>Phone</TableHead>
                                                                                <TableHead>Message</TableHead>
                                                                                <TableHead>Date</TableHead>
                                                                            </TableRow>
                                                                        </TableHeader>
                                                                        <TableBody>
                                                                            {interests.map((interest) => (
                                                                                <TableRow key={interest.id}>
                                                                                    <TableCell>{interest.user_name}</TableCell>
                                                                                    <TableCell>{interest.user_email}</TableCell>
                                                                                    <TableCell>{interest.user_phone}</TableCell>
                                                                                    <TableCell className="max-w-xs truncate" title={interest.message}>{interest.message}</TableCell>
                                                                                    <TableCell>{new Date(interest.created_at).toLocaleDateString()}</TableCell>
                                                                                </TableRow>
                                                                            ))}
                                                                        </TableBody>
                                                                    </Table>
                                                                )}
                                                            </div>
                                                        </DialogContent>
                                                    </Dialog>

                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleDelete(notice.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
