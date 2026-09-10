"use client"

import { useState, useEffect, useCallback } from "react"
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
import { ArrowLeft, Star, Check, Trash2, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"

interface TrainerReview {
    id: string
    trainer_id: string
    reviewer_id: string
    reviewer_name: string
    rating: number
    comment: string | null
    is_approved: boolean
    created_at: string
    approved_at: string | null
}

type StatusFilter = "pending" | "approved" | "all"

export default function AdminTrainerReviews() {
    const [reviews, setReviews] = useState<TrainerReview[]>([])
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("pending")
    const [busyId, setBusyId] = useState<string | null>(null)
    const router = useRouter()

    const fetchReviews = useCallback(async (status: StatusFilter) => {
        setLoading(true)
        try {
            const qs = status === "all" ? "" : `?status=${status}`
            const response = await fetch(`/api/admin/trainer-reviews${qs}`)
            const result = await response.json()
            if (!response.ok || !result.success) {
                console.error("Failed to load trainer reviews:", result.error)
                setReviews([])
                return
            }
            setReviews(result.data || [])
        } catch (error) {
            console.error("Error fetching trainer reviews:", error)
            setReviews([])
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchReviews(statusFilter)
    }, [statusFilter, fetchReviews])

    const handleApprove = async (id: string, approve: boolean) => {
        setBusyId(id)
        try {
            const response = await fetch("/api/admin/trainer-reviews", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, is_approved: approve }),
            })
            if (!response.ok) throw new Error("Failed to update review")
            await fetchReviews(statusFilter)
        } catch (error) {
            console.error("Error updating trainer review:", error)
            alert("Something went wrong updating this review. Please try again.")
        } finally {
            setBusyId(null)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this review permanently? This cannot be undone.")) return
        setBusyId(id)
        try {
            const response = await fetch(`/api/admin/trainer-reviews?id=${id}`, { method: "DELETE" })
            if (!response.ok) throw new Error("Failed to delete review")
            await fetchReviews(statusFilter)
        } catch (error) {
            console.error("Error deleting trainer review:", error)
            alert("Something went wrong deleting this review. Please try again.")
        } finally {
            setBusyId(null)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-white" onClick={() => router.push("/admin/dashboard")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Trainer Reviews</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                Reviews submitted on public trainer profiles only appear once approved here.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mb-6">
                    {(["pending", "approved", "all"] as StatusFilter[]).map((filter) => (
                        <Button
                            key={filter}
                            variant={statusFilter === filter ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter(filter)}
                            className={
                                statusFilter === filter
                                    ? "bg-emerald-600 hover:bg-emerald-700"
                                    : "border-slate-600 text-slate-300 hover:bg-slate-700"
                            }
                        >
                            {filter === "pending" ? "Pending Approval" : filter === "approved" ? "Approved" : "All"}
                        </Button>
                    ))}
                </div>

                <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white">
                            {statusFilter === "pending" ? "Awaiting Approval" : statusFilter === "approved" ? "Live Reviews" : "All Reviews"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center text-slate-400 py-8">Loading...</div>
                        ) : reviews.length === 0 ? (
                            <div className="text-center text-slate-500 py-8">No reviews found.</div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-700 hover:bg-slate-800">
                                        <TableHead className="text-slate-300">Reviewer</TableHead>
                                        <TableHead className="text-slate-300">Rating</TableHead>
                                        <TableHead className="text-slate-300">Comment</TableHead>
                                        <TableHead className="text-slate-300">Trainer ID</TableHead>
                                        <TableHead className="text-slate-300">Status</TableHead>
                                        <TableHead className="text-slate-300">Submitted</TableHead>
                                        <TableHead className="text-slate-300 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {reviews.map((review) => (
                                        <TableRow key={review.id} className="border-slate-700 hover:bg-slate-750">
                                            <TableCell className="font-medium text-white">{review.reviewer_name}</TableCell>
                                            <TableCell>
                                                <span className="flex items-center gap-1 text-yellow-400 text-sm font-bold">
                                                    <Star className="h-4 w-4 fill-current" /> {review.rating}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-slate-300 max-w-xs truncate" title={review.comment || ""}>
                                                {review.comment || <span className="text-slate-500 italic">No comment</span>}
                                            </TableCell>
                                            <TableCell className="font-mono text-xs text-slate-400">
                                                {review.trainer_id.slice(0, 8)}...
                                            </TableCell>
                                            <TableCell>
                                                {review.is_approved ? (
                                                    <Badge variant="outline" className="border-emerald-500/20 bg-emerald-500/10 text-emerald-500">
                                                        Approved
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="border-yellow-500/20 bg-yellow-500/10 text-yellow-500">
                                                        Pending
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-xs">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center justify-end gap-2">
                                                    {!review.is_approved ? (
                                                        <Button
                                                            size="sm"
                                                            disabled={busyId === review.id}
                                                            onClick={() => handleApprove(review.id, true)}
                                                            className="bg-emerald-600 hover:bg-emerald-700"
                                                        >
                                                            <Check className="h-3.5 w-3.5 mr-1.5" /> Approve
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={busyId === review.id}
                                                            onClick={() => handleApprove(review.id, false)}
                                                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                                                        >
                                                            <RotateCcw className="h-3.5 w-3.5 mr-1.5" /> Unapprove
                                                        </Button>
                                                    )}
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        disabled={busyId === review.id}
                                                        onClick={() => handleDelete(review.id)}
                                                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                                                    >
                                                        <Trash2 className="h-3.5 w-3.5" />
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
