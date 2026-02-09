import { Metadata } from "next"
import { ArrowLeft, MapPin, Clock, DollarSign, Users, Building, Heart, Send, Briefcase, Award } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { IconRenderer } from "@/components/ui/icon-renderer"

export const metadata: Metadata = {
  title: "Job Details - Celoris Earn",
  description: "Detailed job information and application.",
}

const getTimeAgo = (dateString: string) => {
  const now = new Date()
  const date = new Date(dateString)
  const diffTime = Math.abs(now.getTime() - date.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
  return `${Math.floor(diffDays / 365)} years ago`
}

async function getJob(id: string) {
  const supabase = createClient()

  try {
    const { data: job, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !job) return null

    return {
      ...job,
      companyLogo: job.company_logo_url,
      company: job.company_name,
      isRemote: job.is_remote,
      salary: job.salary_min && job.salary_max
        ? `${job.salary_currency === 'USD' ? '$' : job.salary_currency}${(job.salary_min || 0).toLocaleString()} - ${job.salary_currency === 'USD' ? '$' : job.salary_currency}${(job.salary_max || 0).toLocaleString()}`
        : 'Competitive Salary',
      employmentType: job.employment_type,
      experienceLevel: job.experience_level,
      applicants: job.applicants_count || 0,
      posted: getTimeAgo(job.created_at),
      longDescription: job.description,
      description: job.description,
      requirements: job.requirements || [],
      responsibilities: job.responsibilities || [],
      skills: job.skills || [],
      companySize: job.company_size || 'Not specified',
      companyDescription: job.company_description,
      website: job.company_website,
      industry: job.industry || job.category || 'Technology',
      companyIcon: job.company_icon
    }
  } catch (e) {
    console.error("Error fetching job:", e)
    return null
  }
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = await getJob(id)

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-text-primary mb-4">Job Not Found</h1>
          <Link href="/earn/jobs">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
          <Link href="/" className="hover:text-primary-500">Home</Link>
          <span>/</span>
          <Link href="/earn" className="hover:text-primary-500">Earn</Link>
          <span>/</span>
          <Link href="/earn/jobs" className="hover:text-primary-500">Jobs</Link>
          <span>/</span>
          <span className="text-text-primary">{job.title}</span>
        </div>

        {/* Back Button */}
        <Link href="/earn/jobs" className="inline-flex items-center text-text-secondary hover:text-primary-500 mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Jobs
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Header */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                  {job.industry}
                </span>
                <span className="bg-surface px-3 py-1 rounded-full text-sm font-medium">
                  {job.experienceLevel}
                </span>
                {job.isRemote && (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    Remote
                  </span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                {job.title}
              </h1>
              <div className="flex items-center space-x-6 text-lg text-text-secondary mb-6">
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5" />
                  <span>{job.company}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5" />
                  <span>{job.location}</span>
                </div>
              </div>

              {/* Job Stats */}
              <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary mb-6">
                <div className="flex items-center space-x-1">
                  <DollarSign className="h-4 w-4" />
                  <span className="font-medium">{job.salary}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{job.employmentType}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{job.applicants} applicants</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>Posted {job.posted}</span>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle>Job Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-text-secondary leading-relaxed mb-4 whitespace-pre-wrap">
                  {job.longDescription}
                </p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            {job.responsibilities && job.responsibilities.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Responsibilities</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.responsibilities.map((responsibility: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Briefcase className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary">{responsibility}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {job.requirements.map((requirement: string, index: number) => (
                      <li key={index} className="flex items-start space-x-3">
                        <Award className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                        <span className="text-text-secondary">{requirement}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {job.skills && job.skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Required Skills</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-3">
                    {job.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="bg-primary-100 text-primary-700 px-4 py-2 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Application Card */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-2xl font-bold text-text-primary mb-2">
                      {job.salary}
                    </div>
                    <div className="text-text-secondary">Annual salary</div>
                  </div>
                  <Button className="w-full mb-4" size="lg">
                    <Send className="mr-2 h-4 w-4" />
                    Apply Now
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Heart className="mr-2 h-4 w-4" />
                    Save Job
                  </Button>
                  <div className="mt-6 text-center text-sm text-text-secondary">
                    <div>• Application takes 5-10 minutes</div>
                    <div className="mt-2">• Response within 48 hours</div>
                  </div>
                </CardContent>
              </Card>

              {/* Company Info */}
              <Card>
                <CardHeader>
                  <CardTitle>About the Company</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-4 mb-4">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-16 h-16 rounded-lg object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-primary-100 flex items-center justify-center text-primary-600">
                        <IconRenderer name={job.companyIcon} className="h-8 w-8" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-text-primary">{job.company}</h3>
                      <p className="text-sm text-text-secondary">{job.industry}</p>
                    </div>
                  </div>
                  {job.companyDescription && (
                    <p className="text-sm text-text-secondary mb-4">
                      {job.companyDescription}
                    </p>
                  )}
                  <div className="space-y-2 text-sm text-text-secondary">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>{job.companySize}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                  {job.website && (
                    <Button variant="outline" className="w-full mt-4" asChild>
                      <a href={job.website} target="_blank" rel="noopener noreferrer">
                        Visit Company Website
                      </a>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}