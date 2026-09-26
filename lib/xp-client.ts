"use client"

// Small browser helpers for Celoris XP.
//
// Other parts of the app can celebrate XP the server just awarded (e.g. after
// an exam) by calling showXpReward(amount, 'Exam passed'); the XP layer shows
// the floating "+100 XP" and refreshes the numbers. The amount shown here is
// only for the animation — the real XP is always decided by the server.

export const XP_EVENT = 'celoris:xp'

export interface XpEventDetail {
  amount?: number
  label?: string
  /** true = just refetch the numbers, no animation */
  refreshOnly?: boolean
}

export function showXpReward(amount: number, label?: string) {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<XpEventDetail>(XP_EVENT, { detail: { amount, label } }))
}

export function refreshXp() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<XpEventDetail>(XP_EVENT, { detail: { refreshOnly: true } }))
}

// Per-browser preferences (animations / sound). Storage can be blocked, so
// every access is wrapped.
export interface XpPrefs {
  animations: boolean
  sound: boolean
}

const PREFS_KEY = 'celoris-xp-prefs'

export function loadXpPrefs(): XpPrefs {
  let reduce = false
  try {
    reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    // ignore
  }
  const fallback: XpPrefs = { animations: !reduce, sound: false }
  try {
    const raw = window.localStorage.getItem(PREFS_KEY)
    if (!raw) return fallback
    const p = JSON.parse(raw)
    return { animations: typeof p.animations === 'boolean' ? p.animations : fallback.animations, sound: !!p.sound }
  } catch {
    return fallback
  }
}

export function saveXpPrefs(p: XpPrefs) {
  try {
    window.localStorage.setItem(PREFS_KEY, JSON.stringify(p))
  } catch {
    // ignore
  }
}

export function storageGet(key: string): string | null {
  try {
    return window.localStorage.getItem(key)
  } catch {
    return null
  }
}

export function storageSet(key: string, value: string) {
  try {
    window.localStorage.setItem(key, value)
  } catch {
    // ignore
  }
}

/** Today's date in India (YYYY-MM-DD) — matches the server's day boundary. */
export function istToday(): string {
  return new Date(Date.now() + 5.5 * 3600 * 1000).toISOString().slice(0, 10)
}

// Tiny sounds with WebAudio (no files). Only used when the member turns sound on.
let ctx: AudioContext | null = null
export function playXpSound(kind: 'tick' | 'coins' | 'level') {
  try {
    const Ctx: any = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!Ctx) return
    if (!ctx) ctx = new Ctx()
    const c = ctx!
    const notes = kind === 'tick' ? [880] : kind === 'coins' ? [988, 1319, 1568] : [523, 659, 784, 1047]
    notes.forEach((f, i) => {
      const osc = c.createOscillator()
      const gain = c.createGain()
      const t = c.currentTime + i * 0.09
      osc.type = 'triangle'
      osc.frequency.value = f
      gain.gain.setValueAtTime(0.0001, t)
      gain.gain.exponentialRampToValueAtTime(kind === 'tick' ? 0.04 : 0.09, t + 0.02)
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.25)
      osc.connect(gain).connect(c.destination)
      osc.start(t)
      osc.stop(t + 0.3)
    })
  } catch {
    // ignore
  }
}
