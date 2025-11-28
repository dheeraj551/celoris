"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  DollarSign,
  TrendingUp,
  Users,
  Crown,
  Gift,
  Eye,
  Heart,
  Star,
  Calendar,
  Plus,
  Settings,
  ArrowUpRight,
  CreditCard,
  Wallet,
  Target,
  Zap,
  Award
} from "lucide-react"

interface CreatorEarning {
  id: string
  creator_id: string
  supporter_id: string
  amount: number
  currency: string
  earning_type: 'tip' | 'subscription' | 'content_payment'
  content_id?: string
  is_completed: boolean
  created_at: string
  supporter: {
    full_name: string
    avatar_url?: string
  }
}

interface CreatorStats {
  totalEarnings: number
  monthlyEarnings: number
  totalTips: number
  totalSubscribers: number
  totalContent: number
  averageTip: number
  conversionRate: number
}

export default function EarningsPage() {
  const [user, setUser] = useState<any>(null)
  const [isCreator, setIsCreator] = useState(false)
  const [earnings, setEarnings] = useState<CreatorEarning[]>([])
  const [stats, setStats] = useState<CreatorStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'earnings' | 'content' | 'subscribers'>('overview')
  const router = useRouter()

  useEffect(() => {
    checkAuthAndLoadData()
  }, [])

  const checkAuthAndLoadData = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Check if user is a creator
      const { data: profile } = await supabase
        .from('social_profiles')
        .select('is_creator')
        .eq('id', user.id)
        .single()

      if ((profile as any)?.is_creator) {
        setIsCreator(true)
        await loadCreatorData()
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCreatorData = async () => {
    try {
      const supabase = createClient()

      // Load earnings
      const { data: earningsData } = await supabase
        .from('creator_earnings')
        .select(`
          *,
          supporter:social_profiles!creator_earnings_supporter_id_fkey(full_name, avatar_url)
        `)
        .eq('creator_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20)

      setEarnings(earningsData || [])

      // Calculate stats
      const currentMonth = new Date()
      currentMonth.setDate(1)
      currentMonth.setHours(0, 0, 0, 0)

      const monthlyEarnings = (earningsData || []).filter(
        e => new Date((e as any).created_at) >= currentMonth && (e as any).is_completed
      ).reduce((sum, e) => sum + (e as any).amount, 0)

      const totalEarnings = (earningsData || []).filter(e => (e as any).is_completed)
        .reduce((sum, e) => sum + (e as any).amount, 0)

      const completedEarnings = (earningsData || []).filter(e => (e as any).is_completed)
      const avgTip = completedEarnings.length > 0 
        ? totalEarnings / completedEarnings.length 
        : 0

      setStats({
        totalEarnings,
        monthlyEarnings,
        totalTips: completedEarnings.filter(e => (e as any).earning_type === 'tip').length,
        totalSubscribers: 0, // Would need subscription data
        totalContent: 0, // Would need content count
        averageTip: avgTip,
        conversionRate: 2.5 // Mock data
      })
    } catch (error) {
      console.error('Error loading creator data:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Earned</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats ? formatCurrency(stats.totalEarnings) : '$0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats ? formatCurrency(stats.monthlyEarnings) : '$0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Gift className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Tips</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats?.totalTips || 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Avg Tip</p>
                <p className="text-xl font-bold text-gray-900">
                  {stats ? formatCurrency(stats.averageTip) : '$0'}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Monetization Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <Gift className="w-6 h-6 text-purple-500" />
                <h4 className="font-semibold">Accept Tips</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Let your fans support you with one-time tips
              </p>
              <Button size="sm" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Enable Tips
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-yellow-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="w-6 h-6 text-yellow-500" />
                <h4 className="font-semibold">Subscriptions</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Create exclusive content for subscribers
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Set Up
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg hover:border-green-300 transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-3">
                <Eye className="w-6 h-6 text-green-500" />
                <h4 className="font-semibold">Live Streams</h4>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Go live and earn from viewers
              </p>
              <Button size="sm" variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Start Live
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderEarnings = () => (
    <div className="space-y-4">
      {earnings.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <Wallet className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No earnings yet</h3>
            <p className="text-gray-600 mb-6">
              Start engaging with your audience to earn money from tips and subscriptions.
            </p>
            <Button onClick={() => setActiveTab('overview')}>
              <DollarSign className="w-4 h-4 mr-2" />
              Set Up Monetization
            </Button>
          </CardContent>
        </Card>
      ) : (
        earnings.map((earning) => (
          <Card key={earning.id} className="card-hover">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <img
                  src={earning.supporter.avatar_url || `/api/placeholder/40/40`}
                  alt={earning.supporter.full_name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-gray-900">
                      {earning.supporter.full_name}
                    </h4>
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      earning.earning_type === 'tip' 
                        ? 'bg-purple-100 text-purple-700'
                        : earning.earning_type === 'subscription'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {earning.earning_type === 'tip' ? 'Tip' : 
                       earning.earning_type === 'subscription' ? 'Subscription' : 'Content'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {formatDate(earning.created_at)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900">
                    {formatCurrency(earning.amount)}
                  </p>
                  <p className={`text-xs ${earning.is_completed ? 'text-green-600' : 'text-yellow-600'}`}>
                    {earning.is_completed ? 'Completed' : 'Pending'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading earnings...</p>
        </div>
      </div>
    )
  }

  if (!isCreator) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          <div className="text-center py-12">
            <Crown className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Become a Creator</h2>
            <p className="text-gray-600 mb-8">
              Start monetizing your content and earn money from your community.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <Card className="text-left">
                <CardContent className="p-4">
                  <Gift className="w-8 h-8 text-purple-500 mb-3" />
                  <h3 className="font-semibold mb-2">Accept Tips</h3>
                  <p className="text-sm text-gray-600">
                    Let your fans support you with one-time payments
                  </p>
                </CardContent>
              </Card>
              
              <Card className="text-left">
                <CardContent className="p-4">
                  <Crown className="w-8 h-8 text-yellow-500 mb-3" />
                  <h3 className="font-semibold mb-2">Subscriptions</h3>
                  <p className="text-sm text-gray-600">
                    Create exclusive content for paying subscribers
                  </p>
                </CardContent>
              </Card>
            </div>
            
            <Button size="lg" className="mb-4">
              <Crown className="w-5 h-5 mr-2" />
              Apply to Become Creator
            </Button>
            
            <Button variant="ghost" onClick={() => router.push('/social/profile')}>
              Update Profile Instead
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-yellow-500 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl font-bold">Creator Earnings</h1>
          </div>
          
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-green-700 text-sm font-medium">Total Earnings</p>
                      <p className="text-2xl font-bold text-green-900">
                        {formatCurrency(stats.totalEarnings)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-purple-700 text-sm font-medium">This Month</p>
                      <p className="text-2xl font-bold text-purple-900">
                        {formatCurrency(stats.monthlyEarnings)}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-yellow-700 text-sm font-medium">Average Tip</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {formatCurrency(stats.averageTip)}
                      </p>
                    </div>
                    <Gift className="w-8 h-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {[
            { key: 'overview', label: 'Overview', icon: TrendingUp },
            { key: 'earnings', label: 'Earnings', icon: DollarSign },
            { key: 'content', label: 'Content', icon: Eye },
            { key: 'subscribers', label: 'Subscribers', icon: Users }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  activeTab === tab.key
                    ? 'bg-white text-purple-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'earnings' && renderEarnings()}
        {activeTab === 'content' && (
          <Card>
            <CardContent className="p-12 text-center">
              <Eye className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Management</h3>
              <p className="text-gray-600 mb-6">
                Create and manage your exclusive content to monetize.
              </p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Content
              </Button>
            </CardContent>
          </Card>
        )}
        {activeTab === 'subscribers' && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Manage Subscribers</h3>
              <p className="text-gray-600 mb-6">
                View and manage your subscribers and their subscriptions.
              </p>
              <Button>
                <Settings className="w-4 h-4 mr-2" />
                Subscription Settings
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}