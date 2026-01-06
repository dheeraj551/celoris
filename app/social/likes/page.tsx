"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LikesPage() {
    return (
        <div className="min-h-screen bg-[#050810] py-12">
            <div className="container max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-2">Likes</h1>
                <p className="text-slate-400 font-medium mb-8">See who has liked your profile.</p>

                <Card className="border-dashed border-2 border-white/10 bg-[#0d1321]/40 backdrop-blur-xl shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-16 w-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4 border border-emerald-500/20">
                            <ThumbsUp className="h-8 w-8 text-emerald-500" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2 italic uppercase tracking-tight">No likes yet</h2>
                        <p className="text-slate-500 max-w-md mb-6 font-medium">
                            Start discovering people and updating your profile to get more visibility!
                        </p>
                        <Button asChild className="bg-emerald-600 hover:bg-emerald-500 text-white border-none rounded-full px-8">
                            <Link href="/social/swipe">
                                Discover People <ArrowRight className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
