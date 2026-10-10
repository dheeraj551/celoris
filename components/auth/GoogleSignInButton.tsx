"use client"

import { useEffect, useRef, useState, type ReactNode } from "react"
import { createClient } from "@/lib/supabase-client"

// "Sign in with Google" via Google Identity Services (GIS) + Supabase signInWithIdToken.
// Google's popup / One Tap then says "to continue to celorisdesigns.com" instead of
// showing the Supabase project URL, because no redirect through supabase.co happens.
// If Google's script can't load (blocked, offline, no client ID), the `children`
// passed in (the old redirect-based button) is shown instead, so sign-in never breaks.

// Public OAuth client ID (safe to ship to the browser). NEXT_PUBLIC_GOOGLE_CLIENT_ID overrides it.
const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "182355730791-584imp32ut9efk83rbjrnm23ig7315k7.apps.googleusercontent.com"

const GIS_SRC = "https://accounts.google.com/gsi/client"
const LOAD_TIMEOUT_MS = 6000

declare global {
  interface Window {
    google?: any
  }
}

let gisPromise: Promise<void> | null = null
function loadGis(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("no window"))
  if (window.google?.accounts?.id) return Promise.resolve()
  if (gisPromise) return gisPromise
  gisPromise = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${GIS_SRC}"]`)
    const script = existing || document.createElement("script")
    const timer = setTimeout(() => reject(new Error("Google sign-in timed out")), LOAD_TIMEOUT_MS)
    script.addEventListener("load", () => {
      clearTimeout(timer)
      window.google?.accounts?.id ? resolve() : reject(new Error("Google sign-in unavailable"))
    })
    script.addEventListener("error", () => {
      clearTimeout(timer)
      reject(new Error("Google sign-in failed to load"))
    })
    if (!existing) {
      script.src = GIS_SRC
      script.async = true
      script.defer = true
      document.head.appendChild(script)
    }
  }).catch((e) => {
    gisPromise = null // allow a retry on the next mount
    throw e
  })
  return gisPromise
}

async function makeNonce(): Promise<{ raw: string; hashed: string }> {
  const bytes = crypto.getRandomValues(new Uint8Array(32))
  const raw = btoa(Array.from(bytes, (b) => String.fromCharCode(b)).join(""))
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(raw))
  const hashed = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
  return { raw, hashed }
}

function safeNextPath(): string {
  try {
    const params = new URLSearchParams(window.location.search)
    const next = params.get("next") || params.get("redirect") || "/"
    return next.startsWith("/") && !next.startsWith("//") ? next : "/"
  } catch {
    return "/"
  }
}

interface GoogleSignInButtonProps {
  /** Wording on Google's button. */
  text?: "continue_with" | "signup_with" | "signin_with"
  /** Also show Google's One Tap prompt in the corner. */
  oneTap?: boolean
  /** Shown while loading and as the fallback when Google's script can't load. */
  children: ReactNode
  onError?: (message: string) => void
  onBusyChange?: (busy: boolean) => void
}

export function GoogleSignInButton({
  text = "continue_with",
  oneTap = true,
  children,
  onError,
  onBusyChange,
}: GoogleSignInButtonProps) {
  const holderRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<"loading" | "gis" | "fallback">("loading")
  const [busy, setBusy] = useState(false)
  // Keep the latest callbacks without re-running the setup effect.
  const errorRef = useRef(onError)
  const busyRef = useRef(onBusyChange)
  errorRef.current = onError
  busyRef.current = onBusyChange

  useEffect(() => {
    let cancelled = false

    ;(async () => {
      if (!GOOGLE_CLIENT_ID) {
        setMode("fallback")
        return
      }
      try {
        await loadGis()
        const { raw, hashed } = await makeNonce()
        if (cancelled) return

        window.google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          nonce: hashed,
          ux_mode: "popup",
          auto_select: false,
          cancel_on_tap_outside: true,
          itp_support: true,
          use_fedcm_for_prompt: true,
          context: text === "signup_with" ? "signup" : "signin",
          callback: async (response: { credential?: string }) => {
            if (!response?.credential) return
            setBusy(true)
            busyRef.current?.(true)
            try {
              const supabase = createClient()
              const { error } = await supabase.auth.signInWithIdToken({
                provider: "google",
                token: response.credential,
                nonce: raw,
              })
              if (error) throw error
              // Give the sign-up conversion (SignupConversionTracker) a moment to send.
              await new Promise((r) => setTimeout(r, 900))
              window.location.href = safeNextPath()
            } catch (e: any) {
              setBusy(false)
              busyRef.current?.(false)
              errorRef.current?.(e?.message || "Google sign-in failed. Please try again.")
            }
          },
        })

        const holder = holderRef.current
        if (holder) {
          holder.innerHTML = ""
          const box = holder.parentElement?.getBoundingClientRect().width || 320
          const width = Math.min(400, Math.max(200, Math.floor(box)))
          window.google.accounts.id.renderButton(holder, {
            type: "standard",
            theme: "filled_black",
            size: "large",
            shape: "pill",
            text,
            logo_alignment: "left",
            width,
          })
        }
        setMode("gis")
        if (oneTap) window.google.accounts.id.prompt()
      } catch {
        if (!cancelled) setMode("fallback")
      }
    })()

    return () => {
      cancelled = true
      try {
        window.google?.accounts?.id?.cancel()
      } catch {}
    }
  }, [text, oneTap])

  if (mode === "fallback") return <>{children}</>

  return (
    <div className="w-full">
      {/* Google renders its own official button into this box. */}
      <div
        ref={holderRef}
        className={`w-full flex justify-center min-h-[44px] ${mode === "loading" || busy ? "hidden" : ""}`}
      />
      {mode === "loading" && <div className="opacity-60 pointer-events-none">{children}</div>}
      {busy && (
        <div className="w-full h-11 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-xs font-bold text-slate-200">
          Signing you in…
        </div>
      )}
    </div>
  )
}
