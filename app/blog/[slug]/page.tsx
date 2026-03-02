import Link from 'next/link';
import { Calendar, User, Clock, Tag, TrendingUp, ArrowLeft, Eye } from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';
import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Metadata } from 'next';
import { marked } from 'marked';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = (await createServerClient()) as any;

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
  const supabase = (await createServerClient()) as any;
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
    .then(({ error: updateError }: any) => {
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

  // Parse markdown to HTML
  const contentHtml = marked.parse(post.content || '');

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
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent" />

        <div className="container relative h-full flex flex-col justify-end pb-12 text-white px-4 mx-auto">
          <Button variant="ghost" className="text-white w-fit mb-8 hover:bg-white/10 group bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-6" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
          </Button>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-emerald-500/30 backdrop-blur-md">
                {post.category || 'Insights'}
              </span>
              <span className="text-slate-400 text-xs font-bold flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                <Clock className="h-3.5 w-3.5 text-emerald-500" /> {post.reading_time || 5} MIN READ
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.05] tracking-tight text-white drop-shadow-2xl animate-slide-up">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/10 shadow-2xl overflow-hidden">
                  {post.author_name ? post.author_name.charAt(0) : 'C'}
                </div>
                <div>
                  <p className="font-black text-white tracking-tight text-lg">{post.author_name || 'Celoris Team'}</p>
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Creator</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 font-bold">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm uppercase tracking-widest">{formatDate(post.published_at)}</span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <Eye className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm uppercase tracking-widest">{post.views_count || 0} VIEWS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container py-20 px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          {/* Main Content Card */}
          <div className="bg-[#0a0f1d] rounded-[2.5rem] p-8 md:p-16 shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden">
            {/* Decorative backgrounds */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

            <div className="relative z-10">
              {post.excerpt && (
                <div className="mb-16">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 md:p-10 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                    <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-bold italic">
                      "{post.excerpt}"
                    </p>
                  </div>
                </div>
              )}

              <article
                className="prose prose-invert prose-emerald prose-lg max-w-none 
                  prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                  prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8
                  prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
                  prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                  prose-li:text-slate-300 prose-li:text-lg
                  prose-strong:text-emerald-400 prose-strong:font-bold
                  prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-500/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl
                  prose-img:rounded-[2rem] prose-img:border prose-img:border-white/10 prose-img:shadow-2xl
                  blog-content"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              {/* Social Share & Tags Footer */}
              <div className="mt-20 pt-12 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-3">
                    <Tag className="h-4 w-4 text-emerald-500" />
                    {post.tags.map((tag: string) => (
                      <span key={tag} className="bg-white/5 text-slate-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Sharing */}
                <ShareButtons title={post.title} slug={post.slug} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommended Section */}
      <div className="container pb-32 px-4 mx-auto">
        <div className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-br from-emerald-500 to-cyan-600 p-1 md:p-1.5 shadow-[0_20px_60px_rgba(16,185,129,0.3)]">
          <div className="bg-[#050810] rounded-[2.8rem] p-12 md:p-20 text-center relative overflow-hidden">
            {/* Decorative */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

            <h2 className="text-3xl md:text-5xl font-black mb-8 text-white tracking-tight leading-tight"> Ready to level up your professional skills?</h2>
            <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">Join thousands of creators, students and professionals building their future with Celoris. Free tools, real trainers, and genuine opportunities.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-12 py-8 text-lg shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:scale-105 transition-all w-full sm:w-auto" asChild>
                <Link href="/blog">Browse All Articles</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-full px-12 py-8 text-lg w-full sm:w-auto" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center">
        <p className="text-xs font-bold tracking-[0.3em] text-slate-600 uppercase">
          © {new Date().getFullYear()} Celoris Designs LLP • India's Free Creative Studio
        </p>
      </footer>
    </div>
  );
}