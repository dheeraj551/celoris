"use client"

import React from 'react';
import Link from 'next/link';
import { BookOpen, Wallet, Users, Layout, ArrowUpRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface FeatureCardProps {
    title: string;
    description: string;
    tag: string;
    icon: any;
    actionText: string;
    link?: string;
    index: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, tag, icon: Icon, actionText, link = "#", index }) => (
    <motion.div
        variants={{
            hidden: { opacity: 0, y: 30 },
            show: { opacity: 1, y: 0 }
        }}
        whileHover={{ y: -10, scale: 1.02 }}
        className="group bg-[#0d1321]/40 p-10 rounded-[2.5rem] border border-white/5 hover:border-emerald-500/30 backdrop-blur-3xl shadow-3xl transition-all duration-500 flex flex-col h-full relative overflow-hidden"
    >
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-emerald-500/10 transition-colors duration-500" />

        <div className="flex justify-between items-start mb-8 relative z-10">
            <div className="p-4 bg-emerald-500/10 rounded-2xl group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 text-emerald-400 shadow-3xl shadow-emerald-500/10">
                <Icon size={28} />
            </div>
            <span className="px-3 py-1 bg-white/5 text-slate-500 text-[9px] font-black uppercase rounded-lg tracking-widest group-hover:text-emerald-400 transition-colors duration-500 italic">
                {tag}
            </span>
        </div>

        <h3 className="text-2xl font-black text-white mb-4 tracking-tighter group-hover:text-emerald-400 transition-colors italic uppercase">{title}</h3>
        <p className="text-sm text-slate-500 font-bold leading-relaxed mb-8 flex-grow uppercase tracking-tight">
            {description}
        </p>

        <Link href={link} className="w-full py-4 rounded-2xl border border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all flex items-center justify-center gap-2 group/btn">
            {actionText}
            <ArrowUpRight size={16} className="group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
        </Link>
    </motion.div>
);

export const Features: React.FC = () => {
    const features = [
        {
            title: "Learn",
            description: "Master high-demand skills with our legendary courses and real-time expert guidance.",
            tag: "Academy Node",
            icon: BookOpen,
            actionText: "Enter Academy",
            link: "/learn"
        },
        {
            title: "Teach",
            description: "Pivot your career or find elite freelance opportunities in our curated talent ecosystem.",
            tag: "Capital Grid",
            icon: Wallet,
            actionText: "Launch Career",
            link: "/teach"
        },
        {
            title: "Social",
            description: "Collaborate with visionaries and build lasting connections in our premium social hubs.",
            tag: "Nexus Link",
            icon: Users,
            actionText: "Join Nexus",
            link: "/social"
        },
        {
            title: "Apps",
            description: "Supercharge your workflow with our master-suite of AI-driven productivity tools.",
            tag: "Toolbox Access",
            icon: Layout,
            actionText: "Open Toolbox",
            link: "/apps"
        }
    ];

    return (
        <div className="mt-24 md:mt-32">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center justify-between mb-16 px-4"
            >
                <div>
                    <div className="flex items-center gap-2 text-emerald-500 text-[10px] font-black uppercase tracking-[0.3em] mb-2">
                        <Sparkles size={12} /> Sync Operations
                    </div>
                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic uppercase">Experience Unified Celoris Ecosystem</h2>
                    <div className="h-1.5 w-24 bg-emerald-600 rounded-full mt-4 shadow-[0_0_20px_rgba(16,185,129,0.5)]" />
                </div>
            </motion.div>

            <motion.div
                variants={{
                    show: {
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
                {features.map((feature, idx) => (
                    <FeatureCard key={idx} index={idx} {...feature} />
                ))}
            </motion.div>
        </div>
    );
};
