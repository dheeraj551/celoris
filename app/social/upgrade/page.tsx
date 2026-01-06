"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Crown,
  Heart,
  Zap,
  Video,
  MapPin,
  Shield,
  CheckCircle,
  Star,
  Phone,
  MessageCircle,
  Users,
  Sparkles
} from "lucide-react"

export default function SocialUpgradePage() {
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'pro'>('premium')

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Load user profile
      const { data: profile } = await supabase
        .from('users')
        .select('subscription_status')
        .eq('id', user.id)
        .single()

      setProfile(profile)

    } catch (error) {
      console.error('Error checking auth:', error)
    } finally {
      setLoading(false)
    }
  }

  const router = useRouter()

  const premiumFeatures = [
    {
      icon: Heart,
      title: "Unlimited Likes",
      description: "Swipe without limits and never miss a potential connection",
      free: false
    },
    {
      icon: Zap,
      title: "Super Likes",
      description: "Stand out with Super Likes and increase your match rate by 3x",
      free: false
    },
    {
      icon: Video,
      title: "Video Calls",
      description: "Face-to-face conversations with unlimited video calling",
      free: false
    },
    {
      icon: MapPin,
      title: "Passport",
      description: "Swipe and match with people from any location worldwide",
      free: false
    },
    {
      icon: Shield,
      title: "See Who Likes You",
      description: "View all users who have liked your profile before deciding",
      free: false
    },
    {
      icon: Phone,
      title: "Priority Support",
      description: "Get faster response times and dedicated customer support",
      free: false
    },
    {
      icon: MessageCircle,
      title: "Priority Messages",
      description: "Your messages get delivered first in chat queues",
      free: false
    },
    {
      icon: Users,
      title: "Creator Badge",
      description: "Special verification badge to show your professional status",
      free: true
    }
  ]

  const plans = {
    premium: {
      name: "Premium",
      price: "$9.99",
      period: "/month",
      description: "Perfect for regular users who want to connect more",
      color: "from-emerald-500 to-teal-500",
      popular: false,
      features: [
        "Unlimited likes and super likes",
        "See who likes you",
        "Video calls (limited)",
        "Rewind feature",
        "Priority support",
        "Creator badge"
      ]
    },
    pro: {
      name: "Pro",
      price: "$19.99",
      period: "/month",
      description: "For serious creators and professionals",
      color: "from-yellow-500 to-orange-500",
      popular: true,
      features: [
        "Everything in Premium",
        "Unlimited video calls",
        "Passport feature",
        "Boost profile 5x per month",
        "Advanced analytics",
        "Direct Instagram integration",
        "Priority placement in search",
        "Custom profile themes"
      ]
    }
  }

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Digital Artist",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      text: "Premium helped me connect with amazing collaborators. The Super Like feature is a game-changer!",
      plan: "Premium"
    },
    {
      name: "Mike Rodriguez",
      role: "Startup Founder",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      text: "Pro plan gave me access to serious professionals. I've hired 3 people through this platform!",
      plan: "Pro"
    },
    {
      name: "Emma Davis",
      role: "UX Designer",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      text: "The video calling feature helped me close deals and build real relationships with clients.",
      plan: "Pro"
    }
  ]

  const handleUpgrade = async (planType: 'premium' | 'pro') => {
    // In production, this would integrate with Stripe/PayPal
    alert(`Upgrade to ${plans[planType].name} feature coming soon! You'll be redirected to payment processing.`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (profile?.subscription_status === 'premium' || profile?.subscription_status === 'pro') {
    return (
      <div className="min-h-screen bg-[#050810] py-8">
        <div className="container max-w-4xl mx-auto px-4 text-center">
          <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <Crown className="h-12 w-12 text-yellow-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">You're Already Premium!</h1>
          <p className="text-xl text-slate-400 mb-8">
            You're currently on the {profile.subscription_status} plan. Enjoy all your premium features!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-emerald-600 hover:bg-emerald-500 text-white">
              <a href="/social/swipe">Start Swiping</a>
            </Button>
            <Button variant="outline" size="lg" asChild className="border-white/10 text-white hover:bg-white/10">
              <a href="/social/profile">Manage Profile</a>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050810]">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-900 via-teal-900 to-[#050810] text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
        <div className="container text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
              <Crown className="h-10 w-10 text-emerald-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-6">
              Unlock Premium Features
            </h1>
            <p className="text-xl mb-8 text-emerald-100/70 font-medium">
              Take your social networking to the next level with premium features
              designed for serious creators and professionals.
            </p>

            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5" />
                <span>30-day money back</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20 bg-[#0d1321]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white mb-4">
              Choose Your Plan
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Select the plan that best fits your networking goals and start connecting with premium features.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {Object.entries(plans).map(([key, plan]) => (
              <Card
                key={key}
                className={`relative overflow-hidden transition-all hover:shadow-2xl hover:scale-105 border-white/5 bg-[#050810]/50 backdrop-blur-xl ${plan.popular ? 'ring-2 ring-emerald-500' : ''
                  }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-center py-2 text-sm font-medium">
                    <Star className="h-4 w-4 inline mr-1" />
                    Most Popular
                  </div>
                )}

                <CardHeader className={`text-center ${plan.popular ? 'pt-12' : ''}`}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${plan.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-black uppercase tracking-tight text-white">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-black text-white">{plan.price}</span>
                    <span className="text-slate-400">{plan.period}</span>
                  </div>
                  <CardDescription className="mt-2 text-slate-400">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full ${plan.popular
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white border-none'
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
                      }`}
                    size="lg"
                    onClick={() => handleUpgrade(key as 'premium' | 'pro')}
                  >
                    <Sparkles className="mr-2 h-5 w-5" />
                    Upgrade to {plan.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="mt-20">
            <h3 className="text-2xl font-black italic uppercase tracking-tighter text-white text-center mb-12">
              Compare All Features
            </h3>

            <div className="max-w-4xl mx-auto">
              <Card className="bg-[#050810]/50 border-white/5 backdrop-blur-xl">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-white/10">
                          <th className="text-left p-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Features</th>
                          <th className="text-center p-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Free</th>
                          <th className="text-center p-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Premium</th>
                          <th className="text-center p-4 font-black uppercase tracking-widest text-[10px] text-slate-400">Pro</th>
                        </tr>
                      </thead>
                      <tbody>
                        {premiumFeatures.map((feature, index) => (
                          <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                            <td className="p-4">
                              <div className="flex items-center space-x-3">
                                <feature.icon className="h-5 w-5 text-emerald-500" />
                                <div>
                                  <div className="font-bold text-white text-sm">{feature.title}</div>
                                  <div className="text-xs text-slate-500">{feature.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              {feature.free ? (
                                <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              {!feature.free ? (
                                <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />
                              ) : (
                                <span className="text-slate-600">-</span>
                              )}
                            </td>
                            <td className="p-4 text-center">
                              <CheckCircle className="h-5 w-5 text-emerald-500 mx-auto" />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#050810]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white mb-4">
              What Our Premium Users Say
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              Join thousands of creators and professionals who've transformed their networking with Celoris Premium.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="card-hover bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <img
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover border border-white/10"
                    />
                    <div>
                      <div className="font-bold text-white text-sm">{testimonial.name}</div>
                      <div className="text-xs text-slate-500 font-black uppercase tracking-widest">{testimonial.role}</div>
                      <div className="flex items-center space-x-1 mt-1">
                        <Crown className="h-3 w-3 text-emerald-500" />
                        <span className="text-xs text-emerald-500 font-medium">{testimonial.plan}</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-400 italic text-sm">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-[#0d1321]">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="bg-[#050810]/50 border-white/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-white mb-2">Can I cancel anytime?</h3>
                <p className="text-slate-400 text-sm">Yes! You can cancel your subscription at any time. You'll continue to have access to premium features until the end of your billing period.</p>
              </CardContent>
            </Card>

            <Card className="bg-[#050810]/50 border-white/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-white mb-2">Do you offer refunds?</h3>
                <p className="text-slate-400 text-sm">We offer a 30-day money-back guarantee. If you're not satisfied with your premium experience, contact our support team for a full refund.</p>
              </CardContent>
            </Card>

            <Card className="bg-[#050810]/50 border-white/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-white mb-2">What's the difference between plans?</h3>
                <p className="text-slate-400 text-sm">Premium includes unlimited likes, Super Likes, and video calls. Pro adds unlimited video calls, Passport feature, profile boosts, and advanced analytics for serious users.</p>
              </CardContent>
            </Card>

            <Card className="bg-[#050810]/50 border-white/5">
              <CardContent className="p-6">
                <h3 className="font-bold text-white mb-2">Is my payment information secure?</h3>
                <p className="text-slate-400 text-sm">Absolutely. We use industry-standard encryption and work with trusted payment processors like Stripe to ensure your payment information is always secure.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-[#00120d] border-t border-white/5 text-white">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter mb-6">
            Ready to Connect Like a Pro?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-emerald-100/70">
            Join the community of creators and professionals who are building meaningful
            connections and growing their networks with Celoris Premium.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-500 text-white border-none" onClick={() => handleUpgrade('premium')}>
              <Crown className="mr-2 h-5 w-5" />
              Start Free Trial
            </Button>
            <Button variant="outline" size="lg" className="border-white/10 text-white hover:bg-white/10" asChild>
              <a href="/social">Learn More</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
