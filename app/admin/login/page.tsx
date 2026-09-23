"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Eye, EyeOff, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  // Admin access now uses the account's real Celoris (Supabase) sign-in, and
  // the server checks users.role before any admin API call is allowed (see
  // proxy.ts). The old version compared against a password written into this
  // page's JavaScript, which anyone could read in their browser.
  const [signedInAdmin, setSignedInAdmin] = useState<string | null>(null)

  const confirmAdmin = async (): Promise<{ email: string } | null> => {
    const res = await fetch("/api/admin/whoami", { cache: "no-store" })
    if (!res.ok) return null
    return res.json()
  }

  const enterDashboard = (adminEmail: string) => {
    // The admin pages still read this flag for their own screens; the real
    // protection is on the server.
    localStorage.setItem("admin_session", JSON.stringify({ email: adminEmail, isAdmin: true, timestamp: Date.now() }))
    router.push("/admin/dashboard")
  }

  useEffect(() => {
    let cancelled = false
    confirmAdmin()
      .then((me) => { if (!cancelled && me) setSignedInAdmin(me.email) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
      if (signInError) {
        setError("Invalid credentials. Access denied.")
        return
      }
      const me = await confirmAdmin()
      if (!me) {
        setError("This account does not have admin access.")
        return
      }
      enterDashboard(me.email)
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Celoris Designs</h2>
          <p className="text-slate-300">
            Command Center Access - Authorized Personnel Only
          </p>
        </div>

        {/* Login Form */}
        <Card className="backdrop-blur-sm bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center space-x-2">
              <Lock className="h-5 w-5" />
              <span>Secure Admin Login</span>
            </CardTitle>
            <CardDescription className="text-slate-300">
              Sign in with your Celoris account (it must have admin access)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg text-sm flex items-center space-x-2">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}

            {signedInAdmin && (
              <Button
                type="button"
                onClick={() => enterDashboard(signedInAdmin)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3"
              >
                Continue as {signedInAdmin}
              </Button>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                  Administrator Email
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@celorisdesigns.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your Celoris account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-slate-400 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Authenticating...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>Access Command Center</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Security Notice */}
            <div className="bg-yellow-500/20 border border-yellow-500/50 rounded-lg p-4">
              <div className="flex items-center space-x-2 text-yellow-300">
                <Shield className="h-4 w-4" />
                <span className="text-sm font-medium">Security Notice</span>
              </div>
              <p className="text-xs text-yellow-200 mt-2">
                This is a restricted area. All activities are logged and monitored.
                Unauthorized access attempts will be reported.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-slate-400">
          <p>© 2026 Celoris Designs. All rights reserved.</p>
          <p>System ID: CD-ADMIN-2026</p>
        </div>
      </div>
    </div>
  )
}
