"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndex() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the admin dashboard
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500 mx-auto"></div>
        <p className="mt-4 text-slate-300">Redirecting to Admin Dashboard...</p>
      </div>
    </div>
  );
}
