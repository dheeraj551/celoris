import { type Metadata } from "next"
import Link from "next/link"
import { PsdDropzone } from "@/components/open-psd-online/PsdDropzone"
import { WindowsDownloadCta } from "@/components/free-image-editor/WindowsDownloadCta"
import { Button } from "@/components/ui/button"
import {
  FileCode2,
  Layers,
  Zap,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Globe,
  Lock,
  Cpu,
  Download,
  Eye,
  SlidersHorizontal,
  FolderOpen,
  Sparkles,
  HelpCircle,
  Laptop
} from "lucide-react"

export const metadata: Metadata = {
  title: "Open PSD Files Online Free (No Photoshop Needed) — PhotoLite",
  description:
    "Free online PSD viewer and layer editor. Open Adobe Photoshop .PSD and .PSB files directly in your web browser with layers, vector masks, text, and blend modes intact. Zero login, 100% private.",
  alternates: {
    canonical: "/open-psd-online",
  },
  keywords: [
    "open psd file online",
    "open psd online free",
    "psd viewer online free",
    "edit psd without photoshop",
    "free psd editor",
    "view psd files online",
    "open psd in browser",
    "psd to png online free",
    "photoshop alternative online"
  ],
  openGraph: {
    title: "Open PSD Files Online Free (No Photoshop Needed) — PhotoLite",
    description:
      "Open, view, and edit Adobe Photoshop .PSD files in your browser with full layers, blend modes, and transparency. 100% free with no login required.",
    url: "https://celorisdesigns.com/open-psd-online",
    siteName: "Celoris Designs",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Open PSD Files Online Free — PhotoLite",
    description:
      "View and edit PSD layers in your browser without Adobe Photoshop. Zero watermarks, zero subscription fees.",
  },
}

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "PhotoLite Online PSD Viewer & Layer Editor",
  "url": "https://celorisdesigns.com/open-psd-online",
  "description": "Free web-based PSD viewer and editor that opens Adobe Photoshop files with full layers, blend modes, and masks without requiring Photoshop installation.",
  "applicationCategory": "DesignApplication",
  "operatingSystem": "All (Web Browser), Windows 10, Windows 11",
  "browserRequirements": "Requires WebAssembly / HTML5 Canvas support",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  }
}

const howToSchema = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  "name": "How to Open and Edit a PSD File Online Without Photoshop",
  "description": "Step-by-step tutorial to inspect, edit, and export Adobe Photoshop PSD files for free using your web browser.",
  "step": [
    {
      "@type": "HowToStep",
      "name": "Step 1: Upload or Drop Your PSD File",
      "text": "Drag and drop your .PSD or .PSB file into the PhotoLite dropzone, or click 'Browse Computer' to select it from your file explorer."
    },
    {
      "@type": "HowToStep",
      "name": "Step 2: Inspect Layers and Make Edits",
      "text": "PhotoLite's browser engine parses the binary PSD format locally in memory. Toggle layer visibility, reorder layers, adjust opacity, apply filters, or edit text."
    },
    {
      "@type": "HowToStep",
      "name": "Step 3: Export in High Resolution",
      "text": "Click Export to save individual layers or the full composition as PNG, JPEG, WebP, or preserve your work as a PSD."
    }
  ]
}

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How can I open a PSD file without Adobe Photoshop?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can open any .PSD or .PSB file directly in your browser using PhotoLite. Just drag and drop your PSD file onto this page — it decodes layers, masks, and blend modes instantly without requiring Adobe Creative Cloud or any paid software."
      }
    },
    {
      "@type": "Question",
      "name": "Is my PSD file uploaded to an external server? (Privacy Check)",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. PhotoLite parses and renders your PSD file 100% locally inside your web browser using HTML5 Canvas and WebAssembly. Your graphics, confidential client files, and personal images are never uploaded to any remote server or cloud."
      }
    },
    {
      "@type": "Question",
      "name": "Does PhotoLite preserve Photoshop layer transparency and blend modes?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. PhotoLite supports standard Adobe Photoshop blend modes (Multiply, Screen, Overlay, Soft Light, Darken, etc.), layer opacities, alpha transparency channels, and layer groups."
      }
    },
    {
      "@type": "Question",
      "name": "Can I open PSD files on a Mac, Windows PC, or Chromebook?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! Because PhotoLite runs on modern web standards (WebGPU / WebAssembly), it works seamlessly across Google Chrome, Microsoft Edge, Mozilla Firefox, and Apple Safari on Windows, macOS, Linux, and ChromeOS."
      }
    },
    {
      "@type": "Question",
      "name": "Bina Photoshop ke PSD file kaise open kare? (How to open PSD file in Hindi)",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "PhotoLite ke sath aap bina kisi paid software ke PSD file open kar sakte hain. Upar diye gaye box me apni PSD file drag & drop karein ya 'Browse' par click karein. Ye bina kisi login ya subscription ke aapke browser me layers aur filters ke sath file ko open kar deta hai."
      }
    }
  ]
}

export default function OpenPsdOnlinePage() {
  return (
    <>
      {/* Schema.org Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="min-h-screen bg-[#070b12] text-slate-200 selection:bg-emerald-500/30 font-sans pb-24">
        {/* Hero Section with Interactive PSD Dropzone */}
        <section className="relative pt-16 pb-16 px-6 lg:px-8 overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#0c1424]/90 via-[#070b12] to-[#070b12]">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full" />
          <div className="pointer-events-none absolute top-1/3 left-1/3 w-[500px] h-[250px] bg-cyan-500/10 blur-[120px] rounded-full" />

          <div className="max-w-6xl mx-auto text-center relative z-10">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-semibold tracking-wide mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Free Online PSD Viewer & Layer Editor • No Photoshop Needed</span>
            </div>

            {/* Main H1 */}
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-[1.12] mb-6">
              Open & Edit PSD Files Online. <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                100% Free in Your Browser.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed mb-10">
              Need to open an Adobe Photoshop design file without a Creative Cloud subscription? 
              PhotoLite decodes multi-layer graphics, blend modes, and transparency directly on your device.
            </p>

            {/* The Working Interactive Dropzone Component */}
            <PsdDropzone />

            {/* Quick Benefits Badges */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Preserves Layers & Blend Modes
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Zero Sign-up or Install Needed
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> 100% Private (Runs Client-Side)
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Export to PNG, JPEG, WebP, PSD
              </span>
            </div>
          </div>
        </section>

        {/* 3-Step Visual How-To Guide (Matches HowTo Schema) */}
        <section className="py-20 px-6 lg:px-8 max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              How to Open PSD Files Without Photoshop
            </h2>
            <p className="text-slate-400 text-sm">
              Follow these three simple steps to inspect, modify, and export your Photoshop artwork for free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 font-bold flex items-center justify-center mb-5 text-lg group-hover:scale-110 transition-transform">
                1
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Drop Your PSD File</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Drag any .PSD or .PSB file into the browser. The file opens instantly without uploading to remote servers.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 font-bold flex items-center justify-center mb-5 text-lg group-hover:scale-110 transition-transform">
                2
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Inspect & Edit Layers</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                View your complete layer stack, toggle visibility, reorder layers, tweak opacity, and apply adjustments like brightness or blur.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-emerald-500/30 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-teal-500/10 border border-teal-500/25 text-teal-400 font-bold flex items-center justify-center mb-5 text-lg group-hover:scale-110 transition-transform">
                3
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Export in Any Format</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Export individual layers with transparency as PNGs, save full-resolution JPEGs, or download the portable desktop app for offline PC use.
              </p>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <section className="py-16 px-6 lg:px-8 max-w-6xl mx-auto border-t border-white/5">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-white mb-3">
              Built for Professional Layer Fidelity
            </h2>
            <p className="text-slate-400 text-sm">
              Why designers and freelancers choose PhotoLite over bloated image converters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <Layers className="h-8 w-8 text-emerald-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Full Multi-Layer Tree</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Separate background, text layers, vector masks, and image overlays without flattening your composition.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <SlidersHorizontal className="h-8 w-8 text-cyan-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Photoshop Blend Modes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Accurate rendering of Multiply, Screen, Overlay, Color Dodge, Soft Light, and alpha transparency channels.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <Lock className="h-8 w-8 text-teal-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">100% Client-Side Privacy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your graphics never touch our servers. Processing is done securely inside your browser's private memory sandbox.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <Laptop className="h-8 w-8 text-emerald-400 mb-4" />
              <h3 className="text-base font-bold text-white mb-2">Offline Windows PC App</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Need to edit on the go without internet? Download our native 64-bit portable app for Windows 10 & 11.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
              PhotoLite vs. Alternative Solutions
            </h2>
            <p className="text-slate-400 text-sm">
              See how PhotoLite stacks up against commercial software and online editors.
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-white/5 border-b border-white/10 text-slate-300 font-semibold">
                <tr>
                  <th className="py-4 px-5">Feature</th>
                  <th className="py-4 px-5 text-emerald-400 font-bold">PhotoLite</th>
                  <th className="py-4 px-5">Adobe Photoshop</th>
                  <th className="py-4 px-5">Online Converters</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr>
                  <td className="py-3.5 px-5 font-medium text-white">Price</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-bold">100% Free Forever</td>
                  <td className="py-3.5 px-5 text-rose-400">₹1,800+/month</td>
                  <td className="py-3.5 px-5">Free (often ad-heavy)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-medium text-white">Account / Sign-in Required</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-bold">No Login Required</td>
                  <td className="py-3.5 px-5">Mandatory Adobe ID</td>
                  <td className="py-3.5 px-5">Often requires email</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-medium text-white">Preserves PSD Layers</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-bold">Yes (Full Multi-Layer)</td>
                  <td className="py-3.5 px-5">Yes</td>
                  <td className="py-3.5 px-5 text-rose-400">No (Flattens to 1 layer)</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-medium text-white">Watermarks on Export</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-bold">Zero Watermarks</td>
                  <td className="py-3.5 px-5">Zero Watermarks</td>
                  <td className="py-3.5 px-5 text-rose-400">Frequently watermarked</td>
                </tr>
                <tr>
                  <td className="py-3.5 px-5 font-medium text-white">Native Offline Windows PC App</td>
                  <td className="py-3.5 px-5 text-emerald-400 font-bold">Yes (Portable 32MB ZIP)</td>
                  <td className="py-3.5 px-5">Yes (4 GB+ installer)</td>
                  <td className="py-3.5 px-5 text-rose-400">No (Browser only)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 px-6 lg:px-8 max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-10">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-base font-bold text-white mb-2">How can I open a PSD file without Adobe Photoshop?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                You can open any .PSD or .PSB file directly in your browser using PhotoLite. Just drag and drop your file onto this page — it decodes layers, masks, and blend modes instantly without requiring Adobe Creative Cloud or any paid software.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-base font-bold text-white mb-2">Is my PSD file uploaded to an external server? (Privacy Check)</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                No. PhotoLite parses and renders your PSD file 100% locally inside your web browser using HTML5 Canvas and WebAssembly. Your graphics, confidential client files, and personal images are never uploaded to any remote server or cloud.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-base font-bold text-white mb-2">Does PhotoLite preserve Photoshop layer transparency and blend modes?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Yes. PhotoLite supports standard Adobe Photoshop blend modes (Multiply, Screen, Overlay, Soft Light, Darken, etc.), layer opacities, alpha transparency channels, and layer groups.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
              <h3 className="text-base font-bold text-white mb-2">Can I open PSD files on a Mac, Windows PC, or Chromebook?</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Yes! Because PhotoLite runs on modern web standards (WebAssembly & HTML5 Canvas), it works seamlessly across Google Chrome, Microsoft Edge, Mozilla Firefox, and Apple Safari on Windows, macOS, Linux, and ChromeOS.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/20">
              <h3 className="text-base font-bold text-emerald-300 mb-2">Bina Photoshop ke PSD file kaise open kare? (PhotoLite Kaise Chalayein?)</h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                PhotoLite ke sath aap bina kisi paid software ke PSD file open kar sakte hain. Upar diye gaye box me apni PSD file drag & drop karein ya 'Browse' par click karein. Ye bina kisi login ya subscription ke aapke browser me layers aur filters ke sath file ko open kar deta hai.
              </p>
            </div>
          </div>
        </section>

        {/* Internal Links Hub */}
        <section className="py-12 px-6 lg:px-8 max-w-5xl mx-auto text-center border-t border-white/5">
          <p className="text-xs uppercase font-semibold text-emerald-400 tracking-wider mb-4">
            Related Creative Software & Tools on Celoris
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/free-image-editor"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            >
              <span>Free Image Editor for Web & PC</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/blog/how-to-open-and-edit-psd-files-online-without-photoshop-2026"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition-all"
            >
              <span>Guide: How to Open & Edit PSDs Online</span>
              <ArrowRight className="h-4 w-4 text-cyan-400" />
            </Link>
            <Link
              href="/blog/best-free-image-editing-software-pc-web-2026"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all"
            >
              <span>2026 Free Image Editors Comparison Guide</span>
              <ArrowRight className="h-4 w-4 text-emerald-400" />
            </Link>
            <Link
              href="/cloud"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 text-xs font-semibold transition-all"
            >
              <span>Free WordPress Cloud Hosting</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>

        {/* Final CTA Banner */}
        <section className="mt-8 px-6 lg:px-8 max-w-5xl mx-auto text-center">
          <div className="p-10 sm:p-14 rounded-3xl bg-gradient-to-tr from-emerald-950/60 via-[#11221b] to-slate-900 border border-emerald-500/30 shadow-2xl">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Open Your PSD Files Instantly
            </h2>
            <p className="text-slate-300 text-base max-w-xl mx-auto mb-8 font-normal">
              No credit card. No software installation needed for web. Launch PhotoLite directly or download the offline portable PC edition.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold h-13 px-8 rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer">
                <Link href="/photolite">Launch Web Studio Now</Link>
              </Button>
              <WindowsDownloadCta variant="bottom" />
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
