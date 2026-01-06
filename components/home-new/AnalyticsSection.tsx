"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Activity, Shield, Cpu, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const AnalyticsSection: React.FC = () => {
    return (
        <section className="mt-24 md:mt-32">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="relative group order-2 lg:order-1"
                >
                    <div className="relative rounded-[3rem] overflow-hidden border border-white/10 shadow-3xl aspect-[4/3] lg:aspect-square">
                        <img
                            src="/images/homepage/analytics.png"
                            alt="AI Analytics Interface"
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#050810] via-transparent to-transparent opacity-40" />

                        {/* Interactive UI Overlays */}
                        <div className="absolute top-8 left-8 p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <div className="text-[10px] font-black text-white uppercase tracking-widest">Global Node Sync: Active</div>
                        </div>

                        <div className="absolute bottom-8 right-8 p-6 bg-[#0d1321]/80 backdrop-blur-2xl rounded-2xl border border-emerald-500/20 shadow-3xl shadow-emerald-500/10">
                            <div className="flex items-center gap-4 mb-3">
                                <Activity className="text-emerald-500 h-5 w-5" />
                                <div className="text-xl font-black text-white italic tracking-tighter">99.9% Uptime</div>
                            </div>
                            <div className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Distributed Network Performance</div>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="space-y-10 order-1 lg:order-2"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-widest">
                        <Cpu size={12} /> High-Bandwidth API
                    </div>

                    <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">Intelligence <br />In Real-Time</h2>

                    <p className="text-lg text-slate-400 font-bold uppercase tracking-wide leading-relaxed italic">
                        Our proprietary analytics engine provides deep insights into your growth trajectory,
                        optimizing every interaction within the Celoris ecosystem.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                        <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-emerald-500/5 transition-colors">
                            <Shield className="text-emerald-500 h-6 w-6 shrink-0" />
                            <div>
                                <h4 className="text-sm font-black text-white uppercase italic mb-1">Encrypted Data</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">End-to-end security protocol enabled.</p>
                            </div>
                        </div>
                        <div className="flex gap-4 p-4 rounded-2xl border border-white/5 bg-white/5 hover:bg-emerald-500/5 transition-colors">
                            <Zap className="text-emerald-500 h-6 w-6 shrink-0" />
                            <div>
                                <h4 className="text-sm font-black text-white uppercase italic mb-1">Instant Sync</h4>
                                <p className="text-[10px] text-slate-500 font-bold uppercase">Sub-millisecond latency for all nodes.</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <Button
                            asChild
                            className="bg-transparent border border-white/10 text-white hover:bg-white/5 hover:border-emerald-500/50 h-14 px-8 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all"
                        >
                            <Link href="/apps" className="flex items-center gap-3">
                                View Analytics Suite <ArrowRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
