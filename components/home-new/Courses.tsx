"use client";
import React, { useEffect, useState } from 'react';
import { PlayCircle, Clock, Star, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-client';
import { CourseCardProps } from './types';
import { motion } from 'framer-motion';

export const CourseCard: React.FC<CourseCardProps> = ({ id, title, category, instructor, duration, price, tag, image }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ y: -5 }}
        className="flex flex-col sm:flex-row bg-[#0d1321]/40 rounded-[2.5rem] border border-white/5 overflow-hidden backdrop-blur-3xl shadow-3xl hover:border-emerald-500/30 transition-all duration-500 group"
    >
        <div className="w-full sm:w-56 bg-[#00120d] relative h-56 sm:h-auto overflow-hidden">
            <img
                src={image || `https://picsum.photos/400/400?random=${Math.random()}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-100"
                alt={title}
                onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800";
                }}
            />
            {tag && (
                <div className="absolute top-4 left-4 inline-flex items-center gap-2 bg-emerald-500 px-3 py-1 rounded-full shadow-3xl shadow-emerald-500/50">
                    <Sparkles size={10} className="text-white" />
                    <span className="text-white text-[9px] font-black uppercase tracking-widest italic">{tag}</span>
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d1321]/80 to-transparent sm:block hidden pointer-events-none" />
        </div>

        <div className="p-8 flex-1 flex flex-col justify-between">
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg uppercase tracking-widest italic">{category}</span>
                    <div className="flex items-center gap-1 text-emerald-500">
                        <Star size={10} fill="currentColor" />
                        <span className="text-[10px] font-black tracking-widest">4.9 Rating</span>
                    </div>
                </div>

                <h3 className="text-xl font-black text-white leading-tight mb-4 group-hover:text-emerald-400 transition-colors uppercase italic tracking-tighter line-clamp-2">{title}</h3>

                <div className="flex items-center gap-6 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6 italic">
                    <div className="flex items-center gap-2"><PlayCircle size={14} className="text-emerald-500/50" /> {instructor || 'Celoris Trainer'}</div>
                    <div className="flex items-center gap-2"><Clock size={14} className="text-emerald-500/50" /> {duration || 'Lifetime Access'}</div>
                </div>
            </div>

            <div className="flex items-center justify-end pt-6 border-t border-white/5">
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
                                    'bollywood-guitar-beginners-static': '/courses/bollywood-guitar-for-beginners'
                                };
                                return routes[id] || `/learn/course/${id}`;
                            })()
                        }
                        className="px-6 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-2xl hover:bg-emerald-500 transition-all shadow-3xl shadow-emerald-500/30 flex items-center gap-2 group/btn"
                    >
                        Learn More <ArrowRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                ) : (
                    <button className="px-6 py-3 bg-emerald-600 text-white text-[10px] font-black uppercase rounded-2xl">
                        Locked
                    </button>
                )}
            </div>
        </div>
    </motion.div>
);

const staticCourses = [
    { id: 'python-ai-developers-static', title: '🐍 Python for AI Developers — Comprehensive Course in Applied Python for ML & AI', subject: 'Artificial Intelligence', instructor_name: 'Celoris Team', course_duration: '40+ Hours', price: 19999, is_featured: true, course_image_url: '/python-ai-course.png' },
    { id: 'bollywood-guitar-beginners-static', title: '🎸 BOLLYWOOD GUITAR — Complete Beginners 8-Week Course (India 2026)', subject: 'Music', instructor_name: 'Celoris Team', course_duration: '8 Weeks', price: 1999, is_featured: true, course_image_url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&q=80&w=800' },
    { id: 'bollywood-zumba-dance-static', title: 'Dance Your Way — Bollywood & Zumba for Complete Beginners', subject: 'Dance', instructor_name: 'Celoris Team', course_duration: '6 Weeks', price: 999, is_featured: true, course_image_url: '/course-dance-bollywood-zumba.png' },
    { id: 'online-hatha-yoga-classes-beginners-static', title: 'Online Hatha Yoga Classes for Beginners — Live Sessions with Certified Trainer', subject: 'Yoga', instructor_name: 'Celoris Certified Trainer', course_duration: '8 Weeks', price: 4999, is_featured: true, course_image_url: '/hatha-yoga-foundation.png' },
    { id: 'blender-3d-modelling-beginners-static', title: 'Blender 3D Modelling — Complete Beginner Course', subject: 'Design', instructor_name: 'Dheeraj Kushwaha', course_duration: '15 Hours', price: 5999, is_featured: true, course_image_url: '/blender-course-cover.png' },
    { id: 'content-creation-social-media-static', title: 'Content Creation on Social Media — From Creator to Income', subject: 'Social Media Marketing', instructor_name: 'Dheeraj Kushwaha', course_duration: '19 Hours', price: 4999, is_featured: true, course_image_url: '/content-creation-cover.png' },
    { id: 'excel-expert-master-static', title: 'Be an Excel Expert — From Beginner to Macro Master', subject: 'Microsoft Excel', instructor_name: 'Dheeraj Kushwaha', course_duration: '10 Hours', price: 999, is_featured: true, course_image_url: '/excel-expert-cover.png' },
    { id: 'sovereign-intelligence-static', title: 'Learn AI Basics Free: Private, Local, & Uncensored AI', subject: 'Artificial Intelligence', instructor_name: 'Celoris Designs', course_duration: '6 Weeks (Intensive)', price: 24999, is_featured: true, course_image_url: 'https://img.youtube.com/vi/ynZOXVGFjyA/maxresdefault.jpg' },
    { id: 'personalized-ai-experiences-static', title: 'Personalized AI Experiences with RAG & Agents', subject: 'Artificial Intelligence', instructor_name: 'Celoris Designs', course_duration: '6-Week Self-Paced', price: 19999, is_featured: true, course_image_url: 'https://img.youtube.com/vi/ZwqAdQsXy3A/maxresdefault.jpg' },
    { id: 'architecting-trust-static', title: 'AI Safety, Ethics & Compliance Mastery', subject: 'Artificial Intelligence', instructor_name: 'Celoris Designs', course_duration: '6-8 Weeks', price: 21999, is_featured: true, course_image_url: 'https://img.youtube.com/vi/CdCAuee0qyI/maxresdefault.jpg' },
    { id: 'agentic-ai-cybersecurity-static', title: 'AI for Cybersecurity: Building Autonomous Defense', subject: 'Artificial Intelligence', instructor_name: 'Celoris Designs', course_duration: '6-8 Weeks', price: 29999, is_featured: true, course_image_url: 'https://img.youtube.com/vi/Y72t0L4wdsE/maxresdefault.jpg' },
    { id: 'accelerating-science-static', title: 'AI for Science: Research & Innovation', subject: 'Artificial Intelligence', instructor_name: 'Celoris Designs', course_duration: '8-Week Intensive', price: 24999, is_featured: true, course_image_url: 'https://img.youtube.com/vi/57LQCUE2FWk/maxresdefault.jpg' },
    { id: 'mastering-multimodal-ai-static', title: 'Mastering Multi-Tool AI: Vision & Audio', subject: 'Artificial Intelligence', instructor_name: 'Celoris Designs', course_duration: '8-10 Weeks', price: 24999, is_featured: true, course_image_url: 'https://img.youtube.com/vi/G_eFurGI3Go/maxresdefault.jpg' },
    { id: 'building-model-native-agent-systems-static', title: 'Building Intelligent AI Systems (Full Guide)', subject: 'Artificial Intelligence', instructor_name: 'Celoris Designs', course_duration: '8 Weeks (Accelerated)', price: 29999, is_featured: true, course_image_url: 'https://img.youtube.com/vi/MoZQeCYorns/maxresdefault.jpg' },
    { id: 'vibe-coding-mastery-static', title: 'AI Coding for Beginners: Simple Development Workflows', subject: 'Artificial Intelligence', instructor_name: 'Celoris Designs', course_duration: '4-6 Weeks', price: 19999, is_featured: true, course_image_url: '/vibe-coding-mastery-cover.png' },
    { id: 'agentic-ai-systems-static', title: 'AI Systems: Design, Build & Deploy', subject: 'Artificial Intelligence', instructor_name: 'Celoris Designs llp', course_duration: '15 hours', price: 15000, is_featured: true, course_image_url: '/agentic-ai-systems-cover.png' },
    { id: 'livekit-ai-agents-static', title: 'Build Real-Time AI Agents with LiveKit', subject: 'Artificial Intelligence', instructor_name: 'Celoris Designs llp', course_duration: '10 hours', price: 14999, is_featured: true, course_image_url: '/livekit-ai-agents-cover.png' },
    { id: 'langchain-real-static', title: 'LangChain in Action: Real Workflows', subject: 'Artificial Intelligence', instructor_name: 'Celoris', course_duration: '12 hours', price: 13500, is_featured: true, course_image_url: 'https://img.youtube.com/vi/Fvf5k_jocUk/maxresdefault.jpg' }
];

export const Courses: React.FC<any> = ({
    title = "Our Latest Courses",
    description = "Explore our newest AI courses and start your career.",
    limit = 6,
    showBrowseAll = true,
    featured = false,
    initialCourses = null
}) => {

    const [courses, setCourses] = useState<any[]>(initialCourses ? [...staticCourses, ...initialCourses].slice(0, limit) : []);
    const [loading, setLoading] = useState(!initialCourses);

    useEffect(() => {
        if (initialCourses) return;

        const fetchCourses = async () => {
            const supabase = createClient();
            const { data } = await supabase
                .from('courses')
                .select('*')
                .eq('is_published', true)
                .order('created_at', { ascending: false })
                .limit(limit);

            if (data && data.length > 0) {
                const testCourseTitles = ['agentic ai for beginners: from prompts to action', 'mastering nano banana pro', 'my new ai course will be here'];
                const filteredDbCourses = data.filter((c: any) => !testCourseTitles.includes((c.title || '').toLowerCase()));
                const combined = [...staticCourses, ...filteredDbCourses].slice(0, limit);
                setCourses(combined);
            } else {
                setCourses(staticCourses.slice(0, limit));
            }
            setLoading(false);
        };
        fetchCourses();
    }, [limit, featured, initialCourses]);

    return (
        <div className="mt-24 md:mt-32 mb-32">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-16 px-4"
            >
                <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                    <Sparkles size={12} /> Featured Lessons
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">{title}</h2>
                <div className="h-1.5 w-24 bg-emerald-600 rounded-full mt-5 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                {description && <p className="text-slate-500 text-xs md:text-sm mt-6 font-bold uppercase tracking-widest italic">{description}</p>}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {courses.map((course: any) => (
                    <CourseCard
                        key={course.id}
                        id={course.id}
                        title={course.title}
                        category={course.subject}
                        instructor={course.instructor_name}
                        duration={course.course_duration}
                        price={course.price}
                        tag={course.is_featured ? 'Featured' : undefined}
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
