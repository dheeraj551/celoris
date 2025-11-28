import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, HelpCircle, Book, MessageCircle } from "lucide-react"

const faqs = [
  {
    question: "How do I get started with Celoris?",
    answer: "Simply create an account and start exploring our platform. You can begin with any of our core features: Learn, Earn, Social, or Apps."
  },
  {
    question: "Is Celoris free to use?",
    answer: "We offer both free and premium plans. The free plan gives you access to basic features, while premium plans unlock advanced tools and unlimited access."
  },
  {
    question: "How do I contact support?",
    answer: "You can reach our support team through the contact form, email us directly, or use the live chat feature during business hours."
  },
  {
    question: "Can I learn at my own pace?",
    answer: "Absolutely! Our courses are designed to be self-paced, allowing you to learn whenever and wherever it's convenient for you."
  }
]

export default function HelpPage() {
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
          <h1 className="text-3xl font-bold text-text-primary">Help Center</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="h-16 w-16 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-4">How can we help you?</h2>
            <p className="text-text-secondary">
              Find answers to common questions and get the support you need.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <Book className="h-8 w-8 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Getting Started</h3>
              <p className="text-text-secondary text-sm">Learn the basics of using Celoris platform</p>
            </div>
            <div className="text-center">
              <MessageCircle className="h-8 w-8 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Contact Support</h3>
              <p className="text-text-secondary text-sm">Get personalized help from our team</p>
            </div>
            <div className="text-center">
              <HelpCircle className="h-8 w-8 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">FAQ</h3>
              <p className="text-text-secondary text-sm">Find quick answers to common questions</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-6">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-surface p-6 rounded-lg border">
                <h4 className="font-semibold mb-3">{faq.question}</h4>
                <p className="text-text-secondary">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}