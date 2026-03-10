"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { MessageCircle, Gift, Sparkles, RotateCcw } from 'lucide-react';

interface WheelOfLuckProps {
    courses: any[];
}

/** Map a course to a single representative emoji based on subject/title keywords */
function getCourseEmoji(course: any): string {
    const raw = ((course.subject || '') + ' ' + (course.title || '')).toLowerCase();
    if (raw.includes('python') || raw.includes('coding') || raw.includes('programm')) return '🐍';
    if (raw.includes('ai') || raw.includes('artificial') || raw.includes('machine') || raw.includes('llm') || raw.includes('agent')) return '🤖';
    if (raw.includes('guitar') || raw.includes('music') || raw.includes('bollywood guitar')) return '🎸';
    if (raw.includes('dance') || raw.includes('zumba')) return '💃';
    if (raw.includes('yoga') || raw.includes('hatha')) return '🧘';
    if (raw.includes('fitness') || raw.includes('reset') || raw.includes('strength') || raw.includes('mobility')) return '💪';
    if (raw.includes('english') || raw.includes('speak') || raw.includes('confident')) return '🗣️';
    if (raw.includes('excel') || raw.includes('spreadsheet')) return '📊';
    if (raw.includes('design') || raw.includes('blender') || raw.includes('3d') || raw.includes('photoshop') || raw.includes('retouch')) return '🎨';
    if (raw.includes('content') || raw.includes('social media') || raw.includes('marketing')) return '📱';
    if (raw.includes('physics')) return '⚡';
    if (raw.includes('chemistry')) return '🧪';
    if (raw.includes('maths') || raw.includes('math')) return '📐';
    if (raw.includes('livekit') || raw.includes('voice') || raw.includes('real-time')) return '🎙️';
    if (raw.includes('langchain') || raw.includes('rag') || raw.includes('prompt')) return '🔗';
    if (raw.includes('deploy') || raw.includes('serverless') || raw.includes('edge')) return '🚀';
    if (raw.includes('product') || raw.includes('money') || raw.includes('business')) return '💰';
    if (raw.includes('multimodal')) return '🌐';
    if (raw.includes('trust') || raw.includes('safety') || raw.includes('ethic')) return '🛡️';
    if (raw.includes('cyber') || raw.includes('security')) return '🔐';
    if (raw.includes('science') || raw.includes('research')) return '🔬';
    if (raw.includes('vibe') || raw.includes('workflow')) return '⚡';
    return '📚';
}

/** Vibrant color palette for segments */
const COLORS = [
    '#10b981', '#3b82f6', '#8b5cf6', '#f43f5e',
    '#f59e0b', '#0ea5e9', '#6366f1', '#ec4899',
    '#14b8a6', '#f97316', '#a855f7', '#22c55e',
    '#ef4444', '#06b6d4', '#84cc16', '#e879f9',
    '#fb923c', '#34d399', '#60a5fa', '#c084fc',
    '#fb7185', '#fbbf24', '#4ade80', '#38bdf8',
];

function createSegmentPath(index: number, totalSegments: number, radius: number): string {
    const startAngle = (index * 360) / totalSegments;
    const endAngle = ((index + 1) * 360) / totalSegments;

    const startX = radius + radius * Math.cos((Math.PI * startAngle) / 180);
    const startY = radius + radius * Math.sin((Math.PI * startAngle) / 180);

    const endX = radius + radius * Math.cos((Math.PI * endAngle) / 180);
    const endY = radius + radius * Math.sin((Math.PI * endAngle) / 180);

    const largeArcFlag = endAngle - startAngle <= 180 ? 0 : 1;

    return `M ${radius} ${radius} L ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${endX} ${endY} Z`;
}

/** Position of emoji icon along the segment bisector, at ~65% radius */
function getEmojiPosition(index: number, totalSegments: number, radius: number): { x: number; y: number } {
    const midAngle = ((index + 0.5) * 360) / totalSegments;
    const radAngle = (Math.PI * midAngle) / 180;
    const dist = radius * 0.65;
    return {
        x: radius + dist * Math.cos(radAngle),
        y: radius + dist * Math.sin(radAngle),
    };
}

export const WheelOfLuck = ({ courses }: WheelOfLuckProps) => {
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [selectedCourse, setSelectedCourse] = useState<any | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Filter test / placeholder courses
    const excludedTitles = ['my new ai course will be here', 'nana banana bootcamp', 'agentic ai for beginners', 'mastering nano banana pro', 'class 9 physics', 'maths 12th'];

    // Deduplicate by title (case-insensitive)
    const seen = new Set<string>();
    const validCourses = courses.filter(c => {
        const t = (c.title || '').toLowerCase().trim();
        if (excludedTitles.some(ex => t.includes(ex) || t.includes('banana'))) return false;
        if (seen.has(t)) return false;
        seen.add(t);
        return true;
    });

    // Up to 20 courses on the wheel for readability
    const wheelCourses = validCourses.slice(0, 20);
    const numSegments = wheelCourses.length;
    const segmentAngle = 360 / numSegments;

    const spinWheel = () => {
        if (isSpinning || numSegments === 0) return;

        setIsSpinning(true);
        setShowResult(false);
        setSelectedCourse(null);

        const spins = 5 + Math.floor(Math.random() * 3); // 5–7 full rotations
        const targetIndex = Math.floor(Math.random() * numSegments);

        // Pointer is at 12 o'clock (270° in SVG coords from 3 o'clock = standard 0).
        // We want bisector of targetIndex segment to end at 270°.
        const bisectorAngle = (targetIndex + 0.5) * segmentAngle;
        const extraDegree = 270 - bisectorAngle;
        const nextRotation = rotation + spins * 360 + extraDegree - (rotation % 360);

        setRotation(nextRotation);

        setTimeout(() => {
            setIsSpinning(false);
            setSelectedCourse(wheelCourses[targetIndex]);
            setShowResult(true);
        }, 5500);
    };

    const resetWheel = () => {
        setShowResult(false);
        setSelectedCourse(null);
    };

    const getTargetDate = () => {
        const d = new Date();
        d.setDate(d.getDate() + 2);
        d.setHours(12, 0, 0, 0);
        return d;
    };

    if (numSegments === 0) return null;

    // Don't render the SVG wheel on the server to avoid hydration mismatches
    // from floating-point trig differences between Node.js and the browser.
    if (!mounted) {
        return (
            <div className="relative py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
                        <div className="w-80 h-80 md:w-[460px] md:h-[460px] rounded-full bg-white/5 border border-white/5 animate-pulse" />
                        <div className="w-full max-w-md h-80 rounded-[2.5rem] bg-white/5 border border-white/5 animate-pulse" />
                    </div>
                </div>
            </div>
        );
    }

    const targetDate = getTargetDate();
    const formattedDate = targetDate.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });

    // Emoji font size scales down for more segments
    const emojiFontSize = Math.max(14, 26 - numSegments * 0.5);

    return (
        <div className="relative py-20 overflow-hidden">
            {/* Background glows */}
            <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-6 italic">
                        <Gift size={12} className="animate-pulse" /> Try Your Luck
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter leading-[0.85] mb-6">
                        Wheel of <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Fortune</span>
                    </h2>
                    <p className="text-slate-500 text-sm max-w-xl mx-auto font-bold uppercase tracking-widest italic leading-relaxed">
                        Spin the wheel to win a free live masterclass on one of our {numSegments} premium courses — scheduled 2 days from now at 12:00 PM!
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row items-center justify-center gap-16">
                    {/* ── Wheel ── */}
                    <div className="relative w-80 h-80 md:w-[460px] md:h-[460px] flex-shrink-0">
                        {/* Outer decorative ring */}
                        <div className="absolute inset-[-12px] rounded-full border-4 border-dashed border-emerald-500/20 animate-[spin_30s_linear_infinite]" />
                        <div className="absolute inset-[-24px] rounded-full border-2 border-dashed border-white/5 animate-[spin_20s_linear_infinite_reverse]" />

                        {/* Pointer */}
                        <div
                            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-5 z-20 drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                            style={{ filter: 'drop-shadow(0 0 8px rgba(255,255,255,0.5))' }}
                        >
                            <svg width="28" height="40" viewBox="0 0 28 40">
                                <polygon points="14,38 0,2 28,2" fill="white" />
                                <polygon points="14,38 0,2 28,2" fill="url(#ptrGrad)" opacity="0.5" />
                                <defs>
                                    <linearGradient id="ptrGrad" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#10b981" />
                                        <stop offset="100%" stopColor="white" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        {/* Glow behind wheel */}
                        <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-3xl -z-10" />

                        {/* The spinning wheel */}
                        <motion.div
                            className="w-full h-full rounded-full shadow-[0_0_60px_rgba(0,0,0,0.7)] ring-4 ring-white/10 overflow-hidden"
                            animate={{ rotate: rotation }}
                            transition={{ duration: 5.5, ease: [0.12, 0.8, 0.1, 1] }}
                        >
                            <svg
                                width="100%"
                                height="100%"
                                viewBox="0 0 400 400"
                                style={{ display: 'block' }}
                            >
                                <defs>
                                    {/* Radial overlay for sheen */}
                                    <radialGradient id="sheenGrad" cx="40%" cy="35%" r="60%">
                                        <stop offset="0%" stopColor="white" stopOpacity="0.07" />
                                        <stop offset="100%" stopColor="white" stopOpacity="0" />
                                    </radialGradient>
                                </defs>

                                {/* Segments */}
                                {wheelCourses.map((course, index) => {
                                    const path = createSegmentPath(index, numSegments, 200);
                                    const { x, y } = getEmojiPosition(index, numSegments, 200);
                                    const midAngle = (index + 0.5) * segmentAngle;
                                    const emoji = getCourseEmoji(course);

                                    return (
                                        <g key={course.id || index}>
                                            {/* Colored slice */}
                                            <path
                                                d={path}
                                                fill={COLORS[index % COLORS.length]}
                                                stroke="rgba(0,0,0,0.15)"
                                                strokeWidth="1.5"
                                            />
                                            {/* Slightly darker inner arc for depth */}
                                            <path
                                                d={path}
                                                fill="transparent"
                                                stroke="rgba(255,255,255,0.08)"
                                                strokeWidth="0.5"
                                            />
                                            {/* Emoji icon, rotated to face outward */}
                                            <text
                                                x={x}
                                                y={y}
                                                textAnchor="middle"
                                                dominantBaseline="central"
                                                fontSize={emojiFontSize}
                                                transform={`rotate(${midAngle + 90}, ${x}, ${y})`}
                                                style={{
                                                    userSelect: 'none',
                                                    filter: 'drop-shadow(0px 1px 3px rgba(0,0,0,0.6))',
                                                }}
                                            >
                                                {emoji}
                                            </text>
                                        </g>
                                    );
                                })}

                                {/* Sheen overlay */}
                                <circle cx="200" cy="200" r="200" fill="url(#sheenGrad)" />

                                {/* Divider lines between segments */}
                                {wheelCourses.map((_, index) => {
                                    const angle = (index * 360) / numSegments;
                                    const rad = (Math.PI * angle) / 180;
                                    return (
                                        <line
                                            key={`line-${index}`}
                                            x1="200"
                                            y1="200"
                                            x2={200 + 200 * Math.cos(rad)}
                                            y2={200 + 200 * Math.sin(rad)}
                                            stroke="rgba(0,0,0,0.2)"
                                            strokeWidth="1.5"
                                        />
                                    );
                                })}

                                {/* Center circle background */}
                                <circle cx="200" cy="200" r="42" fill="#0a0f1e" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                            </svg>
                        </motion.div>

                        {/* Center SPIN button (overlaid over SVG center) */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                            <button
                                onClick={spinWheel}
                                disabled={isSpinning || showResult}
                                className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-black text-[11px] uppercase tracking-widest shadow-[0_0_30px_rgba(16,185,129,0.5)] active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed border-2 border-white/20"
                            >
                                {isSpinning ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                                    >
                                        <RotateCcw size={18} />
                                    </motion.div>
                                ) : 'SPIN'}
                            </button>
                        </div>
                    </div>

                    {/* ── Result Panel ── */}
                    <div className="w-full max-w-md">
                        <AnimatePresence mode="wait">
                            {showResult && selectedCourse ? (
                                <motion.div
                                    key="result"
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                                    className="p-8 rounded-[2.5rem] bg-emerald-500/10 border border-emerald-500/30 shadow-[0_0_60px_rgba(16,185,129,0.15)] backdrop-blur-md"
                                >
                                    {/* Winner emoji */}
                                    <div className="text-6xl text-center mb-4">
                                        {getCourseEmoji(selectedCourse)}
                                    </div>

                                    <div className="text-center mb-6">
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-3">
                                            <Sparkles size={10} className="animate-pulse" /> You Won!
                                        </span>
                                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">
                                            Free Masterclass
                                        </h3>
                                    </div>

                                    <div className="bg-white/5 rounded-2xl p-4 mb-4 border border-white/5 text-left">
                                        <p className="text-emerald-400 font-bold mb-2 uppercase text-[10px] tracking-widest border-b border-white/5 pb-2">
                                            🎓 Course
                                        </p>
                                        <p className="text-white font-semibold italic line-clamp-3 text-sm leading-relaxed">
                                            {selectedCourse.title}
                                        </p>
                                    </div>

                                    <div className="bg-emerald-500/5 rounded-2xl p-4 mb-8 border border-emerald-500/10 text-left">
                                        <p className="text-slate-400 font-bold mb-2 uppercase text-[10px] tracking-widest border-b border-emerald-500/10 pb-2">
                                            📅 Session Schedule
                                        </p>
                                        <p className="text-emerald-400 font-black italic uppercase tracking-wider text-sm">
                                            {formattedDate} @ 12:00 PM IST
                                        </p>
                                    </div>

                                    <a
                                        href={`https://wa.me/919643579101?text=I%20won%20the%20Wheel%20of%20Luck!%20I%20want%20to%20book%20my%20free%20masterclass%20for%20${encodeURIComponent(selectedCourse.title)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block mb-4"
                                    >
                                        <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] italic transition-all group shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                                            <span className="flex items-center justify-center gap-2">
                                                Claim Free Class on WhatsApp
                                                <MessageCircle size={14} className="group-hover:scale-110 transition-transform" />
                                            </span>
                                        </Button>
                                    </a>

                                    <button
                                        onClick={resetWheel}
                                        className="w-full text-[10px] text-slate-500 hover:text-slate-300 uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <RotateCcw size={12} /> Spin Again
                                    </button>
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="placeholder"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="p-10 rounded-[2.5rem] bg-[#0d1321]/60 border border-white/5 backdrop-blur-md min-h-[360px] flex flex-col items-center justify-center text-center"
                                >
                                    {/* Preview of some emojis from courses */}
                                    <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-[240px]">
                                        {wheelCourses.slice(0, 8).map((c, i) => (
                                            <span
                                                key={i}
                                                className="text-2xl w-12 h-12 rounded-xl flex items-center justify-center"
                                                style={{ background: COLORS[i % COLORS.length] + '33', border: `1px solid ${COLORS[i % COLORS.length]}44` }}
                                            >
                                                {getCourseEmoji(c)}
                                            </span>
                                        ))}
                                    </div>

                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter mb-3">
                                        Spin to Win
                                    </h3>
                                    <p className="text-slate-500 text-[11px] uppercase tracking-widest font-bold max-w-[220px] leading-relaxed">
                                        {numSegments} courses on the wheel. One free class is yours!
                                    </p>

                                    {isSpinning && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: [0.4, 1, 0.4] }}
                                            transition={{ duration: 1.2, repeat: Infinity }}
                                            className="mt-6 text-emerald-400 text-[10px] font-black uppercase tracking-widest"
                                        >
                                            ✨ Spinning...
                                        </motion.p>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
};
