import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function CookiesPage() {
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
          <h1 className="text-3xl font-bold text-text-primary">Cookie Policy</h1>
        </div>

        <div className="max-w-4xl mx-auto prose prose-lg">
          <p>This Cookie Policy explains what cookies are and how Celoris uses them.</p>

          <h2>What Are Cookies</h2>
          <p>Cookies are small text files that are placed on your computer or mobile device when you visit our website.</p>

          <h2>How We Use Cookies</h2>
          <p>We use cookies to enhance your experience, analyze site usage, and improve our services.</p>

          <h2>Types of Cookies We Use</h2>
          <ul>
            <li><strong>Essential Cookies:</strong> Necessary for the website to function properly</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
          </ul>

          <h2>Managing Cookies</h2>
          <p>You can control and manage cookies in your browser settings. However, disabling cookies may affect website functionality.</p>
        </div>
      </div>
    </div>
  )
}