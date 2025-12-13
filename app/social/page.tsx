"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Heart,
  MessageCircle,
  Users,
  Smartphone,
  Video,
  Phone,
  Instagram,
  Zap,
  Crown,
  MapPin,
  Star,
  ArrowRight,
  UserPlus,
  Shield,
  Award
} from "lucide-react"

export default function SocialPage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        setUser(user)

        // Get user profile from our custom users table
        const { data: profile } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single()

        setProfile(profile)
      }
    } catch (error) {
      console.error("Error checking auth:", error)
    } finally {
      setLoading(false)
    }
  }

  const platformFeatures = [
    {
      icon: Heart,
      title: "Tinder-Style Swiping",
      description: "Swipe right to connect with creators, influencers, and professionals who match your interests",
      color: "bg-pink-500",
      action: "Start Swiping"
    },
    {
      icon: Instagram,
      title: "Instagram Integration",
      description: "Embed your Instagram feed or showcase your handle to gain exposure and grow your following",
      color: "bg-purple-500",
      action: "Connect Instagram"
    },
    {
      icon: MessageCircle,
      title: "Real-time Chat",
      description: "Chat instantly with your matches using text, share photos, and build meaningful connections",
      color: "bg-blue-500",
      action: "Start Chatting"
    },
    {
      icon: Video,
      title: "Video & Voice Calls",
      description: "Premium feature for face-to-face conversations, job interviews, or creative collaborations",
      color: "bg-green-500",
      action: "Upgrade for Calls",
      premium: true
    },
    {
      icon: Smartphone,
      title: "WhatsApp Notifications",
      description: "Get instant WhatsApp alerts for new matches, messages, and important updates",
      color: "bg-emerald-500",
      action: "Enable Notifications",
      premium: true
    },
    {
      icon: Users,
      title: "Creator Network",
      description: "Connect with influencers, content creators, and professionals to expand your network",
      color: "bg-indigo-500",
      action: "Join Network",
      premium: true
    }
  ]

  const premiumFeatures = [
    {
      icon: Crown,
      title: "Unlimited Likes",
      description: "Swipe without limits and never miss a potential connection",
      badge: "Premium"
    },
    {
      icon: Zap,
      title: "Super Likes",
      description: "Stand out with Super Likes and increase your match rate by 3x",
      badge: "Pro"
    },
    {
      icon: Video,
      title: "Video Calls",
      description: "Face-to-face conversations with unlimited video calling",
      badge: "Premium"
    },
    {
      icon: MapPin,
      title: "Passport",
      description: "Swipe and match with people from any location worldwide",
      badge: "Pro"
    }
  ]

  const successStories = [
    {
      name: "Sarah Chen",
      role: "Digital Artist",
      location: "New York",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      story: "Found three amazing collaborators for my art projects through Celoris Social!",
      matches: 24,
      connection: "Creative Partnerships"
    },
    {
      name: "Mike Rodriguez",
      role: "Software Engineer",
      location: "San Francisco",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      story: "Connected with startup founders and landed my dream job at a unicorn company!",
      matches: 42,
      connection: "Career Growth"
    },
    {
      name: "Emma Davis",
      role: "UX Designer",
      location: "Austin",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      story: "Built a network of designers and successfully launched my own design studio",
      matches: 67,
      connection: "Business Launch"
    }
  ]

  const stats = [
    { label: "Active Users", value: "50K+", icon: Users },
    { label: "Successful Matches", value: "125K+", icon: Heart },
    { label: "Video Calls Made", value: "25K+", icon: Video },
    { label: "Creator Connections", value: "15K+", icon: Star }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500 mx-auto"></div>
          <p className="mt-4 text-text-secondary">Loading Celoris Social...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-20">
        <div className="container text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Celoris Social
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-medium">
              "Swipe. Connect. Grow."
            </p>
            <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-purple-50">
              The social growth and connection platform that blends Tinder-style discovery
              with Instagram influence building and professional networking.
            </p>

            {user ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Buttons removed as requested */}
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {/* Buttons removed as requested */}
              </div>
            )}
          </div>
        </div>
      </section>



      {/* Main Features */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Connect Like Never Before
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Our innovative platform combines the excitement of discovery with professional networking,
              helping you build meaningful connections and grow your influence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {platformFeatures.map((feature, index) => (
              <Card key={index} className="card-hover">
                <CardHeader>
                  <div className={`w-12 h-12 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    {feature.premium && (
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                        Premium
                      </span>
                    )}
                  </div>
                  <CardDescription className="text-text-secondary">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    className="w-full"
                    variant={feature.premium ? "outline" : "default"}
                    asChild
                  >
                    <Link href={feature.premium ? "/social/upgrade" : feature.action.toLowerCase().replace(" ", "-")}>
                      {feature.action}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-20 bg-gradient-to-r from-yellow-50 to-orange-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Unlock Premium Features
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Take your social networking to the next level with our premium features
              designed for serious creators and professionals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {premiumFeatures.map((feature, index) => (
              <Card key={index} className="text-center border-yellow-200">
                <CardHeader>
                  <div className="w-16 h-16 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded-full">
                      {feature.badge}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-text-secondary mb-4">
                    {feature.description}
                  </CardDescription>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600" asChild>
                    <Link href="/social/upgrade">
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories section removed */}

      {/* How It Works */}
      <section className="py-20 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              How Celoris Social Works
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Get started in minutes and begin building meaningful connections today.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Create Your Profile</h3>
                <p className="text-text-secondary">
                  Set up your profile with your Instagram handle, bio, and professional details
                  to showcase who you are.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Start Swiping</h3>
                <p className="text-text-secondary">
                  Discover creators, influencers, and professionals who align with your interests
                  and goals.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-3">Connect & Grow</h3>
                <p className="text-text-secondary">
                  Chat with matches, collaborate on projects, and build lasting relationships
                  that help you grow.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security & Trust */}
      <section className="py-16 bg-surface">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-4">
              Safe & Secure Platform
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Your safety and privacy are our top priorities. Connect with confidence
              knowing you're protected by industry-leading security measures.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Shield className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Verified Profiles</h3>
              <p className="text-text-secondary text-sm">
                All users undergo identity verification to ensure authentic connections.
              </p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Report & Block</h3>
              <p className="text-text-secondary text-sm">
                Easy-to-use reporting and blocking tools to maintain a positive environment.
              </p>
            </div>
            <div className="text-center">
              <Users className="h-12 w-12 text-blue-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-text-primary mb-2">Community Guidelines</h3>
              <p className="text-text-secondary text-sm">
                Clear guidelines ensure respectful interactions and professional conduct.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Connect & Grow?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-green-100">
            Join thousands of creators, influencers, and professionals who are building
            meaningful connections and growing their networks with Celoris Social.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <>
                {/* Buttons removed as requested */}
              </>
            ) : (
              <>
                {/* Buttons removed as requested */}
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
