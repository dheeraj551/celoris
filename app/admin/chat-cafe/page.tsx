"use client"

import React, { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Shield,
  LogOut,
  ArrowLeft,
  Coffee,
  Clock,
  Ban,
  Volume2,
  VolumeX,
  Search,
  AlertTriangle,
  CheckCircle,
  ScrollText,
} from "lucide-react"

interface ChatCafeTable {
  id: string
  name: string
  icon: string
  slow_mode_seconds: number
  is_locked: boolean
  active_topic: { title: string } | null
}

interface ChatCafeReport {
  id: string
  message_preview: string | null
  reported_user_name: string | null
  reported_by_name: string | null
  reason: string
  note: string | null
  status: 'pending' | 'resolved' | 'dismissed'
  created_at: string
}

interface SanctionedProfile {
  id: string
  name: string
  role: string
  is_banned: boolean
  ban_reason: string | null
  muted_until: string | null
}

interface ModerationLogEntry {
  id: string
  action: string
  target_user_name: string | null
  moderator_name: string | null
  reason: string | null
  created_at: string
}

interface SearchedProfile {
  id: string
  name: string
  role: string
  is_banned: boolean
  muted_until: string | null
}

const ROLE_OPTIONS = ['patron', 'regular', 'barista', 'moderator', 'admin']

export default function ChatCafeAdminPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  const [tables, setTables] = useState<ChatCafeTable[]>([])
  const [reports, setReports] = useState<ChatCafeReport[]>([])
  const [sanctioned, setSanctioned] = useState<SanctionedProfile[]>([])
  const [logs, setLogs] = useState<ModerationLogEntry[]>([])

  const [patronSearch, setPatronSearch] = useState("")
  const [searchResults, setSearchResults] = useState<SearchedProfile[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    checkAdminAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkAdminAuth = async () => {
    try {
      const adminSession = localStorage.getItem("admin_session")
      if (!adminSession) {
        router.push("/admin/login")
        return
      }
      const session = JSON.parse(adminSession)
      const sessionAge = Date.now() - session.timestamp
      const maxAge = 24 * 60 * 60 * 1000
      if (sessionAge > maxAge) {
        localStorage.removeItem("admin_session")
        router.push("/admin/login")
        return
      }
      setIsAuthenticated(true)
      loadOverview()
    } catch (error) {
      console.error("Admin auth error:", error)
      router.push("/admin/login")
    }
  }

  const loadOverview = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/chat-cafe/overview')
      const data = await res.json()
      setTables(data.tables || [])
      setReports(data.reports || [])
      setSanctioned(data.sanctionedProfiles || [])
      setLogs(data.moderationLogs || [])
    } catch (error) {
      console.error('Failed to load Chat Café overview:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("admin_session")
    router.push("/admin/login")
  }

  const handleSetSlowMode = async (tableId: string, seconds: number) => {
    await fetch('/api/admin/chat-cafe/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'slowmode', tableId, seconds }),
    })
    loadOverview()
  }

  const handleResolveReport = async (reportId: string, status: 'resolved' | 'dismissed') => {
    await fetch(`/api/admin/chat-cafe/reports/${reportId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    loadOverview()
  }

  const handleUnban = async (targetUserId: string) => {
    await fetch('/api/admin/chat-cafe/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'unban', targetUserId }),
    })
    loadOverview()
  }

  const handleUnmute = async (targetUserId: string) => {
    await fetch('/api/admin/chat-cafe/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'unmute', targetUserId }),
    })
    loadOverview()
  }

  const handleSearchPatrons = async () => {
    setSearching(true)
    try {
      const res = await fetch(`/api/admin/chat-cafe/profiles?search=${encodeURIComponent(patronSearch)}`)
      const data = await res.json()
      setSearchResults(data.profiles || [])
    } finally {
      setSearching(false)
    }
  }

  const handleSetRole = async (targetUserId: string, role: string) => {
    await fetch('/api/admin/chat-cafe/moderate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'setRole', targetUserId, role }),
    })
    setSearchResults((prev) => prev.map((p) => (p.id === targetUserId ? { ...p, role } : p)))
  }

  if (!isAuthenticated || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-gray-400 text-sm">
        Loading Chat Café admin…
      </div>
    )
  }

  const pendingReports = reports.filter((r) => r.status === 'pending')

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-white/10 bg-zinc-950/80 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => router.push('/admin/dashboard')}>
              <ArrowLeft className="w-4 h-4 mr-1.5" /> Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <Coffee className="w-5 h-5 text-fuchsia-400" />
              <h1 className="text-lg font-bold">Chat Café Moderation</h1>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-1.5" /> Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Tables & slow mode */}
        <Card className="bg-zinc-950 border-white/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Tables & Slow Mode
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tables.map((t) => (
              <div key={t.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl bg-zinc-900 border border-white/5">
                <div>
                  <div className="font-semibold text-sm flex items-center gap-2">
                    <span>{t.icon}</span>
                    <span>{t.name}</span>
                    {t.active_topic && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        Active topic: {t.active_topic.title}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  {[0, 5, 15, 30].map((sec) => (
                    <button
                      key={sec}
                      onClick={() => handleSetSlowMode(t.id, sec)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        t.slow_mode_seconds === sec ? 'bg-amber-600 text-white' : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                      }`}
                    >
                      {sec === 0 ? 'Off' : `${sec}s`}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Reports queue */}
        <Card className="bg-zinc-950 border-white/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" /> Reports Queue
              {pendingReports.length > 0 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-600 text-white">{pendingReports.length} pending</span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {pendingReports.length === 0 ? (
              <p className="text-sm text-gray-500">No pending reports.</p>
            ) : (
              pendingReports.map((r) => (
                <div key={r.id} className="p-3 rounded-xl bg-zinc-900 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>
                      <strong className="text-gray-200">{r.reported_by_name}</strong> reported{' '}
                      <strong className="text-amber-300">{r.reported_user_name}</strong> for{' '}
                      <span className="uppercase text-rose-300">{r.reason}</span>
                    </span>
                    <span>{new Date(r.created_at).toLocaleString()}</span>
                  </div>
                  {r.message_preview && <p className="text-xs font-mono bg-black/40 p-2 rounded-lg border-l-2 border-rose-500">"{r.message_preview}"</p>}
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => handleResolveReport(r.id, 'dismissed')}>Dismiss</Button>
                    <Button size="sm" onClick={() => handleResolveReport(r.id, 'resolved')}>
                      <CheckCircle className="w-3.5 h-3.5 mr-1.5" /> Resolve
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Banned / muted patrons */}
        <Card className="bg-zinc-950 border-white/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Ban className="w-4 h-4 text-rose-400" /> Banned & Muted Patrons
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sanctioned.length === 0 ? (
              <p className="text-sm text-gray-500">No patrons are currently sanctioned.</p>
            ) : (
              sanctioned.map((p) => {
                const stillMuted = p.muted_until && new Date(p.muted_until).getTime() > Date.now()
                return (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-white/5">
                    <div className="text-sm">
                      <span className="font-semibold">{p.name}</span>
                      {p.is_banned && <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-rose-600/30 text-rose-300 border border-rose-600/40">Banned{p.ban_reason ? `: ${p.ban_reason}` : ''}</span>}
                      {stillMuted && <span className="ml-2 text-[10px] px-2 py-0.5 rounded-full bg-amber-600/30 text-amber-300 border border-amber-600/40">Muted until {new Date(p.muted_until!).toLocaleTimeString()}</span>}
                    </div>
                    <div className="flex gap-2">
                      {stillMuted && (
                        <Button size="sm" variant="ghost" onClick={() => handleUnmute(p.id)}>
                          <Volume2 className="w-3.5 h-3.5 mr-1.5" /> Unmute
                        </Button>
                      )}
                      {p.is_banned && (
                        <Button size="sm" variant="ghost" onClick={() => handleUnban(p.id)}>
                          Revoke Ban
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        {/* Role management */}
        <Card className="bg-zinc-950 border-white/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" /> Patron Roles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-gray-500">
              Search patrons who have visited Chat Café at least once to promote them to barista, moderator, or admin.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Search by name…"
                value={patronSearch}
                onChange={(e) => setPatronSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearchPatrons()}
                className="bg-zinc-900 border-white/10"
              />
              <Button onClick={handleSearchPatrons} disabled={searching}>
                <Search className="w-4 h-4 mr-1.5" /> Search
              </Button>
            </div>
            {searchResults.length > 0 && (
              <div className="space-y-2">
                {searchResults.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-white/5">
                    <span className="text-sm font-semibold">{p.name}</span>
                    <select
                      value={p.role}
                      onChange={(e) => handleSetRole(p.id, e.target.value)}
                      className="bg-zinc-800 border border-white/10 rounded-lg text-xs px-2 py-1.5 text-gray-200"
                    >
                      {ROLE_OPTIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Moderation log */}
        <Card className="bg-zinc-950 border-white/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <ScrollText className="w-4 h-4 text-gray-400" /> Recent Moderation Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1.5">
            {logs.length === 0 ? (
              <p className="text-sm text-gray-500">No moderation actions logged yet.</p>
            ) : (
              logs.map((l) => (
                <div key={l.id} className="text-xs text-gray-400 flex items-center justify-between border-b border-white/5 py-1.5">
                  <span>
                    <span className="uppercase text-gray-200 font-semibold">{l.action}</span>
                    {l.target_user_name && <> · {l.target_user_name}</>}
                    {l.reason && <> · {l.reason}</>}
                    {l.moderator_name && <> · by {l.moderator_name}</>}
                  </span>
                  <span>{new Date(l.created_at).toLocaleString()}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
