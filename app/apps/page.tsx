import { Metadata } from "next"
import { Smartphone, Download, Star, Users, Zap, Shield, Palette, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"

export const metadata: Metadata = {
  title: "Apps - Celoris Platform",
  description: "Discover our collection of innovative mobile applications designed to enhance your productivity, creativity, and lifestyle.",
  openGraph: {
    title: "Apps - Celoris Platform",
    description: "Discover our collection of innovative mobile applications.",
    url: "https://celoris.com/apps",
  },
}

const mobileApps = [
  {
    id: 1,
    name: "Celoris Learn",
    description: "Master new skills on the go with our comprehensive mobile learning platform. Access courses, track progress, and learn anywhere.",
    category: "Education",
    icon: "📚",
    rating: 4.8,
    downloads: "50K+",
    isFeatured: true,
    platforms: ["iOS", "Android"],
    features: ["Offline learning", "Progress tracking", "Interactive quizzes", "Certificate generation"],
    screenshots: 4
  },
  {
    id: 2,
    name: "Celoris Social",
    description: "Connect with creators, influencers, and professionals. Swipe, match, and grow your network with our innovative social app.",
    category: "Social",
    icon: "💬",
    rating: 4.7,
    downloads: "100K+",
    isFeatured: true,
    platforms: ["iOS", "Android"],
    features: ["Tinder-style swiping", "Real-time chat", "Video calls", "Instagram integration"],
    screenshots: 5
  },
  {
    id: 3,
    name: "Celoris Jobs",
    description: "Find your dream career with our mobile job search app. Browse opportunities, apply instantly, and track applications.",
    category: "Career",
    icon: "💼",
    rating: 4.6,
    downloads: "75K+",
    isFeatured: true,
    platforms: ["iOS", "Android"],
    features: ["Job alerts", "One-tap apply", "Salary insights", "Interview prep"],
    screenshots: 4
  },
  {
    id: 4,
    name: "Celoris Productivity",
    description: "Boost your productivity with task management, time tracking, and goal setting all in one powerful mobile app.",
    category: "Productivity",
    icon: "⚡",
    rating: 4.5,
    downloads: "30K+",
    isFeatured: false,
    platforms: ["iOS", "Android"],
    features: ["Task management", "Time tracking", "Goal setting", "Analytics"],
    screenshots: 3
  },
  {
    id: 5,
    name: "Celoris Wellness",
    description: "Track your health and wellness journey. Monitor fitness, nutrition, mental health, and build healthy habits.",
    category: "Health",
    icon: "🏃",
    rating: 4.7,
    downloads: "45K+",
    isFeatured: false,
    platforms: ["iOS", "Android"],
    features: ["Fitness tracking", "Meal planning", "Meditation", "Sleep analysis"],
    screenshots: 5
  },
  {
    id: 6,
    name: "Celoris Finance",
    description: "Manage your finances on the go. Track expenses, create budgets, and achieve your financial goals with ease.",
    category: "Finance",
    icon: "💰",
    rating: 4.6,
    downloads: "60K+",
    isFeatured: false,
    platforms: ["iOS", "Android"],
    features: ["Expense tracking", "Budget planning", "Investment insights", "Bill reminders"],
    screenshots: 4
  }
]

const categories = [
  { name: "Education", count: 3, icon: "📚", color: "bg-blue-100 text-blue-600" },
  { name: "Social", count: 2, icon: "💬", color: "bg-purple-100 text-purple-600" },
  { name: "Productivity", count: 4, icon: "⚡", color: "bg-yellow-100 text-yellow-600" },
  { name: "Health", count: 2, icon: "🏃", color: "bg-green-100 text-green-600" },
  { name: "Finance", count: 3, icon: "💰", color: "bg-emerald-100 text-emerald-600" },
  { name: "Career", count: 2, icon: "💼", color: "bg-indigo-100 text-indigo-600" },
  { name: "Lifestyle", count: 3, icon: "🎨", color: "bg-pink-100 text-pink-600" },
  { name: "Entertainment", count: 2, icon: "🎮", color: "bg-orange-100 text-orange-600" }
]

const featuredApps = mobileApps.filter(app => app.isFeatured)

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20">
        <div className="container text-center">
          <div className="flex justify-center mb-6">
            <Smartphone className="h-16 w-16" />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Our Mobile Apps
          </h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto text-primary-50">
            Discover innovative mobile applications designed to enhance your productivity,
            creativity, and lifestyle. Available on iOS and Android.
          </p>

        </div>
      </section>


      {/* Categories Section */}
      <section className="py-16 bg-background">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Explore Categories
            </h2>
            <p className="text-lg text-text-secondary">
              Find apps that match your needs
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <Card key={category.name} className="card-hover cursor-pointer">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mx-auto mb-3 text-3xl`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-text-primary mb-2">{category.name}</h3>
                  <p className="text-sm text-text-secondary">{category.count} apps</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Apps */}
      <section className="py-16 bg-surface">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Featured Apps
            </h2>
            <p className="text-lg text-text-secondary">
              Our most popular mobile applications
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredApps.map((app) => (
              <Card key={app.id} className="card-hover overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-3xl shadow-lg">
                      {app.icon}
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-text-secondary">{app.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-xl">{app.name}</CardTitle>
                  <CardDescription>{app.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-text-secondary">
                        <Download className="h-4 w-4" />
                        <span>{app.downloads} downloads</span>
                      </div>
                      <span className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-xs font-medium">
                        {app.category}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      {app.platforms.map((platform) => (
                        <span key={platform} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                          {platform}
                        </span>
                      ))}
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-text-primary">Key Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {app.features.slice(0, 3).map((feature) => (
                          <span
                            key={feature}
                            className="bg-gray-50 text-text-secondary px-2 py-1 rounded-md text-xs"
                          >
                            {feature}
                          </span>
                        ))}
                        {app.features.length > 3 && (
                          <span className="text-xs text-text-secondary px-2 py-1">
                            +{app.features.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button className="flex-1" asChild>
                        <Link href={`/apps/${app.id}`}>
                          <Smartphone className="mr-2 h-4 w-4" />
                          View Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" asChild>
              <Link href="#all-apps">
                View All Apps
                <TrendingUp className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* All Apps Grid */}
      <section id="all-apps" className="py-16 bg-background">
        <div className="container">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
                All Mobile Apps
              </h2>
              <p className="text-lg text-text-secondary">
                Complete collection of our mobile applications
              </p>
            </div>
            <div className="flex gap-2">
              <select className="px-3 py-2 border border-input rounded-md bg-background">
                <option>All Categories</option>
                <option>Education</option>
                <option>Social</option>
                <option>Productivity</option>
                <option>Health</option>
              </select>
              <select className="px-3 py-2 border border-input rounded-md bg-background">
                <option>Most Popular</option>
                <option>Recently Added</option>
                <option>Highest Rated</option>
                <option>Most Downloaded</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mobileApps.map((app) => (
              <Card key={app.id} className="card-hover">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-2xl shadow-md">
                      {app.icon}
                    </div>
                    {app.isFeatured && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                        Featured
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-lg text-text-primary mb-2">{app.name}</h3>
                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">{app.description}</p>

                  <div className="flex items-center justify-between text-xs text-text-secondary mb-4">
                    <div className="flex items-center space-x-1">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span>{app.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Download className="h-3 w-3" />
                      <span>{app.downloads}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full">
                      {app.category}
                    </span>
                    <Button size="sm" asChild>
                      <Link href={`/apps/${app.id}`}>
                        View App
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* App Features Section */}
      <section className="py-16 bg-surface">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Why Choose Our Apps?
            </h2>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Built with cutting-edge technology and designed for the best user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle>Lightning Fast</CardTitle>
                <CardDescription>
                  Optimized performance for smooth and responsive user experience on all devices.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle>Secure & Private</CardTitle>
                <CardDescription>
                  Your data is encrypted and protected with industry-leading security measures.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="card-hover text-center">
              <CardHeader>
                <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
                  <Palette className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle>Beautiful Design</CardTitle>
                <CardDescription>
                  Intuitive interfaces crafted with attention to detail and modern design principles.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Icon */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl">
                <Smartphone className="h-14 w-14 text-white" />
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>

            {/* Description */}
            <p className="text-xl md:text-2xl mb-12 max-w-3xl mx-auto text-green-50 leading-relaxed">
              Download our apps today and experience the future of mobile productivity,
              learning, and social connection.
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              {/* App Store Button */}
              <a
                href="#"
                className="inline-flex items-center bg-black text-white rounded-xl px-6 py-3 hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl"
              >
                <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs">Available on the</div>
                  <div className="text-xl font-semibold -mt-1">App Store</div>
                </div>
              </a>

              {/* Google Play Button */}
              <a
                href="#"
                className="inline-flex items-center bg-black text-white rounded-xl px-6 py-3 hover:bg-gray-900 transition-all shadow-xl hover:shadow-2xl"
              >
                <svg className="w-8 h-8 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" fill="url(#gradient)" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style={{ stopColor: '#00D6FF', stopOpacity: 1 }} />
                      <stop offset="50%" style={{ stopColor: '#FFD500', stopOpacity: 1 }} />
                      <stop offset="100%" style={{ stopColor: '#FF0080', stopOpacity: 1 }} />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-xl font-semibold -mt-1">Google Play</div>
                </div>
              </a>
            </div>

            {/* Additional info */}
            <div className="mt-12 flex flex-wrap justify-center gap-8 text-green-50">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-white text-white" />
                <span className="text-sm font-medium">4.8 Average Rating</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <span className="text-sm font-medium">500K+ Downloads</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-medium">100% Secure</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}