"use client"

import React from 'react';
import { TopHeader } from './TopHeader';
import { Sidebar } from './Sidebar';
import { GlobalScrollVideoBackground } from './GlobalScrollVideoBackground';

export function DashboardShell({
    children,
    headerContent,
    hideTopBar,
    showSidebar = false,
    showVideoBackground = false,
}: {
    children: React.ReactNode;
    headerContent?: React.ReactNode;
    hideTopBar?: boolean;
    showSidebar?: boolean;
    showVideoBackground?: boolean;
}) {
    return (
        <div className="min-h-screen bg-[#050608] flex flex-col text-slate-200 relative selection:bg-purple-500/30">
            {/* Living Scroll-Driven Video Canvas Background */}
            {showVideoBackground && <GlobalScrollVideoBackground />}

            {!hideTopBar && <TopHeader headerContent={headerContent} />}
            <div className="flex flex-1 w-full relative z-10">
                {showSidebar && <Sidebar className="hidden md:flex h-screen sticky top-0" />}
                <main className="flex-1 w-full overflow-x-clip">
                    {children}
                </main>
            </div>
        </div>
    );
}
