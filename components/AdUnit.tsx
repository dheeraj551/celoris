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
        <div className={`ad-container my-8 flex justify-center w-full overflow-hidden ${className}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={style}
                data-ad-client="ca-pub-2389622666573829"
                data-ad-slot={slot || "9266909448"}
                data-ad-format={format}
                data-full-width-responsive={responsive}
            />
        </div>
    )
}
