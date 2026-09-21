"use client";

import React from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, Sparkles, Star, type LucideIcon } from "lucide-react";
import { Odometer } from "@/components/ui/odometer";
import { cn } from "@/lib/utils";

interface Metric {
    id: string;
    odometerValue: string;
    title: string;
    subtitle: string;
    icon: LucideIcon;
    iconColor: string;
    iconBg: string;
    glowColor: string;
    badge?: string;
    accentColor: string;
}

const METRICS: Metric[] = [
    {
        id: "customers",
        odometerValue: "50,000+",
        title: "Indian Customers Empowered",
        subtitle: "Active daily across all 28 states",
        icon: Users,
        iconColor: "text-emerald-400",
        iconBg: "bg-emerald-500/10 border-emerald-500/20",
        glowColor: "rgba(16, 185, 129, 0.15)",
        accentColor: "from-emerald-400 to-teal-300",
        badge: "Pan-India",
    },
    {
        id: "free",
        odometerValue: "₹0",
        title: "A Free Tier for Students",
        subtitle: "No credit card or hidden charges",
        icon: ShieldCheck,
        iconColor: "text-amber-400",
        iconBg: "bg-amber-500/10 border-amber-500/20",
        glowColor: "rgba(245, 158, 11, 0.15)",
        accentColor: "from-amber-400 to-orange-400",
        badge: "Guaranteed",
    },
    {
        id: "models",
        odometerValue: "20+",
        title: "Free Creative AI Models",
        subtitle: "Generative video, photo & 3D",
        icon: Sparkles,
        iconColor: "text-cyan-400",
        iconBg: "bg-cyan-500/10 border-cyan-500/20",
        glowColor: "rgba(6, 182, 212, 0.15)",
        accentColor: "from-cyan-400 to-blue-400",
        badge: "AI Powered",
    },
    {
        id: "rating",
        odometerValue: "4.9 ★",
        title: "Instructor Rating",
        subtitle: "Over 4,800+ verified reviews",
        icon: Star,
        iconColor: "text-yellow-400",
        iconBg: "bg-yellow-500/10 border-yellow-500/20",
        glowColor: "rgba(234, 179, 8, 0.15)",
        accentColor: "from-yellow-400 to-rose-400",
        badge: "Top Rated",
    },
];

export function SocialProofCounters() {
    return (
        <div className="w-full">
            {/* Tapered Ambient Light Channel Divider (Replaces harsh Walkman line) */}
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent my-6 sm:my-8" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
                {METRICS.map((metric, idx) => {
                    const Icon = metric.icon;

                    return (
                        <motion.div
                            key={metric.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: 0.6, delay: idx * 0.1, ease: "easeOut" }}
                            whileHover={{ y: -3, scale: 1.01 }}
                            className={cn(
                                "group relative flex flex-col p-4 sm:p-5 rounded-2xl",
                                "bg-white/[0.04] hover:bg-white/[0.08] backdrop-blur-2xl",
                                "border border-white/[0.08] hover:border-white/[0.18]",
                                "shadow-[0_10px_25px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.12)]",
                                "hover:shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.2)]",
                                "transition-all duration-300 select-none overflow-hidden"
                            )}
                            style={{
                                boxShadow: `0 10px 30px -10px ${metric.glowColor}, inset 0 1px 1px rgba(255,255,255,0.12)`,
                            }}
                        >
                            {/* Ambient Top Glow Line on Hover */}
                            <div className="absolute top-0 inset-x-4 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                            {/* Metric Header: Icon & Dynamic OLED Badge */}
                            <div className="flex items-center justify-between mb-3.5">
                                <div className="relative flex items-center justify-center">
                                    <div
                                        className={cn(
                                            "w-8 h-8 rounded-full border border-white/[0.12] bg-white/[0.05] flex items-center justify-center transition-transform duration-200 group-hover:scale-110",
                                            metric.iconBg
                                        )}
                                    >
                                        <Icon className={cn("w-4 h-4", metric.iconColor)} />
                                    </div>
                                    {/* Dynamic Micro-Aura */}
                                    <div
                                        className="absolute inset-0 rounded-full blur-md opacity-0 group-hover:opacity-75 transition-opacity duration-200 pointer-events-none"
                                        style={{ background: metric.glowColor }}
                                    />
                                </div>

                                {metric.badge && (
                                    <span className="flex items-center gap-1.5 text-[9px] font-mono font-medium tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-neutral-400 group-hover:text-neutral-200 group-hover:border-white/20 transition-colors">
                                        <span
                                            className="w-1 h-1 rounded-full animate-pulse"
                                            style={{ background: metric.glowColor }}
                                        />
                                        {metric.badge}
                                    </span>
                                )}
                            </div>

                            {/* Rolling Odometer Number with Luminous Sheen */}
                            <div className="mb-2">
                                <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.15)]">
                                    <Odometer
                                        value={metric.odometerValue}
                                        delay={0.15 + idx * 0.1}
                                        className="text-white"
                                    />
                                </span>
                            </div>

                            {/* Title with Modern Crisp Typography */}
                            <h4 className="text-xs sm:text-[13px] font-medium tracking-tight text-neutral-200 group-hover:text-white transition-colors leading-snug mb-1">
                                {metric.title}
                            </h4>

                            {/* Subtitle */}
                            <p className="text-[11px] sm:text-xs text-neutral-400 group-hover:text-neutral-300 transition-colors leading-relaxed">
                                {metric.subtitle}
                            </p>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
