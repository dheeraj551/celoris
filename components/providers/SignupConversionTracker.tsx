"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { trackClarityEvent } from "@/lib/clarity"

// Google Ads account tag (also configured in AnalyticsProvider).
export const GOOGLE_ADS_ID = "AW-16840012440"
// Conversion label for the "Trainer sign-up" conversion action. Set it in Vercel
// as NEXT_PUBLIC_GADS_SIGNUP_LABEL (the part after the "/" in send_to).
const SIGNUP_LABEL = process.env.NEXT_PUBLIC_GADS_SIGNUP_LABEL || ""

const INTENT_KEY = "celoris_signup_intent"
const TRACKED_PREFIX = "celoris_signup_tracked_"
// An account counts as "new" if its first sign-in is within this window of
// creation (covers email-confirmation links opened later the same day).
const NEW_ACCOUNT_WINDOW_MS = 24 * 60 * 60 * 1000
const INTENT_TTL_MS = 7 * 24 * 60 * 60 * 1000

function readIntent(): string {
  try {
    const raw = localStorage.getItem(INTENT_KEY)
    if (!raw) return "student"
    const { value, at } = JSON.parse(raw)
    if (typeof value === "string" && Date.now() - Number(at) < INTENT_TTL_MS) return value
  } catch {}
  return "student"
}

function fireSignup(userId: string, createdAt: string | undefined, provider: string | undefined) {
  if (!userId || !createdAt) return
  const age = Date.now() - new Date(createdAt).getTime()
  if (!(age >= 0 && age < NEW_ACCOUNT_WINDOW_MS)) return

  try {
    if (localStorage.getItem(TRACKED_PREFIX + userId)) return
    localStorage.setItem(TRACKED_PREFIX + userId, String(Date.now()))
  } catch {
    // Without storage we can't de-duplicate; skip rather than over-count.
    return
  }

  const intent = readIntent()
  trackClarityEvent(intent === "trainer" ? "trainer_sign_up" : "sign_up")

  // gtag loads "afterInteractive", so right after an OAuth redirect it may not
  // exist yet. Wait for it (up to ~15s) instead of losing the conversion.
  let tries = 0
  const send = () => {
    const gtag = window.gtag
    if (typeof gtag !== "function") {
      if (++tries < 30) setTimeout(send, 500)
      return
    }
    // GA4 recommended event — mark "sign_up" as a key event in GA4.
    gtag("event", "sign_up", { method: provider || "email", signup_intent: intent })
    // Google Ads conversion (only once the label is configured).
    if (SIGNUP_LABEL) {
      gtag("event", "conversion", { send_to: `${GOOGLE_ADS_ID}/${SIGNUP_LABEL}` })
    }
  }
  send()
}

/**
 * Fires one sign-up event per new account (Google, LinkedIn, Facebook or email),
 * tagged "trainer" when the visitor came through /become-trainer.
 */
export function SignupConversionTracker() {
  const pathname = usePathname()

  // Remember that this visitor showed trainer intent.
  useEffect(() => {
    if (pathname?.startsWith("/become-trainer")) {
      try {
        localStorage.setItem(INTENT_KEY, JSON.stringify({ value: "trainer", at: Date.now() }))
      } catch {}
    }
  }, [pathname])

  useEffect(() => {
    const supabase = createClient()
    let cancelled = false

    supabase.auth.getSession().then(({ data }) => {
      const u = data?.session?.user
      if (!cancelled && u) fireSignup(u.id, u.created_at, u.app_metadata?.provider)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      const u = session?.user
      if (event === "SIGNED_IN" && u) fireSignup(u.id, u.created_at, u.app_metadata?.provider)
    })

    return () => {
      cancelled = true
      sub?.subscription?.unsubscribe()
    }
  }, [])

  return null
}
