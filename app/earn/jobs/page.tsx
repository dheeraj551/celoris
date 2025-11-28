"use client"

import { useState, useEffect } from "react"
import { Metadata } from "next"
import { MapPin, Clock, DollarSign, Users, Building, ArrowLeft, Filter, Search, Heart } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"



const jobListings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    company: "TechCorp Solutions",
    location: "San Francisco, CA",
    isRemote: true,
    salary: "$120,000 - $150,000",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    posted: "2 days ago",
    applicants: 45,
    description: "We are looking for an experienced Frontend Developer to join our growing team. You'll be responsible for building user-facing features and collaborating with designers and backend developers.",
    requirements: ["5+ years React experience", "TypeScript proficiency", "Experience with modern CSS frameworks"],
    skills: ["React", "TypeScript", "Next.js", "CSS", "JavaScript"],
    companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    companySize: "500-1000 employees",
    industry: "Technology"
  },
  {
    id: 2,
    title: "UX/UI Designer",
    company: "DesignStudio Inc",
    location: "New York, NY",
    isRemote: false,
    salary: "$80,000 - $100,000",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    posted: "1 day ago",
    applicants: 32,
    description: "Join our creative team to design intuitive and beautiful user experiences for web and mobile applications.",
    requirements: ["3+ years UI/UX design", "Figma expertise", "Portfolio required"],
    skills: ["Figma", "UI Design", "UX Research", "Prototyping", "User Testing"],
    companyLogo: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    companySize: "100-500 employees",
    industry: "Design"
  },
  {
    id: 3,
    title: "Data Scientist",
    company: "DataFlow Analytics",
    location: "Austin, TX",
    isRemote: true,
    salary: "$110,000 - $140,000",
    employmentType: "Full-time",
    experienceLevel: "Senior",
    posted: "3 days ago",
    applicants: 28,
    description: "Analyze complex datasets to extract insights and build predictive models that drive business decisions.",
    requirements: ["Python/R expertise", "Machine learning experience", "Statistics background"],
    skills: ["Python", "Machine Learning", "SQL", "Statistics", "TensorFlow"],
    companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    companySize: "200-500 employees",
    industry: "Analytics"
  },
  {
    id: 4,
    title: "Freelance Content Writer",
    company: "ContentPro Agency",
    location: "Remote",
    isRemote: true,
    salary: "$25 - $50/hour",
    employmentType: "Freelance",
    experienceLevel: "Entry-level",
    posted: "5 hours ago",
    applicants: 67,
    description: "Create engaging blog posts, articles, and marketing copy for various clients across different industries.",
    requirements: ["Excellent writing skills", "SEO knowledge", "Portfolio of writing samples"],
    skills: ["Content Writing", "SEO", "Copywriting", "Research", "WordPress"],
    companyLogo: "https://images.unsplash.com/photo-1456327102063-fb5054efe647?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    companySize: "50-100 employees",
    industry: "Content & Marketing"
  },
  {
    id: 5,
    title: "DevOps Engineer",
    company: "CloudTech Systems",
    location: "Seattle, WA",
    isRemote: true,
    salary: "$100,000 - $130,000",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    posted: "1 week ago",
    applicants: 19,
    description: "Build and maintain CI/CD pipelines, manage cloud infrastructure, and ensure reliable system deployments.",
    requirements: ["AWS/Azure experience", "Docker/Kubernetes", "CI/CD tools"],
    skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Linux"],
    companyLogo: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    companySize: "1000+ employees",
    industry: "Cloud & Infrastructure"
  },
  {
    id: 6,
    title: "Marketing Manager",
    company: "Growth Dynamics",
    location: "Los Angeles, CA",
    isRemote: false,
    salary: "$70,000 - $90,000",
    employmentType: "Full-time",
    experienceLevel: "Mid-level",
    posted: "4 days ago",
    applicants: 41,
    description: "Lead our marketing initiatives and drive customer acquisition across multiple channels.",
    requirements: ["5+ years marketing experience", "Digital marketing expertise", "Team leadership"],
    skills: ["Digital Marketing", "Google Ads", "Analytics", "Content Strategy", "Team Management"],
    companyLogo: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    companySize: "200-500 employees",
    industry: "Marketing"
  }
]

const jobCategories = [
  { name: "All Jobs", count: jobListings.length, icon: "💼" },
  { name: "Technology", count: 156, icon: "💻" },
  { name: "Design", count: 89, icon: "🎨" },
  { name: "Marketing", count: 124, icon: "📈" },
  { name: "Data Science", count: 67, icon: "📊" },
  { name: "Sales", count: 98, icon: "💼" },
  { name: "Customer Success", count: 45, icon: "🤝" },
  { name: "Product", count: 78, icon: "🚀" },
  { name: "Operations", count: 56, icon: "⚙️" }
]

const experienceLevels = [
  { name: "All Levels", count: jobListings.length },
  { name: "Entry-level", count: jobListings.filter(j => j.experienceLevel === "Entry-level").length },
  { name: "Mid-level", count: jobListings.filter(j => j.experienceLevel === "Mid-level").length },
  { name: "Senior", count: jobListings.filter(j => j.experienceLevel === "Senior").length }
]

const employmentTypes = [
  { name: "All Types", count: jobListings.length },
  { name: "Full-time", count: jobListings.filter(j => j.employmentType === "Full-time").length },
  { name: "Part-time", count: jobListings.filter(j => j.employmentType === "Part-time").length },
  { name: "Freelance", count: jobListings.filter(j => j.employmentType === "Freelance").length },
  { name: "Contract", count: jobListings.filter(j => j.employmentType === "Contract").length }
]

export default function AllJobsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState({
    type: "all",
    level: "all",
    location: "all"
  })
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    loadJobs()
  }, [filters, currentPage])

  const loadJobs = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        limit: "12",
        page: currentPage.toString(),
        ...(filters.type !== "all" && { type: filters.type }),
        ...(filters.level !== "all" && { level: filters.level }),
        ...(searchTerm && { search: searchTerm })
      })

      const response = await fetch(`/api/jobs?${params}`)
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

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    loadJobs()
  }

  const jobCategories = [
    { name: "All Jobs", count: jobs.length, icon: "💼" },
    { name: "Technology", count: 0, icon: "💻" },
    { name: "Design", count: 0, icon: "🎨" },
    { name: "Marketing", count: 0, icon: "📈" },
    { name: "Data Science", count: 0, icon: "📊" },
    { name: "Sales", count: 0, icon: "💼" },
    { name: "Customer Success", count: 0, icon: "🤝" },
    { name: "Product", count: 0, icon: "🚀" },
    { name: "Operations", count: 0, icon: "⚙️" }
  ]

  const experienceLevels = [
    { name: "All Levels", count: jobs.length },
    { name: "entry-level", count: jobs.filter((j: any) => j.experienceLevel === "entry-level").length },
    { name: "mid-level", count: jobs.filter((j: any) => j.experienceLevel === "mid-level").length },
    { name: "senior", count: jobs.filter((j: any) => j.experienceLevel === "senior").length }
  ]

  const employmentTypes = [
    { name: "All Types", count: jobs.length },
    { name: "full-time", count: jobs.filter((j: any) => j.employmentType === "full-time").length },
    { name: "part-time", count: jobs.filter((j: any) => j.employmentType === "part-time").length },
    { name: "freelance", count: jobs.filter((j: any) => j.employmentType === "freelance").length },
    { name: "contract", count: jobs.filter((j: any) => j.employmentType === "contract").length }
  ]

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-text-secondary mb-4">
            <Link href="/" className="hover:text-primary-500">Home</Link>
            <span>/</span>
            <Link href="/earn" className="hover:text-primary-500">Earn</Link>
            <span>/</span>
            <span className="text-text-primary">All Jobs</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            All Job Opportunities
          </h1>
          <p className="text-lg text-text-secondary">
            Find your next career opportunity from our extensive collection of job listings
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-surface rounded-lg p-6 shadow-sm border mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
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
                <select 
                  className="w-full h-10 px-3 border border-input rounded-md bg-background"
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                >
                  <option value="all">All Locations</option>
                  <option value="remote">Remote</option>
                  <option value="new-york">New York</option>
                  <option value="san-francisco">San Francisco</option>
                  <option value="austin">Austin</option>
                </select>
              </div>
              <div>
                <Button type="submit" className="w-full">
                  <Search className="mr-2 h-4 w-4" />
                  Search
                </Button>
              </div>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Job Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Job Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {jobCategories.map((category) => (
                    <div
                      key={category.name}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface cursor-pointer transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <span>{category.icon}</span>
                        <span className="text-sm">{category.name}</span>
                      </div>
                      <span className="text-xs text-text-secondary">{category.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Experience Level */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Experience Level</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {experienceLevels.map((level) => (
                    <div
                      key={level.name}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface cursor-pointer transition-colors"
                    >
                      <span className="text-sm">{level.name}</span>
                      <span className="text-xs text-text-secondary">{level.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Employment Type */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Employment Type</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {employmentTypes.map((type) => (
                    <div
                      key={type.name}
                      className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface cursor-pointer transition-colors"
                    >
                      <span className="text-sm">{type.name}</span>
                      <span className="text-xs text-text-secondary">{type.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Salary Range */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Salary Range</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" />
                      <span className="text-sm">Under $50K</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" />
                      <span className="text-sm">$50K - $80K</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" />
                      <span className="text-sm">$80K - $120K</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" />
                      <span className="text-sm">Over $120K</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-text-primary">
                {loading ? 'Loading...' : `Found ${jobs.length} jobs`}
              </h2>
              <div className="flex items-center space-x-2 text-sm text-text-secondary">
                <Filter className="h-4 w-4" />
                <span>Page {currentPage}</span>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
                <p className="mt-4 text-text-secondary">Loading job listings...</p>
              </div>
            ) : jobs.length === 0 ? (
              <Card className="p-12 text-center">
                <Building className="h-16 w-16 text-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-text-primary mb-2">No jobs found</h3>
                <p className="text-text-secondary mb-4">
                  Try adjusting your search criteria or check back later for new opportunities.
                </p>
                <Button onClick={() => {
                  setSearchTerm("")
                  setFilters({ type: "all", level: "all", location: "all" })
                  loadJobs()
                }}>
                  Clear Filters
                </Button>
              </Card>
            ) : (
              <div className="space-y-6">
                {jobs.map((job: any) => (
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
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="text-xl font-semibold text-text-primary">{job.title}</h3>
                                <Button variant="ghost" size="sm" className="p-1 h-auto">
                                  <Heart className="h-4 w-4" />
                                </Button>
                              </div>
                              <p className="text-text-secondary mb-2">{job.company}</p>
                              <div className="flex items-center space-x-4 text-sm text-text-secondary">
                                <div className="flex items-center space-x-1">
                                  <Building className="h-4 w-4" />
                                  <span>{job.category || 'Technology'}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{job.experienceLevel}</span>
                                </div>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              {job.isRemote && (
                                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                                  Remote
                                </span>
                              )}
                              {job.isFeatured && (
                                <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                                  Featured
                                </span>
                              )}
                            </div>
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

                          <div className="flex flex-wrap gap-2 mb-4">
                            {job.skills?.slice(0, 4).map((skill: string) => (
                              <span
                                key={skill}
                                className="bg-surface text-text-secondary px-3 py-1 rounded-full text-xs"
                              >
                                {skill}
                              </span>
                            ))}
                            {job.skills?.length > 4 && (
                              <span className="text-xs text-text-secondary px-3 py-1">
                                +{job.skills.length - 4} more
                              </span>
                            )}
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-text-secondary">Posted {job.posted}</span>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="sm">
                                Save Job
                              </Button>
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

            {/* Pagination */}
            {jobs.length > 0 && (
              <div className="flex justify-center items-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="px-4 py-2 text-sm text-text-secondary">
                  Page {currentPage}
                </span>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={jobs.length < 12}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}