"use client"

import { useEffect } from 'react'
import { App } from '@capacitor/app'
import { useRouter, usePathname } from 'next/navigation'

export function CapacitorProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        // Handle Android Back Button
        const setupBackButton = async () => {
            try {
                await App.addListener('backButton', ({ canGoBack }) => {
                    if (pathname === '/social' || pathname === '/') {
                        App.exitApp()
                    } else {
                        router.back()
                    }
                })
            } catch (e) {
                // Not running in Capacitor
            }
        }

        setupBackButton()
    }, [pathname, router])

    return <>{children}</>
}
