import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EventsPage() {
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
          <h1 className="text-3xl font-bold text-text-primary">Events</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
            <p className="text-text-secondary">
              Join our events to learn, network, and grow with the community.
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-surface p-6 rounded-lg border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Webinar: Future of AI in Education</h3>
                  <p className="text-text-secondary">January 20, 2025 • 2:00 PM EST</p>
                </div>
                <Button variant="outline">Register</Button>
              </div>
              <p className="text-text-secondary">Explore how artificial intelligence is transforming the educational landscape.</p>
            </div>
            
            <div className="bg-surface p-6 rounded-lg border">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold">Workshop: Building Your Personal Brand</h3>
                  <p className="text-text-secondary">January 25, 2025 • 11:00 AM EST</p>
                </div>
                <Button variant="outline">Register</Button>
              </div>
              <p className="text-text-secondary">Learn strategies for building and maintaining a strong professional brand.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
