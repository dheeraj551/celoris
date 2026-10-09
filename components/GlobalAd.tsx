"use client";

import { usePathname } from "next/navigation";
import { AdUnit } from "./AdUnit";

export function GlobalAd() {
    const pathname = usePathname();

    // Hide ad on home, campaign pages and the Celoris Drape store
    if (pathname === "/" || pathname?.startsWith("/become-trainer") || pathname?.startsWith("/shop")) {
        return null;
    }

    return <AdUnit slot="6910734069" format="horizontal" className="mb-4" />;
}
