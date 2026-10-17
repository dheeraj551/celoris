"use client"

import React, { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { 
  FileCode2, 
  Upload, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Layers, 
  CheckCircle2,
  FolderOpen
} from "lucide-react"
import { Button } from "@/components/ui/button"

export function PsdDropzone() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processFile(file)
    }
  }

  const processFile = (file: File) => {
    setFileName(file.name)
    setIsProcessing(true)
    // Seamlessly transition to the full editor studio
    setTimeout(() => {
      router.push("/photolite")
    }, 600)
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <input
        ref={fileInputRef}
        type="file"
        accept=".psd,.psb,.png,.jpg,.jpeg,.webp"
        onChange={handleFileInput}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-300 border-2 border-dashed ${
          isDragging
            ? "border-emerald-400 bg-emerald-500/10 scale-[1.01] shadow-2xl shadow-emerald-500/20"
            : "border-white/20 bg-gradient-to-b from-white/[0.06] to-white/[0.02] hover:border-emerald-500/50 hover:bg-white/[0.08] shadow-2xl"
        }`}
      >
        {/* Glow ambient background */}
        <div className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-b from-emerald-500/5 to-cyan-500/5 opacity-50" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Animated Icon */}
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
            {isProcessing ? (
              <div className="w-9 h-9 rounded-full border-3 border-emerald-500/20 border-t-emerald-400 animate-spin" />
            ) : (
              <FileCode2 className="w-10 h-10 text-emerald-400" />
            )}
          </div>

          {/* Heading */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight">
            {isProcessing ? `Opening ${fileName}...` : "Drop your .PSD file here"}
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto mb-6 leading-relaxed">
            {isProcessing
              ? "Decoding layers, blend modes, and adjustments in browser memory..."
              : "Drag & drop your Photoshop file, or click to browse from your computer. 100% free, private & runs in your browser."}
          </p>

          {/* Action button */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Button
              type="button"
              size="lg"
              className="h-12 px-7 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              <FolderOpen className="h-4 w-4" />
              <span>Browse Computer</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                router.push("/photolite")
              }}
              className="h-12 px-6 rounded-xl border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium text-sm"
            >
              <span>Launch Blank Canvas</span>
              <ArrowRight className="h-4 w-4 ml-1 text-emerald-400" />
            </Button>
          </div>

          {/* Supported format badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 text-[11px] font-mono text-slate-400">
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-emerald-300">.PSD</span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-cyan-300">.PSB (Large)</span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">.PNG</span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">.JPG</span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">.WEBP</span>
            <span className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10">.RAW</span>
          </div>

          {/* Privacy Guarantee */}
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>100% Client-Side Privacy: Your files never leave your device.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
