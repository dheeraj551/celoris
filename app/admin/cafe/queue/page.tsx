"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Sparkles, UserPlus, X, RefreshCw, Save } from "lucide-react"
import { useRouter } from "next/navigation"

interface CafeRoom {
    id: string
    name: string
    max_students: number
    current_students: number
    is_active: boolean
    boost_code_10: string | null
    boost_code_50: string | null
    boost_code_100: string | null
}

interface QueueEntry {
    id: string
    room_id: string
    user_id: string
    full_name: string | null
    priority_score: number
    joined_queue_at: string
    status: string
}

// Manages the waiting line every student now lands in once a room's 15-ish
// seat cap is full (see ClassroomQueueGate.tsx / RightSidebar.tsx's
// in-room Waiting Queue panel), plus the three boost codes per room
// (+10/+50/+100 priority) that let a student jump ahead of plain FIFO —
// see /api/social/cafe/redeem-boost-code for where those codes are
// actually redeemed. This is the piece of that system that didn't survive
// the classroom's later rebuild: the queue table, boost columns, RLS and
// realtime publication were all still live in the database, but there was
// nowhere in the admin panel to see or manage any of it until now.
export default function AdminCafeQueuePage() {
    const [rooms, setRooms] = useState<CafeRoom[]>([])
    const [entries, setEntries] = useState<QueueEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [actingKey, setActingKey] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const [boostDrafts, setBoostDrafts] = useState<Record<string, { b10: string; b50: string; b100: string }>>({})
    const [savingRoomId, setSavingRoomId] = useState<string | null>(null)

    const router = useRouter()

    const fetchAll = useCallback(async (showSpinner = false) => {
        if (showSpinner) setLoading(true)
        try {
            const [roomsRes, queueRes] = await Promise.all([
                fetch('/api/admin/cafe/rooms'),
                fetch('/api/admin/cafe/queue'),
            ])
            const roomsBody = await roomsRes.json().catch(() => ({}))
            const queueBody = await queueRes.json().catch(() => ({}))

            if (roomsRes.ok) {
                const activeRooms: CafeRoom[] = (roomsBody.rooms || []).filter((r: CafeRoom) => r.is_active !== false)
                setRooms(activeRooms)
                setBoostDrafts((prev) => {
                    const next = { ...prev }
                    for (const r of activeRooms) {
                        if (!next[r.id]) {
                            next[r.id] = { b10: r.boost_code_10 || '', b50: r.boost_code_50 || '', b100: r.boost_code_100 || '' }
                        }
                    }
                    return next
                })
            }
            if (queueRes.ok) setEntries(queueBody.entries || [])
        } catch (err) {
            console.error('Failed to load queue data:', err)
        } finally {
            if (showSpinner) setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAll(true)
        const interval = setInterval(() => fetchAll(false), 5000)
        return () => clearInterval(interval)
    }, [fetchAll])

    const entriesByRoom = (roomId: string) => entries.filter((e) => e.room_id === roomId)

    const runAction = async (action: 'admit' | 'remove', roomId: string, userId?: string) => {
        const key = `${roomId}:${action}:${userId || 'next'}`
        setActingKey(key)
        setError(null)
        try {
            const res = await fetch('/api/admin/cafe/queue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action, roomId, userId }),
            })
            const body = await res.json().catch(() => ({}))
            if (!res.ok) {
                setError(body.error || 'That action failed.')
            } else {
                fetchAll(false)
            }
        } catch {
            setError('Could not reach the server. Try again.')
        } finally {
            setActingKey(null)
        }
    }

    const saveBoostCodes = async (roomId: string) => {
        const draft = boostDrafts[roomId]
        if (!draft) return
        setSavingRoomId(roomId)
        setError(null)
        try {
            const res = await fetch(`/api/admin/cafe/rooms/${roomId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ boostCode10: draft.b10, boostCode50: draft.b50, boostCode100: draft.b100 }),
            })
            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                setError(body.error || 'Could not save boost codes.')
            } else {
                fetchAll(false)
            }
        } catch {
            setError('Could not reach the server. Try again.')
        } finally {
            setSavingRoomId(null)
        }
    }

    const totalWaiting = entries.length

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-white" onClick={() => router.push('/admin/dashboard')}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Class Queue</h1>
                            <p className="text-slate-400 text-sm mt-1">
                                {totalWaiting} waiting across all rooms right now — admit people as seats free up, or set the per-room boost codes that let someone jump the line.
                            </p>
                        </div>
                    </div>
                </div>

                {error && (
                    <div className="mb-4 px-4 py-2.5 rounded-xl bg-red-950/40 border border-red-700/40 text-red-300 text-sm">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center text-slate-400 py-12">Loading...</div>
                ) : rooms.length === 0 ? (
                    <Card className="bg-slate-800 border-slate-700">
                        <CardContent className="py-12 text-center text-slate-500">No active café rooms yet.</CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {rooms.map((room) => {
                            const waiting = entriesByRoom(room.id)
                            const draft = boostDrafts[room.id] || { b10: '', b50: '', b100: '' }
                            return (
                                <Card key={room.id} className="bg-slate-800 border-slate-700">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                                        <div className="flex items-center gap-3">
                                            <CardTitle className="text-white text-base">{room.name}</CardTitle>
                                            <Badge variant="outline" className="border-slate-600 text-slate-300">
                                                {room.current_students}/{room.max_students} seated
                                            </Badge>
                                            {waiting.length > 0 && (
                                                <Badge variant="outline" className="border-blue-500/40 bg-blue-500/10 text-blue-300 flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {waiting.length} waiting
                                                </Badge>
                                            )}
                                        </div>
                                        {waiting.length > 0 && (
                                            <Button
                                                size="sm"
                                                disabled={actingKey !== null}
                                                onClick={() => runAction('admit', room.id)}
                                                className="bg-blue-600 hover:bg-blue-700"
                                            >
                                                <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                                                {actingKey === `${room.id}:admit:next` ? 'Admitting...' : 'Admit Next'}
                                            </Button>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        {waiting.length === 0 ? (
                                            <p className="text-xs text-slate-500">Nobody's waiting — this room has open seats.</p>
                                        ) : (
                                            <div className="space-y-1.5">
                                                {waiting.map((entry, index) => (
                                                    <div
                                                        key={entry.id}
                                                        className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-700/60 text-sm"
                                                    >
                                                        <div className="flex items-center gap-2 truncate">
                                                            <span className="text-slate-500 text-xs w-5 text-right flex-shrink-0">{index + 1}.</span>
                                                            <span className="text-slate-200 truncate">{entry.full_name || 'Student'}</span>
                                                            {entry.priority_score > 0 && (
                                                                <span className="flex items-center gap-0.5 text-emerald-400 text-xs flex-shrink-0">
                                                                    <Sparkles className="h-3 w-3" />
                                                                    +{entry.priority_score}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-3 flex-shrink-0">
                                                            <button
                                                                onClick={() => runAction('admit', room.id, entry.user_id)}
                                                                disabled={actingKey !== null}
                                                                className="text-blue-400 hover:text-blue-300 disabled:opacity-50 text-xs font-semibold"
                                                            >
                                                                Admit
                                                            </button>
                                                            <button
                                                                onClick={() => runAction('remove', room.id, entry.user_id)}
                                                                disabled={actingKey !== null}
                                                                title="Remove from queue"
                                                                className="text-slate-500 hover:text-red-400 disabled:opacity-50"
                                                            >
                                                                <X className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="pt-3 border-t border-slate-700/60">
                                            <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-2">Boost codes (priority jump)</p>
                                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-end">
                                                <div>
                                                    <label className="text-[10px] text-slate-500 block mb-1">+10 code</label>
                                                    <Input
                                                        value={draft.b10}
                                                        onChange={(e) => setBoostDrafts((prev) => ({ ...prev, [room.id]: { ...draft, b10: e.target.value } }))}
                                                        placeholder="Not set"
                                                        className="bg-slate-900 border-slate-700 text-white h-8 text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-slate-500 block mb-1">+50 code</label>
                                                    <Input
                                                        value={draft.b50}
                                                        onChange={(e) => setBoostDrafts((prev) => ({ ...prev, [room.id]: { ...draft, b50: e.target.value } }))}
                                                        placeholder="Not set"
                                                        className="bg-slate-900 border-slate-700 text-white h-8 text-xs"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-[10px] text-slate-500 block mb-1">+100 code</label>
                                                    <Input
                                                        value={draft.b100}
                                                        onChange={(e) => setBoostDrafts((prev) => ({ ...prev, [room.id]: { ...draft, b100: e.target.value } }))}
                                                        placeholder="Not set"
                                                        className="bg-slate-900 border-slate-700 text-white h-8 text-xs"
                                                    />
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    disabled={savingRoomId === room.id}
                                                    onClick={() => saveBoostCodes(room.id)}
                                                    className="border-slate-600 text-slate-300 hover:bg-slate-700 h-8"
                                                >
                                                    <Save className="h-3.5 w-3.5 mr-1.5" />
                                                    {savingRoomId === room.id ? 'Saving...' : 'Save'}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )
                        })}
                    </div>
                )}

                <div className="mt-4 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-300" onClick={() => fetchAll(true)}>
                        <RefreshCw className="h-3.5 w-3.5 mr-1.5" />
                        Refresh now
                    </Button>
                </div>
            </div>
        </div>
    )
}
