"use client"

import React from "react"

interface AdUnitProps {
    className?: string
    style?: React.CSSProperties
    slot?: string
    format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical"
    responsive?: "true" | "false"
}

// AdSense disabled — renders null cleanly without layout shifts or third-party ad scripts
export function AdUnit(_props: AdUnitProps) {
    return null
}
