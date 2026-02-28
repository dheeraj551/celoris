import Link from 'next/link';
import { Calendar, User, Clock, Tag, TrendingUp, ArrowLeft, Eye } from 'lucide-react';
import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!post) return { title: 'Post Not Found - Celoris' };

  return {
    title: `${post.title} | Celoris Blog`,
    description: post.meta_description || post.excerpt,
    keywords: post.tags,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image_url ? [post.featured_image_url] : [],
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author_name || 'Celoris Team'],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const supabase = createServerClient();
  const { slug } = await params;

  // Fetch the post
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !post) {
    notFound();
  }

  // Increment views count (background)
  supabase
    .from('blog_posts')
    .update({ views_count: (post.views_count || 0) + 1 })
    .eq('id', post.id)
    .then(({ error: updateError }) => {
      if (updateError) console.error('Error incrementing views:', updateError);
    });

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'Recently';
    }
  };

  // Structured Data for AI & Search Engines
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featured_image_url,
    "author": {
      "@type": "Organization",
      "name": "Celoris Designs",
      "url": "https://www.celoris.in"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Celoris",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.celoris.in/favicon.svg"
      }
    },
    "datePublished": post.published_at,
    "dateModified": post.updated_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.celoris.in/blog/${post.slug}`
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] text-slate-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <div className="relative h-[600px] w-full overflow-hidden">
        {/* Background Image / Placeholder */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url("${post.featured_image_url || '/images/homepage/hero.png'}")`
          }}
          role="img"
          aria-label={post.title}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent" />

        <div className="container relative h-full flex flex-col justify-end pb-12 text-white px-4 mx-auto">
          <Button variant="ghost" className="text-white w-fit mb-8 hover:bg-white/10 group bg-black/20 backdrop-blur-md border border-white/10" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
          </Button>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase border border-emerald-500/30 backdrop-blur-md">
                {post.category || 'Insights'}
              </span>
              <span className="text-slate-400 text-xs font-medium flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                <Clock className="h-3.5 w-3.5" /> {post.reading_time || 5} min read
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight text-white drop-shadow-2xl">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-lg border-2 border-white/10 shadow-xl">
                  {post.author_name ? post.author_name.charAt(0) : 'C'}
                </div>
                <div>
                  <p className="font-bold text-white tracking-tight">{post.author_name || 'Celoris Team'}</p>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-emerald-500">Verified Author</p>
                </div>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Calendar className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">{formatDate(post.published_at)}</span>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <Eye className="h-4 w-4 text-emerald-500" />
                <span className="text-sm">{post.views_count || 0} views</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container py-20 px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0a0f1d] rounded-[2.5rem] p-8 md:p-16 shadow-2xl border border-white/5 relative overflow-hidden">
            {/* Decorative blurs */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-emerald-500/5 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-cyan-500/5 rounded-full blur-[100px]" />

            <div className="prose prose-invert prose-emerald prose-lg max-w-none">
              {post.excerpt && (
                <p className="text-xl md:text-2xl text-slate-300 leading-relaxed font-medium mb-12 border-l-4 border-emerald-500 pl-8 py-2 bg-emerald-500/5 rounded-r-2xl">
                  {post.excerpt}
                </p>
              )}

              <article
                className="blog-content space-y-6"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-12 border-t border-white/10 flex flex-wrap gap-3">
                <Tag className="h-4 w-4 text-emerald-500 mt-1" />
                {post.tags.map((tag: string) => (
                  <span key={tag} className="bg-white/5 text-slate-400 px-4 py-1.5 rounded-full text-xs font-bold hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recommended Section (Simplified for now) */}
      <div className="container pb-20 px-4 mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-8 text-white">More Insights from Celoris</h2>
          <Button size="lg" className="bg-emerald-500 hover:bg-emerald-600 text-black font-bold uppercase tracking-widest rounded-full px-12 py-8 text-lg" asChild>
            <Link href="/blog">Browse All Articles</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}