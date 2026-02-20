import Link from 'next/link';
import { Calendar, User, Clock, Tag, Eye, TrendingUp, ArrowLeft } from 'lucide-react';
import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image_url?: string;
  author_name: string;
  category: string;
  tags: string[];
  reading_time: number;
  published_at: string;
  views_count: number;
  likes_count: number;
  is_featured?: boolean;
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
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
  // Note: In a production app, you might want to debounce this or use a different strategy
  // but for now we follow the existing logic.
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Technology': 'bg-blue-100 text-blue-800',
      'Business': 'bg-green-100 text-green-800',
      'Design': 'bg-purple-100 text-purple-800',
      'Development': 'bg-orange-100 text-orange-800',
      'Marketing': 'bg-pink-100 text-pink-800',
      'Productivity': 'bg-yellow-100 text-yellow-800',
      'Tutorial': 'bg-indigo-100 text-indigo-800',
      'News': 'bg-red-100 text-red-800',
      'Platform': 'bg-gray-100 text-gray-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
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
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://www.celorisdesigns.com/blog/${post.slug}`
      }
    ]
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featured_image_url,
    "author": {
      "@type": "Organization",
      "name": "Celoris Designs"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Celoris Designs",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.celorisdesigns.com/celoris-logo.svg"
      }
    },
    "datePublished": post.published_at || post.created_at
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 mb-8 font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(post.category)}`}>
              {post.category}
            </span>
            {post.is_featured && (
              <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                <TrendingUp className="w-3 h-3" />
                Featured
              </span>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              <span className="font-medium">{post.author_name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span>{formatDate(post.published_at)}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>{post.reading_time || 5} min read</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span>{post.views_count || 0} views</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>{post.likes_count || 0} likes</span>
              </div>
            </div>
          </div>

          {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              {post.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Featured Video */}
        {(() => {
          const getVideoId = (url: string) => {
            if (!url) return null;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
          };

          const videoId = post.featured_image_url ? getVideoId(post.featured_image_url) : null;

          if (videoId) {
            return (
              <div className="mb-8 aspect-video w-full rounded-lg shadow-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title={post.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            );
          }
          return null;
        })()}

        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div
            className="text-gray-800 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content || 'Content not available' }}
          />
        </div>

        {/* Article Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                <span>{post.views_count || 0} views</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                <span>{post.likes_count || 0} likes</span>
              </div>
            </div>

            <Link
              href="/blog"
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              More Articles
            </Link>
          </div>
        </footer>
      </article>
    </div>
  );
}