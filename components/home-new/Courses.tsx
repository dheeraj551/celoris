"use client";
import React, { useEffect, useState } from 'react';
import { PlayCircle, Clock, Star, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';
import { CourseCardProps } from './types';
import { motion } from 'framer-motion';

export const CourseCard: React.FC<CourseCardProps & { description?: string, image?: string }> = ({ id, title, category, instructor, duration, price, tag, description, image }) => (
    <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.02 }}
        className="flex bg-[#0d1321]/60 rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-3xl shadow-2xl hover:border-emerald-500/30 transition-all duration-500 group h-[220px]"
    >
        {/* Left Side: Image Sidebar */}
        <div className="relative w-[40%] h-full overflow-hidden bg-slate-900">
            <img
                src={image || "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800"}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0d1321]/80" />

            {tag && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-emerald-500/90 backdrop-blur-md px-3 py-1 rounded-lg shadow-lg shadow-emerald-500/40">
                    <Sparkles size={8} className="text-white" />
                    <span className="text-white text-[8px] font-black uppercase tracking-widest italic">{tag}</span>
                </div>
            )}
        </div>

        {/* Right Side: Content */}
        <div className="p-6 md:p-8 flex-1 flex flex-col justify-between overflow-hidden">
            <div>
                <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg uppercase tracking-widest italic truncate">{category}</span>
                    <div className="flex items-center gap-1 text-emerald-500">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[10px] font-black tracking-widest">4.9 Rating</span>
                    </div>
                </div>

                <h3 className="text-base md:text-lg font-black text-white leading-tight mb-4 group-hover:text-emerald-400 transition-colors uppercase italic tracking-tighter line-clamp-2">
                    {title}
                </h3>

                <div className="flex items-center gap-4 text-[9px] font-black text-slate-500 uppercase tracking-widest italic leading-none">
                    <div className="flex items-center gap-2"><PlayCircle size={14} className="text-emerald-500/60" /> {instructor || 'Celoris Team'}</div>
                    <div className="flex items-center gap-2"><Clock size={14} className="text-emerald-500/60" /> {duration}</div>
                </div>
            </div>

            <div className="flex items-center justify-between mt-4">
                <div />
                {id ? (
                    <Link
                        href={
                            (() => {
                                const routes: Record<string, string> = {
                                    'vibe-coding-mastery-static': '/courses/vibe-coding-mastery',
                                    'class-11-physics-static': '/courses/cbse-class-11-physics-comprehensive-course',
                                    'class-12-physics-static': '/courses/cbse-class-12-physics-complete-course',
                                    'class-10-physics-static': '/courses/cbse-class-10-physics-light-electricity-magnetism-energy',
                                    'class-9-chemistry-static': '/courses/cbse-class-9-chemistry-complete-course',
                                    'b65a0bc8-2e86-4170-9a3c-91c4050de31f': '/courses/cbse-class-9-physics-motion-force-energy-sound',
                                    'class-10-chemistry-static': '/courses/cbse-class-10-chemistry-complete-course',
                                    'class-11-chemistry-static': '/courses/cbse-class-11-chemistry-complete-course',
                                    'class-12-chemistry-static': '/courses/cbse-class-12-chemistry-complete-course',
                                    'online-hatha-yoga-classes-beginners-static': '/learn/online-hatha-yoga-classes-beginners',
                                    '28-day-reset-static': '/courses/the-28-day-reset-foundation-strength-mobility',
                                    'class-9-maths-static': '/courses/cbse-class-9-mathematics-complete-syllabus-mastery-guide',
                                    'livekit-ai-agents-static': '/courses/build-real-time-ai-agents-with-livekit',
                                    '1ca8cbea-1c9d-470d-ac69-f37882c31963': '/courses/build-real-time-ai-agents-with-livekit',
                                    'agentic-ai-systems-static': '/courses/agentic-ai-systems-design-build-deploy',
                                    'rag-unlocked-static': '/courses/rag-unlocked-production-grade-search-answer-systems',
                                    'llm-prompt-engineering-static': '/courses/llm-prompt-engineering-for-real-results',
                                    'deploy-scale-ai-static': '/courses/deploy-scale-ai-apps-serverless-edge',
                                    'langchain-real-static': '/courses/langchain-in-action-real-workflows',
                                    'build-ai-products-static': '/courses/build-ai-products-that-make-money-practical-guide',
                                    'mastering-multimodal-ai-static': '/courses/mastering-multimodal-ai',
                                    'building-model-native-agent-systems-static': '/courses/building-model-native-agent-systems',
                                    'architecting-trust-static': '/courses/architecting-trust-ai-safety-ethics-compliance',
                                    'agentic-ai-cybersecurity-static': '/courses/agentic-ai-for-cybersecurity',
                                    'accelerating-science-static': '/courses/accelerating-science-generative-ai-for-research-innovation',
                                    'personalized-ai-experiences-static': '/courses/personalized-ai-experiences-with-rag-and-agents',
                                    'sovereign-intelligence-static': '/courses/sovereign-intelligence',
                                    'excel-expert-master-static': '/learn/be-an-excel-expert',
                                    'content-creation-social-media-static': '/learn/content-creation-social-media',
                                    'blender-3d-modelling-beginners-static': '/learn/blender-3d-modelling-beginners',
                                    'bollywood-zumba-dance-static': '/courses/bollywood-zumba-dance-for-beginners',
                                    'python-ai-developers-static': '/courses/python-for-ai-developers',
                                    'bollywood-guitar-beginners-static': '/courses/bollywood-guitar-for-beginners',
                                    'speak-with-confidence-static': '/learn/speak-with-confidence',
                                    'professional-retouching-photoshop-static': '/courses/professional-retouching-in-photoshop',
                                    'digital-marketing-ai-static': '/courses/digital-marketing-using-ai-tools',
                                    'social-media-marketing-pro-training-static': '/courses/social-media-marketing-professional-training',
                                    'social-media-marketing-ai-static': '/courses/social-media-marketing-with-ai',
                                    'agentic-ai-beginners-static': '/courses/agentic-ai-for-beginners',
                                    '67bdf362-5e1c-49dd-9794-9c430ca351cb': '/courses/agentic-ai-for-beginners',
                                    'python-mega-course-static': '/courses/python-mega-course',
                                    'zumba-fitness-masterclass-static': '/courses/zumba-fitness-masterclass',
                                    'spoken-english-sonia-sharma-static': '/learn/spoken-english-communication',
                                    'essential-python-ai-static': '/courses/essential-python-for-ai-development',
                                    'master-premiere-pro-ai-static': '/courses/master-premiere-pro-ai'
                                };
                                return routes[id] || `/learn/course/${id}`;
                            })()
                        }
                        className="px-6 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase italic rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2 group/btn"
                    >
                        LEARN MORE <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                ) : (
                    <button className="px-6 py-3 bg-white/5 text-slate-500 text-[10px] font-black uppercase italic rounded-2xl border border-white/5">
                        LOCKED
                    </button>
                )}
            </div>
        </div>
    </motion.div>
);

export const staticCourses = [
    { id: 'social-media-marketing-ai-static', title: '📱 Social Media Marketing with AI — 2025 Mastery Course', subject: 'Marketing', instructor_name: 'Celoris Team', course_duration: '40 Hours', price: 1999, is_featured: true, description: 'Master AI-powered content, strategy, and ads for social media. Build high-converting funnels with 10+ AI tools.', course_image_url: '/social-media-ai-hero.png' },
    { id: 'social-media-marketing-pro-training-static', title: '🚀 SMM Professional Training — Canva, AI & Automation', subject: 'Marketing', instructor_name: 'Celoris Team', course_duration: '10 Hours', price: 2499, is_featured: true, description: 'Master AI-powered content creation, Canva design, and email automation in this professional program.', course_image_url: '/smm-pro-hero.png' },
    { id: 'digital-marketing-ai-static', title: '📈 Digital Marketing using AI Tools — Mastery Course (2026)', subject: 'Marketing', instructor_name: 'Celoris Team', course_duration: '12 Hours', price: 4999, is_featured: true, description: 'Master AI-powered content, SEO, social media, and ads. Build high-converting funnels with ChatGPT, Claude, and more.', course_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
    { id: 'python-ai-developers-static', title: '🐍 Python for AI Developers — Applied Python for ML & AI', subject: 'Artificial Intelligence', instructor_name: 'Celoris Team', course_duration: '40+ Hours', price: 19999, is_featured: true, description: 'Master the core language behind AI. From async processing to deep-level matrix manipulation with NumPy.', course_image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800' },
    { id: 'speak-with-confidence-static', title: '🗣️ SPEAK WITH CONFIDENCE — Spoken English for Beginners', subject: 'Soft Skills', instructor_name: 'Celoris Team', course_duration: '8 Weeks', price: 2999, is_featured: true, description: 'Break the language barrier. Learn active listening, phonetic clarity, and conversational flow.', course_image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800' },
    { id: 'bollywood-guitar-beginners-static', title: '🎸 BOLLYWOOD GUITAR — Beginners 8-Week Course (2026)', subject: 'Music', instructor_name: 'Celoris Team', course_duration: '8 Weeks', price: 1999, is_featured: true, description: 'Learn your favorite Bollywood hits from scratch. Master basic chords and strumming patterns.', course_image_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=800' },
    { id: 'bollywood-zumba-dance-static', title: 'Dance Your Way — Bollywood & Zumba for Beginners', subject: 'Dance', instructor_name: 'Celoris Team', course_duration: '6 Weeks', price: 999, is_featured: true, description: 'High-energy fitness meets Bollywood style. Fun workouts for complete beginners.', course_image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800' },
    { id: 'online-hatha-yoga-classes-beginners-static', title: 'Online Hatha Yoga — Foundations for Beginners', subject: 'Yoga', instructor_name: 'Celoris Trainer', course_duration: '8 Weeks', price: 4999, is_featured: true, description: 'Traditional Hatha practices focused on alignment, breath, and mental clarity.', course_image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800' },
    { id: 'blender-3d-modelling-beginners-static', title: 'Blender 3D Modelling — Complete Beginner Course', subject: 'Design', instructor_name: 'Dheeraj Kushwaha', course_duration: '15 Hours', price: 5999, is_featured: true, description: 'Build your first 3D world. From basic shapes to high-poly modelling and rendering.', course_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800' },
    { id: 'professional-retouching-photoshop-static', title: 'Professional Retouching in Photoshop Using AI Tools', subject: 'Design', instructor_name: 'Celoris Team', course_duration: '16+ Hours', price: 4999, is_featured: true, description: 'Master skin retouching, compositing, AI-powered editing & studio-grade output.', course_image_url: 'https://images.unsplash.com/photo-1561715276-a2d087060f1d?auto=format&fit=crop&q=80&w=800' },
    { id: 'livekit-ai-agents-static', title: 'Building Real-Time Voice AI with LiveKit', subject: 'Artificial Intelligence', instructor_name: 'Celoris Team', course_duration: '28.5 hours', price: 3000, is_featured: true, description: 'Build production-grade voice agents, real-time transcription pipelines, and multi-modal AI apps using LiveKit.', course_image_url: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800' },
    { id: 'vibe-coding-mastery-static', title: 'AI Coding for Beginners: Simple Development Workflows', subject: 'Artificial Intelligence', instructor_name: 'Celoris Team', course_duration: '4-6 Weeks', price: 19999, is_featured: true, description: 'Modern development workflows using AI assistants to build products faster than ever.', course_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800' },
    { id: 'agentic-ai-beginners-static', title: '🤖 Agentic AI for Beginners: From Prompts to Action', subject: 'Computer Science', instructor_name: 'Celoris Team', course_duration: '6 Weeks', price: 1500, is_featured: true, description: 'Learn how AI agents think, plan, and act. Build your first AI agent using no-code tools.', course_image_url: '/agentic-ai-beginners-cover.png' },
    { id: 'python-mega-course-static', title: '🐍 Python Mega Course — Build 20 Real-World Apps & AI Agents', subject: 'Artificial Intelligence', instructor_name: 'Dheeraj', course_duration: '80+ Hours', price: 19999, is_featured: true, description: 'From Zero to AI Developer. Build 20 apps and 5 AI agents using OpenAI, LangChain, and Ollama.', course_image_url: '/python-mega-course-hero.png' },
    { id: 'zumba-fitness-masterclass-static', title: '💃 Zumba Fitness Masterclass — From Basics to Trainer-Ready', subject: 'Fitness', instructor_name: 'Jatin Arora', course_duration: '30 Hours', price: 1999, is_featured: true, description: 'Master Zumba rhythms and Bollywood fusion with Jatin Arora. 30 hours of high-energy training to take you from beginner to trainer-ready.', course_image_url: '/zumba-fitness-masterclass.png' },
    { id: 'spoken-english-sonia-sharma-static', title: '🗣️ Spoken English & Communication — Masterclass with Sonia Sharma', subject: 'Soft Skills', instructor_name: 'Sonia Sharma', course_duration: '6 Weeks', price: 1999, is_featured: true, description: 'Master the art of confident English communication with Sonia Sharma. Practical, real-life curriculum focusing on actual conversations.', course_image_url: '/spoken-english-sonia-sharma-hero.png' },
    { id: 'essential-python-ai-static', title: '🐍 Essential Python for AI Development — 10-Hour Masterclass', subject: 'Artificial Intelligence', instructor_name: 'Celoris Team', course_duration: '10 Hours', price: 9999, is_featured: true, description: 'A practical 10-hour curriculum taking you from Python basics to building real AI-powered applications. Master the fundamentals and AI APIs.', course_image_url: '/essential-python-ai-cover.png' },
    { id: 'master-premiere-pro-ai-static', title: '🎬 Adobe Premiere Pro with AI in 2026 — 2-Week Intensive', subject: 'Design', instructor_name: 'Celoris Team', course_duration: '30 Hours', price: 14999, is_featured: true, description: 'Master AI-powered video editing, Firefly integration, and automated workflows in Premiere Pro 2026.', course_image_url: '/premiere-pro-ai-hero.png' }
];

export const Courses: React.FC<any> = ({
    title = "Our Latest Courses",
    description = "Explore our newest AI courses and start your career.",
    limit = 6,
    showBrowseAll = true,
    featured = false,
    initialCourses = null
}) => {

    const [courses, setCourses] = useState<any[]>(initialCourses ? initialCourses.slice(0, limit) : []);
    const [loading, setLoading] = useState(!initialCourses);

    useEffect(() => {
        const prepareCourses = async () => {
            let dbPool = [];

            if (initialCourses && initialCourses.length > 0) {
                dbPool = initialCourses;
            } else {
                try {
                    const supabase = createClient();
                    const { data, error: fetchError } = await supabase
                        .from('courses')
                        .select('*')
                        .eq('is_published', true);
                    
                    if (fetchError) {
                        console.error('Error fetching courses:', fetchError);
                        dbPool = [];
                    } else {
                        dbPool = data || [];
                    }
                } catch (err) {
                    console.error('Failed to initialize Supabase or fetch courses:', err);
                    dbPool = [];
                }
            }

            const excludedTitles = [
                'agentic ai for beginners',
                'agentic ai for beginners: from prompts to action',
                'mastering nano banana pro',
                'my new ai course',
                'my new ai course will be here',
                'nana banana bootcamp',
                'building real-time voice ai with livekit',
                'build real-time ai agents with livekit'
            ];
            const filteredDbCourses = dbPool.filter((c: any) => {
                const normalizedTitle = (c.title || '').toLowerCase().trim();
                return !excludedTitles.some(ex => normalizedTitle === ex || normalizedTitle.includes('my new ai course') || normalizedTitle.includes('banana'));
            });

            // Pool both static and database courses
            const allAvailable = [...staticCourses, ...filteredDbCourses];

            // Daily Randomizer
            const today = new Date();
            const dateSeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

            const random = (seed: number) => {
                const x = Math.sin(seed) * 10000;
                return x - Math.floor(x);
            };

            const shuffled = [...allAvailable].sort((a, b) => {
                const getHash = (str: string) => {
                    let hash = 0;
                    for (let i = 0; i < str.length; i++) {
                        hash = (hash << 5) - hash + str.charCodeAt(i);
                        hash |= 0;
                    }
                    return hash;
                };
                const seedA = dateSeed + getHash(a.id || a.title);
                const seedB = dateSeed + getHash(b.id || b.title);
                return random(seedA) - random(seedB);
            });

            // Ensure priority courses are at the top (unshifting in reverse order for final priority)
            ['spoken-english-sonia-sharma-static', 'zumba-fitness-masterclass-static', 'python-mega-course-static', 'digital-marketing-ai-static', 'social-media-marketing-pro-training-static', 'social-media-marketing-ai-static', 'essential-python-ai-static', 'master-premiere-pro-ai-static'].forEach(targetId => {
                const index = shuffled.findIndex(c => c.id === targetId);
                if (index !== -1) {
                    const [course] = shuffled.splice(index, 1);
                    shuffled.unshift(course);
                }
            });

            setCourses(shuffled.slice(0, limit));
            setLoading(false);
        };

        prepareCourses();
    }, [initialCourses, limit]);

    return (
        <div className="mt-24 md:mt-32 mb-32">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-16 px-4"
            >
                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                    <Sparkles size={12} fill="currentColor" /> FEATURED LESSONS
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-tight max-w-4xl">{title}</h2>
                <div className="h-1.5 w-24 bg-emerald-600 rounded-full mt-6 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                {description && <p className="text-slate-500 text-xs md:text-sm mt-8 font-black uppercase tracking-[0.1em] italic leading-relaxed max-w-3xl border-l border-emerald-500/20 pl-6">{description}</p>}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                {courses.map((course: any) => (
                    <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        description={course.description}
                        category={course.subject}
                        instructor={course.instructor_name}
                        duration={course.course_duration}
                        price={course.price}
                        tag={course.is_featured ? 'FEATURED' : undefined}
                        image={course.course_image_url}
                    />
                ))}
            </div>

            {showBrowseAll && (
                <div className="mt-16 text-center">
                    <Link href="/learn/courses" className="px-10 py-5 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase rounded-2xl hover:bg-white/10 transition-all inline-flex items-center gap-3 tracking-[0.2em] italic">
                        View All courses <ArrowRight size={16} className="text-emerald-500" />
                    </Link>
                </div>
            )}
        </div>
    );
};
