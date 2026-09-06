import { permanentRedirect } from "next/navigation"

// Celo AI (the general-purpose AI chat) has been retired in favor of the
// Celoris Support widget (course discovery + lead capture, see
// components/SupportBotGate.tsx / SupportBotWidget.tsx). Keeping this route
// alive as a redirect means old links/bookmarks land somewhere real instead
// of 404ing. permanentRedirect sends a 308 so crawlers update their index.
export default function CeloAiPage() {
    permanentRedirect("/")
}
