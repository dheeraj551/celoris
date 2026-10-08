"use client"

import Link from "next/link"
import type { CSSProperties } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowUpRight, ChevronRight, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { SpotlightCard } from "@/components/ui/spotlight-card"

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
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
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
    <div className="flex flex-wrap items-center gap-4 text-slate-400 text-[11px] font-bold uppercase tracking-wider">
      <div className="flex items-center gap-1.5">
        <Calendar className="h-3.5 w-3.5 text-amber-400" />
        {formatDate(post.published_at)}
      </div>
      <div className="flex items-center gap-1.5">
        <Clock className="h-3.5 w-3.5 text-amber-400" />
        {post.reading_time} min read
      </div>
    </div>
  )
}

function AuthorBadge({ post }: { post: BlogPost }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-black text-sm border border-white/10 shadow-lg shrink-0">
        {post.author_name ? post.author_name.charAt(0) : 'C'}
      </div>
      <div>
        <p className="text-xs font-bold text-white leading-tight">{post.author_name || 'Celoris'}</p>
        <p className="text-[10px] text-amber-400/90 font-medium tracking-wide">Studio Contributor</p>
      </div>
    </div>
  )
}

export function BlogPostsGrid({ posts, currentPage, totalPages }: BlogPostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-24 bg-white/5 rounded-3xl border border-white/5 backdrop-blur-sm">
        <p className="text-slate-400 text-lg font-medium">No articles found yet. Check back soon!</p>
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
        <div className="mb-12">
          <SpotlightCard
            radius="2rem"
            beamColor="rgba(245, 158, 11, 0.75)"
            glowColor="rgba(245, 158, 11, 0.08)"
            className="shadow-[0_0_60px_rgba(245,158,11,0.06)]"
            innerClassName="bg-[#111217] border border-white/5 overflow-hidden"
          >
            <motion.article
              initial="hidden"
              animate="visible"
              variants={fadeUp}
              className="group relative"
            >
              <div className="flex flex-col lg:flex-row">
                {/* Visual / Motion Banner */}
                <div className="lg:w-1/2 aspect-video lg:aspect-auto overflow-hidden relative">
                  <Link href={`/blog/${featured.slug}`}>
                    {featured.slug === 'premiere-pro-ai-efficiency-guide-2026' ? (
                      <video
                        src="/premiere-pro-ai-banner.mp4"
                        poster={featured.featured_image_url || "/premiere-pro-ai-efficiency-guide-2026.jpg"}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <motion.img
                        src={featured.featured_image_url || "/images/homepage/hero.png"}
                        alt={featured.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                      />
                    )}
                  </Link>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Badges */}
                  <div className="absolute top-5 left-5 flex items-center gap-2">
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-lg shadow-amber-500/20">
                      Featured
                    </span>
                    <span className="bg-black/75 backdrop-blur-md text-amber-300 text-[10px] font-bold tracking-wider px-3.5 py-1.5 rounded-full border border-amber-500/30">
                      {featured.category}
                    </span>
                  </div>

                  {featured.slug === 'premiere-pro-ai-efficiency-guide-2026' && (
                    <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-black/80 backdrop-blur-md px-3 py-1 rounded-full border border-amber-500/30 text-[10px] font-bold text-amber-300">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      Live Motion
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                  <div className="mb-4"><PostMeta post={featured} /></div>

                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 group-hover:text-amber-400 transition-colors leading-tight tracking-tight">
                    <Link href={`/blog/${featured.slug}`}>{featured.title}</Link>
                  </h2>

                  <p className="text-slate-300 text-base leading-relaxed mb-6 line-clamp-3">
                    {featured.excerpt || 'Discover the full breakdown inside...'}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-white/5">
                    <AuthorBadge post={featured} />
                    <Link
                      href={`/blog/${featured.slug}`}
                      className="inline-flex items-center gap-2 text-amber-400 hover:text-slate-950 hover:bg-amber-400 transition-all rounded-full px-5 py-2.5 font-bold tracking-wider text-xs border border-amber-500/30 shadow-md"
                    >
                      Read Article
                      <ArrowUpRight className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.article>
          </SpotlightCard>
        </div>
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
              whileHover={{ y: -5 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className="group flex flex-col bg-[#131419] rounded-2xl border border-white/5 hover:border-amber-500/30 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-amber-500/5"
            >
              <div className="aspect-video overflow-hidden relative">
                <Link href={`/blog/${post.slug}`}>
                  <img
                    src={post.featured_image_url || "/images/homepage/hero.png"}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors pointer-events-none" />
                <div className="absolute top-3.5 left-3.5">
                  <span className="bg-black/75 backdrop-blur-md text-amber-300 text-[9px] font-bold tracking-wider px-3 py-1 rounded-full border border-amber-500/30">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="flex-1 p-6 flex flex-col">
                <div className="mb-3"><PostMeta post={post} /></div>

                <h3 className="text-lg font-bold text-white mb-3 group-hover:text-amber-400 transition-colors leading-snug tracking-tight line-clamp-2">
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>

                <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-2 flex-1">
                  {post.excerpt || 'Discover more insights inside...'}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-white/5">
                  <AuthorBadge post={post} />
                  <Link
                    href={`/blog/${post.slug}`}
                    aria-label={`Read ${post.title}`}
                    className="flex items-center justify-center w-8 h-8 rounded-full border border-amber-500/30 text-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950 transition-all shrink-0"
                  >
                    <ArrowUpRight className="h-4 w-4" />
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
              "inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all rounded-xl px-5 h-11 font-bold tracking-wider text-xs",
              currentPage <= 1 && "opacity-50 pointer-events-none"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Link>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <motion.div key={pageNum} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={`/blog?page=${pageNum}`}
                  className={cn(
                    "flex items-center justify-center w-11 h-11 rounded-xl font-bold transition-all border text-xs",
                    currentPage === pageNum
                      ? "bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/20"
                      : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-amber-500/50"
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
              "inline-flex items-center gap-2 bg-white/5 border border-white/10 text-white hover:bg-amber-500 hover:text-slate-950 hover:border-amber-500 transition-all rounded-xl px-5 h-11 font-bold tracking-wider text-xs",
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
