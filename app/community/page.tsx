import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-text-primary">Community</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold mb-4">Join Our Community</h2>
            <p className="text-text-secondary">
              Connect with like-minded learners, share knowledge, and grow together.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-3">Forums</h3>
              <p className="text-text-secondary">Discuss topics, ask questions, and share insights with the community.</p>
            </div>
            <div className="bg-surface p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-3">Study Groups</h3>
              <p className="text-text-secondary">Join study groups based on your interests and learning goals.</p>
            </div>
            <div className="bg-surface p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-3">Mentorship</h3>
              <p className="text-text-secondary">Get guidance from experienced professionals and industry experts.</p>
            </div>
            <div className="bg-surface p-6 rounded-lg border">
              <h3 className="text-xl font-semibold mb-3">Events</h3>
              <p className="text-text-secondary">Participate in webinars, workshops, and networking events.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
