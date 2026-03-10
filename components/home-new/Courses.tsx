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
                                    '67bdf362-5e1c-49dd-9794-9c430ca351cb': '/courses/agentic-ai-for-beginners'
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
    { id: 'digital-marketing-ai-static', title: '📈 Digital Marketing using AI Tools — Mastery Course (2026)', subject: 'Marketing', instructor_name: 'Celoris Team', course_duration: '12 Hours', price: 4999, is_featured: true, description: 'Master AI-powered content, SEO, social media, and ads. Build high-converting funnels with ChatGPT, Claude, and more.', course_image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800' },
    { id: 'python-ai-developers-static', title: '🐍 Python for AI Developers — Applied Python for ML & AI', subject: 'Artificial Intelligence', instructor_name: 'Celoris Team', course_duration: '40+ Hours', price: 19999, is_featured: true, description: 'Master the core language behind AI. From async processing to deep-level matrix manipulation with NumPy.', course_image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=800' },
    { id: 'speak-with-confidence-static', title: '🗣️ SPEAK WITH CONFIDENCE — Spoken English for Beginners', subject: 'Soft Skills', instructor_name: 'Celoris Team', course_duration: '8 Weeks', price: 2999, is_featured: true, description: 'Break the language barrier. Learn active listening, phonetic clarity, and conversational flow.', course_image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?auto=format&fit=crop&q=80&w=800' },
    { id: 'bollywood-guitar-beginners-static', title: '🎸 BOLLYWOOD GUITAR — Beginners 8-Week Course (2026)', subject: 'Music', instructor_name: 'Celoris Team', course_duration: '8 Weeks', price: 1999, is_featured: true, description: 'Learn your favorite Bollywood hits from scratch. Master basic chords and strumming patterns.', course_image_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=800' },
    { id: 'bollywood-zumba-dance-static', title: 'Dance Your Way — Bollywood & Zumba for Beginners', subject: 'Dance', instructor_name: 'Celoris Team', course_duration: '6 Weeks', price: 999, is_featured: true, description: 'High-energy fitness meets Bollywood style. Fun workouts for complete beginners.', course_image_url: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=800' },
    { id: 'online-hatha-yoga-classes-beginners-static', title: 'Online Hatha Yoga — Foundations for Beginners', subject: 'Yoga', instructor_name: 'Celoris Trainer', course_duration: '8 Weeks', price: 4999, is_featured: true, description: 'Traditional Hatha practices focused on alignment, breath, and mental clarity.', course_image_url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=800' },
    { id: 'blender-3d-modelling-beginners-static', title: 'Blender 3D Modelling — Complete Beginner Course', subject: 'Design', instructor_name: 'Dheeraj Kushwaha', course_duration: '15 Hours', price: 5999, is_featured: true, description: 'Build your first 3D world. From basic shapes to high-poly modelling and rendering.', course_image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=800' },
    { id: 'professional-retouching-photoshop-static', title: 'Professional Retouching in Photoshop Using AI Tools', subject: 'Design', instructor_name: 'Celoris Team', course_duration: '16+ Hours', price: 4999, is_featured: true, description: 'Master skin retouching, compositing, AI-powered editing & studio-grade output.', course_image_url: 'https://images.unsplash.com/photo-1561715276-a2d087060f1d?auto=format&fit=crop&q=80&w=800' },
    { id: 'livekit-ai-agents-static', title: 'Building Real-Time Voice AI with LiveKit', subject: 'Artificial Intelligence', instructor_name: 'Celoris Team', course_duration: '28.5 hours', price: 3000, is_featured: true, description: 'Build production-grade voice agents, real-time transcription pipelines, and multi-modal AI apps using LiveKit.', course_image_url: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&q=80&w=800' },
    { id: 'vibe-coding-mastery-static', title: 'AI Coding for Beginners: Simple Development Workflows', subject: 'Artificial Intelligence', instructor_name: 'Celoris Team', course_duration: '4-6 Weeks', price: 19999, is_featured: true, description: 'Modern development workflows using AI assistants to build products faster than ever.', course_image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800' },
    { id: 'agentic-ai-systems-static', title: 'AI Systems: Design, Build & Deploy', subject: 'Artificial Intelligence', instructor_name: 'Celoris Team', course_duration: '15 hours', price: 15000, is_featured: true, description: 'Advanced look at autonomous agents, tool orchestration, and multi-agent systems.', course_image_url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800' }
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
                setLoading(true);
                const supabase = createClient();
                const { data } = await supabase
                    .from('courses')
                    .select('*')
                    .eq('is_published', true);
                dbPool = data || [];
            }

            const excludedTitles = [
                'agentic ai for beginners',
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

            // Ensure Digital Marketing is always at the top since it's the new featured course
            const digitalMarketingIndex = shuffled.findIndex(c => c.id === 'digital-marketing-ai-static');
            if (digitalMarketingIndex !== -1) {
                const [dg] = shuffled.splice(digitalMarketingIndex, 1);
                shuffled.unshift(dg);
            }

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
