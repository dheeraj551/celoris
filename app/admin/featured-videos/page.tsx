
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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, Trash2, ArrowLeft, Video, ExternalLink, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface FeaturedVideo {
    id: string
    title: string
    youtube_url: string
    thumbnail_url: string | null
    category: string
    duration: string
    author: string
    views_count: number
    is_active: boolean
    created_at: string
}

export default function AdminFeaturedVideos() {
    const [videos, setVideos] = useState<FeaturedVideo[]>([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const router = useRouter()

    const [formData, setFormData] = useState({
        title: '',
        youtube_url: '',
        category: 'Tutorial',
        duration: '',
        author: 'Celoris Team'
    })

    useEffect(() => {
        fetchVideos()
    }, [])

    const fetchVideos = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/featured-videos', { cache: 'no-store' })
            if (response.ok) {
                const data = await response.json()
                setVideos(data.videos || [])
            }
        } catch (error) {
            console.error('Error fetching videos:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this video?')) return

        try {
            const response = await fetch(`/api/admin/featured-videos/${id}`, {
                method: 'DELETE',
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to delete video')
            }

            setVideos(prev => prev.filter(v => v.id !== id))
        } catch (error: any) {
            console.error('Error deleting video:', error)
            alert(`Error deleting video: ${error.message}`)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)

        try {
            const response = await fetch('/api/admin/featured-videos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || 'Failed to create video')
            }

            // Reset form and close dialog
            setFormData({
                title: '',
                youtube_url: '',
                category: 'Tutorial',
                duration: '',
                author: 'Celoris Team'
            })
            setIsDialogOpen(false)
            fetchVideos() // Refresh list
        } catch (error: any) {
            console.error('Error creating video:', error)
            alert(`Error creating video: ${error.message}`)
        } finally {
            setSubmitting(false)
        }
    }

    const extractVideoId = (url: string) => {
        const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^#&?]*).*/)
        return match ? match[1] : null
    }

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value
        setFormData(prev => ({ ...prev, youtube_url: url }))
        // Could potentially auto-fetch title/duration here if we had an API key
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
                        <h1 className="text-3xl font-bold text-white">Featured Videos</h1>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Video
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 text-white border-slate-700">
                            <DialogHeader>
                                <DialogTitle>Add New Featured Video</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Video Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                        placeholder="Enter video title"
                                        required
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <select
                                        id="category"
                                        value={formData.category}
                                        onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                        className="flex h-10 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                    >
                                        <option value="Tutorial">Tutorial</option>
                                        <option value="Product">Product</option>
                                        <option value="Education">Education</option>
                                        <option value="Showcase">Showcase</option>
                                        <option value="General">General</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="url">YouTube URL</Label>
                                    <Input
                                        id="url"
                                        value={formData.youtube_url}
                                        onChange={handleUrlChange}
                                        placeholder="https://youtube.com/..."
                                        required
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                    {formData.youtube_url && extractVideoId(formData.youtube_url) && (
                                        <div className="relative aspect-video rounded-md overflow-hidden border border-slate-600 mt-2">
                                            <img
                                                src={`https://img.youtube.com/vi/${extractVideoId(formData.youtube_url)}/maxresdefault.jpg`}
                                                alt="Video preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Duration</Label>
                                        <Input
                                            id="duration"
                                            value={formData.duration}
                                            onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                                            placeholder="e.g. 10:24"
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="author">Author/Channel</Label>
                                        <Input
                                            id="author"
                                            value={formData.author}
                                            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                            placeholder="Celoris Team"
                                            className="bg-slate-700 border-slate-600 text-white"
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3 mt-6">
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="hover:bg-slate-700">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={submitting} className="bg-green-600 hover:bg-green-700">
                                        {submitting ? 'Adding...' : 'Add Video'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center justify-between">
                            <span>Video Content</span>
                            <Button variant="ghost" size="sm" onClick={fetchVideos} className="text-slate-400 hover:text-white">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center text-slate-400 py-8">Loading...</div>
                        ) : videos.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No featured videos yet.</p>
                                <p className="text-sm">Add your first video to display on home page.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-700 hover:bg-slate-800">
                                        <TableHead className="text-slate-300">Thumbnail</TableHead>
                                        <TableHead className="text-slate-300">Title</TableHead>
                                        <TableHead className="text-slate-300">Category</TableHead>
                                        <TableHead className="text-slate-300">Duration</TableHead>
                                        <TableHead className="text-slate-300">Author</TableHead>
                                        <TableHead className="text-slate-300 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {videos.map((video) => (
                                        <TableRow key={video.id} className="border-slate-700 hover:bg-slate-750">
                                            <TableCell>
                                                <div className="w-24 aspect-video bg-slate-700 rounded overflow-hidden">
                                                    {video.thumbnail_url ? (
                                                        <img src={video.thumbnail_url} alt={video.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Video className="h-full w-full p-6 text-slate-500" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-white max-w-xs truncate" title={video.title}>
                                                {video.title}
                                                <div className="text-xs text-slate-500 flex items-center gap-1 mt-1 truncate">
                                                    {video.youtube_url}
                                                    <a href={video.youtube_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                                        <ExternalLink className="h-3 w-3" />
                                                    </a>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-slate-600 text-slate-300">
                                                    {video.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-300">{video.duration}</TableCell>
                                            <TableCell className="text-slate-300">{video.author}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(video.id)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
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
