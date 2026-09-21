import { PlanConfig } from "./PricingCard"
import {
  GraduationCap,
  Briefcase,
  Coffee,
  Tv,
  Zap,
  ShieldCheck,
  Sparkles,
  Box,
  Crown
} from "lucide-react"

export const PRICING_PLANS: PlanConfig[] = [
  {
    id: "free",
    name: "FREE",
    subtitle: "Explore AI & start your creative journey",
    badge: {
      text: "100% FREE FOREVER",
      variant: "emerald"
    },
    fixedCredits: {
      credits: 30,
      nanoBananaGenerations: 15,
      seedanceVideos: 2,
      label: "30 free credits replenished every month"
    },
    annualPrice: 0,
    monthlyPrice: 0,
    buttonText: "Start for Free",
    buttonStyle: "emerald",
    buttonHref: "/register",
    noteBelowButton: "No credit card needed • Free forever",
    unlimitedGens: [
      { title: "Higgsfield Genjutsu", isAvailable: false, statusText: "No free gens" },
      { title: "Nano Banana Pro", isAvailable: false, statusText: "No unlimited" },
      { title: "Nano Banana 2", isAvailable: false, statusText: "No unlimited" },
      { title: "Kling 3.0", isAvailable: false, statusText: "No unlimited" },
    ],
    seedanceSection: {
      hasAccess: false,
      badgeTitle: "NO ACCESS TO SEEDANCE 2.5",
      badgeSubtitle: "Available from Pro plan",
      models: [
        { name: "Seedance 2.5", status: "No access", isAvailable: false },
        { name: "Seedance 2.0", status: "No access", isAvailable: false }
      ]
    },
    classQueuePriority: {
      boost: 0,
      label: "Standard class queue"
    },
    ecosystemPerks: [
      {
        title: "100% Free Online Classes for All",
        desc: "Unrestricted access to all courses (Web Dev, Digital Marketing, AI Tools, Excel Copilot, Shorts/Reels) with standard queue",
        icon: GraduationCap,
        highlight: true
      },
      {
        title: "100% Free Job Portal & Freelance Hub",
        desc: "Browse and apply to verified jobs with zero commissions deducted",
        icon: Briefcase,
        highlight: true
      },
      {
        title: "Celoris Café & TV Streaming",
        desc: "24/7 synchronized study lounges & continuous masterclasses",
        icon: Coffee
      },
      {
        title: "PhotoLite & Basic Video Studio",
        desc: "Free web-based photo and video editing suite",
        icon: Sparkles
      }
    ]
  },
  {
    id: "basic",
    name: "BASIC",
    subtitle: "For first-time AI creators",
    fixedCredits: {
      credits: 120,
      nanoBananaGenerations: 60,
      seedanceVideos: 7,
      label: "Fixed amount of 120 credits/mo"
    },
    annualPrice: 799,
    monthlyPrice: 999,
    originalAnnualPrice: 999,
    originalMonthlyPrice: 999,
    buttonText: "Get Basic",
    buttonStyle: "white",
    buttonHref: "/register?plan=basic",
    noteBelowButton: "Cancel anytime • Billed annually or monthly",
    unlimitedGens: [
      { title: "Higgsfield Genjutsu", isAvailable: false, statusText: "No free gens" },
      { title: "Nano Banana Pro", isAvailable: false, statusText: "No unlimited" },
      { title: "Nano Banana 2", isAvailable: false, statusText: "No unlimited" },
      { title: "Kling 3.0", isAvailable: false, statusText: "No unlimited" },
    ],
    seedanceSection: {
      hasAccess: false,
      badgeTitle: "NO ACCESS TO SEEDANCE 2.5",
      badgeSubtitle: "Available from Pro plan",
      models: [
        { name: "Seedance 2.5", status: "No access", isAvailable: false },
        { name: "Seedance 2.0", status: "Credit based", isAvailable: true }
      ]
    },
    classQueuePriority: {
      boost: 10,
      label: "10 Priority Boost"
    },
    ecosystemPerks: [
      {
        title: "100% Free Online Classes + 10 Boost Queue",
        desc: "Full course library + free verified certificates + +10 queue boost for live batch seats",
        icon: GraduationCap,
        highlight: true
      },
      {
        title: "100% Free Job Portal & Verified Badge",
        desc: "Priority application status on verified company listings",
        icon: Briefcase,
        highlight: true
      },
      {
        title: "Celoris Café & TV Full Access",
        desc: "Join community lounges and live masterclass streams",
        icon: Tv
      },
      {
        title: "Commercial Use Rights",
        desc: "Full commercial licensing for all generated outputs",
        icon: ShieldCheck
      }
    ]
  },
  {
    id: "pro",
    name: "PRO",
    subtitle: "For everyday AI creation",
    badge: {
      text: "21% OFF",
      variant: "pink"
    },
    creditOptions: [
      {
        credits: 600,
        nanoBananaGenerations: 300,
        seedanceVideos: 27,
        annualPrice: 1999,
        monthlyPrice: 2499,
        originalAnnualPrice: 2499,
        originalMonthlyPrice: 2499
      },
      {
        credits: 900,
        nanoBananaGenerations: 450,
        seedanceVideos: 40,
        annualPrice: 2899,
        monthlyPrice: 3599,
        originalAnnualPrice: 3599,
        originalMonthlyPrice: 3599
      }
    ],
    annualPrice: 1999,
    monthlyPrice: 2499,
    originalAnnualPrice: 2499,
    originalMonthlyPrice: 2499,
    buttonText: "Get Pro",
    buttonStyle: "lime",
    buttonHref: "/register?plan=pro",
    noteBelowButton: "Save ₹6,000 compared to monthly",
    unlimitedGens: [
      { title: "Higgsfield Genjutsu", resolution: "720p", badge: "3 free gens", isAvailable: true },
      { title: "Nano Banana Pro", isAvailable: false, statusText: "No unlimited" },
      { title: "Nano Banana 2", resolution: "2K", badge: "7-day unlimited", isAvailable: true },
      { title: "Kling 3.0", badge: "7-day unlimited", isAvailable: true }
    ],
    extraModelsCount: 7,
    seedanceSection: {
      hasAccess: true,
      badgeTitle: "ACCESS TO SEEDANCE MODELS",
      badgeSubtitle: "Full line-up included",
      models: [
        { name: "Seedance 2.5", resolution: "1080p", status: "Full access", isAvailable: true },
        { name: "Seedance 2.0", resolution: "4K", status: "Full access", isAvailable: true }
      ]
    },
    classQueuePriority: {
      boost: 50,
      label: "50 Priority Boost"
    },
    ecosystemPerks: [
      {
        title: "100% Free Online Classes + 50 Boost Queue",
        desc: "All classes free + +50 priority queue boost for live class seats & exclusive mentor AMA sessions",
        icon: GraduationCap,
        highlight: true
      },
      {
        title: "Free Job Portal + Featured Talent Tag",
        desc: "Stand out to hiring managers with direct client introductions",
        icon: Briefcase,
        highlight: true
      },
      {
        title: "Turbo GPU Priority Queue",
        desc: "Skip public render queues for ultra-fast generation",
        icon: Zap
      },
      {
        title: "PolyVault 3D Asset Vault",
        desc: "Full downloadable library of 3D meshes & PBR materials",
        icon: Box
      }
    ]
  },
  {
    id: "max",
    name: "MAX",
    subtitle: "For ambitious AI projects",
    badge: {
      text: "25% OFF",
      variant: "pink"
    },
    bestValueBadge: true,
    creditOptions: [
      {
        credits: 1800,
        nanoBananaGenerations: 900,
        seedanceVideos: 80,
        annualPrice: 4999,
        monthlyPrice: 6699,
        originalAnnualPrice: 6699,
        originalMonthlyPrice: 6699
      },
      {
        credits: 3600,
        nanoBananaGenerations: 1800,
        seedanceVideos: 160,
        annualPrice: 9499,
        monthlyPrice: 12499,
        originalAnnualPrice: 12499,
        originalMonthlyPrice: 12499
      },
      {
        credits: 5400,
        nanoBananaGenerations: 2700,
        seedanceVideos: 240,
        annualPrice: 13999,
        monthlyPrice: 17999,
        originalAnnualPrice: 17999,
        originalMonthlyPrice: 17999
      }
    ],
    annualPrice: 4999,
    monthlyPrice: 6699,
    originalAnnualPrice: 6699,
    originalMonthlyPrice: 6699,
    buttonText: "Get Max",
    buttonStyle: "magenta",
    buttonHref: "/register?plan=max",
    noteBelowButton: "Save ₹20,400 compared to monthly",
    unlimitedGens: [
      { title: "Higgsfield Genjutsu", resolution: "720p", badge: "3 free gens", isAvailable: true },
      { title: "Nano Banana Pro", resolution: "2K", badge: "7-day unlimited", isAvailable: true },
      { title: "Nano Banana 2", resolution: "2K", badge: "7-day unlimited", isAvailable: true },
      { title: "Kling 3.0", badge: "7-day unlimited", isAvailable: true }
    ],
    extraModelsCount: 7,
    seedanceSection: {
      hasAccess: true,
      badgeTitle: "ACCESS TO SEEDANCE MODELS",
      badgeSubtitle: "Full line-up included",
      models: [
        { name: "Seedance 2.5", resolution: "1080p", status: "Full access", isAvailable: true },
        { name: "Seedance 2.0", resolution: "4K", status: "Full access", isAvailable: true }
      ]
    },
    parallelGens: "Parallel generations: up to 3 videos & 8 images concurrently",
    classQueuePriority: {
      boost: 100,
      label: "100 VIP Priority Boost"
    },
    ecosystemPerks: [
      {
        title: "100% Free Classes + 100 VIP Boost Queue",
        desc: "All classes free + +100 VIP queue boost for instant batch access & 1-on-1 trainer portfolio reviews",
        icon: GraduationCap,
        highlight: true
      },
      {
        title: "Free Job Portal + Certified Spotlight",
        desc: "Highlighted profile on company recruiter searches with 0% fees",
        icon: Briefcase,
        highlight: true
      },
      {
        title: "Dedicated Ultra-Fast GPU Nodes",
        desc: "Highest render throughput & maximum parallel generations",
        icon: Zap
      },
      {
        title: "VIP Concierge & Custom Assets",
        desc: "Priority direct help, custom workflows & enterprise-ready support",
        icon: Crown
      }
    ]
  }
]
