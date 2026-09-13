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
  Bot,
  Plus,
  Trash2,
  Pencil,
  Pause,
  Play,
  Send,
} from "lucide-react"
import { AVATAR_CHARACTERS } from "@/components/chat-cafe/data/cafeData"

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

interface ChatCafeAiCharacter {
  id: string
  table_id: string
  name: string
  avatar_id: string
  avatar_color: string
  accessory: string | null
  backstory: string
  personality: string
  is_active: boolean
}

const ROLE_OPTIONS = ['patron', 'regular', 'barista', 'moderator', 'admin']

// A small controlled input + send button for posting one line as an AI
// character, straight from the dashboard. Its own component so each
// character's draft text is independent and typing doesn't re-render the
// whole roster.
function SendAsCharacterRow({ characterId, characterName }: { characterId: string; characterName: string }) {
  const [text, setText] = useState("")
  const [sending, setSending] = useState(false)

  const submit = async () => {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    setSending(true)
    try {
      const res = await fetch(`/api/admin/chat-cafe/ai-characters/${characterId}/speak`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: trimmed }),
      })
      if (res.ok) {
        setText("")
      } else {
        const data = await res.json().catch(() => ({}))
        alert(data.error || `Could not send that as ${characterName}.`)
      }
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="flex items-center gap-2 mt-2">
      <Input
        placeholder={`Type as ${characterName}…`}
        value={text}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') submit()
        }}
        className="bg-zinc-800 border-white/10 text-xs"
      />
      <Button size="sm" onClick={submit} disabled={sending || !text.trim()}>
        <Send className="w-3.5 h-3.5" />
      </Button>
    </div>
  )
}

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

  const [aiCharacters, setAiCharacters] = useState<ChatCafeAiCharacter[]>([])
  const [newCharTableId, setNewCharTableId] = useState("")
  const [newCharName, setNewCharName] = useState("")
  const [newCharAvatarId, setNewCharAvatarId] = useState(AVATAR_CHARACTERS[0].id)
  const [newCharBackstory, setNewCharBackstory] = useState("")
  const [newCharPersonality, setNewCharPersonality] = useState("")
  const [savingChar, setSavingChar] = useState(false)
  const [editingCharId, setEditingCharId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<{ name: string; avatarId: string; backstory: string; personality: string } | null>(null)

  useEffect(() => {
    checkAdminAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Default the "add character" form to the first table once tables load.
  useEffect(() => {
    if (!newCharTableId && tables.length) setNewCharTableId(tables[0].id)
  }, [tables, newCharTableId])

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
      setAiCharacters(data.aiCharacters || [])
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

  // --- AI characters -------------------------------------------------
  const handleCreateCharacter = async () => {
    if (!newCharTableId || !newCharName.trim()) return
    setSavingChar(true)
    try {
      const preset = AVATAR_CHARACTERS.find((a) => a.id === newCharAvatarId) || AVATAR_CHARACTERS[0]
      const res = await fetch('/api/admin/chat-cafe/ai-characters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tableId: newCharTableId,
          name: newCharName.trim(),
          avatarId: preset.id,
          avatarColor: preset.color,
          accessory: preset.accessory,
          backstory: newCharBackstory.trim(),
          personality: newCharPersonality.trim(),
        }),
      })
      if (res.ok) {
        setNewCharName("")
        setNewCharBackstory("")
        setNewCharPersonality("")
        loadOverview()
      }
    } finally {
      setSavingChar(false)
    }
  }

  const handleToggleCharacterActive = async (character: ChatCafeAiCharacter) => {
    await fetch(`/api/admin/chat-cafe/ai-characters/${character.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !character.is_active }),
    })
    loadOverview()
  }

  const handleDeleteCharacter = async (character: ChatCafeAiCharacter) => {
    if (!window.confirm(`Remove ${character.name}? Their past messages stay in the chat history.`)) return
    await fetch(`/api/admin/chat-cafe/ai-characters/${character.id}`, { method: 'DELETE' })
    loadOverview()
  }

  const handleStartEditCharacter = (character: ChatCafeAiCharacter) => {
    setEditingCharId(character.id)
    setEditDraft({
      name: character.name,
      avatarId: character.avatar_id,
      backstory: character.backstory,
      personality: character.personality,
    })
  }

  const handleCancelEditCharacter = () => {
    setEditingCharId(null)
    setEditDraft(null)
  }

  const handleSaveEditCharacter = async (characterId: string) => {
    if (!editDraft || !editDraft.name.trim()) return
    const preset = AVATAR_CHARACTERS.find((a) => a.id === editDraft.avatarId) || AVATAR_CHARACTERS[0]
    await fetch(`/api/admin/chat-cafe/ai-characters/${characterId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: editDraft.name.trim(),
        avatarId: preset.id,
        avatarColor: preset.color,
        accessory: preset.accessory,
        backstory: editDraft.backstory.trim(),
        personality: editDraft.personality.trim(),
      }),
    })
    setEditingCharId(null)
    setEditDraft(null)
    loadOverview()
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

        {/* AI Characters */}
        <Card className="bg-zinc-950 border-white/10">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" /> AI Characters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-xs text-gray-500">
              Admin-curated regulars — you (or a moderator, from the café's Staff Console) type their lines
              yourself and post them straight to the table below, indistinguishable from any other message.
              There's no auto-generated dialogue.
            </p>

            {/* Add new character */}
            <div className="p-4 rounded-xl bg-zinc-900 border border-white/5 space-y-3">
              <div className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Add a Character</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select
                  value={newCharTableId}
                  onChange={(e) => setNewCharTableId(e.target.value)}
                  className="bg-zinc-800 border border-white/10 rounded-lg text-xs px-2 py-2 text-gray-200"
                >
                  {tables.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.icon} {t.name}
                    </option>
                  ))}
                </select>
                <select
                  value={newCharAvatarId}
                  onChange={(e) => setNewCharAvatarId(e.target.value)}
                  className="bg-zinc-800 border border-white/10 rounded-lg text-xs px-2 py-2 text-gray-200"
                >
                  {AVATAR_CHARACTERS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.icon} {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                placeholder="Character name…"
                value={newCharName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCharName(e.target.value)}
                className="bg-zinc-900 border-white/10"
              />
              <textarea
                placeholder="Backstory — who are they, why do they hang out here?"
                value={newCharBackstory}
                onChange={(e) => setNewCharBackstory(e.target.value)}
                rows={2}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg text-xs px-3 py-2 text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-indigo-500"
              />
              <textarea
                placeholder="Personality & speaking style — tone, quirks, how they talk"
                value={newCharPersonality}
                onChange={(e) => setNewCharPersonality(e.target.value)}
                rows={2}
                className="w-full bg-zinc-900 border border-white/10 rounded-lg text-xs px-3 py-2 text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={handleCreateCharacter} disabled={savingChar || !newCharName.trim() || !newCharTableId}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> {savingChar ? 'Adding…' : 'Add Character'}
                </Button>
              </div>
            </div>

            {/* Roster */}
            {aiCharacters.length === 0 ? (
              <p className="text-sm text-gray-500">No AI characters yet — add one above to bring a table to life.</p>
            ) : (
              <div className="space-y-2">
                {aiCharacters.map((character) => {
                  const table = tables.find((t) => t.id === character.table_id)
                  const preset = AVATAR_CHARACTERS.find((a) => a.id === character.avatar_id)
                  const isEditing = editingCharId === character.id
                  return (
                    <div key={character.id} className="p-3 rounded-xl bg-zinc-900 border border-white/5 space-y-2">
                      {isEditing && editDraft ? (
                        <div className="space-y-2">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            <Input
                              value={editDraft.name}
                              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditDraft({ ...editDraft, name: e.target.value })}
                              className="bg-zinc-800 border-white/10"
                            />
                            <select
                              value={editDraft.avatarId}
                              onChange={(e) => setEditDraft({ ...editDraft, avatarId: e.target.value })}
                              className="bg-zinc-800 border border-white/10 rounded-lg text-xs px-2 py-2 text-gray-200"
                            >
                              {AVATAR_CHARACTERS.map((a) => (
                                <option key={a.id} value={a.id}>
                                  {a.icon} {a.name}
                                </option>
                              ))}
                            </select>
                          </div>
                          <textarea
                            value={editDraft.backstory}
                            onChange={(e) => setEditDraft({ ...editDraft, backstory: e.target.value })}
                            rows={2}
                            placeholder="Backstory"
                            className="w-full bg-zinc-800 border border-white/10 rounded-lg text-xs px-3 py-2 text-gray-200 resize-none focus:outline-none focus:border-indigo-500"
                          />
                          <textarea
                            value={editDraft.personality}
                            onChange={(e) => setEditDraft({ ...editDraft, personality: e.target.value })}
                            rows={2}
                            placeholder="Personality & speaking style"
                            className="w-full bg-zinc-800 border border-white/10 rounded-lg text-xs px-3 py-2 text-gray-200 resize-none focus:outline-none focus:border-indigo-500"
                          />
                          <div className="flex justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={handleCancelEditCharacter}>
                              Cancel
                            </Button>
                            <Button size="sm" onClick={() => handleSaveEditCharacter(character.id)}>
                              Save
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-2.5 min-w-0">
                            <div
                              className={`w-9 h-9 rounded-xl bg-gradient-to-br ${character.avatar_color} flex items-center justify-center text-base flex-shrink-0`}
                            >
                              {preset?.icon || '☕'}
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-semibold flex items-center gap-2 flex-wrap">
                                <span>{character.name}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-gray-400 border border-white/10">
                                  {table ? `${table.icon} ${table.name}` : character.table_id}
                                </span>
                                {character.is_active ? (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-600/20 text-emerald-300 border border-emerald-600/30">
                                    Active
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-700/50 text-gray-400 border border-white/10">
                                    Paused
                                  </span>
                                )}
                              </div>
                              {character.personality && <p className="text-xs text-gray-500 mt-0.5 truncate">{character.personality}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleToggleCharacterActive(character)}
                              title={character.is_active ? 'Pause' : 'Resume'}
                            >
                              {character.is_active ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleStartEditCharacter(character)} title="Edit">
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button size="sm" variant="ghost" onClick={() => handleDeleteCharacter(character)} title="Remove">
                              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                            </Button>
                          </div>
                        </div>
                      )}
                      {!isEditing && <SendAsCharacterRow characterId={character.id} characterName={character.name} />}
                    </div>
                  )
                })}
              </div>
            )}
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
              <Ban className="w-4 h-4 text-rose-400" /> Banned & Muted Users
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sanctioned.length === 0 ? (
              <p className="text-sm text-gray-500">No users are currently sanctioned.</p>
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
              <Shield className="w-4 h-4 text-emerald-400" /> User Roles
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-xs text-gray-500">
              Search users who have visited Chat Café at least once to promote them to barista, moderator, or admin.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Search by name…"
                value={patronSearch}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPatronSearch(e.target.value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearchPatrons()}
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
                        <option key={r} value={r}>{r === 'patron' ? 'user' : r}</option>
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
