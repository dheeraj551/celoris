import { type Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  Download,
  Layers,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Laptop,
  Globe,
  Scissors,
  Share2,
  FileCode2,
  GraduationCap,
  HelpCircle,
  Play
} from "lucide-react"

export const metadata: Metadata = {
  title: "Free Image Editor for Web & Windows PC – PhotoLite",
  description:
    "Free online image editor and Windows PC app with layers, PSD files, blend modes and filters. No watermark, no subscription, works offline.",
  alternates: {
    canonical: "/free-image-editor",
  },
  keywords: [
    "free image editor",
    "free photo editor for pc",
    "online psd editor",
    "free photoshop alternative",
    "free image editing software",
    "photolite studio",
    "free layer based photo editor",
    "photo editor without subscription"
  ],
  openGraph: {
    title: "Free Image Editor for Web & Windows PC – PhotoLite",
    description:
      "Free online image editor and Windows PC app with layers, PSD files, blend modes and filters. No watermark, no subscription, works offline.",
    url: "https://celorisdesigns.com/free-image-editor",
    images: [{ url: "/photolite-studio-preview.png", width: 1200, height: 630 }],
  },
}

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "PhotoLite",
  "operatingSystem": "Windows 10, Windows 11, Web",
  "applicationCategory": "MultimediaApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "INR"
  },
  "downloadUrl": "https://celorisdesigns.com/PhotoLite-Windows-x64.zip",
  "screenshot": "https://celorisdesigns.com/photolite-studio-preview.png",
  "description": "Free online image editor and Windows PC app with layers, PSD files, blend modes, and filters. No watermark, no subscription, works offline."
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Is PhotoLite completely free with no subscription?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! PhotoLite by Celoris Designs is completely free to use online in your browser or as a native Windows 64-bit desktop download. There are zero subscription fees, no locked features, and no watermarks."
      }
    },
    {
      "@type": "Question",
      "name": "Can I open and edit PSD files without Photoshop?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. PhotoLite includes a built-in PSD engine that opens and preserves multi-layer Photoshop (.PSD) documents, layer masks, opacity, and blend modes directly on Web and PC."
      }
    },
    {
      "@type": "Question",
      "name": "Does PhotoLite work offline on Windows PC?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. The desktop edition is a native 64-bit portable app for Windows 10 and 11. It does not require installation or internet access to edit your photos."
      }
    },
    {
      "@type": "Question",
      "name": "Free photo editor kaise use kare? (How to use PhotoLite in Hindi)",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "PhotoLite ko use karna bilkul aasan hai. Aap seedha 'Launch Free Web Editor' button par click karke apne browser me hi image open kar sakte hain, ya Windows PC ke liye portable version download karke bina internet ke layers aur filters ke sath photo edit kar sakte hain."
      }
    }
  ]
}

export default function FreeImageEditorPage() {
  return (
    <>
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-[#070b12] text-slate-200 selection:bg-emerald-500/30 font-sans pb-24">
        {/* Hero Section */}
        <section className="relative pt-16 pb-16 px-6 lg:px-8 overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#0c1424]/90 via-[#070b12] to-[#070b12]">
          {/* Subtle Cyber Glowing Background Orbs */}
          <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full" />
          <div className="pointer-events-none absolute top-1/3 left-1/3 w-[500px] h-[250px] bg-cyan-500/10 blur-[120px] rounded-full" />

          <div className="max-w-6xl mx-auto text-center relative z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold tracking-wide mb-6 shadow-sm">
              <Sparkles size={14} className="text-emerald-400 animate-pulse" />
              <span>Free Image Editing Software • Web & Windows 64-bit PC</span>
            </div>

            {/* Exactly 1 Single H1 on the entire page */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
              Professional Image Editing. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Free for Web & Windows PC.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-xl text-slate-300 max-w-3xl mx-auto font-normal leading-relaxed mb-10">
              PhotoLite gives you full multi-layer editing, PSD file compatibility, 
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
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 100% Free & Open Architecture
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
                  alt="PhotoLite Studio - Free image editor for Web and Windows PC showing multi-layer workspace"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Task-Based Search Sections (Targeting High-Intent User Queries) */}
        <section className="py-20 px-6 lg:px-8 max-w-6xl mx-auto border-b border-white/5">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Real Creative Tasks Made Simple
            </h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-base">
              Learn how creators, digital artists, and students use PhotoLite for everyday graphic workflows without expensive commercial subscriptions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Task 1: Background Removal */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                  <Scissors className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">How do I remove an image background for free?</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Use the Magic Wand or Magnetic Lasso tools to select your subject with sub-pixel precision. Invert your selection with <kbd className="px-1.5 py-0.5 bg-black/60 rounded text-cyan-400 text-xs font-mono">Ctrl+Shift+I</kbd> and hit Delete for an instant transparent PNG export.
              </p>
              <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <span>Magic Wand • Lasso • Transparent PNG Export</span>
              </div>
            </div>

            {/* Task 2: Thumbnail & Social Resize */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-cyan-500/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-cyan-500/10 rounded-xl text-cyan-400">
                  <Share2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">How to resize images for YouTube thumbnails and Instagram?</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Select predefined canvas aspect ratios like 16:9 (1280×720 for YouTube) or 1:1 and 4:5 for Instagram posts. High-resolution Lanczos resampling prevents any pixel blur or artifacting.
              </p>
              <div className="text-xs text-cyan-400 font-semibold flex items-center gap-1">
                <span>16:9 YouTube Presets • 9:16 Reels • Zero Blur Resample</span>
              </div>
            </div>

            {/* Task 3: Edit PSD Online */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-teal-500/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-teal-500/10 rounded-xl text-teal-400">
                  <FileCode2 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">Can I edit PSD files online without Photoshop?</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Yes. Simply drag and drop any .PSD document directly into PhotoLite. All individual layers, text layers, vector masks, and layer blend modes are preserved and fully editable.
              </p>
              <div className="text-xs text-teal-400 font-semibold flex items-center gap-1">
                <span>Native PSD Parser • Layer Blend Modes • Text Layers</span>
              </div>
            </div>

            {/* Task 4: Poster Design */}
            <div className="p-8 rounded-3xl bg-white/[0.03] border border-white/10 hover:border-purple-500/30 transition-all">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                  <Layers className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold text-white">How to design marketing posters and creative flyers?</h3>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed mb-4">
                Combine vector typography, custom Bézier shapes, and photo composite layers. Add drop shadows, outer glows, and bevel effects via the native Layer Styles dialog with live GPU preview.
              </p>
              <div className="text-xs text-purple-400 font-semibold flex items-center gap-1">
                <span>Bézier Vector Pen • Typography • Layer fx Styles</span>
              </div>
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

        {/* Level Up Your Skills — Internal Outbound Links */}
        <section className="py-16 px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-blue-950/40 via-[#0e1726] to-[#070b12] border border-blue-500/20">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">
                Master Professional Design & Animation
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Want to master industry design tools and video creation?
            </h2>
            <p className="text-slate-300 text-sm max-w-2xl mb-6 leading-relaxed">
              Enhance your PhotoLite skills with our guided career training programs. Learn professional composition, typography, and viral short-form video creation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/courses/adobe-photoshop-with-ai"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md"
              >
                <span>Learn Professional Photo Editing Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/free-courses-with-certificate/social-media-reels"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
              >
                <span>Learn Reels & Video Editing Free</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/graphic-designing-course-noida"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
              >
                <span>Graphic Design Certificate Course</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* SEO FAQ Section with Hindi FAQ for Indian Searchers */}
        <section className="py-16 px-6 lg:px-8 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-base font-bold text-white mb-2">Is PhotoLite completely free with no subscription?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Yes! PhotoLite by Celoris Designs is completely free to use online in your browser or as a native Windows 64-bit desktop download. There are zero subscription fees, no locked features, and no watermarks on exports.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-base font-bold text-white mb-2">Can I open and edit PSD files without commercial software?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Yes. Both our web and desktop editions contain a built-in PSD engine that decodes layers, blend modes, adjustments, and transparency so you can collaborate easily on industry-standard design templates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-base font-bold text-white mb-2">Does PhotoLite work offline on Windows PC?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Yes. The desktop edition is compiled natively with static CRT libraries and WGPU/DirectX graphics. It requires no installer or internet connection — just extract the portable zip file and run `photolite.exe`.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
              <h3 className="text-base font-bold text-emerald-300 mb-2">Free photo editor kaise use kare? (PhotoLite Kaise Chalayein?)</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                PhotoLite ko use karna behad aasan hai:
                <br />
                1. <strong>Online Web Mode:</strong> Upar diye gaye <em>Launch Free Web Editor</em> button par click karke aap seedha apne browser me photo open karke layers, text aur filters laga sakte hain bina kisi login ya software install kiye.
                <br />
                2. <strong>Windows PC Mode:</strong> <em>Download for Windows PC</em> link par click karke zip file download karein. Ise extract karke `photolite.exe` run karein — ye bina internet ke 240 FPS GPU speed ke sath offline kaam karta hai.
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
    </>
  )
}
