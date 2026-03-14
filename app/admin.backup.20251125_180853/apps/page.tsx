"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Smartphone, 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Search,
  Filter,
  Shield,
  LogOut,
  ArrowLeft,
  Eye,
  Download,
  Users,
  BarChart3,
  Zap,
  Globe,
  Database,
  FileText,
  Activity,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

export default function AdminAppsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [apps, setApps] = useState<any[]>([])
  const [integrations, setIntegrations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
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

  const loadData = async () => {
    try {
      // Mock data - in real implementation, fetch from Supabase
      setApps([
        {
          id: 1,
          name: "InstaLinker",
          description: "Social networking platform for professionals",
          category: "Social",
          status: "active",
          version: "2.1.0",
          users: 1247,
          downloads: 3400,
          rating: 4.8,
          lastUpdated: "2025-01-15",
          developer: "Celoris Team"
        },
        {
          id: 2,
          name: "CourseHub",
          description: "Learning management system",
          category: "Education",
          status: "active",
          version: "1.8.2",
          users: 892,
          downloads: 2100,
          rating: 4.9,
          lastUpdated: "2025-01-12",
          developer: "Celoris Team"
        },
        {
          id: 3,
          name: "JobTracker",
          description: "Job application and tracking tool",
          category: "Productivity",
          status: "beta",
          version: "1.2.0",
          users: 456,
          downloads: 890,
          rating: 4.5,
          lastUpdated: "2025-01-10",
          developer: "Celoris Team"
        },
        {
          id: 4,
          name: "DesignTool",
          description: "Collaborative design workspace",
          category: "Design",
          status: "maintenance",
          version: "3.0.1",
          users: 234,
          downloads: 567,
          rating: 4.7,
          lastUpdated: "2025-01-08",
          developer: "Celoris Team"
        },
        {
          id: 5,
          name: "Analytics Pro",
          description: "Advanced analytics and reporting",
          category: "Business",
          status: "active",
          version: "1.5.3",
          users: 178,
          downloads: 345,
          rating: 4.6,
          lastUpdated: "2025-01-05",
          developer: "Celoris Team"
        },
        {
          id: 6,
          name: "TaskManager",
          description: "Team collaboration and task management",
          category: "Productivity",
          status: "active",
          version: "2.0.1",
          users: 623,
          downloads: 1234,
          rating: 4.4,
          lastUpdated: "2025-01-03",
          developer: "Celoris Team"
        }
      ])

      setIntegrations([
        {
          id: 1,
          name: "Supabase Database",
          type: "Database",
          status: "connected",
          lastSync: "2025-01-18T10:30:00Z",
          uptime: "99.9%"
        },
        {
          id: 2,
          name: "Stripe Payments",
          type: "Payment",
          status: "connected",
          lastSync: "2025-01-18T09:45:00Z",
          uptime: "99.8%"
        },
        {
          id: 3,
          name: "Email Service",
          type: "Communication",
          status: "connected",
          lastSync: "2025-01-18T11:15:00Z",
          uptime: "99.7%"
        },
        {
          id: 4,
          name: "File Storage",
          type: "Storage",
          status: "connected",
          lastSync: "2025-01-18T10:00:00Z",
          uptime: "99.9%"
        },
        {
          id: 5,
          name: "N8N Automation",
          type: "Automation",
          status: "connected",
          lastSync: "2025-01-18T11:00:00Z",
          uptime: "99.6%"
        }
      ])
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = () => {
    localStorage.removeItem("admin_session")
    router.push("/admin/login")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400 bg-green-400/20'
      case 'beta': return 'text-yellow-400 bg-yellow-400/20'
      case 'maintenance': return 'text-orange-400 bg-orange-400/20'
      case 'disconnected': return 'text-red-400 bg-red-400/20'
      case 'connected': return 'text-green-400 bg-green-400/20'
      default: return 'text-slate-400 bg-slate-400/20'
    }
  }

  const getIntegrationIcon = (type: string) => {
    switch (type) {
      case 'Database': return <Database className="h-4 w-4" />
      case 'Payment': return <Zap className="h-4 w-4" />
      case 'Communication': return <Globe className="h-4 w-4" />
      case 'Storage': return <FileText className="h-4 w-4" />
      case 'Automation': return <Activity className="h-4 w-4" />
      default: return <Settings className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading Apps Management...</p>
        </div>
      </div>
    )
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
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <Smartphone className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Apps Management</h1>
                <p className="text-sm text-slate-400">Control productivity tools and system integrations</p>
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
                <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
                  <Smartphone className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Apps</p>
                  <p className="text-2xl font-bold text-white">{apps.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Users</p>
                  <p className="text-2xl font-bold text-white">
                    {apps.reduce((sum, app) => sum + app.users, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <Download className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Total Downloads</p>
                  <p className="text-2xl font-bold text-white">
                    {apps.reduce((sum, app) => sum + app.downloads, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-400">Active Integrations</p>
                  <p className="text-2xl font-bold text-white">
                    {integrations.filter(i => i.status === 'connected').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Apps Management */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
              <Smartphone className="h-6 w-6" />
              <span>Applications</span>
            </h2>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus className="h-4 w-4 mr-2" />
              Add New App
            </Button>
          </div>

          {/* Search and Filter */}
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search apps..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white text-sm"
                  >
                    <option value="all">All Categories</option>
                    <option value="Social">Social</option>
                    <option value="Education">Education</option>
                    <option value="Productivity">Productivity</option>
                    <option value="Design">Design</option>
                    <option value="Business">Business</option>
                  </select>
                  <Button variant="outline" size="sm" className="border-slate-600 text-slate-300">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Apps List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {apps.map((app) => (
              <Card key={app.id} className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white">{app.name}</CardTitle>
                      <CardDescription className="text-slate-400 mt-1">
                        v{app.version} • {app.category}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-300 mb-4">{app.description}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{app.users}</p>
                      <p className="text-xs text-slate-400">Users</p>
                    </div>
                    <div className="text-center">
                      <p className="text-lg font-bold text-white">{app.downloads}</p>
                      <p className="text-xs text-slate-400">Downloads</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Rating</span>
                      <span className="text-white flex items-center space-x-1">
                        <span>★</span>
                        <span>{app.rating}</span>
                      </span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Developer</span>
                      <span className="text-white">{app.developer}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      Updated: {new Date(app.lastUpdated).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* System Integrations */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
            <Settings className="h-6 w-6" />
            <span>System Integrations</span>
          </h2>

          {/* N8N Integration Highlight */}
          <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-700 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">N8N Automation Platform</h3>
                    <p className="text-purple-200">Advanced workflow automation and task management</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 text-green-400 mb-2">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">Connected</span>
                  </div>
                  <p className="text-sm text-purple-200">3 Active Workflows</p>
                  <p className="text-xs text-purple-300">Last sync: 2 minutes ago</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Integrations List */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-6">
              <div className="space-y-4">
                {integrations.map((integration) => (
                  <div key={integration.id} className="border border-slate-700 rounded-lg p-4 hover:bg-slate-750 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-slate-700 rounded-lg flex items-center justify-center">
                          {getIntegrationIcon(integration.type)}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{integration.name}</h4>
                          <p className="text-sm text-slate-400">{integration.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right text-sm">
                          <p className="text-white">{integration.uptime} uptime</p>
                          <p className="text-slate-400">
                            Last sync: {new Date(integration.lastSync).toLocaleString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(integration.status)}`}>
                          {integration.status}
                        </span>
                        <div className="space-x-2">
                          <Button size="sm" variant="outline" className="border-slate-600 text-slate-300">
                            <Settings className="h-4 w-4" />
                          </Button>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
