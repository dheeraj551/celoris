"use client"

import React from 'react';
import { Rocket, ArrowRight, Sparkles, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Hero: React.FC = () => {
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
                        Celoris Designs AI is your trusted partner in digital transformation,
                        delivering cutting-edge solutions for individuals to thrive in the new era.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Button
                            asChild
                            className="bg-emerald-600 hover:bg-emerald-500 text-white h-16 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-3xl shadow-emerald-500/20 transition-all border-none"
                        >
                            <Link href="/social" className="flex items-center gap-3">
                                Initialize Link <ArrowRight className="h-5 w-5" />
                            </Link>
                        </Button>
                    </motion.div>
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
                            className="absolute bottom-8 left-8 right-8 p-6 bg-white/5 backdrop-blur-2xl rounded-2xl border border-white/10 flex items-center justify-between"
                        >
                            <div className="text-left">
                                <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">Grid Status</div>
                                <div className="text-xs font-bold text-white uppercase italic">Active Ecosystem Sync</div>
                            </div>
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-8 h-8 rounded-full border-2 border-[#00120d] bg-emerald-500/10 flex items-center justify-center backdrop-blur-md">
                                        <Users size={12} className="text-emerald-400" />
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};
