"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, User, Building, MapPin, Globe, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { SpotlightCard } from "@/components/ui/spotlight-card"

interface Testimonial {
  id: string
  client_name: string
  client_title: string | null
  client_company: string | null
  client_avatar_url: string | null
  testimonial_text: string
  rating: number
  testimonial_type: string
  client_location: string | null
  client_website: string | null
  date_received: string | null
  is_featured: boolean
  project_details: any | null
}

interface TestimonialsDisplayProps {
  type?: 'general' | 'service' | 'product' | 'feature' | 'support' | 'all'
  page?: 'homepage' | 'about' | 'services' | 'contact' | 'blog' | 'portfolio' | 'pricing' | 'features' | 'all'
  limit?: number
  layout?: 'grid' | 'carousel' | 'list' | 'marquee'
  showFeatured?: boolean
  showImages?: boolean
  showCategoryFilter?: boolean
  className?: string
}

export type ReviewCategory = 'Student' | 'Teacher' | 'Creator' | 'Customer'

export const REVIEW_CATEGORIES: ReviewCategory[] = ['Student', 'Teacher', 'Creator', 'Customer']

export const resolveReviewCategory = (testimonial: Testimonial): ReviewCategory => {
  const title = (testimonial.client_title || '').trim().toLowerCase()
  if (title === 'student' || title.includes('student') || title.includes('learner')) return 'Student'
  if (title === 'teacher' || title.includes('teacher') || title.includes('trainer') || title.includes('instructor')) return 'Teacher'
  if (title === 'creator' || title.includes('creator') || title.includes('developer') || title.includes('designer') || title.includes('freelance') || title.includes('artist')) return 'Creator'
  if (title === 'customer' || title.includes('customer') || title.includes('founder') || title.includes('client') || title.includes('manager') || title.includes('business')) return 'Customer'

  const text = (testimonial.testimonial_text || '').toLowerCase()
  if (text.includes('business') || text.includes('company') || text.includes('small businesses') || text.includes('hiring') || text.includes('services available')) {
    return 'Customer'
  }
  if (text.includes('creator') || text.includes('freelancer') || text.includes('workflow') || text.includes('creating with it') || text.includes('editing')) {
    return 'Creator'
  }
  if (text.includes('trainer') || text.includes('teaching') || text.includes('instructor') || text.includes('demonstrated to clients')) {
    return 'Teacher'
  }
  return 'Student'
}

const CATEGORY_ORDER: Record<ReviewCategory, number> = {
  Student: 1,
  Teacher: 2,
  Creator: 3,
  Customer: 4,
}

const ClientRoleBadge = ({ testimonial }: { testimonial: Testimonial }) => {
  const category = resolveReviewCategory(testimonial)

  return (
    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.12)]">
      <span className="relative flex h-1.5 w-1.5 flex-shrink-0">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400"></span>
      </span>
      <span className="font-mono font-bold text-[9px] uppercase tracking-widest text-emerald-300 leading-none">
        {category}
      </span>
    </div>
  )
}

export default function TestimonialsDisplay({
  type = 'general',
  page = 'homepage',
  limit = 6,
  layout = 'grid',
  showFeatured = true,
  showImages = true,
  showCategoryFilter = true,
  className = '',
  initialTestimonials = null
}: TestimonialsDisplayProps & { initialTestimonials?: Testimonial[] | null }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials || [])
  const [loading, setLoading] = useState(!initialTestimonials)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<'all' | ReviewCategory>('all')

  useEffect(() => {
    if (initialTestimonials) return;
    loadTestimonials()
  }, [type, page, limit, showFeatured, initialTestimonials])

  const loadTestimonials = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        type: type,
        page: page,
        limit: limit.toString()
      })

      if (showFeatured) {
        params.append('featured', 'true')
      }

      const response = await fetch(`/api/testimonials?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        let filteredData = data.data || []

        // Apply basic filtering
        if (type && type !== 'all') {
          filteredData = filteredData.filter((t: Testimonial) => t.testimonial_type === type)
        }

        if (showFeatured) {
          filteredData = filteredData.filter((t: Testimonial) => t.is_featured)
        }

        setTestimonials(filteredData.slice(0, limit))
      }
    } catch (error) {
      console.error('Error loading testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${i < rating ? 'text-emerald-500 fill-current' : 'text-slate-700'}`}
      />
    ))
  }

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.max(testimonials.length, 1))
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.max(testimonials.length, 1)) % Math.max(testimonials.length, 1))
  }

  const TestimonialCard = ({ testimonial, index = 0, featured = false }: { testimonial: Testimonial, index?: number, featured?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: "easeOut" }}
      className="h-full"
    >
      <SpotlightCard
        radius="2rem"
        beamColor="rgba(16, 185, 129, 0.75)"
        glowColor="rgba(16, 185, 129, 0.1)"
        className={`h-full ${featured ? 'shadow-[0_0_50px_rgba(16,185,129,0.15)]' : ''}`}
        innerClassName={`relative h-full flex flex-col bg-[#08090d]/80 backdrop-blur-3xl p-8 overflow-hidden group border border-white/[0.08] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] ${featured ? 'ring-1 ring-emerald-400/40' : ''}`}
      >
        {/* Glow Orb */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-[60px] pointer-events-none group-hover:bg-emerald-500/20 transition-colors duration-500" />

        {/* Decorative Quote */}
        <Quote className="absolute top-6 right-6 h-16 w-16 text-emerald-500/5 group-hover:text-emerald-500/10 transition-colors duration-500 pointer-events-none" />

        {/* Rating */}
        <div className="flex items-center mb-6 relative z-10">
          <div className="flex gap-1">
            {Array.from({ length: 5 }, (_, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.12 + i * 0.06 }}
              >
                <Star
                  className={`h-3.5 w-3.5 ${i < testimonial.rating ? 'text-emerald-400 fill-current drop-shadow-[0_0_4px_rgba(52,211,153,0.6)]' : 'text-slate-700'}`}
                />
              </motion.span>
            ))}
          </div>
          <span className="ml-3 text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">
            {testimonial.rating}/5 rating
          </span>
        </div>

        {/* Testimonial Text */}
        <div className="flex-1 mb-8 relative z-10">
          <p className="text-slate-300 leading-relaxed text-sm font-medium">"{testimonial.testimonial_text}"</p>
        </div>

        {/* Client Info */}
        <div className="flex items-center space-x-4 relative z-10">
          {showImages && (
            <div className="flex-shrink-0 p-[2px] rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-400 shadow-[0_0_16px_rgba(16,185,129,0.35)]">
              {testimonial.client_avatar_url ? (
                <img
                  src={testimonial.client_avatar_url}
                  alt={testimonial.client_name}
                  className="w-11 h-11 rounded-[14px] object-cover block"
                />
              ) : (
                <div className="w-11 h-11 rounded-[14px] bg-[#0a0a0a] flex items-center justify-center">
                  <User className="h-5 w-5 text-emerald-400" />
                </div>
              )}
            </div>
          )}

          {/* Client Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="text-sm font-black text-white uppercase tracking-tight truncate">
                {testimonial.client_name}
              </h4>
              {testimonial.is_featured && (
                <span className="flex-shrink-0 text-emerald-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  Elite
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] font-bold text-slate-500 uppercase tracking-wide">
              <ClientRoleBadge testimonial={testimonial} />

              {testimonial.client_company && (
                <span className="flex items-center truncate">
                  <Building className="h-3 w-3 mr-1 flex-shrink-0" />
                  {testimonial.client_company}
                </span>
              )}

              {testimonial.client_location && (
                <span className="flex items-center truncate">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  {testimonial.client_location}
                </span>
              )}

              {testimonial.client_website && (
                <a
                  href={testimonial.client_website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-emerald-500 hover:text-emerald-400 transition-colors truncate"
                >
                  <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>
      </SpotlightCard>
    </motion.div>
  )

  if (loading) {
    return (
      <div className={`testimonials-loading ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="h-72 bg-white/5 border border-white/5 rounded-[2rem] p-8 animate-pulse">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-white/10 rounded"></div>
              </div>
              <div className="space-y-3 mb-8">
                <div className="w-full h-3 bg-white/10 rounded"></div>
                <div className="w-4/5 h-3 bg-white/10 rounded"></div>
                <div className="w-3/5 h-3 bg-white/10 rounded"></div>
              </div>
              <div className="flex items-center space-x-5 mt-auto">
                {showImages && <div className="w-12 h-12 bg-white/10 rounded-2xl"></div>}
                <div className="space-y-2 flex-1">
                  <div className="w-24 h-4 bg-white/10 rounded"></div>
                  <div className="w-32 h-3 bg-white/10 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const filteredTestimonials = testimonials
    .filter((t) => (selectedCategory === 'all' ? true : resolveReviewCategory(t) === selectedCategory))
    .sort((a, b) => CATEGORY_ORDER[resolveReviewCategory(a)] - CATEGORY_ORDER[resolveReviewCategory(b)])

  const renderCategoryFilter = () => {
    if (!showCategoryFilter || testimonials.length === 0) return null

    return (
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8 px-2">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
            selectedCategory === 'all'
              ? 'bg-emerald-400 text-black shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-105'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
          }`}
        >
          All ({testimonials.length})
        </button>
        {REVIEW_CATEGORIES.map((cat) => {
          const count = testimonials.filter((t) => resolveReviewCategory(t) === cat).length
          if (count === 0) return null
          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                selectedCategory === cat
                  ? 'bg-emerald-400 text-black shadow-[0_0_20px_rgba(52,211,153,0.5)] scale-105'
                  : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 border border-white/10'
              }`}
            >
              {cat}s ({count})
            </button>
          )
        })}
      </div>
    )
  }

  if (testimonials.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`text-center py-24 bg-white/5 border border-white/5 rounded-[3rem] ${className}`}
      >
        <Quote className="h-16 w-16 text-emerald-500/20 mx-auto mb-6" />
        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">Signal Silence</h3>
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Awaiting new node transmissions.</p>
      </motion.div>
    )
  }

  if (layout === 'marquee' && filteredTestimonials.length > 0) {
    const duration = Math.max(20, filteredTestimonials.length * 6)
    const marqueeItems =
      filteredTestimonials.length < 4
        ? [...filteredTestimonials, ...filteredTestimonials, ...filteredTestimonials, ...filteredTestimonials]
        : [...filteredTestimonials, ...filteredTestimonials]

    return (
      <div className={`space-y-6 ${className}`}>
        {renderCategoryFilter()}
        <div
          className="relative overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
          }}
        >
          <div
            key={selectedCategory}
            className="home-marquee-track flex items-start gap-6 w-max"
            style={{ '--marquee-duration': `${duration}s` } as React.CSSProperties}
          >
            {marqueeItems.map((testimonial, index) => (
              <div key={`${testimonial.id}-${index}`} className="w-[320px] md:w-[380px] shrink-0">
                <TestimonialCard
                  testimonial={testimonial}
                  index={index % filteredTestimonials.length}
                  featured={testimonial.is_featured}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (layout === 'carousel' && filteredTestimonials.length > 1) {
    return (
      <div className={`relative ${className}`}>
        {renderCategoryFilter()}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {filteredTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-2">
                <div className="max-w-4xl mx-auto">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {filteredTestimonials.length > 1 && (
          <>
            <button
              onClick={prevTestimonial}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-10"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-10"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>

            <div className="flex justify-center mt-6 space-x-2">
              {filteredTestimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-white/10'
                    }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  if (layout === 'list') {
    return (
      <div className={`space-y-6 ${className}`}>
        {renderCategoryFilter()}
        {filteredTestimonials.map((testimonial) => (
          <div key={testimonial.id} className="flex items-start space-x-4">
            {showImages && (
              <div className="flex-shrink-0">
                {testimonial.client_avatar_url ? (
                  <img
                    src={testimonial.client_avatar_url}
                    alt={testimonial.client_name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <User className="h-8 w-8 text-emerald-500" />
                  </div>
                )}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                {renderStars(testimonial.rating)}
                <span className="ml-2 text-[9px] font-black text-slate-500 uppercase tracking-widest italic leading-none">
                  {testimonial.rating}/5 customer rating
                </span>
              </div>
              <blockquote className="text-slate-300 mb-3 italic">"{testimonial.testimonial_text}"</blockquote>
              <div className="flex items-center space-x-4 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                <span className="font-medium">{testimonial.client_name}</span>
                <ClientRoleBadge testimonial={testimonial} />
                {testimonial.client_company && (
                  <span className="flex items-center">
                    <Building className="h-3 w-3 mr-1" />
                    {testimonial.client_company}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Default grid layout
  return (
    <div className={className}>
      {renderCategoryFilter()}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTestimonials.map((testimonial, index) => (
          <TestimonialCard
            key={testimonial.id}
            testimonial={testimonial}
            index={index}
            featured={testimonial.is_featured}
          />
        ))}
      </div>
    </div>
  )
}
