"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  MoreHorizontal,
  PlusSquare,
  Compass,
  Film,
  Home,
  BarChart2,
  Coins,
  Rocket,
  CheckCircle2,
  X,
  Volume2,
  VolumeX,
  ChevronRight,
  TrendingUp,
  Target,
  Sparkles,
} from "lucide-react"

// Real Instagram-style data structure
interface PostComment {
  id: string
  username: string
  avatar: string
  text: string
  timeAgo: string
  isLiked?: boolean
  likesCount?: number
  isAI?: boolean
}

interface InstaPost {
  id: string
  username: string
  displayName: string
  avatar: string
  isVerified?: boolean
  location?: string
  timeAgo: string
  caption: string
  hook?: string
  mediaUrl: string
  mediaType: "image" | "video"
  isSponsored?: boolean
  sponsorData?: {
    buttonText: string
    destination: string
    impressions: number
    clicks: number
    cpc: string
    ctr: string
    leads: number
    dailyBudget: number
  }
  likesCount: number
  hasLiked?: boolean
  hasSaved?: boolean
  comments: PostComment[]
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

// True-to-life Instagram Feed Posts
const INSTA_SEED_POSTS: InstaPost[] = [
  {
    id: "insta-1",
    username: "dheeraj_celoris",
    displayName: "Dheeraj Kushwaha",
    avatar: "/courses/digital-marketing-mastery-og.jpg",
    isVerified: true,
    location: "Celoris Studio · Noida",
    timeAgo: "2h",
    caption: "Stop spending ₹15,000/month on generic agency ads that deliver zero leads. 🛑\n\nWhen we tested this exact customer journey angle for our D2C packaging client, the CPC dropped straight from ₹18.40 to ₹6.40 in 48 hours. The secret? Calling out the hidden cost in the first 1.5 seconds instead of showing boring b-roll.\n\nBatch #43 students: make sure to inspect your audience fatigue metrics before launching tonight! 🚀",
    hook: "Stop spending ₹15,000 on basic reels",
    mediaUrl: "/courses/digital-marketing-mastery-og.jpg",
    mediaType: "image",
    isSponsored: true,
    sponsorData: {
      buttonText: "Learn More",
      destination: "/learn/course/digital-marketing-mastery",
      impressions: 5410,
      clicks: 148,
      cpc: "₹6.40",
      ctr: "2.73%",
      leads: 19,
      dailyBudget: 500,
    },
    likesCount: 142,
    hasLiked: false,
    hasSaved: false,
    comments: [
      {
        id: "ic-1",
        username: "pooja_sharma.in",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        text: "Sir tried this exact hook format in our local cafe campaign, got 32 WhatsApp inquiries by evening! 🔥",
        timeAgo: "1h",
        likesCount: 12,
      },
      {
        id: "ic-2",
        username: "aman_growthguy",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        text: "The hook formula is pure gold. Are we covering GA4 custom events in the Wednesday class?",
        timeAgo: "45m",
        likesCount: 4,
      },
      {
        id: "ic-3",
        username: "algorithm_insights_ai",
        avatar: "🤖",
        text: "⚡ High initial watch time detected. Meta auction algorithm prioritizing this creative angle.",
        timeAgo: "30m",
        isAI: true,
      },
    ],
  },
  {
    id: "insta-2",
    username: "ananya_reels",
    displayName: "Ananya Jairath",
    avatar: "/free-courses/social-media-reels.jpg",
    isVerified: true,
    location: "Creator Hub · New Delhi",
    timeAgo: "4h",
    caption: "You DO NOT need an iPhone 16 Pro Max or a ₹50,000 Sony mirrorless camera to create high-retention Reels. 📱✨\n\nShot this entire clip on a 3-year-old Redmi phone by placing it directly facing a north-facing window at noon. Cost of lighting: ₹0.\n\nDrop your current smartphone model in the comments and I will tell you the best camera settings for 60fps export! 👇",
    hook: "You don't need a ₹50,000 camera to go viral",
    mediaUrl: "/free-courses/social-media-reels.jpg",
    mediaType: "image",
    isSponsored: false,
    likesCount: 284,
    hasLiked: false,
    hasSaved: true,
    comments: [
      {
        id: "ic-4",
        username: "rohit_cuts",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
        text: "Using a Moto G84 ma'am! The CapCut motion blur setting you taught completely changed the b-roll smoothness 👏",
        timeAgo: "3h",
        likesCount: 8,
      },
    ],
  },
]

export default function InstagramStyleSocial() {
  const [currentTab, setCurrentTab] = useState<"feed" | "ads" | "create">("feed")
  const [walletBalance, setWalletBalance] = useState<number>(10000)
  const [posts, setPosts] = useState<InstaPost[]>(INSTA_SEED_POSTS)
  const [campaigns, setCampaigns] = useState<ActiveCampaign[]>([
    {
      id: "camp-1",
      postId: "insta-1",
      postTitle: "Stop spending ₹15,000 on basic reels",
      objective: "WhatsApp Leads",
      dailyBudget: 500,
      spent: 500,
      status: "Active",
      impressions: 5410,
      clicks: 148,
      cpc: "₹6.40",
      ctr: "2.73%",
      leads: 19,
    },
  ])

  // Story Tray Data
  const stories = [
    { username: "Your Story", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80", hasUnseen: false, isUser: true },
    { username: "dheeraj", avatar: "/courses/digital-marketing-mastery-og.jpg", hasUnseen: true },
    { username: "ananya", avatar: "/free-courses/social-media-reels.jpg", hasUnseen: true },
    { username: "batch_43", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80", hasUnseen: true },
    { username: "viral_ads", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80", hasUnseen: true },
    { username: "pooja_jpr", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80", hasUnseen: false },
  ]

  // Post creation state
  const [captionText, setCaptionText] = useState("")
  const [hookText, setHookText] = useState("")
  const [selectedImage, setSelectedImage] = useState("/courses/digital-marketing-mastery-og.jpg")

  // Quick Boost Modal State
  const [boostingPost, setBoostingPost] = useState<InstaPost | null>(null)
  const [boostBudget, setBoostBudget] = useState(500)
  const [boostObjective, setBoostObjective] = useState<"leads" | "traffic">("leads")
  const [selectedCities, setSelectedCities] = useState<string[]>(["Delhi NCR", "Mumbai", "Jaipur"])
  const [isSimulating, setIsSimulating] = useState(false)

  // Active Comment Drawer
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null)
  const [commentInput, setCommentInput] = useState("")

  // Load / Save wallet
  useEffect(() => {
    try {
      const saved = localStorage.getItem("celoris_social_wallet")
      if (saved) setWalletBalance(Number(saved))
    } catch {}
  }, [])

  const updateWallet = (val: number) => {
    setWalletBalance(val)
    try {
      localStorage.setItem("celoris_social_wallet", String(val))
    } catch {}
  }

  // Toggle Like with Instagram Heart Pop
  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const liked = !p.hasLiked
          return {
            ...p,
            hasLiked: liked,
            likesCount: liked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
          }
        }
        return p
      })
    )
  }

  const handleSave = (postId: string) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, hasSaved: !p.hasSaved } : p))
    )
  }

  // Submit comment
  const handleAddComment = (postId: string) => {
    if (!commentInput.trim()) return
    const newC: PostComment = {
      id: `ic-${Date.now()}`,
      username: "you_student",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      text: commentInput.trim(),
      timeAgo: "1s",
    }
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments: [...p.comments, newC] } : p
      )
    )
    setCommentInput("")
  }

  // Publish New Instagram Post
  const handlePublishPost = () => {
    if (!captionText.trim()) return
    const newPost: InstaPost = {
      id: `insta-${Date.now()}`,
      username: "you_student",
      displayName: "You (Student Creator)",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
      isVerified: false,
      location: "New Delhi, India",
      timeAgo: "Just now",
      caption: captionText.trim(),
      hook: hookText.trim(),
      mediaUrl: selectedImage,
      mediaType: "image",
      isSponsored: false,
      likesCount: 1,
      hasLiked: true,
      hasSaved: false,
      comments: [
        {
          id: `ic-bot-${Date.now()}`,
          username: "celoris_bot",
          avatar: "🤖",
          text: "🚀 Post is live on the creator network! Tap 'Boost post' below to run a simulated ad with your ₹10,000 credits.",
          timeAgo: "Just now",
          isAI: true,
        },
      ],
    }
    setPosts([newPost, ...posts])
    setCaptionText("")
    setHookText("")
    setCurrentTab("feed")
  }

  // Launch Boost Ad
  const handleLaunchBoost = async () => {
    if (!boostingPost) return
    if (walletBalance < boostBudget) {
      alert("Insufficient virtual wallet balance! Reset your wallet in Ads Manager.")
      return
    }
    setIsSimulating(true)
    try {
      const res = await fetch("/api/social/simulate-ad", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hook: boostingPost.hook || boostingPost.caption.slice(0, 45),
          caption: boostingPost.caption,
          objective: boostObjective,
          targetAudience: {
            cities: selectedCities,
            ageRange: "18-28",
            niche: "Upskilling & Career",
          },
          budget: boostBudget,
        }),
      })
      const data = await res.json()
      const sim = data?.data

      const newBal = walletBalance - boostBudget
      updateWallet(newBal)

      const aiComments: PostComment[] = (sim?.simulated_audience_feed || []).map(
        (persona: any, idx: number) => ({
          id: `ai-cm-${Date.now()}-${idx}`,
          username: persona.persona_name.toLowerCase().replace(/[^a-z0-9]/g, "_").slice(0, 16),
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
          text: persona.comment_text,
          timeAgo: `${idx + 1}m`,
          isAI: true,
        })
      )

      setPosts((prev) =>
        prev.map((p) => {
          if (p.id === boostingPost.id) {
            return {
              ...p,
              isSponsored: true,
              sponsorData: {
                buttonText: boostObjective === "leads" ? "Send Message" : "Learn More",
                destination: "/learn/course/digital-marketing-mastery",
                impressions: sim?.estimated_impressions || 3600,
                clicks: sim?.estimated_clicks || 84,
                cpc: sim?.estimated_cpc || "₹6.80",
                ctr: sim?.estimated_ctr || "2.35%",
                leads: sim?.estimated_leads || 11,
                dailyBudget: boostBudget,
              },
              comments: [...p.comments, ...aiComments],
            }
          }
          return p
        })
      )

      const newCampaign: ActiveCampaign = {
        id: `camp-${Date.now()}`,
        postId: boostingPost.id,
        postTitle: boostingPost.hook || boostingPost.caption.slice(0, 35) + "...",
        objective: boostObjective === "leads" ? "WhatsApp Leads" : "Traffic",
        dailyBudget: boostBudget,
        spent: boostBudget,
        status: "Active",
        impressions: sim?.estimated_impressions || 3600,
        clicks: sim?.estimated_clicks || 84,
        cpc: sim?.estimated_cpc || "₹6.80",
        ctr: sim?.estimated_ctr || "2.35%",
        leads: sim?.estimated_leads || 11,
      }
      setCampaigns([newCampaign, ...campaigns])
      setBoostingPost(null)
    } catch (err) {
      console.error(err)
      alert("Simulation failed. Please try again.")
    } finally {
      setIsSimulating(false)
    }
  }

  const toggleCity = (city: string) => {
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]
    )
  }

  return (
    <div className="min-h-screen bg-black text-[#f5f5f5] flex flex-col font-[-apple-system,BlinkMacSystemFont,'Segoe_UI',Roboto,Helvetica,Arial,sans-serif]">
      {/* Top Instagram Navigation Header */}
      <nav className="sticky top-0 z-40 bg-black/95 backdrop-blur-md border-b border-[#262626] px-4 py-2.5">
        <div className="max-w-[470px] mx-auto flex items-center justify-between">
          {/* Instagram Font Logo Replica */}
          <Link href="/social" className="flex items-center gap-1.5">
            <span className="font-serif italic font-bold text-2xl tracking-tight text-white select-none">
              Instagram
            </span>
            <span className="text-[10px] font-mono text-emerald-400 font-bold bg-[#1a2e22] px-1.5 py-0.5 rounded-md border border-emerald-500/30">
              SANDBOX
            </span>
          </Link>

          {/* Top Actions: Virtual Ad Spend Wallet & Ads Manager Pill */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentTab(currentTab === "ads" ? "feed" : "ads")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                currentTab === "ads"
                  ? "bg-white text-black font-bold"
                  : "bg-[#1c1c1c] text-white hover:bg-[#282828] border border-[#333]"
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Ads Manager</span>
            </button>

            {/* Wallet Pill */}
            <div
              onClick={() => setCurrentTab("ads")}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#14231b] border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold cursor-pointer hover:bg-[#1b3024] transition-colors"
              title="Virtual Ad Budget: ₹10,000 for practice"
            >
              <Coins className="w-3 h-3 text-emerald-400" />
              <span>₹{walletBalance.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Screen Viewport */}
      <div className="flex-1 max-w-[470px] w-full mx-auto pb-20">
        {currentTab === "feed" ? (
          <div>
            {/* Instagram Stories Tray */}
            <div className="border-b border-[#262626] py-3.5 px-2 flex items-center gap-3 overflow-x-auto scrollbar-none">
              {stories.map((st, i) => (
                <div key={st.username} className="flex flex-col items-center gap-1 shrink-0 cursor-pointer">
                  <div
                    className={`w-[66px] h-[66px] rounded-full p-[2px] flex items-center justify-center ${
                      st.hasUnseen
                        ? "bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976]"
                        : "bg-[#262626]"
                    }`}
                  >
                    <div className="w-full h-full rounded-full bg-black p-[2px] overflow-hidden relative">
                      <img
                        src={st.avatar}
                        alt={st.username}
                        className="w-full h-full object-cover rounded-full"
                      />
                      {st.isUser && (
                        <div className="absolute bottom-0 right-0 bg-[#0095f6] text-white rounded-full p-0.5 border border-black">
                          <PlusSquare className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] text-[#a8a8a8] font-normal truncate max-w-[66px]">
                    {st.username}
                  </span>
                </div>
              ))}
            </div>

            {/* Instagram Post Feed Stream */}
            <div className="divide-y divide-[#262626]">
              {posts.map((post) => (
                <article key={post.id} className="pt-3 pb-4">
                  {/* Post Header */}
                  <div className="px-3.5 pb-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full p-[1.5px] bg-gradient-to-tr from-[#feda75] via-[#fa7e1e] to-[#d62976] flex items-center justify-center">
                        <img
                          src={post.avatar}
                          alt={post.username}
                          className="w-full h-full rounded-full object-cover bg-black"
                        />
                      </div>
                      <div className="leading-tight">
                        <div className="flex items-center gap-1">
                          <span className="font-semibold text-xs text-white hover:underline cursor-pointer">
                            {post.username}
                          </span>
                          {post.isVerified && (
                            <svg className="w-3 h-3 text-[#0095f6] fill-current" viewBox="0 0 24 24">
                              <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm-1.9 14.7l-4.1-4.1 1.4-1.4 2.7 2.7 6.4-6.4 1.4 1.4-7.8 7.8z" />
                            </svg>
                          )}
                          <span className="text-[#a8a8a8] text-xs">• {post.timeAgo}</span>
                        </div>
                        {post.isSponsored ? (
                          <span className="text-[11px] text-[#a8a8a8] font-normal block">
                            Sponsored
                          </span>
                        ) : post.location ? (
                          <span className="text-[10px] text-[#a8a8a8] block">{post.location}</span>
                        ) : null}
                      </div>
                    </div>
                    <button className="text-[#a8a8a8] hover:text-white p-1">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Post Media (4:5 / 1:1 Aspect Ratio like Instagram) */}
                  <div className="relative aspect-square w-full bg-[#121212] overflow-hidden select-none">
                    <img
                      src={post.mediaUrl}
                      alt="Post visual"
                      onDoubleClick={() => handleLike(post.id)}
                      className="w-full h-full object-cover"
                    />

                    {/* Sponsored Live Performance Pill (Overlay) */}
                    {post.isSponsored && post.sponsorData && (
                      <div className="absolute top-2.5 right-2.5 bg-black/75 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md text-[10px] font-mono text-emerald-400 font-bold flex items-center gap-1.5 shadow-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>CTR {post.sponsorData.ctr} · CPC {post.sponsorData.cpc}</span>
                      </div>
                    )}
                  </div>

                  {/* Sponsored Bottom Action Bar (The Blue Instagram Banner) */}
                  {post.isSponsored && post.sponsorData && (
                    <div className="bg-[#121212] border-b border-[#262626] px-3.5 py-2 flex items-center justify-between">
                      <div className="text-xs">
                        <span className="text-white font-semibold block">
                          {post.sponsorData.leads} Leads Generated
                        </span>
                        <span className="text-[#a8a8a8] text-[11px]">
                          Budget: ₹{post.sponsorData.dailyBudget}/day
                        </span>
                      </div>
                      <button
                        onClick={() => alert(`Simulated Instagram Ad click! Destination: ${post.sponsorData?.destination}`)}
                        className="bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold px-4 py-1.5 rounded-lg transition-colors"
                      >
                        {post.sponsorData.buttonText} &gt;
                      </button>
                    </div>
                  )}

                  {/* Instagram Action Row: Heart, Comment, Share, Save */}
                  <div className="px-3.5 pt-3 pb-1 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {/* Heart Like */}
                      <button
                        onClick={() => handleLike(post.id)}
                        className="transition-transform active:scale-125 focus:outline-none"
                      >
                        <Heart
                          className={`w-6 h-6 transition-colors ${
                            post.hasLiked
                              ? "fill-[#ff3040] text-[#ff3040]"
                              : "text-white hover:text-[#a8a8a8]"
                          }`}
                        />
                      </button>

                      {/* Comment */}
                      <button
                        onClick={() =>
                          setActiveCommentPostId(
                            activeCommentPostId === post.id ? null : post.id
                          )
                        }
                        className="text-white hover:text-[#a8a8a8] focus:outline-none"
                      >
                        <MessageCircle className="w-6 h-6" />
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => {
                          navigator.clipboard?.writeText(window.location.href)
                          alert("Link copied! Share with your batch.")
                        }}
                        className="text-white hover:text-[#a8a8a8] focus:outline-none"
                      >
                        <Send className="w-6 h-6 -rotate-12" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleSave(post.id)}
                      className="text-white hover:text-[#a8a8a8] focus:outline-none"
                    >
                      <Bookmark
                        className={`w-6 h-6 ${post.hasSaved ? "fill-white" : ""}`}
                      />
                    </button>
                  </div>

                  {/* Likes Count */}
                  <div className="px-3.5 pt-1">
                    <span className="font-semibold text-xs text-white">
                      {post.likesCount.toLocaleString("en-IN")} likes
                    </span>
                  </div>

                  {/* Caption & Opening Hook */}
                  <div className="px-3.5 pt-1 text-xs leading-relaxed">
                    <span className="font-semibold text-white mr-1.5">{post.username}</span>
                    <span className="text-[#f5f5f5] whitespace-pre-line">{post.caption}</span>
                  </div>

                  {/* View All Comments Link */}
                  {post.comments.length > 0 && (
                    <div className="px-3.5 pt-1.5">
                      <button
                        onClick={() =>
                          setActiveCommentPostId(
                            activeCommentPostId === post.id ? null : post.id
                          )
                        }
                        className="text-[#a8a8a8] text-xs hover:text-[#c4c4c4]"
                      >
                        View all {post.comments.length} comments
                      </button>
                    </div>
                  )}

                  {/* Top Comment Preview */}
                  {post.comments[0] && (
                    <div className="px-3.5 pt-1 text-xs">
                      <span className="font-semibold text-white mr-1.5">
                        {post.comments[0].username}
                      </span>
                      <span className="text-[#e0e0e0]">{post.comments[0].text}</span>
                    </div>
                  )}

                  {/* Instagram "Boost Post" Button for Students */}
                  {!post.isSponsored && (
                    <div className="px-3.5 pt-3">
                      <button
                        onClick={() => setBoostingPost(post)}
                        className="w-full py-2 rounded-lg bg-[#0095f6] hover:bg-[#1877f2] text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                      >
                        <Rocket className="w-3.5 h-3.5" />
                        <span>Boost post (Practice with ₹10k Credits)</span>
                      </button>
                    </div>
                  )}

                  {/* Slide-out Comment Drawer */}
                  <AnimatePresence>
                    {activeCommentPostId === post.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-3 border-t border-[#262626] bg-[#0c0c0c] p-3.5 space-y-3"
                      >
                        <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                          {post.comments.map((cm) => (
                            <div key={cm.id} className="flex items-start gap-2.5 text-xs">
                              <div className="w-6 h-6 rounded-full overflow-hidden bg-[#262626] shrink-0 mt-0.5">
                                {cm.avatar.startsWith("http") || cm.avatar.startsWith("/") ? (
                                  <img src={cm.avatar} alt={cm.username} className="w-full h-full object-cover" />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center font-bold text-[10px]">
                                    {cm.avatar}
                                  </div>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="leading-tight">
                                  <span className="font-semibold text-white mr-1.5">
                                    {cm.username}
                                  </span>
                                  {cm.isAI && (
                                    <span className="text-[9px] font-mono text-emerald-400 bg-[#16271c] px-1 py-0.2 rounded border border-emerald-500/30">
                                      Simulated Audience
                                    </span>
                                  )}
                                </div>
                                <p className="text-[#d4d4d4] mt-0.5">{cm.text}</p>
                                <span className="text-[10px] text-[#737373] mt-1 block">
                                  {cm.timeAgo} · Reply
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Add Comment Row */}
                        <div className="flex items-center gap-2 pt-2 border-t border-[#262626]">
                          <input
                            type="text"
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddComment(post.id)}
                            placeholder="Add a comment as you_student..."
                            className="flex-1 bg-transparent text-xs text-white placeholder-[#737373] focus:outline-none"
                          />
                          <button
                            onClick={() => handleAddComment(post.id)}
                            disabled={!commentInput.trim()}
                            className="text-[#0095f6] font-semibold text-xs disabled:opacity-40 hover:text-white"
                          >
                            Post
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </article>
              ))}
            </div>
          </div>
        ) : currentTab === "create" ? (
          /* Instagram "Create Post" Screen */
          <div className="p-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626] mb-4">
              <button
                onClick={() => setCurrentTab("feed")}
                className="text-xs font-semibold text-[#a8a8a8] hover:text-white"
              >
                Cancel
              </button>
              <h3 className="font-semibold text-sm text-white">New post</h3>
              <button
                onClick={handlePublishPost}
                disabled={!captionText.trim()}
                className="text-xs font-semibold text-[#0095f6] disabled:opacity-40 hover:text-white"
              >
                Share
              </button>
            </div>

            <div className="space-y-4">
              <div className="aspect-square w-full rounded-xl bg-[#141414] border border-[#262626] overflow-hidden relative">
                <img src={selectedImage} alt="Selected" className="w-full h-full object-cover" />
                <div className="absolute bottom-2.5 right-2.5 bg-black/80 px-2.5 py-1 rounded text-[11px] text-[#a8a8a8]">
                  Tap to change image
                </div>
              </div>

              <div>
                <label className="text-xs text-[#a8a8a8] block mb-1">
                  1. Hook (First 2-3 seconds):
                </label>
                <input
                  type="text"
                  value={hookText}
                  onChange={(e) => setHookText(e.target.value)}
                  placeholder="e.g. Stop wasting ₹15,000 on agencies..."
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg px-3 py-2 text-xs text-white placeholder-[#737373] focus:outline-none focus:border-[#444]"
                />
              </div>

              <div>
                <label className="text-xs text-[#a8a8a8] block mb-1">2. Write caption...</label>
                <textarea
                  rows={4}
                  value={captionText}
                  onChange={(e) => setCaptionText(e.target.value)}
                  placeholder="Share details about your ad, offer, or student portfolio..."
                  className="w-full bg-[#141414] border border-[#262626] rounded-lg p-3 text-xs text-white placeholder-[#737373] focus:outline-none focus:border-[#444]"
                />
              </div>

              <div className="p-3 rounded-lg bg-[#14231b] border border-emerald-500/30 text-xs text-emerald-300">
                💡 <span className="font-semibold">Student Tip:</span> Once you click Share, tap{" "}
                <strong>&ldquo;Boost post&rdquo;</strong> to run a simulated Meta ad campaign using your ₹10,000 credits.
              </div>
            </div>
          </div>
        ) : (
          /* Meta Ads Manager Dashboard View */
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#262626]">
              <div>
                <h3 className="font-semibold text-base text-white">Meta Ads Manager</h3>
                <span className="text-[11px] text-[#a8a8a8]">Celoris Sandbox Environment</span>
              </div>
              <button
                onClick={() => {
                  updateWallet(10000)
                  alert("Wallet reset to ₹10,000 credits!")
                }}
                className="px-2.5 py-1 rounded-md bg-[#262626] text-xs font-semibold text-white hover:bg-[#333]"
              >
                Reset ₹10k
              </button>
            </div>

            {/* Wallet Big Card */}
            <div className="p-4 rounded-xl bg-[#141414] border border-[#262626]">
              <span className="text-xs text-[#a8a8a8] block">Available Ad Spend</span>
              <span className="text-3xl font-bold font-mono text-emerald-400">
                ₹{walletBalance.toLocaleString("en-IN")}
              </span>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs pt-3 border-t border-[#262626]">
                <div>
                  <span className="text-[#a8a8a8] block text-[11px]">Total Spent</span>
                  <span className="font-semibold text-white">
                    ₹{campaigns.reduce((a, b) => a + b.spent, 0).toLocaleString("en-IN")}
                  </span>
                </div>
                <div>
                  <span className="text-[#a8a8a8] block text-[11px]">Leads Generated</span>
                  <span className="font-semibold text-emerald-400">
                    {campaigns.reduce((a, b) => a + b.leads, 0)} WhatsApp Inquiries
                  </span>
                </div>
              </div>
            </div>

            {/* Campaign List */}
            <h4 className="text-xs font-semibold text-[#a8a8a8] uppercase tracking-wider pt-2">
              Active Campaigns
            </h4>
            <div className="space-y-2.5">
              {campaigns.map((c) => (
                <div key={c.id} className="p-3.5 rounded-xl bg-[#141414] border border-[#262626]">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-xs text-white truncate max-w-[280px]">
                      {c.postTitle}
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono px-2 py-0.5 rounded-full font-bold">
                      {c.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-mono text-[#a8a8a8] pt-1">
                    <div>
                      <span>Impressions</span>
                      <strong className="block text-white">{c.impressions}</strong>
                    </div>
                    <div>
                      <span>CTR / CPC</span>
                      <strong className="block text-emerald-400">{c.ctr} ({c.cpc})</strong>
                    </div>
                    <div>
                      <span>Leads</span>
                      <strong className="block text-amber-300">{c.leads}</strong>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Instagram Bottom App Dock */}
      <footer className="fixed bottom-0 inset-x-0 z-40 bg-black border-t border-[#262626] py-2 px-6">
        <div className="max-w-[470px] mx-auto flex items-center justify-between">
          <button
            onClick={() => setCurrentTab("feed")}
            className={`p-1.5 focus:outline-none ${currentTab === "feed" ? "text-white" : "text-[#737373]"}`}
          >
            <Home className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentTab("ads")}
            className={`p-1.5 focus:outline-none ${currentTab === "ads" ? "text-white" : "text-[#737373]"}`}
          >
            <BarChart2 className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentTab("create")}
            className={`p-1.5 focus:outline-none ${currentTab === "create" ? "text-white" : "text-[#737373]"}`}
          >
            <PlusSquare className="w-6 h-6" />
          </button>
          <Link
            href="/free-courses-with-certificate"
            className="p-1.5 text-[#737373] hover:text-white"
            title="Classrooms & Certificates"
          >
            <Compass className="w-6 h-6" />
          </Link>
          <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 p-0.5">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80"
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
        </div>
      </footer>

      {/* Real Instagram "Boost Post" Slide-Up Sheet */}
      <AnimatePresence>
        {boostingPost && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, y: 120 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 120 }}
              className="w-full max-w-[470px] bg-[#1a1a1a] rounded-t-2xl sm:rounded-2xl border border-[#333] p-5 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-3 border-b border-[#2e2e2e] mb-4">
                <h3 className="font-semibold text-sm text-white">Boost Post on Meta</h3>
                <button onClick={() => setBoostingPost(null)} className="text-[#a8a8a8] hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Goal Selector */}
                <div>
                  <span className="text-xs text-[#a8a8a8] block mb-2 font-medium">Select a goal</span>
                  <div className="space-y-2">
                    <button
                      onClick={() => setBoostObjective("leads")}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                        boostObjective === "leads"
                          ? "border-[#0095f6] bg-[#0095f6]/10 text-white font-semibold"
                          : "border-[#333] bg-[#121212] text-[#a8a8a8]"
                      }`}
                    >
                      <span>💬 More messages &amp; WhatsApp inquiries</span>
                      {boostObjective === "leads" && <CheckCircle2 className="w-4 h-4 text-[#0095f6]" />}
                    </button>
                    <button
                      onClick={() => setBoostObjective("traffic")}
                      className={`w-full p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-colors ${
                        boostObjective === "traffic"
                          ? "border-[#0095f6] bg-[#0095f6]/10 text-white font-semibold"
                          : "border-[#333] bg-[#121212] text-[#a8a8a8]"
                      }`}
                    >
                      <span>🌐 More profile &amp; landing page visits</span>
                      {boostObjective === "traffic" && <CheckCircle2 className="w-4 h-4 text-[#0095f6]" />}
                    </button>
                  </div>
                </div>

                {/* City Targeting */}
                <div>
                  <span className="text-xs text-[#a8a8a8] block mb-2 font-medium">Target audience locations</span>
                  <div className="flex flex-wrap gap-1.5 text-xs">
                    {["Delhi NCR", "Mumbai", "Jaipur", "Bengaluru", "Lucknow", "Pune", "Indore"].map(
                      (c) => (
                        <button
                          key={c}
                          onClick={() => toggleCity(c)}
                          className={`px-3 py-1 rounded-full text-xs transition-all ${
                            selectedCities.includes(c)
                              ? "bg-white text-black font-semibold"
                              : "bg-[#262626] text-[#a8a8a8] hover:text-white"
                          }`}
                        >
                          {c}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Budget Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-[#a8a8a8]">Budget</span>
                    <span className="font-bold text-white font-mono">₹{boostBudget} Credits</span>
                  </div>
                  <input
                    type="range"
                    min={100}
                    max={2000}
                    step={100}
                    value={boostBudget}
                    onChange={(e) => setBoostBudget(Number(e.target.value))}
                    className="w-full accent-[#0095f6] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] text-[#737373] mt-1">
                    <span>₹100</span>
                    <span>Est. Reach: {Math.floor(boostBudget * 8.2)} accounts</span>
                    <span>₹2,000</span>
                  </div>
                </div>

                {/* Launch Button */}
                <button
                  onClick={handleLaunchBoost}
                  disabled={isSimulating}
                  className="w-full py-3 rounded-xl bg-[#0095f6] hover:bg-[#1877f2] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Rocket className="w-4 h-4" />
                  <span>
                    {isSimulating ? "Running Ad Simulation..." : `Boost post now (Spend ₹${boostBudget})`}
                  </span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
