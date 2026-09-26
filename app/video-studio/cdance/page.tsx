"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { DashboardShell } from "@/components/home-new/DashboardShell";
import { CDanceStudio } from '../components/CDanceStudio';
import { useAuth } from '@/components/providers/AuthProvider';

export default function CDanceProStudioPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0b0c10] text-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ccff00]"></div>
      </div>
    );
  }

  return (
    <DashboardShell hideTopBar={false} showSidebar={false}>
      <div className="w-full min-h-[calc(100vh-4rem)] bg-[#0b0c10] flex flex-col">
        <CDanceStudio
          onBackToEditor={() => router.push('/video-studio')}
          onInsertToTimeline={(_url, _title) => router.push('/video-studio')}
        />
      </div>
    </DashboardShell>
  );
}
