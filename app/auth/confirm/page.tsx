"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"

// Finishes sign-in links whose tokens arrive after "#" in the URL (only the
// browser can see that part), then continues to where the user was going.
export default function AuthConfirmPage() {
  const [message, setMessage] = useState("Signing you in…")

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const rawNext = params.get("next") || "/"
    const next = rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/"
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""))
    const access_token = hash.get("access_token")
    const refresh_token = hash.get("refresh_token")
    const hashError = hash.get("error_description")

    if (!access_token || !refresh_token) {
      setMessage(hashError ? `Sign-in failed: ${hashError}` : "This sign-in link is invalid or has expired. Please request a new one.")
      return
    }
    createClient()
      .auth.setSession({ access_token, refresh_token })
      .then(({ error }: { error: { message: string } | null }) => {
        if (error) setMessage(`Sign-in failed: ${error.message}`)
        else window.location.replace(next)
      })
  }, [])

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-slate-300">{message}</p>
      {!message.startsWith("Signing") && (
        <a href="/login" className="text-emerald-400 underline">Back to sign in</a>
      )}
    </div>
  )
}
