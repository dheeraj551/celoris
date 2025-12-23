"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function LikesPage() {
    return (
        <div className="min-h-screen bg-slate-50 py-12">
            <div className="container max-w-4xl mx-auto px-4">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Likes</h1>
                <p className="text-slate-500 mb-8">See who has liked your profile.</p>

                <Card className="border-dashed border-2 bg-slate-50 shadow-none">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                            <ThumbsUp className="h-8 w-8 text-purple-600" />
                        </div>
                        <h2 className="text-xl font-semibold text-slate-900 mb-2">No likes yet</h2>
                        <p className="text-slate-500 max-w-md mb-6">
                            Start discovering people and updating your profile to get more visibility!
                        </p>
                        <Button asChild>
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
