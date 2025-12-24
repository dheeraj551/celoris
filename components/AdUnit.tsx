"use client"

import { useEffect, useRef } from "react"

interface AdUnitProps {
    className?: string
    style?: React.CSSProperties
    slot?: string
    format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical"
    responsive?: "true" | "false"
}

export function AdUnit({
    className = "",
    style = { display: "block" },
    slot,
    format = "auto",
    responsive = "true",
}: AdUnitProps) {
    const adRef = useRef<HTMLModElement>(null)
    const initialized = useRef(false)

    useEffect(() => {
        // Prevent double initialization in development/Strict Mode
        if (initialized.current) return

        const pushAd = () => {
            try {
                // @ts-ignore
                if (window.adsbygoogle && adRef.current) {
                    // Check if it's already initialized by AdSense
                    const isDone = adRef.current.getAttribute('data-adsbygoogle-status') === 'done'
                    // Check if the element is visible and has width
                    const hasWidth = adRef.current.offsetWidth > 0

                    if (!isDone && !initialized.current && hasWidth) {
                        // @ts-ignore
                        (window.adsbygoogle = window.adsbygoogle || []).push({})
                        initialized.current = true
                    } else if (!hasWidth && !isDone && !initialized.current) {
                        // Retry later if width is still 0
                        setTimeout(pushAd, 500)
                    }
                }
            } catch (err) {
                console.error("AdSense error:", err)
            }
        }

        // Small delay to ensure the container has been rendered with actual width
        // and to allow script to load if it hasn't yet
        const timer = setTimeout(() => {
            pushAd()
        }, 500)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div
            className={`ad-container my-8 flex flex-col items-center justify-center w-full overflow-hidden rounded-xl border border-dashed border-slate-200 bg-slate-50/50 ${className}`}
            style={{ minHeight: '120px', position: 'relative' }}
        >
            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-slate-400 font-semibold pointer-events-none">
                Advertisement
            </div>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={{ ...style, minWidth: '250px', minHeight: '90px' }}
                data-ad-client="ca-pub-2389622666573829"
                data-ad-slot={slot || "9266909448"}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            />
        </div>
    )
}
