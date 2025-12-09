'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Calendar,
  User,
  Clock,
  Tag,
  Eye,
  ArrowRight,
  Search,
  Filter,
  Star,
  TrendingUp,
  Cpu,
  Briefcase,
  Palette,
  Code,
  Megaphone,
  Zap,
  BookOpen,
  Newspaper,
  Layers,
  Globe,
  PlayCircle
} from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
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

interface BlogDisplayProps {
  showFeatured?: boolean;
  showFilters?: boolean;
  layout?: 'grid' | 'list';
  limit?: number;
  category?: string;
  featured?: boolean;
}

const categories = [
  'All', 'General', 'Technology', 'Business', 'Design', 'Development',
  'Marketing', 'Productivity', 'Tutorial', 'News', 'Platform'
];

export function BlogDisplay({
  showFeatured = true,
  showFilters = true,
  layout = 'grid',
  limit,
  category,
  featured
}: BlogDisplayProps) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: category || 'All',
    search: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);

  // Load blog posts
  const loadPosts = async (page = 1, overrideFilters = filters) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: (limit || 12).toString()
      });

      if (overrideFilters.category && overrideFilters.category !== 'All') {
        params.append('category', overrideFilters.category);
      }

      if (featured !== undefined) {
        params.append('featured', featured.toString());
      }

      if (overrideFilters.search) {
        params.append('search', overrideFilters.search);
      }

      const response = await fetch(`/api/blog?${params}`);
      const data = await response.json();

      if (response.ok) {
        let fetchedPosts = data.posts || [];
        // Filter out specific test post if needed, or keep generic
        fetchedPosts = fetchedPosts.filter((p: BlogPost) => !p.title.includes('Sobhita'));

        setPosts(fetchedPosts);
        setCurrentPage(page);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalPosts((data.pagination?.total || 0) + 1);
      }
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load featured posts
  const loadFeaturedPosts = async () => {
    try {
      const response = await fetch('/api/blog/featured');
      const data = await response.json();

      if (response.ok) {
        let fetchedFeatured = data.posts || [];
        fetchedFeatured = fetchedFeatured.filter((p: BlogPost) => !p.title.includes('Sobhita'));
        setFeaturedPosts(fetchedFeatured);
      }
    } catch (error) {
      console.error('Error loading featured posts:', error);
    }
  };

  useEffect(() => {
    loadPosts(1, filters);
  }, [filters, category, featured, limit]);

  useEffect(() => {
    if (showFeatured) {
      loadFeaturedPosts();
    }
  }, [showFeatured]);

  // Format date
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

  // Get category badge color
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

  // Get category icon
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Technology': return <Cpu className="h-12 w-12 text-blue-500" />;
      case 'Business': return <Briefcase className="h-12 w-12 text-green-500" />;
      case 'Design': return <Palette className="h-12 w-12 text-purple-500" />;
      case 'Development': return <Code className="h-12 w-12 text-orange-500" />;
      case 'Marketing': return <Megaphone className="h-12 w-12 text-pink-500" />;
      case 'Productivity': return <Zap className="h-12 w-12 text-yellow-500" />;
      case 'Tutorial': return <BookOpen className="h-12 w-12 text-indigo-500" />;
      case 'News': return <Newspaper className="h-12 w-12 text-red-500" />;
      case 'Platform': return <Layers className="h-12 w-12 text-gray-500" />;
      default: return <Globe className="h-12 w-12 text-gray-500" />;
    }
  };

  // Get category background
  const getCategoryBg = (category: string) => {
    const bgs: Record<string, string> = {
      'Technology': 'bg-blue-50',
      'Business': 'bg-green-50',
      'Design': 'bg-purple-50',
      'Development': 'bg-orange-50',
      'Marketing': 'bg-pink-50',
      'Productivity': 'bg-yellow-50',
      'Tutorial': 'bg-indigo-50',
      'News': 'bg-red-50',
      'Platform': 'bg-gray-50',
      'General': 'bg-gray-50'
    };
    return bgs[category] || 'bg-gray-50';
  }

  // Helper to extract YouTube ID
  const getVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Helper to render media (Thumbnail or Icon)
  const renderPostMedia = (post: BlogPost) => {
    const videoId = post.featured_image_url ? getVideoId(post.featured_image_url) : null;

    if (videoId) {
      return (
        <div className="relative w-full h-full bg-black">
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt={post.title}
            className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <PlayCircle className="w-8 h-8 text-white fill-white/20" />
            </div>
          </div>
        </div>
      );
    }

    // Fallback to Icon
    return (
      <div className={`w-full h-full flex items-center justify-center ${getCategoryBg(post.category)}`}>
        {getCategoryIcon(post.category)}
      </div>
    );
  };

  if (loading && posts.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Featured Posts */}
      {showFeatured && featuredPosts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Featured Posts</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPosts.slice(0, 3).map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full group">
                <Link href={`/blog/${post.slug.replace(/\/$/, '')}`} className="aspect-video">
                  {renderPostMedia(post)}
                </Link>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                      {post.category}
                    </span>
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    <Link href={`/blog/${post.slug.replace(/\/$/, '')}`} className="hover:text-green-600 transition-colors">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {post.author_name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {post.reading_time} min
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <select
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={filters.category}
                onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Posts Grid/List */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
          <p className="text-gray-600">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <p className="text-gray-600">
              {totalPosts} {totalPosts === 1 ? 'post' : 'posts'} found
            </p>
          </div>

          {layout === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col group">
                  <Link href={`/blog/${post.slug.replace(/\/$/, '')}`} className="aspect-video">
                    {renderPostMedia(post)}
                  </Link>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                      {post.is_featured && (
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      <Link href={`/blog/${post.slug.replace(/\/$/, '')}`} className="hover:text-green-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>

                    {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
                          >
                            <Tag className="h-3 w-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.reading_time} min
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {post.views_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            {post.likes_count}
                          </span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">
                            {formatDate(post.published_at)}
                          </span>
                          <Link
                            href={`/blog/${post.slug.replace(/\/$/, '')}`}
                            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors inline-flex items-center gap-1"
                          >
                            Read More
                            <ArrowRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
                  <div className="flex flex-col md:flex-row">
                    <Link href={`/blog/${post.slug.replace(/\/$/, '')}`} className="md:w-1/3 aspect-video md:aspect-auto">
                      {renderPostMedia(post)}
                    </Link>
                    <div className="p-6 md:w-2/3">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                        {post.is_featured && (
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        )}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        <Link href={`/blog/${post.slug.replace(/\/$/, '')}`} className="hover:text-green-600 transition-colors">
                          {post.title}
                        </Link>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {post.author_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {post.reading_time} min
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(post.published_at)}
                          </span>
                        </div>
                        <Link
                          href={`/blog/${post.slug.replace(/\/$/, '')}`}
                          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-md transition-colors inline-flex items-center gap-1"
                        >
                          Read More
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => loadPosts(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => loadPosts(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}