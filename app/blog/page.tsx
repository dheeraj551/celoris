import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User } from "lucide-react"

const blogPosts = [
  {
    title: "The Future of Digital Learning",
    excerpt: "Exploring how AI and technology are transforming education...",
    author: "Sarah Johnson",
    date: "2025-01-15",
    category: "Education"
  },
  {
    title: "Building Your Career in Tech",
    excerpt: "Essential tips for starting your journey in technology...",
    author: "Mike Chen",
    date: "2025-01-12",
    category: "Career"
  },
  {
    title: "Community-Driven Learning",
    excerpt: "How peer learning and collaboration enhance skill development...",
    author: "Emma Davis",
    date: "2025-01-10",
    category: "Community"
  }
]

export default function BlogPage() {
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
          <h1 className="text-3xl font-bold text-text-primary">Blog</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold mb-4">Latest Insights</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Stay updated with the latest trends in learning, technology, and digital transformation.
            </p>
          </div>

          <div className="space-y-8">
            {blogPosts.map((post, index) => (
              <article key={index} className="bg-surface p-6 rounded-lg border">
                <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
                  <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                    {post.category}
                  </span>
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <User className="h-4 w-4 ml-2" />
                  <span>{post.author}</span>
                </div>
                <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                <p className="text-text-secondary mb-4">{post.excerpt}</p>
                <Button variant="outline">Read More</Button>
              </article>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}