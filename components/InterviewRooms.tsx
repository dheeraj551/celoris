"use client"

import React from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MessageSquare, Users, Video, ArrowRight, Clock, Share2 } from "lucide-react"
import Link from "next/link"

const rooms = [
    {
        id: "interview_marketing",
        title: "Marketing Role Interview",
        participants: "2805 +",
        status: "Always On",
        cta: "Best Marketing Roles Marketing",
        avatars: [
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Aria",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Jack",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Luna",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie"
        ]
    },
    {
        id: "interview_tech",
        title: "Tech Role Interview",
        participants: "2128 +",
        status: "Always On",
        cta: "Browse Jobs",
        avatars: [
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Leo",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Max",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Eva",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Finn",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Ruby",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Sasha"
        ]
    },
    {
        id: "interview_mock",
        title: "Mock Interview Practice",
        participants: "2086 +",
        status: "Always On",
        cta: "Upgrade Skills",
        avatars: [
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Toby",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Mia",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Noah",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Lily",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Hugo",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Ivy",
            "https://api.dicebear.com/7.x/avataaars/svg?seed=Otis"
        ]
    }
]

export default function InterviewRooms() {
    return (
        <section className="py-16 bg-slate-50/50">
            <div className="container px-4 text-center">
                <div className="max-w-2xl mx-auto py-12 px-6 bg-white rounded-3xl shadow-sm border border-slate-100">
                    <Video className="w-16 h-16 text-slate-300 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-slate-800 mb-4">Service Temporarily Unavailable</h2>
                    <p className="text-slate-600 mb-8 text-lg">
                        Interview rooms are currently undergoing scheduled maintenance. Please check back later.
                    </p>
                    <Button asChild variant="outline" className="rounded-xl">
                        <Link href="/earn">Explore Other Opportunities</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
