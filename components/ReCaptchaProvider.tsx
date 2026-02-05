'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import Script from 'next/script'

interface ReCaptchaContextType {
    executeRecaptcha: (action: string) => Promise<string>
    isReady: boolean
}

const ReCaptchaContext = createContext<ReCaptchaContextType>({
    executeRecaptcha: async () => '',
    isReady: false,
})

export const useReCaptcha = () => useContext(ReCaptchaContext)

interface ReCaptchaProviderProps {
    children: React.ReactNode
    siteKey: string
}

export function ReCaptchaProvider({ children, siteKey }: ReCaptchaProviderProps) {
    const [isReady, setIsReady] = useState(false)

    useEffect(() => {
        // Check if grecaptcha is already loaded
        if (typeof window !== 'undefined' && (window as any).grecaptcha?.ready) {
            (window as any).grecaptcha.ready(() => {
                setIsReady(true)
            })
        }

        // Hide badge if native
        import('@capacitor/core').then(({ Capacitor }) => {
            if (Capacitor.isNativePlatform()) {
                const style = document.createElement('style')
                style.innerHTML = '.grecaptcha-badge { visibility: hidden !important; }'
                document.head.appendChild(style)
            }
        })
    }, [])

    const handleScriptLoad = () => {
        if (typeof window !== 'undefined' && (window as any).grecaptcha) {
            (window as any).grecaptcha.ready(() => {
                setIsReady(true)
            })
        }
    }

    const executeRecaptcha = async (action: string): Promise<string> => {
        if (!isReady) {
            throw new Error('reCAPTCHA not ready')
        }

        try {
            const token = await (window as any).grecaptcha.execute(siteKey, { action })
            return token
        } catch (error) {
            console.error('Error executing reCAPTCHA:', error)
            throw error
        }
    }

    return (
        <>
            <Script
                src={`https://www.google.com/recaptcha/api.js?render=${siteKey}`}
                onLoad={handleScriptLoad}
                strategy="afterInteractive"
            />
            <ReCaptchaContext.Provider value={{ executeRecaptcha, isReady }}>
                {children}
            </ReCaptchaContext.Provider>
        </>
    )
}
