"use client"

import { useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Lock, User, Eye, EyeOff, CheckCircle } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
          }
        }
      })

      if (error) {
        setError(error.message)
      } else if (data.user && !data.session) {
        // Email confirmation required
        setSuccess(true)
      } else {
        // Direct login successful - redirect to home
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

  if (success) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
        <div className="max-w-md w-full relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />
          <Card className="bg-[#0d1321]/60 backdrop-blur-2xl border-white/5 shadow-2xl relative z-10 rounded-[2.5rem] p-4">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                <CheckCircle className="w-10 h-10 text-emerald-500" />
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tight">Check your email</h2>
                <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">
                  Confirmation link sent to <span className="text-white brightness-125 underline">{formData.email}</span>
                </p>
              </div>
              <p className="text-slate-500 text-xs italic leading-relaxed">
                Click the link in your email to activate your account and start your journey with Celoris 3.0.
              </p>
              <Button asChild className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-emerald-500/20 border-none transition-all hover:scale-[1.02]">
                <Link href="/login">
                  Back to Sign In
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050810] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
      <div className="max-w-md w-full space-y-8 relative py-8">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

        {/* Header */}
        <div className="text-center relative z-10">
          <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
            <img
              src="/celoris-logo.png"
              alt="Celoris Logo"
              className="h-10 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tight mb-3">Create Account</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">
            Join thousands of professionals on Celoris 3.0
          </p>
        </div>

        {/* Registration Form */}
        <Card className="bg-[#0d1321]/60 backdrop-blur-2xl border-white/5 shadow-2xl relative z-10 rounded-[2.5rem] p-4">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-xl font-bold text-white italic uppercase">Sign Up</CardTitle>
            <CardDescription className="text-slate-500 text-xs italic">
              Fill in your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-4">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                {error}
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="fullName" className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-4">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-12 bg-white/5 border-white/5 rounded-2xl h-12 text-white placeholder:text-slate-700 focus:border-emerald-500/50 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-4">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
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
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
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

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-4">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-600" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-12 pr-12 bg-white/5 border-white/5 rounded-2xl h-12 text-white placeholder:text-slate-700 focus:border-emerald-500/50 transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center px-2">
                <input
                  type="checkbox"
                  id="terms"
                  className="rounded-md border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500/20"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                  I agree to the{" "}
                  <Link href="/terms" className="text-emerald-500 hover:text-emerald-400">Terms</Link> & <Link href="/privacy" className="text-emerald-500 hover:text-emerald-400">Privacy</Link>
                </label>
              </div>

              <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-emerald-500/20 border-none transition-all hover:scale-[1.02]" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
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
            </div>

            {/* Sign In Link */}
            <div className="text-center pt-2">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Already have an account? </span>
              <Link href="/login" className="text-[10px] font-black text-emerald-500 hover:text-emerald-400 uppercase tracking-widest ml-1 transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Benefits */}
        <div className="bg-[#0d1321]/40 backdrop-blur-xl rounded-[2rem] p-6 border border-white/5 relative z-10">
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 italic">Why join Celoris 3.0?</h3>
          <ul className="space-y-3 text-[10px] font-bold text-slate-500 uppercase tracking-tight">
            <li className="flex items-center space-x-3 group">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center p-1 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                <CheckCircle className="w-full h-full text-emerald-500" />
              </div>
              <span className="group-hover:text-slate-300 transition-colors">Access to 500+ expert-led courses</span>
            </li>
            <li className="flex items-center space-x-3 group">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center p-1 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                <CheckCircle className="w-full h-full text-emerald-500" />
              </div>
              <span className="group-hover:text-slate-300 transition-colors">Exclusive AI job opportunities</span>
            </li>
            <li className="flex items-center space-x-3 group">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center p-1 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                <CheckCircle className="w-full h-full text-emerald-500" />
              </div>
              <span className="group-hover:text-slate-300 transition-colors">Engaging social matches and community</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}