"use client"

import { useState } from "react"
import { BookOpen, Clock, Users, Star, Filter, Search, ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import CoursesDisplay from "@/components/CoursesDisplay"

const categories = [
  { name: "Programming", icon: "💻" },
  { name: "Design", icon: "🎨" },
  { name: "Marketing", icon: "📈" },
  { name: "Data Science", icon: "📊" },
  { name: "Business", icon: "💼" },
  { name: "Mobile Development", icon: "📱" },
  { name: "AI/ML", icon: "🤖" },
  { name: "Cybersecurity", icon: "🔒" }
]

const levels = [
  { name: "All Levels" },
  { name: "Beginner" },
  { name: "Intermediate" },
  { name: "Advanced" }
]

export default function AllCoursesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [selectedLevel, setSelectedLevel] = useState("All Levels")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const coursesPerPage = 6

  const totalPages = Math.ceil(totalItems / coursesPerPage)

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-text-secondary mb-4">
            <Link href="/" className="hover:text-primary-500">Home</Link>
            <span>/</span>
            <Link href="/learn" className="hover:text-primary-500">Learn</Link>
            <span>/</span>
            <span className="text-text-primary">All Courses</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            All Courses
          </h1>
          <p className="text-lg text-text-secondary">
            Discover our complete collection of courses designed to help you master new skills
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-surface rounded-lg p-6 shadow-sm border mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-text-secondary" />
                <Input
                  placeholder="Search courses..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div>
              <select
                className="w-full h-10 px-3 border border-input rounded-md bg-background"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option>All Categories</option>
                <option>Mathematics</option>
                <option>Physics</option>
                <option>Chemistry</option>
                <option>Artificial Intelligence</option>
                <option>Yoga</option>
                <option>Fitness</option>
                <option>Programming</option>
                <option>Design</option>
                <option>Marketing</option>
                <option>Data Science</option>
              </select>
            </div>
            <div>
              <Button className="w-full" variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Categories");
                setSelectedLevel("All Levels");
                setCurrentPage(1);
              }}>
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div
                    className={`flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface cursor-pointer transition-colors ${selectedCategory === "All Categories" ? "bg-primary-50 text-primary-600 font-semibold" : ""}`}
                    onClick={() => {
                      setSelectedCategory("All Categories");
                      setCurrentPage(1);
                    }}
                  >
                    <div className="flex items-center space-x-3">
                      <span>📚</span>
                      <span className="text-sm">All Categories</span>
                    </div>
                  </div>
                  {categories?.map((category) => (
                    <div
                      key={category.name}
                      className={`flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface cursor-pointer transition-colors ${selectedCategory === category.name ? "bg-primary-50 text-primary-600 font-semibold" : ""}`}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setCurrentPage(1);
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <span>{category.icon}</span>
                        <span className="text-sm">{category.name}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Levels */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Level</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {levels?.map((level) => (
                    <div
                      key={level.name}
                      className={`flex items-center justify-between py-2 px-3 rounded-lg hover:bg-surface cursor-pointer transition-colors ${selectedLevel === level.name ? "bg-primary-50 text-primary-600 font-semibold" : ""}`}
                      onClick={() => {
                        setSelectedLevel(level.name);
                        setCurrentPage(1);
                      }}
                    >
                      <span className="text-sm">{level.name}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Price Range */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Price</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" />
                      <span className="text-sm">Free</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input type="checkbox" className="rounded border-input" />
                      <span className="text-sm">Paid</span>
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Course Grid */}
          <div className="lg:col-span-3">
            <CoursesDisplay
              layout="grid"
              limit={coursesPerPage}
              page={currentPage}
              onTotalChange={(total) => setTotalItems(total)}
              showStats={true}
              subject={selectedCategory === "All Categories" ? undefined : selectedCategory}
              grade_level={selectedLevel === "All Levels" ? undefined : selectedLevel}
              className=""
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-2 mt-12 pb-12">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}

            {totalItems === 0 && (
              <div className="text-center py-20">
                <p className="text-gray-500">No courses match your current filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}