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
  Plus,
  Settings,
  ArrowUpRight,
  Wallet,
  Target,
  Zap,
  ArrowLeft,
  Sparkles,
  Shield,
  Activity
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { PageWrapper } from "@/components/PageWrapper"

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

      const { data: profile } = await supabase
        .from('social_profiles')
        .select('is_creator')
        .eq('id', user.id)
        .single()

      if ((profile as any)?.is_creator) {
        setIsCreator(true)
        await loadCreatorData(user.id)
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadCreatorData = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data: earningsData } = await supabase
        .from('creator_earnings')
        .select(`
          *,
          supporter:social_profiles!creator_earnings_supporter_id_fkey(full_name, avatar_url)
        `)
        .eq('creator_id', userId)
        .order('created_at', { ascending: false })
        .limit(20)

      setEarnings(earningsData || [])

      const totalEarnings = (earningsData || []).filter(e => e.is_completed)
        .reduce((sum, e) => sum + e.amount, 0)

      setStats({
        totalEarnings,
        monthlyEarnings: totalEarnings * 0.4, // Mock
        totalTips: (earningsData || []).filter(e => e.earning_type === 'tip').length,
        totalSubscribers: 12, // Mock
        totalContent: 5, // Mock
        averageTip: totalEarnings / ((earningsData || []).length || 1),
        conversionRate: 4.8
      })
    } catch (error) {
      console.error('Error loading creator data:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} Credits`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050810] flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full mx-auto mb-6"
          />
          <p className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em]">Extracting Revenue Data...</p>
        </div>
      </div>
    )
  }

  if (!isCreator) {
    return (
      <PageWrapper className="min-h-screen bg-[#050810] text-slate-200 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-[#0d1321]/60 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-16 text-center shadow-3xl"
        >
          <div className="w-24 h-24 bg-emerald-600/10 rounded-3xl flex items-center justify-center mx-auto mb-10 border border-emerald-500/20 shadow-3xl group">
            <Crown className="w-12 h-12 text-emerald-500 group-hover:scale-110 transition-transform" />
          </div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-6">Initialize Earnings</h2>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mb-12 leading-relaxed italic">
            YOUR ACCOUNT IS NOT YET SYNCED FOR REVENUE GENERATION. APPLY FOR CREATOR STATUS TO UNLOCK MONETIZATION PROTOCOLS.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="p-8 bg-white/5 rounded-3xl border border-white/5 text-left group hover:border-emerald-500/30 transition-all">
              <Gift className="w-8 h-8 text-pink-500 mb-6" />
              <h3 className="font-black text-white uppercase italic tracking-tighter mb-2">Accept Tips</h3>
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-loose">DIRECT FINANCIAL BURSTS FROM YOUR COLLECTIVE.</p>
            </div>
            <div className="p-8 bg-white/5 rounded-3xl border border-white/5 text-left group hover:border-yellow-500/30 transition-all">
              <Crown className="w-8 h-8 text-yellow-500 mb-6" />
              <h3 className="font-black text-white uppercase italic tracking-tighter mb-2">Elite Syncs</h3>
              <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest leading-loose">ESTABLISH MONTHLY RECURRING REVENUE NODES.</p>
            </div>
          </div>

          <div className="space-y-6">
            <Button className="w-full h-16 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl shadow-emerald-500/20 border-none transition-all">
              <Crown className="w-4 h-4 mr-3" />
              INITIATE APPLICATION
            </Button>
            <Button variant="ghost" onClick={() => router.push('/social/profile')} className="w-full text-slate-500 hover:text-white uppercase font-black tracking-widest text-[9px]">
              CALIBRATE PROFILE
            </Button>
          </div>
        </motion.div>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper className="min-h-screen bg-[#050810] text-slate-200 py-16 px-6 font-sans relative overflow-x-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.15, 0.1] }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-[-10%] right-[-5%] w-[800px] h-[800px] bg-emerald-600/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[150px]"
        />
      </div>

      <div className="container mx-auto max-w-5xl relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16">
          <div className="space-y-4">
            <motion.div whileHover={{ x: -2 }} className="w-fit">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push('/social')}
                className="bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-xl mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                RETURN TO HUB
              </Button>
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter">Revenue Nexus</h1>
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] italic">MONITORING CREATOR MONETIZATION STREAMS & DATA ANALYTICS.</p>
          </div>
          <Button variant="ghost" className="h-14 px-8 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-400 hover:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl">
            <Settings className="w-4 h-4 mr-3" />
            CONFIG_SYSTEM
          </Button>
        </div>

        {/* Top Metrics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-br from-emerald-600/20 to-transparent border border-emerald-500/20 backdrop-blur-3xl rounded-[3rem] p-10 shadow-3xl group"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">TOTAL_UPLINK_VAL</span>
                <DollarSign className="w-8 h-8 text-emerald-500 group-hover:rotate-12 transition-transform" />
              </div>
              <p className="text-4xl font-black text-white italic tracking-tighter mb-2">
                {stats.totalEarnings.toLocaleString()}
              </p>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">LIFETIME CREDIT FRAGMENTS</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-emerald-600/10 to-transparent border border-emerald-500/20 backdrop-blur-3xl rounded-[3rem] p-10 shadow-3xl group"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest italic">CURRENT_MONTH_PULSE</span>
                <TrendingUp className="w-8 h-8 text-emerald-500 group-hover:scale-110 transition-transform" />
              </div>
              <p className="text-4xl font-black text-white italic tracking-tighter mb-2">
                {formatCurrency(stats.monthlyEarnings)}
              </p>
              <span className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/30">
                + 24.5% GROWTH
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-purple-600/10 to-transparent border border-purple-500/20 backdrop-blur-3xl rounded-[3rem] p-10 shadow-3xl group"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest italic">AVG_TRANSACTION_RESONANCE</span>
                <Gift className="w-8 h-8 text-purple-500 group-hover:animate-bounce transition-transform" />
              </div>
              <p className="text-4xl font-black text-white italic tracking-tighter mb-2">
                {formatCurrency(stats.averageTip)}
              </p>
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">PER DATA TRANSMISSION</p>
            </motion.div>
          </div>
        )}

        {/* TAB NAVIATION */}
        <div className="flex items-center gap-2 bg-white/5 p-2 rounded-[2.5rem] border border-white/5 mb-12 h-20 shadow-3xl">
          {[
            { key: 'overview', label: 'OVERVIEW', icon: Activity },
            { key: 'earnings', label: 'CREDIT_LOG', icon: Zap },
            { key: 'content', label: 'MEDIA_ASSETS', icon: Eye },
            { key: 'subscribers', label: 'ELITE_NODES', icon: Users }
          ].map((tab, idx) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 h-full rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 ${activeTab === tab.key ? 'bg-emerald-600 text-white shadow-3xl shadow-emerald-500/30' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <tab.icon size={16} />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Main Content Pane */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-12"
        >
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="bg-[#0d1321]/40 border-white/5 backdrop-blur-3xl rounded-[3rem] p-10 shadow-3xl col-span-1 md:col-span-2">
                <CardHeader className="p-0 mb-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20">
                      <TrendingUp className="h-6 w-6 text-emerald-400" />
                    </div>
                    <CardTitle className="text-xl font-black text-white italic uppercase tracking-tighter">Monetization Protocols</CardTitle>
                  </div>
                </CardHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] group hover:border-blue-500/30 transition-all">
                    <div className="flex items-center justify-between mb-6">
                      <Gift className="w-8 h-8 text-pink-500" />
                      <div className="h-2 w-12 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    </div>
                    <h4 className="font-black text-white uppercase italic tracking-tighter text-xl mb-4">Accept Tips</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 leading-relaxed">ALLOW SUPPORTERS TO INJECT CREDITS DIRECTLY INTO YOUR STREAM.</p>
                    <Button size="sm" className="w-full h-12 bg-white/5 hover:bg-emerald-600 text-white border border-white/10 rounded-xl font-black uppercase text-[9px] tracking-widest">PROTOCOLS_ACTIVE</Button>
                  </div>
                  <div className="p-8 bg-white/5 border border-white/5 rounded-[2.5rem] group hover:border-yellow-500/30 transition-all opacity-60">
                    <Crown className="w-8 h-8 text-yellow-500 mb-6" />
                    <h4 className="font-black text-white uppercase italic tracking-tighter text-xl mb-4">Subscriptions</h4>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-8 leading-relaxed">ESTABLISH RECURRING NEURAL LINKS FOR EXCLUSIVE CONTENT ACCESS.</p>
                    <Button size="sm" variant="ghost" className="w-full h-12 bg-yellow-500/10 hover:bg-yellow-500 text-yellow-500 hover:text-white border border-yellow-500/20 rounded-xl font-black uppercase text-[9px] tracking-widest transition-all">ENABLE_UPLINK</Button>
                  </div>
                </div>
              </Card>

              <div className="space-y-8">
                <Card className="bg-gradient-to-br from-indigo-600/20 to-transparent border-indigo-500/20 backdrop-blur-3xl rounded-[3rem] p-10 shadow-3xl">
                  <CardTitle className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] italic mb-8">REALTIME_CONVERSION</CardTitle>
                  <div className="flex items-end gap-3 mb-2">
                    <span className="text-5xl font-black text-white italic tracking-tighter">{stats?.conversionRate}%</span>
                    <ArrowUpRight className="text-emerald-500 h-8 w-8 mb-2" />
                  </div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">VISITOR TO SUPPORTER RATIO</p>
                </Card>
                <Card className="bg-[#0d1321]/40 border-white/5 backdrop-blur-3xl rounded-[3rem] p-10 shadow-3xl">
                  <CardTitle className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] italic mb-8 text-center">ACTIVE_NODES</CardTitle>
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-4xl font-black text-white italic tracking-tighter">{stats?.totalSubscribers}</div>
                    <p className="text-[9px] font-black text-slate-700 uppercase tracking-widest">TOTAL ELITE CONNECTIONS</p>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="space-y-6">
              {earnings.length === 0 ? (
                <Card className="bg-white/5 border-white/5 rounded-[4rem] p-24 text-center">
                  <Zap className="w-20 h-20 text-slate-800 mx-auto mb-10" />
                  <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">No Transmissions Logged</h3>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">INITIALIZE MONETIZATION MODES TO START BROADCASTING CREDITS.</p>
                </Card>
              ) : (
                earnings.map((earning, idx) => (
                  <motion.div
                    key={earning.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="bg-[#0d1321]/40 border-white/5 backdrop-blur-3xl rounded-[2.5rem] p-8 hover:bg-white/5 hover:border-emerald-500/20 transition-all shadow-3xl group">
                      <div className="flex items-center gap-8">
                        <div className="relative">
                          <img
                            src={earning.supporter.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(earning.supporter.full_name)}&background=050810&color=3b82f6`}
                            alt={earning.supporter.full_name}
                            className="w-16 h-16 rounded-[1.5rem] object-cover border border-white/10 group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute -bottom-1 -right-1 p-2 bg-emerald-600 rounded-lg shadow-xl shrink-0">
                            <DollarSign size={10} className="text-white" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h4 className="font-black text-white uppercase italic tracking-tighter text-lg">
                              {earning.supporter.full_name}
                            </h4>
                            <span className={`px-4 py-1.5 text-[8px] font-black uppercase tracking-widest rounded-full border ${earning.earning_type === 'tip'
                              ? 'bg-pink-500/10 border-pink-500/20 text-pink-400'
                              : 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400'
                              }`}>
                              {earning.earning_type.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                            TRANSMITTED: {new Date(earning.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right space-y-2">
                          <p className="text-3xl font-black text-white italic tracking-tighter">
                            +{formatCurrency(earning.amount)}
                          </p>
                          <div className="flex items-center justify-end gap-2 text-[9px] font-black uppercase tracking-widest">
                            <div className={`h-1.5 w-1.5 rounded-full ${earning.is_completed ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-500'}`} />
                            <span className={earning.is_completed ? 'text-emerald-500' : 'text-yellow-500'}>
                              {earning.is_completed ? 'SYNC_COMPLETE' : 'PENDING_COMMIT'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {activeTab === 'content' && (
            <Card className="bg-white/5 border-white/x backdrop-blur-3xl rounded-[4rem] p-24 text-center">
              <Eye className="w-20 h-20 text-slate-800 mx-auto mb-10" />
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Media Asset Management</h3>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-12 italic">CORE CONTENT FRAGMENTS RESTRICTED TO PAYLOAD SUBSCRIBERS.</p>
              <Button className="h-16 px-12 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl shadow-emerald-500/20 border-none transition-all">
                <Plus className="w-5 h-5 mr-3" />
                DEPLOY_PAYWALL_MEDIA
              </Button>
            </Card>
          )}

          {activeTab === 'subscribers' && (
            <Card className="bg-white/5 border-white/5 backdrop-blur-3xl rounded-[4rem] p-24 text-center">
              <Users className="w-20 h-20 text-slate-800 mx-auto mb-10" />
              <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Elite Node Directory</h3>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-12 italic">MAPPING ACTIVE RECURRING UPLINKS & SESSION DURATION.</p>
              <Button className="h-16 px-12 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-3xl transition-all">
                <Target className="w-5 h-5 mr-3 text-emerald-400" />
                CALIBRATE_SUBSCRIPTION_OFFER
              </Button>
            </Card>
          )}
        </motion.div>
      </div>
    </PageWrapper>
  )
}