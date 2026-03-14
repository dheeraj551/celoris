"use client"

import { m } from "framer-motion"

interface PageWrapperProps {
    children: React.ReactNode
    className?: string
}

export const PageWrapper = ({ children, className }: PageWrapperProps) => {
    return (
        <m.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={className}
        >
            {children}
        </m.div>
    )
}
