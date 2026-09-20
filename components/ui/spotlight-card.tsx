"use client";

import React, { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  beamColor?: string;
  glowColor?: string;
  radius?: string; // e.g. "1.5rem", "2rem", "2.5rem"
}

export function SpotlightCard({
  children,
  className = "",
  innerClassName = "",
  beamColor = "rgba(168, 85, 247, 0.7)", // Vibrant purple/violet beam
  glowColor = "rgba(168, 85, 247, 0.10)", // Soft surface glow
  radius = "1.5rem",
  ...props
}: SpotlightCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative p-[1px] overflow-hidden transition-all duration-300 group/spotlight",
        className
      )}
      style={{
        borderRadius: radius,
      }}
      {...props}
    >
      {/* Default Subtle Static Border Base */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-500"
        style={{
          background: "linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.03) 100%)",
        }}
      />

      {/* Dynamic Mouse Spotlight Border Beam */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[inherit] transition-opacity duration-300 z-0"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${beamColor}, transparent 65%)`,
        }}
      />

      {/* Inner Card Container (Nano-Glass Frosted Chassis) */}
      <div
        className={cn(
          "relative w-full h-full bg-[#08090d]/35 backdrop-blur-2xl overflow-hidden z-10 transition-colors duration-300 shadow-[inset_0_1px_1px_rgba(255,255,255,0.12)]",
          innerClassName
        )}
        style={{
          borderRadius: `calc(${radius} - 1px)`,
        }}
      >
        {/* Top Hairline Rim Reflection */}
        <div className="absolute top-0 inset-x-8 h-[1px] bg-gradient-to-r from-transparent via-white/[0.18] to-transparent pointer-events-none z-10" />

        {/* Inner Surface Spotlight Glow */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(450px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`,
          }}
        />

        {/* Subtle Ambient Mesh Grid */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Card Content */}
        <div className="relative z-10 w-full h-full flex flex-col justify-between">
          {children}
        </div>
      </div>
    </div>
  );
}
