import { type Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { DashboardShell } from "@/components/home-new/DashboardShell"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Download,
  Layers,
  Zap,
  ShieldCheck,
  CheckCircle2,
  FileImage,
  ArrowRight,
  Cpu,
  Palette,
  Laptop,
  Globe,
  Sliders,
  Maximize2
} from "lucide-react"

export const metadata: Metadata = {
  title: "Free Image Editing Software for Web & PC (2026) — PhotoLite by Celoris",
  description:
    "Free image editing software for Web and Windows PC. Full layer effects, PSD support, RAW camera processing, and 240 FPS GPU acceleration. 100% Free & No Subscription.",
  keywords: [
    "free image editing software",
    "free image editor for pc",
    "free photo editor windows",
    "free photoshop alternative online",
    "photolite studio",
    "free layer based photo editor",
    "celoris designs photolite"
  ],
  openGraph: {
    title: "Free Image Editing Software for Web & PC — PhotoLite Studio",
    description:
      "Professional photo editing in your browser and native Windows desktop. Dual MIT/Apache open architecture, multi-layer effects, zero watermarks.",
    images: [{ url: "/photolite-studio-preview.png", width: 1200, height: 630 }],
  },
}

export default function FreeImageEditorPage() {
  return (
    <DashboardShell>
      <div className="min-h-screen bg-[#070b12] text-slate-200 selection:bg-emerald-500/30 font-sans pb-24">
        {/* Hero Section */}
        <section className="relative pt-20 pb-16 px-6 lg:px-8 overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#0c1424]/80 via-[#070b12] to-[#070b12]">
          {/* Subtle Cyber Glowing Background Orbs */}
          <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full" />
          <div className="pointer-events-none absolute top-1/3 left-1/3 w-[500px] h-[250px] bg-cyan-500/10 blur-[120px] rounded-full" />

          <div className="max-w-6xl mx-auto text-center relative z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold tracking-wide mb-6 shadow-sm">
              <Sparkles size={14} className="text-emerald-400 animate-pulse" />
              <span>Free Image Editing Software • Web & Windows 64-bit PC</span>
            </div>

            {/* H1 Heading targeting core search keywords */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
              Professional Image Editing. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Free for Web & Windows PC.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
              PhotoLite gives you full Photoshop-grade multi-layer editing, PSD file compatibility, 
              blend modes, filter effects, and hardware-accelerated performance — with 
              <strong className="text-white font-semibold"> zero subscriptions, zero watermarks</strong>, and full offline desktop support.
            </p>

            {/* Dual CTAs: Launch Web vs Download PC */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto">
              <Button
                asChild
                size="lg"
                className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold text-base shadow-xl shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Link href="/photolite" className="flex items-center justify-center gap-2.5">
                  <Globe className="h-5 w-5" />
                  <span>Launch Free Web Editor</span>
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>

              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-white/5 hover:bg-white/10 text-white border-white/15 hover:border-emerald-500/40 font-semibold text-base shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <a href="/PhotoLite-Windows-x64.zip" download="PhotoLite-Windows-x64.zip" className="flex items-center justify-center gap-2.5">
                  <Laptop className="h-5 w-5 text-emerald-400" />
                  <span>Download for Windows PC</span>
                  <Download className="h-4 w-4 text-emerald-400" />
                </a>
              </Button>
            </div>

            {/* Quick Proof Badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 100% Free & Open Source
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Native 64-bit DirectX / WGPU
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> PSD, PNG, JPEG, RAW, WebP
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Works Offline on PC
              </span>
            </div>
          </div>

          {/* Interactive Preview Screenshot Card */}
          <div className="max-w-5xl mx-auto mt-14 relative z-10">
            <div className="rounded-2xl p-2 sm:p-3 bg-gradient-to-b from-white/15 to-white/5 border border-white/15 shadow-2xl backdrop-blur-xl">
              <div className="relative rounded-xl overflow-hidden border border-black/80 aspect-[16/9] bg-[#1a1a1a]">
                <Image
                  src="/photolite-studio-preview.png"
                  alt="PhotoLite Studio - Free Image Editing Software Interface"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Core Value Pillars Section */}
        <section className="py-20 px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything You Need in a Creative Studio
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              Whether you need quick web adjustments or heavy 36-megapixel RAW composition on your Windows workstation, PhotoLite delivers unmatched speed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-6 text-emerald-400 group-hover:scale-110 transition-transform">
                <Layers className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Multi-Layer & PSD Engine</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Work seamlessly with full non-destructive layers, blend modes (Multiply, Screen, Overlay), masks, group folders, and import/export standard Adobe Photoshop .PSD files.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-6 text-cyan-400 group-hover:scale-110 transition-transform">
                <Cpu className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Hardware GPU Acceleration</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Built on native Rust with WGPU and modern WebGL. Experience liquid-smooth 240 FPS canvas panning, instant zoom, and real-time GPU brush rendering.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-teal-500/40 transition-all group">
              <div className="w-14 h-14 rounded-2xl bg-teal-500/10 border border-teal-500/20 flex items-center justify-center mb-6 text-teal-400 group-hover:scale-110 transition-transform">
                <ShieldCheck className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">100% Free & Private</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                No monthly recurring fees, no surprise credit card charges, and no cloud uploads of your personal photos. Your artwork stays strictly on your machine.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Comparison Table */}
        <section className="py-16 px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-8 sm:p-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8">
              Why Creators Choose PhotoLite
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-slate-400">
                    <th className="py-4 font-semibold">Features</th>
                    <th className="py-4 font-semibold text-emerald-400">PhotoLite Studio</th>
                    <th className="py-4 font-semibold">Typical Paid Suites</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  <tr>
                    <td className="py-4 font-medium text-white">Price</td>
                    <td className="py-4 text-emerald-400 font-bold">100% Free</td>
                    <td className="py-4 text-slate-400">₹1,800+/month</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-white">Platforms</td>
                    <td className="py-4 text-slate-200">Browser + Native Windows PC</td>
                    <td className="py-4 text-slate-400">Heavy Desktop Only</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-white">PSD & RAW Support</td>
                    <td className="py-4 text-emerald-400">Yes (Native Engine)</td>
                    <td className="py-4 text-slate-200">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-white">Watermarks</td>
                    <td className="py-4 text-emerald-400 font-semibold">Never</td>
                    <td className="py-4 text-slate-400">Restricted on Free Tiers</td>
                  </tr>
                  <tr>
                    <td className="py-4 font-medium text-white">Offline Desktop Mode</td>
                    <td className="py-4 text-emerald-400">Yes (Portable, No Install)</td>
                    <td className="py-4 text-slate-400">Requires DRM Login</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* SEO FAQ Section */}
        <section className="py-16 px-6 lg:px-8 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-base font-bold text-white mb-2">Is PhotoLite completely free image editing software?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Yes! PhotoLite by Celoris Designs is dual-licensed and completely free. You can use the web version directly in your browser or download the native 64-bit Windows edition without paying any licensing or subscription fees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-base font-bold text-white mb-2">Does PhotoLite open and save Photoshop (.PSD) files?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Yes. Both our web and desktop editions contain a built-in PSD engine that decodes layers, blend modes, adjustments, and transparency so you can collaborate easily with Photoshop users.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-base font-bold text-white mb-2">What are the system requirements for PhotoLite Desktop on Windows?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                PhotoLite Desktop runs on Windows 10 and Windows 11 (64-bit). It is compiled with static CRT dependencies and native DirectX/WGPU support, meaning you do not even need an installer — simply extract the portable zip and run `photolite.exe`.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="mt-12 px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-tr from-emerald-950/60 via-[#11221b] to-slate-900 border border-emerald-500/30 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Start Creating with PhotoLite Today
            </h2>
            <p className="text-slate-300 text-base max-w-xl mx-auto mb-8 font-normal">
              No credit card. No download required for web. Instant creativity for artists, designers, and photo enthusiasts.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-13 px-8 rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer">
                <Link href="/photolite">Launch Web Editor Now</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/20 bg-black/40 hover:bg-white/10 text-white font-medium h-13 px-8 rounded-xl cursor-pointer">
                <a href="/PhotoLite-Windows-x64.zip" download="PhotoLite-Windows-x64.zip">
                  Download Windows PC (64-bit)
                </a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  )
}
