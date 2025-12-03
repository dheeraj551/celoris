"use client";

import dynamic from 'next/dynamic';
import React from 'react';

// Dynamically import the LiveClassroom to avoid SSR issues
const LiveClassroom = dynamic(() => import('@/components/classroom/views/LiveClassroom'), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    ),
});

export default function ClassroomPage() {
    return (
        <div className="h-[calc(100vh-4rem)] bg-slate-50">
            <LiveClassroom />
        </div>
    );
}
