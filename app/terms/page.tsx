import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
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
          <h1 className="text-3xl font-bold text-text-primary">Terms of Service</h1>
        </div>

        <div className="max-w-4xl mx-auto prose prose-lg">
          <p>By using Celoris, you agree to these terms. Please read them carefully.</p>
          
          <h2>Acceptance of Terms</h2>
          <p>By accessing and using Celoris, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h2>Use License</h2>
          <p>Permission is granted to temporarily download one copy of the materials on Celoris for personal, non-commercial transitory viewing only.</p>

          <h2>User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.</p>

          <h2>Prohibited Uses</h2>
          <ul>
            <li>Violate any applicable laws or regulations</li>
            <li>Transmit or procure the sending of any advertising or promotional material</li>
            <li>Impersonate or attempt to impersonate the company or its employees</li>
          </ul>

          <h2>Disclaimer</h2>
          <p>The materials on Celoris are provided on an 'as is' basis. Celoris makes no warranties, expressed or implied.</p>

          <h2>Contact Information</h2>
          <p>Questions about the Terms of Service should be sent to us at legal@celorisdesigns.com</p>
        </div>
      </div>
    </div>
  )
}