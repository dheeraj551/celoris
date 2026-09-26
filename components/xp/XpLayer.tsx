"use client"

// Celoris XP layer — mounted once in the root layout.
//
//  • Counts active minutes (tab visible + a click/key/scroll in the last 2
//    minutes) and asks the server for 1 XP a minute. The server decides
//    everything; this only shows it.
//  • XP chip (bottom-left): level ring, spendable XP, chest. A small "+1"
//    floats up each active minute. On full-screen workspaces the chip hides,
//    but the header's XP pill / account menu can still open the panel.
//  • Chest: fills while you're active; when full it glows and you tap Claim.
//  • Daily check-in card on the first visit of the day (7-day streak cycle).
//  • Level-up celebration, "Did you know?" tips, convert XP → credits.
//  • Members can switch animations and sound off (saved in this browser).

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { AnimatePresence, m } from "framer-motion"
import { CalendarCheck, Coins, Gift, Lightbulb, Sparkles, Trophy, Volume2, VolumeX, X, Zap } from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { fmtXp, levelInfo, levelTitle, type XpState } from "@/lib/xp-shared"
import { XP_TIPS, type XpTip } from "@/lib/xp-tips"
import {
  XP_EVENT,
  XP_OPEN_EVENT,
  type XpEventDetail,
  type XpPrefs,
  istToday,
  loadXpPrefs,
  playXpSound,
  preloadXpSounds,
  publishXpSummary,
  saveXpPrefs,
  storageGet,
  storageSet,
} from "@/lib/xp-client"

// No XP counting at all on these (admin panel).
const NO_XP_PREFIXES = ["/admin"]
// XP still counts here, but the chip, tips and pop-ups stay out of the way of
// full-screen workspaces.
const QUIET_PREFIXES = [
  "/chat",
  "/dashboard",
  "/video-studio",
  "/image-studio",
  "/motion-swap",
  "/genjutsu",
  "/vio-studio",
  "/photolite",
  "/polyvault",
  "/celo-ai",
  "/celoris-tv",
  "/marketing-studio",
  "/login",
  "/register",
  "/auth",
]

const TICK_MS = 60_000
const ACTIVE_WINDOW_MS = 120_000
const FIRST_TIP_AFTER_MS = 3 * 60_000
const TIP_EVERY_MS = 10 * 60_000
const MAX_TIPS_PER_DAY = 3

const startsWith = (path: string, list: string[]) => list.some((p) => path === p || path.startsWith(`${p}/`))

async function xpPost(body: Record<string, unknown>): Promise<{ ok: boolean; data: any }> {
  try {
    const res = await fetch("/api/xp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, data }
  } catch {
    return { ok: false, data: { error: "Couldn’t reach Celoris." } }
  }
}

interface Floater {
  id: number
  text: string
  big?: boolean
}

export function XpLayer() {
  const { user, loading } = useAuth()
  // Depend on the id, not the user object, so a new object with the same
  // person never re-triggers loading.
  const userId: string | null = user?.id ?? null
  const pathname = usePathname() || "/"
  const noXp = startsWith(pathname, NO_XP_PREFIXES)
  const quiet = noXp || startsWith(pathname, QUIET_PREFIXES)

  const [xp, setXp] = useState<XpState | null>(null)
  const [prefs, setPrefs] = useState<XpPrefs>({ animations: true, sound: false })
  const [floaters, setFloaters] = useState<Floater[]>([])
  const [panelOpen, setPanelOpen] = useState(false)
  const [checkinOpen, setCheckinOpen] = useState(false)
  const [levelUp, setLevelUp] = useState<number | null>(null)
  const [burst, setBurst] = useState(0)
  const [tip, setTip] = useState<XpTip | null>(null)
  const [busy, setBusy] = useState<"claim" | "checkin" | "convert" | null>(null)
  const [convertCredits, setConvertCredits] = useState(1)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  const lastActiveRef = useRef(Date.now())
  const xpRef = useRef<XpState | null>(null)
  xpRef.current = xp
  const prefsRef = useRef(prefs)
  prefsRef.current = prefs
  const floaterId = useRef(0)
  const [chestNudgeHidden, setChestNudgeHidden] = useState(false)
  const quietRef = useRef(quiet)
  quietRef.current = quiet
  const checkinOpenRef = useRef(checkinOpen)
  checkinOpenRef.current = checkinOpen
  const panelOpenRef = useRef(panelOpen)
  panelOpenRef.current = panelOpen
  const tipRef = useRef(tip)
  tipRef.current = tip

  useEffect(() => {
    const p = loadXpPrefs()
    setPrefs(p)
    if (p.sound) preloadXpSounds()
  }, [])

  const updatePrefs = (p: XpPrefs) => {
    setPrefs(p)
    saveXpPrefs(p)
  }

  // ---------------------------------------------------------------- helpers

  const float = useCallback((text: string, big = false) => {
    if (!prefsRef.current.animations) return
    const id = ++floaterId.current
    setFloaters((f) => [...f.slice(-4), { id, text, big }])
    window.setTimeout(() => setFloaters((f) => f.filter((x) => x.id !== id)), big ? 2200 : 1400)
  }, [])

  /** Applies a new state from the server and celebrates a level-up. */
  const applyState = useCallback((next: XpState) => {
    const prev = xpRef.current
    setXp(next)
    if (prev) {
      const before = levelInfo(prev.lifetimeXp).level
      const after = levelInfo(next.lifetimeXp).level
      if (after > before) {
        setLevelUp(after)
        if (prefsRef.current.sound) playXpSound("level")
        window.setTimeout(() => setLevelUp((l) => (l === after ? null : l)), 4200)
      }
    }
  }, [])

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/xp", { cache: "no-store" })
      const data = await res.json()
      if (data?.state) applyState(data.state)
    } catch {
      // ignore — the chip just stays hidden
    }
  }, [applyState])

  // ---------------------------------------------------------------- load + activity

  useEffect(() => {
    if (loading || !userId || noXp) return
    load()
  }, [userId, loading, noXp, load])

  // Signed out → forget the numbers.
  useEffect(() => {
    if (!loading && !userId) setXp(null)
  }, [userId, loading])

  // The header pill / account menu ask for the panel.
  useEffect(() => {
    const open = () => {
      setPanelOpen(true)
      if (!xpRef.current) load()
    }
    window.addEventListener(XP_OPEN_EVENT, open)
    return () => window.removeEventListener(XP_OPEN_EVENT, open)
  }, [load])

  useEffect(() => {
    let lastMove = 0
    const mark = () => {
      lastActiveRef.current = Date.now()
    }
    const move = () => {
      const now = Date.now()
      if (now - lastMove > 5000) {
        lastMove = now
        lastActiveRef.current = now
      }
    }
    window.addEventListener("pointerdown", mark, { passive: true })
    window.addEventListener("keydown", mark)
    window.addEventListener("scroll", mark, { passive: true })
    window.addEventListener("touchstart", mark, { passive: true })
    window.addEventListener("mousemove", move, { passive: true })
    return () => {
      window.removeEventListener("pointerdown", mark)
      window.removeEventListener("keydown", mark)
      window.removeEventListener("scroll", mark)
      window.removeEventListener("touchstart", mark)
      window.removeEventListener("mousemove", move)
    }
  }, [])

  // One tick a minute while the member is really here.
  useEffect(() => {
    if (!userId || noXp) return
    const t = window.setInterval(async () => {
      if (document.visibilityState !== "visible") return
      if (Date.now() - lastActiveRef.current > ACTIVE_WINDOW_MS) return
      const { ok, data } = await xpPost({ action: "tick" })
      if (!ok || !data?.state) return
      const s = data.state as XpState
      applyState(s)
      if (s.added && s.added > 0) {
        if (!quietRef.current) float(`+${s.added} XP`)
        if (prefsRef.current.sound && !quietRef.current) playXpSound("tick")
      }
    }, TICK_MS)
    return () => window.clearInterval(t)
  }, [userId, noXp, applyState, float])

  // Show the daily check-in card once per day (on a normal page).
  useEffect(() => {
    if (!xp || quiet || xp.checkedInToday) return
    if (storageGet("celoris-xp-checkin-seen") === istToday()) return
    const t = window.setTimeout(() => setCheckinOpen(true), 2500)
    return () => window.clearTimeout(t)
  }, [xp, quiet])

  // "Did you know?" tips — a few a day, never on workspaces.
  useEffect(() => {
    if (quiet) return
    if (xp && !xp.tipsEnabled) return
    const pageStart = Date.now()
    let lastShown = 0
    const t = window.setInterval(() => {
      if (document.visibilityState !== "visible") return
      if (Date.now() - lastActiveRef.current > ACTIVE_WINDOW_MS) return
      if (checkinOpenRef.current || panelOpenRef.current || tipRef.current) return
      // Let the daily check-in card come first.
      const s = xpRef.current
      if (s && !s.checkedInToday && storageGet("celoris-xp-checkin-seen") !== istToday()) return
      const now = Date.now()
      if (now - pageStart < FIRST_TIP_AFTER_MS) return
      if (lastShown && now - lastShown < TIP_EVERY_MS) return
      const dayKey = `celoris-xp-tips-${istToday()}`
      const shownToday = Number(storageGet(dayKey) || 0)
      if (shownToday >= MAX_TIPS_PER_DAY) return
      const audience = userId ? "member" : "visitor"
      const pool = XP_TIPS.filter((x) => x.audience === "all" || x.audience === audience)
      const lastId = storageGet("celoris-xp-last-tip")
      const choices = pool.filter((x) => x.id !== lastId)
      const next = choices[Math.floor(Math.random() * choices.length)]
      if (!next) return
      lastShown = now
      storageSet(dayKey, String(shownToday + 1))
      storageSet("celoris-xp-last-tip", next.id)
      setTip(next)
    }, 30_000)
    return () => window.clearInterval(t)
  }, [quiet, userId, xp?.tipsEnabled]) // eslint-disable-line react-hooks/exhaustive-deps

  // Tips close themselves after a while.
  useEffect(() => {
    if (!tip) return
    const t = window.setTimeout(() => setTip(null), 14_000)
    return () => window.clearTimeout(t)
  }, [tip])

  // Rewards from elsewhere in the app (phase 2: classes, exams …).
  useEffect(() => {
    const onXp = (e: Event) => {
      const d = (e as CustomEvent<XpEventDetail>).detail || {}
      load()
      if (!d.refreshOnly && d.amount && d.amount > 0) {
        float(`+${fmtXp(d.amount)} XP${d.label ? ` · ${d.label}` : ""}`, true)
        setBurst((b) => b + 1)
        if (prefsRef.current.sound) playXpSound("coins")
      }
    }
    window.addEventListener(XP_EVENT, onXp)
    return () => window.removeEventListener(XP_EVENT, onXp)
  }, [load, float])

  // ---------------------------------------------------------------- actions

  const claimChest = async () => {
    if (busy) return
    setBusy("claim")
    const { ok, data } = await xpPost({ action: "claim" })
    setBusy(null)
    if (ok && data?.state) {
      applyState(data.state)
      if (data.state.claimed > 0) {
        float(`+${fmtXp(data.state.claimed)} XP`, true)
        setBurst((b) => b + 1)
        if (prefs.sound) playXpSound("coins")
      }
    }
  }

  const checkIn = async () => {
    if (busy) return
    setBusy("checkin")
    const { ok, data } = await xpPost({ action: "checkin" })
    setBusy(null)
    storageSet("celoris-xp-checkin-seen", istToday())
    if (ok && data?.state) {
      applyState(data.state)
      if (data.state.claimed > 0) {
        float(`+${fmtXp(data.state.claimed)} XP · Day ${data.state.day}`, true)
        setBurst((b) => b + 1)
        if (prefs.sound) playXpSound("coins")
      }
    }
    window.setTimeout(() => setCheckinOpen(false), 900)
  }

  const convert = async () => {
    if (busy || !xp) return
    setBusy("convert")
    setMessage(null)
    const { ok, data } = await xpPost({ action: "convert", credits: convertCredits })
    setBusy(null)
    if (!ok) {
      setMessage({ ok: false, text: data?.error || "Couldn’t convert right now." })
      return
    }
    applyState(data.state)
    setMessage({
      ok: true,
      text: `${convertCredits} credit${convertCredits === 1 ? "" : "s"} added to your wallet${
        typeof data.state.walletBalance === "number" ? ` (balance ${fmtXp(data.state.walletBalance)})` : ""
      }.`,
    })
    setBurst((b) => b + 1)
    if (prefs.sound) playXpSound("coins")
  }

  // ---------------------------------------------------------------- derived

  const lvl = useMemo(() => levelInfo(xp?.lifetimeXp || 0), [xp?.lifetimeXp])
  const chestFull = !!xp && xp.chestXp >= xp.chestSize

  // Share the numbers with the header (XP pill) and account menu.
  useEffect(() => {
    publishXpSummary(
      xp && userId
        ? { balanceXp: xp.balanceXp, lifetimeXp: xp.lifetimeXp, level: lvl.level, streakDays: xp.streakDays, chestFull }
        : null,
    )
  }, [xp, userId, lvl.level, chestFull])

  // The "chest is full" nudge comes back each time the chest fills up again.
  useEffect(() => {
    if (!chestFull) setChestNudgeHidden(false)
  }, [chestFull])
  const maxConvert = xp
    ? Math.max(0, Math.min(Math.floor(xp.balanceXp / xp.creditRateXp), xp.monthlyConvertCap - xp.convertedThisMonth))
    : 0

  useEffect(() => {
    if (convertCredits > Math.max(1, maxConvert)) setConvertCredits(Math.max(1, maxConvert))
  }, [maxConvert, convertCredits])

  // ---------------------------------------------------------------- render

  // Workspaces hide the chip, unless the member opened the panel from the header.
  const showChip = !!userId && !!xp && (!quiet || panelOpen)
  const anim = prefs.animations

  const tipCard = (
    <AnimatePresence>
      {tip && !quiet && (
        <m.div
          key={tip.id}
          initial={anim ? { opacity: 0, y: 24, scale: 0.96 } : false}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={anim ? { opacity: 0, y: 16 } : { opacity: 0 }}
          transition={{ type: "spring", stiffness: 260, damping: 22 }}
          className={`fixed left-4 z-[45] w-[300px] max-w-[calc(100vw-2rem)] rounded-2xl border border-amber-300/25 bg-[#0d1016]/95 backdrop-blur-xl p-3.5 text-white shadow-2xl ${
            showChip ? "bottom-20" : "bottom-4"
          }`}
          role="status"
        >
          <button
            onClick={() => setTip(null)}
            className="absolute right-2 top-2 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            aria-label="Close"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
            <Lightbulb className="w-3.5 h-3.5" /> Did you know?
          </p>
          <p className="mt-1.5 pr-4 text-sm leading-snug text-slate-100">{tip.text}</p>
          {tip.href && (
            <Link
              href={tip.href}
              onClick={() => setTip(null)}
              className="mt-2 inline-flex text-xs font-bold text-amber-300 hover:text-amber-200"
            >
              {tip.cta || "Take a look"} →
            </Link>
          )}
        </m.div>
      )}
    </AnimatePresence>
  )

  if (!showChip) {
    return (
      <>
        {tipCard}
        <LevelUpOverlay level={levelUp} onClose={() => setLevelUp(null)} anim={anim} />
      </>
    )
  }

  return (
    <>
      {tipCard}

      {/* Chest-full nudge */}
      <AnimatePresence>
        {chestFull && !panelOpen && !chestNudgeHidden && !tip && (
          <m.div
            key="chest-nudge"
            initial={anim ? { opacity: 0, x: -20 } : false}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="fixed left-4 bottom-20 z-[45] flex items-center gap-2 rounded-2xl border border-amber-300/30 bg-[#16110a]/95 px-3 py-2 text-white shadow-2xl"
          >
            <Gift className="w-5 h-5 text-amber-300" />
            <span className="text-xs">
              Your chest is full — <b>{fmtXp(Math.round(xp!.chestXp * xp!.multiplier))} XP</b> waiting
            </span>
            <button
              onClick={() => {
                setChestNudgeHidden(true)
                claimChest()
              }}
              className="ml-1 rounded-lg bg-amber-400 px-2.5 py-1 text-xs font-extrabold text-black hover:bg-amber-300"
            >
              Claim
            </button>
            <button
              onClick={() => setChestNudgeHidden(true)}
              className="p-1 text-slate-400 hover:text-white"
              aria-label="Later"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </m.div>
        )}
      </AnimatePresence>

      {/* The chip */}
      <div className="fixed left-4 bottom-4 z-[46] select-none">
        {/* floating "+1 XP" */}
        <div className="pointer-events-none absolute left-10 bottom-full h-24 w-40">
          <AnimatePresence>
            {floaters.map((f) => (
              <m.span
                key={f.id}
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: f.big ? -64 : -44, scale: f.big ? 1.15 : 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: f.big ? 1.6 : 1.1, ease: "easeOut" }}
                className={`absolute bottom-0 left-0 whitespace-nowrap font-extrabold drop-shadow ${
                  f.big ? "text-base text-amber-300" : "text-sm text-lime-300"
                }`}
              >
                {f.text}
              </m.span>
            ))}
          </AnimatePresence>
        </div>
        <CoinBurst trigger={burst} anim={anim} />

        <button
          onClick={() => setPanelOpen((o) => !o)}
          className={`relative flex items-center gap-2 rounded-full border bg-[#0a0d14]/90 backdrop-blur-xl pl-1 pr-3 py-1 text-white shadow-2xl transition-colors ${
            chestFull ? "border-amber-300/60 shadow-amber-500/20" : "border-white/15 hover:border-white/30"
          }`}
          aria-label={`Your XP: ${fmtXp(xp!.balanceXp)} XP, level ${lvl.level}. Open XP details`}
          title="Your XP — tap for details"
        >
          <LevelRing level={lvl.level} progress={lvl.progress} />
          <span className="text-sm font-extrabold tabular-nums">{fmtXp(xp!.balanceXp)}</span>
          <span className="text-[10px] font-bold text-lime-300">XP</span>
          <ChestIcon fill={xp!.chestXp / Math.max(1, xp!.chestSize)} full={chestFull} anim={anim} />
        </button>

        {/* Panel */}
        <AnimatePresence>
          {panelOpen && (
            <m.div
              initial={anim ? { opacity: 0, y: 10, scale: 0.97 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18 }}
              className="absolute left-0 bottom-full mb-3 w-[320px] max-w-[calc(100vw-2rem)] rounded-2xl border border-white/[0.12] bg-[#0b0e15]/95 backdrop-blur-2xl p-4 text-white shadow-2xl"
            >
              <button
                onClick={() => setPanelOpen(false)}
                className="absolute right-2.5 top-2.5 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Your XP</p>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-lime-300/25 bg-lime-300/[0.06] px-3 py-2">
                  <p className="text-[10px] font-semibold text-lime-200/80">XP balance</p>
                  <p className="text-xl font-extrabold tabular-nums text-lime-300 leading-tight">{fmtXp(xp!.balanceXp)}</p>
                  <p className="text-[10px] text-slate-400">yours to spend</p>
                </div>
                <div className="rounded-xl border border-white/[0.1] bg-white/[0.03] px-3 py-2">
                  <p className="text-[10px] font-semibold text-slate-300">Total earned</p>
                  <p className="text-xl font-extrabold tabular-nums leading-tight">{fmtXp(xp!.lifetimeXp)}</p>
                  <p className="text-[10px] text-slate-400">all time</p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <LevelRing level={lvl.level} progress={lvl.progress} size={40} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-extrabold leading-tight">
                    Level {lvl.level} <span className="font-medium text-slate-400">· {levelTitle(lvl.level)}</span>
                  </p>
                  <div className="mt-1.5 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-lime-400 to-emerald-400" style={{ width: `${Math.round(lvl.progress * 100)}%` }} />
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">{fmtXp(lvl.needed - lvl.into)} XP to level {lvl.level + 1}</p>
                </div>
              </div>

              {/* Chest */}
              <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold flex items-center gap-1.5">
                    <Gift className="w-4 h-4 text-amber-300" /> XP chest
                  </p>
                  <span className="text-[11px] text-slate-400 tabular-nums">
                    {xp!.chestXp}/{xp!.chestSize}
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${chestFull ? "bg-amber-400" : "bg-amber-400/60"}`}
                    style={{ width: `${Math.min(100, Math.round((xp!.chestXp / Math.max(1, xp!.chestSize)) * 100))}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-[11px] text-slate-400 leading-snug">
                    {xp!.activeXpToday >= xp!.activeDailyCap
                      ? "Today’s activity XP is done — come back tomorrow."
                      : chestFull
                        ? "Full! Claim it to keep filling."
                        : "Fills 1 XP for every active minute."}
                  </p>
                  <button
                    onClick={claimChest}
                    disabled={!chestFull || busy === "claim"}
                    className="shrink-0 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-extrabold text-black hover:bg-amber-300 disabled:opacity-30"
                  >
                    {busy === "claim" ? "…" : "Claim"}
                  </button>
                </div>
              </div>

              {/* Streak */}
              <div className="mt-3 flex items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                <div>
                  <p className="text-sm font-bold flex items-center gap-1.5">
                    <CalendarCheck className="w-4 h-4 text-orange-400" /> Daily check-in
                  </p>
                  <p className="text-[11px] text-slate-400">
                    {xp!.streakDays > 0 ? `${xp!.streakDays} day${xp!.streakDays === 1 ? "" : "s"} in a row` : "Check in every day for bonus XP"}
                  </p>
                </div>
                {xp!.checkedInToday ? (
                  <span className="text-[11px] text-emerald-300">Checked in today ✓</span>
                ) : (
                  <button
                    onClick={() => setCheckinOpen(true)}
                    className="rounded-lg bg-orange-500 px-3 py-1.5 text-xs font-extrabold text-white hover:bg-orange-400"
                  >
                    Check in
                  </button>
                )}
              </div>

              {/* Convert */}
              <div className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.03] p-3">
                <p className="text-sm font-bold flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-yellow-300" /> Turn XP into credits
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  {fmtXp(xp!.creditRateXp)} XP = 1 credit · {Math.max(0, xp!.monthlyConvertCap - xp!.convertedThisMonth)} left this month. Your level never goes down.
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    max={Math.max(1, maxConvert)}
                    value={convertCredits}
                    onChange={(e) => setConvertCredits(Math.max(1, Math.min(Math.max(1, maxConvert), Math.floor(Number(e.target.value) || 1))))}
                    className="w-16 h-8 rounded-lg bg-white/[0.06] border border-white/10 px-2 text-sm text-white text-center"
                    disabled={maxConvert < 1}
                  />
                  <span className="text-xs text-slate-400">= {fmtXp(convertCredits * xp!.creditRateXp)} XP</span>
                  <button
                    onClick={convert}
                    disabled={maxConvert < 1 || busy === "convert"}
                    className="ml-auto rounded-lg bg-yellow-400 px-3 py-1.5 text-xs font-extrabold text-black hover:bg-yellow-300 disabled:opacity-30"
                  >
                    {busy === "convert" ? "…" : "Convert"}
                  </button>
                </div>
                {maxConvert < 1 && (
                  <p className="mt-1.5 text-[11px] text-slate-500">
                    You need {fmtXp(xp!.creditRateXp)} XP to convert your first credit.
                  </p>
                )}
                {message && <p className={`mt-1.5 text-[11px] ${message.ok ? "text-emerald-300" : "text-rose-300"}`}>{message.text}</p>}
              </div>

              {xp!.multiplier > 1 && (
                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-lime-300">
                  <Zap className="w-3.5 h-3.5" /> Your plan earns {xp!.multiplier}× XP on chests, check-ins and activities.
                </p>
              )}

              <div className="mt-3 flex items-center justify-between border-t border-white/[0.08] pt-3 text-[11px] text-slate-400">
                <button onClick={() => updatePrefs({ ...prefs, animations: !prefs.animations })} className="hover:text-white inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Animations {prefs.animations ? "on" : "off"}
                </button>
                <button onClick={() => updatePrefs({ ...prefs, sound: !prefs.sound })} className="hover:text-white inline-flex items-center gap-1">
                  {prefs.sound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />} Sound {prefs.sound ? "on" : "off"}
                </button>
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>

      <CheckinModal
        open={checkinOpen}
        xp={xp!}
        busy={busy === "checkin"}
        anim={anim}
        onClaim={checkIn}
        onClose={() => {
          storageSet("celoris-xp-checkin-seen", istToday())
          setCheckinOpen(false)
        }}
      />
      <LevelUpOverlay level={levelUp} onClose={() => setLevelUp(null)} anim={anim} />
    </>
  )
}

// ---------------------------------------------------------------------------
// Pieces
// ---------------------------------------------------------------------------

function LevelRing({ level, progress, size = 30 }: { level: number; progress: number; size?: number }) {
  const r = size / 2 - 3
  const c = 2 * Math.PI * r
  return (
    <span className="relative inline-flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.12)" strokeWidth={3} fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="url(#xp-ring)"
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - Math.min(1, Math.max(0, progress)))}
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <defs>
          <linearGradient id="xp-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#a3e635" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
      </svg>
      <span className="absolute text-[11px] font-extrabold" style={{ fontSize: size * 0.36 }}>
        {level}
      </span>
    </span>
  )
}

function ChestIcon({ fill, full, anim }: { fill: number; full: boolean; anim: boolean }) {
  return (
    <m.span
      animate={full && anim ? { rotate: [0, -8, 8, -6, 6, 0], scale: [1, 1.12, 1] } : { rotate: 0, scale: 1 }}
      transition={full && anim ? { duration: 0.9, repeat: Infinity, repeatDelay: 2.2 } : { duration: 0.2 }}
      className="relative ml-1 inline-flex h-6 w-6 items-center justify-center"
      title={full ? "Chest full — open the panel to claim" : `Chest ${Math.round(fill * 100)}% full`}
    >
      <Gift className={`h-5 w-5 ${full ? "text-amber-300" : "text-slate-400"}`} />
      {!full && (
        <span className="absolute -bottom-0.5 left-0.5 right-0.5 h-[3px] rounded-full bg-white/15 overflow-hidden">
          <span className="block h-full bg-amber-400" style={{ width: `${Math.round(fill * 100)}%` }} />
        </span>
      )}
      {full && <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber-300 animate-ping" />}
    </m.span>
  )
}

function CoinBurst({ trigger, anim }: { trigger: number; anim: boolean }) {
  const [shown, setShown] = useState(0)
  useEffect(() => {
    if (!trigger || !anim) return
    setShown(trigger)
    const t = window.setTimeout(() => setShown(0), 1300)
    return () => window.clearTimeout(t)
  }, [trigger, anim])
  if (!shown) return null
  const coins = Array.from({ length: 10 }, (_, i) => i)
  return (
    <div className="pointer-events-none absolute left-6 bottom-6">
      {coins.map((i) => {
        const angle = (i / coins.length) * Math.PI - Math.PI
        const dist = 50 + (i % 3) * 18
        return (
          <m.span
            key={`${shown}-${i}`}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0.6 }}
            animate={{ x: Math.cos(angle) * dist, y: Math.sin(angle) * dist - 20, opacity: 0, scale: 1 }}
            transition={{ duration: 1.1, ease: "easeOut" }}
            className="absolute h-3.5 w-3.5 rounded-full bg-gradient-to-br from-yellow-200 to-amber-500 shadow"
          />
        )
      })}
    </div>
  )
}

function CheckinModal({
  open,
  xp,
  busy,
  anim,
  onClaim,
  onClose,
}: {
  open: boolean
  xp: XpState
  busy: boolean
  anim: boolean
  onClaim: () => void
  onClose: () => void
}) {
  if (!xp) return null
  const rewards = xp.checkinRewards && xp.checkinRewards.length ? xp.checkinRewards : [10]
  const len = rewards.length
  // Which day of the cycle today's check-in would be.
  const nextStreak = xp.checkedInToday ? xp.streakDays : xp.streakDays + 1
  const todayIndex = (Math.max(1, nextStreak) - 1) % len
  return (
    <AnimatePresence>
      {open && (
        <m.div
          key="checkin"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <m.div
            initial={anim ? { scale: 0.9, y: 20 } : false}
            animate={{ scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl border border-orange-400/25 bg-gradient-to-b from-[#1a1208] to-[#0b0d13] p-6 text-white shadow-2xl"
          >
            <button onClick={onClose} className="absolute right-3 top-3 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10" aria-label="Close">
              <X className="w-4 h-4" />
            </button>
            <div className="text-center">
              <m.div
                animate={anim ? { rotate: [0, -6, 6, 0] } : {}}
                transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5 }}
                className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 shadow-lg shadow-orange-500/30"
              >
                <CalendarCheck className="h-7 w-7 text-white" />
              </m.div>
              <h2 className="mt-3 text-xl font-extrabold">Daily check-in</h2>
              <p className="mt-1 text-sm text-slate-400">
                {xp.checkedInToday
                  ? `You're on a ${xp.streakDays}-day streak. See you tomorrow!`
                  : xp.streakDays > 0
                    ? `Keep your ${xp.streakDays}-day streak going!`
                    : "Come back every day — day 7 is the big one."}
              </p>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-1.5">
              {rewards.map((r, i) => {
                const done = i < todayIndex || (xp.checkedInToday && i === todayIndex)
                const isToday = i === todayIndex
                return (
                  <div
                    key={i}
                    className={`rounded-xl border px-1 py-2 text-center ${
                      isToday && !xp.checkedInToday
                        ? "border-orange-400 bg-orange-500/15"
                        : done
                          ? "border-emerald-400/40 bg-emerald-500/10"
                          : "border-white/10 bg-white/[0.03]"
                    }`}
                  >
                    <p className="text-[9px] uppercase text-slate-400">Day {i + 1}</p>
                    <p className={`mt-0.5 text-xs font-extrabold ${i === len - 1 ? "text-amber-300" : ""}`}>
                      {done ? "✓" : Math.round(r * xp.multiplier)}
                    </p>
                  </div>
                )
              })}
            </div>

            {!xp.checkedInToday ? (
              <button
                onClick={onClaim}
                disabled={busy}
                className="mt-5 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-rose-500 py-3 text-sm font-extrabold hover:from-orange-400 hover:to-rose-400 disabled:opacity-60"
              >
                {busy ? "Claiming…" : `Claim ${Math.round(rewards[todayIndex] * xp.multiplier)} XP`}
              </button>
            ) : (
              <button onClick={onClose} className="mt-5 w-full rounded-2xl bg-white/10 py-3 text-sm font-bold hover:bg-white/15">
                Nice!
              </button>
            )}
            {xp.multiplier > 1 && (
              <p className="mt-2 text-center text-[11px] text-lime-300">Includes your plan’s {xp.multiplier}× bonus</p>
            )}
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

function LevelUpOverlay({ level, onClose, anim }: { level: number | null; onClose: () => void; anim: boolean }) {
  const colors = ["#a3e635", "#fbbf24", "#f472b6", "#38bdf8", "#34d399", "#fb923c"]
  // Random confetti paths, fixed for each level-up so re-renders don't jump.
  const pieces = useMemo(
    () =>
      Array.from({ length: 36 }, (_, i) => ({
        i,
        x: (Math.random() - 0.5) * 700,
        y: (Math.random() - 0.7) * 600,
        r: Math.random() * 540,
        d: 1.8 + Math.random(),
      })),
    [level] // eslint-disable-line react-hooks/exhaustive-deps
  )
  return (
    <AnimatePresence>
      {level !== null && (
        <m.div
          key={`lvl-${level}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[85] flex items-center justify-center bg-black/55 backdrop-blur-sm"
          onClick={onClose}
        >
          {anim &&
            pieces.map((p) => (
              <m.span
                key={p.i}
                initial={{ x: 0, y: 0, opacity: 1, rotate: 0 }}
                animate={{ x: p.x, y: p.y, opacity: 0, rotate: p.r }}
                transition={{ duration: p.d, ease: "easeOut" }}
                className="absolute h-2.5 w-1.5 rounded-sm"
                style={{ background: colors[p.i % colors.length] }}
              />
            ))}
          <m.div
            initial={anim ? { scale: 0.6, opacity: 0 } : false}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 220, damping: 14 }}
            className="relative rounded-3xl border border-lime-300/30 bg-[#0b0f14] px-10 py-8 text-center text-white shadow-2xl"
          >
            <Trophy className="mx-auto h-10 w-10 text-amber-300" />
            <p className="mt-2 text-xs font-bold uppercase tracking-[0.25em] text-lime-300">Level up</p>
            <p className="mt-1 text-5xl font-black">{level}</p>
            <p className="mt-1 text-sm text-slate-300">You’re now a {levelTitle(level)}</p>
          </m.div>
        </m.div>
      )}
    </AnimatePresence>
  )
}

export default XpLayer
