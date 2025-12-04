'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, MapPin, Clock, AlertCircle, CheckCircle, Star } from 'lucide-react'
import Link from 'next/link'

interface NoticeBoardItem {
  id: string
  title: string
  student_name: string
  subject: string
  location: string
  contact_number?: string | null
  description?: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  category: string
  requirements?: string
  duration?: string
  created_at: string
}

interface NoticeBoardResponse {
  data: NoticeBoardItem[]
  pagination: {
    total: number
    limit: number
    offset: number
    hasMore: boolean
  }
}

const priorityConfig = {
  urgent: {
    label: 'URGENT',
    icon: AlertCircle,
    bgColor: 'bg-red-100',
    textColor: 'text-red-700',
    borderColor: 'border-l-red-500',
    iconColor: 'text-red-600'
  },
  high: {
    label: 'HIGH',
    icon: Star,
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-700',
    borderColor: 'border-l-orange-500',
    iconColor: 'text-orange-600'
  },
  normal: {
    label: 'NORMAL',
    icon: CheckCircle,
    bgColor: 'bg-green-100',
    textColor: 'text-green-700',
    borderColor: 'border-l-green-500',
    iconColor: 'text-green-600'
  },
  low: {
    label: 'LOW',
    icon: Clock,
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-700',
    borderColor: 'border-l-blue-500',
    iconColor: 'text-blue-600'
  }
}

const categoryIcons: { [key: string]: React.ElementType } = {
  tutoring: BookOpen,
  group_classes: Users,
  online: BookOpen,
  exam_prep: Star,
  language: BookOpen,
  music: BookOpen,
  sports: Users
}

function getTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60))
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInHours < 1) {
    return 'Just now'
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  } else {
    return date.toLocaleDateString()
  }
}

export default function NoticeBoard({ limit = 6 }: { limit?: number }) {
  const [notices, setNotices] = useState<NoticeBoardItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/notice-board?limit=${limit}`)

        if (!response.ok) {
          throw new Error('Failed to fetch notice board data')
        }

        const result: NoticeBoardResponse = await response.json()
        setNotices(result.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchNotices()
  }, [limit])

  const [selectedNotice, setSelectedNotice] = useState<NoticeBoardItem | null>(null)
  const [interestForm, setInterestForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleInterestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedNotice) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/notice-board/interest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          notice_id: selectedNotice.id,
          ...interestForm
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit interest')
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        setSubmitSuccess(false)
        setSelectedNotice(null)
        setInterestForm({ name: '', email: '', phone: '', message: '' })
      }, 2000)
    } catch (err) {
      console.error(err)
      // Handle error (maybe show a toast)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {[...Array(3)].map((_, index) => (
          <Card key={index} className="card-hover">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-600 mb-4">
          <AlertCircle className="h-8 w-8 mx-auto mb-2" />
          <p>Error loading notice board: {error}</p>
        </div>
        <Button
          onClick={() => window.location.reload()}
          variant="outline"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {notices.length === 0 ? (
          <div className="col-span-full text-center py-8">
            <div className="text-gray-500">
              <BookOpen className="h-8 w-8 mx-auto mb-2" />
              <p>No notice board entries available at the moment.</p>
            </div>
          </div>
        ) : (
          notices.map((notice) => {
            const config = priorityConfig[notice.priority]
            const IconComponent = config.icon
            const CategoryIcon = categoryIcons[notice.category] || BookOpen

            return (
              <Card key={notice.id} className={`card-hover border-l-4 ${config.borderColor} flex flex-col`}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center`}>
                      <CategoryIcon className={`w-4 h-4 ${config.iconColor}`} />
                    </div>
                    <Badge variant="secondary" className={`${config.bgColor} ${config.textColor} text-xs px-2 py-1 rounded-full font-medium`}>
                      {notice.priority.toUpperCase()}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg text-gray-900 line-clamp-2">
                    {notice.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="space-y-2 text-sm">
                    <div><strong>Student:</strong> {notice.student_name}</div>
                    <div><strong>Subject:</strong> {notice.subject}</div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-500" />
                      <span>{notice.location}</span>
                    </div>
                    {/* Contact number removed as per requirement */}

                    {notice.duration && (
                      <div><strong>Duration:</strong> {notice.duration}</div>
                    )}

                    {notice.requirements && (
                      <div className="text-xs text-gray-600 mt-2">
                        <strong>Requirements:</strong> {notice.requirements}
                      </div>
                    )}

                    <div className="text-xs text-gray-500 mt-3">
                      Posted: {getTimeAgo(notice.created_at)}
                    </div>
                  </div>
                </CardContent>
                <div className="p-6 pt-0 mt-auto">
                  <Button
                    className="w-full"
                    onClick={() => setSelectedNotice(notice)}
                  >
                    Show Interest
                  </Button>
                </div>
              </Card>
            )
          })
        )}
      </div>

      {/* Interest Dialog */}
      {selectedNotice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedNotice(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold mb-2">Show Interest</h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedNotice.title}
            </p>

            {submitSuccess ? (
              <div className="text-center py-8 text-green-600">
                <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                <p className="font-medium">Interest submitted successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleInterestSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-md"
                    value={interestForm.name}
                    onChange={(e) => setInterestForm({ ...interestForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full p-2 border rounded-md"
                    value={interestForm.email}
                    onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <input
                    type="tel"
                    required
                    className="w-full p-2 border rounded-md"
                    value={interestForm.phone}
                    onChange={(e) => setInterestForm({ ...interestForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message (Optional)</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    rows={3}
                    value={interestForm.message}
                    onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Interest'}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}