"use client"

import { useEffect, useState } from 'react'

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

// v2: sound is on by default now that XP has a proper "credited" sound.
const PREFS_KEY = 'celoris-xp-prefs-v2'

export function loadXpPrefs(): XpPrefs {
  let reduce = false
  try {
    reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    // ignore
  }
  const fallback: XpPrefs = { animations: !reduce, sound: true }
  try {
    const raw = window.localStorage.getItem(PREFS_KEY)
    if (!raw) return fallback
    const p = JSON.parse(raw)
    return {
      animations: typeof p.animations === 'boolean' ? p.animations : fallback.animations,
      sound: typeof p.sound === 'boolean' ? p.sound : fallback.sound,
    }
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

// Sounds. XP being credited (chest claim, daily check-in, rewards, converting)
// plays the cash-register clip; the per-minute tick and level-up are tiny
// WebAudio tones. Nothing plays unless the member has sound on.
const CREDIT_SOUND_URL = '/sounds/xp-credit.mp3'
let creditAudio: HTMLAudioElement | null = null

export function preloadXpSounds() {
  try {
    if (creditAudio || typeof Audio === 'undefined') return
    creditAudio = new Audio(CREDIT_SOUND_URL)
    creditAudio.preload = 'auto'
    creditAudio.volume = 0.6
  } catch {
    // ignore
  }
}

function playCreditSound() {
  try {
    preloadXpSounds()
    if (!creditAudio) return
    // A fresh copy so two quick rewards can overlap instead of cutting off.
    const a = creditAudio.cloneNode(true) as HTMLAudioElement
    a.volume = 0.6
    const p = a.play()
    // Browsers block sound before the first click on the page — that's fine.
    if (p && typeof p.catch === 'function') p.catch(() => undefined)
  } catch {
    // ignore
  }
}

let ctx: AudioContext | null = null
export function playXpSound(kind: 'tick' | 'coins' | 'level') {
  if (kind === 'coins') {
    playCreditSound()
    return
  }
  try {
    const Ctx: any = (window as any).AudioContext || (window as any).webkitAudioContext
    if (!Ctx) return
    if (!ctx) ctx = new Ctx()
    const c = ctx!
    const notes = kind === 'tick' ? [880] : [523, 659, 784, 1047]
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

// ---------------------------------------------------------------------------
// XP summary for the rest of the app (header pills, account menu). The XP
// layer publishes it whenever the numbers change; anything can ask the layer
// to open the XP panel.
// ---------------------------------------------------------------------------

export const XP_SUMMARY_EVENT = 'celoris:xp-summary'
export const XP_OPEN_EVENT = 'celoris:xp-open'

export interface XpSummary {
  balanceXp: number
  lifetimeXp: number
  level: number
  streakDays: number
  chestFull: boolean
}

let lastSummary: XpSummary | null = null

export function publishXpSummary(s: XpSummary | null) {
  lastSummary = s
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent<XpSummary | null>(XP_SUMMARY_EVENT, { detail: s }))
}

export function openXpPanel() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new CustomEvent(XP_OPEN_EVENT))
}

/** Latest XP numbers for the signed-in member (null until loaded / signed out). */
export function useXpSummary(): XpSummary | null {
  const [s, setS] = useState<XpSummary | null>(lastSummary)
  useEffect(() => {
    setS(lastSummary)
    const on = (e: Event) => setS((e as CustomEvent<XpSummary | null>).detail)
    window.addEventListener(XP_SUMMARY_EVENT, on)
    return () => window.removeEventListener(XP_SUMMARY_EVENT, on)
  }, [])
  return s
}
