"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Building,
  Users,
  Star,
  Play,
  ChevronRight
} from "lucide-react"

interface Job {
  id: string
  title: string
  company_name: string
  location: string
  is_remote: boolean
  employment_type: string
  experience_level: string
  salary_min: number | null
  salary_max: number | null
  salary_currency: string
  description: string
  skills: string[]
  category: string
  industry: string
  is_featured: boolean
  application_deadline: string | null
  created_at: string
}

interface JobsDisplayProps {
  featured?: boolean
  limit?: number
  layout?: 'grid' | 'list'
  className?: string
}

export default function JobsDisplay({ 
  featured = false, 
  limit = 6,
  layout = 'grid',
  className = ""
}: JobsDisplayProps) {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadJobs()
  }, [featured, limit])

  const loadJobs = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('limit', limit.toString())
      if (featured) params.append('featured', 'true')

      const response = await fetch('/api/jobs')
      if (!response.ok) throw new Error('Failed to fetch jobs')

      const data = await response.json()
      setJobs(data.data || [])
    } catch (error) {
      console.error('Error loading jobs:', error)
      setError('Failed to load jobs')
    } finally {
      setLoading(false)
    }
  }

  const formatSalary = (min: number | null, max: number | null, currency: string = 'USD') => {
    if (!min && !max) return 'Salary not specified'
    if (min && max) return `${currency === 'USD' ? '$' : '₹'}${min.toLocaleString()} - ${currency === 'USD' ? '$' : '₹'}${max.toLocaleString()}`
    if (min) return `From ${currency === 'USD' ? '$' : '₹'}${min.toLocaleString()}`
    if (max) return `Up to ${currency === 'USD' ? '$' : '₹'}${max.toLocaleString()}`
    return 'Salary not specified'
  }

  const getEmploymentTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'full-time': 'bg-green-100 text-green-800',
      'part-time': 'bg-blue-100 text-blue-800',
      'contract': 'bg-purple-100 text-purple-800',
      'freelance': 'bg-orange-100 text-orange-800',
      'internship': 'bg-yellow-100 text-yellow-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const getExperienceLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'entry-level': 'bg-green-100 text-green-800',
      'mid-level': 'bg-blue-100 text-blue-800',
      'senior': 'bg-purple-100 text-purple-800',
      'executive': 'bg-orange-100 text-orange-800'
    }
    return colors[level] || 'bg-gray-100 text-gray-800'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    })
  }

  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <Card key={job.id} className={`hover:shadow-lg transition-shadow ${className}`}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <Briefcase className="w-5 h-5 text-green-600" />
                  {job.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 flex items-center gap-2">
                  <Building className="w-4 h-4" />
                  {job.company_name}
                </CardDescription>
              </div>
              {job.is_featured && (
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  <Star className="w-3 h-3" />
                  Featured
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <MapPin className="w-4 h-4" />
              {job.location}
              {job.is_remote && <span className="text-green-600">(Remote)</span>}
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEmploymentTypeColor(job.employment_type)}`}>
                {job.employment_type.replace('-', ' ')}
              </span>
              <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getExperienceLevelColor(job.experience_level)}`}>
                {job.experience_level.replace('-', ' ')}
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
            </div>

            {job.skills && job.skills.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-4">
                {job.skills.slice(0, 3).map((skill, index) => (
                  <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                    {skill}
                  </span>
                ))}
                {job.skills.length > 3 && (
                  <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                    +{job.skills.length - 3} more
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500 flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {formatDate(job.created_at)}
              </div>
              <Link href={`/earn/job/${job.id}`}>
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  <Play className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderList = () => (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} className={`hover:shadow-md transition-shadow ${className}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-green-600" />
                    {job.title}
                    {job.is_featured && (
                      <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                  </CardTitle>
                </div>
                <div className="text-gray-600 mb-3 flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Building className="w-4 h-4" />
                    {job.company_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {job.location}
                    {job.is_remote && <span className="text-green-600">(Remote)</span>}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getEmploymentTypeColor(job.employment_type)}`}>
                    {job.employment_type.replace('-', ' ')}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getExperienceLevelColor(job.experience_level)}`}>
                    {job.experience_level.replace('-', ' ')}
                  </span>
                  <span className="text-sm text-gray-600">
                    {formatSalary(job.salary_min, job.salary_max, job.salary_currency)}
                  </span>
                </div>

                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {job.skills.slice(0, 5).map((skill, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                        {skill}
                      </span>
                    ))}
                    {job.skills.length > 5 && (
                      <span className="inline-flex items-center px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                        +{job.skills.length - 5} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Posted {formatDate(job.created_at)}
                  </span>
                  {job.category && (
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {job.category}
                    </span>
                  )}
                </div>
              </div>
              <div className="ml-6 text-right">
                <Link href={`/earn/job/${job.id}`}>
                  <Button className="bg-green-600 hover:bg-green-700" size="sm">
                    Apply Now
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
        <p className="text-gray-600">Check back later for new opportunities.</p>
      </div>
    )
  }

  return layout === 'grid' ? renderGrid() : renderList()
}