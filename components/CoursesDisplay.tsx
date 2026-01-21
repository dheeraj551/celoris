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
      id: 'personalized-ai-experiences-static',
      title: 'Personalized AI Experiences with RAG & Agents',
      subject: 'Artificial Intelligence',
      grade_level: 'Intermediate to Advanced',
      description: 'Build AI that knows your users, remembers their history, and anticipates their needs. Master RAG, memory systems, and agentic workflows.',
      target_audience: 'AI Engineers, Developers, Product Leaders',
      instructor_name: 'Celoris Designs',
      course_duration: '6-Week Self-Paced',
      price: 19999,
      course_image_url: '/personalized-ai-rag-agents-cover.png',
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
      course_image_url: '/architecting-trust-ai-safety-cover.png',
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
      course_image_url: '/mastering-multimodal-ai-cover.png',
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
      course_image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800',
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
      price: 15000,
      course_image_url: '/langchain-in-action-cover.png',
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
      course_image_url: '/rag-unlocked-cover.png',
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
      course_image_url: '/class-9-maths-cover.jpg',
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
      id: 'yoga-mastery-2025-static',
      title: 'The Complete 2025 Yoga Mastery Course: From Beginner Poses to Advanced Mindfulness',
      subject: 'Yoga',
      grade_level: 'All Levels',
      description: 'This comprehensive yoga program bridges traditional Vedic wisdom with modern functional movement. Designed for all levels, it covers physical asanas, breathwork (Pranayama), and restorative techniques for stress relief.',
      target_audience: 'Yoga Practitioners',
      instructor_name: 'Celoris Designs llp',
      course_duration: '12 Weeks',
      price: 6000,
      course_image_url: '/yoga-mastery-2025-cover.jpg',
      is_featured: true,
      created_at: new Date().toISOString(),
      course_modules: Array(4).fill(null).map((_, i) => ({
        id: `yoga-m${i}`,
        module_number: i + 1,
        title: `Module ${i + 1}`,
        description: '',
        estimated_duration: 180,
        is_published: true,
        course_topics: Array(3).fill(null).map((_, j) => ({
          id: `yoga-m${i}-t${j}`,
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
      course_image_url: '/agentic-ai-cybersecurity-cover.png',
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
      course_image_url: '/accelerating-science-generative-ai-cover.png',
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
        filteredStatic = filteredStatic.filter(c => c.subject.toLowerCase().includes(subLower))
      }
      if (grade_level) {
        const levelLower = grade_level.toLowerCase()
        filteredStatic = filteredStatic.filter(c => c.grade_level.toLowerCase().includes(levelLower))
      }
      if (featured) filteredStatic = filteredStatic.filter(c => c.is_featured)

      if (search) {
        const searchLower = search.toLowerCase()
        filteredStatic = filteredStatic.filter(c =>
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
    if (id === 'vibe-coding-mastery-static') return '/courses/vibe-coding-mastery'
    if (id === 'class-12-physics-static') return '/courses/cbse-class-12-physics-complete-course'
    if (id === 'class-11-physics-static') return '/courses/cbse-class-11-physics-comprehensive-course'
    if (id === 'class-10-physics-static') return '/courses/cbse-class-10-physics-light-electricity-magnetism-energy'
    if (id === 'b65a0bc8-2e86-4170-9a3c-91c4050de31f') return '/courses/cbse-class-9-physics-motion-force-energy-sound'
    if (id === 'class-9-chemistry-static') return '/courses/cbse-class-9-chemistry-complete-course'
    if (id === 'class-10-chemistry-static') return '/courses/cbse-class-10-chemistry-complete-course'
    if (id === 'class-11-chemistry-static') return '/courses/cbse-class-11-chemistry-complete-course'
    if (id === 'class-12-chemistry-static') return '/courses/cbse-class-12-chemistry-complete-course'
    if (id === 'yoga-mastery-2025-static') return '/courses/complete-2025-yoga-mastery-course'
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
      {courses.map((course) => (
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

            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-green-600">
                {course.price > 0 ? `₹${course.price}` : 'Free'}
              </div>
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
      {courses.map((course) => (
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
                <div className="text-2xl font-bold text-green-600 mb-2">
                  {course.price > 0 ? `₹${course.price}` : 'Free'}
                </div>
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