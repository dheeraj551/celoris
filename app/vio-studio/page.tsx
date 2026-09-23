"use client"

import React from 'react';
import { DashboardShell } from "@/components/home-new/DashboardShell";
import { MarketingStudio } from '@/components/marketing-studio/MarketingStudio';

export default function ViOStudioPage() {
  return (
    <DashboardShell hideTopBar={false} showSidebar={false}>
      <div className="w-full min-h-[calc(100vh-4rem)] bg-[#08090C]">
        <MarketingStudio />
      </div>
    </DashboardShell>
  );
}
