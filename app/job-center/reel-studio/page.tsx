import type { Metadata } from "next";
import { JobAlertReelStudio } from "@/components/job-center/JobAlertReelStudio";

export const metadata: Metadata = {
  title: "Job Alert Reel Studio (9:16) | Celoris Job Center",
  description:
    "Generate and export animated 1080×1920 vertical Job Alert Reels for Instagram Reels, YouTube Shorts, and LinkedIn directly from Celoris Certified Roles.",
};

export default function JobAlertReelStudioPage() {
  return <JobAlertReelStudio />;
}
