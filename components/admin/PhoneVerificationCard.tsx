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
  Power
} from "lucide-react"

export default function PhoneVerificationCard() {
  const [enabled, setEnabled] = useState<boolean>(true)
  const [clientId, setClientId] = useState<string>("")
  const [savedClientId, setSavedClientId] = useState<string>("")
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [isToggling, setIsToggling] = useState<boolean>(false)
  const [isSavingKey, setIsSavingKey] = useState<boolean>(false)
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
        }
        return
      }
      const data = await res.json()
      setEnabled(Boolean(data.enabled))
      setClientId(data.clientId || "")
      setSavedClientId(data.clientId || "")
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
        title: newVal ? "Phone Verification Enabled" : "Phone Verification Disabled",
        description: newVal
          ? "New registrations now require mobile number verification via OTP."
          : "Phone verification is turned off. Users can sign up with name, email, and password.",
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
                Registration Phone Verification
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Phone.email OTP
                </span>
              </CardTitle>
              <CardDescription className="text-xs text-slate-400 mt-0.5">
                Enable or disable mandatory mobile OTP verification on the user registration page
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center space-x-3 self-end sm:self-auto bg-slate-900/60 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-xs font-semibold text-slate-300">
              {enabled ? (
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
              checked={enabled}
              onCheckedChange={handleToggle}
              disabled={loading || isToggling}
              className="data-[state=checked]:bg-emerald-500"
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        {/* Status Callout Banner */}
        {enabled ? (
          !savedClientId ? (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-200">
                <p className="font-semibold text-amber-300 mb-1">
                  Phone Verification is ON, but Client ID is not configured yet
                </p>
                <p className="text-slate-300 leading-relaxed">
                  To start verifying mobile numbers, paste your Phone.email <strong className="text-white">CLIENT_ID</strong> from your{" "}
                  <a
                    href="https://admin.phone.email"
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-amber-400 hover:text-amber-300 inline-flex items-center gap-0.5 font-medium"
                  >
                    Phone.email Admin Dashboard <ExternalLink className="h-3 w-3 inline" />
                  </a>{" "}
                  below and click Save.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-200">
                <p className="font-semibold text-emerald-300 mb-0.5">
                  Phone Verification Active & Enforced
                </p>
                <p className="text-slate-300 leading-relaxed">
                  Every new registrant at <code className="bg-slate-900/80 px-1.5 py-0.5 rounded text-emerald-400 font-mono">/register</code> must verify their mobile phone number via SMS OTP before they can submit the form.
                </p>
              </div>
            </div>
          )
        ) : (
          <div className="bg-slate-900/50 border border-slate-700/80 rounded-xl p-4 flex items-start gap-3">
            <Power className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <p className="font-semibold text-slate-200 mb-0.5">
                Phone Verification is currently Disabled
              </p>
              <p className="text-slate-400 leading-relaxed">
                Users can register instantly with only their name, email, and password. Toggle the switch above to require phone verification.
              </p>
            </div>
          </div>
        )}

        {/* Client ID Configuration Field */}
        <div className="space-y-3 bg-slate-900/40 p-4 rounded-xl border border-slate-700/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
            <Label htmlFor="clientId" className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Phone.email Client ID
            </Label>
            <a
              href="https://admin.phone.email"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors font-medium"
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
                placeholder="e.g. 18264910283749102837"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                disabled={loading || isSavingKey}
                className="bg-slate-950/80 border-slate-700 text-white placeholder:text-slate-600 rounded-xl h-11 text-xs font-mono focus:border-emerald-500"
              />
            </div>

            <Button
              onClick={handleSaveClientId}
              disabled={loading || isSavingKey || !isDirty}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl h-11 px-5 shadow-lg shadow-emerald-500/20 disabled:opacity-40 transition-all"
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

          {updatedAt && (
            <p className="text-[10px] text-slate-500">
              Last setting update: {new Date(updatedAt).toLocaleString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
