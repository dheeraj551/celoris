"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  ArrowLeft,
  Crown,
  Star,
  Check,
  Gift,
  Eye,
  MessageCircle,
  Heart,
  Zap,
  Users,
  Calendar,
  DollarSign
} from "lucide-react"

interface Match {
  id: string
  user: {
    id: string
    username: string
    full_name: string
    bio: string
    avatar_url?: string
    is_creator: boolean
    profession?: string
    social_links?: any
  }
}

interface SubscriptionTier {
  id: string
  name: string
  price: number
  benefits: string[]
  popular?: boolean
  color: string
}

const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'basic',
    name: 'Supporter',
    price: 4.99,
    benefits: [
      'Access to exclusive content',
      'Monthly behind-the-scenes updates',
      'Early access to new content',
      'Direct messaging support'
    ],
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'premium',
    name: 'VIP',
    price: 9.99,
    benefits: [
      'All Supporter benefits',
      'Weekly exclusive content',
      'Priority support and feedback',
      'Monthly Q&A sessions',
      'Discount on digital products'
    ],
    popular: true,
    color: 'from-purple-500 to-purple-600'
  },
  {
    id: 'vip',
    name: 'Ultimate',
    price: 19.99,
    benefits: [
      'All VIP benefits',
      'Daily exclusive content',
      'Personalized content requests',
      'Video calls with creator',
      'Custom merchandise discount',
      'Beta access to new features'
    ],
    color: 'from-yellow-500 to-orange-500'
  }
]

export default function SubscribePage() {
  const [match, setMatch] = useState<Match | null>(null)
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null)
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [existingSubscription, setExistingSubscription] = useState<any>(null)
  const params = useParams()
  const router = useRouter()

  const matchId = params.id as string

  useEffect(() => {
    checkAuthAndLoadMatch()
  }, [matchId])

  const checkAuthAndLoadMatch = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Load match data
      const { data: matchData } = await supabase
        .from('matches')
        .select(`
          *,
          user1:social_profiles!matches_user1_id_fkey(*),
          user2:social_profiles!matches_user2_id_fkey(*)
        `)
        .eq('id', matchId)
        .single()

      if (matchData) {
        const matchWithUsers = matchData as any
        const otherUser = matchWithUsers.user1_id === user.id ? matchWithUsers.user2 : matchWithUsers.user1
        setMatch({ ...matchWithUsers, user: otherUser })

        // Check if user already has a subscription
        const { data: subscription } = await supabase
          .from('creator_subscriptions')
          .select('*')
          .eq('creator_id', otherUser.id)
          .eq('subscriber_id', user.id)
          .eq('is_active', true)
          .single()

        if (subscription) {
          setExistingSubscription(subscription)
        }
      }
    } catch (error) {
      console.error('Error loading match:', error)
    }
  }

  const handleSubscribe = async (tier: SubscriptionTier) => {
    if (!match || !user) return

    setProcessing(true)
    setSelectedTier(tier)
    
    try {
      const supabase = createClient()

      // In a real implementation, you'd integrate with Stripe for subscription billing
      // For now, we'll simulate the subscription process
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create subscription record
      const nextMonth = new Date()
      nextMonth.setMonth(nextMonth.getMonth() + 1)

      const { error } = await (supabase
        .from('creator_subscriptions') as any)
        .upsert({
          creator_id: match.user.id,
          subscriber_id: user.id,
          subscription_tier: tier.id,
          monthly_amount: tier.price,
          next_billing_date: nextMonth.toISOString().split('T')[0]
        })

      if (error) throw error

      setSuccess(true)
      
      // Redirect after success
      setTimeout(() => {
        router.push('/social/matches')
      }, 3000)

    } catch (error) {
      console.error('Error processing subscription:', error)
    } finally {
      setProcessing(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  if (success && selectedTier) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Welcome to {selectedTier.name}! 👑
          </h2>
          <p className="text-gray-600 mb-6">
            You're now subscribed to {match?.user.full_name}'s exclusive content. 
            You'll receive an email confirmation shortly.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex justify-between items-center">
              <span className="font-medium">{selectedTier.name} Subscription</span>
              <span className="font-bold">{formatCurrency(selectedTier.price)}/month</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full"
              onClick={() => router.push(`/social/chat/${matchId}`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Say Hello to {match?.user.full_name}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/social/matches')}
            >
              Back to Matches
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!match) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Match not found</h2>
          <Button onClick={() => router.push('/social/matches')}>
            Back to Matches
          </Button>
        </div>
      </div>
    )
  }

  if (existingSubscription) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6 max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold">Subscription</h1>
          </div>

          {/* Current Subscription */}
          <Card className="mb-6 bg-green-50 border-green-200">
            <CardContent className="p-6 text-center">
              <Crown className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-green-900 mb-2">
                You're already subscribed!
              </h3>
              <p className="text-green-700">
                You're a {existingSubscription.subscription_tier} subscriber to {match.user.full_name}
              </p>
            </CardContent>
          </Card>

          {/* Subscription Benefits */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Your Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {SUBSCRIPTION_TIERS.find(t => t.id === existingSubscription.subscription_tier)?.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button 
              className="w-full"
              onClick={() => router.push(`/social/chat/${matchId}`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message {match.user.full_name}
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => router.push('/social/matches')}
            >
              Back to Matches
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
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Subscribe to {match.user.full_name}</h1>
        </div>

        {/* Creator Profile */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              <img
                src={match.user.avatar_url || `/api/placeholder/80/80`}
                alt={match.user.full_name}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-2xl font-bold text-gray-900">{match.user.full_name}</h2>
                  {match.user.is_creator && (
                    <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                {match.user.profession && (
                  <p className="text-gray-600 mb-3">{match.user.profession}</p>
                )}
                {match.user.bio && (
                  <p className="text-gray-700">{match.user.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Subscribe Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Why Subscribe?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Eye className="w-6 h-6 text-purple-500" />
                </div>
                <h4 className="font-semibold mb-2">Exclusive Content</h4>
                <p className="text-sm text-gray-600">
                  Get access to content that's only available to subscribers
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <MessageCircle className="w-6 h-6 text-blue-500" />
                </div>
                <h4 className="font-semibold mb-2">Direct Access</h4>
                <p className="text-sm text-gray-600">
                  Priority messaging and feedback with the creator
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <Zap className="w-6 h-6 text-yellow-500" />
                </div>
                <h4 className="font-semibold mb-2">Special Perks</h4>
                <p className="text-sm text-gray-600">
                  Early access, discounts, and exclusive events
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Tiers */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-center">Choose Your Tier</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <Card 
                key={tier.id} 
                className={`relative transition-all duration-300 hover:shadow-lg ${
                  tier.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <div className={`w-16 h-16 bg-gradient-to-r ${tier.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Crown className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-3xl font-bold">{formatCurrency(tier.price)}</span>
                    <span className="text-gray-600">/month</span>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handleSubscribe(tier)}
                    disabled={processing && selectedTier?.id === tier.id}
                    className={`w-full ${
                      tier.popular 
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600' 
                        : ''
                    }`}
                  >
                    {processing && selectedTier?.id === tier.id ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4" />
                        Subscribe Now
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Security & Billing */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Secure & Flexible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Cancel Anytime</h4>
                    <p className="text-sm text-gray-600">No long-term commitments</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Secure Payments</h4>
                    <p className="text-sm text-gray-600">Your payment info is encrypted</p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Instant Access</h4>
                    <p className="text-sm text-gray-600">Get content immediately after subscribing</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium">Billing Notifications</h4>
                    <p className="text-sm text-gray-600">Get reminded before each billing cycle</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}