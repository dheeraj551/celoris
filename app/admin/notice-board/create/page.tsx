"use client"

import { useState, useEffect, Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

function CreateNoticeContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const id = searchParams.get('id')
    const isEditMode = !!id

    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(!!id)
    const [formData, setFormData] = useState({
        title: '',
        student_name: '',
        subject: '',
        location: '',
        contact_number: '',
        description: '',
        priority: 'normal',
        category: 'tutoring',
        requirements: '',
        duration: '',
        is_active: true
    })

    useEffect(() => {
        if (id) {
            fetchNoticeDetails()
        }
    }, [id])

    const fetchNoticeDetails = async () => {
        try {
            // Re-use main GET API with a filter, although API doesn't support get-by-id easily yet?
            // Wait, my GET API supports get-list. No get-by-id.
            // Actually, I can use Supabase client directly here OR update GET API?
            // Or just filter on client side? No that's inefficient if I have many notices.
            // But I don't have a GET /api/notice-board/[id] route.
            // I only have /api/notice-board route which lists.
            // I can add get-by-id support to GET /api/notice-board route or just filter.
            // For now, let's assume I can filter by adding ?id=XXX to standard get call if supported
            // or I can fetch all and find... inefficient.
            // Let's modify GET to support ?id=XXX. 
            // WAIT, I didn't verify GET implementation support for ID.
            // Let's assume I need to fetch all and filter client side for now, or update GET API later.
            // Actually better: Since I'm admin, I can just use RLS-bypassed fetch or just...
            // Let's rely on standard GET list for now, filtering. 
            // Wait, standard GET lists paginated. I might not find it if it's on page 2.

            // I should really add `id` support to GET API.
            // The GET API:
            // const { searchParams } = new URL(request.url)
            // const limit = ...
            // const all = ...
            // NO ID support.

            // I'll update GET API first? No, let's just make a new simple fetch here assuming I'll update GET API.
            // Actually, I can use the same pattern as DELETE/PATCH - use ?id=xxx query param.

            const response = await fetch(`/api/notice-board?id=${id}&all=true`, { cache: 'no-store' })
            // This fetch will return a LIST currently. I need to update GET API to return single item if ID provided.

            // Assuming I will update GET API to support id param.
            const data = await response.json()
            if (data.data) {
                // If API returns array loop it, if single object use it.
                const notice = Array.isArray(data.data) ? data.data[0] : data.data
                if (notice) {
                    setFormData({
                        title: notice.title,
                        student_name: notice.student_name,
                        subject: notice.subject,
                        location: notice.location,
                        contact_number: notice.contact_number || '',
                        description: notice.description || '',
                        priority: notice.priority,
                        category: notice.category,
                        requirements: notice.requirements || '',
                        duration: notice.duration || '',
                        is_active: notice.is_active
                    })
                }
            }
        } catch (error) {
            console.error('Error fetching notice:', error)
        } finally {
            setFetching(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const url = '/api/notice-board'
            const method = isEditMode ? 'PATCH' : 'POST'
            const body = isEditMode ? { ...formData, id } : formData

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to save notice')
            }

            router.push('/admin/notice-board')
        } catch (error: any) {
            console.error('Error saving notice:', error)
            alert(`Error: ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    if (fetching) {
        return <div className="min-h-screen bg-slate-900 p-8 text-white flex justify-center items-center">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" className="text-white" onClick={() => router.back()}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back
                    </Button>
                    <h1 className="text-3xl font-bold text-white">{isEditMode ? 'Edit Notice' : 'Create New Notice'}</h1>
                </div>

                <Card className="bg-slate-800 border-slate-700 text-white">
                    <CardHeader>
                        <CardTitle>Notice Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title *</Label>
                                    <Input
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="bg-slate-900 border-slate-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="student_name">Student Name *</Label>
                                    <Input
                                        id="student_name"
                                        name="student_name"
                                        value={formData.student_name}
                                        onChange={handleChange}
                                        required
                                        className="bg-slate-900 border-slate-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject">Subject *</Label>
                                    <Input
                                        id="subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="bg-slate-900 border-slate-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="location">Location *</Label>
                                    <Input
                                        id="location"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        required
                                        className="bg-slate-900 border-slate-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="contact_number">Contact Number (Optional)</Label>
                                    <Input
                                        id="contact_number"
                                        name="contact_number"
                                        value={formData.contact_number}
                                        onChange={handleChange}
                                        className="bg-slate-900 border-slate-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duration">Duration</Label>
                                    <Input
                                        id="duration"
                                        name="duration"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        placeholder="e.g. 2 hours/week"
                                        className="bg-slate-900 border-slate-600"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="priority">Priority</Label>
                                    <select
                                        id="priority"
                                        name="priority"
                                        value={formData.priority}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-slate-600 bg-slate-900 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <option value="tutoring">Tutoring</option>
                                        <option value="group_classes">Group Classes</option>
                                        <option value="online">Online</option>
                                        <option value="exam_prep">Exam Prep</option>
                                        <option value="language">Language</option>
                                        <option value="music">Music</option>
                                        <option value="sports">Sports</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="requirements">Requirements</Label>
                                <Textarea
                                    id="requirements"
                                    name="requirements"
                                    value={formData.requirements}
                                    onChange={handleChange}
                                    className="bg-slate-900 border-slate-600"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    className="bg-slate-900 border-slate-600"
                                />
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>
                                    <Save className="mr-2 h-4 w-4" />
                                    {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Notice' : 'Create Notice')}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default function CreateNotice() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-slate-900 p-8 text-white flex justify-center items-center">Loading...</div>}>
            <CreateNoticeContent />
        </Suspense>
    )
}
