"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle,
  Smartphone,
  Loader2,
  Send,
  ShieldCheck,
} from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  // Phone OTP follows the admin setting (auth_settings via /api/auth/phone-settings):
  // WhatsApp OTP when "WhatsApp OTP" is on, SMS (Twilio) when that is on, otherwise
  // just a plain mobile number field. Previously this was hard-coded off, so turning
  // WhatsApp OTP on in admin never showed on this page.
  const [otpChannel, setOtpChannel] = useState<"whatsapp" | "sms" | null>(null)
  const requirePhoneOtp = otpChannel !== null
  const channelLabel = otpChannel === "whatsapp" ? "WhatsApp" : "SMS"
  const [phoneNumber, setPhoneNumber] = useState("")
  const [otpCode, setOtpCode] = useState("")
  const [isOtpSent, setIsOtpSent] = useState(false)
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false)
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [verifiedPhone, setVerifiedPhone] = useState("")
  const [phoneError, setPhoneError] = useState("")
  const [otpCountdown, setOtpCountdown] = useState(0)

  useEffect(() => {
    let cancelled = false
    fetch("/api/auth/phone-settings", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (cancelled) return
        if (d?.whatsappOtpEnabled) setOtpChannel("whatsapp")
        else if (d?.twilioOtpEnabled) setOtpChannel("sms")
        else setOtpChannel(null)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [])

  // Resend OTP countdown timer
  useEffect(() => {
    if (otpCountdown <= 0) return
    const timer = setInterval(() => setOtpCountdown((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [otpCountdown])

  const handleSendOtp = async () => {
    const digitsOnly = phoneNumber.replace(/\D/g, "")
    if (digitsOnly.length < 10) {
      setPhoneError("Please enter a valid 10-digit mobile number")
      return
    }
    setIsSendingOtp(true)
    setPhoneError("")
    try {
      const res = await fetch(otpChannel === "whatsapp" ? "/api/auth/whatsapp-otp/send" : "/api/auth/phone-otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: digitsOnly }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || `Failed to send ${channelLabel} OTP`)
      setIsOtpSent(true)
      setOtpCountdown(30)
    } catch (err: any) {
      setPhoneError(err.message || `Failed to send OTP via ${channelLabel}`)
    } finally {
      setIsSendingOtp(false)
    }
  }

  const handleVerifyOtp = async () => {
    const trimmedCode = otpCode.trim()
    if (trimmedCode.length !== 6) {
      setPhoneError(`Please enter the 6-digit OTP code received via ${channelLabel}`)
      return
    }
    setIsVerifyingOtp(true)
    setPhoneError("")
    try {
      const digitsOnly = phoneNumber.replace(/\D/g, "")
      const res = await fetch(otpChannel === "whatsapp" ? "/api/auth/whatsapp-otp/verify" : "/api/auth/phone-otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The WhatsApp route expects "otp", the SMS route "code".
        body: JSON.stringify(
          otpChannel === "whatsapp" ? { phone: digitsOnly, otp: trimmedCode } : { phone: digitsOnly, code: trimmedCode }
        ),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Invalid or expired OTP code")
      setVerifiedPhone(`+91 ${digitsOnly}`)
      setIsPhoneVerified(true)
      setPhoneError("")
    } catch (err: any) {
      setPhoneError(err.message || "Verification failed. Please check the code and try again.")
    } finally {
      setIsVerifyingOtp(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email address is required")
      return false
    }

    const phoneToUse = verifiedPhone || phoneNumber.trim()
    const digitsOnly = phoneToUse.replace(/\D/g, "")
    if (!phoneToUse || digitsOnly.length < 10) {
      setError("A valid 10-digit mobile number is required")
      return false
    }

    // Only enforce OTP if requirePhoneOtp is toggled ON
    if (requirePhoneOtp && (!isPhoneVerified || !verifiedPhone)) {
      setError(`Please verify your 10-digit mobile number with ${channelLabel} OTP before creating your account`)
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

    const phoneToUse = verifiedPhone || phoneNumber.trim()
    const digitsOnly = phoneToUse.replace(/\D/g, "")
    let formattedPhone = phoneToUse
    if (digitsOnly.length === 10) {
      formattedPhone = `+91 ${digitsOnly}`
    } else if (digitsOnly.length === 12 && digitsOnly.startsWith("91")) {
      formattedPhone = `+91 ${digitsOnly.slice(2)}`
    }

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            phone: formattedPhone,
            phone_verified: isPhoneVerified || !requirePhoneOtp,
          },
        },
      })

      if (error) {
        setError(error.message)
      } else if (data.user) {
        // Immediate sync to public.users and public.profiles tables
        try {
          await (supabase as any).from("users").upsert(
            {
              id: data.user.id,
              full_name: formData.fullName,
              phone: formattedPhone,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          )

          await (supabase as any).from("profiles").upsert(
            {
              id: data.user.id,
              full_name: formData.fullName,
              email: formData.email,
              contact: formattedPhone,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "id" }
          )
        } catch (syncErr) {
          console.warn("Initial profile sync error:", syncErr)
        }

        if (!data.session) {
          // Email confirmation required
          setSuccess(true)
        } else {
          // Direct login successful - check for redirect param or go to home
          const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null
          const next = params?.get("next") || params?.get("redirect") || "/"
          window.location.href = next
        }
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getCallbackUrl = () => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const next = params.get("next") || params.get("redirect")
      if (next) {
        return `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`
      }
      return `${window.location.origin}/auth/callback`
    }
    return ""
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getCallbackUrl(),
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred")
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
        provider: "linkedin_oidc",
        options: {
          redirectTo: getCallbackUrl(),
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFacebookLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "facebook",
        options: {
          redirectTo: getCallbackUrl(),
        },
      })

      if (error) {
        setError(error.message)
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
        <div className="max-w-md w-full relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
          <Card className="bg-[#090a0f]/95 backdrop-blur-2xl border border-white/10 shadow-2xl relative z-10 rounded-[2.5rem] p-4">
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
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
      <div className="max-w-md w-full space-y-8 relative py-6">
        {/* Background Decorative Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/[0.04] rounded-full blur-[140px] pointer-events-none" />

        {/* Header */}
        <div className="text-center relative z-10">
          <Link href="/" className="inline-flex items-center justify-center space-x-2 mb-6">
            <img
              src="/celoris-logo.png"
              alt="Celoris Logo"
              className="h-10 sm:h-12 w-auto object-contain"
            />
          </Link>
          <h2 className="text-3xl sm:text-4xl font-black text-white italic uppercase tracking-tight mb-2">Create Account</h2>
          <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] italic">
            Join thousands of professionals & creators on Celoris 3.0
          </p>
        </div>

        {/* Registration Card */}
        <Card className="bg-[#090a0f]/95 backdrop-blur-2xl border border-white/10 shadow-2xl relative z-10 rounded-[2.5rem] p-4 sm:p-6">
          <CardHeader className="text-center pb-3 pt-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-wider mx-auto mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Fast &amp; Verified Access</span>
            </div>
            <CardTitle className="text-xl font-bold text-white italic uppercase">Sign Up</CardTitle>
            <CardDescription className="text-slate-400 text-xs italic">
              Choose 1-click social sign-up or register with email
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 pt-2">
            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-4 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest text-center">
                {error}
              </div>
            )}

            {/* PRIMARY HIGH-TRUST ONBOARDING: SOCIAL AUTH (AT THE TOP) */}
            <div className="space-y-3">
              {/* Google 1-Click Primary Action */}
              <GoogleSignInButton text="signup_with" onError={setError} onBusyChange={setIsLoading}>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                  className="w-full group bg-white hover:bg-slate-100 text-slate-900 font-black rounded-2xl h-14 px-4 sm:px-5 flex items-center justify-between shadow-xl shadow-white/5 transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] border border-white/20 disabled:opacity-50 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 shadow-sm border border-slate-200">
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
                    </div>
                    <div className="text-left">
                      <div className="text-xs uppercase tracking-wider font-extrabold text-slate-900 leading-tight">
                        Continue with Google
                      </div>
                      <div className="text-[10px] text-slate-500 font-semibold tracking-normal normal-case">
                        1-Click Instant • Verified ID
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span className="hidden sm:inline">Recommended</span>
                    <span className="sm:hidden">Fast</span>
                  </div>
                </button>
              </GoogleSignInButton>

              {/* LinkedIn & Facebook Secondary Options */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={handleLinkedInLogin}
                  disabled={isLoading}
                  className="h-11 px-3 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="#0A66C2">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  <span className="truncate">LinkedIn</span>
                </button>

                <button
                  type="button"
                  onClick={handleFacebookLogin}
                  disabled={isLoading}
                  className="h-11 px-3 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-slate-200 hover:text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span className="truncate">Facebook</span>
                </button>
              </div>
            </div>

            {/* Elegant Divider */}
            <div className="relative py-1">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[9px] font-bold uppercase tracking-[0.25em]">
                <span className="bg-[#090a0f] px-4 text-slate-400">Or register with email</span>
              </div>
            </div>

            {/* MANUAL REGISTRATION FORM */}
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="fullName" className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-4">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="pl-12 bg-white/[0.04] border-white/10 rounded-2xl h-12 text-white placeholder:text-slate-600 focus:border-emerald-500/50 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="email" className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-4">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="pl-12 bg-white/[0.04] border-white/10 rounded-2xl h-12 text-white placeholder:text-slate-600 focus:border-emerald-500/50 transition-all font-medium"
                    required
                  />
                </div>
              </div>

              {/* Mobile Number Section */}
              {requirePhoneOtp ? (
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-4 flex items-center justify-between pr-4">
                    <span>Mobile Number</span>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">{channelLabel} OTP Verification *</span>
                  </label>

                  {isPhoneVerified ? (
                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                          <CheckCircle className="h-4 w-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                            <Smartphone className="h-3 w-3" /> Phone Verified
                          </p>
                          <p className="text-xs font-mono font-bold text-white tracking-wide">
                            {verifiedPhone}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setIsPhoneVerified(false)
                          setVerifiedPhone("")
                          setIsOtpSent(false)
                          setOtpCode("")
                        }}
                        className="text-[10px] font-bold text-slate-400 hover:text-white uppercase tracking-wider underline transition-colors cursor-pointer"
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 flex flex-col space-y-3">
                      {/* Phone number input row */}
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-emerald-400">
                            +91
                          </span>
                          <Input
                            type="tel"
                            placeholder="9876543210"
                            disabled={isOtpSent}
                            value={phoneNumber}
                            onChange={(e) => {
                              setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                              setPhoneError("")
                            }}
                            className="bg-black/60 border-white/10 text-white placeholder:text-slate-600 rounded-xl h-12 pl-12 text-sm font-mono tracking-wider focus:border-emerald-500 disabled:opacity-60"
                          />
                        </div>

                        {!isOtpSent ? (
                          <Button
                            type="button"
                            onClick={handleSendOtp}
                            disabled={isSendingOtp || phoneNumber.length < 10}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl h-12 px-5 shrink-0 shadow-lg shadow-emerald-500/20 disabled:opacity-40 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                          >
                            {isSendingOtp ? (
                              <span className="flex items-center gap-1.5">
                                <Loader2 className="h-4 w-4 animate-spin" /> Sending
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5">
                                <Send className="h-3.5 w-3.5" /> Send OTP
                              </span>
                            )}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                              setIsOtpSent(false)
                              setOtpCode("")
                            }}
                            className="border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 text-xs rounded-xl h-12 px-3 shrink-0"
                          >
                            Edit No.
                          </Button>
                        )}
                      </div>

                      {/* OTP verification input section (appears after sending OTP) */}
                      {isOtpSent && (
                        <div className="space-y-3 pt-2 border-t border-white/10">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 bg-black/40 p-2.5 rounded-xl border border-white/5">
                            <span>OTP sent via {channelLabel} to <strong className="text-white font-mono">+91 {phoneNumber}</strong></span>
                            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">{otpChannel === "whatsapp" ? "From Celoris" : "SMS"}</span>
                          </div>

                          <div className="flex gap-2">
                            <Input
                              type="text"
                              placeholder="••••••"
                              maxLength={6}
                              value={otpCode}
                              onChange={(e) => {
                                setOtpCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                                setPhoneError("")
                              }}
                              className="bg-black/60 border-white/10 text-white text-center tracking-[0.4em] font-mono font-bold placeholder:text-slate-600 rounded-xl h-12 text-base focus:border-emerald-500"
                              autoFocus
                            />
                            <Button
                              type="button"
                              onClick={handleVerifyOtp}
                              disabled={isVerifyingOtp || otpCode.length !== 6}
                              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl h-12 px-6 shrink-0 shadow-lg shadow-emerald-500/20 disabled:opacity-40 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                            >
                              {isVerifyingOtp ? (
                                <span className="flex items-center gap-1.5">
                                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying
                                </span>
                              ) : (
                                "Verify OTP"
                              )}
                            </Button>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                            <span>Valid for {otpChannel === "whatsapp" ? "5" : "10"} minutes</span>
                            {otpCountdown > 0 ? (
                              <span className="text-slate-400 font-mono">Resend in {otpCountdown}s</span>
                            ) : (
                              <button
                                type="button"
                                onClick={handleSendOtp}
                                disabled={isSendingOtp}
                                className="text-emerald-400 hover:text-emerald-300 underline font-bold cursor-pointer"
                              >
                                Resend OTP
                              </button>
                            )}
                          </div>
                        </div>
                      )}

                      {phoneError && (
                        <p className="text-xs font-semibold text-rose-400 normal-case text-center pt-1 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl leading-relaxed">
                          {phoneError}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-1.5">
                  <label htmlFor="phoneNumber" className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-4 flex items-center justify-between pr-4">
                    <span>Mobile Number</span>
                    <span className="text-[9px] text-emerald-400 font-bold uppercase tracking-wider">Required for batch updates</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-emerald-400">
                      +91
                    </span>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      placeholder="9876543210"
                      value={phoneNumber}
                      onChange={(e) => {
                        setPhoneNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
                        setError("")
                      }}
                      className="pl-14 bg-white/[0.04] border-white/10 rounded-2xl h-12 text-white placeholder:text-slate-600 focus:border-emerald-500/50 transition-all font-mono tracking-wider font-medium"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 ml-4">
                    Live batch invites, mentor links &amp; certification will be sent here.
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <label htmlFor="password" className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-4">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className="pl-12 pr-12 bg-white/[0.04] border-white/10 rounded-2xl h-12 text-white placeholder:text-slate-600 focus:border-emerald-500/50 transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="confirmPassword" className="block text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-4">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-12 pr-12 bg-white/[0.04] border-white/10 rounded-2xl h-12 text-white placeholder:text-slate-600 focus:border-emerald-500/50 transition-all font-medium"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center px-2 pt-1">
                <input
                  type="checkbox"
                  id="terms"
                  className="rounded-md border-white/10 bg-white/5 text-emerald-500 focus:ring-emerald-500/20"
                  required
                />
                <label htmlFor="terms" className="ml-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                  I agree to the{" "}
                  <Link href="/terms" className="text-emerald-400 hover:text-emerald-300 underline">Terms</Link> &amp; <Link href="/privacy" className="text-emerald-400 hover:text-emerald-300 underline">Privacy</Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl shadow-emerald-500/20 border-none transition-all hover:scale-[1.01] cursor-pointer"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" /> Creating account...
                  </span>
                ) : (
                  "Create Account with Email"
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center pt-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Already have an account? </span>
              <Link href="/login" className="text-[10px] font-black text-emerald-400 hover:text-emerald-300 uppercase tracking-widest ml-1 transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Benefits Card */}
        <div className="bg-[#090a0f]/60 backdrop-blur-xl rounded-[2rem] p-6 border border-white/10 relative z-10">
          <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-4 italic">Why join Celoris 3.0?</h3>
          <ul className="space-y-3 text-[10px] font-bold text-slate-400 uppercase tracking-tight">
            <li className="flex items-center space-x-3 group">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center p-1 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                <CheckCircle className="w-full h-full text-emerald-400" />
              </div>
              <span className="group-hover:text-slate-200 transition-colors">Access to 500+ expert-led courses &amp; masterclasses</span>
            </li>
            <li className="flex items-center space-x-3 group">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center p-1 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                <CheckCircle className="w-full h-full text-emerald-400" />
              </div>
              <span className="group-hover:text-slate-200 transition-colors">Direct mentor batch placement &amp; client contracts</span>
            </li>
            <li className="flex items-center space-x-3 group">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center p-1 border border-emerald-500/20 group-hover:bg-emerald-500/20 transition-all">
                <CheckCircle className="w-full h-full text-emerald-400" />
              </div>
              <span className="group-hover:text-slate-200 transition-colors">Verified certification &amp; fast payout wallet</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
