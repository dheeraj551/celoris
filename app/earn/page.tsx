"use client"

import { useState, useEffect } from "react"
import { Metadata } from "next"
import { Briefcase, MapPin, Clock, DollarSign, Users, TrendingUp, Filter, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"



export default function EarnPage() {
  const [jobs, setJobs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

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
    { name: "Technology", count: 156, icon: "💻" },
    { name: "Design", count: 89, icon: "🎨" },
    { name: "Marketing", count: 124, icon: "📈" },
    { name: "Data Science", count: 67, icon: "📊" },
    { name: "Sales", count: 98, icon: "💼" },
    { name: "Customer Success", count: 45, icon: "🤝" },
    { name: "Product", count: 78, icon: "🚀" },
    { name: "Operations", count: 56, icon: "⚙️" }
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20">
        <div className="container text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Find Your Dream Career
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-primary-50">
            Connect with top companies and discover opportunities that match your skills 
            and career aspirations. Your next big breakthrough is just a click away.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-primary-500 hover:bg-gray-100" asChild>
              <Link href="/earn/jobs">
                Browse Jobs
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-500" asChild>
              <Link href="/earn/companies">
                View Companies
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-surface">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">{jobs.length}+</div>
              <div className="text-text-secondary">Active Job Listings</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">500+</div>
              <div className="text-text-secondary">Partner Companies</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">95%</div>
              <div className="text-text-secondary">Success Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-500 mb-2">$85K</div>
              <div className="text-text-secondary">Average Salary</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 bg-background">
        <div className="container">
          <div className="bg-surface rounded-lg p-6 shadow-sm border">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                  <Input
                    placeholder="Search jobs, companies, or skills..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <select className="w-full h-10 px-3 border border-input rounded-md bg-background">
                  <option>All Locations</option>
                  <option>Remote</option>
                  <option>San Francisco, CA</option>
                  <option>New York, NY</option>
                  <option>Austin, TX</option>
                </select>
              </div>
              <div>
                <Button className="w-full">
                  <Filter className="mr-2 h-4 w-4" />
                  More Filters
                </Button>
              </div>
            </div>
          </div>
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
              <Card key={category.name} className="card-hover cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h3 className="font-semibold text-text-primary mb-2">{category.name}</h3>
                  <p className="text-sm text-text-secondary">{category.count} jobs</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

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
            <Button asChild>
              <Link href="/earn/jobs">
                View All Jobs
              </Link>
            </Button>
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
                          <img
                            src={job.companyLogo || "/api/placeholder/48/48"}
                            alt={job.company}
                            className="w-12 h-12 rounded-lg object-cover"
                            onError={(e) => {
                              e.currentTarget.src = "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                            }}
                          />
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
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-text-secondary">
                            <Clock className="h-4 w-4" />
                            <span>{job.employmentType}</span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm text-text-secondary">
                            <Users className="h-4 w-4" />
                            <span>{job.applicants} applicants</span>
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
                            <Button asChild>
                              <Link href={`/earn/job/${job.id}`}>
                                Apply Now
                              </Link>
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

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="/earn/jobs">
                View All Opportunities
                <TrendingUp className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Career Resources */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Career Resources
            </h2>
            <p className="text-lg text-text-secondary">
              Tools and resources to accelerate your career growth
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <Briefcase className="h-6 w-6 text-primary-500" />
                </div>
                <CardTitle>Resume Builder</CardTitle>
                <CardDescription>
                  Create a professional resume that stands out to employers.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/earn/resume-builder">
                    Build Resume
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary-500" />
                </div>
                <CardTitle>Salary Insights</CardTitle>
                <CardDescription>
                  Research salary ranges for your role and location.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/earn/salary-insights">
                    View Salaries
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="card-hover">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary-100 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary-500" />
                </div>
                <CardTitle>Interview Prep</CardTitle>
                <CardDescription>
                  Practice interviews and get feedback from industry experts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full" asChild>
                  <Link href="/earn/interview-prep">
                    Start Practicing
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}