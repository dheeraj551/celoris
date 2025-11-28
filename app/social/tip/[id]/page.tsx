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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Tip Sent Successfully! 🎉
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you for supporting {match?.user.full_name}! 
            They'll be notified about your tip.
          </p>
          <div className="space-y-3">
            <Button 
              className="w-full"
              onClick={() => router.push(`/social/chat/${matchId}`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Send a Message
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

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Send Tip</h1>
        </div>

        {/* Creator Profile */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <img
                src={match.user.avatar_url || `/api/placeholder/60/60`}
                alt={match.user.full_name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900">{match.user.full_name}</h3>
                  {match.user.is_verified && (
                    <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                      <Crown className="w-3 h-3 text-white" />
                    </div>
                  )}
                  {match.user.is_premium && (
                    <div className="w-5 h-5 bg-yellow-500 rounded-full flex items-center justify-center">
                      <Star className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                {match.user.profession && (
                  <p className="text-sm text-gray-600">{match.user.profession}</p>
                )}
              </div>
            </div>
            
            {match.user.bio && (
              <p className="text-sm text-gray-700 mt-4">{match.user.bio}</p>
            )}
          </CardContent>
        </Card>

        {/* Tip Type Selection */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTipType('quick')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              tipType === 'quick'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <Gift className="w-4 h-4 mx-auto mb-1" />
            Quick Tip
          </button>
          <button
            onClick={() => setTipType('custom')}
            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
              tipType === 'custom'
                ? 'bg-purple-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <CreditCard className="w-4 h-4 mx-auto mb-1" />
            Custom Amount
          </button>
        </div>

        {/* Quick Tip Amounts */}
        {tipType === 'quick' && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-4">Choose an amount</h4>
              <div className="grid grid-cols-3 gap-3">
                {TIP_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setSelectedAmount(amount)}
                    className={`py-3 px-4 rounded-lg border-2 font-semibold transition-colors ${
                      selectedAmount === amount
                        ? 'border-purple-500 bg-purple-50 text-purple-700'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Custom Amount */}
        {tipType === 'custom' && (
          <Card className="mb-6">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-4">Enter custom amount</h4>
              
              {/* Suggested amounts */}
              <div className="flex flex-wrap gap-2 mb-4">
                {CUSTOM_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setCustomAmount(amount.toString())}
                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              {/* Custom input */}
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">
                  $
                </span>
                <input
                  type="number"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  min="1"
                  step="0.01"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Message */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-4">Add a message (optional)</h4>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Send a message to ${match.user.full_name}...`}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              rows={3}
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-2 text-right">
              {message.length}/200
            </p>
          </CardContent>
        </Card>

        {/* Tip Preview */}
        <Card className="mb-6 bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <Gift className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-purple-900">You're sending:</h4>
                <p className="text-2xl font-bold text-purple-900">
                  ${tipType === 'quick' ? selectedAmount : customAmount || '0'}
                </p>
                {message && (
                  <p className="text-sm text-purple-700 mt-1">
                    "{message}"
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Method */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <h4 className="font-semibold mb-4">Payment Method</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                <CreditCard className="w-5 h-5 text-gray-600" />
                <div className="flex-1">
                  <p className="font-medium">Credit Card</p>
                  <p className="text-sm text-gray-600">•••• •••• •••• 1234</p>
                </div>
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Send Tip Button */}
        <Button
          onClick={handleTip}
          disabled={processing || (tipType === 'custom' && (!customAmount || parseFloat(customAmount) <= 0))}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white py-4 text-lg font-semibold"
        >
          {processing ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Send ${tipType === 'quick' ? selectedAmount : customAmount || '0'} Tip
            </div>
          )}
        </Button>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
            <div className="text-sm text-gray-600">
              <p className="font-medium text-gray-900 mb-1">Secure Payment</p>
              <p>Your payment information is encrypted and secure. Tips are processed instantly.</p>
            </div>
          </div>
        </div>

        {/* Alternative Actions */}
        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Want to support in other ways?
          </p>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => router.push(`/social/chat/${matchId}`)}
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            {match.user.is_creator && (
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => router.push(`/social/subscribe/${matchId}`)}
              >
                <Crown className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}