"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const DIGITS_STRIP = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
];

interface OdometerProps {
    value: string;
    className?: string;
    delay?: number;
}

export function Odometer({ value, className = "", delay = 0 }: OdometerProps) {
    const containerRef = useRef<HTMLSpanElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: "-40px" });

    const characters = value.split("");

    return (
        <span
            ref={containerRef}
            className={cn(
                "inline-flex items-center font-mono font-black select-none leading-none tracking-tight h-[1.15em] overflow-hidden",
                className
            )}
            style={{ fontVariantNumeric: "tabular-nums" }}
        >
            {characters.map((char, index) => {
                const isDigit = /^[0-9]$/.test(char);

                if (isDigit) {
                    const digit = parseInt(char, 10);
                    // Landing on the second iteration of the digit (index 10 + digit)
                    // Total items = 20, so each step is 5% (100% / 20)
                    const targetY = `-${(10 + digit) * 5}%`;

                    return (
                        <span
                            key={index}
                            className="relative inline-block h-[1.15em] overflow-hidden leading-none w-[0.62em]"
                        >
                            <motion.span
                                initial={{ y: "0%" }}
                                animate={isInView ? { y: targetY } : { y: "0%" }}
                                transition={{
                                    type: "spring",
                                    stiffness: 55,
                                    damping: 14,
                                    mass: 0.85,
                                    delay: delay + index * 0.06,
                                }}
                                className="absolute top-0 left-0 flex flex-col items-center w-full"
                            >
                                {DIGITS_STRIP.map((d, i) => (
                                    <span
                                        key={i}
                                        className="h-[1.15em] flex items-center justify-center leading-none"
                                    >
                                        {d}
                                    </span>
                                ))}
                            </motion.span>
                        </span>
                    );
                }

                if (char === "★") {
                    return (
                        <span
                            key={index}
                            className="inline-flex items-center justify-center h-[1.15em] leading-none pl-1"
                        >
                            <Star className="w-[0.75em] h-[0.75em] fill-amber-400 text-amber-400 inline-block drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" />
                        </span>
                    );
                }

                if (char === "₹") {
                    return (
                        <span
                            key={index}
                            className="inline-flex items-center justify-center h-[1.15em] leading-none pr-0.5 text-[0.9em] opacity-90"
                        >
                            ₹
                        </span>
                    );
                }

                if (char === "+") {
                    return (
                        <span
                            key={index}
                            className="inline-flex items-center justify-center h-[1.15em] leading-none text-emerald-400 font-bold ml-0.5"
                        >
                            +
                        </span>
                    );
                }

                return (
                    <span
                        key={index}
                        className="inline-flex items-center justify-center h-[1.15em] leading-none px-[0.05em]"
                    >
                        {char}
                    </span>
                );
            })}
        </span>
    );
}
