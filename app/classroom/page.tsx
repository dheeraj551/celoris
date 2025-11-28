"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the ClassroomApp to avoid SSR issues with browser-only APIs if any
const ClassroomApp = dynamic(() => import('@/components/classroom/ClassroomApp'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    ),
});

export default function ClassroomPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <ClassroomApp />
        </div>
    );
}
