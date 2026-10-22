import { type Metadata } from "next";
import { DashboardShell } from "@/components/home-new/DashboardShell";
import { VideoUpscalerStudio } from "@/components/video-upscaler/VideoUpscalerStudio";
import {
  Zap,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  Layers,
  Download,
  Eye,
  Film,
  Lock,
  ArrowRight,
  HelpCircle,
  Video,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Free AI Video Upscaler Online 4K — No Watermark, No Upload, 100% Private",
  description:
    "Upscale video to 4K Ultra HD in your browser using hardware-accelerated WebGPU & WebGL. No cloud uploads, no watermark, completely free for Instagram Reels, Shorts, and clips.",
  alternates: {
    canonical: "/free-video-upscaler",
  },
  keywords: [
    "free video upscaler",
    "video upscaler online",
    "upscale video to 4k",
    "ai video upscaler free",
    "reel upscaler",
    "webgpu video upscaler",
    "instagram reel 4k upscaler",
    "video resolution enhancer free",
    "video quality enhancer without watermark",
  ],
  openGraph: {
    title: "Free AI Video Upscaler Online 4K — 100% Private WebGPU Engine",
    description:
      "Upscale video to 4K in your browser. Powered by your device GPU with WebGPU & WebGL2. 0 server queues, 0 watermark, unlimited exports.",
    url: "https://celorisdesigns.com/free-video-upscaler",
  },
};

const upscalerFaqs = [
  {
    q: "How does the in-browser video upscaler work without server uploads?",
    a: "Unlike traditional cloud websites that make you wait in an upload queue, our engine uses WebGPU and WebGL2 shader pipelines directly in your browser. The computation runs on your computer or phone's graphics card, meaning your files never leave your device.",
  },
  {
    q: "Is there any watermark, coin pack, or file size restriction?",
    a: "Zero watermarks and zero coin packs. Because the processing is computed entirely on your local GPU hardware, it costs us ₹0 in server bills, allowing us to offer it completely free to creators.",
  },
  {
    q: "What video formats and aspect ratios are supported?",
    a: "You can upscale MP4, MOV, WebM, and MKV video files, as well as high-resolution PNG, JPG, and WebP images. Both vertical 9:16 (Instagram Reels/Shorts) and 16:9 widescreen formats are natively supported.",
  },
  {
    q: "Does upscaling preserve the original audio track?",
    a: "Yes! Our export pipeline automatically captures and synchronizes your original audio track alongside the upscaled 4K video stream.",
  },
];

export default function FreeVideoUpscalerPage() {
  return (
    <DashboardShell>
      <div className="min-h-screen bg-[#050810] text-slate-200 selection:bg-emerald-500/30">
        {/* Hero Section */}
        <section className="pt-20 pb-10 px-4 sm:px-8 relative overflow-hidden z-10 border-b border-white/5 bg-[#090d16]/60 backdrop-blur-3xl">
          <div className="max-w-5xl mx-auto text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-black uppercase tracking-widest">
              <Cpu size={13} className="animate-pulse" /> 100% Private WebGPU & WebGL2 Super-Resolution
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white uppercase italic">
              Free AI Video Upscaler to 4K
            </h1>
            
            <p className="text-sm sm:text-base max-w-2xl mx-auto text-slate-400 font-medium leading-relaxed">
              Enhance blurry reels, compressions, and low-res clips to crystal-clear 4K Ultra HD. 
              Powered by your GPU inside the browser — <strong className="text-white">no cloud upload, no watermark, zero wait times.</strong>
            </p>
          </div>
        </section>

        {/* Live Interactive Studio */}
        <section className="relative z-10">
          <VideoUpscalerStudio />
        </section>

        {/* Value Proposition Grid */}
        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Why Creators Prefer Browser-Based Upscaling
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              The fastest way to enhance Instagram Reels, YouTube Shorts, and portfolio footage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-[#0c1017] border border-white/[0.08] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">100% Zero-Upload Privacy</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Your client clips, unreleased reels, and personal photos never upload to remote servers. Everything executes inside your local browser memory.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0c1017] border border-white/[0.08] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">Zero Cloud Queue Delays</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Skip 20-minute server queues. As soon as you click upscale, your device's GPU begins rendering immediately at high frame rates.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-[#0c1017] border border-white/[0.08] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Download className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">No Watermark & Free Forever</h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Export clean, unbranded 4K MP4 videos ready for immediate posting on Instagram, YouTube, and client delivery.
              </p>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-16 border-t border-white/5 bg-[#080c14]/40">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
            <div className="text-center space-y-1 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Frequently Asked Questions</h2>
              <p className="text-xs text-neutral-400">Everything you need to know about Celoris Video Upscaler</p>
            </div>

            <div className="space-y-4">
              {upscalerFaqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-[#0c1017] border border-white/[0.06] space-y-2"
                >
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    {faq.q}
                  </h3>
                  <p className="text-xs text-neutral-400 leading-relaxed pl-6">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>

            {/* Bottom Job Center CTA */}
            <div className="mt-12 p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-[#0a0f18] to-teal-950/40 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-extrabold text-white">
                  Earn up to ₹30,000/mo as a Celoris Certified Video Editor
                </h3>
                <p className="text-xs text-neutral-300 mt-1">
                  Pass our free 5-minute online skills test and unlock direct verified remote freelance gigs with 0% platform cuts.
                </p>
              </div>
              <Button asChild className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs rounded-xl px-5 py-2.5 whitespace-nowrap shadow-lg shadow-emerald-500/20">
                <Link href="/job-center">
                  Visit Job Center <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}
