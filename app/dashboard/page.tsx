"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, DollarSign, Users, Smartphone, User, LogOut, ArrowRight, Shield } from "lucide-react"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        setUser(user)
        
        // Get user profile
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single()
          
        setProfile(profile)
      } else {
        // Redirect to login if not authenticated
        window.location.href = "/login"
      }
    } catch (error) {
      console.error("Error checking user:", error)
      window.location.href = "/login"
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      window.location.href = "/"
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  // Check if user is admin
  const isAdmin = user?.email === "support@celorisdesigns.com"

  const handleAdminAccess = () => {
    window.location.href = "/admin/login"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const platformSections = [
    {
      title: "Learn",
      description: "Access courses, tutorials, and educational content",
      icon: BookOpen,
      href: "/learn",
      color: "bg-blue-500"
    },
    {
      title: "Earn",
      description: "Find job opportunities and freelance work",
      icon: DollarSign,
      href: "/earn",
      color: "bg-green-500"
    },
    {
      title: "Social",
      description: "Connect with creators and build your network",
      icon: Users,
      href: "/social",
      color: "bg-purple-500"
    },
    {
      title: "Apps",
      description: "Access productivity tools and utilities",
      icon: Smartphone,
      href: "/apps",
      color: "bg-orange-500"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Welcome to your dashboard
          </h1>
          <p className="text-xl text-text-secondary mb-6">
            Your personalized gateway to learning, earning, social connections, and productivity
          </p>
          
          {/* User Stats Card */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Profile Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-secondary">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Full Name</p>
                  <p className="font-medium">{profile?.full_name || "Not set"}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Member Since</p>
                  <p className="font-medium">
                    {new Date(user.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary">Account Status</p>
                  <p className="font-medium text-green-600">Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Platform Sections */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">
            Explore Platform Sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {platformSections.map((section) => {
              const Icon = section.icon
              return (
                <Card key={section.title} className="hover:shadow-lg transition-shadow cursor-pointer group">
                  <Link href={section.href}>
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center mb-3`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg group-hover:text-primary-500 transition-colors">
                        {section.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">
                        {section.description}
                      </CardDescription>
                      <div className="flex items-center text-primary-500 font-medium group-hover:text-primary-600">
                        <span>Explore {section.title}</span>
                        <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={`grid gap-6 ${isAdmin ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-3'}`}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Start</CardTitle>
              <CardDescription>Get started with your journey</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full" variant="outline">
                <Link href="/learn">Browse Courses</Link>
              </Button>
              <Button asChild className="w-full" variant="outline">
                <Link href="/earn">Find Jobs</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile Settings</CardTitle>
              <CardDescription>Manage your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                Edit Profile
              </Button>
              <Button className="w-full" variant="outline">
                Change Password
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Need Help?</CardTitle>
              <CardDescription>Support and resources</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" variant="outline">
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button className="w-full" variant="outline">
                View FAQ
              </Button>
            </CardContent>
          </Card>

          {isAdmin && (
            <Card className="bg-gradient-to-r from-red-900/50 to-red-800/50 border-red-700">
              <CardHeader>
                <CardTitle className="text-lg text-white flex items-center space-x-2">
                  <Shield className="h-5 w-5" />
                  <span>Admin Panel</span>
                </CardTitle>
                <CardDescription className="text-red-200">
                  Command center access for administrators
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={handleAdminAccess}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Access Admin Panel
                </Button>
                <div className="text-xs text-red-300 text-center">
                  Platform management and analytics
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}