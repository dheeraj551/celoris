import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Clock, ChevronRight } from "lucide-react"
import { createServerClient } from "@/lib/supabase-server"
import { cn } from "@/lib/utils"

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
  const supabase = (await createServerClient()) as any;

  const STATIC_POSTS: BlogPost[] = [
    {
      id: 'best-free-online-video-editor-india-2026',
      title: 'Best Free Online Video Editor India 2026 — No Watermark, No Download',
      slug: 'best-free-online-video-editor-india-2026',
      excerpt: "Looking for the best free online video editor in India 2026? Edit videos without downloading software — no watermark, no fees.",
      featured_image_url: '/blog-video-editor-india-2026.png',
      author_name: 'Celoris',
      category: 'Technology',
      reading_time: 8,
      published_at: '2026-03-02T12:00:00Z',
    },
    {
      id: 'create-professional-videos-free',
      title: 'How to Create Professional Videos Without Expensive Software in 2025',
      slug: 'create-professional-videos-free',
      excerpt: "The complete guide for Indian students, creators and small businesses who refuse to pay ₹3,500/month for Adobe.",
      featured_image_url: '/blog-create-videos-free.png',
      author_name: 'Celoris',
      category: 'Tutorials',
      reading_time: 5,
      published_at: '2026-02-24T12:00:00Z',
    },
    {
      id: 'best-free-video-editor-india',
      title: 'Best Free Video Editing and AI Tools for Indian Creators in 2025',
      slug: 'best-free-video-editor-india',
      excerpt: "If you're an Indian creator, student or small business owner looking for a free video editor in India — this list is for you.",
      featured_image_url: '/blog-video-editor-india.png',
      author_name: 'Celoris',
      category: 'Technology',
      reading_time: 4,
      published_at: '2026-02-23T12:00:00Z',
    },
    {
      id: 'deepseek-v3-2',
      title: 'DeepSeek-V3.2: The Latest AI Model Reshaping the Industry',
      slug: 'deepseek-v3-2',
      excerpt: "Discover DeepSeek-V3.2, the latest breakthrough in AI technology. Learn about its advanced features, improved efficiency, and how it's challenging industry leaders.",
      featured_image_url: '/deepseek-v3-2.png',
      author_name: 'Celoris',
      category: 'AI Research',
      reading_time: 3,
      published_at: '2025-12-07T12:00:00Z',
    }
  ];

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

  // Merge static posts with fetched posts, avoiding duplicates
  let allPosts = [...fetchedPosts];
  STATIC_POSTS.forEach(staticPost => {
    if (!allPosts.some(p => p.slug === staticPost.slug)) {
      allPosts.unshift(staticPost);
    }
  });

  // Sort by date descending
  allPosts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

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
        "item": "https://www.celoris.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.celoris.in/blog"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#050810] text-slate-300 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="container py-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div className="space-y-4">
            <Link
              href="/"
              className="group flex items-center gap-2 text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
              Celoris <span className="text-emerald-500 italic">Blog</span>
            </h1>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              Stay updated with the latest trends in <span className="text-white">AI</span>, <span className="text-white">creative tools</span>, and the future of <span className="text-white">digital transformation</span> in India.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {allPosts.length === 0 ? (
            <div className="text-center py-24 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
              <p className="text-slate-500 text-xl font-medium">No insights found yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10">
              {allPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-[#0a0f1d] rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-emerald-500/10"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Thumbnail */}
                    <div className="lg:w-2/5 aspect-video overflow-hidden relative">
                      <Link href={`/blog/${post.slug}`}>
                        <img
                          src={post.featured_image_url || "/images/homepage/hero.png"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </Link>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors pointer-events-none" />
                      <div className="absolute top-6 left-6">
                        <span className="bg-black/60 backdrop-blur-md text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-emerald-500/30">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                          {formatDate(post.published_at)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-emerald-500" />
                          {post.reading_time} min read
                        </div>
                      </div>

                      <h3 className="text-2xl md:text-4xl font-bold text-white mb-6 group-hover:text-emerald-400 transition-colors leading-tight tracking-tight">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      <p className="text-slate-400 text-lg leading-relaxed mb-8 line-clamp-2 italic">
                        "{post.excerpt || 'Discover more insights inside...'}"
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-sm border border-white/10 shadow-lg">
                            {post.author_name ? post.author_name.charAt(0) : 'C'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{post.author_name || 'Celoris'}</p>
                            <p className="text-[10px] text-emerald-500/80 font-bold uppercase tracking-tighter">Verified Creator</p>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          className="text-emerald-500 hover:text-white hover:bg-emerald-500 transition-all rounded-full px-6 font-bold uppercase tracking-widest text-[10px] gap-2 border border-emerald-500/20"
                          asChild
                        >
                          <Link href={`/blog/${post.slug}`}>
                            Read Insights
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}