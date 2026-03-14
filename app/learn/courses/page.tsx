"use client"

import { useState } from "react"
import { BookOpen, Filter, Search, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import CoursesDisplay from "@/components/CoursesDisplay"
import { PageWrapper } from "@/components/PageWrapper"

const categories = [
  { name: "Programming", icon: "💻" },
  { name: "Design", icon: "🎨" },
  { name: "Marketing", icon: "📈" },
  { name: "Data Science", icon: "📊" },
  { name: "Business", icon: "💼" },
  { name: "Artificial Intelligence", icon: "🤖" },
  { name: "Mathematics", icon: "🔢" },
  { name: "Physics", icon: "⚛️" },
  { name: "Chemistry", icon: "🧪" },
  { name: "Yoga", icon: "🧘" },
  { name: "Fitness", icon: "💪" },
  { name: "Mobile Development", icon: "📱" },
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
    <PageWrapper className="min-h-screen bg-[#050810] py-24 selection:bg-emerald-500/30">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-teal-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="container max-w-7xl mx-auto px-4 relative z-10">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <Link href="/" className="text-slate-500 hover:text-emerald-400 transition-colors">Home</Link>
            <span className="text-slate-700">/</span>
            <Link href="/learn" className="text-slate-500 hover:text-emerald-400 transition-colors">Learn</Link>
            <span className="text-slate-700">/</span>
            <span className="text-emerald-500 italic">Academy</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 italic uppercase tracking-tighter">
            Celoris Academy
          </h1>
          <p className="text-lg text-slate-400 font-medium italic max-w-2xl">
            Discover our complete collection of courses designed to help you master new skills and bridge the digital gap.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-[#0d1321]/40 backdrop-blur-3xl rounded-[2.5rem] p-8 border border-white/5 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 h-5 w-5 text-emerald-500/50" />
                <Input
                  placeholder="Search courses..."
                  className="h-14 bg-white/5 border-white/10 rounded-2xl pl-16 pr-8 text-white text-sm placeholder:text-slate-600 focus:border-emerald-500/50 focus:bg-white/10 transition-all border outline-none"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
            <div>
              <div className="relative">
                <Filter className="absolute left-6 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500/50 pointer-events-none" />
                <select
                  className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl pl-14 pr-6 text-white text-sm appearance-none focus:border-emerald-500/50 focus:bg-white/10 transition-all outline-none italic font-bold uppercase tracking-widest text-[10px]"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option className="bg-[#0d1321]">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.name} value={cat.name} className="bg-[#0d1321]">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Button className="w-full h-14 bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 rounded-2xl font-black uppercase tracking-widest text-[10px]" variant="outline" onClick={() => {
                setSearchTerm("");
                setSelectedCategory("All Categories");
                setSelectedLevel("All Levels");
                setCurrentPage(1);
              }}>
                Reset Search
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1">
            <div className="space-y-8">
              {/* Categories */}
              <Card className="bg-[#0d1321]/40 backdrop-blur-3xl border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Categories</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-2">
                  <div
                    className={`flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 cursor-pointer transition-colors ${selectedCategory === "All Categories" ? "bg-emerald-500/10 text-emerald-400 font-bold" : "text-slate-400"}`}
                    onClick={() => {
                      setSelectedCategory("All Categories");
                      setCurrentPage(1);
                    }}
                  >
                    <div className="flex items-center space-x-3 italic">
                      <span className="text-lg">📚</span>
                      <span className="text-xs uppercase tracking-widest font-black">All Academy</span>
                    </div>
                  </div>
                  {categories?.map((category) => (
                    <div
                      key={category.name}
                      className={`flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 cursor-pointer transition-colors ${selectedCategory === category.name ? "bg-emerald-500/10 text-emerald-400 font-bold" : "text-slate-400"}`}
                      onClick={() => {
                        setSelectedCategory(category.name);
                        setCurrentPage(1);
                      }}
                    >
                      <div className="flex items-center space-x-3 italic">
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-xs uppercase tracking-widest font-black">{category.name}</span>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Levels */}
              <Card className="bg-[#0d1321]/40 backdrop-blur-3xl border-white/5 rounded-[2.5rem] overflow-hidden shadow-xl">
                <CardHeader className="p-8 pb-4">
                  <CardTitle className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500">Skill Level</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-2">
                  {levels?.map((level) => (
                    <div
                      key={level.name}
                      className={`flex items-center justify-between py-3 px-4 rounded-xl hover:bg-white/5 cursor-pointer transition-colors ${selectedLevel === level.name ? "bg-blue-500/10 text-blue-400 font-bold" : "text-slate-400"}`}
                      onClick={() => {
                        setSelectedLevel(level.name);
                        setCurrentPage(1);
                      }}
                    >
                      <span className="text-xs uppercase tracking-widest font-black italic">{level.name}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

            </div>
          </div>

          {/* Course Grid */}
          <div className="lg:col-span-3">
            <div className="mb-10 flex items-center justify-between relative z-10">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Discovery Mode: <span className="text-emerald-500">{totalItems} COURSES FOUND</span></span>
              <div className="flex gap-2">
                <div className="h-8 w-8 bg-emerald-500/10 border border-emerald-500/20 rounded-lg animate-pulse" />
                <div className="h-8 w-8 bg-teal-500/10 border border-teal-500/20 rounded-lg animate-pulse delay-75" />
              </div>
            </div>

            <CoursesDisplay
              layout="grid"
              limit={coursesPerPage}
              page={currentPage}
              onTotalChange={(total) => setTotalItems(total)}
              showStats={true}
              subject={selectedCategory === "All Categories" ? undefined : selectedCategory}
              grade_level={selectedLevel === "All Levels" ? undefined : selectedLevel}
              search={searchTerm}
              className=""
            />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center space-x-3 mt-20 pb-20">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-12 px-6 bg-white/5 border-white/10 text-slate-400 hover:text-white rounded-xl font-black uppercase tracking-widest text-[10px]"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Prev
                </Button>
                <div className="flex items-center space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-12 h-12 rounded-xl font-black transition-all ${currentPage === pageNum ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20" : "bg-white/5 border-white/10 text-slate-500 hover:text-white"}`}
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
                  className="h-12 px-6 bg-white/5 border-white/10 text-slate-400 hover:text-white rounded-xl font-black uppercase tracking-widest text-[10px]"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            )}

            {totalItems === 0 && (
              <div className="text-center py-32 bg-[#0d1321]/40 rounded-[3rem] border border-white/5">
                <BookOpen className="h-16 w-16 mx-auto mb-6 text-slate-500 opacity-20" />
                <p className="text-slate-500 font-black uppercase tracking-[0.3em] text-[10px]">No modules match your current uplink filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  )
}
