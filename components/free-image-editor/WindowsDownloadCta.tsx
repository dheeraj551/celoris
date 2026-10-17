"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/components/providers/AuthProvider"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { Button } from "@/components/ui/button"
import { 
  Laptop, 
  Download, 
  CheckCircle2, 
  X, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  ArrowRight,
  HardDrive
} from "lucide-react"

interface WindowsDownloadCtaProps {
  className?: string
  variant?: "hero" | "bottom"
}

export function WindowsDownloadCta({ className = "", variant = "hero" }: WindowsDownloadCtaProps) {
  const { user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isOpen, setIsOpen] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Start direct download
  const triggerDownload = () => {
    setIsDownloading(true)
    const link = document.createElement("a")
    link.href = "/api/download/photolite"
    link.download = "PhotoLite-Windows-x64.zip"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => {
      setIsDownloading(false)
      setIsOpen(false)
    }, 2000)
  }

  // Handle post-login auto download
  useEffect(() => {
    if (searchParams.get("download") === "auto") {
      triggerDownload()
      // Clean query parameter without reload
      router.replace("/free-image-editor", { scroll: false })
    }
  }, [searchParams, router])

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (user) {
      // Already logged in — download immediately!
      triggerDownload()
    } else {
      // Open 1-click sign-in gate
      setIsOpen(true)
    }
  }

  return (
    <>
      {variant === "hero" ? (
        <Button
          onClick={handleClick}
          size="lg"
          variant="outline"
          className={`w-full sm:w-auto h-14 px-8 rounded-2xl bg-white/5 hover:bg-white/10 text-white border-white/15 hover:border-emerald-500/40 font-semibold text-base shadow-lg transition-all transform hover:-translate-y-0.5 cursor-pointer ${className}`}
        >
          <span className="flex items-center justify-center gap-2.5">
            <Laptop className="h-5 w-5 text-emerald-400" />
            <span>Download for Windows PC</span>
            <Download className="h-4 w-4 text-emerald-400" />
          </span>
        </Button>
      ) : (
        <Button
          onClick={handleClick}
          size="lg"
          variant="outline"
          className={`border-white/20 bg-black/40 hover:bg-white/10 text-white font-medium h-13 px-8 rounded-xl cursor-pointer ${className}`}
        >
          <span className="flex items-center justify-center gap-2">
            <Laptop className="h-4 w-4 text-emerald-400" />
            <span>Download Windows PC (64-bit)</span>
            <Download className="h-4 w-4 text-emerald-400" />
          </span>
        </Button>
      )}

      {/* 1-Click Sign-in & Download Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div 
            className="relative w-full max-w-md rounded-3xl bg-[#0c1322] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-4">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Official 64-bit Portable Edition</span>
            </div>

            {/* Title */}
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 leading-tight">
              Get PhotoLite for Windows
            </h3>
            <p className="text-sm text-slate-300 mb-6 leading-relaxed">
              Sign in with Google in 1 click to start your download and get free access to all future updates and templates.
            </p>

            {/* Google 1-Click Sign In Button */}
            <div className="mb-5 flex flex-col items-center justify-center">
              <div className="w-full flex justify-center">
                <GoogleSignInButton
                  text="continue_with"
                  oneTap={false}
                  redirectTo="/free-image-editor?download=auto"
                >
                  <Button
                    onClick={triggerDownload}
                    className="w-full h-12 rounded-xl bg-white text-black hover:bg-slate-100 font-semibold flex items-center justify-center gap-3 shadow-md"
                  >
                    <span>Sign in with Google</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </GoogleSignInButton>
              </div>
            </div>

            {/* Features check */}
            <div className="space-y-2 py-3 border-y border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Zero installation • Extract portable ZIP and run offline</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Full PSD, RAW, PNG, JPEG & WebP support</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>100% Free • No watermarks • No credit card required</span>
              </div>
            </div>

            {/* Polite guest bypass link */}
            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={triggerDownload}
                disabled={isDownloading}
                className="text-xs text-slate-400 hover:text-slate-200 underline transition cursor-pointer"
              >
                {isDownloading ? "Starting download..." : "Or download directly as guest without signing in"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
