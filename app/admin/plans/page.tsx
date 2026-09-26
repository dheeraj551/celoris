"use client"

// Admin → Plans: what each membership tier includes. Changes apply to
// everyone on that tier within about a minute (the server caches settings
// for 60 seconds). Who is on which tier is set in Admin → Users.

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Check, Coins, Crown, Loader2, RotateCcw, Save, Users } from "lucide-react"
import {
  DEFAULT_TIER_SETTINGS,
  FEATURE_DEFS,
  PLAN_TIERS,
  type FeatureDef,
  type PlanFeatures,
  type PlanTier,
  type TierSettings,
} from "@/lib/plan-features"

type TierRow = TierSettings & { activeMembers: number }

const TIER_ACCENT: Record<PlanTier, string> = {
  free: "text-slate-300",
  basic: "text-sky-300",
  pro: "text-lime-300",
  max: "text-fuchsia-300",
}

export default function AdminPlansPage() {
  const [saved, setSaved] = useState<Record<PlanTier, TierRow> | null>(null)
  const [draft, setDraft] = useState<Record<PlanTier, TierRow> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState<PlanTier | "all" | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/plan-settings", { cache: "no-store" })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || "Could not load plan settings")
      const map = {} as Record<PlanTier, TierRow>
      for (const t of data.tiers as TierRow[]) map[t.tier] = t
      setSaved(map)
      setDraft(JSON.parse(JSON.stringify(map)))
      setError(null)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const dirtyTiers = useMemo(() => {
    if (!saved || !draft) return [] as PlanTier[]
    return PLAN_TIERS.filter((t) => JSON.stringify(stripCounts(saved[t])) !== JSON.stringify(stripCounts(draft[t])))
  }, [saved, draft])

  const setFeature = (tier: PlanTier, key: keyof PlanFeatures, value: boolean | number) => {
    setDraft((d) => (d ? { ...d, [tier]: { ...d[tier], features: { ...d[tier].features, [key]: value } } } : d))
  }
  const setField = (tier: PlanTier, field: "label" | "monthlyCredits", value: string | number) => {
    setDraft((d) => (d ? { ...d, [tier]: { ...d[tier], [field]: value } } : d))
  }

  const saveTiers = async (list: PlanTier[]) => {
    if (!draft || list.length === 0) return
    setSaving(list.length > 1 ? "all" : list[0])
    setNotice(null)
    try {
      for (const tier of list) {
        const t = draft[tier]
        const res = await fetch("/api/admin/plan-settings", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tier, label: t.label, monthlyCredits: Number(t.monthlyCredits) || 0, features: t.features }),
        })
        const data = await res.json().catch(() => ({}))
        if (!res.ok) throw new Error(`${t.label}: ${data?.error || "save failed"}`)
      }
      await load()
      setNotice(`Saved. Members on ${list.map((t) => draft[t].label).join(", ")} get the new settings within a minute.`)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setSaving(null)
    }
  }

  const groups = useMemo(() => {
    const out: { group: string; defs: FeatureDef[] }[] = []
    for (const def of FEATURE_DEFS) {
      const g = out.find((x) => x.group === def.group)
      if (g) g.defs.push(def)
      else out.push({ group: def.group, defs: [def] })
    }
    return out
  }, [])

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <Link href="/admin/users" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" title="Back to users">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-400" /> Plan settings
              </h1>
              <p className="text-sm text-slate-400">What Free, Basic, Pro and Max include. Award plans to members in Users.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {dirtyTiers.length > 0 && (
              <button
                onClick={() => saved && setDraft(JSON.parse(JSON.stringify(saved)))}
                className="h-10 px-3 rounded-md text-slate-300 hover:bg-slate-800 text-sm inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-4 h-4" /> Undo changes
              </button>
            )}
            <button
              onClick={() => saveTiers(dirtyTiers)}
              disabled={dirtyTiers.length === 0 || !!saving}
              className="h-10 px-4 rounded-md bg-amber-500 hover:bg-amber-400 text-black text-sm font-bold disabled:opacity-40 inline-flex items-center gap-2"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {dirtyTiers.length > 0 ? `Save ${dirtyTiers.length} plan${dirtyTiers.length > 1 ? "s" : ""}` : "Saved"}
            </button>
          </div>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}
        {notice && (
          <div className="mb-4 rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200 flex items-center gap-2">
            <Check className="w-4 h-4" /> {notice}
          </div>
        )}

        {loading || !draft ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
          </div>
        ) : (
          <div className="rounded-xl border border-slate-700 bg-slate-800 overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="bg-slate-900/70">
                  <th className="text-left px-4 py-3 text-slate-400 font-medium w-[34%]">Feature</th>
                  {PLAN_TIERS.map((t) => (
                    <th key={t} className="px-3 py-3 text-center">
                      <input
                        value={draft[t].label}
                        onChange={(e) => setField(t, "label", e.target.value.slice(0, 30))}
                        className={`w-full bg-transparent text-center font-bold text-base outline-none focus:bg-slate-900 rounded ${TIER_ACCENT[t]}`}
                        title="Plan name shown to members"
                      />
                      <div className="mt-0.5 text-[11px] text-slate-500 font-normal inline-flex items-center gap-1">
                        <Users className="w-3 h-3" /> {draft[t].activeMembers} active
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-slate-700">
                  <td className="px-4 py-3">
                    <div className="font-medium text-white flex items-center gap-1.5">
                      <Coins className="w-4 h-4 text-amber-400" /> Monthly credits
                    </div>
                    <div className="text-xs text-slate-400">Added when the plan is awarded, then every month while it’s active</div>
                  </td>
                  {PLAN_TIERS.map((t) => (
                    <td key={t} className="px-3 py-3 text-center">
                      {t === "free" ? (
                        <span className="text-slate-500">—</span>
                      ) : (
                        <input
                          type="number"
                          min={0}
                          value={draft[t].monthlyCredits}
                          onChange={(e) => setField(t, "monthlyCredits", Math.max(0, Math.round(Number(e.target.value) || 0)))}
                          className="w-24 h-9 px-2 rounded-md bg-slate-900 border border-slate-700 text-white text-center"
                        />
                      )}
                    </td>
                  ))}
                </tr>

                {groups.map((g) => (
                  <GroupRows key={g.group} group={g.group} defs={g.defs} draft={draft} setFeature={setFeature} />
                ))}

                <tr className="border-t border-slate-700 bg-slate-900/40">
                  <td className="px-4 py-3 text-xs text-slate-400">
                    Class queue priority stays Free 0 · Basic +10 · Pro +50 · Max +100 (set in the class queue).
                  </td>
                  {PLAN_TIERS.map((t) => (
                    <td key={t} className="px-3 py-3 text-center">
                      <button
                        onClick={() => saveTiers([t])}
                        disabled={dirtyTiers.indexOf(t) === -1 || !!saving}
                        className="h-8 px-3 rounded-md border border-slate-600 text-xs text-slate-200 hover:bg-slate-700 disabled:opacity-30"
                      >
                        {saving === t ? "Saving…" : `Save ${draft[t].label}`}
                      </button>
                      <button
                        onClick={() =>
                          setDraft((d) =>
                            d
                              ? {
                                  ...d,
                                  [t]: {
                                    ...d[t],
                                    monthlyCredits: DEFAULT_TIER_SETTINGS[t].monthlyCredits,
                                    features: { ...DEFAULT_TIER_SETTINGS[t].features },
                                  },
                                }
                              : d
                          )
                        }
                        className="block mx-auto mt-1 text-[11px] text-slate-500 hover:text-slate-300"
                        title="Put this plan back to the original settings (not saved until you press Save)"
                      >
                        Reset to default
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <p className="mt-4 text-xs text-slate-500 leading-relaxed">
          Seedance 2.0 / 2.5 switches are ready for the video generators; they take effect as soon as a generator sends
          one of those models. Motion Swap’s free renders reset on the 1st of each month (India time) and only cover
          videos up to the set length — longer videos are charged per second as usual.
        </p>
      </div>
    </div>
  )
}

function stripCounts(t: TierRow) {
  return { label: t.label, monthlyCredits: Number(t.monthlyCredits) || 0, features: t.features }
}

function GroupRows({
  group,
  defs,
  draft,
  setFeature,
}: {
  group: string
  defs: FeatureDef[]
  draft: Record<PlanTier, TierRow>
  setFeature: (tier: PlanTier, key: keyof PlanFeatures, value: boolean | number) => void
}) {
  return (
    <>
      <tr className="border-t border-slate-700 bg-slate-900/40">
        <td colSpan={5} className="px-4 py-2 text-[11px] uppercase tracking-wider font-bold text-slate-400">
          {group}
        </td>
      </tr>
      {defs.map((def) => (
        <tr key={def.key} className="border-t border-slate-700/60">
          <td className="px-4 py-3">
            <div className="font-medium text-white">{def.label}</div>
            <div className="text-xs text-slate-400">{def.help}</div>
          </td>
          {PLAN_TIERS.map((t) => {
            const value = draft[t].features[def.key]
            return (
              <td key={t} className="px-3 py-3 text-center">
                {def.type === "bool" ? (
                  <button
                    onClick={() => setFeature(t, def.key, !value)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      value ? "bg-emerald-500" : "bg-slate-600"
                    }`}
                    title={value ? "On" : "Off"}
                    aria-pressed={!!value}
                  >
                    <span
                      className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        value ? "translate-x-5" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                ) : (
                  <div className="inline-flex items-center gap-1">
                    <input
                      type="number"
                      min={def.min}
                      max={def.max}
                      value={Number(value)}
                      onChange={(e) => {
                        const n = Math.round(Number(e.target.value) || 0)
                        setFeature(t, def.key, Math.min(def.max ?? n, Math.max(def.min ?? n, n)))
                      }}
                      className="w-16 h-9 px-2 rounded-md bg-slate-900 border border-slate-700 text-white text-center"
                    />
                    {def.unit && <span className="text-xs text-slate-400">{def.unit}</span>}
                  </div>
                )}
              </td>
            )
          })}
        </tr>
      ))}
    </>
  )
}
