"use client";

// "Live Classes" on /learn — the REAL upcoming classes from Classrooms
// (cafe_classrooms.next_class_at, set in Admin → Social → Café Rooms).
// Previously this section picked 3 random courses every week, put them on
// the next Wednesday at fixed times and showed random ratings, so the dates
// and ratings visitors saw weren't real. Now it only shows classes that are
// actually scheduled, and nothing made up.

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, ExternalLink, MessageCircle, Sparkles, Users, GraduationCap } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { formatClassTime } from '@/lib/class-schedule';

export interface UpcomingClass {
    id: string;
    title: string;
    courseTitle: string | null;
    description: string;
    trainerName: string | null;
    kind: 'classroom' | 'whiteboard';
    start: string; // ISO
    end: string; // ISO
    isLive: boolean;
    seatsLeft: number | null;
    courseUrl: string | null;
}

const WHATSAPP = '919084718101';
const JOIN_HREF = '/classrooms?tab=cafe';

const CountdownTimer = ({ target }: { target: string }) => {
    const [left, setLeft] = useState<number | null>(null);

    useEffect(() => {
        const t = new Date(target).getTime();
        const tick = () => setLeft(Math.max(0, t - Date.now()));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [target]);

    if (left === null) return <div className="h-7" />;
    const parts = [
        { value: Math.floor(left / 86400000), label: 'D' },
        { value: Math.floor((left / 3600000) % 24), label: 'H' },
        { value: Math.floor((left / 60000) % 60), label: 'M' },
        { value: Math.floor((left / 1000) % 60), label: 'S' },
    ];
    return (
        <div className="flex gap-1">
            {parts.map((p) => (
                <div key={p.label} className="flex flex-col items-center">
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded px-1.5 py-0.5 min-w-[1.5rem] text-center">
                        <span className="text-[10px] font-black text-emerald-400 font-mono">{String(p.value).padStart(2, '0')}</span>
                    </div>
                    <span className="text-[6px] font-black text-slate-500 mt-0.5 uppercase tracking-wider">{p.label}</span>
                </div>
            ))}
        </div>
    );
};

const ClassCard = ({ item }: { item: UpcomingClass }) => {
    const start = new Date(item.start);
    const [day, time] = formatClassTime(start).split(' · ');

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
                        {item.isLive ? (
                            <div className="bg-rose-600/90 px-2.5 py-1 rounded-full text-[8px] font-black text-white flex items-center gap-1.5 uppercase tracking-widest shadow-xl">
                                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                                Live now
                            </div>
                        ) : (
                            <div className="bg-emerald-600/20 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[8px] font-black text-emerald-300 uppercase tracking-widest">
                                Upcoming
                            </div>
                        )}
                        <div className="flex items-center gap-1.5 text-emerald-400 font-black text-[10px] uppercase tracking-widest italic">
                            <Clock size={12} /> {time} IST
                        </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <span className="inline-flex items-center gap-1 text-[8px] font-black text-emerald-400 uppercase tracking-widest italic border border-emerald-500/20 px-2 py-0.5 rounded-full bg-emerald-500/10">
                            <GraduationCap size={10} /> {item.kind === 'whiteboard' ? 'Whiteboard class' : 'Live classroom'}
                        </span>
                        {item.seatsLeft !== null && (
                            <span className="inline-flex items-center gap-1 text-[8px] font-black text-slate-300 uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                                <Users size={10} /> {item.seatsLeft > 0 ? `${item.seatsLeft} seats left` : 'Queue open'}
                            </span>
                        )}
                    </div>

                    <div className="flex-1 mb-6">
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter leading-tight mb-2 group-hover:text-emerald-400 transition-colors line-clamp-2">
                            {item.title}
                        </h3>
                        {item.trainerName && (
                            <p className="text-[11px] font-bold text-slate-300 mb-2">with {item.trainerName}</p>
                        )}
                        {item.description && (
                            <p className="text-slate-400 text-xs font-medium leading-relaxed italic opacity-70 group-hover:opacity-100 transition-opacity line-clamp-2">
                                {item.description}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center gap-4 py-4 border-t border-b border-white/5 mb-6">
                        <div className="flex flex-col">
                            <span className="text-[7px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Date</span>
                            <div className="flex items-center gap-1.5 text-white text-[10px] font-black uppercase italic tracking-widest">
                                <Calendar size={12} className="text-emerald-500" />
                                {day}
                            </div>
                        </div>
                        <div className="h-6 w-px bg-white/5" />
                        {item.isLive ? (
                            <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest">Class in progress</span>
                        ) : (
                            <CountdownTimer target={item.start} />
                        )}
                    </div>

                    <div className="flex flex-col gap-3">
                        <Link href={JOIN_HREF} className="w-full">
                            <Button className="w-full h-10 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] italic shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-emerald-500/40 border border-emerald-500/20 active:scale-95 transition-all">
                                <span className="flex items-center justify-center gap-2">
                                    <GraduationCap size={14} />
                                    {item.isLive ? 'Join the class' : 'Join the queue'}
                                </span>
                            </Button>
                        </Link>
                        <div className="grid grid-cols-2 gap-2">
                            {item.courseUrl ? (
                                <Link href={item.courseUrl} className="w-full">
                                    <Button variant="outline" className="w-full h-9 border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.15em] italic">
                                        <span className="flex items-center gap-1.5">
                                            Course <ExternalLink size={11} />
                                        </span>
                                    </Button>
                                </Link>
                            ) : (
                                <span />
                            )}
                            <a
                                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi! I'd like to join the class: ${item.title} (${formatClassTime(start)} IST)`)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={item.courseUrl ? 'w-full' : 'w-full col-span-2'}
                            >
                                <Button variant="outline" className="w-full h-9 border-white/10 hover:border-emerald-500/30 hover:bg-emerald-500/5 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.15em] italic">
                                    <span className="flex items-center gap-1.5">
                                        <MessageCircle size={12} /> Ask on WhatsApp
                                    </span>
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export const FreeOnlineClasses = ({ upcomingClasses = [] }: { upcomingClasses?: UpcomingClass[]; initialCourses?: any[] }) => {
    const anyLive = upcomingClasses.some((c) => c.isLive);

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
                        <Sparkles size={12} className="animate-pulse" /> {anyLive ? 'Live right now' : 'Class schedule'}
                    </div>
                    <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-[0.85] mb-6">
                        Live Online <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Classes</span>
                    </h2>
                    <p className="text-slate-500 text-xs md:text-sm max-w-xl font-bold uppercase tracking-widest italic leading-relaxed">
                        Real trainers, small batches. <br className="hidden md:block" />
                        Join the queue before class and learn live.
                    </p>
                </motion.div>

                {upcomingClasses.length === 0 ? (
                    <div className="rounded-[2rem] border border-white/5 bg-[#0d1321]/60 p-8 text-center">
                        <p className="text-white font-black uppercase italic tracking-tight">New batches are being scheduled</p>
                        <p className="mt-2 text-xs text-slate-400">Message us to get the next class date for the course you want.</p>
                        <a
                            href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hi! When is the next live class?')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex mt-5"
                        >
                            <Button className="h-10 bg-emerald-600 text-white rounded-xl font-black text-[9px] uppercase tracking-[0.2em] italic">
                                <MessageCircle size={14} className="mr-2" /> Ask on WhatsApp
                            </Button>
                        </a>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                        {upcomingClasses.map((item) => (
                            <ClassCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
};
