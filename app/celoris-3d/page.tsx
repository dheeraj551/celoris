"use client"

import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { Orbit, Sparkles } from 'lucide-react'
import { useAuth } from '@/components/providers/AuthProvider'
import { useRouter } from 'next/navigation'
import { DashboardShell } from '@/components/home-new/DashboardShell'

const Celoris3D = dynamic(() => import('@/components/celoris-3d/Celoris3D'), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex items-center justify-center bg-[#050810] min-h-[500px]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-emerald-500 font-bold uppercase tracking-widest text-sm animate-pulse">
          Initializing 3D Engine...
        </p>
      </div>
    </div>
  )
})

export default function Celoris3DPage() {
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  if (authLoading || !user) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#050810]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-emerald-500 font-bold uppercase tracking-widest text-sm animate-pulse">
            Verifying Access...
          </p>
        </div>
      </div>
    )
  }

  return (
    <DashboardShell>
      <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-[#050810]">
        {/* Sub-Header for Celoris 3D Controls/Title */}
        <div className="h-16 px-8 flex items-center justify-between border-b border-white/5 bg-[#0a0f1d]/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <Orbit className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-tight text-white flex items-center gap-2 leading-none">
                Celoris 3D
                <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                  Beta
                </span>
              </h1>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">AI Asset Generation</p>
            </div>
          </div>
          
        </div>

        {/* 3D App */}
        <Celoris3D />
      </div>
    </DashboardShell>
  )
}
