"use client"

import React, { useState, useEffect } from 'react';
import { Rocket, ArrowRight, Sparkles, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase-client';

const TRANSACTIONS = [
    "Aarav Sharma paid For The Python Basics Course – Tutor: Ritika Malhotra",
    "Meera Iyer paid For The Digital Marketing Bootcamp – Tutor: Sahil Khanna",
    "Rohan Patel paid For The Data Science Program – Tutor: Ananya Desai",
    "Simran Kaur paid For The Spoken English Training – Tutor: Neha Collins",
    "Aditya Verma paid For The Full Stack Web Development – Tutor: Kunal Mehta",
    "Pooja Nair paid For The UI/UX Design Course – Tutor: Sneha Roy",
    "Vikram Singh paid For The Cybersecurity Fundamentals – Tutor: Arjun Rao",
    "Neel Joshi paid For The AI & Machine Learning Track – Tutor: Priyanka Bose",
    "Ishita Banerjee paid For The Content Writing Masterclass – Tutor: Rahul Sen",
    "Manav Kapoor paid For The Fitness & Nutrition Coaching – Tutor: Rhea Mathur"
];

const HIRING_FEEDS = [
    "TechNova Solutions hired Aarav Mehta for AI-Powered Chatbot Development",
    "BlueWave Systems hired Neha Sharma for Cloud Infrastructure Migration",
    "CodeCraft Labs hired Rohan Verma for E-commerce Web App Revamp",
    "NextGen Infotech hired Priya Iyer for Data Analytics Dashboard",
    "PixelCore Technologies hired Kunal Singh for Mobile App UI/UX Redesign",
    "InnoSoft Pvt Ltd hired Sneha Kapoor for CRM System Integration",
    "Skyline Digital hired Aditya Malhotra for Blockchain Wallet Development",
    "QuantumByte Solutions hired Pooja Nair for Machine Learning Model Optimization",
    "HexaTech Global hired Vikram Joshi for Cybersecurity Risk Assessment",
    "Vertex IT Services hired Ananya Gupta for SaaS Platform Performance Optimization"
];

function TickerLine({ items, duration = 30, reverse = false }: { items: string[], duration?: number, reverse?: boolean }) {
    return (
        <div className="w-full overflow-hidden py-2 relative">
            <motion.div
                animate={{
                    x: reverse ? [-1000, 0] : [0, -1000],
                }}
                transition={{
                    duration: duration,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="flex whitespace-nowrap gap-12 items-center"
            >
                {[...items, ...items].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <div className={`w-1.5 h-1.5 rounded-full ${reverse ? 'bg-blue-500' : 'bg-emerald-500'} animate-pulse`} />
                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${reverse ? 'text-blue-400/60' : 'text-emerald-400/60'} italic`}>
                            {text}
                        </span>
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

function ScrollingTicker() {
    return (
        <div className="w-full bg-white/5 border-t border-white/10 relative mt-12 py-4">
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#00120d] via-[#00120d]/80 to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#00120d] via-[#00120d]/80 to-transparent z-10" />

            <div className="flex flex-col gap-2">
                <TickerLine items={TRANSACTIONS} duration={40} />
                <div className="h-px bg-white/5 w-full mx-auto" />
                <TickerLine items={HIRING_FEEDS} duration={50} reverse={true} />
            </div>
        </div>
    )
}

export const Hero: React.FC = () => {
    const [presenceData, setPresenceData] = useState<any>({
        lobby: { count: 0, users: [], label: 'Celoris Cafe' },
        general: { count: 0, users: [], label: 'General Hub' },
        quantum: { count: 0, users: [], label: 'Quantum Room' },
        ai: { count: 0, users: [], label: 'AI Classroom' }
    });
    const LEARNING_ROOM_IDS = ['general', 'quantum', 'ai'];
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const supabase = createClient();
        const channels = [
            { id: 'lobby', name: 'room:lobby', label: 'Celoris Cafe', hasAi: false },
            { id: 'general', name: 'room:classroom_general', label: 'General Hub', hasAi: false },
            { id: 'quantum', name: 'room:classroom_quantum-science', label: 'Quantum Room', hasAi: true },
            { id: 'ai', name: 'room:classroom_ai-courses', label: 'AI Classroom', hasAi: true }
        ];

        const subs = channels.map(ch => {
            const channel = supabase.channel(ch.name);

            const update = () => {
                const state = channel.presenceState();
                const presences = Object.values(state).flat() as any[];
                const uniqueUsers = presences
                    .map(p => p.user || p)
                    .filter(Boolean)
                    .filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);

                setPresenceData((prev: any) => ({
                    ...prev,
                    [ch.id]: {
                        count: uniqueUsers.length,
                        users: uniqueUsers.slice(0, 3),
                        label: ch.label,
                        hasAi: ch.hasAi
                    }
                }));
            };

            return channel
                .on('presence', { event: 'sync' }, update)
                .on('presence', { event: 'join' }, update)
                .on('presence', { event: 'leave' }, update)
                .subscribe();
        });

        const interval = setInterval(() => {
            setActiveIndex(prev => (prev + 1) % LEARNING_ROOM_IDS.length);
        }, 5000);

        return () => {
            subs.forEach(s => s.unsubscribe());
            clearInterval(interval);
        };
    }, []);

    const activeLearningRoomId = LEARNING_ROOM_IDS[activeIndex];
    const activeLearningRoom = presenceData[activeLearningRoomId] || { count: 0, users: [] };
    const totalLearning = LEARNING_ROOM_IDS.reduce((acc: number, id: string) => acc + (presenceData[id]?.count || 0), 0);
    const cafeData = presenceData.lobby || { count: 0, users: [] };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="relative rounded-[2rem] overflow-hidden bg-[#00120d] text-white shadow-2xl shadow-emerald-900/10 border border-white/5"
        >
            {/* Background Decor - Animated */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.15, 0.25, 0.15]
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-600 rounded-full mix-blend-screen filter blur-[120px] -translate-y-1/2 translate-x-1/2"
            />
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.05, 0.15, 0.05]
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-600 rounded-full mix-blend-screen filter blur-[120px] translate-y-1/2 -translate-x-1/3"
            />

            <div className="relative z-10 px-10 py-16 md:py-24 flex flex-col md:flex-row items-center justify-between gap-16">
                <div className="flex-1 lg:flex-[1.2] max-w-2xl text-center md:text-left">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8"
                    >
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <Sparkles size={12} className="mr-1" />
                        AI-Powered Ecosystem 2.0
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-4xl md:text-6xl lg:text-7xl font-black leading-[1] mb-6 tracking-tight italic uppercase"
                    >
                        The AI-Powered <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-green-400 drop-shadow-[0_0_30px_rgba(16,185,129,0.3)]">Celoris Ecosystem.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="text-slate-400 text-lg md:text-xl mb-10 max-w-lg leading-relaxed font-bold uppercase italic tracking-wide"
                    >
                        Celoris Designs LLP is your trusted partner in digital transformation,
                        delivering cutting-edge solutions for individuals to thrive in the new era.
                    </motion.p>
                </div>

                <div className="flex-1 relative group w-full max-w-xl">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl aspect-square md:aspect-video lg:aspect-square"
                    >
                        <img
                            src="/images/homepage/hero.png"
                            alt="Unified AI Ecosystem"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#00120d] via-transparent to-transparent opacity-60" />

                        {/* Floating Status Badge */}
                        <motion.div
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute bottom-8 left-8 right-8 p-6 bg-[#00120d]/80 backdrop-blur-2xl rounded-[2rem] border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl"
                        >
                            <div className="text-left flex flex-col sm:flex-row gap-8 sm:items-center flex-1">
                                {/* Rooms Status - Moved to Left */}
                                <div className="flex flex-col">
                                    <div className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${activeLearningRoom.count === 0 && activeLearningRoom.hasAi ? 'bg-indigo-500 animate-pulse shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.8)]'}`} />
                                        Learning Classrooms
                                    </div>
                                    <AnimatePresence mode="wait">
                                        <motion.div
                                            key={activeLearningRoomId}
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -5 }}
                                            className="flex flex-col"
                                        >
                                            <div className={`text-sm font-black uppercase italic tracking-tight ${activeLearningRoom.count === 0 && activeLearningRoom.hasAi ? 'text-indigo-400' : 'text-white'}`}>
                                                {activeLearningRoom.count > 0 ? (
                                                    `${activeLearningRoom.count} in ${activeLearningRoom.label}`
                                                ) : activeLearningRoom.hasAi ? (
                                                    'Support agent online'
                                                ) : (
                                                    `0 in ${activeLearningRoom.label}`
                                                )}
                                            </div>
                                            {totalLearning > 0 && (
                                                <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">
                                                    {totalLearning} Academy Active
                                                </div>
                                            )}
                                        </motion.div>
                                    </AnimatePresence>
                                </div>

                                <div className="hidden sm:block w-px h-8 bg-white/10" />

                                {/* Cafe Status - Moved to Right */}
                                <div className="flex flex-col">
                                    <div className="text-[10px] font-black text-teal-400 uppercase tracking-[0.2em] mb-1.5 flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse shadow-[0_0_10px_rgba(20,184,166,0.8)]" />
                                        Celoris Cafe (Social)
                                    </div>
                                    <div className="text-sm font-black text-white uppercase italic tracking-tight">
                                        {cafeData.count} Online Now
                                    </div>
                                    <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5 whitespace-nowrap">
                                        Community Hub
                                    </div>
                                </div>
                            </div>

                            {/* Avatar group - Now showing Cafe Users */}
                            <div className="flex -space-x-4">
                                <AnimatePresence mode="popLayout">
                                    {cafeData.users.length > 0 ? (
                                        cafeData.users.map((u: any, i: number) => (
                                            <motion.div
                                                key={u.id || i}
                                                initial={{ opacity: 0, scale: 0.5, x: 20 }}
                                                animate={{ opacity: 1, scale: 1, x: 0 }}
                                                exit={{ opacity: 0, scale: 0.5, x: -20 }}
                                                className="w-10 h-10 rounded-full border-2 border-[#00120d] bg-teal-500/10 overflow-hidden backdrop-blur-md relative shadow-xl"
                                            >
                                                <img
                                                    src={u.avatar_url || u.profile_pic_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.id || i}`}
                                                    alt="u"
                                                    className="w-full h-full object-cover"
                                                />
                                            </motion.div>
                                        ))
                                    ) : (
                                        [1, 2, 3].map(i => (
                                            <div key={i} className="w-10 h-10 rounded-full border-2 border-[#00120d] bg-white/5 flex items-center justify-center backdrop-blur-md">
                                                <Users size={14} className="text-teal-400/20" />
                                            </div>
                                        ))
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>

            <ScrollingTicker />
        </motion.div>
    );
};
