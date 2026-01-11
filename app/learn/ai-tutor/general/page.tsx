"use client"

import dynamic from 'next/dynamic'

const GeneralHubPageContent = dynamic(
    () => import('./GeneralHubContent'),
    { ssr: false }
)

export default function GeneralHubPage() {
    return <GeneralHubPageContent />
}
