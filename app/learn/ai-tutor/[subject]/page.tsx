"use client"

import dynamic from 'next/dynamic'

const AIStudyRoomContent = dynamic(
    () => import('./AIStudyRoomContent'),
    { ssr: false }
)

export default function AIStudyRoom() {
    return <AIStudyRoomContent />
}
