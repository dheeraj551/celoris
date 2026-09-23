"use client"

import { useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"

// Sends anyone whose real sign-in isn't an admin account back to the admin
// login. The admin APIs are enforced on the server (proxy.ts); this just
// keeps the screens from showing empty/error states to a signed-out visitor.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin/login")) return
    let cancelled = false
    fetch("/api/admin/whoami", { cache: "no-store" })
      .then((res) => {
        if (cancelled) return
        if (res.status === 401 || res.status === 403) {
          try { localStorage.removeItem("admin_session") } catch {}
          router.replace("/admin/login")
        }
      })
      .catch(() => {})
    return () => { cancelled = true }
  }, [pathname, router])

  return <>{children}</>
}
