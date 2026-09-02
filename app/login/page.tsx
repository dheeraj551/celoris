"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        setError(error.message)
      } else {
        // Redirect to new home/dashboard
        window.location.href = "/"
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLinkedInLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        }
      })

      if (error) {
        setError(error.message)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        setError(error.message)
      } else {
        setError("")
        alert("Check your email for the login link!")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
      <div className="max-w-md w-full space-y-8 relative">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <div className="text-center relative z-10">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
            <img
              src="/celoris-logo.png"
              alt="Celoris Logo"
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tight mb-3">Welcome back</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">
            Sign in to your account to continue your journey
          </p>
        </div>

        {/* Login Form */}
        <Card className="bg-[#0d1321]/60 backdrop-blur-2xl border-white/5 shadow-2xl relative z-10 rounded-[2.5rem] p-4">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-bold text-white italic uppercase">Sign In</CardTitle>
            <CardDescription className="text-slate-500 text-xs italic">
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-4">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-12 bg-white/5 border-white/5 rounded-2xl h-12 text-white placeholder:text-slate-700 focus:border-emerald-500/50 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-4">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-12 pr-12 bg-white/5 border-white/5 rounded-2xl h-12 text-white placeholder:text-slate-700 focus:border-emerald-500/50 transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between px-2">
                <label className="flex items-center cursor-pointer group">
                  <input type="checkbox" className="rounded-md border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500/20" />
                  <span className="ml-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest group-hover:text-slate-300 transition-colors">Remember me</span>
                </label>
                <Link href="/forgot-password" title="Recover Password" className="text-[10px] font-bold text-emerald-500 hover:text-emerald-400 uppercase tracking-widest transition-colors">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-emerald-500/20 border-none transition-all hover:scale-[1.02]" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/5" />
              </div>
              <div className="relative flex justify-center text-[8px] font-bold uppercase tracking-[0.3em]">
                <span className="bg-[#0d1321] px-4 text-slate-600">Or</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-1 gap-4">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 flex items-center justify-center gap-3 bg-white/5 border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all shadow-none"
                onClick={handleGoogleLogin}
                disabled={isLoading}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 flex items-center justify-center gap-3 bg-white/5 border-white/10 rounded-2xl text-[11px] font-bold uppercase tracking-widest text-slate-300 hover:bg-white/10 hover:text-white transition-all shadow-none"
                onClick={handleLinkedInLogin}
                disabled={isLoading}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#0A66C2">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Continue with LinkedIn
              </Button>
            </div>

            {/* Magic Link */}
            <form onSubmit={handleMagicLink}>
              <Button
                type="submit"
                variant="ghost"
                className="w-full h-10 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/5 transition-all"
                disabled={isLoading || !email}
              >
                Sign in with Magic Link
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Don't have an account? </span>
              <Link href="/register" className="text-[10px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest ml-1 transition-colors">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center relative z-10">
          <p className="text-[8px] font-bold text-slate-600 uppercase tracking-[0.3em] leading-relaxed">
            By signing in, you agree to our <br />
            <Link href="/terms" className="text-slate-500 hover:text-white underline transition-colors">Terms of Service</Link> and <Link href="/privacy" className="text-slate-500 hover:text-white underline transition-colors">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
