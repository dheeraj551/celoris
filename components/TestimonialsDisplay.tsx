"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, User, Building, MapPin, Globe, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

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
  layout?: 'grid' | 'carousel' | 'list'
  showFeatured?: boolean
  showImages?: boolean
  className?: string
}

export default function TestimonialsDisplay({
  type = 'general',
  page = 'homepage',
  limit = 6,
  layout = 'grid',
  showFeatured = true,
  showImages = true,
  className = '',
  initialTestimonials = null
}: TestimonialsDisplayProps & { initialTestimonials?: Testimonial[] | null }) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>(initialTestimonials || [])
  const [loading, setLoading] = useState(!initialTestimonials)
  const [currentIndex, setCurrentIndex] = useState(0)

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

  const TestimonialCard = ({ testimonial, featured = false }: { testimonial: Testimonial, featured?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="h-full"
    >
      <Card className={`h-full bg-[#0d1321]/40 border-white/5 hover:border-emerald-500/30 backdrop-blur-3xl shadow-3xl rounded-[2.5rem] overflow-hidden transition-all duration-500 group ${featured ? 'ring-2 ring-emerald-500/50' : ''}`}>
        <CardContent className="p-8 h-full flex flex-col relative">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <Quote className="h-20 w-20 text-emerald-500" />
          </div>

          {/* Quote Icon */}
          <div className="mb-6 relative z-10">
            <Quote className="h-8 w-8 text-emerald-500/50" />
          </div>

          {/* Rating */}
          <div className="flex items-center mb-6 relative z-10">
            <div className="flex gap-1">
              {renderStars(testimonial.rating)}
            </div>
            <span className="ml-3 text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-none">
              SYNC STRENGTH {testimonial.rating}/5
            </span>
          </div>

          {/* Testimonial Text */}
          <div className="flex-1 mb-8 relative z-10">
            <p className="text-slate-300 leading-relaxed text-sm font-medium italic">"{testimonial.testimonial_text}"</p>
          </div>

          {/* Client Info */}
          <div className="flex items-start space-x-4">
            {showImages && (
              <div className="flex-shrink-0">
                {testimonial.client_avatar_url ? (
                  <img
                    src={testimonial.client_avatar_url}
                    alt={testimonial.client_name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <User className="h-6 w-6 text-emerald-500" />
                  </div>
                )}
              </div>
            )}

            {/* Client Details */}
            <div className="flex-1 min-w-0 relative z-10">
              <div className="flex flex-col mb-2">
                <h4 className="text-base font-black text-white italic uppercase tracking-tighter truncate">
                  {testimonial.client_name}
                </h4>
                {testimonial.is_featured && (
                  <div className="inline-flex mt-1 text-emerald-400 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
                    ELITE NODE
                  </div>
                )}
              </div>

              <div className="space-y-1 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                {testimonial.client_title && (
                  <div className="truncate">{testimonial.client_title}</div>
                )}

                <div className="flex items-center space-x-3">
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
                </div>

                {testimonial.client_website && (
                  <div className="flex items-center">
                    <Globe className="h-3 w-3 mr-1.5 flex-shrink-0 text-emerald-500" />
                    <a
                      href={testimonial.client_website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-500 hover:text-emerald-400 transition-colors truncate"
                    >
                      IDENTIFIED DOMAIN
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )

  if (loading) {
    return (
      <div className={`testimonials-loading ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="h-72 bg-white/5 border border-white/5 rounded-[2.5rem] p-8 animate-pulse">
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

  if (layout === 'carousel' && testimonials.length > 1) {
    return (
      <div className={`relative ${className}`}>
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="w-full flex-shrink-0 px-2">
                <div className="max-w-4xl mx-auto">
                  <TestimonialCard testimonial={testimonial} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {testimonials.length > 1 && (
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
              {testimonials.map((_, index) => (
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
        {testimonials.map((testimonial) => (
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
                  {testimonial.rating}/5 SYNC
                </span>
              </div>
              <blockquote className="text-slate-300 mb-3 italic">"{testimonial.testimonial_text}"</blockquote>
              <div className="flex items-center space-x-4 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                <span className="font-medium">{testimonial.client_name}</span>
                {testimonial.client_title && <span>{testimonial.client_title}</span>}
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
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {testimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial.id}
          testimonial={testimonial}
          featured={testimonial.is_featured}
        />
      ))}
    </div>
  )
}
