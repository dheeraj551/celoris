import { Metadata } from "next"
import { ArrowLeft, MapPin, Clock, DollarSign, Users, Building, Heart, Send, User, Award, Briefcase } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Job Details - Celoris Earn",
  description: "Detailed job information and application.",
}

// Static data for all jobs
const getJob = (id: string) => {
  const jobs: Record<string, any> = {
    "1": {
      title: "Senior Frontend Developer",
      company: "TechCorp Solutions",
      location: "San Francisco, CA",
      isRemote: true,
      salary: "₹120,000 - ₹150,000",
      employmentType: "Full-time",
      experienceLevel: "Senior",
      posted: "2 days ago",
      applicants: 45,
      description: "We are looking for an experienced Frontend Developer to join our growing team. You'll be responsible for building user-facing features and collaborating with designers and backend developers.",
      longDescription: "TechCorp Solutions is a leading technology company that specializes in building innovative web applications for enterprise clients. We're looking for a Senior Frontend Developer who is passionate about creating exceptional user experiences and has a proven track record of building scalable web applications.",
      companyLogo: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      companySize: "500-1000 employees",
      industry: "Technology"
    },
    "2": {
      title: "UX/UI Designer",
      company: "DesignStudio Inc",
      location: "New York, NY",
      isRemote: false,
      salary: "₹80,000 - ₹100,000",
      employmentType: "Full-time",
      experienceLevel: "Mid-level",
      posted: "1 day ago",
      applicants: 32,
      description: "Join our creative team to design intuitive and beautiful user experiences for web and mobile applications.",
      longDescription: "DesignStudio Inc is a creative agency that specializes in designing beautiful and functional digital experiences. We're looking for a talented UX/UI Designer who can create intuitive designs that delight users and drive business results.",
      companyLogo: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      companySize: "100-500 employees",
      industry: "Design"
    },
    "3": {
      title: "Data Scientist",
      company: "DataFlow Analytics",
      location: "Austin, TX",
      isRemote: true,
      salary: "₹110,000 - ₹140,000",
      employmentType: "Full-time",
      experienceLevel: "Senior",
      posted: "3 days ago",
      applicants: 28,
      description: "Analyze complex datasets to extract insights and build predictive models that drive business decisions.",
      longDescription: "DataFlow Analytics is a cutting-edge data science company that helps businesses make data-driven decisions. We're seeking a Senior Data Scientist who can leverage machine learning and analytics to solve complex business problems.",
      companyLogo: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      companySize: "200-500 employees",
      industry: "Analytics"
    }
  }
  return jobs[id] || jobs["1"] // Default to first job if ID not found
}

export default function JobDetailPage({ params }: { params: { id: string } }) {
  const job = getJob(params.id)

  const responsibilities = [
    "Build and maintain high-quality web applications",
    "Collaborate with cross-functional teams to deliver features",
    "Write clean, maintainable, and well-tested code",
    "Mentor junior developers and provide technical guidance",
    "Participate in code reviews and architectural discussions",
    "Stay updated with latest industry trends and technologies",
    "Ensure applications are performant and accessible"
  ]

  const requirements = [
    "Bachelor's degree in Computer Science or related field",
    "3+ years of relevant work experience",
    "Strong problem-solving and communication skills",
    "Experience with relevant tools and technologies",
    "Ability to work in a fast-paced environment",
    "Passion for learning and professional development"
  ]

  const skills = ["React", "TypeScript", "JavaScript", "CSS", "HTML", "Node.js", "Git", "Agile"]

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
                  <span className="font-medium">{job.salary}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{job.employmentType}</span>
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
                <p className="text-text-secondary leading-relaxed mb-4">
                  {job.longDescription}
                </p>
                <p className="text-text-secondary leading-relaxed">
                  {job.description}
                </p>
              </CardContent>
            </Card>

            {/* Responsibilities */}
            <Card>
              <CardHeader>
                <CardTitle>Responsibilities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {responsibilities.map((responsibility, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Briefcase className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary">{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Requirements */}
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Award className="h-5 w-5 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Required Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {skills.map((skill) => (
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
                    <img
                      src={job.companyLogo}
                      alt={job.company}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-text-primary">{job.company}</h3>
                      <p className="text-sm text-text-secondary">{job.industry}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary mb-4">
                    A leading company in the {job.industry.toLowerCase()} industry, committed to innovation and excellence.
                  </p>
                  <div className="space-y-2 text-sm text-text-secondary">
                    <div className="flex items-center space-x-2">
                      <Building className="h-4 w-4" />
                      <span>{job.companySize}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>Great place to work</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Similar Jobs */}
              <Card>
                <CardHeader>
                  <CardTitle>Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-medium text-text-primary mb-2">Frontend Developer</h4>
                    <p className="text-sm text-text-secondary mb-2">StartupCorp</p>
                    <div className="flex items-center space-x-4 text-xs text-text-secondary">
                      <span>$100k - $130k</span>
                      <span>Remote</span>
                    </div>
                  </div>
                  <div className="border border-border rounded-lg p-4">
                    <h4 className="font-medium text-text-primary mb-2">React Developer</h4>
                    <p className="text-sm text-text-secondary mb-2">WebTech Inc</p>
                    <div className="flex items-center space-x-4 text-xs text-text-secondary">
                      <span>$110k - $140k</span>
                      <span>San Francisco, CA</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/earn/jobs">View All Similar Jobs</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}