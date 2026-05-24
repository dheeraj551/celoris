import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, User, Clock, ChevronRight, ChevronLeft } from "lucide-react"
import { createServerClient } from "@/lib/supabase-server"
import { cn } from "@/lib/utils"

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author_name: string;
  published_at: string;
  category: string;
  reading_time: number;
  featured_image_url?: string;
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }> | { page?: string }
}) {
  const resolvedParams = await searchParams;
  const currentPage = parseInt(resolvedParams.page || '1', 10);
  const postsPerPage = 6;
  const supabase = (await createServerClient()) as any;

  const STATIC_POSTS: BlogPost[] = [
    {
      id: 'best-graphic-designing-course-noida',
      title: "Best Graphic Designing Course in Noida (2026) — Complete Guide",
      slug: 'best-graphic-designing-course-noida',
      excerpt: "Looking for the best graphic designing course in Noida? This guide covers top options, software, fees, portfolio tips, and career scope. Free demo available.",
      featured_image_url: '/photoshop_noida.png',
      author_name: 'Celoris Team',
      category: 'Graphic Design • Noida • Creative Career',
      reading_time: 9,
      published_at: '2026-05-24T12:00:00Z',
    },
    {
      id: 'best-python-training-noida',
      title: "Best Python Training in Noida (2026) — Complete Guide",
      slug: 'best-python-training-noida',
      excerpt: "Looking for the best Python training in Noida? This guide covers top courses, fees, curriculum, AI/ML scope, and career paths. Free demo available.",
      featured_image_url: '/python_noida.png',
      author_name: 'Celoris Team',
      category: 'Python • Noida • AI Career',
      reading_time: 9,
      published_at: '2026-05-20T12:00:00Z',
    },
    {
      id: 'adobe-photoshop-ai-guide-2025',
      title: "Adobe Photoshop with AI: The Complete Guide for Designers in 2025",
      slug: 'adobe-photoshop-ai-guide-2025',
      excerpt: "Master Firefly, Generative Fill, and Neural Filters in Photoshop CC. Learn how AI is changing the design workflow in 2025.",
      featured_image_url: '/photoshop-ai-hero.png',
      author_name: 'Celoris Expert Trainer',
      category: 'Design • AI Tools • Photoshop',
      reading_time: 8,
      published_at: '2026-05-15T12:00:00Z',
    },
    {
      id: 'build-local-ai-with-ollama-supabase-python',
      title: "Build a Local AI That Remembers You — Project Series Class 01",
      slug: 'build-local-ai-with-ollama-supabase-python',
      excerpt: "Learn how to build a private, local AI assistant using Ollama, Supabase, and Python. Runs 100% on your machine with long-term memory.",
      featured_image_url: '/Build a Local AI That.png',
      author_name: 'Celoris Team',
      category: 'Project Series • Local AI • Python',
      reading_time: 12,
      published_at: '2026-05-10T12:00:00Z',
    },
    {
      id: 'best-photoshop-training-noida',
      title: "Best Adobe Photoshop Training in Noida (2026) — Complete Guide",
      slug: 'best-photoshop-training-noida',
      excerpt: "Looking for the best Photoshop training in Noida? This guide covers top courses, fees, curriculum, and career scope. Free demo available. Book today!",
      featured_image_url: '/photoshop_noida.png',
      author_name: 'Celoris Team',
      category: 'Photoshop • Noida • Design Career',
      reading_time: 8,
      published_at: '2026-05-07T12:00:00Z',
    },
    {
      id: 'best-web-development-course-noida',
      title: "Best Web Development Course in Noida (2026) — Complete Guide",
      slug: 'best-web-development-course-noida',
      excerpt: "Looking for the best web development course in Noida? This guide covers top options, fees, curriculum, jobs, and how to choose the right trainer. Free demo available.",
      featured_image_url: '/webdev_noida.png',
      author_name: 'Celoris Team',
      category: 'Web Development • Career Guide',
      reading_time: 9,
      published_at: '2026-05-04T12:00:00Z',
    },
    {
      id: 'best-digital-marketing-course-noida',
      title: "Best Digital Marketing Course in Noida (2026) — Complete Guide",
      slug: 'best-digital-marketing-course-noida',
      excerpt: "Looking for the best digital marketing course in Noida? This guide covers top institutes, fees, modules, and career scope. Free demo available. Book now!",
      featured_image_url: '/digimarck.png',
      author_name: 'Celoris Team',
      category: 'Digital Marketing • Career Guide',
      reading_time: 8,
      published_at: '2026-05-01T12:00:00Z',
    },
    {
      id: 'best-microsoft-excel-training-noida',
      title: "Best Microsoft Excel Training in Noida (2026) — Complete Guide",
      slug: 'best-microsoft-excel-training-noida',
      excerpt: "Looking for the best Microsoft Excel training in Noida? This guide covers top courses, fees, curriculum, and how to choose the right trainer in 2026. Includes free demo offer.",
      featured_image_url: '/excel-noida.png',
      author_name: 'Celoris Team',
      category: 'Excel Training • Career Skills',
      reading_time: 8,
      published_at: '2026-04-30T12:00:00Z',
    },
    {
      id: 'how-to-go-viral-youtube-shorts-2026',
      title: "How to Go Viral on YouTube Shorts in 2026 – Complete Guide",
      slug: 'how-to-go-viral-youtube-shorts-2026',
      excerpt: "YouTube Shorts crossed 70 billion daily views in 2025, and in 2026 it's bigger than ever. Learn the structure, hooks, and algorithm secrets to go viral.",
      featured_image_url: '/goviral.png',
      author_name: 'Celoris Editorial',
      category: 'Content Creation',
      reading_time: 10,
      published_at: '2026-04-25T12:00:00Z',
    },
    {
      id: 'top-10-free-ai-video-editing-tools-india-2026',
      title: "Top 10 Free AI Video Editing Tools India 2026 — Edit Like a Pro Without Spending a Rupee",
      slug: 'top-10-free-ai-video-editing-tools-india-2026',
      excerpt: "AI has made professional-quality content accessible to everyone. Here are the top 10 free AI video editing tools Indian creators are actually using in 2026.",
      featured_image_url: '/topvideoedit.jpg',
      author_name: 'Celoris Editorial',
      category: 'Technology • AI Tools',
      reading_time: 8,
      published_at: '2026-04-24T12:00:00Z',
    },
    {
      id: 'video-editing-trends-2026-premiere-pro-tips',
      title: "Top 5 Video Editing Trends in 2026 (+ Premiere Pro Tips to Stay Ahead)",
      slug: 'video-editing-trends-2026-premiere-pro-tips',
      excerpt: "AI, vertical video, and cinematic grading are reshaping post-production. Stay ahead with these 5 trends and actionable Premiere Pro tips for 2026.",
      featured_image_url: '/videoediting.png',
      author_name: 'Celoris Editorial',
      category: 'Technology • Video Editing',
      reading_time: 10,
      published_at: '2026-04-21T12:00:00Z',
    },
    {
      id: 'the-english-sound-system',
      title: "The English Sound System — Lesson 1.1: Foundations of Pronunciation",
      slug: 'the-english-sound-system',
      excerpt: "English has 44 sounds but only 26 letters. Understand the foundation of English pronunciation, starting with the 5 vowels and the Magic-E rule.",
      featured_image_url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&q=80&w=800',
      author_name: 'Celoris Editorial',
      category: 'Spoken English • Pronunciation',
      reading_time: 8,
      published_at: '2026-04-14T12:00:00Z',
    },
    {
      id: 'how-to-start-a-dropshipping-business-in-2026',
      title: "How to Start a Dropshipping Business in 2026: A Complete Step-by-Step Guide",
      slug: 'how-to-start-a-dropshipping-business-in-2026',
      excerpt: "Launch your e-commerce journey in 2026 without a warehouse or inventory. Everything from picking a niche to driving traffic and scaling to your first lakh.",
      featured_image_url: '/blog-dropshipping-guide-2026.png',
      author_name: 'Celoris Editorial',
      category: 'Business • E-Commerce',
      reading_time: 15,
      published_at: '2026-04-08T12:00:00Z',
    },
    {
      id: 'how-to-use-canva-for-the-first-time-beginner-guide',
      title: "CANVA MASTERY SERIES — MODULE 1: How to Use Canva for the First Time",
      slug: 'how-to-use-canva-for-the-first-time-beginner-guide',
      excerpt: "Everything you need to know to navigate Canva confidently — from the dashboard to your very first design. Complete beginner's guide.",
      featured_image_url: '/blog-canva-beginner-guide.png',
      author_name: 'Celoris Editorial',
      category: 'Design • Canva',
      reading_time: 8,
      published_at: '2026-04-04T12:00:00Z',
    },
    {
      id: 'alok-kumar-digital-marketing-journey',
      title: "From Zero to Campaign Hero: How Alok Kumar's 12-Year Digital Marketing Journey Can Transform Your Career",
      slug: 'alok-kumar-digital-marketing-journey',
      excerpt: "Meet Alok Kumar, a digital marketing veteran with 12 years of experience and 500+ students trained. Learn how his expertise can help you master Google Ads, SEO, and Meta Ads.",
      featured_image_url: '/alok-kumar-digital-marketing-spotlight.png',
      author_name: 'Celoris Editorial Team',
      category: 'Trainer Spotlight',
      reading_time: 8,
      published_at: '2026-04-03T12:00:00Z',
    },
    {
      id: 'yoga-for-beginners-complete-guide',
      title: "Yoga for beginners: your complete guide to starting a practice that actually sticks",
      slug: 'yoga-for-beginners-complete-guide',
      excerpt: "Everything you need to confidently roll out your mat for the first time — from essential poses to building a home routine.",
      featured_image_url: '/blog-yoga-beginners-guide.png',
      author_name: 'Kushum Singh',
      category: 'Wellness · Yoga',
      reading_time: 8,
      published_at: '2026-04-02T12:00:00Z',
    },
    {
      id: 'excel-formulas-every-working-professional-must-know-2026',
      title: "Excel Formulas Every Working Professional Must Know in 2026",
      slug: 'excel-formulas-every-working-professional-must-know-2026',
      excerpt: "From Basic Lookups to Dynamic Arrays — Practical Excel for India's Workforce. Master VLOOKUP, XLOOKUP, Pivot Tables and more.",
      featured_image_url: '/blog-excel-formulas-2026.png',
      author_name: 'Celoris Team',
      category: 'Excel Training',
      reading_time: 15,
      published_at: '2026-03-29T12:00:00Z',
    },
    {
      id: 'metatrader-5-python-ai-trading-automation',
      title: "MetaTrader 5 + Python: The Ultimate Guide to AI Trading Automation",
      slug: 'metatrader-5-python-ai-trading-automation',
      excerpt: "How to automate Forex, Stocks, and Crypto trading using MT5 and Python AI models — The ultimate guide for Indian traders in 2026.",
      featured_image_url: '/blog-mt5-python.png',
      author_name: 'Celoris',
      category: 'Trading & Tech',
      reading_time: 12,
      published_at: '2026-03-23T12:00:00Z',
    },
    {
      id: 'how-to-start-teaching-online-in-india',
      title: "How to Start Teaching Online in India: The Complete Guide for New Trainers",
      slug: 'how-to-start-teaching-online-in-india',
      excerpt: "Thinking of teaching online in India? Learn how Celoris helps new trainers grow without per-lead charges, coin systems, or platform restrictions. Free to join.",
      featured_image_url: '/blog-how-to-start-teaching-online-in-india.png',
      author_name: 'Celoris',
      category: 'Trainer Guide',
      reading_time: 7,
      published_at: '2026-03-22T12:00:00Z',
    },
    {
      id: 'online-teaching-jobs-india-2025-26',
      title: "Online Teaching Jobs in India: How to Earn from Home by Teaching What You Know",
      slug: 'online-teaching-jobs-india-2025-26',
      excerpt: "Discover everything you need to know about online teaching in India: who is hiring, how much you can earn, and how platforms like Celoris make it easy to start today.",
      featured_image_url: '/blog-online-teaching-india-2025.png',
      author_name: 'Celoris',
      category: 'Career Guide',
      reading_time: 15,
      published_at: '2026-03-12T12:00:00Z',
    },
    {
      id: 'bollywood-zumba-dance-course-for-beginners-dheeraj-kushwaha',
      title: "Dance Your Way — Bollywood & Zumba for Complete Beginners",
      slug: 'bollywood-zumba-dance-course-for-beginners-dheeraj-kushwaha',
      excerpt: "Have you always wanted to dance like your favourite Bollywood stars but never knew where to start? Join Dheeraj Kushwaha in this 6-week Bollywood & Zumba transformation.",
      featured_image_url: '/blog-bollywood-dance.png',
      author_name: 'Celoris',
      category: 'Dance & Fitness',
      reading_time: 10,
      published_at: '2026-03-11T12:00:00Z',
    },
    {
      id: 'kya-ai-replace-kar-dega-digital-marketers-ko',
      title: "Kya AI Replace Kar Dega Digital Marketers Ko?",
      slug: 'kya-ai-replace-kar-dega-digital-marketers-ko',
      excerpt: "The Real Answer — Bina Bakwaas Ke. Find out if AI will honestly replace digital marketers and how to future-proof your career in 2026.",
      featured_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
      author_name: 'Celoris',
      category: 'Digital Marketing',
      reading_time: 8,
      published_at: '2026-03-10T12:00:00Z',
    },
    {
      id: 'building-real-time-voice-ai-livekit',
      title: "Building Real-Time Voice AI with LiveKit: The Complete Guide",
      slug: 'building-real-time-voice-ai-livekit',
      excerpt: "How to build production-grade voice agents using LiveKit Agents, Whisper, and LLMs — from WebRTC basics to deployment.",
      featured_image_url: '/livekit-ai-agents-cover.png',
      author_name: 'Celoris',
      category: 'Deep Dive • Voice AI',
      reading_time: 15,
      published_at: '2026-03-08T12:00:00Z',
    },
    {
      id: 'online-teaching-jobs-delhi-2026',
      title: "Online Teaching Jobs in Delhi: How to Start Teaching Dance, Excel & Content Creation Online in 2026",
      slug: 'online-teaching-jobs-delhi-2026',
      excerpt: "Looking for online teaching jobs in Delhi? Discover how to start teaching dance, Excel, and content creation online in 2026 with a sustainable income.",
      featured_image_url: '/blog-online-teaching-delhi-2026.png',
      author_name: 'Celoris',
      category: 'Education',
      reading_time: 10,
      published_at: '2026-03-07T12:00:00Z',
    },
    {
      id: 'learn-guitar-online-india-2026-beginners-guide',
      title: "Learn Guitar Online India 2026: The Complete Beginner's Guide",
      slug: 'learn-guitar-online-india-2026-beginners-guide',
      excerpt: "2026 is genuinely one of the best times to learn guitar online in India. This guide covers everything you need to know: which guitar to buy, how online classes work, and which platforms are worth your time.",
      featured_image_url: '/blog-guitar-online-2026.png',
      author_name: 'Celoris',
      category: 'Lifestyle',
      reading_time: 8,
      published_at: '2026-03-06T12:00:00Z',
    },
    {
      id: 'online-dance-classes-india-2026-find-the-best-dance-classes-near-you',
      title: 'Online Dance Classes India 2026 — Find the Best Dance Classes Near You',
      slug: 'online-dance-classes-india-2026-find-the-best-dance-classes-near-you',
      excerpt: "Want to learn dance but can't find good classes near you? Here's why thousands of Indians are switching to online dance classes in 2026 — and how to find the best one.",
      featured_image_url: '/blog-dance-classes-2026.png',
      author_name: 'Celoris',
      category: 'Lifestyle',
      reading_time: 10,
      published_at: '2026-03-04T19:00:00Z',
    },
    {
      id: 'free-excel-course-online-india-2026',
      title: 'Free Excel Course Online India 2026 — Zero to Job Ready',
      slug: 'free-excel-course-online-india-2026',
      excerpt: "Looking for a free Excel course online in India 2026? Learn Excel from beginner to advanced with a verified trainer — 229 reviews, 682 students trained.",
      featured_image_url: '/blog-excel-course-india-2026.png',
      author_name: 'Celoris',
      category: 'Education',
      reading_time: 12,
      published_at: '2026-03-03T12:00:00Z',
    },
    {
      id: 'best-free-online-video-editor-india-2026',
      title: 'Best Free Online Video Editor India 2026 — No Watermark, No Download',
      slug: 'best-free-online-video-editor-india-2026',
      excerpt: "Looking for the best free online video editor in India 2026? Edit videos without downloading software — no watermark, no fees.",
      featured_image_url: '/blog-video-editor-india-2026.png',
      author_name: 'Celoris',
      category: 'Technology',
      reading_time: 8,
      published_at: '2026-03-02T12:00:00Z',
    },
    {
      id: 'create-professional-videos-free',
      title: 'How to Create Professional Videos Without Expensive Software in 2025',
      slug: 'create-professional-videos-free',
      excerpt: "The complete guide for Indian students, creators and small businesses who refuse to pay ₹3,500/month for Adobe.",
      featured_image_url: '/blog-create-videos-free.png',
      author_name: 'Celoris',
      category: 'Tutorials',
      reading_time: 5,
      published_at: '2026-02-24T12:00:00Z',
    },
    {
      id: 'best-free-video-editor-india',
      title: 'Best Free Video Editing and AI Tools for Indian Creators in 2025',
      slug: 'best-free-video-editor-india',
      excerpt: "If you're an Indian creator, student or small business owner looking for a free video editor in India — this list is for you.",
      featured_image_url: '/blog-video-editor-india.png',
      author_name: 'Celoris',
      category: 'Technology',
      reading_time: 4,
      published_at: '2026-02-23T12:00:00Z',
    },
    {
      id: 'deepseek-v3-2',
      title: 'DeepSeek-V3.2: The Latest AI Model Reshaping the Industry',
      slug: 'deepseek-v3-2',
      excerpt: "Discover DeepSeek-V3.2, the latest breakthrough in AI technology. Learn about its advanced features, improved efficiency, and how it's challenging industry leaders.",
      featured_image_url: '/deepseek-v3-2.png',
      author_name: 'Celoris',
      category: 'AI Research',
      reading_time: 3,
      published_at: '2025-12-07T12:00:00Z',
    }
  ];

  let fetchedPosts: BlogPost[] = [];
  try {
    const { data: dbPosts } = await supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, featured_image_url, author_name, category, reading_time, published_at')
      .eq('status', 'published')
      .eq('is_published', true)
      .order('published_at', { ascending: false });

    fetchedPosts = dbPosts || [];
  } catch (error) {
    console.error('Error loading blog posts:', error);
  }

  // Merge static posts with fetched posts, avoiding duplicates
  let allPosts = [...fetchedPosts];
  STATIC_POSTS.forEach(staticPost => {
    if (!allPosts.some(p => p.slug === staticPost.slug)) {
      allPosts.unshift(staticPost);
    }
  });

  // Sort by date descending
  allPosts.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());

  const totalPosts = allPosts.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const paginatedPosts = allPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.celorisdesigns.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Blog",
        "item": "https://www.celorisdesigns.com/blog"
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#050810] text-slate-300 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none opacity-50" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none opacity-50" />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="container py-16 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-16">
          <div className="space-y-4">
            <Link
              href="/"
              className="group flex items-center gap-2 text-sm font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
            <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tighter">
              Celoris <span className="text-emerald-500 italic">Blog</span>
            </h1>
          </div>
          <div className="max-w-md text-left md:text-right">
            <p className="text-lg text-slate-400 font-medium leading-relaxed">
              Stay updated with the latest trends in <span className="text-white">AI</span>, <span className="text-white">creative tools</span>, and the future of <span className="text-white">digital transformation</span> in India.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          {allPosts.length === 0 ? (
            <div className="text-center py-24 bg-white/5 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
              <p className="text-slate-500 text-xl font-medium">No insights found yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-10">
              {paginatedPosts.map((post) => (
                <article
                  key={post.id}
                  className="group bg-[#0a0f1d] rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 transition-all duration-500 overflow-hidden shadow-2xl hover:shadow-emerald-500/10"
                >
                  <div className="flex flex-col lg:flex-row">
                    {/* Thumbnail */}
                    <div className="lg:w-2/5 aspect-video overflow-hidden relative">
                      <Link href={`/blog/${post.slug}`}>
                        <img
                          src={post.featured_image_url || "/images/homepage/hero.png"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </Link>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors pointer-events-none" />
                      <div className="absolute top-6 left-6">
                        <span className="bg-black/60 backdrop-blur-md text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full border border-emerald-500/30">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8 md:p-12 flex flex-col justify-center">
                      <div className="flex flex-wrap items-center gap-6 text-slate-500 text-xs font-bold uppercase tracking-widest mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                          {formatDate(post.published_at)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-emerald-500" />
                          {post.reading_time} min read
                        </div>
                      </div>

                      <h3 className="text-2xl md:text-4xl font-bold text-white mb-6 group-hover:text-emerald-400 transition-colors leading-tight tracking-tight">
                        <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                      </h3>

                      <p className="text-slate-400 text-lg leading-relaxed mb-8 line-clamp-2 italic">
                        "{post.excerpt || 'Discover more insights inside...'}"
                      </p>

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-sm border border-white/10 shadow-lg">
                            {post.author_name ? post.author_name.charAt(0) : 'C'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{post.author_name || 'Celoris'}</p>
                            <p className="text-[10px] text-emerald-500/80 font-bold uppercase tracking-tighter">Verified Creator</p>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          className="text-emerald-500 hover:text-white hover:bg-emerald-500 transition-all rounded-full px-6 font-bold uppercase tracking-widest text-[10px] gap-2 border border-emerald-500/20"
                          asChild
                        >
                          <Link href={`/blog/${post.slug}`}>
                            Read Insights
                            <ChevronRight className="h-3 w-3" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex items-center justify-center gap-4">
              <Button
                variant="outline"
                className={cn(
                  "bg-white/5 border-white/10 text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all rounded-2xl px-6 h-12 font-bold uppercase tracking-widest text-[10px] gap-2",
                  currentPage <= 1 && "opacity-50 pointer-events-none"
                )}
                asChild
              >
                <Link href={`/blog?page=${currentPage - 1}`}>
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Link>
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    className={cn(
                      "w-12 h-12 rounded-2xl font-bold transition-all",
                      currentPage === pageNum
                        ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20"
                        : "bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-emerald-500/50"
                    )}
                    asChild
                  >
                    <Link href={`/blog?page=${pageNum}`}>{pageNum}</Link>
                  </Button>
                ))}
              </div>

              <Button
                variant="outline"
                className={cn(
                  "bg-white/5 border-white/10 text-white hover:bg-emerald-500 hover:border-emerald-500 transition-all rounded-2xl px-6 h-12 font-bold uppercase tracking-widest text-[10px] gap-2",
                  currentPage >= totalPages && "opacity-50 pointer-events-none"
                )}
                asChild
              >
                <Link href={`/blog?page=${currentPage + 1}`}>
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
