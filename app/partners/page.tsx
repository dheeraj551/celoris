import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PartnersPage() {
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
          <h1 className="text-3xl font-bold text-text-primary">Partners</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold mb-4">Our Partners</h2>
            <p className="text-text-secondary">
              We collaborate with leading companies and organizations to deliver exceptional value.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-surface p-6 rounded-lg border text-center">
              <h3 className="text-xl font-semibold mb-3">Educational Institutions</h3>
              <p className="text-text-secondary">Partnering with universities and colleges worldwide</p>
            </div>
            <div className="bg-surface p-6 rounded-lg border text-center">
              <h3 className="text-xl font-semibold mb-3">Tech Companies</h3>
              <p className="text-text-secondary">Collaborating with leading technology companies</p>
            </div>
            <div className="bg-surface p-6 rounded-lg border text-center">
              <h3 className="text-xl font-semibold mb-3">Industry Leaders</h3>
              <p className="text-text-secondary">Working with industry experts and thought leaders</p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <h3 className="text-xl font-semibold mb-4">Become a Partner</h3>
            <p className="text-text-secondary mb-6">
              Interested in partnering with us? Let's explore opportunities together.
            </p>
            <Button asChild>
              <Link href="/contact">Get in Touch</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
