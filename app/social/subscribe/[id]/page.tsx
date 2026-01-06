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
    color: 'from-emerald-600 to-teal-600'
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
    color: 'from-teal-500 to-emerald-500'
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
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <Crown className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">
            Welcome to {selectedTier.name}! 👑
          </h2>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto">
            You're now subscribed to {match?.user.full_name}'s exclusive content.
            You'll receive an email confirmation shortly.
          </p>

          <div className="bg-[#0d1321]/40 border border-white/5 backdrop-blur-xl rounded-xl p-6 mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-white uppercase tracking-wider text-sm">{selectedTier.name} Subscription</span>
              <span className="font-black text-emerald-400 text-lg">{formatCurrency(selectedTier.price)}/month</span>
            </div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
              Next billing: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-3">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white border-none h-12 rounded-full font-bold uppercase tracking-wider"
              onClick={() => router.push(`/social/chat/${matchId}`)}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Say Hello to {match?.user.full_name}
            </Button>
            <Button
              variant="outline"
              className="w-full border-white/10 text-white hover:bg-white/10 h-12 rounded-full font-bold uppercase tracking-wider"
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
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-white mb-4">Match not found</h2>
          <Button onClick={() => router.push('/social/matches')} className="bg-emerald-600 hover:bg-emerald-500 text-white border-none rounded-full px-8">
            Back to Matches
          </Button>
        </div>
      </div>
    )
  }

  if (existingSubscription) {
    return (
      <div className="min-h-screen bg-[#050810] text-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
            <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">Subscription</h1>
          </div>

          {/* Current Subscription */}
          <Card className="mb-8 bg-emerald-900/20 border-emerald-500/30 backdrop-blur-xl">
            <CardContent className="p-8 text-center">
              <Crown className="w-16 h-16 text-emerald-500 mx-auto mb-6 drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]" />
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-2">
                You're already subscribed!
              </h3>
              <p className="text-emerald-400 font-medium">
                You're a {existingSubscription.subscription_tier} subscriber to {match.user.full_name}
              </p>
            </CardContent>
          </Card>

          {/* Subscription Benefits */}
          <Card className="mb-8 bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white font-bold uppercase tracking-wide">Your Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {SUBSCRIPTION_TIERS.find(t => t.id === existingSubscription.subscription_tier)?.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-emerald-500" />
                    <span className="text-slate-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white border-none h-12 rounded-full font-bold uppercase tracking-wider"
              onClick={() => router.push(`/social/chat/${matchId}`)}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Message {match.user.full_name}
            </Button>
            <Button
              variant="outline"
              className="w-full border-white/10 text-white hover:bg-white/10 h-12 rounded-full font-bold uppercase tracking-wider"
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
    <div className="min-h-screen bg-[#050810] text-white">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">Subscribe to {match.user.full_name}</h1>
        </div>

        {/* Creator Profile */}
        <Card className="mb-12 bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
          <CardContent className="p-8">
            <div className="flex items-center gap-6">
              <img
                src={match.user.avatar_url || `/api/placeholder/80/80`}
                alt={match.user.full_name}
                className="w-24 h-24 rounded-[1.5rem] object-cover border-2 border-white/10"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-3xl font-black italic uppercase tracking-tight text-white">{match.user.full_name}</h2>
                  {match.user.is_creator && (
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Crown className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                {match.user.profession && (
                  <p className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-4">{match.user.profession}</p>
                )}
                {match.user.bio && (
                  <p className="text-slate-400 font-medium">{match.user.bio}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Why Subscribe Section */}
        <Card className="mb-12 bg-[#0d1321]/40 border-white/5 backdrop-blur-xl shadow-none">
          <CardHeader>
            <CardTitle className="text-white font-black italic uppercase tracking-tighter text-xl">Why Subscribe?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/20">
                  <Eye className="w-6 h-6 text-emerald-500" />
                </div>
                <h4 className="font-bold text-white mb-2 uppercase tracking-wide text-sm">Exclusive Content</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Get access to content that's only available to subscribers
                </p>
              </div>

              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 bg-teal-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-teal-500/20">
                  <MessageCircle className="w-6 h-6 text-teal-400" />
                </div>
                <h4 className="font-bold text-white mb-2 uppercase tracking-wide text-sm">Direct Access</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Priority messaging and feedback with the creator
                </p>
              </div>

              <div className="text-center p-4 rounded-xl bg-white/5 border border-white/5">
                <div className="w-12 h-12 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-500/20">
                  <Zap className="w-6 h-6 text-yellow-400" />
                </div>
                <h4 className="font-bold text-white mb-2 uppercase tracking-wide text-sm">Special Perks</h4>
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                  Early access, discounts, and exclusive events
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Tiers */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white text-center mb-8">Choose Your Tier</h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SUBSCRIPTION_TIERS.map((tier) => (
              <Card
                key={tier.id}
                className={`relative transition-all duration-300 hover:shadow-2xl border-white/5 bg-[#050810]/50 backdrop-blur-xl group hover:scale-105 ${tier.popular ? 'ring-2 ring-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.15)]' : ''
                  }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg">
                      <Star className="w-3 h-3 fill-white" />
                      Most Popular
                    </div>
                  </div>
                )}

                <CardHeader className="text-center pb-4 pt-8">
                  <div className={`w-20 h-20 bg-gradient-to-r ${tier.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-black italic uppercase tracking-tight text-white">{tier.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-black text-white">{formatCurrency(tier.price)}</span>
                    <span className="text-slate-400 font-medium">/mo</span>
                  </div>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {tier.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-slate-300 font-medium">{benefit}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSubscribe(tier)}
                    disabled={processing && selectedTier?.id === tier.id}
                    className={`w-full h-12 rounded-full font-bold uppercase tracking-wider transition-all duration-300 ${tier.popular
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-none shadow-lg shadow-emerald-900/20'
                        : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
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
        <Card className="mt-12 bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
          <CardHeader>
            <CardTitle className="text-white font-black italic uppercase tracking-tighter text-xl">Secure & Flexible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wide text-sm">Cancel Anytime</h4>
                    <p className="text-xs text-slate-400 font-medium">No long-term commitments</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wide text-sm">Secure Payments</h4>
                    <p className="text-xs text-slate-400 font-medium">Your payment info is encrypted</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wide text-sm">Instant Access</h4>
                    <p className="text-xs text-slate-400 font-medium">Get content immediately after subscribing</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-emerald-500 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-white uppercase tracking-wide text-sm">Billing Notifications</h4>
                    <p className="text-xs text-slate-400 font-medium">Get reminded before each billing cycle</p>
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