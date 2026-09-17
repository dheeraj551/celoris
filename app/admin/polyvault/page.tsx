"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, ArrowLeft, Box, RefreshCw, UploadCloud, FileCheck2, Loader2, ShieldCheck } from "lucide-react"
import {
    getRealModelLoaderKind,
    loadRealModelObject,
    normalizeAndCenterObject,
    standardizeMaterials,
} from "@/components/polyvault/utils/modelLoaders"
import type { AssetCategory, ModelFormat, ModelGeneratorType } from "@/components/polyvault/types"

interface AdminModelAsset {
    id: string
    title: string
    description: string
    category: string
    price: number
    formats: string[]
    author: { name: string; handle: string; badge: string }
    thumbnailDataUrl?: string
    createdAt: string
}

const CATEGORIES: Exclude<AssetCategory, "All">[] = [
    "Sci-Fi", "Characters", "Vehicles", "Architecture", "Weapons", "Nature", "Props", "Electronics",
]
const FORMATS: ModelFormat[] = ["GLTF", "GLB", "FBX", "OBJ", "BLEND", "USDZ"]

/** Renders one offscreen snapshot of the real uploaded model file for the
 *  catalog-grid thumbnail — same approach as PolyVault's own UploadModal,
 *  so admin-published listings look identical to creator-published ones. */
async function generateModelThumbnail(file: File): Promise<string | null> {
    const loaderKind = getRealModelLoaderKind(file.name)
    if (!loaderKind) return null

    const objectUrl = URL.createObjectURL(file)
    let renderer: THREE.WebGLRenderer | null = null

    try {
        const width = 480
        const height = 360
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0x090d16)

        const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100)
        camera.position.set(2.6, 1.8, 3.2)
        camera.lookAt(0, 0, 0)

        const keyLight = new THREE.DirectionalLight("#fef08a", 1.7)
        keyLight.position.set(3, 4, 3)
        const fillLight = new THREE.DirectionalLight("#38bdf8", 0.9)
        fillLight.position.set(-3, 2, -2)
        const ambient = new THREE.AmbientLight("#1e293b", 0.8)
        scene.add(keyLight, fillLight, ambient)

        const canvas = document.createElement("canvas")
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true })
        renderer.setSize(width, height)
        renderer.toneMapping = THREE.ACESFilmicToneMapping

        const object = await loadRealModelObject(objectUrl, loaderKind)
        normalizeAndCenterObject(object)
        standardizeMaterials(object)
        object.rotation.y = Math.PI / 5.5
        scene.add(object)

        renderer.render(scene, camera)
        return canvas.toDataURL("image/jpeg", 0.72)
    } catch (err) {
        console.error("Admin PolyVault: failed to generate a thumbnail, falling back to placeholder", err)
        return null
    } finally {
        URL.revokeObjectURL(objectUrl)
        renderer?.dispose()
    }
}

async function uploadModelFileToR2(file: File): Promise<string> {
    const signRes = await fetch("/api/admin/polyvault/sign-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, contentType: file.type || "application/octet-stream" }),
    })
    if (!signRes.ok) {
        const body = await signRes.json().catch(() => ({}))
        throw new Error(body?.error || "Failed to prepare upload")
    }
    const { uploadUrl, key } = await signRes.json()
    const putRes = await fetch(uploadUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
    })
    if (!putRes.ok) throw new Error("Upload to storage failed")
    return key
}

const emptyForm = {
    title: "",
    description: "",
    category: "Props" as Exclude<AssetCategory, "All">,
    price: 0,
    originalPrice: 0,
    polyCount: 25000,
    formats: ["GLTF"] as ModelFormat[],
    tagsInput: "",
    isPbr: true,
    isRigged: false,
    isAnimated: false,
    generatorType: "drone" as ModelGeneratorType,
    primaryColor: "#0ea5e9",
    accentColor: "#38bdf8",
}

export default function AdminPolyVault() {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [authLoading, setAuthLoading] = useState(true)
    const [assets, setAssets] = useState<AdminModelAsset[]>([])
    const [loading, setLoading] = useState(true)
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [submitError, setSubmitError] = useState<string | null>(null)
    const [modelFile, setModelFile] = useState<File | null>(null)
    const [form, setForm] = useState(emptyForm)
    const router = useRouter()

    useEffect(() => {
        checkAdminAuth()
    }, [])

    const checkAdminAuth = () => {
        try {
            const adminSession = localStorage.getItem("admin_session")
            if (!adminSession) {
                router.push("/admin/login")
                return
            }
            const session = JSON.parse(adminSession)
            const sessionAge = Date.now() - session.timestamp
            const maxAge = 24 * 60 * 60 * 1000
            if (sessionAge > maxAge) {
                localStorage.removeItem("admin_session")
                router.push("/admin/login")
                return
            }
            setIsAuthenticated(true)
            fetchAssets()
        } catch (error) {
            console.error("Admin auth error:", error)
            router.push("/admin/login")
        } finally {
            setAuthLoading(false)
        }
    }

    const fetchAssets = async () => {
        try {
            setLoading(true)
            const response = await fetch("/api/admin/polyvault", { cache: "no-store" })
            if (response.ok) {
                const data = await response.json()
                setAssets(data.assets || [])
            }
        } catch (error) {
            console.error("Error fetching PolyVault assets:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this model listing? This also removes its uploaded file from storage.")) return
        try {
            const response = await fetch(`/api/admin/polyvault/${id}`, { method: "DELETE" })
            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || "Failed to delete listing")
            }
            setAssets((prev) => prev.filter((a) => a.id !== id))
        } catch (error: any) {
            alert(`Error deleting listing: ${error.message}`)
        }
    }

    const toggleFormat = (fmt: ModelFormat) => {
        setForm((prev) => ({
            ...prev,
            formats: prev.formats.includes(fmt) ? prev.formats.filter((f) => f !== fmt) : [...prev.formats, fmt],
        }))
    }

    const resetForm = () => {
        setForm(emptyForm)
        setModelFile(null)
        setSubmitError(null)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title.trim()) return
        setSubmitError(null)
        setSubmitting(true)

        let r2ModelKey: string | undefined
        let thumbnailDataUrl: string | undefined

        if (modelFile) {
            try {
                const [key, thumb] = await Promise.all([
                    uploadModelFileToR2(modelFile),
                    generateModelThumbnail(modelFile),
                ])
                r2ModelKey = key
                thumbnailDataUrl = thumb || undefined
            } catch (err: any) {
                setSubmitting(false)
                setSubmitError(err?.message || "Failed to upload model file.")
                return
            }
        }

        try {
            const response = await fetch("/api/admin/polyvault", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: form.title.trim(),
                    description: form.description.trim(),
                    category: form.category,
                    price: Number(form.price) || 0,
                    originalPrice: form.originalPrice > 0 ? Number(form.originalPrice) : undefined,
                    polyCount: Number(form.polyCount) || 0,
                    vertexCount: Math.round(Number(form.polyCount) * 1.05),
                    formats: form.formats.length > 0 ? form.formats : ["GLTF"],
                    textures: form.isPbr ? ["Albedo 4K", "Normal 4K", "Roughness 4K", "Metallic 4K", "AO 4K"] : [],
                    isRigged: form.isRigged,
                    isAnimated: form.isAnimated,
                    isPbr: form.isPbr,
                    fileSizeMb: modelFile ? Math.max(1, Math.round(modelFile.size / (1024 * 1024))) : 0,
                    license: form.price === 0 ? "CC0 Free" : "Standard Commercial",
                    tags: form.tagsInput.split(",").map((t) => t.trim().toLowerCase()).filter(Boolean),
                    generatorType: form.generatorType,
                    primaryColor: form.primaryColor,
                    accentColor: form.accentColor,
                    r2ModelKey,
                    modelFileName: modelFile?.name,
                    thumbnailDataUrl,
                }),
            })

            const body = await response.json().catch(() => ({}))
            if (!response.ok) throw new Error(body?.error || "Failed to publish listing")

            setIsDialogOpen(false)
            resetForm()
            fetchAssets()
        } catch (error: any) {
            setSubmitError(error?.message || "Failed to publish listing. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
                    <p className="mt-4 text-slate-300">Checking admin session...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" className="text-white" onClick={() => router.push("/admin/dashboard")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-white">PolyVault Models</h1>
                            <p className="text-sm text-slate-400 flex items-center gap-1.5 mt-1">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Admin-published listings — published as "Celoris Official", separate from creator uploads.
                            </p>
                        </div>
                    </div>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => { setIsDialogOpen(open); if (!open) resetForm() }}>
                        <DialogTrigger asChild>
                            <Button className="bg-emerald-600 hover:bg-emerald-700">
                                <Plus className="mr-2 h-4 w-4" />
                                Upload Model
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-2xl max-h-[85vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Publish a PolyVault Listing</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="pv-title">Model Title</Label>
                                    <Input
                                        id="pv-title"
                                        required
                                        value={form.title}
                                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                        placeholder="e.g. Cybernetic Recon Drone Mk.IV"
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pv-desc">Description</Label>
                                    <Textarea
                                        id="pv-desc"
                                        rows={2}
                                        value={form.description}
                                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                        placeholder="Polygon budget, topology, intended engine..."
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="pv-category">Category</Label>
                                        <select
                                            id="pv-category"
                                            value={form.category}
                                            onChange={(e) => setForm((p) => ({ ...p, category: e.target.value as any }))}
                                            className="flex h-10 w-full rounded-md border border-slate-600 bg-slate-700 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                        >
                                            {CATEGORIES.map((c) => (
                                                <option key={c} value={c}>{c}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pv-price">Price (₹ INR)</Label>
                                        <Input
                                            id="pv-price"
                                            type="number"
                                            min="0"
                                            value={form.price}
                                            onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
                                            className="bg-slate-700 border-slate-600 text-white font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="pv-poly">Polygon Count</Label>
                                        <Input
                                            id="pv-poly"
                                            type="number"
                                            min="100"
                                            value={form.polyCount}
                                            onChange={(e) => setForm((p) => ({ ...p, polyCount: Number(e.target.value) }))}
                                            className="bg-slate-700 border-slate-600 text-white font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Included Formats</Label>
                                    <div className="flex flex-wrap gap-2">
                                        {FORMATS.map((fmt) => (
                                            <button
                                                type="button"
                                                key={fmt}
                                                onClick={() => toggleFormat(fmt)}
                                                className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold transition-colors cursor-pointer ${
                                                    form.formats.includes(fmt)
                                                        ? "bg-emerald-600 text-white border-emerald-600"
                                                        : "bg-slate-700 border-slate-600 text-slate-300 hover:border-slate-500"
                                                }`}
                                            >
                                                .{fmt}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-6 pt-2 border-t border-slate-700">
                                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm">
                                        <Switch checked={form.isPbr} onCheckedChange={(v) => setForm((p) => ({ ...p, isPbr: v }))} />
                                        PBR Textures
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm">
                                        <Switch checked={form.isRigged} onCheckedChange={(v) => setForm((p) => ({ ...p, isRigged: v }))} />
                                        Rigged Mesh
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm">
                                        <Switch checked={form.isAnimated} onCheckedChange={(v) => setForm((p) => ({ ...p, isAnimated: v }))} />
                                        Animated
                                    </label>
                                </div>

                                <div className="space-y-1.5 pt-2 border-t border-slate-700">
                                    <Label>Model File (optional)</Label>
                                    <label
                                        htmlFor="pv-model-file"
                                        className={`flex items-center gap-3 w-full border border-dashed rounded-xl px-3.5 py-3 cursor-pointer transition-colors ${
                                            modelFile ? "bg-emerald-900/30 border-emerald-600" : "bg-slate-700/50 border-slate-600 hover:border-emerald-600"
                                        }`}
                                    >
                                        {modelFile ? (
                                            <FileCheck2 className="w-4 h-4 text-emerald-400 shrink-0" />
                                        ) : (
                                            <UploadCloud className="w-4 h-4 text-slate-400 shrink-0" />
                                        )}
                                        <span className="text-xs text-slate-300 truncate">
                                            {modelFile
                                                ? `${modelFile.name} (${Math.max(1, Math.round(modelFile.size / (1024 * 1024)))} MB)`
                                                : "Choose a .glb, .gltf, .fbx, .obj, .blend, .usdz or .zip file"}
                                        </span>
                                        <input
                                            id="pv-model-file"
                                            type="file"
                                            accept=".glb,.gltf,.fbx,.obj,.blend,.usdz,.zip"
                                            className="hidden"
                                            onChange={(e) => setModelFile(e.target.files?.[0] || null)}
                                        />
                                    </label>
                                    <p className="text-[11px] text-slate-500">
                                        Without a file, this publishes as a preview-only listing. With a .glb/.gltf/.obj/.fbx file, a real
                                        snapshot is captured automatically for the store thumbnail.
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="pv-tags">Tags (comma separated)</Label>
                                    <Input
                                        id="pv-tags"
                                        value={form.tagsInput}
                                        onChange={(e) => setForm((p) => ({ ...p, tagsInput: e.target.value }))}
                                        placeholder="sci-fi, 3d, game-ready"
                                        className="bg-slate-700 border-slate-600 text-white"
                                    />
                                </div>

                                {submitError && <p className="text-sm text-rose-400 font-medium">{submitError}</p>}

                                <div className="flex justify-end gap-3 mt-6">
                                    <Button type="button" variant="ghost" onClick={() => setIsDialogOpen(false)} className="hover:bg-slate-700">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={submitting} className="bg-emerald-600 hover:bg-emerald-700">
                                        {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        {submitting ? "Publishing..." : "Publish Listing"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card className="bg-slate-800 border-slate-700">
                    <CardHeader>
                        <CardTitle className="text-white flex items-center justify-between">
                            <span>Admin-Published Listings ({assets.length})</span>
                            <Button variant="ghost" size="sm" onClick={fetchAssets} className="text-slate-400 hover:text-white">
                                <RefreshCw className="h-4 w-4" />
                            </Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center text-slate-400 py-8">Loading...</div>
                        ) : assets.length === 0 ? (
                            <div className="text-center py-12 text-slate-500">
                                <Box className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No admin-published models yet.</p>
                                <p className="text-sm">Upload the first one to add it to the PolyVault catalog.</p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-slate-700 hover:bg-slate-800">
                                        <TableHead className="text-slate-300">Preview</TableHead>
                                        <TableHead className="text-slate-300">Title</TableHead>
                                        <TableHead className="text-slate-300">Category</TableHead>
                                        <TableHead className="text-slate-300">Price</TableHead>
                                        <TableHead className="text-slate-300">Formats</TableHead>
                                        <TableHead className="text-slate-300">Author</TableHead>
                                        <TableHead className="text-slate-300 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {assets.map((asset) => (
                                        <TableRow key={asset.id} className="border-slate-700 hover:bg-slate-750">
                                            <TableCell>
                                                <div className="w-16 h-16 bg-slate-700 rounded overflow-hidden flex items-center justify-center">
                                                    {asset.thumbnailDataUrl ? (
                                                        <img src={asset.thumbnailDataUrl} alt={asset.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Box className="h-6 w-6 text-slate-500" />
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-white max-w-xs truncate" title={asset.title}>
                                                {asset.title}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="border-slate-600 text-slate-300">
                                                    {asset.category}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-slate-300 font-mono">
                                                {asset.price === 0 ? "Free" : `₹${asset.price}`}
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-xs font-mono">
                                                {asset.formats.join(", ")}
                                            </TableCell>
                                            <TableCell>
                                                <Badge className="bg-emerald-900/50 text-emerald-300 border-emerald-700">
                                                    {asset.author?.name || "Celoris Official"}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    onClick={() => handleDelete(asset.id)}
                                                    className="h-8 w-8 p-0"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
