"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Sparkles,
  Rocket,
  Wallet,
  TrendingUp,
  BarChart3,
  SlidersHorizontal,
  CheckCircle2,
  X,
  Play,
  Award,
  Users,
  Compass,
  ArrowRight,
  Send,
  Zap,
  Globe,
  Plus,
  Coins,
  ChevronRight,
  ShieldCheck,
  Eye,
  Target,
} from "lucide-react"

// Initial Seed Posts (Realistic Indian creator & student content)
interface PostComment {
  id: string
  author: string
  avatar: string
  text: string
  timeAgo: string
  isAI?: boolean
  personaTag?: string
}

interface SocialPost {
  id: string
  authorName: string
  authorRole: string
  authorAvatar: string
  batchPill?: string
  timeAgo: string
  content: string
  hook?: string
  mediaUrl?: string
  mediaType?: "image" | "video"
  isSponsored?: boolean
  campaignData?: {
    objective: string
    dailyBudget: number
    cpc: string
    ctr: string
    impressions: number
    clicks: number
    leads: number
  }
  likes: number
  hasLiked?: boolean
  comments: PostComment[]
  shares: number
}

interface ActiveCampaign {
  id: string
  postId: string
  postTitle: string
  objective: string
  dailyBudget: number
  spent: number
  status: "Active" | "Paused"
  impressions: number
  clicks: number
  cpc: string
  ctr: string
  leads: number
}

const INITIAL_POSTS: SocialPost[] = [
  {
    id: "post-1",
    authorName: "Dheeraj Kushwaha",
    authorRole: "Lead Trainer · Performance Marketing",
    authorAvatar: "/courses/digital-marketing-mastery-og.jpg",
    batchPill: "Verified Trainer",
    timeAgo: "25m ago",
    content: "Notice how the top 1% of D2C ads in India don't start with product features? They start with an immediate friction point: 'Stop spending ₹15k on basic reels'. The moment you call out a hidden cost, your CTR shoots past 2.4%. Here is the live teardown for Batch #43 students 👇",
    hook: "Stop spending ₹15,000 on basic reels",
    mediaUrl: "/courses/digital-marketing-mastery-og.jpg",
    mediaType: "image",
    isSponsored: true,
    campaignData: {
      objective: "WhatsApp Leads",
      dailyBudget: 500,
      cpc: "₹6.40",
      ctr: "2.85%",
      impressions: 4820,
      clicks: 137,
      leads: 18,
    },
    likes: 42,
    hasLiked: false,
    comments: [
      {
        id: "c-1",
        author: "Pooja Sharma (Jaipur)",
        avatar: "P",
        text: "Sir tried this hook in our local bakery ad, CPC literally dropped from ₹18 to ₹7.20 in just 2 days! 🚀",
        timeAgo: "18m ago",
      },
      {
        id: "c-2",
        author: "Aman Verma (Delhi)",
        avatar: "A",
        text: "Will this framework work for B2B consulting services as well?",
        timeAgo: "10m ago",
      },
    ],
    shares: 14,
  },
  {
    id: "post-2",
    authorName: "Ananya Jairath",
    authorRole: "Reels & Shorts Creator Lead",
    authorAvatar: "/free-courses/social-media-reels.jpg",
    batchPill: "Verified Trainer",
    timeAgo: "1h ago",
    content: "A quick reminder for Batch 05 students filming their 3-Reel portfolio: You don't need an iPhone or studio ring lights! Natural window light placed at 45 degrees + a ₹200 lapel collar mic gives cleaner audio than a ₹40k camera in an echoey room. Keep shooting!",
    hook: "You don't need a ₹40,000 camera to go viral",
    mediaUrl: "/free-courses/social-media-reels.jpg",
    mediaType: "image",
    isSponsored: false,
    likes: 58,
    hasLiked: false,
    comments: [
      {
        id: "c-3",
        author: "Rohan Patel (Ahmedabad)",
        avatar: "R",
        text: "Mam using the window light trick today for my fitness reel edit. Pacing is 1.4s per cut!",
        timeAgo: "40m ago",
      },
    ],
    shares: 19,
  },
  {
    id: "post-3",
    authorName: "Karan Singhania",
    authorRole: "Student · Batch #43 Digital Marketing",
    authorAvatar: "K",
    batchPill: "Student Creator",
    timeAgo: "2h ago",
    content: "Ran my first virtual Meta Ad campaign in the Celoris Sandbox with ₹500 credits! Targeted college students in Delhi for an online guitar coaching gig. Here is the ad creative I made in Canva. Let me know what you guys think of the headline!",
    hook: "Learn 3 Bollywood songs on Guitar in 7 Days (No Music Theory)",
    isSponsored: false,
    likes: 27,
    hasLiked: false,
    comments: [
      {
        id: "c-4",
        author: "The Algorithm Bot",
        avatar: "🤖",
        text: "Solid direct hook: 7 Days timeframe creates urgency. Estimated CTR: 2.1%.",
        timeAgo: "1h ago",
        isAI: true,
      },
      {
        id: "c-5",
        author: "Neha Kapoor (Indore)",
        avatar: "N",
        text: "Headline is super catchy Karan! You should boost this post to see simulated CPC.",
        timeAgo: "45m ago",
      },
    ],
    shares: 6,
  },
]

export default function CelorisSocialPage() {
  const [activeTab, setActiveTab] = useState<"feed" | "ads">("feed")
  const [walletBalance, setWalletBalance] = useState<number>(10000)
  const [posts, setPosts] = useState<SocialPost[]>(INITIAL_POSTS)
  const [campaigns, setCampaigns] = useState<ActiveCampaign[]>([
    {
      id: "camp-1",
      postId: "post-1",
      postTitle: "Stop spending ₹15,000 on basic reels",
      objective: "WhatsApp Leads",
      dailyBudget: 500,
      spent: 500,
      status: "Active",
      impressions: 4820,
      clicks: 137,
      cpc: "₹6.40",
      ctr: "2.85%",
      leads: 18,
    },
  ])

  // New Post State
  const [newPostContent, setNewPostContent] = useState("")
  const [newPostHook, setNewPostHook] = useState("")
  const [isPosting, setIsPosting] = useState(false)

  // Quick Boost Modal State
  const [boostingPost, setBoostingPost] = useState<SocialPost | null>(null)
  const [boostBudget, setBoostBudget] = useState(500)
  const [boostObjective, setBoostObjective] = useState<"leads" | "traffic" | "brand">("leads")
  const [selectedCities, setSelectedCities] = useState<string[]>(["Delhi NCR", "Mumbai", "Jaipur"])
  const [isSimulating, setIsSimulating] = useState(false)
  const [boostSuccessNotice, setBoostSuccessNotice] = useState<string | null>(null)

  // Active Comment Drawer State
  const [openCommentsPostId, setOpenCommentsPostId] = useState<string | null>(null)
  const [commentInput, setCommentInput] = useState("")

  // Load wallet from LocalStorage if available
  useEffect(() => {
    try {
      const savedWallet = localStorage.getItem("celoris_social_wallet")
      if (savedWallet) setWalletBalance(Number(savedWallet))
    } catch {}
  }, [])

  const updateWallet = (newBal: number) => {
    setWalletBalance(newBal)
    try {
      localStorage.setItem("celoris_social_wallet", String(newBal))
    } catch {}
  }

  // Handle Like
  const toggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const liked = !p.hasLiked
          return {
            ...p,
            hasLiked: liked,
            likes: liked ? p.likes + 1 : Math.max(0, p.likes - 1),
          }
        }
        return p
      })
    )
  }

  // Handle Add Comment
  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return
    const newComment: PostComment = {
      id: `c-user-${Date.now()}`,
      author: "You (Student)",
      avatar: "Y",
      text: commentInput.trim(),
      timeAgo: "Just now",
    }
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...p.comments, newComment],
          }
        }
        return p
      })
    )
    setCommentInput("")
  }

  // Handle Create Post
  const handleCreatePost = () => {
    if (!newPostContent.trim()) return
    setIsPosting(true)

    const newPost: SocialPost = {
      id: `post-${Date.now()}`,
      authorName: "You (Student Creator)",
      authorRole: "Student · Celoris Creator Studio",
      authorAvatar: "Y",
      batchPill: "Live Cohort",
      timeAgo: "Just now",
      content: newPostContent.trim(),
      hook: newPostHook.trim() || newPostContent.trim().slice(0, 45) + "...",
      isSponsored: false,
      likes: 1,
      hasLiked: true,
      comments: [
        {
          id: `c-bot-${Date.now()}`,
          author: "The Algorithm Bot",
          avatar: "🤖",
          text: "Post published to community feed. Tap 'Boost Post' to run a simulated Meta ad with your ₹10,000 wallet credits!",
          timeAgo: "Just now",
          isAI: true,
        },
      ],
      shares: 0,
    }

    setTimeout(() => {
      setPosts([newPost, ...posts])
      setNewPostContent("")
      setNewPostHook("")
      setIsPosting(false)
    }, 400)
  }

  // Handle Quick Boost Execution (Calls Gemini 3.8 Flash Engine)
  const handleLaunchBoost = async () => {
    if (!boostingPost) return
    if (walletBalance < boostBudget) {
      alert("Insufficient virtual wallet balance! Reset your wallet in the Ads Manager.")
      return
    }

    setIsSimulating(true)

    try {
      const res = await fetch("/api/social/simulate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hook: boostingPost.hook || boostingPost.content.slice(0, 50),
          caption: boostingPost.content,
          objective: boostObjective,
          targetAudience: {
            cities: selectedCities,
            ageRange: "18-28",
            niche: "Gen-Z & Career Upskilling",
          },
          budget: boostBudget,
        }),
      })

      const data = await res.json()
      const sim = data?.data

      // Deduct Wallet
      const newBal = walletBalance - boostBudget
      updateWallet(newBal)

      // Format AI simulated comments
      const aiComments: PostComment[] = (sim?.simulated_audience_feed || []).map(
        (persona: any, idx: number) => ({
          id: `ai-sim-${Date.now()}-${idx}`,
          author: persona.persona_name,
          avatar: persona.avatar_initial || "P",
          text: persona.comment_text,
          timeAgo: `${idx + 1}m ago`,
          isAI: true,
          personaTag: persona.sentiment,
        })
      )

      // Update the boosted post in feed
      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === boostingPost.id) {
            return {
              ...p,
              isSponsored: true,
              campaignData: {
                objective: boostObjective === "leads" ? "WhatsApp Leads" : "Website Traffic",
                dailyBudget: boostBudget,
                cpc: sim?.estimated_cpc || "₹7.20",
                ctr: sim?.estimated_ctr || "2.10%",
                impressions: sim?.estimated_impressions || 3400,
                clicks: sim?.estimated_clicks || 75,
                leads: sim?.estimated_leads || 8,
              },
              comments: [...p.comments, ...aiComments],
            }
          }
          return p
        })
      )

      // Add to Campaigns list
      const newCamp: ActiveCampaign = {
        id: `camp-${Date.now()}`,
        postId: boostingPost.id,
        postTitle: boostingPost.hook || boostingPost.content.slice(0, 35) + "...",
        objective: boostObjective === "leads" ? "WhatsApp Leads" : "Traffic",
        dailyBudget: boostBudget,
        spent: boostBudget,
        status: "Active",
        impressions: sim?.estimated_impressions || 3400,
        clicks: sim?.estimated_clicks || 75,
        cpc: sim?.estimated_cpc || "₹7.20",
        ctr: sim?.estimated_ctr || "2.10%",
        leads: sim?.estimated_leads || 8,
      }
      setCampaigns([newCamp, ...campaigns])

      setBoostSuccessNotice(
        `Campaign Launched! Spent ₹${boostBudget} from your virtual wallet. Simulated ${sim?.estimated_impressions || 3400} impressions & ${sim?.estimated_leads || 8} leads generated!`
      )
      setBoostingPost(null)
    } catch (err) {
      console.error("Boost failed:", err)
      alert("Failed to run ad simulation. Please try again.")
    } finally {
      setIsSimulating(false)
    }
  }

  // Toggle city in target selector
  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    )
  }

  // Reset Wallet Credits
  const handleResetWallet = () => {
    updateWallet(10000)
    alert("Virtual Ad Spend Wallet reset to ₹10,000 credits!")
  }

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30">
      {/* Top Floating App Bar */}
      <header className="sticky top-0 z-40 bg-[#07090e]/90 backdrop-blur-xl border-b border-white/[0.08] px-4 py-3">
        <div className="max-w-xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Live Status */}
          <Link href="/social" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-base shadow-sm group-hover:scale-105 transition-transform">
              C
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <span className="font-extrabold text-white text-sm tracking-tight">Celoris Social</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 font-mono">Creator Sandbox · India</span>
            </div>
          </Link>

          {/* Virtual Wallet Pill */}
          <div className="flex items-center gap-2">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold shadow-xs cursor-pointer hover:bg-emerald-500/20 transition-all"
              onClick={() => setActiveTab("ads")}
              title="Your Virtual Ad Spend Wallet (Click to manage)"
            >
              <Coins className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>₹{walletBalance.toLocaleString("en-IN")}</span>
              <span className="text-[9px] uppercase tracking-wider text-emerald-400/80 hidden sm:inline">Credits</span>
            </div>

            {/* Back to Home Link */}
            <Link
              href="/free-courses-with-certificate"
              className="p-1.5 rounded-xl border border-white/10 bg-white/[0.03] text-neutral-400 hover:text-white transition-colors"
              title="Free Courses Hub"
            >
              <Compass className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tab Switcher: Community Feed vs Ads Manager (Meta Studio) */}
        <div className="max-w-xl mx-auto mt-2.5 flex items-center justify-center border-t border-white/[0.06] pt-2">
          <div className="grid grid-cols-2 w-full p-0.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-mono font-semibold">
            <button
              onClick={() => setActiveTab("feed")}
              className={`py-1.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === "feed"
                  ? "bg-white/[0.1] text-white shadow-xs font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>Community Feed</span>
            </button>
            <button
              onClick={() => setActiveTab("ads")}
              className={`py-1.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${
                activeTab === "ads"
                  ? "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-300 border border-emerald-500/40 shadow-xs font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Meta Ads Manager</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Single-Column Stream */}
      <main className="flex-1 max-w-xl w-full mx-auto px-3.5 py-4 pb-24">
        {/* Success Alert Banner if ad launched */}
        <AnimatePresence>
          {boostSuccessNotice && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-mono shadow-md"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{boostSuccessNotice}</span>
              </div>
              <button
                onClick={() => setBoostSuccessNotice(null)}
                className="text-emerald-400 hover:text-white p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === "feed" ? (
          <div>
            {/* Live Cohort Story Bubbles */}
            <section className="mb-4 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
              {[
                { label: "Batch #43", title: "Digital Marketing", live: true, avatar: "D" },
                { label: "Batch 05", title: "Reels Studio", live: true, avatar: "A" },
                { label: "Viral Hooks", title: "Top 1%", live: false, avatar: "⚡" },
                { label: "₹10k Ads Club", title: "Sandbox", live: false, avatar: "💰" },
              ].map((story, i) => (
                <div
                  key={story.label}
                  className="flex flex-col items-center gap-1 shrink-0 cursor-pointer group"
                >
                  <div
                    className={`w-14 h-14 rounded-full p-0.5 flex items-center justify-center transition-transform group-hover:scale-105 ${
                      story.live
                        ? "bg-gradient-to-tr from-emerald-500 via-amber-400 to-teal-400 ring-2 ring-emerald-500/30"
                        : "bg-white/10"
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-[#0d121c] flex items-center justify-center font-bold text-sm text-white font-mono">
                      {story.avatar}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-medium text-neutral-300 truncate max-w-[64px]">
                    {story.label}
                  </span>
                </div>
              ))}
            </section>

            {/* Create Post Composer */}
            <div className="mb-5 rounded-2xl border border-white/[0.08] bg-[#0c1018]/90 p-3.5 backdrop-blur-xl shadow-lg">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-slate-950 font-black flex items-center justify-center text-sm font-mono shrink-0 shadow-xs">
                  Y
                </div>
                <div className="flex-1">
                  <input
                    type="text"
                    value={newPostHook}
                    onChange={(e) => setNewPostHook(e.target.value)}
                    placeholder="🔥 Opening Hook (e.g. 'Stop spending ₹15k on basic reels')"
                    className="w-full bg-transparent text-xs sm:text-sm font-semibold text-white placeholder:text-neutral-500 focus:outline-none mb-1.5"
                  />
                  <textarea
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder="Write your ad caption or reel script... share with your batch!"
                    rows={2}
                    className="w-full bg-transparent text-xs text-neutral-300 placeholder:text-neutral-600 focus:outline-none resize-none leading-relaxed"
                  />
                </div>
              </div>

              <div className="mt-2.5 pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 text-[11px] font-mono text-neutral-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Practice with ₹{walletBalance.toLocaleString("en-IN")} ad credits</span>
                </div>

                <button
                  type="button"
                  disabled={!newPostContent.trim() || isPosting}
                  onClick={handleCreatePost}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs uppercase tracking-wider font-mono shadow-md disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isPosting ? "Publishing..." : "Post to Batch"}</span>
                </button>
              </div>
            </div>

            {/* Posts Stream */}
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="rounded-3xl border border-white/[0.08] bg-[#0c1018]/95 overflow-hidden shadow-xl backdrop-blur-xl hover:border-white/[0.14] transition-colors"
                >
                  {/* Post Header */}
                  <div className="p-4 pb-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-2xl bg-[#141b29] border border-white/[0.08] overflow-hidden flex items-center justify-center font-bold text-emerald-400 font-mono text-base shrink-0">
                        {post.authorAvatar.startsWith("/") ? (
                          <img
                            src={post.authorAvatar}
                            alt={post.authorName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          post.authorAvatar
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h4 className="font-bold text-white text-xs sm:text-sm tracking-tight leading-none">
                            {post.authorName}
                          </h4>
                          {post.batchPill && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-[9px] font-mono text-neutral-300">
                              {post.batchPill}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-neutral-400 font-mono mt-0.5">
                          {post.authorRole} · {post.timeAgo}
                        </p>
                      </div>
                    </div>

                    {/* Sponsored Ad Badge Indicator */}
                    {post.isSponsored && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-[10px] font-bold uppercase tracking-wider shrink-0 shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span>Sponsored</span>
                      </div>
                    )}
                  </div>

                  {/* Post Body & Hook */}
                  <div className="px-4 pb-3">
                    {post.hook && (
                      <div className="mb-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs font-semibold text-emerald-300 font-mono">
                        🔥 Hook: &ldquo;{post.hook}&rdquo;
                      </div>
                    )}
                    <p className="text-xs sm:text-sm text-neutral-200 leading-relaxed whitespace-pre-line">
                      {post.content}
                    </p>
                  </div>

                  {/* Media Viewport */}
                  {post.mediaUrl && (
                    <div className="relative aspect-[16/9] w-full bg-black/60 overflow-hidden border-y border-white/[0.06]">
                      <img
                        src={post.mediaUrl}
                        alt="Creative Preview"
                        className="w-full h-full object-cover"
                      />
                      {post.isSponsored && post.campaignData && (
                        <div className="absolute bottom-2.5 right-2.5 flex items-center gap-2">
                          <span className="px-2 py-1 rounded-lg bg-black/80 backdrop-blur-md text-[10px] font-mono font-bold text-emerald-400 border border-emerald-500/30">
                            CTR: {post.campaignData.ctr} · CPC: {post.campaignData.cpc}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Ad CTA Button if Sponsored */}
                  {post.isSponsored && (
                    <div className="p-3 bg-gradient-to-r from-amber-500/10 via-transparent to-amber-500/5 border-b border-white/[0.06] flex items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-mono text-amber-300 block">
                          Simulated Meta Ad Campaign
                        </span>
                        <span className="text-xs font-bold text-white">
                          {post.campaignData?.objective || "WhatsApp Leads"} · {post.campaignData?.leads || 12} Leads Generated
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert(`Simulated Ad Click! In real Meta ads, this triggers a direct WhatsApp chat or lead form.`)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold font-mono tracking-wider transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        Apply / Chat →
                      </button>
                    </div>
                  )}

                  {/* Action Bar */}
                  <div className="px-4 py-2.5 flex items-center justify-between gap-2 text-xs font-mono">
                    <div className="flex items-center gap-3">
                      {/* Like Button */}
                      <button
                        type="button"
                        onClick={() => toggleLike(post.id)}
                        className={`flex items-center gap-1.5 transition-all active:scale-125 ${
                          post.hasLiked ? "text-rose-400 font-bold" : "text-neutral-400 hover:text-white"
                        }`}
                      >
                        <Heart
                          className={`w-4 h-4 ${post.hasLiked ? "fill-rose-400 text-rose-400" : ""}`}
                        />
                        <span>{post.likes}</span>
                      </button>

                      {/* Comment Toggle */}
                      <button
                        type="button"
                        onClick={() =>
                          setOpenCommentsPostId(openCommentsPostId === post.id ? null : post.id)
                        }
                        className="flex items-center gap-1.5 text-neutral-400 hover:text-white transition-colors"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments.length}</span>
                      </button>

                      {/* Share */}
                      <button
                        type="button"
                        onClick={() => {
                          const url = `${window.location.origin}/social`
                          navigator.clipboard?.writeText(url)
                          alert("Link copied! Share with your batch partner.")
                        }}
                        className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
                        title="Share post"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>{post.shares}</span>
                      </button>
                    </div>

                    {/* Boost Post Button (Option 2A Quick Boost) */}
                    {!post.isSponsored && (
                      <button
                        type="button"
                        onClick={() => setBoostingPost(post)}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 text-xs font-bold transition-all hover:scale-105 active:scale-95 shadow-xs"
                      >
                        <Rocket className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Boost Post</span>
                      </button>
                    )}
                  </div>

                  {/* Expandable Comments Drawer */}
                  <AnimatePresence>
                    {openCommentsPostId === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-white/[0.06] bg-black/40 p-4 space-y-3"
                      >
                        <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex items-start gap-2.5 text-xs">
                              <div className="w-6 h-6 rounded-lg bg-[#141b29] border border-white/10 flex items-center justify-center font-mono font-bold text-emerald-400 text-[10px] shrink-0">
                                {comment.avatar}
                              </div>
                              <div className="flex-1 bg-white/[0.02] border border-white/[0.04] p-2 rounded-xl">
                                <div className="flex items-center justify-between gap-1 mb-0.5">
                                  <span className="font-bold text-white text-[11px]">
                                    {comment.author}
                                  </span>
                                  {comment.isAI && (
                                    <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.2 rounded-md">
                                      Simulated Audience
                                    </span>
                                  )}
                                </div>
                                <p className="text-neutral-300 text-xs leading-relaxed">
                                  {comment.text}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Comment Input */}
                        <div className="pt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                            placeholder="Write a supportive reply or feedback..."
                            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-emerald-500/40"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddComment(post.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs font-mono hover:bg-emerald-400 transition-colors"
                          >
                            Reply
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              ))}
            </div>
          </div>
        ) : (
          /* Dedicated Ads Manager (Option 2B) */
          <div className="space-y-5">
            {/* Wallet Overview & Telemetry Cards */}
            <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-500/[0.08] via-[#0c1018] to-[#0c1018] p-5 sm:p-6 backdrop-blur-xl shadow-xl">
              <div className="flex items-center justify-between gap-3 mb-4 flex-wrap">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 block">
                    Meta Ad Practice Sandbox
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Virtual Ad Spend Wallet
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={handleResetWallet}
                  className="px-3 py-1.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/[0.04] text-xs font-mono text-neutral-300 hover:text-white transition-all"
                >
                  Reset ₹10k Credits
                </button>
              </div>

              {/* Balance Big Card */}
              <div className="p-4 rounded-2xl bg-black/40 border border-white/[0.08] flex items-center justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs font-mono text-neutral-400 block">Remaining Credits</span>
                  <span className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono tracking-tight">
                    ₹{walletBalance.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono text-neutral-400 block">Active Campaigns</span>
                  <span className="text-2xl font-black text-white font-mono">
                    {campaigns.filter((c) => c.status === "Active").length} Live
                  </span>
                </div>
              </div>

              {/* 4 Metric KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-neutral-400 block">Total Spent</span>
                  <span className="text-base font-bold text-white font-mono">
                    ₹{campaigns.reduce((acc, c) => acc + c.spent, 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-neutral-400 block">Impressions</span>
                  <span className="text-base font-bold text-white font-mono">
                    {campaigns.reduce((acc, c) => acc + c.impressions, 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-neutral-400 block">Average CTR</span>
                  <span className="text-base font-bold text-emerald-400 font-mono">2.48%</span>
                </div>
                <div className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[10px] font-mono text-neutral-400 block">Total Leads</span>
                  <span className="text-base font-bold text-amber-300 font-mono">
                    {campaigns.reduce((acc, c) => acc + c.leads, 0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Campaigns Table */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#0c1018]/90 overflow-hidden shadow-xl p-4 sm:p-5">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-extrabold text-white text-base tracking-tight">
                  Your Simulated Ad Campaigns
                </h4>
                <button
                  type="button"
                  onClick={() => setActiveTab("feed")}
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:underline"
                >
                  <span>Boost a Post from Feed</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-3.5 rounded-2xl border border-white/[0.06] bg-black/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="font-bold text-white text-xs sm:text-sm">
                          {camp.postTitle}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-white/[0.06] text-[9px] font-mono text-neutral-300">
                          {camp.objective}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-neutral-400 flex-wrap">
                        <span>Budget: ₹{camp.dailyBudget}/day</span>
                        <span>•</span>
                        <span>Impressions: {camp.impressions}</span>
                        <span>•</span>
                        <span className="text-emerald-400">CTR: {camp.ctr}</span>
                        <span>•</span>
                        <span>CPC: {camp.cpc}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-[10px] font-bold">
                        {camp.leads} Leads
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Quick Boost Modal Bottom Sheet (Option 2A) */}
      <AnimatePresence>
        {boostingPost && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="w-full max-w-lg rounded-t-3xl sm:rounded-3xl border border-white/[0.1] bg-[#0c1018] p-5 sm:p-6 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-bold">
                    🚀
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base">Meta Ad Campaign Setup</h3>
                    <span className="text-[10px] text-neutral-400 font-mono">
                      Powered by Gemini 3.8 Ad Simulator
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBoostingPost(null)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Preview of post being boosted */}
              <div className="mb-4 p-3 rounded-2xl bg-black/40 border border-white/[0.06] text-xs">
                <span className="text-[10px] font-mono text-neutral-400 block mb-1">
                  Ad Creative &amp; Hook:
                </span>
                <p className="font-semibold text-white truncate">
                  &ldquo;{boostingPost.hook || boostingPost.content}&rdquo;
                </p>
              </div>

              {/* Objective Selector */}
              <div className="mb-4">
                <label className="text-xs font-mono text-neutral-300 block mb-2 font-semibold">
                  1. Choose Campaign Objective
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setBoostObjective("leads")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      boostObjective === "leads"
                        ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-bold"
                        : "border-white/[0.08] bg-white/[0.02] text-neutral-400"
                    }`}
                  >
                    <span className="block text-white font-semibold">💬 WhatsApp Leads</span>
                    <span className="text-[10px] text-neutral-400">Direct student chats</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBoostObjective("traffic")}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      boostObjective === "traffic"
                        ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300 font-bold"
                        : "border-white/[0.08] bg-white/[0.02] text-neutral-400"
                    }`}
                  >
                    <span className="block text-white font-semibold">🌐 Landing Page Traffic</span>
                    <span className="text-[10px] text-neutral-400">Clicks to your portfolio</span>
                  </button>
                </div>
              </div>

              {/* Target Audience: Cities */}
              <div className="mb-4">
                <label className="text-xs font-mono text-neutral-300 block mb-2 font-semibold">
                  2. Target Indian Locations
                </label>
                <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                  {["Delhi NCR", "Mumbai", "Bengaluru", "Jaipur", "Lucknow", "Pune", "Indore"].map(
                    (city) => {
                      const isSelected = selectedCities.includes(city)
                      return (
                        <button
                          key={city}
                          type="button"
                          onClick={() => toggleCity(city)}
                          className={`px-3 py-1 rounded-full text-xs transition-all ${
                            isSelected
                              ? "bg-emerald-500 text-slate-950 font-bold"
                              : "bg-white/[0.04] border border-white/[0.08] text-neutral-300 hover:border-white/20"
                          }`}
                        >
                          {city}
                        </button>
                      )
                    }
                  )}
                </div>
              </div>

              {/* Daily Budget Slider */}
              <div className="mb-6">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="font-semibold text-neutral-300">3. Daily Ad Spend</span>
                  <span className="font-bold text-emerald-400 text-sm">
                    ₹{boostBudget.toLocaleString("en-IN")} Credits
                  </span>
                </div>
                <input
                  type="range"
                  min={100}
                  max={2000}
                  step={100}
                  value={boostBudget}
                  onChange={(e) => setBoostBudget(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-neutral-400">
                  <span>₹100 (Testing)</span>
                  <span>Est. Reach: {Math.floor(boostBudget * 7.2)} Indian users</span>
                  <span>₹2,000 (Scale)</span>
                </div>
              </div>

              {/* Launch CTA */}
              <button
                type="button"
                disabled={isSimulating}
                onClick={handleLaunchBoost}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm uppercase tracking-wider font-mono shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Rocket className="w-4 h-4" />
                <span>
                  {isSimulating ? "Running Gemini 3.8 Ad Simulator..." : `Launch Ad (Spend ₹${boostBudget})`}
                </span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
