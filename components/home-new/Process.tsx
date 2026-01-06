"use client"

import React from 'react';
import { BookOpenCheck, Cog, Trophy, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export const Process: React.FC = () => {
    return (
        <div className="mt-24 md:mt-32 bg-[#0d1321]/40 rounded-[3rem] p-12 md:p-20 border border-white/5 backdrop-blur-3xl shadow-3xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05)_0%,transparent_70%)] pointer-events-none" />

            <div className="text-center mb-16 relative z-10">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[8px] font-black uppercase tracking-widest mb-4">
                    <Zap size={10} /> Transmission Sequence
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter">How Celoris Synchronizes</h2>
                <p className="text-slate-500 text-xs md:text-sm mt-4 font-bold uppercase tracking-widest italic">Seamless experience from learning to earning protocol.</p>
            </div>

            <div className="relative">
                {/* Connector Line - Animated */}
                <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-[2px] bg-white/5 overflow-hidden">
                    <motion.div
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="w-1/2 h-full bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
                    {[
                        {
                            step: "01",
                            title: "Learn",
                            desc: "Initialize skills via our high-bandwidth expert node network.",
                            icon: BookOpenCheck,
                            color: "from-emerald-500 to-teal-600"
                        },
                        {
                            step: "02",
                            title: "Apply",
                            desc: "Deploy competencies into elite freelance and job marketplaces.",
                            icon: Cog,
                            color: "from-emerald-500 to-teal-600"
                        },
                        {
                            step: "03",
                            title: "Succeed",
                            desc: "Catalyze career trajectory within our unified growth ecosystem.",
                            icon: Trophy,
                            color: "from-emerald-500 to-teal-600"
                        }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="flex flex-col items-center text-center group"
                        >
                            <div className={`w-24 h-24 rounded-[2rem] bg-gradient-to-br ${item.color} flex items-center justify-center mb-8 shadow-3xl shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500 relative`}>
                                <div className="absolute -top-3 -right-3 w-10 h-10 bg-[#0d1321] border border-emerald-500/30 rounded-full flex items-center justify-center text-[10px] font-black text-emerald-400 shadow-xl">
                                    {item.step}
                                </div>
                                <item.icon size={32} className="text-white" />
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 italic uppercase tracking-tighter">{item.title}</h3>
                            <p className="text-sm text-slate-500 max-w-xs font-bold uppercase tracking-tight leading-relaxed">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};
