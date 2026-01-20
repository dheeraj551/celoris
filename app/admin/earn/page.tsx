"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import {
  DollarSign,
  Plus,
  Edit,
  Trash2,
  Users,
  Clock,
  Search,
  Filter,
  MapPin,
  Briefcase,
  Shield,
  LogOut,
  ArrowLeft,
  Eye,
  TrendingUp,
  UserCheck,
  Calendar,
  GraduationCap,
  Award,
  FileText,
  Mail,
  Phone,
  User,
  Sparkles
} from "lucide-react"
import { createClient } from "@/lib/supabase-client"


export default function AdminEarnPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [jobs, setJobs] = useState<any[]>([])
  const [applications, setApplications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [newJob, setNewJob] = useState({
    title: "",
    company_name: "",
    location: "",
    is_remote: false,
    employment_type: "full-time",
    experience_level: "mid-level",
    salary_min: "",
    salary_max: "",
    description: "",
    requirements: "",
    responsibilities: "",
    benefits: "",
    skills: "",
    category: "",
    industry: "",
    company_description: "",
    company_website: "",
    company_icon: "Building",
    company_size: "",
    salary_currency: "USD",
    salary_period: "year",
    is_featured: false,
    is_active: true,
    is_published: true
  })
  const [selectedApplication, setSelectedApplication] = useState<any>(null)
  const [showApplicationModal, setShowApplicationModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const adminSession = localStorage.getItem("admin_session")

      if (!adminSession) {
        router.push("/admin/login")
        return
      }

      const session = JSON.parse(adminSession)
      const sessionAge = Date.now() - session.timestamp
      const maxAge = 24 * 60 * 60 * 1000 // 24 hours

      if (sessionAge > maxAge) {
        localStorage.removeItem("admin_session")
        router.push("/admin/login")
        return
      }

      setIsAuthenticated(true)
      loadData()
    } catch (error) {
      console.error("Admin auth error:", error)
      router.push("/admin/login")
    }
  }

  useEffect(() => {
    if (!isAuthenticated) return

    const supabase = createClient()
    const channel = supabase
      .channel('admin-jobs-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'jobs'
        },
        () => {
          loadData()
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'job_applications'
        },
        () => {
          loadData()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isAuthenticated])

  const loadData = async () => {
    try {
      // Load jobs from API
      const jobsResponse = await fetch('/api/admin/jobs?limit=50')
      const jobsResult = await jobsResponse.json()

      if (jobsResult.success) {
        setJobs(jobsResult.data)
      }

      // Load applications
      const applicationsResponse = await fetch('/api/job-application?limit=20')
      const applicationsResult = await applicationsResponse.json()

      if (applicationsResult.success) {
        setApplications(applicationsResult.data)
      }

      console.log('Loaded jobs:', jobsResult.data?.length || 0, 'Loaded applications:', applicationsResult.data?.length || 0)
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }


  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return

    try {
      const response = await fetch(`/api/admin/jobs?id=${jobId}`, {
        method: "DELETE"
      })

      const result = await response.json()

      if (result.success) {
        setJobs(jobs.filter(job => job.id !== jobId))
        alert("Job deleted successfully!")
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Error deleting job:", error)
      alert("Failed to delete job")
    }
  }

  const handleCreateJob = async () => {
    try {
      // Validate required fields
      if (!newJob.title || !newJob.company_name || !newJob.location || !newJob.description) {
        alert("Please fill in all required fields")
        return
      }

      // Prepare job data
      const jobData = {
        ...newJob,
        salary_min: newJob.salary_min ? parseInt(newJob.salary_min) : null,
        salary_max: newJob.salary_max ? parseInt(newJob.salary_max) : null,
        requirements: newJob.requirements.split('\n').filter(req => req.trim()),
        responsibilities: newJob.responsibilities.split('\n').filter(res => res.trim()),
        benefits: newJob.benefits.split('\n').filter(ben => ben.trim()),
        skills: newJob.skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      }

      const response = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobData),
      })

      const result = await response.json()

      if (result.success) {
        setJobs([result.data, ...jobs])
        setShowCreateModal(false)
        setNewJob({
          title: "",
          company_name: "",
          location: "",
          is_remote: false,
          employment_type: "full-time",
          experience_level: "mid-level",
          salary_min: "",
          salary_max: "",
          description: "",
          requirements: "",
          responsibilities: "",
          benefits: "",
          skills: "",
          category: "",
          industry: "",
          company_description: "",
          company_website: "",
          company_icon: "Building",
          company_size: "",
          salary_currency: "USD",
          salary_period: "year",
          is_featured: false,
          is_active: true,
          is_published: true
        })
        alert("Job created successfully!")
      } else {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      console.error("Error creating job:", error)
      alert("Failed to create job")
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("admin_session")
    router.push("/admin/login")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20';
      case 'paused': return 'text-yellow-400 bg-yellow-400/20';
      case 'closed': return 'text-red-400 bg-red-400/20';
      case 'reviewing': return 'text-blue-400 bg-blue-400/20';
      case 'shortlisted': return 'text-purple-400 bg-purple-400/20';
      case 'rejected': return 'text-red-400 bg-red-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'Full-time': return 'text-green-400 bg-green-400/20';
      case 'Part-time': return 'text-blue-400 bg-blue-400/20';
      case 'Contract': return 'text-orange-400 bg-orange-400/20';
      case 'Freelance': return 'text-purple-400 bg-purple-400/20';
      default: return 'text-slate-400 bg-slate-400/20';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading Earn Management...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push("/admin/dashboard")}
                className="text-slate-400 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Earn Management</h1>
                <p className="text-sm text-slate-400">Control job postings and freelance opportunities</p>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Active Jobs</p>
                  <p className="text-2xl font-bold text-white">{jobs.filter(j => j.status === 'active').length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Applications</p>
                  <p className="text-2xl font-bold text-white">
                    {jobs.reduce((sum, job) => sum + job.applicants, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <UserCheck className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">New Applications</p>
                  <p className="text-2xl font-bold text-white">{applications.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Success Rate</p>
                  <p className="text-2xl font-bold text-white">78%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <UserCheck className="h-6 w-6" />
              <span>Recent Applications</span>
            </h2>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Eye className="h-4 w-4 mr-2" />
              View All Applications
            </Button>
          </div>

          {/* Applications List */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="space-y-4">
                {applications?.map((application) => (
                  <div key={application.id} className="border border-slate-700 rounded-lg p-4 hover:bg-slate-750 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-white">{application.full_name}</h4>
                        <p className="text-sm text-slate-400">Applied for: {application.job_title}</p>
                        <p className="text-xs text-slate-500">{application.email} • {application.mobile_number}</p>
                      </div>
                      <div className="flex space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status || 'pending')}`}>
                          {application.status || 'pending'}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4 text-xs text-slate-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>Applied: {new Date(application.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Briefcase className="h-3 w-3" />
                          <span>Exp: {application.total_experience}</span>
                        </div>
                      </div>

                      <div className="space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                          onClick={() => {
                            setSelectedApplication(application)
                            setShowApplicationModal(true)
                          }}
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Job Postings Management */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Briefcase className="h-6 w-6" />
              <span>Job Postings</span>
            </h2>
            <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
              <DialogTrigger asChild>
                <Button className="bg-green-600 hover:bg-green-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Post New Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-slate-800 text-white border-slate-700">
                <DialogHeader>
                  <DialogTitle>Create New Job Posting</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Fill in the details for the new job posting
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300">Job Title *</label>
                      <Input
                        value={newJob.title}
                        onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g. Senior Frontend Developer"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300">Company Name *</label>
                      <Input
                        value={newJob.company_name}
                        onChange={(e) => setNewJob({ ...newJob, company_name: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g. TechCorp Inc."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300">Location *</label>
                      <Input
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g. San Francisco, CA"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_remote"
                        checked={newJob.is_remote}
                        onChange={(e) => setNewJob({ ...newJob, is_remote: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="is_remote" className="text-sm font-medium text-slate-300">
                        Remote Work Available
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300">Employment Type</label>
                      <select
                        value={newJob.employment_type}
                        onChange={(e) => setNewJob({ ...newJob, employment_type: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                      >
                        <option value="full-time">Full-time</option>
                        <option value="part-time">Part-time</option>
                        <option value="contract">Contract</option>
                        <option value="freelance">Freelance</option>
                        <option value="internship">Internship</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300">Experience Level</label>
                      <select
                        value={newJob.experience_level}
                        onChange={(e) => setNewJob({ ...newJob, experience_level: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                      >
                        <option value="entry-level">Entry Level</option>
                        <option value="mid-level">Mid Level</option>
                        <option value="senior">Senior</option>
                        <option value="executive">Executive</option>
                      </select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="is_featured"
                        checked={newJob.is_featured}
                        onChange={(e) => setNewJob({ ...newJob, is_featured: e.target.checked })}
                        className="rounded"
                      />
                      <label htmlFor="is_featured" className="text-sm font-medium text-slate-300">
                        Featured
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300">Min Salary</label>
                      <Input
                        type="number"
                        value={newJob.salary_min}
                        onChange={(e) => setNewJob({ ...newJob, salary_min: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g. 80000"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300">Max Salary</label>
                      <Input
                        type="number"
                        value={newJob.salary_max}
                        onChange={(e) => setNewJob({ ...newJob, salary_max: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g. 120000"
                      />
                    </div>
                  </div>



                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-300">Category</label>
                      <Input
                        value={newJob.category}
                        onChange={(e) => setNewJob({ ...newJob, category: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g. Technology"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300">Industry</label>
                      <Input
                        value={newJob.industry}
                        onChange={(e) => setNewJob({ ...newJob, industry: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="e.g. Software Development"
                      />
                    </div>
                  </div>

                  {/* Company Details */}
                  <div className="space-y-4 border-t border-slate-700 pt-4 mt-4">
                    <h3 className="text-lg font-medium text-white">Company Details</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-slate-300">Company Website</label>
                        <Input
                          value={newJob.company_website}
                          onChange={(e) => setNewJob({ ...newJob, company_website: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="https://example.com"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-300">Company Size</label>
                        <Input
                          value={newJob.company_size}
                          onChange={(e) => setNewJob({ ...newJob, company_size: e.target.value })}
                          className="bg-slate-700 border-slate-600 text-white"
                          placeholder="e.g. 50-100 employees"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300">Company Description</label>
                      <Textarea
                        value={newJob.company_description}
                        onChange={(e) => setNewJob({ ...newJob, company_description: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        rows={3}
                        placeholder="Brief description about the company..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300">Company Icon</label>
                      <select
                        value={newJob.company_icon}
                        onChange={(e) => setNewJob({ ...newJob, company_icon: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white"
                      >
                        <option value="Building">Building (Default)</option>
                        <option value="Code">Code</option>
                        <option value="Globe">Globe</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Briefcase">Briefcase</option>
                        <option value="Users">Users</option>
                        <option value="Shield">Shield</option>
                        <option value="Cloud">Cloud</option>
                        <option value="Database">Database</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 border-t border-slate-700 pt-4 mt-4">
                    <h3 className="text-lg font-medium text-white">Job Details</h3>

                    <div>
                      <label className="text-sm font-medium text-slate-300">Job Description *</label>
                      <Textarea
                        value={newJob.description}
                        onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        rows={4}
                        placeholder="Detailed job description..."
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300">Requirements (one per line)</label>
                      <Textarea
                        value={newJob.requirements}
                        onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        rows={3}
                        placeholder="- Requirement 1&#10;- Requirement 2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300">Responsibilities (one per line)</label>
                      <Textarea
                        value={newJob.responsibilities}
                        onChange={(e) => setNewJob({ ...newJob, responsibilities: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        rows={3}
                        placeholder="- Responsibility 1&#10;- Responsibility 2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300">Benefits (one per line)</label>
                      <Textarea
                        value={newJob.benefits}
                        onChange={(e) => setNewJob({ ...newJob, benefits: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        rows={3}
                        placeholder="- Benefit 1&#10;- Benefit 2"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-slate-300">Skills (comma separated)</label>
                      <Input
                        value={newJob.skills}
                        onChange={(e) => setNewJob({ ...newJob, skills: e.target.value })}
                        className="bg-slate-700 border-slate-600 text-white"
                        placeholder="React, TypeScript, Next.js, CSS, JavaScript"
                      />
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setShowCreateModal(false)} className="border-slate-600 text-slate-300">
                    Cancel
                  </Button>
                  <Button onClick={handleCreateJob} className="bg-green-600 hover:bg-green-700">
                    Create Job
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Search and Filter */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search jobs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Freelance">Freelance</option>
                </select>
                <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Jobs List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs?.map((job) => {
            const salaryDisplay = job.salary_min && job.salary_max
              ? `${job.salary_currency === 'USD' ? '$' : job.salary_currency}${job.salary_min.toLocaleString()} - ${job.salary_currency === 'USD' ? '$' : job.salary_currency}${job.salary_max.toLocaleString()}/${job.salary_period === 'year' ? 'year' : job.salary_period}`
              : 'Competitive salary'

            return (
              <Card key={job.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-white flex items-center space-x-2">
                        <span>{job.title}</span>
                        {job.is_featured && (
                          <span className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                        {job.is_remote && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            Remote
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription className="text-slate-400 mt-1">
                        {job.company_name} • {job.location}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                        onClick={() => handleDeleteJob(job.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getJobTypeColor(job.employment_type)}`}>
                        {job.employment_type}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                        {job.status}
                      </span>
                    </div>

                    <div className="flex items-center space-x-4 text-sm text-slate-300">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-400" />
                        <span>{salaryDisplay}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4 text-blue-400" />
                        <span>{job.application_count || 0} applicants</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-orange-400" />
                        <span>{job.experience_level}</span>
                      </div>
                    </div>

                    <p className="text-sm text-slate-400 line-clamp-2">{job.description}</p>

                    <div>
                      <p className="text-xs text-slate-400 mb-1">Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {job.skills?.slice(0, 5).map((skill: any, index: number) => (
                          <span key={index} className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded">
                            {skill}
                          </span>
                        ))}
                        {job.skills?.length > 5 && (
                          <span className="px-2 py-1 bg-slate-700 text-xs text-slate-300 rounded">
                            +{job.skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>

                    {job.category && (
                      <div>
                        <p className="text-xs text-slate-400 mb-1">Category:</p>
                        <span className="px-2 py-1 bg-primary-500/20 text-primary-300 rounded text-xs">
                          {job.category}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-400">
                    <span>Created: {new Date(job.created_at).toLocaleDateString()}</span>
                    {job.application_deadline && (
                      <span className={new Date(job.application_deadline) < new Date() ? 'text-red-400' : ''}>
                        Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>



        {/* Application Details Modal */}
        <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 text-white border-slate-700">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <FileText className="text-blue-400" />
                Candidate Application: {selectedApplication?.application_ref_id}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Full profile and history for {selectedApplication?.full_name}
              </DialogDescription>
            </DialogHeader>

            {selectedApplication && (
              <div className="space-y-8 py-4">
                {/* 1. Header Info */}
                <div className="flex flex-col md:flex-row gap-6 p-6 bg-slate-800 rounded-2xl border border-slate-700">
                  <div className="w-20 h-20 bg-blue-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                    <User className="w-10 h-10 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold">{selectedApplication.full_name}</h3>
                        <p className="text-blue-400 font-medium">Applied for: {selectedApplication.job_title}</p>
                      </div>
                      <Badge className={getStatusColor(selectedApplication.status || 'pending')}>
                        {(selectedApplication.status || 'pending').toUpperCase()}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Mail className="w-4 h-4" />
                        {selectedApplication.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Phone className="w-4 h-4" />
                        {selectedApplication.mobile_number}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <MapPin className="w-4 h-4" />
                        {selectedApplication.current_city}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Calendar className="w-4 h-4" />
                        Born: {new Date(selectedApplication.date_of_birth).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-400">
                        <Clock className="w-4 h-4" />
                        Applied: {new Date(selectedApplication.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Professional Summary */}
                <section>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-400" /> Professional Summary
                  </h4>
                  <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700/50 italic text-slate-300">
                    "{selectedApplication.professional_summary}"
                  </div>
                </section>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 3. Education */}
                  <section>
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-green-400" /> Academic Background
                    </h4>
                    <div className="space-y-3">
                      {Object.entries(selectedApplication.education_details || {}).map(([level, edu]: any) => (
                        <div key={level} className="p-3 bg-slate-800 rounded-lg border border-slate-700">
                          <p className="text-xs font-bold text-emerald-400 uppercase">{edu.qualification}</p>
                          <p className="text-sm font-medium">{edu.degree || edu.specialization || 'N/A'}</p>
                          <p className="text-xs text-slate-400">{edu.institute} • {edu.year}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* 4. Experience & Skills */}
                  <div className="space-y-8">
                    <section>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-400" /> Experience
                      </h4>
                      <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-3">
                        <div>
                          <p className="text-xs text-slate-500">Total Experience</p>
                          <p className="font-bold">{selectedApplication.total_experience}</p>
                        </div>
                        {selectedApplication.total_experience !== 'Fresher' && (
                          <div className="pt-2 border-t border-slate-700">
                            <p className="text-sm font-bold">{selectedApplication.last_job_role}</p>
                            <p className="text-xs text-slate-400">{selectedApplication.last_job_company} • {selectedApplication.last_job_duration}</p>
                            <p className="text-xs text-slate-500 mt-2 line-clamp-3">{selectedApplication.last_job_responsibilities}</p>
                          </div>
                        )}
                      </div>
                    </section>

                    <section>
                      <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                        <Award className="w-4 h-4 text-yellow-400" /> Skills & Expertise
                      </h4>
                      <div className="p-4 bg-slate-800 rounded-xl border border-slate-700 space-y-4">
                        <div>
                          <p className="text-xs text-slate-500 mb-2">Primary Skills</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedApplication.primary_skills?.split(',').map((s: string) => (
                              <Badge key={s} variant="secondary" className="bg-blue-500/10 text-blue-400 border-blue-500/20">{s.trim()}</Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 mb-2">Tools & Tech</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedApplication.tools_known?.split(',').map((s: string) => (
                              <Badge key={s} variant="outline" className="text-slate-400 border-slate-700">{s.trim()}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-800">
                  <Button variant="outline" onClick={() => setShowApplicationModal(false)}>Close</Button>
                  <Button className="bg-red-600 hover:bg-red-700">Reject</Button>
                  <Button className="bg-green-600 hover:bg-green-700">Shortlist</Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main >
    </div >
  )
}