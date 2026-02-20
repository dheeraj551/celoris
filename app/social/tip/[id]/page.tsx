"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { createClient } from "@/lib/supabase-client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Heart,
  Gift,
  Crown,
  Star,
  CreditCard,
  Wallet,
  CheckCircle,
  Users,
  MessageCircle,
  Instagram
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
    is_verified: boolean
    is_premium: boolean
    profession?: string
  }
}

const TIP_AMOUNTS = [5, 10, 25, 50, 100]
const CUSTOM_AMOUNTS = [1, 2, 3, 7, 15, 20]

export default function TipPage() {
  const [match, setMatch] = useState<Match | null>(null)
  const [selectedAmount, setSelectedAmount] = useState<number>(10)
  const [customAmount, setCustomAmount] = useState<string>('')
  const [tipType, setTipType] = useState<'quick' | 'custom'>('quick')
  const [message, setMessage] = useState('')
  const [processing, setProcessing] = useState(false)
  const [success, setSuccess] = useState(false)
  const [user, setUser] = useState<any>(null)
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
      }
    } catch (error) {
      console.error('Error loading match:', error)
    }
  }

  const handleTip = async () => {
    if (!match || !user) return

    const amount = tipType === 'quick' ? selectedAmount : parseFloat(customAmount)
    if (!amount || amount <= 0) return

    setProcessing(true)
    try {
      const supabase = createClient()

      // In a real implementation, you'd integrate with a payment processor like Stripe
      // For now, we'll simulate the payment process

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Record the tip in the database
      const { error } = await (supabase
        .from('creator_earnings') as any)
        .insert({
          creator_id: match.user.id,
          supporter_id: user.id,
          amount: amount,
          currency: 'USD',
          earning_type: 'tip',
          is_completed: true // In real implementation, this would be false until payment confirmed
        })

      if (error) throw error

      setSuccess(true)

      // Redirect after success
      setTimeout(() => {
        router.push('/social/matches')
      }, 3000)

    } catch (error) {
      console.error('Error processing tip:', error)
    } finally {
      setProcessing(false)
    }
  }

  const getTipMessage = (amount: number) => {
    if (amount < 5) return "Thanks for the support! 🙏"
    if (amount < 15) return "You're amazing! Keep creating! 💫"
    if (amount < 30) return "This means so much to me! ❤️"
    return "Thank you so much! You're the best! 🎉"
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <CheckCircle className="w-12 h-12 text-emerald-500" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">
            Tip Sent Successfully! 🎉
          </h2>
          <p className="text-slate-400 mb-8 max-w-sm mx-auto font-medium">
            Thank you for supporting {match?.user.full_name}!
            They'll be notified about your tip.
          </p>
          <div className="space-y-3">
            <Button
              className="w-full h-12 rounded-full font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-500 text-white border-none"
              onClick={() => router.push(`/social/chat/${matchId}`)}
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Send a Message
            </Button>
            <Button
              variant="outline"
              className="w-full h-12 rounded-full font-bold uppercase tracking-wider border-white/10 text-white hover:bg-white/10"
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

  return (
    <div className="min-h-screen bg-[#050810] text-white">
      <div className="container mx-auto px-4 py-8 max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter text-white">Send Tip</h1>
        </div>

        {/* Creator Profile */}
        <Card className="mb-8 bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <img
                src={match.user.avatar_url || `/api/placeholder/60/60`}
                alt={match.user.full_name}
                className="w-20 h-20 rounded-[1rem] object-cover border-2 border-white/10"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-black italic uppercase tracking-tight text-white text-xl">{match.user.full_name}</h3>
                  {match.user.is_verified && (
                    <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {match.user.is_premium && (
                    <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white fill-white" />
                    </div>
                  )}
                </div>
                {match.user.profession && (
                  <p className="text-emerald-400 font-bold uppercase tracking-wider text-xs">{match.user.profession}</p>
                )}
              </div>
            </div>

            {match.user.bio && (
              <p className="text-sm text-slate-400 mt-4 font-medium leading-relaxed">{match.user.bio}</p>
            )}
          </CardContent>
        </Card>

        {/* Tip Type Selection */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTipType('quick')}
            className={`flex-1 py-4 px-4 rounded-xl font-black uppercase tracking-wider text-xs transition-all duration-300 border ${tipType === 'quick'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20'
              : 'bg-[#0d1321]/40 text-slate-400 border-white/5 hover:bg-white/5 hover:text-white'
              }`}
          >
            <Gift className="w-4 h-4 mx-auto mb-2" />
            Quick Tip
          </button>
          <button
            onClick={() => setTipType('custom')}
            className={`flex-1 py-4 px-4 rounded-xl font-black uppercase tracking-wider text-xs transition-all duration-300 border ${tipType === 'custom'
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg shadow-emerald-900/20'
              : 'bg-[#0d1321]/40 text-slate-400 border-white/5 hover:bg-white/5 hover:text-white'
              }`}
          >
            <CreditCard className="w-4 h-4 mx-auto mb-2" />
            Custom Amount
          </button>
        </div>

        {/* Quick Tip Amounts */}
        {tipType === 'quick' && (
          <Card className="mb-6 bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
            <CardContent className="p-6">
              <h4 className="font-bold text-white uppercase tracking-wide text-sm mb-4">Choose an amount</h4>
              <div className="grid grid-cols-3 gap-3">
                {TIP_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`py-4 px-4 rounded-xl border-2 font-black text-lg transition-all duration-300 ${selectedAmount === amount
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-white'
                      }`}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Custom Amount */}
        {tipType === 'custom' && (
          <Card className="mb-6 bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
            <CardContent className="p-6">
              <h4 className="font-bold text-white uppercase tracking-wide text-sm mb-4">Enter custom amount</h4>

              {/* Suggested amounts */}
              <div className="flex flex-wrap gap-2 mb-6">
                {CUSTOM_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setCustomAmount(amount.toString())}
                    className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300 rounded-full hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                  >
                    {amount}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="relative">
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00 Credits"
                  className="w-full px-4 py-4 bg-[#050810] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white font-mono text-lg"
                  min="1"
                  step="0.01"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message */}
        <Card className="mb-6 bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
          <CardContent className="p-6">
            <h4 className="font-bold text-white uppercase tracking-wide text-sm mb-4">Add a message (optional)</h4>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Send a message to ${match.user.full_name}...`}
              className="w-full px-4 py-4 bg-[#050810] border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-slate-300 placeholder:text-slate-600"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-slate-500 mt-2 text-right font-medium">
              {message.length}/200
            </p>
          </CardContent>
        </Card>

        {/* Tip Preview */}
        <Card className="mb-6 bg-emerald-900/10 border-emerald-500/20 backdrop-blur-xl">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <Gift className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-emerald-400 uppercase tracking-wide text-xs mb-1">You're sending:</h4>
                <p className="text-3xl font-black text-white italic tracking-tight">
                  {tipType === 'quick' ? selectedAmount : customAmount || '0'} Credits
                </p>
                {message && (
                  <p className="text-sm text-slate-300 mt-2 italic border-l-2 border-emerald-500/30 pl-3">
                    "{message}"
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mb-8 bg-[#0d1321]/40 border-white/5 backdrop-blur-xl">
          <CardContent className="p-6">
            <h4 className="font-bold text-white uppercase tracking-wide text-sm mb-4">Payment Method</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-4 border border-emerald-500/30 bg-emerald-500/5 rounded-xl">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <div className="flex-1">
                  <p className="font-bold text-white text-sm">Credit Card</p>
                  <p className="text-xs text-slate-400 font-mono mt-1">•••• •••• •••• 1234</p>
                </div>
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Send Tip Button */}
        <Button
          onClick={handleTip}
          disabled={processing || (tipType === 'custom' && (!customAmount || parseFloat(customAmount) <= 0))}
          className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white py-6 text-lg font-black uppercase tracking-wider rounded-full shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 fill-white" />
              Send {tipType === 'quick' ? selectedAmount : customAmount || '0'} Credits Tip
            </div>
          )}
        </Button>

        {/* Security Note */}
        <div className="mt-8 p-6 bg-[#0d1321]/40 border border-white/5 rounded-2xl backdrop-blur-xl">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
            <div className="text-xs text-slate-400">
              <p className="font-bold text-white mb-1 uppercase tracking-wide">Secure Payment</p>
              <p className="leading-relaxed">Your payment information is encrypted and secure. Tips are processed instantly.</p>
            </div>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="mt-8 text-center space-y-4">
          <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">
            Want to support in other ways?
          </p>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="flex-1 border-white/10 text-white hover:bg-white/10 h-12 rounded-full font-bold uppercase tracking-wider text-xs"
              onClick={() => router.push(`/social/chat/${matchId}`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            {match.user.is_creator && (
              <Button
                variant="outline"
                className="flex-1 border-white/10 text-white hover:bg-white/10 h-12 rounded-full font-bold uppercase tracking-wider text-xs"
                onClick={() => router.push(`/social/subscribe/${matchId}`)}
              >
                <Crown className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            )}
          </div>
        </div>
      </div>
    </div >
  )
}