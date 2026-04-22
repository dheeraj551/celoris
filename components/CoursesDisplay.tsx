"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  BookOpen,
  GraduationCap,
  Clock,
  User,
  Star,
  Play,
  ChevronRight,
  Users,
  Award,
  CheckCircle
} from "lucide-react"

interface Course {
  id: string
  title: string
  subject: string
  grade_level: string
  description: string
  target_audience: string
  instructor_name: string | null
  course_duration: string | null
  price: number
  course_image_url: string | null
  is_featured: boolean
  created_at: string
  course_modules?: CourseModule[]
}

interface CourseModule {
  id: string
  module_number: number
  title: string
  description: string | null
  estimated_duration: number | null
  is_published: boolean
  course_topics?: CourseTopic[]
}

interface CourseTopic {
  id: string
  order_in_module: number
  title: string
  short_description: string
  content_type: string
  estimated_duration: number | null
  status: string
  is_free_preview: boolean
}

interface CoursesDisplayProps {
  subject?: string
  grade_level?: string
  featured?: boolean
  limit?: number
  page?: number
  onTotalChange?: (total: number) => void
  layout?: 'grid' | 'list'
  showStats?: boolean
  className?: string
  search?: string
}

export default function CoursesDisplay({
  subject,
  grade_level,
  featured = false,
  limit = 6,
  page = 1,
  onTotalChange,
  layout = 'grid',
  showStats = true,
  className = "",
  search = ""
}: CoursesDisplayProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCourses()
  }, [subject, grade_level, featured, limit, page, search])

  // Static courses definition
  const staticCourses: Course[] = [
    {
      id: 'agentic-ai-masterclass-static',
      title: 'Celoris · 2026 Edition | Agentic AI Masterclass',
      subject: 'Artificial Intelligence',
      grade_level: 'Advanced',
      description: 'Build, deploy, and scale real-world AI agents — from foundations to multi-agent pipelines. Designed for developers, product builders, and tech-forward professionals.',
      target_audience: 'Developers, Product Builders, Tech-forward Professionals',
      instructor_name: 'Celoris Team',
      course_duration: '~60 hrs total',
      price: 4999,
      course_image_url: '/agentic-ai-masterclass-feature.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(8).fill(null).map((_, i) => ({
        id: `aaim-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 450,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'sovereign-intelligence-static',
      title: 'Sovereign Intelligence: Building Your Private, Local, & Uncensored AI Knowledge Base',
      subject: 'Artificial Intelligence',
      grade_level: 'Intermediate to Advanced',
      description: 'Master the art of local AI. Build your own private, air-gapped knowledge base using Ollama, PrivateGPT, and RAG. Escape the cloud and claim your digital sovereignty.',
      target_audience: 'AI Engineers, Researchers, Privacy Advocates',
      instructor_name: 'Celoris Designs',
      course_duration: '6 Weeks (Intensive)',
      price: 24999,
      course_image_url: 'https://img.youtube.com/vi/ynZOXVGFjyA/maxresdefault.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(5).fill(null).map((_, i) => ({
        id: `sovereign-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'social-media-marketing-ai-static',
      title: '📱 Social Media Marketing with AI — 2025 Mastery Course',
      subject: 'Marketing',
      grade_level: 'Beginner to Pro',
      description: 'Master AI-powered content, strategy, and ads for social media. Build high-converting funnels with 10+ AI tools.',
      target_audience: 'Marketers, Entrepreneurs, Creators, Business Owners',
      instructor_name: 'Celoris Team',
      course_duration: '40 Hours',
      price: 1999,
      course_image_url: '/social-media-ai-hero.png',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(8).fill(null).map((_, i) => ({
        id: `smmai-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 300,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'social-media-marketing-pro-training-static',
      title: '🚀 Social Media Marketing Pro — Canva, AI & Automation',
      subject: 'Marketing',
      grade_level: 'Professional',
      description: 'Master AI-powered content creation, Canva design, and email automation in this comprehensive 10-hour training program.',
      target_audience: 'Entrepreneurs, Small Business Owners, Freelancers, Digital Marketers',
      instructor_name: 'Celoris Team',
      course_duration: '10 Hours',
      price: 2499,
      course_image_url: '/smm-pro-hero.png',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(8).fill(null).map((_, i) => ({
        id: `smmp-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 75,
        is_published: true,
        course_topics: Array(5).fill(null).map((_, j) => ({
          id: `smmp-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 15,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: 'bollywood-guitar-beginners-static',
      title: '🎸 BOLLYWOOD GUITAR — Complete Beginners 8-Week Course (India 2026)',
      subject: 'Music',
      grade_level: 'Beginner',
      description: 'Master Bollywood and Hindi film songs on acoustic guitar. Designed for complete beginners with 30 minutes of daily practice.',
      target_audience: 'Complete beginners, Students, Professionals',
      instructor_name: 'Celoris Team',
      course_duration: '8 Weeks',
      price: 1999,
      course_image_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=800',
      is_featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'speak-with-confidence-static',
      title: '🗣️ SPEAK WITH CONFIDENCE — A Complete Spoken English Course for Beginners',
      subject: 'Soft Skills',
      grade_level: 'Beginner',
      description: 'Master Spoken English in 8 weeks. Comprehensive program covering Pronunciation, Grammar, Fluency, and Business English for absolute beginners.',
      target_audience: 'Students, Working Professionals, Beginners',
      instructor_name: 'Celoris Team',
      course_duration: '8 Weeks',
      price: 2999,
      course_image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800',
      is_featured: true,
      created_at: new Date().toISOString()
    },
    {
      id: 'personalized-ai-experiences-static',
      title: 'Personalized AI Experiences with RAG & Agents',
      subject: 'Artificial Intelligence',
      grade_level: 'Intermediate to Advanced',
      description: 'Build AI that knows your users, remembers their history, and anticipates their needs. Master RAG, memory systems, and agentic workflows.',
      target_audience: 'AI Engineers, Developers, Product Leaders',
      instructor_name: 'Celoris Designs',
      course_duration: '6-Week Self-Paced',
      price: 19999,
      course_image_url: 'https://img.youtube.com/vi/ZwqAdQsXy3A/maxresdefault.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(6).fill(null).map((_, i) => ({
        id: `personalized-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'architecting-trust-static',
      title: 'Architecting Trust: AI Safety, Ethics & Compliance',
      subject: 'Artificial Intelligence',
      grade_level: 'Advanced',
      description: 'Master the frameworks, tools, and legal requirements necessary to deploy predictable, compliant, and ethical AI systems.',
      target_audience: 'AI Engineers, Compliance Officers, Managers',
      instructor_name: 'Celoris Designs',
      course_duration: '6-8 Weeks',
      price: 21999,
      course_image_url: 'https://img.youtube.com/vi/CdCAuee0qyI/maxresdefault.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(6).fill(null).map((_, i) => ({
        id: `trust-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'mastering-multimodal-ai-static',
      title: 'Mastering Multimodal AI: Engineering Vision, Audio, and Language Fusion Systems',
      subject: 'Artificial Intelligence',
      grade_level: 'Advanced',
      description: 'Transition from LLM-centric thinking to Large Multimodal Model (LMM) engineering. Learn to align pixels, waveforms, and tokens into a shared latent space.',
      target_audience: 'AI Engineers, Data Scientists, Deep Learning Researchers',
      instructor_name: 'Celoris Designs',
      course_duration: '8-10 Weeks',
      price: 24999,
      course_image_url: 'https://img.youtube.com/vi/G_eFurGI3Go/maxresdefault.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(5).fill(null).map((_, i) => ({
        id: `mmai-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'building-model-native-agent-systems-static',
      title: 'Building Model-Native Agent Systems (End-to-End)',
      subject: 'Artificial Intelligence',
      grade_level: 'Advanced (Level 400+)',
      description: 'Move from System-Centric orchestration to Model-Centric agency. Master internal planning, native tool-use, and persistent latent state for autonomous agents.',
      target_audience: 'AI Engineers, Advanced Developers, Research Engineers',
      instructor_name: 'Celoris Designs',
      course_duration: '8 Weeks (Accelerated)',
      price: 29999,
      course_image_url: 'https://img.youtube.com/vi/MoZQeCYorns/maxresdefault.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(6).fill(null).map((_, i) => ({
        id: `bmnas-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'vibe-coding-mastery-static',
      title: 'Vibe Coding Mastery: Build Apps Using AI-First Development Workflows',
      subject: 'Artificial Intelligence',
      grade_level: 'Intermediate',
      description: 'Learn to 10x your output by mastering the 2026 paradigm of Vibe Coding. Ship production-ready apps with 95% AI-generated code.',
      target_audience: 'Developers, No-code makers, Bootcamp grads',
      instructor_name: 'Celoris Designs',
      course_duration: '4-6 Weeks',
      price: 19999,
      course_image_url: '/vibe-coding-mastery-cover.png',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(5).fill(null).map((_, i) => ({
        id: `vcm-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'build-ai-products-static',
      title: 'Build AI Products That Make Money (Practical Guide)',
      subject: 'Artificial Intelligence',
      grade_level: 'Professional',
      description: 'A practical guide for entrepreneurs to identify AI ideas, validate market demand, and launch profitable AI SaaS products.',
      target_audience: 'Entrepreneurs, Developers, AI Founders',
      instructor_name: 'Celoris Designs llp',
      course_duration: '12 hours',
      price: 15000,
      course_image_url: '/build-ai-products-cover.png',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(4).fill(null).map((_, i) => ({
        id: `baip-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'langchain-real-static',
      title: 'LangChain in Action: Real Workflows',
      subject: 'Artificial Intelligence',
      grade_level: 'Advanced',
      description: 'Master LLM orchestration by building autonomous AI agents and automation pipelines using LangChain, Tools, and Vector Databases.',
      target_audience: 'Developers, AI Engineers, Automation Specialists',
      instructor_name: 'Celoris',
      course_duration: '12 hours',
      price: 13500,
      course_image_url: 'https://img.youtube.com/vi/Fvf5k_jocUk/maxresdefault.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(4).fill(null).map((_, i) => ({
        id: `lc-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'deploy-scale-ai-static',
      title: 'Deploy & Scale AI Apps (Serverless + Edge)',
      subject: 'Artificial Intelligence',
      grade_level: 'Advanced',
      description: 'Master the transition from local AI prototype to global production. Learn to deploy on Vercel, AWS, and Cloudflare with a focus on cost optimization and edge performance.',
      target_audience: 'Developers, AI Engineers, Startup Founders',
      instructor_name: 'Celoris',
      course_duration: '10 hours',
      price: 15000,
      course_image_url: '/deploy-scale-ai-apps-cover.png',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(4).fill(null).map((_, i) => ({
        id: `deps-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 150,
        is_published: true,
        course_topics: Array(4).fill(null).map((_, j) => ({
          id: `deps-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 37,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: 'rag-unlocked-static',
      title: 'RAG Unlocked: Production-Grade Search & Answer Systems',
      subject: 'Artificial Intelligence',
      grade_level: 'Advanced',
      description: 'Master the architecture of Enterprise LLM applications. Learn to build and deploy scalable Retrieval-Augmented Generation (RAG) systems using Pinecone, Milvus, and advanced embedding strategies.',
      target_audience: 'Developers, AI Engineers, Data Scientists',
      instructor_name: 'Celoris',
      course_duration: '10 hours',
      price: 15000,
      course_image_url: 'https://img.youtube.com/vi/WPLkuo2ZgZQ/maxresdefault.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(5).fill(null).map((_, i) => ({
        id: `rag-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 120,
        is_published: true,
        course_topics: Array(4).fill(null).map((_, j) => ({
          id: `rag-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 30,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: 'llm-prompt-engineering-static',
      title: 'LLM Prompt Engineering for Real Results',
      subject: 'Artificial Intelligence',
      grade_level: 'Advanced',
      description: 'Master Advanced Prompting & Custom Model Tuning for Production-Ready Applications. Stop "chatting" with AI and start engineering it.',
      target_audience: 'Developers, AI Engineers, Data Scientists',
      instructor_name: 'Celoris',
      course_duration: '12 hours',
      price: 15000,
      course_image_url: '/llm-prompt-engineering-cover.png',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(4).fill(null).map((_, i) => ({
        id: `prompt-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: Array(4).fill(null).map((_, j) => ({
          id: `prompt-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 45,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: 'agentic-ai-systems-static',
      title: 'Agentic AI Systems: Design, Build & Deploy',
      subject: 'Artificial Intelligence',
      grade_level: 'Advanced',
      description: 'Master modern agentic systems and build multi-agent AI workflows using OpenAI, LangChain, and LangGraph.',
      target_audience: 'Developers, AI Engineers, Product Managers',
      instructor_name: 'Celoris',
      course_duration: '15 hours',
      price: 15000,
      course_image_url: '/agentic-ai-systems-cover.png',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(4).fill(null).map((_, i) => ({
        id: `agentic-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 225,
        is_published: true,
        course_topics: Array(4).fill(null).map((_, j) => ({
          id: `agentic-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 60,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: 'class-9-maths-static',
      title: 'Class 9th Mathematics: Complete Syllabus & Mastery Guide',
      subject: 'Mathematics',
      grade_level: 'Class 9',
      description: 'A comprehensive guide to Class 9 Maths covering Number Systems, Polynomials, Geometry, and Mensuration as per NCERT guidelines.',
      target_audience: 'Class 9 Students, NTSE Aspirants, Educators',
      instructor_name: 'Celoris Designs llp',
      course_duration: 'Full Year',
      price: 1999,
      course_image_url: 'https://img.youtube.com/vi/ZhIt0AVS-0I/maxresdefault.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(6).fill(null).map((_, i) => ({
        id: `c9math-m${i}`,
        module_number: i + 1,
        title: `Unit ${i + 1}`,
        description: '',
        estimated_duration: 360,
        is_published: true,
        course_topics: Array(2).fill(null).map((_, j) => ({
          id: `c9math-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 60,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: 'class-9-chemistry-static',
      title: 'Class 9 Chemistry: Complete Course Overview',
      subject: 'Chemistry',
      grade_level: 'Class 9',
      description: 'This curriculum is designed to build a foundational understanding of matter, atoms, and chemical reactions, preparing students for advanced sciences.',
      target_audience: 'Class 9 Students',
      instructor_name: 'Celoris Designs llp',
      course_duration: 'Full Year',
      price: 1999,
      course_image_url: '/class-9-chemistry-cover.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(4).fill(null).map((_, i) => ({
        id: `c9chem-m${i}`,
        module_number: i + 1,
        title: `Unit ${i + 1}`,
        description: '',
        estimated_duration: 300,
        is_published: true,
        course_topics: Array(4).fill(null).map((_, j) => ({
          id: `c9chem-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 60,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: 'class-10-chemistry-static',
      title: 'Class 10 Chemistry Full Course',
      subject: 'Chemistry',
      grade_level: 'Class 10',
      description: 'A comprehensive guide to Class 10 Chemistry covering chemical reactions, acids/bases, metals, carbon compounds, and periodic trends.',
      target_audience: 'Class 10 Students',
      instructor_name: 'Celoris Designs llp',
      course_duration: 'Full Year',
      price: 1999,
      course_image_url: '/class-10-chemistry-cover.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(5).fill(null).map((_, i) => ({
        id: `c10chem-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 300,
        is_published: true,
        course_topics: Array(4).fill(null).map((_, j) => ({
          id: `c10chem-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 60,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: 'class-11-chemistry-static',
      title: 'Class 11 Chemistry Complete Course Syllabus',
      subject: 'Chemistry',
      grade_level: 'Class 11',
      description: 'An advanced foundation in Physical, Inorganic, and Organic chemistry, covering Quantum Mechanics, Thermodynamics, and Chemical Bonding.',
      target_audience: 'Class 11 Students, JEE/NEET Aspirants',
      instructor_name: 'Celoris Designs llp',
      course_duration: 'Full Year',
      price: 2499,
      course_image_url: '/class-11-chemistry-cover.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(4).fill(null).map((_, i) => ({
        id: `c11chem-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 300,
        is_published: true,
        course_topics: Array(4).fill(null).map((_, j) => ({
          id: `c11chem-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 60,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: 'class-12-physics-static',
      title: 'Class 12th Physics Complete Course',
      subject: 'Physics',
      grade_level: 'Class 12',
      description: 'Comprehensive Physics course for Class 12 students covering Electrostatics, Optics, Magnetism, and Modern Physics.',
      target_audience: 'Grade 12 Students, JEE/NEET Aspirants',
      instructor_name: 'Celoris Designs llp',
      course_duration: 'Full Year',
      price: 2499,
      course_image_url: '/class-12-physics-cover.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(9).fill(null).map((_, i) => ({
        id: `c12-m${i}`,
        module_number: i + 1,
        title: `Unit ${i + 1}`,
        description: '',
        estimated_duration: 600,
        is_published: true,
        course_topics: Array(2).fill(null).map((_, j) => ({
          id: `c12-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 60,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: 'class-11-physics-static',
      title: 'Class 11 Physics: Comprehensive Course Syllabus (2025-26)',
      subject: 'Physics',
      grade_level: 'Class 11',
      description: 'Comprehensive annual course covering Mechanics, Thermodynamics, and Oscillations for CBSE, JEE, and NEET.',
      target_audience: 'Class 11 Science Students',
      instructor_name: 'Celoris Designs llp',
      course_duration: 'Full Year',
      price: 2499,
      course_image_url: '/class-11-physics-cover.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(10).fill(null).map((_, i) => ({
        id: `c11-m${i}`,
        module_number: i + 1,
        title: `Unit ${i + 1}`,
        description: '',
        estimated_duration: 600, // 10 hours per unit -> 6000 mins total
        is_published: true,
        course_topics: Array(3).fill(null).map((_, j) => ({
          id: `c11-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 60,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: 'class-10-physics-static',
      title: 'Class 10 Physics Master Course: Light, Electricity, Magnetism & Energy',
      subject: 'Physics',
      grade_level: 'Class 10',
      description: 'Master Class 10 Physics with this comprehensive course covering Light, Electricity, Magnetic Effects, and Sources of Energy.',
      target_audience: 'Class 10 Students',
      instructor_name: 'Celoris Designs llp',
      course_duration: '4 months',
      price: 1500,
      course_image_url: '/class-10-physics-cover.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(5).fill(null).map((_, i) => ({
        id: `c10-m${i}`,
        module_number: i + 1,
        title: `Chapter ${i + 1}`,
        description: '',
        estimated_duration: 480, // ~2400 mins total
        is_published: true,
        course_topics: Array(4).fill(null).map((_, j) => ({
          id: `c10-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 60,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: 'b65a0bc8-2e86-4170-9a3c-91c4050de31f', // Using the ID from the previous code snippet for the redirect to work
      title: 'Class 9 Physics Made Simple: Motion, Forces, Energy & Sound',
      subject: 'Physics',
      grade_level: 'Class 9',
      description: 'Build a strong foundation in Physics with clear concepts, solved numericals, and real-life examples.',
      target_audience: 'Class 9 Students',
      instructor_name: 'Celoris Designs llp',
      course_duration: '3 months',
      price: 1500,
      course_image_url: '/class-9-physics-cover.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(5).fill(null).map((_, i) => ({
        id: `c9-m${i}`,
        module_number: i + 1,
        title: `Chapter ${i + 1}`,
        description: '',
        estimated_duration: 360, // ~1800 mins total
        is_published: true,
        course_topics: Array(3).fill(null).map((_, j) => ({
          id: `c9-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 60,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: "online-hatha-yoga-classes-beginners-static",
      title: "Online Hatha Yoga Classes for Beginners — Live Sessions with Certified Trainer",
      subject: "Yoga",
      grade_level: "Beginner",
      description: "Learn authentic Hatha Yoga from a certified trainer — live online sessions, small batches, beginner friendly. Complete 8-week foundation programme.",
      target_audience: "Working Professionals, Homemakers, Students",
      instructor_name: "Celoris Certified Trainer",
      course_duration: "8 Weeks",
      price: 4999,
      course_image_url: "/hatha-yoga-foundation.png",
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(4).fill(null).map((_, i) => ({
        id: `yoga-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: '28-day-reset-static',
      title: 'The 28-Day Reset: Foundation Strength & Mobility',
      subject: 'Fitness',
      grade_level: 'Beginner',
      description: 'A 4-week functional strength and mobility program for beginners. Master the Big Five movements to build muscle and improve posture.',
      target_audience: 'Fitness Beginners',
      instructor_name: 'Celoris Designs llp',
      course_duration: '4 Weeks',
      price: 3999,
      course_image_url: '/28-day-reset-cover.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(2).fill(null).map((_, i) => ({
        id: `reset-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 120,
        is_published: true,
        course_topics: Array(3).fill(null).map((_, j) => ({
          id: `reset-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 40,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: 'class-12-chemistry-static',
      title: 'Class 12 Chemistry: Advanced Applications & Organic Synthesis',
      subject: 'Chemistry',
      grade_level: 'Class 12',
      description: 'This course provides an in-depth exploration of Physical, Inorganic, and Organic Chemistry, with a heavy emphasis on reaction kinetics and functional group transformations.',
      target_audience: 'Class 12 Students, JEE/NEET Aspirants',
      instructor_name: 'Celoris Designs llp',
      course_duration: 'Full Year',
      price: 2999,
      course_image_url: '/class-12-chemistry-cover.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(4).fill(null).map((_, i) => ({
        id: `c12chem-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 450,
        is_published: true,
        course_topics: Array(4).fill(null).map((_, j) => ({
          id: `c12chem-m${i}-t${j}`,
          order_in_module: j + 1,
          title: `Topic ${j + 1}`,
          short_description: '',
          content_type: 'video',
          estimated_duration: 60,
          status: 'published',
          is_free_preview: false
        }))
      }))
    },
    {
      id: 'livekit-ai-agents-static',
      title: 'Build Real-Time AI Agents with LiveKit',
      subject: 'Artificial Intelligence',
      grade_level: 'Professional',
      description: 'Learn how to build low-latency voice AI agents using LiveKit, OpenAI GPT-4o-Realtime, and WebRTC. Master STT/TTS integration and scalable deployment.',
      target_audience: 'Developers, AI Engineers',
      instructor_name: 'Celoris Designs llp',
      course_duration: '10 hours',
      price: 14999,
      course_image_url: '/livekit-ai-agents-cover.png',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: [
        {
          id: 'lk-m1',
          module_number: 1,
          title: 'LiveKit Ecosystem & Real-Time Fundamentals',
          description: 'Architecture and SFU basics',
          estimated_duration: 150,
          is_published: true,
          course_topics: []
        },
        {
          id: 'lk-m2',
          module_number: 2,
          title: 'The Multi-Modal AI Pipeline',
          description: 'STT, LLM, and TTS integration',
          estimated_duration: 150,
          is_published: true,
          course_topics: []
        },
        {
          id: 'lk-m3',
          module_number: 3,
          title: 'Building the Brain',
          description: 'Logic and State Management',
          estimated_duration: 150,
          is_published: true,
          course_topics: []
        },
        {
          id: 'lk-m4',
          module_number: 4,
          title: 'Scaling & Deployment',
          description: 'Production strategies',
          estimated_duration: 150,
          is_published: true,
          course_topics: []
        }
      ]
    },
    {
      id: 'agentic-ai-cybersecurity-static',
      title: 'Agentic AI for Cybersecurity: Building and Scaling Autonomous Defense & Automation Systems',
      subject: 'Artificial Intelligence',
      grade_level: 'Advanced',
      description: 'Build Agentic Systems for cybersecurity. Learn to reduce Tier 1 burnout by delegating triage, investigation, and remediation to specialized AI agents.',
      target_audience: 'Security Engineers, SOC Analysts, AI Developers',
      instructor_name: 'Celoris Designs',
      course_duration: '6-8 Weeks',
      price: 29999,
      course_image_url: 'https://img.youtube.com/vi/Y72t0L4wdsE/maxresdefault.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(5).fill(null).map((_, i) => ({
        id: `acyber-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'accelerating-science-static',
      title: 'Accelerating Science: Generative AI for Research & Innovation',
      subject: 'Artificial Intelligence',
      grade_level: 'Advanced',
      description: 'Equip scientists and research engineers with tactical AI skills for literature review, experiment automation, and molecular prediction.',
      target_audience: 'Scientists, Research Engineers, R&D Leads',
      instructor_name: 'Celoris Designs',
      course_duration: '8-Week Intensive',
      price: 24999,
      course_image_url: 'https://img.youtube.com/vi/57LQCUE2FWk/maxresdefault.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(8).fill(null).map((_, i) => ({
        id: `as-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'arjuna-ssc-jee-bridge-static',
      title: 'Arjuna Integrated: The SSC-JEE Bridge',
      subject: 'Mathematics',
      grade_level: 'SSC-JEE Integrated',
      description: 'Master Algebra, Trigonometry, Geometry, and Statistics. This course bridges the gap between competitive exams like SSC and JEE, focusing on overlapping core concepts with dual-value learning.',
      target_audience: 'SSC and JEE Aspirants',
      instructor_name: 'Celoris Designs',
      course_duration: '8 Weeks',
      price: 4999,
      course_image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070&auto=format&fit=crop',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: [
        {
          id: 'arjuna-m1',
          module_number: 1,
          title: 'Phase 1: Foundations',
          description: 'Arithmetic foundations and basic algebraic structures.',
          estimated_duration: 360,
          is_published: true,
          course_topics: [
            { id: 'arjuna-m1-t1', order_in_module: 1, title: 'Progressions and Series', short_description: 'AP, GP, and their respective means.', content_type: 'video', estimated_duration: 120, status: 'published', is_free_preview: true },
            { id: 'arjuna-m1-t2', order_in_module: 2, title: 'Quadratic Equations', short_description: 'Real/complex roots, coefficients, and nature of roots.', content_type: 'video', estimated_duration: 120, status: 'published', is_free_preview: false },
            { id: 'arjuna-m1-t3', order_in_module: 3, title: 'Set Theory', short_description: 'Venn diagrams, union, intersection, and practical problems.', content_type: 'video', estimated_duration: 120, status: 'published', is_free_preview: false },
          ]
        },
        {
          id: 'arjuna-m2',
          module_number: 2,
          title: 'Phase 2: Geometry and Measurement',
          description: 'Visualising shapes and understanding coordinate systems.',
          estimated_duration: 360,
          is_published: true,
          course_topics: [
            { id: 'arjuna-m2-t1', order_in_module: 1, title: 'Cartesian Coordinate Geometry', short_description: 'Distance formula, section formula, slope, and triangle centers.', content_type: 'video', estimated_duration: 120, status: 'published', is_free_preview: false },
            { id: 'arjuna-m2-t2', order_in_module: 2, title: 'Trigonometric Foundations', short_description: 'Functions, identities, periodicity, and Heights and Distances.', content_type: 'video', estimated_duration: 120, status: 'published', is_free_preview: false },
            { id: 'arjuna-m2-t3', order_in_module: 3, title: 'Circles and Conics', short_description: 'Standard equations, tangents, Parabolas, and Ellipses.', content_type: 'video', estimated_duration: 120, status: 'published', is_free_preview: false },
          ]
        },
        {
          id: 'arjuna-m3',
          module_number: 3,
          title: 'Phase 3: Data and Advanced Algebra',
          description: 'Handling uncertainty and structured data.',
          estimated_duration: 360,
          is_published: true,
          course_topics: [
            { id: 'arjuna-m3-t1', order_in_module: 1, title: 'Statistics and Measures of Dispersion', short_description: 'Mean, Median, Mode, Variance, and Standard Deviation.', content_type: 'video', estimated_duration: 120, status: 'published', is_free_preview: false },
            { id: 'arjuna-m3-t2', order_in_module: 2, title: 'Probability Basics', short_description: 'Random experiments, sample spaces, and Bayes’ Theorem.', content_type: 'video', estimated_duration: 120, status: 'published', is_free_preview: false },
            { id: 'arjuna-m3-t3', order_in_module: 3, title: 'Matrices and Determinants', short_description: 'Matrix operations and solving linear equations.', content_type: 'video', estimated_duration: 120, status: 'published', is_free_preview: false },
          ]
        },
        {
          id: 'arjuna-m4',
          module_number: 4,
          title: 'Phase 4: Advanced Calculus Overview',
          description: 'Analytical edge for SSC Tier 2 and essential for JEE.',
          estimated_duration: 240,
          is_published: true,
          course_topics: [
            { id: 'arjuna-m4-t1', order_in_module: 1, title: 'Limits and Continuity', short_description: 'Limits at a real number and L’Hospital’s Rule.', content_type: 'video', estimated_duration: 120, status: 'published', is_free_preview: false },
            { id: 'arjuna-m4-t2', order_in_module: 2, title: 'Application of Derivatives', short_description: 'Maxima, Minima, and rate of change optimization.', content_type: 'video', estimated_duration: 120, status: 'published', is_free_preview: false },
          ]
        }
      ]
    },
    {
      id: "content-creation-social-media-static",
      title: "Content Creation on Social Media — From Creator to Income",
      subject: "Marketing",
      grade_level: "Intermediate",
      description: "Stop posting for likes. Start creating for money. Master Instagram and YouTube content creation, growth, and monetisation in this comprehensive 19-hour course.",
      target_audience: "Creators, Influencers, Businesses, Freelancers",
      instructor_name: "Dheeraj Kushwaha",
      course_duration: "19 Hours",
      price: 4999,
      course_image_url: "/content-creation-cover.png",
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(5).fill(null).map((_, i) => ({
        id: `ccsm-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: "",
        estimated_duration: 228,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: "excel-expert-master-static",
      title: "Be an Excel Expert — From Beginner to Macro Master",
      subject: "Business",
      grade_level: "All Levels",
      description: "The same course that has trained 682+ students and earned 229 verified reviews — now available on Celoris. Taught by Dheeraj Kushwaha.",
      target_audience: "Working Professionals, Students, Entrepreneurs",
      instructor_name: "Dheeraj Kushwaha",
      course_duration: "10 Hours",
      price: 0,
      course_image_url: "/excel-expert-cover.png",
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(4).fill(null).map((_, i) => ({
        id: `excel-m${i}`,
        module_number: i + 1,
        title: `Level ${i + 1}`,
        description: "",
        estimated_duration: 150,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: "blender-3d-modelling-beginners-static",
      title: "Blender 3D Modelling — Complete Beginner Course",
      subject: "Design",
      grade_level: "Beginner",
      description: "From zero to your first 3D model — no experience needed. Build real 3D models confidently for ecommerce, architecture, and social media.",
      target_audience: "Complete Beginners, Designers, Freelancers",
      instructor_name: "Dheeraj Kushwaha",
      course_duration: "15 Hours",
      price: 5999,
      course_image_url: "/blender-course-cover.png",
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(5).fill(null).map((_, i) => ({
        id: `blender-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: "",
        estimated_duration: 180,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'python-mega-course-static',
      title: '🐍 Python Mega Course: Build 20 Real-World Apps & AI Agents',
      subject: 'Artificial Intelligence',
      grade_level: 'Beginner to Advanced',
      description: 'Master Python from zero to AI Developer. Build 20 real-world apps and 5 intelligent AI agents using OpenAI, LangChain, and Ollama. 80+ hours of hands-on content.',
      target_audience: 'Beginners, Professionals, Entrepreneurs',
      instructor_name: 'Dheeraj Kushwaha',
      course_duration: '80+ Hours',
      price: 19999,
      course_image_url: '/python-mega-course-hero.png',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(10).fill(null).map((_, i) => ({
        id: `pmc-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 480,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'zumba-fitness-masterclass-static',
      title: 'Zumba Fitness Masterclass: From Basics to Trainer-Ready',
      subject: 'Fitness',
      grade_level: 'Beginner to Intermediate',
      description: 'The Zumba Fitness Masterclass is a comprehensive program designed to take you from zero fitness background to a confident Zumba practitioner — and even an aspiring trainer. Led by Jatin Arora, this course blends international Zumba rhythms with Bollywood and Indian dance fitness styles.',
      target_audience: 'Fitness beginners, Zumba enthusiasts, aspiring Zumba trainers',
      instructor_name: 'Jatin Arora',
      course_duration: '30 Hours',
      price: 1999,
      course_image_url: '/zumba-fitness-masterclass.png',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(6).fill(null).map((_, i) => ({
        id: `zfm-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 300,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'essential-python-ai-static',
      title: 'Essential Python for AI Development',
      subject: 'Artificial Intelligence',
      grade_level: 'Beginner to Intermediate',
      description: 'A practical 10-hour curriculum taking you from Python basics to building real AI-powered applications. Master the fundamentals, data libraries, and AI APIs.',
      target_audience: 'Beginners, Aspiring AI Developers, Students',
      instructor_name: 'Celoris Team',
      course_duration: '10 Hours',
      price: 9999,
      course_image_url: '/essential-python-ai-cover.png',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(7).fill(null).map((_, i) => ({
        id: `epai-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: i === 6 ? 60 : 90,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'master-premiere-pro-ai-static',
      title: 'How to Master Adobe Premiere Pro with AI in 2026',
      subject: 'Design',
      grade_level: 'Beginner to Intermediate',
      description: 'Master the future of video editing. Learn AI-powered auto-cuts, smart trimming, AI B-roll generation, and automated workflows in Premiere Pro 2026.',
      target_audience: 'Content Creators, YouTubers, Freelancers, Marketers',
      instructor_name: 'Celoris Team',
      course_duration: '2 Weeks (30 Hours)',
      price: 14999,
      course_image_url: '/premiere-pro-ai-hero.png',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(10).fill(null).map((_, i) => ({
        id: `mppai-m${i}`,
        module_number: i + 1,
        title: `Day ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: []
      }))
    },
    {
      id: 'capcut-pro-viral-reels-static',
      title: 'CapCut Pro: Create Viral Reels in 30 Days',
      subject: 'Design',
      grade_level: 'Beginner to Intermediate',
      description: 'From zero to viral — master mobile video editing, trending effects, and content strategy.',
      target_audience: 'Content Creators, Influencers, Beginners',
      instructor_name: 'Celoris Team',
      course_duration: '30 Days',
      price: 4999,
      course_image_url: '/capcut.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(5).fill(null).map((_, i) => ({
        id: `ccp-m${i}`,
        module_number: i + 1,
        title: `Week ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: []
      }))
    }
  ]

  const loadCourses = async () => {
    try {
      setLoading(true)

      // Calculate start and end for static items based on page
      const start = (page - 1) * limit
      const end = start + limit

      const params = new URLSearchParams()
      // Always fetch enough to cover the current range if needed, 
      // but for simplicity let's fetch more or handle offset
      params.append('limit', '100')
      if (subject) params.append('subject', subject)
      if (grade_level) params.append('grade_level', grade_level)
      if (featured) params.append('featured', 'true')
      if (search) params.append('search', search)

      const response = await fetch(`/api/courses?${params.toString()}`)
      const data = response.ok ? await response.json() : { courses: [] }
      const dbCourses = data.courses || []

      // Filter static courses
      let filteredStatic = staticCourses
      if (subject) {
        const subLower = subject.toLowerCase()
        filteredStatic = filteredStatic.filter((c: Course) => c.subject.toLowerCase().includes(subLower))
      }
      if (grade_level) {
        const levelLower = grade_level.toLowerCase()
        filteredStatic = filteredStatic.filter((c: Course) => c.grade_level.toLowerCase().includes(levelLower))
      }
      if (featured) filteredStatic = filteredStatic.filter((c: Course) => c.is_featured)

      if (search) {
        const searchLower = search.toLowerCase()
        filteredStatic = filteredStatic.filter((c: Course) =>
          c.title.toLowerCase().includes(searchLower) ||
          c.description.toLowerCase().includes(searchLower) ||
          c.subject.toLowerCase().includes(searchLower)
        )
      }

      const allItems = [...filteredStatic, ...dbCourses]

      if (onTotalChange) {
        onTotalChange(allItems.length)
      }

      setCourses(allItems.slice(start, end))
    } catch (error) {
      console.error('Error loading courses:', error)
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const getCourseUrl = (id: string) => {
    if (id === 'agentic-ai-masterclass-static') return '/courses/agentic-ai-masterclass'
    if (id === 'essential-python-ai-static') return '/courses/essential-python-for-ai-development'
    if (id === 'master-premiere-pro-ai-static') return '/courses/master-premiere-pro-ai'
    if (id === 'capcut-pro-viral-reels-static') return '/courses/capcut-pro-viral-reels'
    if (id === 'vibe-coding-mastery-static') return '/courses/vibe-coding-mastery'
    if (id === 'class-12-physics-static') return '/courses/cbse-class-12-physics-complete-course'
    if (id === 'class-11-physics-static') return '/courses/cbse-class-11-physics-comprehensive-course'
    if (id === 'class-10-physics-static') return '/courses/cbse-class-10-physics-light-electricity-magnetism-energy'
    if (id === 'b65a0bc8-2e86-4170-9a3c-91c4050de31f') return '/courses/cbse-class-9-physics-motion-force-energy-sound'
    if (id === 'class-9-chemistry-static') return '/courses/cbse-class-9-chemistry-complete-course'
    if (id === 'class-10-chemistry-static') return '/courses/cbse-class-10-chemistry-complete-course'
    if (id === 'class-11-chemistry-static') return '/courses/cbse-class-11-chemistry-complete-course'
    if (id === 'class-12-chemistry-static') return '/courses/cbse-class-12-chemistry-complete-course'
    if (id === 'online-hatha-yoga-classes-beginners-static') return '/learn/online-hatha-yoga-classes-beginners'
    if (id === '28-day-reset-static') return '/courses/the-28-day-reset-foundation-strength-mobility'
    if (id === 'class-9-maths-static') return '/courses/cbse-class-9-mathematics-complete-syllabus-mastery-guide'
    if (id === 'livekit-ai-agents-static') return '/courses/build-real-time-ai-agents-with-livekit'
    if (id === 'agentic-ai-systems-static') return '/courses/agentic-ai-systems-design-build-deploy'
    if (id === 'rag-unlocked-static') return '/courses/rag-unlocked-production-grade-search-answer-systems'
    if (id === 'llm-prompt-engineering-static') return '/courses/llm-prompt-engineering-for-real-results'
    if (id === 'deploy-scale-ai-static') return '/courses/deploy-scale-ai-apps-serverless-edge'
    if (id === 'langchain-real-static') return '/courses/langchain-in-action-real-workflows'
    if (id === 'build-ai-products-static') return '/courses/build-ai-products-that-make-money-practical-guide'
    if (id === 'mastering-multimodal-ai-static') return '/courses/mastering-multimodal-ai'
    if (id === 'building-model-native-agent-systems-static') return '/courses/building-model-native-agent-systems'
    if (id === 'architecting-trust-static') return '/courses/architecting-trust-ai-safety-ethics-compliance'
    if (id === 'agentic-ai-cybersecurity-static') return '/courses/agentic-ai-for-cybersecurity'
    if (id === 'accelerating-science-static') return '/courses/accelerating-science-generative-ai-for-research-innovation'
    if (id === 'personalized-ai-experiences-static') return '/courses/personalized-ai-experiences-with-rag-and-agents'
    if (id === 'sovereign-intelligence-static') return '/courses/sovereign-intelligence'
    if (id === 'arjuna-ssc-jee-bridge-static') return '/courses/arjuna-ssc-jee-bridge'
    if (id === 'excel-expert-master-static') return '/learn/be-an-excel-expert'
    if (id === 'content-creation-social-media-static') return '/learn/content-creation-social-media'
    if (id === 'blender-3d-modelling-beginners-static') return '/learn/blender-3d-modelling-beginners'
    if (id === 'bollywood-guitar-beginners-static') return '/courses/bollywood-guitar-for-beginners'
    if (id === 'speak-with-confidence-static') return '/learn/speak-with-confidence'
    if (id === 'social-media-marketing-pro-training-static') return '/courses/social-media-marketing-professional-training'
    if (id === 'social-media-marketing-ai-static') return '/courses/social-media-marketing-with-ai'
    if (id === 'zumba-fitness-masterclass-static') return '/courses/zumba-fitness-masterclass'
    return `/learn/course/${id}`
  }

  const getTotalTopics = (course: Course) => {
    return course.course_modules?.reduce((total, module) => {
      return total + (module.course_topics?.length || 0)
    }, 0) || 0
  }

  const getTotalDuration = (course: Course) => {
    return course.course_modules?.reduce((total, module) => {
      return total + (module.estimated_duration || 0)
    }, 0) || 0
  }

  const formatDuration = (totalMinutes: number) => {
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    const seconds = 0

    const pad = (num: number) => num.toString().padStart(2, '0')
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
  }

  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course: Course) => (
        <Card key={course.id} className={`hover:shadow-lg transition-shadow ${className}`}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-2">
                  <GraduationCap className="w-5 h-5 text-green-600" />
                  {course.title}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  {course.subject} • {course.grade_level}
                </CardDescription>
              </div>
              {course.is_featured && (
                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                  <Star className="w-3 h-3" />
                  Featured
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              {course.instructor_name && (
                <div className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {course.instructor_name}
                </div>
              )}
              {course.course_duration && (
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {course.course_duration}
                </div>
              )}
            </div>
          </CardHeader>
          {
            course.course_image_url && (
              <div className="w-full h-48 overflow-hidden bg-gray-100">
                <img
                  src={course.course_image_url}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e: any) => {
                    e.currentTarget.src = "https://placehold.co/600x400?text=Course+Image";
                    e.currentTarget.onerror = null;
                  }}
                />
              </div>
            )
          }
          < CardContent className="pt-0" >
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {course.description}
            </p>

            {showStats && (
              <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {course.course_modules?.length || 0}
                  </div>
                  <div className="text-xs text-gray-500">Modules</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {getTotalTopics(course)}
                  </div>
                  <div className="text-xs text-gray-500">Topics</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-600">
                    {formatDuration(getTotalDuration(course))}
                  </div>
                  <div className="text-xs text-gray-500">Duration</div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-end">
              <Link href={getCourseUrl(course.id)}>
                <Button className="bg-green-600 hover:bg-green-700" size="sm">
                  <Play className="w-4 h-4 mr-2" />
                  View Course
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card >
      ))
      }
    </div >
  )

  const renderList = () => (
    <div className="space-y-4">
      {courses.map((course: Course) => (
        <Card key={course.id} className={`hover:shadow-md transition-shadow ${className}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-green-600" />
                    {course.title}
                    {course.is_featured && (
                      <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                  </CardTitle>
                </div>
                <div className="text-gray-600 mb-3">
                  {course.subject} • {course.grade_level}
                </div>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                  {course.instructor_name && (
                    <div className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {course.instructor_name}
                    </div>
                  )}
                  {course.course_duration && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {course.course_duration}
                    </div>
                  )}
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" />
                    {course.course_modules?.length || 0} modules
                  </div>
                  <div className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    {getTotalTopics(course)} topics
                  </div>
                </div>
              </div>
              <div className="ml-6 text-right">
                <Link href={getCourseUrl(course.id)}>
                  <Button className="bg-green-600 hover:bg-green-700" size="sm">
                    View Course
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12">
        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No courses found</h3>
        <p className="text-gray-600">Check back later for new courses.</p>
      </div>
    )
  }

  return layout === 'grid' ? renderGrid() : renderList()
}
