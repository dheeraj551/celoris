"use client";

import { usePathname } from "next/navigation";
import { AdUnit } from "./AdUnit";

export function GlobalAd() {
    const pathname = usePathname();

    // Hide ad on the home page
    if (pathname === "/") {
        return null;
    }

    return <AdUnit slot="6910734069" format="horizontal" className="mb-4" />;
}
