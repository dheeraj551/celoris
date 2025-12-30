"use client"

import { useState, useEffect } from "react"
import { Metadata } from "next"
import { Briefcase, MapPin, Clock, DollarSign, Users, TrendingUp, Filter, Search, CheckCircle, AlertCircle, X, Laptop, Palette, LineChart, BarChart, Heart, Rocket, Settings } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import InterviewRooms from "@/components/InterviewRooms"
import { AdUnit } from "@/components/AdUnit"


export default function EarnPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJob, setSelectedJob] = useState<any | null>(null)
  const [interestForm, setInterestForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  const handleApplySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedJob) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/jobs/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          job_id: selectedJob.id,
          ...interestForm
        })
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to submit application')
      }

      setSubmitSuccess(true)
      setTimeout(() => {
        setSubmitSuccess(false)
        setSelectedJob(null)
        setInterestForm({ name: '', email: '', phone: '', message: '' })
      }, 2000)
    } catch (err: any) {
      console.error(err)
      alert(err.message || 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      const response = await fetch('/api/jobs?limit=6')
      const result = await response.json()

      if (result.success) {
        setJobs(result.data)
      }
    } catch (error) {
      console.error('Error loading jobs:', error)
    } finally {
      setLoading(false)
    }
  }

  const jobCategories = [
    { name: "Technology", count: 159, icon: <Laptop className="w-8 h-8 text-blue-500" /> },
    { name: "Design", count: 83, icon: <Palette className="w-8 h-8 text-rose-500" /> },
    { name: "Marketing", count: 124, icon: <LineChart className="w-8 h-8 text-indigo-500" /> },
    { name: "Data Science", count: 67, icon: <BarChart className="w-8 h-8 text-teal-500" /> },
    { name: "Sales", count: 98, icon: <Briefcase className="w-8 h-8 text-amber-600" /> },
    { name: "Customer Success", count: 45, icon: <Heart className="w-8 h-8 text-red-500" /> },
    { name: "Product", count: 78, icon: <Rocket className="w-8 h-8 text-purple-500" /> },
    { name: "Operations", count: 30, icon: <Settings className="w-8 h-8 text-slate-500" /> }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-[#2C7A4F] text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="container relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Find Your Dream Career
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-primary-50">
            Connect with top companies and discover opportunities that match your skills
            and career aspirations. Your next big breakthrough is just a click away.
          </p>

        </div>
      </section>



      {/* Job Categories */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Explore by Category
            </h2>
            <p className="text-lg text-text-secondary">
              Find jobs that match your expertise
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {jobCategories.map((category) => (
              <Card key={category.name} className="border border-slate-100 hover:border-emerald-200 transition-all hover:shadow-xl hover:shadow-emerald-50/50 cursor-pointer group bg-white rounded-2xl">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-50 transition-colors">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1 group-hover:text-[#2C7A4F] transition-colors">{category.name}</h3>
                  <p className="text-xs font-medium text-slate-400">{category.count} jobs</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* <InterviewRooms /> */}

      <AdUnit slot="9266909448" />

      {/* Recent Job Listings */}
      <section className="py-16 bg-surface">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                Recent Opportunities
              </h2>
              <p className="text-lg text-text-secondary">
                Latest job postings from our partner companies
              </p>
            </div>
            {/* Button Removed */}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
              <p className="mt-4 text-text-secondary">Loading job listings...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <Card key={job.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
                            <Briefcase className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-text-primary">{job.title}</h3>
                            <p className="text-text-secondary">{job.company}</p>
                          </div>
                          {job.isRemote && (
                            <span className="bg-primary-100 text-primary-700 px-2 py-1 rounded-full text-xs font-medium">
                              Remote
                            </span>
                          )}
                          {job.isFeatured && (
                            <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                              Featured
                            </span>
                          )}
                        </div>

                        <p className="text-text-secondary mb-4 line-clamp-2">
                          {job.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 mb-4">
                          <div className="flex items-center space-x-1 text-sm text-text-secondary">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-text-secondary">
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-text-secondary">
                            <Clock className="h-4 w-4" />
                            <span>{job.employmentType}</span>
                          </div>

                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {job.skills?.slice(0, 3).map((skill: string) => (
                              <span
                                key={skill}
                                className="bg-gray-100 text-text-secondary px-2 py-1 rounded-full text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills?.length > 3 && (
                              <span className="text-xs text-text-secondary">
                                +{job.skills.length - 3} more
                              </span>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-text-secondary">{job.posted}</span>
                            <Button onClick={() => setSelectedJob(job)}>
                              Apply Now
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* Career Resources Removed to match screenshot */}

      {/* Application Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold mb-2">Apply for {selectedJob.title}</h2>
            <p className="text-sm text-gray-500 mb-4">
              {selectedJob.company}
            </p>

            {submitSuccess ? (
              <div className="text-center py-8 text-green-600">
                <CheckCircle className="h-12 w-12 mx-auto mb-2" />
                <p className="font-medium">Application submitted successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-md p-3 flex items-start gap-2 text-sm text-blue-700">
                  <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <p>
                    Note: <span className="font-bold">₹25</span> will be deducted from your wallet when you apply.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-black">Name</label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-md text-black"
                    value={interestForm.name}
                    onChange={(e) => setInterestForm({ ...interestForm, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">Email</label>
                  <input
                    type="email"
                    required
                    className="w-full p-2 border rounded-md text-black"
                    value={interestForm.email}
                    onChange={(e) => setInterestForm({ ...interestForm, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">Phone</label>
                  <input
                    type="tel"
                    required
                    className="w-full p-2 border rounded-md text-black"
                    value={interestForm.phone}
                    onChange={(e) => setInterestForm({ ...interestForm, phone: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-black">Message (Optional)</label>
                  <textarea
                    className="w-full p-2 border rounded-md text-black"
                    rows={3}
                    value={interestForm.message}
                    onChange={(e) => setInterestForm({ ...interestForm, message: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}