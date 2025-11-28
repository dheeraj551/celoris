import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield, Eye, Lock } from "lucide-react"

export default function PrivacyPage() {
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
          <h1 className="text-3xl font-bold text-text-primary">Privacy Policy</h1>
        </div>

        <div className="max-w-4xl mx-auto prose prose-lg">
          <div className="bg-surface p-6 rounded-lg border mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="h-6 w-6 text-primary-500" />
              <h2 className="text-xl font-semibold">Your Privacy Matters</h2>
            </div>
            <p className="text-text-secondary">
              We are committed to protecting your personal information and being transparent about how we collect, use, and share your data.
            </p>
          </div>

          <h2>Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.</p>

          <h2>How We Use Your Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, communicate with you, and comply with applicable laws.</p>

          <h2>Information Sharing</h2>
          <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>

          <h2>Data Security</h2>
          <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

          <h2>Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information. Contact us to exercise these rights.</p>

          <h2>Contact Us</h2>
          <p>If you have questions about this Privacy Policy, please contact us at privacy@celorisdesigns.com</p>

          <p className="text-sm text-text-secondary mt-8">Last updated: January 17, 2025</p>
        </div>
      </div>
    </div>
  )
}