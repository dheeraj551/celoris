"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ExternalLink, Film, ImagePlus, Loader2, Package, Pencil, Plus, RefreshCw, Shirt, Trash2, Undo2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import {
  CATEGORIES,
  ORDER_STATUSES,
  ORDER_STATUS_LABEL,
  formatInr,
  parseInstagramUrl,
  type DrapeOrder,
  type DrapeProduct,
  type DrapeReel,
  type OrderStatus,
} from "@/lib/drape-shared"
import { InstagramEmbed } from "@/components/drape/InstagramEmbed"

// Admin: Celoris Drape store (/shop) — products, shoppable reels and orders.
// Every call goes to /api/admin/drape/*, which only admin accounts can reach.

type Tab = "products" | "reels" | "orders"

async function api<T = any>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
    cache: "no-store",
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`)
  return data as T
}

export default function DrapeAdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>("products")
  const [products, setProducts] = useState<DrapeProduct[]>([])
  const [reels, setReels] = useState<DrapeReel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const [p, r] = await Promise.all([
        api<{ products: DrapeProduct[] }>("/api/admin/drape/products"),
        api<{ reels: DrapeReel[] }>("/api/admin/drape/reels"),
      ])
      setProducts(p.products || [])
      setReels(r.reels || [])
    } catch (e: any) {
      setError(e?.message || "Could not load the store")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="min-h-screen bg-slate-900 p-4 sm:p-8 text-white">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-white" onClick={() => router.push("/admin/dashboard")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Celoris Drape</h1>
              <p className="text-sm text-slate-400 mt-1">Products, shoppable reels and orders for the /shop store.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-slate-600 text-white bg-transparent" onClick={load}>
              <RefreshCw className="mr-2 h-4 w-4" /> Refresh
            </Button>
            <a href="/shop" target="_blank" rel="noopener noreferrer">
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <ExternalLink className="mr-2 h-4 w-4" /> View store
              </Button>
            </a>
          </div>
        </div>

        <div className="flex gap-2 mb-6 border-b border-slate-700">
          {([
            ["products", "Products", Shirt],
            ["reels", "Reels", Film],
            ["orders", "Orders", Package],
          ] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`px-4 py-2 text-sm font-medium flex items-center gap-2 border-b-2 -mb-px ${
                tab === id ? "border-emerald-500 text-white" : "border-transparent text-slate-400 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

        {loading && tab !== "orders" ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : tab === "products" ? (
          <ProductsTab products={products} onChange={load} />
        ) : tab === "reels" ? (
          <ReelsTab reels={reels} products={products} onChange={load} />
        ) : (
          <OrdersTab />
        )}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */

type ImageItem = { ref: string; preview: string }

type ProductForm = {
  id: string | null
  title: string
  category: string
  priceInr: string
  compareAtInr: string
  description: string
  fabric: string
  fitNotes: string
  sizes: string
  colors: string
  tags: string
  sizeStock: string
  images: ImageItem[]
  inStock: boolean
  isPublished: boolean
  sortOrder: string
}

const EMPTY_PRODUCT: ProductForm = {
  id: null,
  title: "",
  category: "dresses",
  priceInr: "",
  compareAtInr: "",
  description: "",
  fabric: "",
  fitNotes: "",
  sizes: "XS, S, M, L, XL",
  colors: "",
  tags: "",
  sizeStock: "",
  images: [],
  inStock: true,
  isPublished: true,
  sortOrder: "0",
}

function toForm(p: DrapeProduct): ProductForm {
  const refs = p.imageRefs || []
  const previews = p.imagePreviews || []
  return {
    id: p.id,
    title: p.title,
    category: p.category,
    priceInr: String(p.priceInr),
    compareAtInr: p.compareAtInr != null ? String(p.compareAtInr) : "",
    description: p.description,
    fabric: p.fabric,
    fitNotes: p.fitNotes,
    sizes: p.sizes.join(", "),
    colors: p.colors.join(", "),
    tags: p.tags.join(", "),
    sizeStock: p.sizeStock ? Object.entries(p.sizeStock).map(([k, v]) => `${k}:${v}`).join(", ") : "",
    images: refs.map((ref, i) => ({ ref, preview: previews[i] || (ref.startsWith("http") ? ref : "") })),
    inStock: p.inStock,
    isPublished: p.isPublished,
    sortOrder: String(p.sortOrder || 0),
  }
}

/** "S:3, M:0" -> { S: 3, M: 0 }. Blank -> null (no limits). */
function parseStock(text: string): Record<string, number> | null | string {
  const out: Record<string, number> = {}
  const parts = text.split(",").map((s) => s.trim()).filter(Boolean)
  for (const part of parts) {
    const m = part.match(/^([^:]+):\s*(\d+)$/)
    if (!m) return `Stock "${part}" should look like S:3`
    out[m[1].trim()] = Number(m[2])
  }
  return parts.length ? out : null
}

function ProductsTab({ products, onChange }: { products: DrapeProduct[]; onChange: () => void }) {
  const [form, setForm] = useState<ProductForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(0)
  const [formError, setFormError] = useState("")
  const [urlToAdd, setUrlToAdd] = useState("")

  const set = <K extends keyof ProductForm>(k: K, v: ProductForm[K]) => setForm((f) => (f ? { ...f, [k]: v } : f))

  const uploadFiles = async (files: FileList | null) => {
    if (!files || !form) return
    setFormError("")
    for (const file of Array.from(files).slice(0, 8)) {
      if (!file.type.startsWith("image/")) continue
      if (file.size > 8 * 1024 * 1024) {
        setFormError(`${file.name} is over 8 MB`)
        continue
      }
      setUploading((n) => n + 1)
      try {
        const { uploadUrl, key } = await api<{ uploadUrl: string; key: string }>("/api/admin/drape/sign-upload", {
          method: "POST",
          body: JSON.stringify({ filename: file.name, contentType: file.type, size: file.size }),
        })
        const put = await fetch(uploadUrl, { method: "PUT", body: file, headers: { "Content-Type": file.type } })
        if (!put.ok) throw new Error(`Upload failed for ${file.name}`)
        const preview = URL.createObjectURL(file)
        setForm((f) => (f ? { ...f, images: [...f.images, { ref: key, preview }].slice(0, 8) } : f))
      } catch (e: any) {
        setFormError(e?.message || "Upload failed")
      } finally {
        setUploading((n) => n - 1)
      }
    }
  }

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    const stock = parseStock(form.sizeStock)
    if (typeof stock === "string") return setFormError(stock)
    setSaving(true)
    setFormError("")
    try {
      const body = {
        title: form.title,
        category: form.category,
        priceInr: form.priceInr,
        compareAtInr: form.compareAtInr === "" ? null : form.compareAtInr,
        description: form.description,
        fabric: form.fabric,
        fitNotes: form.fitNotes,
        sizes: form.sizes,
        colors: form.colors,
        tags: form.tags,
        sizeStock: stock,
        images: form.images.map((i) => i.ref),
        inStock: form.inStock,
        isPublished: form.isPublished,
        sortOrder: form.sortOrder,
      }
      if (form.id) await api(`/api/admin/drape/products/${form.id}`, { method: "PATCH", body: JSON.stringify(body) })
      else await api("/api/admin/drape/products", { method: "POST", body: JSON.stringify(body) })
      setForm(null)
      onChange()
    } catch (e: any) {
      setFormError(e?.message || "Could not save")
    } finally {
      setSaving(false)
    }
  }

  const quickToggle = async (p: DrapeProduct, patch: Record<string, unknown>) => {
    try {
      await api(`/api/admin/drape/products/${p.id}`, { method: "PATCH", body: JSON.stringify(patch) })
      onChange()
    } catch (e: any) {
      alert(e?.message || "Could not update")
    }
  }

  const remove = async (p: DrapeProduct) => {
    if (!confirm(`Delete "${p.title}"? Past orders keep their details.`)) return
    try {
      await api(`/api/admin/drape/products/${p.id}`, { method: "DELETE" })
      onChange()
    } catch (e: any) {
      alert(e?.message || "Could not delete")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400">
          {products.length} products · {products.filter((p) => p.isPublished).length} live in the store
        </p>
        <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={() => { setFormError(""); setForm({ ...EMPTY_PRODUCT }) }}>
          <Plus className="mr-2 h-4 w-4" /> Add product
        </Button>
      </div>

      {products.length === 0 ? (
        <p className="text-slate-400 text-sm py-12 text-center">No products yet. Add your first piece.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div key={p.id} className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden flex flex-col">
              <div className="aspect-[4/5] bg-slate-700 relative">
                {p.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs">No photo</div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${p.isPublished ? "bg-emerald-600" : "bg-slate-600"}`}>
                    {p.isPublished ? "Live" : "Draft"}
                  </span>
                  {!p.inStock && <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-red-600">Sold out</span>}
                </div>
              </div>
              <div className="p-3 flex-1 flex flex-col gap-2">
                <div>
                  <p className="font-semibold text-sm line-clamp-1">{p.title}</p>
                  <p className="text-xs text-slate-400">
                    {p.categoryLabel} · {formatInr(p.priceInr)}
                    {p.sizeStock && ` · stock ${Object.entries(p.sizeStock).map(([k, v]) => `${k}:${v}`).join(" ")}`}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <label className="flex items-center gap-2">
                    <Switch checked={p.isPublished} onCheckedChange={(v) => quickToggle(p, { isPublished: v })} /> Live
                  </label>
                  <label className="flex items-center gap-2">
                    <Switch checked={p.inStock} onCheckedChange={(v) => quickToggle(p, { inStock: v })} /> In stock
                  </label>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button size="sm" variant="outline" className="flex-1 border-slate-600 bg-transparent text-white" onClick={() => { setFormError(""); setForm(toForm(p)) }}>
                    <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-700 bg-transparent text-red-400 hover:bg-red-950" onClick={() => remove(p)} aria-label="Delete">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <Modal title={form.id ? "Edit product" : "Add product"} onClose={() => !saving && setForm(null)}>
          <form onSubmit={save} className="space-y-4">
            <Field label="Title">
              <Input required value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Linen wrap midi dress" className="bg-slate-900 border-slate-600" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Category">
                <select value={form.category} onChange={(e) => set("category", e.target.value)} className="w-full h-10 rounded-md bg-slate-900 border border-slate-600 px-3 text-sm">
                  {CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </Field>
              <Field label="Price (₹)">
                <Input required inputMode="decimal" value={form.priceInr} onChange={(e) => set("priceInr", e.target.value)} className="bg-slate-900 border-slate-600" />
              </Field>
              <Field label="Original price (₹, optional)" hint="Shows as a sale">
                <Input inputMode="decimal" value={form.compareAtInr} onChange={(e) => set("compareAtInr", e.target.value)} className="bg-slate-900 border-slate-600" />
              </Field>
            </div>

            <Field label={`Photos (${form.images.length}/8)`} hint="First photo is the cover. JPG/PNG/WebP up to 8 MB.">
              <div className="flex flex-wrap gap-2">
                {form.images.map((img, i) => (
                  <div key={img.ref} className="relative w-20 h-24 rounded-md overflow-hidden bg-slate-700 border border-slate-600">
                    {img.preview ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={img.preview} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] p-1 block text-slate-400 break-all">{img.ref}</span>
                    )}
                    <button type="button" onClick={() => set("images", form.images.filter((_, j) => j !== i))} className="absolute top-1 right-1 bg-black/70 rounded-full p-0.5" aria-label="Remove photo">
                      <X className="h-3 w-3" />
                    </button>
                    {i > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...form.images]
                          const [m] = next.splice(i, 1)
                          next.unshift(m)
                          set("images", next)
                        }}
                        className="absolute bottom-1 left-1 right-1 bg-black/70 text-[9px] rounded py-0.5"
                      >
                        Make cover
                      </button>
                    )}
                  </div>
                ))}
                {form.images.length < 8 && (
                  <label className="w-20 h-24 rounded-md border border-dashed border-slate-500 flex flex-col items-center justify-center text-[10px] text-slate-400 cursor-pointer hover:border-emerald-500">
                    {uploading > 0 ? <Loader2 className="h-5 w-5 animate-spin" /> : <ImagePlus className="h-5 w-5" />}
                    <span className="mt-1">Upload</span>
                    <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple className="hidden" onChange={(e) => { uploadFiles(e.target.files); e.target.value = "" }} />
                  </label>
                )}
              </div>
              <div className="flex gap-2 mt-2">
                <Input value={urlToAdd} onChange={(e) => setUrlToAdd(e.target.value)} placeholder="…or paste an https image link" className="bg-slate-900 border-slate-600 text-xs" />
                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-600 bg-transparent text-white"
                  onClick={() => {
                    const u = urlToAdd.trim()
                    if (!/^https:\/\//i.test(u)) return setFormError("Image links must start with https://")
                    set("images", [...form.images, { ref: u, preview: u }].slice(0, 8))
                    setUrlToAdd("")
                  }}
                >
                  Add
                </Button>
              </div>
            </Field>

            <Field label="Description">
              <Textarea rows={3} value={form.description} onChange={(e) => set("description", e.target.value)} className="bg-slate-900 border-slate-600" />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Fabric">
                <Input value={form.fabric} onChange={(e) => set("fabric", e.target.value)} placeholder="e.g. 100% linen" className="bg-slate-900 border-slate-600" />
              </Field>
              <Field label="Fit notes">
                <Input value={form.fitNotes} onChange={(e) => set("fitNotes", e.target.value)} placeholder="e.g. Relaxed fit, true to size" className="bg-slate-900 border-slate-600" />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Sizes (comma separated)" hint="Leave blank for free size">
                <Input value={form.sizes} onChange={(e) => set("sizes", e.target.value)} className="bg-slate-900 border-slate-600" />
              </Field>
              <Field label="Colours (comma separated)" hint="Leave blank if only one">
                <Input value={form.colors} onChange={(e) => set("colors", e.target.value)} placeholder="e.g. Black, Ivory" className="bg-slate-900 border-slate-600" />
              </Field>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Stock per size (optional)" hint='e.g. "S:3, M:5, L:0". Blank = no limit. Goes down automatically with each order.'>
                <Input value={form.sizeStock} onChange={(e) => set("sizeStock", e.target.value)} className="bg-slate-900 border-slate-600" />
              </Field>
              <Field label="Tags (comma separated)" hint="First tag shows on the photo, e.g. New, Bestseller">
                <Input value={form.tags} onChange={(e) => set("tags", e.target.value)} className="bg-slate-900 border-slate-600" />
              </Field>
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.isPublished} onCheckedChange={(v) => set("isPublished", v)} /> Live in store
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.inStock} onCheckedChange={(v) => set("inStock", v)} /> In stock
              </label>
              <label className="flex items-center gap-2 text-sm">
                Order
                <Input value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} className="w-20 h-8 bg-slate-900 border-slate-600" inputMode="numeric" />
              </label>
            </div>

            {formError && <p className="text-sm text-red-400">{formError}</p>}
            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="ghost" onClick={() => setForm(null)} disabled={saving}>Cancel</Button>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={saving || uploading > 0}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {form.id ? "Save changes" : "Add product"}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Reels                                                               */
/* ------------------------------------------------------------------ */

type ReelForm = {
  id: string | null
  instagramUrl: string
  title: string
  caption: string
  taggedProductIds: string[]
  isPublished: boolean
  sortOrder: string
}

function ReelsTab({ reels, products, onChange }: { reels: DrapeReel[]; products: DrapeProduct[]; onChange: () => void }) {
  const [form, setForm] = useState<ReelForm | null>(null)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState("")
  const productById = useMemo(() => new Map(products.map((p) => [p.id, p])), [products])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form) return
    if (!parseInstagramUrl(form.instagramUrl)) return setFormError("Paste a public Instagram reel link, like https://www.instagram.com/reel/ABC123/")
    setSaving(true)
    setFormError("")
    try {
      const body = { ...form, id: undefined }
      if (form.id) await api(`/api/admin/drape/reels/${form.id}`, { method: "PATCH", body: JSON.stringify(body) })
      else await api("/api/admin/drape/reels", { method: "POST", body: JSON.stringify(body) })
      setForm(null)
      onChange()
    } catch (e: any) {
      setFormError(e?.message || "Could not save")
    } finally {
      setSaving(false)
    }
  }

  const remove = async (r: DrapeReel) => {
    if (!confirm("Remove this reel from the store? (It stays on Instagram.)")) return
    try {
      await api(`/api/admin/drape/reels/${r.id}`, { method: "DELETE" })
      onChange()
    } catch (e: any) {
      alert(e?.message || "Could not delete")
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-slate-400">Paste a public reel link from @celoris_drape and tag the pieces shown in it.</p>
        <Button
          className="bg-emerald-600 hover:bg-emerald-700"
          onClick={() => {
            setFormError("")
            setForm({ id: null, instagramUrl: "", title: "", caption: "", taggedProductIds: [], isPublished: true, sortOrder: "0" })
          }}
        >
          <Plus className="mr-2 h-4 w-4" /> Add reel
        </Button>
      </div>

      {reels.length === 0 ? (
        <p className="text-slate-400 text-sm py-12 text-center">No reels yet.</p>
      ) : (
        <div className="space-y-3">
          {reels.map((r) => (
            <div key={r.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex flex-wrap items-center gap-4">
              <Film className="h-8 w-8 text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-[200px]">
                <p className="font-semibold text-sm">{r.title || "Untitled reel"}</p>
                <a href={r.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-slate-400 hover:text-white break-all">
                  {r.instagramUrl}
                </a>
                <div className="flex flex-wrap gap-1 mt-2">
                  {r.taggedProductIds.map((id) => (
                    <span key={id} className="text-[10px] bg-slate-700 px-2 py-0.5 rounded">
                      {productById.get(id)?.title || "Deleted product"}
                    </span>
                  ))}
                </div>
              </div>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${r.isPublished ? "bg-emerald-600" : "bg-slate-600"}`}>
                {r.isPublished ? "Live" : "Hidden"}
              </span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-slate-600 bg-transparent text-white"
                  onClick={() => {
                    setFormError("")
                    setForm({
                      id: r.id,
                      instagramUrl: r.instagramUrl,
                      title: r.title,
                      caption: r.caption,
                      taggedProductIds: r.taggedProductIds,
                      isPublished: r.isPublished,
                      sortOrder: String(r.sortOrder || 0),
                    })
                  }}
                >
                  <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                </Button>
                <Button size="sm" variant="outline" className="border-red-700 bg-transparent text-red-400 hover:bg-red-950" onClick={() => remove(r)} aria-label="Delete">
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {form && (
        <Modal title={form.id ? "Edit reel" : "Add reel"} onClose={() => !saving && setForm(null)} wide>
          <form onSubmit={save} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Field label="Instagram reel link" hint="The reel must be public.">
                <Input required value={form.instagramUrl} onChange={(e) => setForm({ ...form, instagramUrl: e.target.value })} placeholder="https://www.instagram.com/reel/…" className="bg-slate-900 border-slate-600" />
              </Field>
              <Field label="Title">
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. 3 ways to style our linen co-ord" className="bg-slate-900 border-slate-600" />
              </Field>
              <Field label="Caption (optional)">
                <Textarea rows={2} value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} className="bg-slate-900 border-slate-600" />
              </Field>
              <Field label={`Pieces in this reel (${form.taggedProductIds.length})`}>
                <div className="max-h-56 overflow-y-auto space-y-1 p-2 bg-slate-900 rounded-md border border-slate-700">
                  {products.length === 0 && <p className="text-xs text-slate-500 p-2">Add products first.</p>}
                  {products.map((p) => {
                    const on = form.taggedProductIds.includes(p.id)
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() =>
                          setForm({
                            ...form,
                            taggedProductIds: on ? form.taggedProductIds.filter((x) => x !== p.id) : [...form.taggedProductIds, p.id].slice(0, 12),
                          })
                        }
                        className={`w-full flex items-center gap-2 p-1.5 rounded text-left text-xs ${on ? "bg-emerald-900/60 ring-1 ring-emerald-500" : "hover:bg-slate-800"}`}
                      >
                        {p.images[0] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={p.images[0]} alt="" className="w-7 h-8 rounded object-cover" />
                        ) : (
                          <div className="w-7 h-8 rounded bg-slate-700" />
                        )}
                        <span className="flex-1 truncate">{p.title}</span>
                        {!p.isPublished && <span className="text-[9px] text-slate-400">draft</span>}
                        <span className="text-slate-400">{formatInr(p.priceInr)}</span>
                      </button>
                    )
                  })}
                </div>
              </Field>
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={form.isPublished} onCheckedChange={(v) => setForm({ ...form, isPublished: v })} /> Live in store
                </label>
                <label className="flex items-center gap-2 text-sm">
                  Order
                  <Input value={form.sortOrder} onChange={(e) => setForm({ ...form, sortOrder: e.target.value })} className="w-20 h-8 bg-slate-900 border-slate-600" inputMode="numeric" />
                </label>
              </div>
              {formError && <p className="text-sm text-red-400">{formError}</p>}
              <div className="flex justify-end gap-2">
                <Button type="button" variant="ghost" onClick={() => setForm(null)} disabled={saving}>Cancel</Button>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {form.id ? "Save changes" : "Add reel"}
                </Button>
              </div>
            </div>
            <div>
              <p className="text-xs text-slate-400 mb-2">Preview</p>
              {parseInstagramUrl(form.instagramUrl) ? (
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-white max-w-[340px]">
                  <InstagramEmbed url={form.instagramUrl} title="Preview" className="h-[560px]" />
                </div>
              ) : (
                <div className="h-40 rounded-xl border border-dashed border-slate-600 flex items-center justify-center text-xs text-slate-500">
                  Paste a reel link to preview it
                </div>
              )}
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */

function OrdersTab() {
  const [orders, setOrders] = useState<DrapeOrder[]>([])
  const [status, setStatus] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [busy, setBusy] = useState<string | null>(null)
  const [tracking, setTracking] = useState<Record<string, string>>({})

  const load = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const data = await api<{ orders: DrapeOrder[] }>(`/api/admin/drape/orders${status ? `?status=${status}` : ""}`)
      setOrders(data.orders || [])
      setTracking(Object.fromEntries((data.orders || []).map((o) => [o.id, o.trackingInfo || ""])))
    } catch (e: any) {
      setError(e?.message || "Could not load orders")
    } finally {
      setLoading(false)
    }
  }, [status])

  useEffect(() => {
    load()
  }, [load])

  const replace = (o: DrapeOrder) => setOrders((list) => list.map((x) => (x.id === o.id ? o : x)))

  const update = async (o: DrapeOrder, patch: { status?: string; trackingInfo?: string }) => {
    setBusy(o.id)
    try {
      const data = await api<{ order: DrapeOrder }>(`/api/admin/drape/orders/${o.id}`, { method: "PATCH", body: JSON.stringify(patch) })
      replace(data.order)
    } catch (e: any) {
      alert(e?.message || "Could not update order")
    } finally {
      setBusy(null)
    }
  }

  const refund = async (o: DrapeOrder) => {
    if (!confirm(`Refund order #${o.orderNumber}? ${o.creditsCharged} credits go back to ${o.customerName}'s wallet. This can't be undone.`)) return
    setBusy(o.id)
    try {
      const data = await api<{ order: DrapeOrder }>(`/api/admin/drape/orders/${o.id}/refund`, { method: "POST" })
      replace(data.order)
    } catch (e: any) {
      alert(e?.message || "Refund failed")
    } finally {
      setBusy(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-slate-400">Show</span>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="h-9 rounded-md bg-slate-800 border border-slate-600 px-3 text-sm">
            <option value="">All orders</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
            ))}
          </select>
        </div>
        <p className="text-xs text-slate-400">Customer details are shown only here, for packing and delivery.</p>
      </div>

      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}
      {loading ? (
        <div className="py-20 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-emerald-500" /></div>
      ) : orders.length === 0 ? (
        <p className="text-slate-400 text-sm py-12 text-center">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o.id} className="bg-slate-800 border border-slate-700 rounded-xl p-4 space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">#{o.orderNumber}</p>
                  <p className="text-xs text-slate-400">{new Date(o.createdAt).toLocaleString("en-IN")}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{formatInr(o.totalInr)}</p>
                  <p className="text-xs text-slate-400">{o.creditsCharged} credits{o.shippingInr > 0 ? ` · incl. ${formatInr(o.shippingInr)} shipping` : " · free shipping"}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-1">
                  <p className="text-xs uppercase text-slate-400 font-semibold">Deliver to</p>
                  <p>{o.customerName} · {o.phone}</p>
                  {o.email && <p className="text-slate-300 text-xs">{o.email}</p>}
                  <p className="text-slate-300 text-xs whitespace-pre-line">
                    {o.addressLine}, {o.city}{o.state ? `, ${o.state}` : ""} – {o.pincode}
                  </p>
                  {o.notes && <p className="text-xs text-amber-300">Note: {o.notes}</p>}
                </div>
                <div className="space-y-1">
                  <p className="text-xs uppercase text-slate-400 font-semibold">Items</p>
                  {o.items.map((it) => (
                    <p key={it.id} className="text-xs text-slate-200">
                      {it.quantity} × {it.title}
                      {it.size ? ` · ${it.size}` : ""}
                      {it.color ? ` · ${it.color}` : ""} — {formatInr(it.unitPriceInr * it.quantity)}
                    </p>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-end gap-3 pt-2 border-t border-slate-700">
                {o.status === "refunded" ? (
                  <span className="text-xs font-semibold px-2 py-1 rounded bg-red-900 text-red-200">
                    Refunded{o.refundedAt ? ` on ${new Date(o.refundedAt).toLocaleDateString("en-IN")}` : ""}
                  </span>
                ) : (
                  <>
                    <div className="space-y-1">
                      <Label className="text-xs text-slate-400">Status</Label>
                      <select
                        value={o.status}
                        disabled={busy === o.id}
                        onChange={(e) => update(o, { status: e.target.value as OrderStatus })}
                        className="h-9 rounded-md bg-slate-900 border border-slate-600 px-3 text-sm"
                      >
                        {ORDER_STATUSES.filter((s) => s !== "refunded").map((s) => (
                          <option key={s} value={s}>{ORDER_STATUS_LABEL[s]}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1 flex-1 min-w-[220px]">
                      <Label className="text-xs text-slate-400">Tracking (courier + number or link)</Label>
                      <div className="flex gap-2">
                        <Input
                          value={tracking[o.id] ?? ""}
                          onChange={(e) => setTracking((t) => ({ ...t, [o.id]: e.target.value }))}
                          className="h-9 bg-slate-900 border-slate-600"
                          placeholder="e.g. Delhivery 1234567890"
                        />
                        <Button size="sm" variant="outline" className="border-slate-600 bg-transparent text-white h-9" disabled={busy === o.id} onClick={() => update(o, { trackingInfo: tracking[o.id] ?? "" })}>
                          Save
                        </Button>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="border-red-700 bg-transparent text-red-400 hover:bg-red-950 h-9" disabled={busy === o.id} onClick={() => refund(o)}>
                      <Undo2 className="mr-1 h-3.5 w-3.5" /> Refund to wallet
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      {children}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  )
}

function Modal({ title, onClose, children, wide }: { title: string; onClose: () => void; children: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [onClose])
  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div
        className={`relative w-full ${wide ? "max-w-4xl" : "max-w-2xl"} bg-slate-800 border border-slate-700 rounded-xl p-6 my-8 text-white`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-slate-700" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
