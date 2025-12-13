import Link from "next/link"
import { Button } from "@/components/ui/button"
import TestimonialsDisplay from "@/components/TestimonialsDisplay"
import { ArrowLeft, Users, Target, Award, TrendingUp } from "lucide-react"

export default function AboutPage() {
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
          <h1 className="text-3xl font-bold text-text-primary">About Celoris</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="prose prose-lg max-w-none">
            <h2>Our Mission</h2>
            <p>
              At Celoris, we believe in empowering individuals and businesses through comprehensive
              digital transformation. Our platform brings together learning, earning opportunities,
              and engaging experiences in one unified ecosystem.
            </p>

            <h2>What We Do</h2>
            <p>
              We provide cutting-edge IT solutions and educational platforms that help people:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
              <div className="bg-surface p-6 rounded-lg border">
                <Users className="h-8 w-8 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Learn</h3>
                <p className="text-text-secondary">
                  Master new skills with our comprehensive courses and interactive lessons.
                </p>
              </div>

              <div className="bg-surface p-6 rounded-lg border">
                <Target className="h-8 w-8 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Earn</h3>
                <p className="text-text-secondary">
                  Find your dream job or freelance opportunities in our curated marketplace.
                </p>
              </div>

              <div className="bg-surface p-6 rounded-lg border">
                <Award className="h-8 w-8 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Social</h3>
                <p className="text-text-secondary">
                  Connect with community, enjoy engaging games, and climb leaderboards.
                </p>
              </div>

              <div className="bg-surface p-6 rounded-lg border">
                <TrendingUp className="h-8 w-8 text-primary-500 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Apps</h3>
                <p className="text-text-secondary">
                  Boost productivity with our collection of useful tools and utilities.
                </p>
              </div>
            </div>

            <h2>Our Vision</h2>
            <p>
              To be the leading platform that democratizes access to quality education,
              employment opportunities, and digital tools, enabling anyone to build their
              digital future regardless of their background or location.
            </p>

            <hr className="my-8 border-slate-200" />

            <h2>Customer Testimonials</h2>
            <p className="mb-8">
              Don't just take our word for it. Here's what our satisfied clients and partners have to say about their experience working with Celoris.
            </p>

            <TestimonialsDisplay
              type="all"
              page="all"
              limit={3}
              layout="grid"
              showFeatured={true}
              className="mb-12"
            />

            <h2>Contact Us</h2>
            <p>
              Ready to transform your digital future?
              <Link href="/contact" className="text-primary-500 hover:underline ml-1">
                Get in touch with our team
              </Link> to learn more about how we can help you achieve your goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}