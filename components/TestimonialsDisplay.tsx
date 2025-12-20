"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, User, Building, MapPin, Globe, ChevronLeft, ChevronRight, Quote } from "lucide-react"
import Image from "next/image"

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
  className?: string
}

export default function TestimonialsDisplay({
  type = 'general',
  page = 'homepage',
  limit = 6,
  layout = 'grid',
  showFeatured = true,
  className = ''
}: TestimonialsDisplayProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    loadTestimonials()
  }, [type, page, limit, showFeatured])

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
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
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
    <Card className={`h-full ${featured ? 'ring-2 ring-yellow-400' : ''} relative overflow-hidden`}>
      <CardContent className="p-6 h-full flex flex-col">
        {/* Quote Icon */}
        <div className="mb-4">
          <Quote className="h-8 w-8 text-purple-200" />
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          {renderStars(testimonial.rating)}
          <span className="ml-2 text-sm text-gray-500">({testimonial.rating}/5)</span>
        </div>

        {/* Testimonial Text */}
        <div className="flex-1 mb-6">
          <p className="text-gray-700 leading-relaxed text-sm">"{testimonial.testimonial_text}"</p>
        </div>

        {/* Client Info */}
        <div className="flex items-start space-x-4">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {testimonial.client_avatar_url ? (
              <img
                src={testimonial.client_avatar_url}
                alt={testimonial.client_name}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <User className="h-6 w-6 text-purple-600" />
              </div>
            )}
          </div>

          {/* Client Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h4 className="text-sm font-semibold text-gray-900 truncate">
                {testimonial.client_name}
              </h4>
              {testimonial.is_featured && (
                <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                  Featured
                </div>
              )}
            </div>

            <div className="space-y-1 text-xs text-gray-600">
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
                  <Globe className="h-3 w-3 mr-1 flex-shrink-0" />
                  <a
                    href={testimonial.client_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 truncate"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <div className={`testimonials-loading ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, i) => (
            <Card key={i} className="h-64 animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gray-200 rounded"></div>
                  <div className="w-24 h-4 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="w-full h-3 bg-gray-200 rounded"></div>
                  <div className="w-4/5 h-3 bg-gray-200 rounded"></div>
                  <div className="w-3/5 h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="space-y-2">
                    <div className="w-24 h-4 bg-gray-200 rounded"></div>
                    <div className="w-32 h-3 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (testimonials.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Quote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No testimonials yet</h3>
        <p className="text-gray-500">Testimonials for this section will appear here soon.</p>
      </div>
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
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentIndex ? 'bg-purple-600' : 'bg-gray-300'
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
            <div className="flex-shrink-0">
              {testimonial.client_avatar_url ? (
                <img
                  src={testimonial.client_avatar_url}
                  alt={testimonial.client_name}
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {renderStars(testimonial.rating)}
                <span className="text-sm text-gray-500">({testimonial.rating}/5)</span>
              </div>
              <blockquote className="text-gray-700 mb-3 italic">"{testimonial.testimonial_text}"</blockquote>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
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