"use client";

import dynamic from "next/dynamic";

// Dynamic import with SSR disabled to guarantee pure client-side audio, canvas & local storage experience
const LumigramApp = dynamic(() => import("@/components/lumigram/App"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-neutral-400">Loading Celoris Pulse...</span>
      </div>
    </div>
  ),
});

export default function SocialPage() {
  return <LumigramApp />;
}
