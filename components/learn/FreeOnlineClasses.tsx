"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, Star, PlayCircle, Clock, ArrowRight, MessageCircle, Sparkles, ShieldCheck, Timer, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { WheelOfLuck } from './WheelOfLuck';
import { staticCourses } from '../home-new/Courses';

interface ClassItem {
    id: string;
    title: string;
    instructor: string;
    reviews: number;
    rating: number;
    startTime: Date;
    description: string;
    category?: string;
}

// Seeded random number generator
const mulberry32 = (a: number) => {
    return function () {
        let t = (a += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
};

const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = targetDate.getTime() - new Date().getTime();
            if (difference > 0) {
                return {
                    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return { days: 0, hours: 0, minutes: 0, seconds: 0 };
        };

        setTimeLeft(calculateTimeLeft());
        const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
        return () => clearInterval(timer);
    }, [targetDate]);

    return (
        <div className="flex items-center">
            <div className="flex gap-1">
                {[
                    { value: timeLeft.days, label: 'D' },
                    { value: timeLeft.hours, label: 'H' },
                    { value: timeLeft.minutes, label: 'M' },
                    { value: timeLeft.seconds, label: 'S' }
                ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-0.5 min-w-[1.5rem] text-center backdrop-blur-md">
                            <span className="text-[10px] font-black text-emerald-400 font-mono">{String(item.value).padStart(2, '0')}</span>
                        </div>
                        <span className="text-[6px] font-black text-slate-500 mt-0.5 uppercase tracking-wider">{item.label}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const ClassCard = ({ item }: { item: ClassItem }) => {
    const formattedDate = item.startTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
    const formattedTime = item.startTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }).toLowerCase();

    const courseUrl = (() => {
        const staticRoutes: Record<string, string> = {
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
            'bollywood-guitar-beginners-static': '/courses/bollywood-guitar-for-beginners',
            'speak-with-confidence-static': '/learn/speak-with-confidence',
            'essential-python-ai-static': '/courses/essential-python-for-ai-development',
            'master-premiere-pro-ai-static': '/courses/master-premiere-pro-ai',
            'python-trading-automation-static': '/courses/python-for-trading-automation'
        };
        return staticRoutes[item.id] || `/learn/course/${item.id}`;
    })();

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -5 }}
            className="group relative h-full flex"
        >
            <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition duration-1000"></div>

            <div className="relative bg-[#0d1321]/60 border border-white/5 rounded-[2rem] overflow-hidden backdrop-blur-3xl shadow-2xl transition-all duration-500 group-hover:border-emerald-500/30 flex flex-col w-full">
                <div className="p-6 flex flex-col flex-1 relative">
                    <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="bg-rose-600/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[8px] font-black text-white flex items-center gap-1.5 uppercase tracking-widest shadow-xl">
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                            Live Wed
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-black text-[10px] uppercase tracking-widest italic">
                            <Clock size={12} /> {formattedTime}
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-4">
                        {item.category && (
                            <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest italic border border-emerald-500/20 px-2 py-0.5 rounded-full bg-emerald-500/10">
                                {item.category}
                            </span>
                        )}
                        <div className="flex items-center gap-1 bg-white/5 px-2 py-0.5 rounded-full border border-white/5">
                            <Star size={8} fill="#10b981" className="text-emerald-500" />
                            <span className="text-[8px] font-black text-slate-400 uppercase italic tracking-widest">
                                {item.rating.toFixed(1)}
                            </span>
                        </div>
                    </div>

                    <div className="flex-1 mb-6">
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight mb-3 group-hover:text-emerald-400 transition-colors line-clamp-2">
                            {item.title}
                        </h3>
                        <p className="text-slate-400 text-xs font-medium leading-relaxed italic opacity-70 group-hover:opacity-100 transition-opacity line-clamp-2">
                            {item.description}
                        </p>
                    </div>

                    <div className="flex items-center gap-4 py-4 border-t border-b border-white/5 mb-6">
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Date</span>
                            <div className="flex items-center gap-1.5 text-white text-[10px] font-black uppercase italic tracking-widest">
                                <Calendar size={12} className="text-emerald-500" />
                                {formattedDate}
                            </div>
                        </div>
                        <div className="h-6 w-px bg-white/5" />
                        <CountdownTimer targetDate={item.startTime} />
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link href={courseUrl} className="w-full">
                            <Button variant="outline" className="w-full h-10 border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] italic transition-all group/info">
                                <span className="flex items-center gap-2">
                                    Details <ExternalLink size={12} className="group-hover/info:translate-y-[-2px] group-hover/info:translate-x-[2px] transition-transform" />
                                </span>
                            </Button>
                        </Link>
                        
                        <a
                            href={`https://wa.me/919084718101?text=I%20want%20to%20book%20the%20free%20class:%20${encodeURIComponent(item.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full"
                        >
                            <Button className="w-full h-10 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] italic shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-emerald-500/40 border border-emerald-500/20 active:scale-95 transition-all group/btn">
                                <span className="flex items-center justify-center gap-2">
                                    <MessageCircle size={14} />
                                    Book via Whatsapp
                                </span>
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const FreeOnlineClasses = ({ initialCourses = [] }: { initialCourses?: any[] }) => {
    const selectedClasses = useMemo(() => {
        if (!initialCourses || initialCourses.length === 0) return [];

        // Automatically calculate the next Wednesday
        // If today is Wednesday and before 9pm, we show today. Otherwise, next Wednesday.
        const getNextWednesday = () => {
            const now = new Date();
            const nextWed = new Date(now);
            nextWed.setHours(0, 0, 0, 0);
            
            const day = now.getDay();
            let daysToAdd = (3 - day + 7) % 7;
            
            // If it's already Wednesday but late (past 9 PM), move to next week
            if (day === 3 && now.getHours() >= 21) {
                daysToAdd = 7;
            }
            
            nextWed.setDate(now.getDate() + daysToAdd);
            return nextWed;
        };

        const targetDate = getNextWednesday();
        const dateSeed = targetDate.toDateString();
        let hash = 0;
        for (let i = 0; i < dateSeed.length; i++) {
            hash = (hash << 5) - hash + dateSeed.charCodeAt(i);
            hash |= 0;
        }

        const rand = mulberry32(Math.abs(hash) + 5); // Added offset to rotate entire selection

        const excludedTitles = ['my new ai course will be here', 'nana banana bootcamp', 'agentic ai for beginners', 'mastering nano banana pro', 'class 9 physics', 'maths 12th'];
        const courses = [...initialCourses].filter(c => {
            const t = (c.title || '').toLowerCase().trim();
            return !excludedTitles.some(ex => t.includes(ex) || t.includes('banana'));
        });
        const selected: any[] = [];

        const timeSlots = [12, 15, 21];

        for (let i = 0; i < Math.min(3, courses.length); i++) {
            const index = Math.floor(rand() * courses.length);
            const course = courses.splice(index, 1)[0];

            // Set specific time slots: 12pm, 3pm, 9pm
            const startTime = new Date(targetDate);
            startTime.setHours(timeSlots[i], 0, 0, 0);

            selected.push({
                id: course.id,
                title: course.title,
                instructor: course.instructor_name || 'Celoris Expert',
                reviews: Math.floor(rand() * 100) + 10,
                rating: 4.5 + (rand() * 0.5),
                startTime,
                description: course.short_description || course.description || 'Master this skill in our exclusive live masterclass session today.',
                category: course.subject || 'Masterclass'
            });
        }

        return selected;
    }, [initialCourses]);

    if (selectedClasses.length === 0) return null;

    return (
        <section className="relative">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] -z-10 pointer-events-none" />

            <div className="px-4">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="mb-12 text-center md:text-left"
                >
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 italic">
                        <Sparkles size={12} className="animate-pulse" /> Live this Wed
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.85] mb-6">
                        Free Online <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Masterclasses</span>
                    </h2>
                    <p className="text-slate-500 text-xs md:text-sm max-w-xl font-bold uppercase tracking-widest italic leading-relaxed">
                        Daily picked premium sessions. <br className="hidden md:block" />
                        Explore live masterclasses from our top courses.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {selectedClasses.map((item) => (
                        <ClassCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
};
