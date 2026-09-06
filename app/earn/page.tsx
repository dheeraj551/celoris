import { permanentRedirect } from "next/navigation"

// /earn (the old freelance-gigs page) has been retired in favor of
// /job-center (SkillVerify Pro — job alerts & skill verification). Keeping
// this route alive as a redirect means old links, bookmarks, and anything
// already indexed by search engines still land somewhere useful instead of
// 404ing. permanentRedirect sends a 308, telling crawlers the move is
// permanent so they update their index instead of re-checking /earn.
export default function EarnPage() {
    permanentRedirect("/job-center")
}
