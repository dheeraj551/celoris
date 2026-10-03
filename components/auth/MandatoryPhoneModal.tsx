"use client"

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import { Smartphone, ShieldCheck, ArrowRight, Loader2, AlertCircle } from 'lucide-react'
import confetti from 'canvas-confetti'

export function MandatoryPhoneModal() {
  const { user, profile, loading, refreshProfile } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    // Only check if auth is finished loading and a valid user is present
    if (loading || !user) {
      setIsOpen(false)
      return
    }

    // Check if phone or contact exists in profile
    const hasPhone = Boolean(
      (profile?.phone && profile.phone.trim().length >= 10) ||
      (profile?.contact && profile.contact.trim().length >= 10) ||
      (user.user_metadata?.phone && user.user_metadata.phone.trim().length >= 10)
    )

    if (!hasPhone) {
      // Small delay so page transition completes smoothly before showing modal
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setIsOpen(false)
    }
  }, [user, profile, loading])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const digitsOnly = phoneNumber.replace(/\D/g, '')
    if (!phoneNumber.trim() || digitsOnly.length < 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/user/phone', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber.trim() }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update phone number')
      }

      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      })

      if (refreshProfile) {
        await refreshProfile()
      }

      setIsOpen(false)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="relative w-full max-w-md bg-[#0d1424] border border-white/10 rounded-[2rem] p-6 sm:p-8 shadow-2xl text-slate-200">
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Icon & Badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Smartphone className="w-7 h-7 text-white" />
          </div>
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 text-xs font-bold font-mono uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            Mandatory Requirement
          </span>
        </div>

        {/* Headings */}
        <div className="space-y-2 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Complete Your Celoris Profile
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            A verified WhatsApp mobile number is mandatory for all Celoris members to receive live classroom links, mentor batch invites, and Job Center alerts.
          </p>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              WhatsApp Mobile Number
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-xs font-bold text-slate-400 font-mono select-none">
                🇮🇳 +91
              </span>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="98765 43210"
                className="w-full h-12 bg-white/5 border border-white/10 focus:border-emerald-400 focus:bg-white/10 rounded-xl pl-18 pr-4 text-white text-sm font-medium tracking-wider outline-none transition-all placeholder:text-slate-600"
                autoFocus
                required
              />
            </div>
            <p className="text-[11px] text-slate-500">
              We never share your number with third parties. Used strictly for your Celoris training & academy access.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-xs uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving Profile...
              </>
            ) : (
              <>
                Save & Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
