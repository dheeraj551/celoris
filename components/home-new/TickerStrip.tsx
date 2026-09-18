"use client"

import Link from "next/link"
import { BookOpen, Briefcase, Coffee, Sparkles, Newspaper, type LucideIcon } from "lucide-react"

export type TickerItem = {
  category: "courses" | "jobs" | "cafe" | "apps" | "blog"
  label: string
  meta?: string
  href: string
}

const CATEGORY_META: Record<TickerItem["category"], { tag: string; icon: LucideIcon; className: string }> = {
  courses: { tag: "Courses", icon: BookOpen, className: "text-emerald-400 bg-emerald-500/10" },
  jobs: { tag: "Jobs", icon: Briefcase, className: "text-amber-400 bg-amber-500/10" },
  cafe: { tag: "Café", icon: Coffee, className: "text-sky-400 bg-sky-500/10" },
  apps: { tag: "Apps", icon: Sparkles, className: "text-pink-400 bg-pink-500/10" },
  blog: { tag: "Blog", icon: Newspaper, className: "text-violet-400 bg-violet-500/10" },
}

export function TickerStrip({ items }: { items: TickerItem[] }) {
  if (!items || items.length === 0) return null

  // Duplicated once so the CSS loop is seamless — see .ticker-track below.
  const loopItems = [...items, ...items]

  return (
    <div className="relative border-b border-white/5 bg-[#0a0a0a] overflow-hidden">
      <div className="flex items-stretch">
        <div
          className="flex-none flex items-center gap-2 pl-4 bg-emerald-500 text-[#04160f] text-[10px] font-black uppercase tracking-[0.2em] z-10"
          style={{ clipPath: "polygon(0 0, 100% 0, 88% 100%, 0% 100%)", paddingRight: 28 }}
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#04160f] opacity-60" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#04160f]" />
          </span>
          Live
        </div>

        <div className="relative flex-1 overflow-hidden ticker-mask">
          <div className="flex w-max ticker-track">
            {loopItems.map((item, i) => {
              const meta = CATEGORY_META[item.category]
              const Icon = meta.icon
              return (
                <Link
                  key={`${item.category}-${item.label}-${i}`}
                  href={item.href}
                  className="flex-none flex items-center gap-2.5 px-6 py-3 border-r border-white/5 text-xs font-bold text-slate-200 hover:text-white hover:bg-white/[0.03] transition-colors whitespace-nowrap"
                >
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${meta.className}`}>
                    <Icon className="h-2.5 w-2.5" />
                    {meta.tag}
                  </span>
                  <span>{item.label}</span>
                  {item.meta && <span className="text-slate-500 font-semibold">· {item.meta}</span>}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <style jsx>{`
        .ticker-mask {
          -webkit-mask-image: linear-gradient(to right, transparent 0, black 32px, black calc(100% - 32px), transparent 100%);
          mask-image: linear-gradient(to right, transparent 0, black 32px, black calc(100% - 32px), transparent 100%);
        }
        .ticker-track {
          animation: ticker-scroll 45s linear infinite;
        }
        .ticker-mask:hover .ticker-track {
          animation-play-state: paused;
        }
        @keyframes ticker-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>
    </div>
  )
}
