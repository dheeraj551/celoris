'use client';

import { useState, useEffect } from 'react';
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"

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

export default function BlogPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBlogPosts();
  }, []);

  const loadBlogPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/blog?page=1&limit=10');

      if (!response.ok) {
        throw new Error('Failed to load blog posts');
      }

      const data = await response.json();
      setBlogPosts(data.posts || []);
    } catch (error) {
      console.error('Error loading blog posts:', error);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

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

          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {!loading && !error && blogPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-text-secondary">No blog posts found.</p>
            </div>
          )}

          {!loading && !error && blogPosts.length > 0 && (
            <div className="space-y-8">
              {blogPosts.map((post) => (
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