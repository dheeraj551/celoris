"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowUpRight, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  author_name: string
  published_at: string
  category: string
  reading_time: number
  featured_image_url?: string
}

interface BlogPostsGridProps {
  posts: BlogPost[]
  currentPage: number
  totalPages: number
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
}

function formatDate(dateString: string) {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return 'Recently'
  }
}

function PostMeta({ post }: { post: BlogPost }) {
  return (
    <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[11px] font-bold uppercase tracking-widest">
      <div className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5 text-emerald-500" />
        {formatDate(post.published_at)}
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-emerald-500" />
        {post.reading_time} min read
      </div>
    </div>
  )
}

function AuthorBadge({ post }: { post: BlogPost }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-sm border border-white/10 shadow-lg shrink-0">
        {post.author_name ? post.author_name.charAt(0) : 'C'}
      </div>
      <div>
        <p className="text-xs font-bold text-white leading-tight">{post.author_name || 'Celoris'}</p>
        <p className="text-[9px] text-emerald-500/80 font-bold uppercase tracking-tighter">Verified Creator</p>
      </div>
    </div>
  )
}

export function BlogPostsGrid({ posts, currentPage, totalPages }: BlogPostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-24 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
        <p className="text-slate-500 text-xl font-medium">No insights found yet. Check back soon!</p>
      </div>
    )
  }

  const isFirstPage = currentPage <= 1
  const featured = isFirstPage ? posts[0] : null
  const rest = isFirstPage ? posts.slice(1) : posts

  return (
    <div>
      {/* Featured hero post */}
      {featured && (
        <motion.article
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="group relative bg-[#0a0f1d] rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-colors duration-500 overflow-hidden shadow-2xl mb-10"
        >
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden relative">
              <Link href={`/blog/${featured.slug}`}>
                <motion.img
                  src={featured.featured_image_url || "/images/homepage/hero.png"}
                  alt={featured.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </Link>
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="bg-emerald-500 text-black text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-lg shadow-emerald-500/30">
                  Latest
                </span>
                <span className="bg-black/60 backdrop-blur-md text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-emerald-500/30">
                  {featured.category}
                </span>
              </div>
            </div>

            <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-5"><PostMeta post={featured} /></div>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 group-hover:text-emerald-400 transition-colors leading-[1.05] tracking-tight">
                <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
              </h2>

              <p className="text-slate-400 text-lg leading-relaxed mb-8 line-clamp-3 italic">
                "{featured.excerpt || 'Discover more insights inside...'}"
              </p>

              <div className="mt-auto flex items-center justify-between">
                <AuthorBadge post={featured} />
                <Link
                  href={`/blog/${featured.slug}`}
                  className="inline-flex items-center gap-2 text-emerald-500 hover:text-white hover:bg-emerald-500 transition-all rounded-full px-6 py-3 font-bold uppercase tracking-widest text-[10px] border border-emerald-500/20"
                >
                  Read Insights
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.article>
      )}

      {/* Grid of remaining posts */}
      {rest.length > 0 && (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7"
        >
          {rest.map((post) => (
            <motion.article
              key={post.id}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="group flex flex-col bg-[#0a0f1d] rounded-[2rem] border border-white/5 hover:border-emerald-500/30 transition-colors duration-500 overflow-hidden shadow-xl hover:shadow-emerald-500/10"
            >
              <div className="aspect-video overflow-hidden relative">
                <Link href={`/blog/${post.slug}`}>
                  <img
                    src={post.featured_image_url || "/images/homepage/hero.png"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                </Link>
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors pointer-events-none" />
                <div className="absolute top-4 left-4">
                  <span className="bg-black/60 backdrop-blur-md text-emerald-400 text-[9px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full border border-emerald-500/30">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-6 flex flex-col">
                <div className="mb-3"><PostMeta post={post} /></div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-emerald-400 transition-colors leading-snug tracking-tight line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
                  {post.excerpt || 'Discover more insights inside...'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <AuthorBadge post={post} />
                  <Link
                    href={`/blog/${post.slug}`}
                    aria-label={`Read ${post.title}`}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-emerald-500/20 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-black transition-all shrink-0"
                  >
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-16 flex items-center justify-center gap-4"
        >
          <Link
            href={`/blog?page=${currentPage - 1}`}
            className={cn(
              "inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all rounded-2xl px-6 h-12 font-bold uppercase tracking-widest text-[10px]",
              currentPage <= 1 && "opacity-50 pointer-events-none"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <motion.div key={pageNum} whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={`/blog?page=${pageNum}`}
                  className={cn(
                    "flex items-center justify-center w-12 h-12 rounded-2xl font-bold transition-all border",
                    currentPage === pageNum
                      ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-emerald-500/50"
                  )}
                >
                  {pageNum}
                </Link>
              </motion.div>
            ))}
          </div>

          <Link
            href={`/blog?page=${currentPage + 1}`}
            className={cn(
              "inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all rounded-2xl px-6 h-12 font-bold uppercase tracking-widest text-[10px]",
              currentPage >= totalPages && "opacity-50 pointer-events-none"
            )}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Link>
        </motion.div>
      )}
    </div>
  )
}
