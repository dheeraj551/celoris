import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NewsletterPage() {
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
          <h1 className="text-3xl font-bold text-text-primary">Newsletter</h1>
        </div>

        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Stay Updated</h2>
          <p className="text-text-secondary mb-8">
            Subscribe to our newsletter to receive the latest updates on courses, job opportunities, and platform features.
          </p>
          <div className="bg-surface p-8 rounded-lg border">
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Button type="submit" className="w-full">
                Subscribe to Newsletter
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
