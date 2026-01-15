import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"
import { createServerClient } from "@/lib/supabase-server"

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  published_at: string;
  category: string;
  reading_time: number;
  featured_image_url?: string;
}

export default async function BlogPage() {
  const supabase = createServerClient();

  // Static blog post definition
  const STATIC_POST: BlogPost = {
    id: 'static-multimodal-agentic-ai',
    title: 'Beyond the Chatbot: The Rise of Multimodal and Agentic AI in Enterprise Workflows 🚀',
    slug: 'multimodal-agentic-ai',
    excerpt: 'Until recently, AI models were often siloed: Large Language Models (LLMs) handled text, while separate models handled images or audio. Multimodal AI breaks down these barriers.',
    featured_image_url: 'https://anyslive.in/wp-content/uploads/2025/12/Gemini_Generated_Image_rdi845rdi845rdi8.png',
    author_name: 'Celoris',
    category: 'Technology',
    reading_time: 5,
    published_at: '2025-12-01T12:00:00Z',
  };

  let fetchedPosts: BlogPost[] = [];
  try {
    const { data: dbPosts } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image_url, author_name, category, reading_time, published_at')
      .eq('status', 'published')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(10);

    fetchedPosts = dbPosts || [];
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }

  // Add static post if not present
  if (!fetchedPosts.some(p => p.slug === STATIC_POST.slug)) {
    fetchedPosts = [STATIC_POST, ...fetchedPosts];
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.celorisdesigns.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.celorisdesigns.com/blog"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
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

          {fetchedPosts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">No blog posts found.</p>
            </div>
          ) : (
            <div className="space-y-8">
              {fetchedPosts.map((post) => (
                <article key={post.id} className="bg-surface p-6 rounded-lg border hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
                    <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs">
                      {post.category}
                    </span>
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(post.published_at)}</span>
                    <User className="h-4 w-4 ml-2" />
                    <span>{post.author_name}</span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>{post.reading_time} min read</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{post.title}</h3>
                  <p className="text-text-secondary mb-4">{post.excerpt || 'Click to read more...'}</p>
                  <Button variant="outline" asChild>
                    <Link href={`/blog/${post.slug}`}>Read More</Link>
                  </Button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}