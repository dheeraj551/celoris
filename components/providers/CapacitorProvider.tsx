"use client"

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Capacitor } from '@capacitor/core'

export function CapacitorProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!Capacitor.isNativePlatform()) return

        // Handle Android Back Button
        const setupBackButton = async () => {
            const { App } = await import('@capacitor/app')
            try {
                await App.addListener('backButton', ({ canGoBack }: { canGoBack: boolean }) => {
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
