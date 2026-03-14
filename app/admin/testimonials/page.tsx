"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Plus,
  Edit3,
  Trash2,
  Star,
  Eye,
  EyeOff,
  Filter,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Building,
  MapPin,
  Globe,
  Calendar,
  Award,
  ArrowUp,
  ArrowDown
} from "lucide-react"

interface Testimonial {
  id: string
  client_name: string
  client_title: string | null
  client_company: string | null
  client_avatar_url: string | null
  testimonial_text: string
  rating: number
  testimonial_type: string
  target_pages: string[]
  display_order: number
  is_featured: boolean
  is_visible: boolean
  client_location: string | null
  client_website: string | null
  project_details: any | null
  client_industry: string | null
  date_received: string | null
  verification_status: string
  created_at: string
  updated_at: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [filters, setFilters] = useState({
    type: 'all',
    visible: 'all',
    featured: 'all',
    search: ''
  })
  const [message, setMessage] = useState({ type: '', text: '' })

  const [formData, setFormData] = useState({
    client_name: '',
    client_title: '',
    client_company: '',
    client_avatar_url: '',
    testimonial_text: '',
    rating: 5,
    testimonial_type: 'general',
    target_pages: ['homepage', 'about'],
    display_order: 0,
    is_featured: false,
    is_visible: true,
    client_location: '',
    client_website: '',
    client_industry: '',
    date_received: '',
    verification_status: 'pending'
  })

  useEffect(() => {
    loadTestimonials()
  }, [filters])

  const loadTestimonials = async () => {
    try {
      setLoading(true)

      const params = new URLSearchParams()
      if (filters.type !== 'all') params.set('type', filters.type)
      if (filters.visible !== 'all') params.set('visible', filters.visible)
      if (filters.featured !== 'all') params.set('featured', filters.featured)
      if (filters.search) params.set('search', filters.search)

      const response = await fetch(`/api/admin/testimonials?${params.toString()}`)
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to load testimonials')
      }

      setTestimonials(result.data || [])
    } catch (error) {
      console.error('Error loading testimonials:', error)
      setMessage({ type: 'error', text: 'Failed to load testimonials' })
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      client_name: '',
      client_title: '',
      client_company: '',
      client_avatar_url: '',
      testimonial_text: '',
      rating: 5,
      testimonial_type: 'general',
      target_pages: ['homepage', 'about'],
      display_order: 0,
      is_featured: false,
      is_visible: true,
      client_location: '',
      client_website: '',
      client_industry: '',
      date_received: '',
      verification_status: 'pending'
    })
    setEditingTestimonial(null)
    setShowForm(false)
  }

  const handleEdit = (testimonial: Testimonial) => {
    setFormData({
      client_name: testimonial.client_name,
      client_title: testimonial.client_title || '',
      client_company: testimonial.client_company || '',
      client_avatar_url: testimonial.client_avatar_url || '',
      testimonial_text: testimonial.testimonial_text,
      rating: testimonial.rating,
      testimonial_type: testimonial.testimonial_type,
      target_pages: testimonial.target_pages,
      display_order: testimonial.display_order,
      is_featured: testimonial.is_featured,
      is_visible: testimonial.is_visible,
      client_location: testimonial.client_location || '',
      client_website: testimonial.client_website || '',
      client_industry: testimonial.client_industry || '',
      date_received: testimonial.date_received || '',
      verification_status: testimonial.verification_status
    })
    setEditingTestimonial(testimonial)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to delete testimonial')
      }

      setMessage({ type: 'success', text: 'Testimonial deleted successfully' })
      loadTestimonials()
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to delete testimonial' })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const headers = {
        'Content-Type': 'application/json'
      }

      let response

      if (editingTestimonial) {
        // Update existing testimonial
        response = await fetch('/api/admin/testimonials', {
          method: 'PUT',
          headers,
          body: JSON.stringify({
            id: editingTestimonial.id,
            ...formData,
            target_pages: Array.isArray(formData.target_pages)
              ? formData.target_pages
              : String(formData.target_pages).split(',').map(p => p.trim())
          })
        })
      } else {
        // Create new testimonial
        response = await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            ...formData,
            target_pages: Array.isArray(formData.target_pages)
              ? formData.target_pages
              : String(formData.target_pages).split(',').map(p => p.trim())
          })
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to save testimonial')
        }

        setMessage({ type: 'success', text: result.message || 'Testimonial saved successfully' })
      }

      resetForm()
      loadTestimonials()
    } catch (error) {
      console.error('Error saving testimonial:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to save testimonial' })
    }
  }

  const handleTargetPagesChange = (pages: string[]) => {
    setFormData(prev => ({ ...prev, target_pages: pages }))
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'pending_review':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  const targetPageOptions = [
    'homepage', 'about', 'services', 'contact', 'blog', 'portfolio', 'pricing', 'features'
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading testimonials...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Testimonials Management</h1>
            <p className="text-gray-600">Manage customer testimonials for your website</p>
          </div>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {/* Message */}
        {message.text && (
          <div className={`p-4 rounded-lg mb-6 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' :
            'bg-red-50 text-red-700 border border-red-200'
            }`}>
            {message.text}
          </div>
        )}

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filters & Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={filters.search}
                    onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                    placeholder="Search testimonials..."
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Types</option>
                  <option value="general">General</option>
                  <option value="service">Service</option>
                  <option value="product">Product</option>
                  <option value="feature">Feature</option>
                  <option value="support">Support</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                <select
                  value={filters.visible}
                  onChange={(e) => setFilters(prev => ({ ...prev, visible: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All</option>
                  <option value="true">Visible</option>
                  <option value="false">Hidden</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Featured</label>
                <select
                  value={filters.featured}
                  onChange={(e) => setFilters(prev => ({ ...prev, featured: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All</option>
                  <option value="true">Featured</option>
                  <option value="false">Regular</option>
                </select>
              </div>

              <div className="flex items-end">
                <Button
                  onClick={loadTestimonials}
                  variant="outline"
                  className="w-full"
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Testimonials List */}
        <div className="grid gap-6">
          {testimonials?.map((testimonial) => (
            <Card key={testimonial.id} className={`${testimonial.is_featured ? 'ring-2 ring-yellow-400' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-3">
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
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="text-lg font-semibold text-gray-900">{testimonial.client_name}</h3>
                          {testimonial.is_featured && (
                            <Award className="h-4 w-4 text-yellow-500" />
                          )}
                          {getStatusIcon(testimonial.verification_status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          {testimonial.client_title && (
                            <span>{testimonial.client_title}</span>
                          )}
                          {testimonial.client_company && (
                            <span className="flex items-center">
                              <Building className="h-3 w-3 mr-1" />
                              {testimonial.client_company}
                            </span>
                          )}
                          {testimonial.client_location && (
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {testimonial.client_location}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="flex items-center space-x-2 mb-2">
                        {renderStars(testimonial.rating)}
                        <span className="text-sm text-gray-500">({testimonial.rating}/5)</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${testimonial.testimonial_type === 'service' ? 'bg-blue-100 text-blue-800' :
                          testimonial.testimonial_type === 'product' ? 'bg-green-100 text-green-800' :
                            testimonial.testimonial_type === 'feature' ? 'bg-purple-100 text-purple-800' :
                              testimonial.testimonial_type === 'support' ? 'bg-orange-100 text-orange-800' :
                                'bg-gray-100 text-gray-800'
                          }`}>
                          {testimonial.testimonial_type}
                        </span>
                        {!testimonial.is_visible && (
                          <span className="flex items-center text-xs text-red-600">
                            <EyeOff className="h-3 w-3 mr-1" />
                            Hidden
                          </span>
                        )}
                      </div>
                      <p className="text-gray-700 leading-relaxed">{testimonial.testimonial_text}</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <span>Pages: {testimonial.target_pages.join(', ')}</span>
                        {testimonial.client_website && (
                          <span className="flex items-center">
                            <Globe className="h-3 w-3 mr-1" />
                            <a href={testimonial.client_website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-800">
                              Website
                            </a>
                          </span>
                        )}
                        {testimonial.date_received && (
                          <span className="flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(testimonial.date_received).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={() => handleEdit(testimonial)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit3 className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(testimonial.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {testimonials.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <div className="text-gray-500">
                  <Award className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-2">No testimonials found</h3>
                  <p className="text-gray-400">Get started by adding your first testimonial.</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Add/Edit Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Name *
                      </label>
                      <Input
                        value={formData.client_name}
                        onChange={(e) => setFormData(prev => ({ ...prev, client_name: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Title
                      </label>
                      <Input
                        value={formData.client_title}
                        onChange={(e) => setFormData(prev => ({ ...prev, client_title: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Company
                      </label>
                      <Input
                        value={formData.client_company}
                        onChange={(e) => setFormData(prev => ({ ...prev, client_company: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Avatar URL
                      </label>
                      <Input
                        value={formData.client_avatar_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, client_avatar_url: e.target.value }))}
                        placeholder="https://example.com/avatar.jpg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <Input
                        value={formData.client_location}
                        onChange={(e) => setFormData(prev => ({ ...prev, client_location: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Client Website
                      </label>
                      <Input
                        value={formData.client_website}
                        onChange={(e) => setFormData(prev => ({ ...prev, client_website: e.target.value }))}
                        placeholder="https://example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry
                      </label>
                      <Input
                        value={formData.client_industry}
                        onChange={(e) => setFormData(prev => ({ ...prev, client_industry: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Received
                      </label>
                      <Input
                        type="date"
                        value={formData.date_received}
                        onChange={(e) => setFormData(prev => ({ ...prev, date_received: e.target.value }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Testimonial Type
                      </label>
                      <select
                        value={formData.testimonial_type}
                        onChange={(e) => setFormData(prev => ({ ...prev, testimonial_type: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="general">General</option>
                        <option value="service">Service</option>
                        <option value="product">Product</option>
                        <option value="feature">Feature</option>
                        <option value="support">Support</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Rating
                      </label>
                      <select
                        value={formData.rating}
                        onChange={(e) => setFormData(prev => ({ ...prev, rating: parseInt(e.target.value) }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        {[5, 4, 3, 2, 1].map(rating => (
                          <option key={rating} value={rating}>
                            {rating} Star{rating !== 1 ? 's' : ''}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <Input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) => setFormData(prev => ({ ...prev, display_order: parseInt(e.target.value) || 0 }))}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Status
                      </label>
                      <select
                        value={formData.verification_status}
                        onChange={(e) => setFormData(prev => ({ ...prev, verification_status: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="verified">Verified</option>
                        <option value="pending_review">Pending Review</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Testimonial Text *
                    </label>
                    <textarea
                      value={formData.testimonial_text}
                      onChange={(e) => setFormData(prev => ({ ...prev, testimonial_text: e.target.value }))}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                      placeholder="Enter the testimonial text..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Pages (comma-separated)
                    </label>
                    <Input
                      value={Array.isArray(formData.target_pages) ? formData.target_pages.join(', ') : formData.target_pages}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        target_pages: e.target.value.split(',').map(p => p.trim()).filter(p => p)
                      }))}
                      placeholder="homepage, about, services"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Available: {targetPageOptions.join(', ')}
                    </p>
                  </div>

                  <div className="flex items-center space-x-6">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Featured</span>
                    </label>

                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.is_visible}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_visible: e.target.checked }))}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700">Visible</span>
                    </label>
                  </div>

                  <div className="flex justify-end space-x-4 pt-6 border-t">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                      {editingTestimonial ? 'Update Testimonial' : 'Create Testimonial'}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
