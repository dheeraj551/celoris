"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Landmark,
  Smartphone,
  Save,
  ArrowLeft,
  Receipt,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react"
import { useAuth } from "@/components/providers/AuthProvider"
import { motion, AnimatePresence } from "framer-motion"
import { PageWrapper } from "@/components/PageWrapper"

// Standard IFSC format: 4 letters (bank code) + 0 + 6 alphanumeric (branch code).
const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/
// Standard 15-character GSTIN format: 2-digit state code, 10-char PAN,
// 1-digit entity code, "Z", 1 checksum character.
const GST_PATTERN = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
const UPI_PATTERN = /^[\w.+-]{2,256}@[A-Za-z]{2,64}$/

function maskAccountNumber(value: string) {
  if (!value) return ""
  if (value.length <= 4) return value
  return `${"•".repeat(value.length - 4)}${value.slice(-4)}`
}

export default function PaymentSettingsPage() {
  const { user, loading: authLoading } = useAuth()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [hasSavedAccountNumber, setHasSavedAccountNumber] = useState(false)
  const [revealAccountNumber, setRevealAccountNumber] = useState(false)
  const router = useRouter()

  const [formData, setFormData] = useState({
    payment_method: "upi" as "upi" | "bank",
    upi_id: "",
    bank_account_holder_name: "",
    bank_account_number: "",
    bank_account_number_confirm: "",
    bank_ifsc_code: "",
    gst_number: "",
  })

  useEffect(() => {
    if (user) loadSettings()
  }, [user])

  const loadSettings = async () => {
    if (!user) return
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("payment_settings")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle()

      if (error) throw error

      if (data) {
        const row = data as any
        setFormData((prev) => ({
          ...prev,
          payment_method: row.payment_method || "upi",
          upi_id: row.upi_id || "",
          bank_account_holder_name: row.bank_account_holder_name || "",
          bank_account_number: row.bank_account_number || "",
          bank_account_number_confirm: row.bank_account_number || "",
          bank_ifsc_code: row.bank_ifsc_code || "",
          gst_number: row.gst_number || "",
        }))
        setHasSavedAccountNumber(!!row.bank_account_number)
      }
    } catch (error) {
      console.error("Error loading payment settings:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: "" }))
  }

  const validate = () => {
    const next: Record<string, string> = {}

    if (formData.payment_method === "upi") {
      if (!formData.upi_id.trim()) {
        next.upi_id = "UPI ID is required."
      } else if (!UPI_PATTERN.test(formData.upi_id.trim())) {
        next.upi_id = "Doesn't look like a valid UPI ID (e.g. name@bank)."
      }
    } else {
      if (!formData.bank_account_holder_name.trim()) {
        next.bank_account_holder_name = "Account holder name is required."
      }
      if (!formData.bank_account_number.trim()) {
        next.bank_account_number = "Account number is required."
      } else if (!/^\d{9,18}$/.test(formData.bank_account_number.trim())) {
        next.bank_account_number = "Account numbers are 9–18 digits, numbers only."
      }
      if (formData.bank_account_number !== formData.bank_account_number_confirm) {
        next.bank_account_number_confirm = "Doesn't match the account number above."
      }
      if (!formData.bank_ifsc_code.trim()) {
        next.bank_ifsc_code = "IFSC code is required."
      } else if (!IFSC_PATTERN.test(formData.bank_ifsc_code.trim().toUpperCase())) {
        next.bank_ifsc_code = "Doesn't look like a valid IFSC code (e.g. HDFC0001234)."
      }
    }

    if (formData.gst_number.trim() && !GST_PATTERN.test(formData.gst_number.trim().toUpperCase())) {
      next.gst_number = "Doesn't look like a valid 15-character GSTIN."
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSave = async () => {
    if (!user) return
    setMessage({ type: "", text: "" })
    if (!validate()) {
      setMessage({ type: "error", text: "Please fix the highlighted fields before saving." })
      return
    }

    setSaving(true)
    try {
      const supabase = createClient()
      const payload: Record<string, any> = {
        user_id: user.id,
        payment_method: formData.payment_method,
        gst_number: formData.gst_number.trim().toUpperCase() || null,
        updated_at: new Date().toISOString(),
      }

      if (formData.payment_method === "upi") {
        payload.upi_id = formData.upi_id.trim()
        payload.bank_account_holder_name = null
        payload.bank_account_number = null
        payload.bank_ifsc_code = null
      } else {
        payload.upi_id = null
        payload.bank_account_holder_name = formData.bank_account_holder_name.trim()
        payload.bank_account_number = formData.bank_account_number.trim()
        payload.bank_ifsc_code = formData.bank_ifsc_code.trim().toUpperCase()
      }

      const { error } = await (supabase as any)
        .from("payment_settings")
        .upsert(payload, { onConflict: "user_id" })

      if (error) throw error

      setHasSavedAccountNumber(formData.payment_method === "bank" && !!formData.bank_account_number)
      setRevealAccountNumber(false)
      setMessage({ type: "success", text: "Payment details saved." })
      setTimeout(() => setMessage({ type: "", text: "" }), 5000)
    } catch (error) {
      console.error("Error saving payment settings:", error)
      setMessage({ type: "error", text: "Failed to save payment details. Please try again." })
    } finally {
      setSaving(false)
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full mx-auto mb-6"
          />
          <p className="text-emerald-300 text-sm font-medium">Loading payment settings...</p>
        </div>
      </div>
    )
  }

  const showAccountNumberMasked = hasSavedAccountNumber && !revealAccountNumber && formData.bank_account_number

  return (
    <PageWrapper className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30 overflow-x-hidden font-sans py-16 px-6 relative">
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.22, 0.15] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -top-32 -right-32 w-[550px] h-[550px] bg-gradient-to-br from-emerald-400/25 via-teal-500/15 to-transparent rounded-full blur-[130px]"
        />
      </div>

      <div className="container mx-auto max-w-3xl relative z-10 px-4 md:px-0">
        <div className="mb-12">
          <motion.div whileHover={{ x: -2 }} className="w-fit">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-full border border-white/10 px-5 mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </motion.div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Payment <span className="bg-gradient-to-r from-emerald-300 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Settings</span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base mt-3">
            How you want to get paid — used for course, Teach & Earn and PolyVault payouts.
          </p>
          <div className="flex items-center gap-2 mt-4 text-xs text-slate-500">
            <Lock className="h-3.5 w-3.5 text-emerald-500" />
            Private to you — never shown on your public profile or resume.
          </div>
        </div>

        <AnimatePresence>
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`p-5 rounded-2xl mb-8 flex items-center gap-3 border ${message.type === "success" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-300" : "bg-rose-500/10 border-rose-500/20 text-rose-300"} shadow-xl backdrop-blur-xl`}
            >
              {message.type === "success" ? <CheckCircle2 className="h-5 w-5 flex-shrink-0" /> : <AlertCircle className="h-5 w-5 flex-shrink-0" />}
              <span className="text-sm font-medium">{message.text}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Payout method */}
        <Card className="bg-[#0d1424]/70 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-10 shadow-xl mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 flex-shrink-0">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">How you get paid</h2>
              <p className="text-sm text-slate-400">Choose one — you can switch any time.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              type="button"
              onClick={() => handleChange("payment_method", "upi")}
              className={`flex items-center gap-3 p-5 rounded-2xl border text-left transition-all ${formData.payment_method === "upi" ? "bg-emerald-500/10 border-emerald-500/40" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
            >
              <Smartphone className={`h-5 w-5 flex-shrink-0 ${formData.payment_method === "upi" ? "text-emerald-400" : "text-slate-500"}`} />
              <div>
                <p className="text-sm font-bold text-white">UPI</p>
                <p className="text-xs text-slate-400">Fastest — pay to a UPI ID</p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => handleChange("payment_method", "bank")}
              className={`flex items-center gap-3 p-5 rounded-2xl border text-left transition-all ${formData.payment_method === "bank" ? "bg-emerald-500/10 border-emerald-500/40" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
            >
              <Landmark className={`h-5 w-5 flex-shrink-0 ${formData.payment_method === "bank" ? "text-emerald-400" : "text-slate-500"}`} />
              <div>
                <p className="text-sm font-bold text-white">Bank Account</p>
                <p className="text-xs text-slate-400">Direct bank transfer (NEFT/IMPS)</p>
              </div>
            </button>
          </div>

          {formData.payment_method === "upi" ? (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 px-1">UPI ID *</label>
              <Input
                value={formData.upi_id}
                onChange={(e) => handleChange("upi_id", e.target.value)}
                placeholder="yourname@okhdfcbank"
                className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-emerald-500/50 text-white rounded-xl h-12"
              />
              {errors.upi_id && <p className="text-xs text-rose-400 px-1">{errors.upi_id}</p>}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 px-1">Account Holder Name *</label>
                <Input
                  value={formData.bank_account_holder_name}
                  onChange={(e) => handleChange("bank_account_holder_name", e.target.value)}
                  placeholder="Exactly as it appears on your bank passbook"
                  className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-emerald-500/50 text-white rounded-xl h-12"
                />
                {errors.bank_account_holder_name && <p className="text-xs text-rose-400 px-1">{errors.bank_account_holder_name}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 px-1">Account Number *</label>
                  <div className="relative">
                    <Input
                      type={showAccountNumberMasked ? "text" : "text"}
                      value={showAccountNumberMasked ? maskAccountNumber(formData.bank_account_number) : formData.bank_account_number}
                      onChange={(e) => handleChange("bank_account_number", e.target.value.replace(/\D/g, ""))}
                      onFocus={() => setRevealAccountNumber(true)}
                      placeholder="Account number"
                      className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-emerald-500/50 text-white rounded-xl h-12 pr-11"
                      inputMode="numeric"
                    />
                    <button
                      type="button"
                      onClick={() => setRevealAccountNumber((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      tabIndex={-1}
                    >
                      {revealAccountNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.bank_account_number && <p className="text-xs text-rose-400 px-1">{errors.bank_account_number}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300 px-1">Confirm Account Number *</label>
                  <Input
                    value={formData.bank_account_number_confirm}
                    onChange={(e) => handleChange("bank_account_number_confirm", e.target.value.replace(/\D/g, ""))}
                    placeholder="Re-type account number"
                    className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-emerald-500/50 text-white rounded-xl h-12"
                    inputMode="numeric"
                  />
                  {errors.bank_account_number_confirm && <p className="text-xs text-rose-400 px-1">{errors.bank_account_number_confirm}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 px-1">IFSC Code *</label>
                <Input
                  value={formData.bank_ifsc_code}
                  onChange={(e) => handleChange("bank_ifsc_code", e.target.value.toUpperCase())}
                  placeholder="e.g. HDFC0001234"
                  className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-emerald-500/50 text-white rounded-xl h-12 max-w-xs"
                />
                {errors.bank_ifsc_code && <p className="text-xs text-rose-400 px-1">{errors.bank_ifsc_code}</p>}
              </div>
            </div>
          )}
        </Card>

        {/* GST */}
        <Card className="bg-[#0d1424]/70 border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-6 sm:p-10 shadow-xl mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20 flex-shrink-0">
              <Receipt className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">GST Number</h2>
              <p className="text-sm text-slate-400">Optional — only needed if you're GST-registered and want it on invoices.</p>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300 px-1">GSTIN</label>
            <Input
              value={formData.gst_number}
              onChange={(e) => handleChange("gst_number", e.target.value.toUpperCase())}
              placeholder="e.g. 09ABCDE1234F1Z5"
              className="bg-white/5 border-white/10 focus:bg-white/10 focus:border-emerald-500/50 text-white rounded-xl h-12 max-w-sm font-mono"
              maxLength={15}
            />
            {errors.gst_number && <p className="text-xs text-rose-400 px-1">{errors.gst_number}</p>}
          </div>
        </Card>

        <div className="flex flex-col sm:flex-row justify-end gap-4">
          <motion.div whileHover={{ x: -5 }} className="w-full sm:w-auto">
            <Button
              variant="ghost"
              asChild
              className="w-full sm:w-auto h-12 px-10 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white rounded-full font-semibold text-sm"
            >
              <Link href="/">Cancel</Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
            <Button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto h-12 px-10 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-600 hover:opacity-90 text-white rounded-full font-semibold text-sm shadow-lg shadow-emerald-500/20 border-none transition-opacity"
            >
              {saving ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Saving...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Save Payment Details
                </div>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </PageWrapper>
  )
}
