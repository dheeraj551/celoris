"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase-client"
import {
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Save,
  ExternalLink,
  ShieldCheck,
  Power,
  MessageSquare,
  Send,
  Sparkles,
  Check
} from "lucide-react"

export default function PhoneVerificationCard() {
  const [enabled, setEnabled] = useState<boolean>(true)
  const [clientId, setClientId] = useState<string>("")
  const [savedClientId, setSavedClientId] = useState<string>("")
  const [whatsappEnabled, setWhatsappEnabled] = useState<boolean>(true)
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isToggling, setIsToggling] = useState<boolean>(false)
  const [isTogglingWhatsApp, setIsTogglingWhatsApp] = useState<boolean>(false)
  const [isSavingKey, setIsSavingKey] = useState<boolean>(false)

  // Test WhatsApp OTP State
  const [testPhone, setTestPhone] = useState<string>("")
  const [isSendingTestOtp, setIsSendingTestOtp] = useState<boolean>(false)
  const [testOtpSuccess, setTestOtpSuccess] = useState<boolean>(false)

  const { toast } = useToast()

  const getAuthHeaders = async (): Promise<Record<string, string>> => {
    const headers: Record<string, string> = { "Content-Type": "application/json" }
    try {
      const supabase = createClient()
      const { data } = await supabase.auth.getSession()
      if (data?.session?.access_token) {
        headers["Authorization"] = `Bearer ${data.session.access_token}`
      }
    } catch {}
    return headers
  }

  const loadSettings = async () => {
    setLoading(true)
    try {
      const headers = await getAuthHeaders()
      const res = await fetch("/api/admin/settings/phone-verification", {
        headers,
        cache: "no-store",
      })
      if (!res.ok) {
        // Fallback to public endpoint if session cookie/bearer not ready
        const publicRes = await fetch("/api/auth/phone-settings", { cache: "no-store" })
        if (publicRes.ok) {
          const publicData = await publicRes.json()
          setEnabled(Boolean(publicData.enabled))
          setClientId(publicData.clientId || "")
          setSavedClientId(publicData.clientId || "")
          setWhatsappEnabled(Boolean(publicData.whatsappOtpEnabled ?? true))
        }
        return
      }
      const data = await res.json()
      setEnabled(Boolean(data.enabled))
      setClientId(data.clientId || "")
      setSavedClientId(data.clientId || "")
      setWhatsappEnabled(Boolean(data.whatsappOtpEnabled ?? true))
      setUpdatedAt(data.updatedAt)
    } catch (err: any) {
      console.error("Failed to load phone verification settings:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadSettings()
  }, [])

  // Toggle Phone.email switch
  const handleToggle = async (newVal: boolean) => {
    setIsToggling(true)
    try {
      const headers = await getAuthHeaders()
      const res = await fetch("/api/admin/settings/phone-verification", {
        method: "POST",
        headers,
        body: JSON.stringify({ enabled: newVal }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update switch")

      setEnabled(newVal)
      setUpdatedAt(data.updatedAt)
      toast({
        title: newVal ? "Phone.email OTP Enabled" : "Phone.email OTP Disabled",
        description: newVal
          ? "New registrations can verify mobile number via Phone.email SMS."
          : "Phone.email verification has been disabled.",
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message || "Could not update phone verification switch.",
      })
    } finally {
      setIsToggling(false)
    }
  }

  // Toggle WhatsApp OTP switch
  const handleToggleWhatsApp = async (newVal: boolean) => {
    setIsTogglingWhatsApp(true)
    try {
      const headers = await getAuthHeaders()
      const res = await fetch("/api/admin/settings/phone-verification", {
        method: "POST",
        headers,
        body: JSON.stringify({ whatsappOtpEnabled: newVal }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to update WhatsApp switch")

      setWhatsappEnabled(newVal)
      setUpdatedAt(data.updatedAt)
      toast({
        title: newVal ? "WhatsApp OTP Enabled" : "WhatsApp OTP Disabled",
        description: newVal
          ? "Users can now verify their mobile number by receiving a 6-digit OTP on WhatsApp!"
          : "WhatsApp OTP verification has been disabled.",
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: err.message || "Could not update WhatsApp verification switch.",
      })
    } finally {
      setIsTogglingWhatsApp(false)
    }
  }

  const handleSaveClientId = async () => {
    setIsSavingKey(true)
    try {
      const headers = await getAuthHeaders()
      const res = await fetch("/api/admin/settings/phone-verification", {
        method: "POST",
        headers,
        body: JSON.stringify({ clientId: clientId.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to save Client ID")

      setSavedClientId(clientId.trim())
      setUpdatedAt(data.updatedAt)
      toast({
        title: "Client ID Saved",
        description: "Phone.email Client ID has been successfully updated.",
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Save Failed",
        description: err.message || "Could not save Client ID.",
      })
    } finally {
      setIsSavingKey(false)
    }
  }

  const handleSendTestOtp = async () => {
    if (!testPhone || testPhone.trim().length < 10) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit mobile number.",
      })
      return
    }

    setIsSendingTestOtp(true)
    setTestOtpSuccess(false)
    try {
      const res = await fetch("/api/auth/whatsapp-otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: testPhone.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to send OTP")

      setTestOtpSuccess(true)
      toast({
        title: "WhatsApp OTP Sent! 🚀",
        description: `6-digit verification code dispatched to ${data.phone || testPhone}. Check WhatsApp!`,
      })
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "OTP Delivery Failed",
        description: err.message || "Could not send test WhatsApp OTP.",
      })
    } finally {
      setIsSendingTestOtp(false)
    }
  }

  const isDirty = clientId.trim() !== savedClientId.trim()

  return (
    <Card className="bg-slate-800 border-slate-700 text-white shadow-xl overflow-hidden">
      <CardHeader className="border-b border-slate-700/60 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Smartphone className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                Mobile & OTP Verification Settings
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                Manage OTP verification methods for user registration and authentication
              </CardDescription>
            </div>
          </div>

          {updatedAt && (
            <span className="text-[10px] text-slate-400 self-end sm:self-auto bg-slate-900/60 px-3 py-1.5 rounded-lg border border-slate-700/60 font-mono">
              Updated: {new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* ========================================================= */}
        {/* SECTION 1: WHATSAPP CLOUD API OTP VERIFICATION           */}
        {/* ========================================================= */}
        <div className="bg-gradient-to-br from-emerald-950/40 via-slate-900/60 to-slate-900/40 border border-emerald-500/30 rounded-2xl p-5 space-y-4 shadow-lg shadow-emerald-950/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">WhatsApp Cloud API OTP</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
                    <Sparkles className="h-2.5 w-2.5" /> LIVE API
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Send secure 6-digit verification codes to users directly via WhatsApp from <strong className="text-slate-200">+91 97606 18099</strong>
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end sm:self-auto bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-700/80">
              <span className="text-xs font-semibold">
                {whatsappEnabled ? (
                  <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    ENABLED
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                    <Power className="h-3.5 w-3.5" />
                    DISABLED
                  </span>
                )}
              </span>
              <Switch
                checked={whatsappEnabled}
                onCheckedChange={handleToggleWhatsApp}
                disabled={loading || isTogglingWhatsApp}
                className="data-[state=checked]:bg-emerald-500"
              />
            </div>
          </div>

          {/* WhatsApp API Specs & Quick Test Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Left: Live Connection Specs */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Connected Business Number
              </span>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold font-mono text-emerald-300">
                  +91 97606 18099
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Meta Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                WABA ID: <code className="text-slate-300">1595863125256100</code> • Phone ID: <code className="text-slate-300">1351346371393751</code>
              </p>
            </div>

            {/* Right: Live Test Tool */}
            <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Send Test WhatsApp OTP
              </span>
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="e.g. 9084718101"
                  value={testPhone}
                  onChange={(e) => {
                    setTestPhone(e.target.value)
                    setTestOtpSuccess(false)
                  }}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 rounded-lg h-9 text-xs font-mono focus:border-emerald-500"
                />
                <Button
                  onClick={handleSendTestOtp}
                  disabled={isSendingTestOtp || !testPhone}
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg h-9 px-3 shrink-0 shadow-md shadow-emerald-500/20"
                >
                  {isSendingTestOtp ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : testOtpSuccess ? (
                    <>
                      <Check className="h-3.5 w-3.5 mr-1 text-white" /> Sent!
                    </>
                  ) : (
                    <>
                      <Send className="h-3.5 w-3.5 mr-1" /> Send OTP
                    </>
                  )}
                </Button>
              </div>
              <p className="text-[10px] text-slate-500">
                Dispatches a live 6-digit verification code directly to this phone via WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: PHONE.EMAIL SMS OTP VERIFICATION              */}
        {/* ========================================================= */}
        <div className="bg-slate-900/40 border border-slate-700/60 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-400 shrink-0">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm text-white">Phone.email SMS OTP</h4>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                    Third-party SMS
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Verify mobile numbers using Phone.email free web sign-in widget
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 self-end sm:self-auto bg-slate-950/80 px-4 py-2 rounded-xl border border-slate-700/80">
              <span className="text-xs font-semibold">
                {enabled ? (
                  <span className="text-teal-400 flex items-center gap-1.5 font-bold">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    ENABLED
                  </span>
                ) : (
                  <span className="text-slate-400 flex items-center gap-1.5 font-bold">
                    <Power className="h-3.5 w-3.5" />
                    DISABLED
                  </span>
                )}
              </span>
              <Switch
                checked={enabled}
                onCheckedChange={handleToggle}
                disabled={loading || isToggling}
                className="data-[state=checked]:bg-teal-500"
              />
            </div>
          </div>

          {/* Client ID Configuration Field */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
              <Label htmlFor="clientId" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Phone.email Client ID
              </Label>
              <a
                href="https://admin.phone.email"
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors font-medium"
              >
                Get Client ID from Phone.email Dashboard
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Input
                  id="clientId"
                  type="text"
                  placeholder="e.g. 17098676583268928952"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  disabled={loading || isSavingKey}
                  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-600 rounded-xl h-11 text-xs font-mono focus:border-teal-500"
                />
              </div>

              <Button
                onClick={handleSaveClientId}
                disabled={loading || isSavingKey || !isDirty}
                className="bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs rounded-xl h-11 px-5 shadow-lg shadow-teal-500/20 disabled:opacity-40 transition-all"
              >
                {isSavingKey ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1.5" />
                    Save ID
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Global Overview Banner */}
        <div className="bg-slate-900/60 border border-slate-700/80 rounded-xl p-4 flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-white">
              {whatsappEnabled && enabled
                ? "Both WhatsApp & Phone.email Verification Active"
                : whatsappEnabled
                ? "WhatsApp OTP Verification Active (Recommended)"
                : enabled
                ? "Phone.email SMS Verification Active"
                : "Phone Verification Disabled (Fast Signups)"}
            </p>
            <p className="text-slate-400 leading-relaxed">
              When WhatsApp OTP is enabled, users on <code className="bg-slate-950 px-1.5 py-0.5 rounded text-emerald-400 font-mono">/register</code> receive a 6-digit code on WhatsApp directly from <strong className="text-slate-200">celoris designs</strong> (+91 97606 18099).
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
