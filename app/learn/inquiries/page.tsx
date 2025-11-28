import { Metadata } from "next"
import { ArrowLeft, Search, Filter, MessageCircle, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Student Inquiries - Celoris Platform",
  description: "Browse and manage student inquiries, questions, and support requests.",
}

const inquiryCategories = [
  { id: 'all', name: 'All Inquiries', count: 45 },
  { id: 'course', name: 'Course Information', count: 18 },
  { id: 'technical', name: 'Technical Support', count: 12 },
  { id: 'learning', name: 'Learning Support', count: 15 },
]

const recentInquiries = [
  {
    id: 1,
    title: "How to access course materials after enrollment?",
    category: "Course Information",
    status: "resolved",
    student: "John Smith",
    time: "2 hours ago",
    priority: "medium"
  },
  {
    id: 2,
    title: "Video playback issues in Safari browser",
    category: "Technical Support", 
    status: "pending",
    student: "Sarah Johnson",
    time: "4 hours ago",
    priority: "high"
  },
  {
    id: 3,
    title: "Need help understanding React hooks",
    category: "Learning Support",
    status: "in-progress",
    student: "Mike Chen",
    time: "6 hours ago",
    priority: "medium"
  },
  {
    id: 4,
    title: "Course certificate issuance process",
    category: "Course Information",
    status: "resolved",
    student: "Emma Davis",
    time: "1 day ago",
    priority: "low"
  },
  {
    id: 5,
    title: "Unable to submit assignment on mobile",
    category: "Technical Support",
    status: "pending",
    student: "Alex Wilson",
    time: "1 day ago",
    priority: "high"
  },
  {
    id: 6,
    title: "Clarification on project requirements",
    category: "Learning Support",
    status: "resolved",
    student: "Lisa Brown",
    time: "2 days ago",
    priority: "medium"
  }
]

export default function InquiriesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Button variant="outline" asChild className="mb-4">
            <Link href="/learn">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Learning
            </Link>
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Student Inquiries</h1>
              <p className="text-gray-600 mt-2">
                Browse and manage student questions, support requests, and feedback.
              </p>
            </div>
            
            <Button className="bg-purple-600 hover:bg-purple-700">
              <MessageCircle className="h-4 w-4 mr-2" />
              New Inquiry
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Categories & Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {inquiryCategories.map((category) => (
                  <Button
                    key={category.id}
                    variant={category.id === 'all' ? 'default' : 'ghost'}
                    className="w-full justify-between"
                  >
                    {category.name}
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {category.count}
                    </span>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search and Filter */}
            <Card className="mb-6">
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <Input 
                      placeholder="Search inquiries..." 
                      className="pl-10"
                    />
                  </div>
                  <Button variant="outline">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Inquiries List */}
            <div className="space-y-4">
              {recentInquiries.map((inquiry) => (
                <Card key={inquiry.id} className="card-hover">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {inquiry.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            inquiry.priority === 'high' 
                              ? 'bg-red-100 text-red-800'
                              : inquiry.priority === 'medium'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {inquiry.priority} priority
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="bg-gray-100 px-2 py-1 rounded">
                            {inquiry.category}
                          </span>
                          <span>by {inquiry.student}</span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {inquiry.time}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {inquiry.status === 'resolved' && (
                          <span className="flex items-center gap-1 text-green-600 text-sm">
                            <CheckCircle className="h-4 w-4" />
                            Resolved
                          </span>
                        )}
                        {inquiry.status === 'pending' && (
                          <span className="flex items-center gap-1 text-orange-600 text-sm">
                            <Clock className="h-4 w-4" />
                            Pending
                          </span>
                        )}
                        {inquiry.status === 'in-progress' && (
                          <span className="flex items-center gap-1 text-blue-600 text-sm">
                            <Clock className="h-4 w-4" />
                            In Progress
                          </span>
                        )}
                        
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-8">
              <Button variant="outline">
                Load More Inquiries
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
