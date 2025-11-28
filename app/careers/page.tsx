import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Briefcase, MapPin, Clock, Users } from "lucide-react"

const jobOpenings = [
  {
    title: "Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "We're looking for a skilled Frontend Developer to join our growing team."
  },
  {
    title: "Product Manager",
    department: "Product",
    location: "New York, NY",
    type: "Full-time",
    description: "Lead product strategy and work with cross-functional teams to deliver amazing experiences."
  },
  {
    title: "UX Designer",
    department: "Design",
    location: "Remote",
    type: "Contract",
    description: "Create intuitive and beautiful user experiences for our platform."
  }
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          <h1 className="text-3xl font-bold text-text-primary">Careers</h1>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-semibold mb-4">Join Our Team</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We're always looking for talented individuals who share our passion for 
              digital transformation and want to make a real impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="text-center">
              <Users className="h-8 w-8 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">50+ Employees</h3>
              <p className="text-text-secondary text-sm">Growing team across multiple departments</p>
            </div>
            <div className="text-center">
              <Briefcase className="h-8 w-8 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">15+ Open Positions</h3>
              <p className="text-text-secondary text-sm">Opportunities in engineering, design, and business</p>
            </div>
            <div className="text-center">
              <MapPin className="h-8 w-8 text-primary-500 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Remote First</h3>
              <p className="text-text-secondary text-sm">Work from anywhere with flexible hours</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-6">Current Openings</h3>
          <div className="space-y-4">
            {jobOpenings.map((job, index) => (
              <div key={index} className="bg-surface p-6 rounded-lg border">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="text-lg font-semibold">{job.title}</h4>
                    <p className="text-text-secondary">{job.department}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-1">
                      <MapPin className="h-4 w-4" />
                      {job.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary">
                      <Clock className="h-4 w-4" />
                      {job.type}
                    </div>
                  </div>
                </div>
                <p className="text-text-secondary mb-4">{job.description}</p>
                <Button variant="outline">Apply Now</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}