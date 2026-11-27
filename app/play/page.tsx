import type { Metadata } from "next";
import Link from "next/link";
import {
  Youtube,
  Facebook,
  Gamepad2,
  Film,
  Server,
  Sparkles,
  Handshake,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  MessageCircle,
  Mail,
  Tv,
  Zap,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Celoris Play — Gaming Content, Clips & Brand Collabs",
  description:
    "Celoris Play is the official gaming media network of Celoris Designs LLP on YouTube (@celorisplay) and Facebook (celorisdesigns). Watch gaming highlights, explore our creator tools & FiveM servers, or partner with us for brand deals.",
  alternates: { canonical: "/play" },
  openGraph: {
    title: "Celoris Play — Official Gaming Hub | YouTube & Facebook",
    description:
      "Watch high-energy gaming clips, livestreams, and shorts on YouTube (@celorisplay) and Facebook (celorisdesigns) — powered by Celoris Video Studio.",
    url: "https://celorisdesigns.com/play",
  },
};

const CHANNELS = [
  {
    platform: "YouTube",
    handle: "@celorisplay",
    url: "https://www.youtube.com/@celorisplay",
    icon: Youtube,
    accent: "text-red-400",
    bgAccent: "bg-red-500/15 border-red-500/30",
    btnClass: "bg-red-600 hover:bg-red-500 text-white",
    cta: "Subscribe on YouTube",
    formats: ["Gaming Shorts & Highlights", "Gameplay Walkthroughs & Clips", "Edited with Celoris Video Studio"],
  },
  {
    platform: "Facebook Gaming & Reels",
    handle: "facebook.com/celorisdesigns",
    url: "https://www.facebook.com/celorisdesigns",
    icon: Facebook,
    accent: "text-sky-400",
    bgAccent: "bg-sky-500/15 border-sky-500/30",
    btnClass: "bg-sky-600 hover:bg-sky-500 text-white",
    cta: "Follow on Facebook",
    formats: ["Daily Viral Gaming Reels", "Meta Content Monetization Partner", "Community Clips & Challenges"],
  },
];

const CREATOR_TOOLS = [
  {
    icon: Film,
    tag: "Editing Suite",
    title: "Celoris Video Studio",
    desc: "Edit gaming montages, 9:16 Reels, and 4K YouTube highlights right in your browser or desktop—no watermarks.",
    href: "/video-studio",
    cta: "Open Video Studio",
  },
  {
    icon: Server,
    tag: "Gaming Infra",
    title: "FiveM Server Hosting",
    desc: "Low-latency Asia-South1 servers built for GTA V RP communities and Indian gaming creators.",
    href: "/fivem-servers",
    cta: "Explore FiveM Hosting",
  },
  {
    icon: Sparkles,
    tag: "AI & Prompts",
    title: "Prompt Box & Reels Masterclass",
    desc: "Copy tested AI video prompts or learn high-retention short-form gaming edits with 1-on-1 mentors.",
    href: "/prompt-box",
    cta: "Browse Prompt Box",
  },
];

export default function CelorisPlayPage() {
  const playSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": "https://celorisdesigns.com/play#webpage",
    url: "https://celorisdesigns.com/play",
    name: "Celoris Play — Official Gaming Hub on YouTube & Facebook",
    description:
      "Official gaming channel hub of Celoris Designs LLP featuring YouTube (@celorisplay), Facebook (celorisdesigns), gaming creator tools, and brand sponsorship partnerships.",
    datePublished: "2026-11-27",
    dateModified: "2026-11-27",
    inLanguage: "en-IN",
    about: {
      "@type": "Organization",
      "@id": "https://celorisdesigns.com/#organization",
      name: "Celoris Designs LLP",
      sameAs: [
        "https://www.youtube.com/@celorisplay",
        "https://www.facebook.com/celorisdesigns",
        "https://www.linkedin.com/company/celorisdesigns/",
      ],
    },
  };

  const sponsorWhatsapp =
    "https://wa.me/919084718101?text=" +
    encodeURIComponent(
      "Hi Celoris Play! We'd like to discuss a gaming brand deal / sponsorship collaboration on YouTube (@celorisplay) and Facebook."
    );

  return (
    <div className="min-h-screen bg-[#05070A] text-white py-12 px-4 sm:px-6 selection:bg-emerald-500/30">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(playSchema) }}
      />

      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero Section */}
        <header className="relative overflow-hidden rounded-3xl bg-zinc-900/70 border border-white/10 p-8 sm:p-12">
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-yellow-400/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <Gamepad2 className="w-3.5 h-3.5" />
              Celoris Play · Gaming Media Network · Updated Nov 27, 2026
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-[1.08]">
              Gaming Clips, Shorts &amp; Streams —{" "}
              <span className="text-emerald-400">Powered by Celoris</span>
            </h1>

            <p className="text-zinc-300 text-base sm:text-lg leading-relaxed">
              <strong className="text-white">Celoris Play</strong> is the official gaming content
              division of <strong className="text-white">Celoris Designs LLP (India)</strong>,
              publishing high-retention gaming Shorts, Reels, and gameplay highlights on{" "}
              <strong className="text-white">YouTube (@celorisplay)</strong> and{" "}
              <strong className="text-white">Facebook (celorisdesigns)</strong>. Free to watch,
              built with our own creative studio tools, and open for gaming brand partnerships.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="https://www.youtube.com/@celorisplay"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-sm inline-flex items-center gap-2 transition-colors shadow-lg shadow-red-600/20"
              >
                <Youtube className="w-4 h-4" />
                Watch on YouTube (@celorisplay)
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="https://www.facebook.com/celorisdesigns"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm inline-flex items-center gap-2 transition-colors shadow-lg shadow-sky-600/20"
              >
                <Facebook className="w-4 h-4" />
                Follow on Facebook
                <ArrowUpRight className="w-4 h-4" />
              </a>

              <a
                href="#brand-deals"
                className="px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-extrabold text-sm inline-flex items-center gap-2 transition-colors"
              >
                <Handshake className="w-4 h-4" />
                Brand Deals &amp; Collabs
              </a>
            </div>
          </div>
        </header>

        {/* Official Channels Grid */}
        <section className="space-y-5">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Official Celoris Play Channels
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Verified gaming channels operated directly by Celoris Designs LLP.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CHANNELS.map((ch) => (
              <div
                key={ch.platform}
                className="rounded-3xl bg-zinc-900/70 border border-white/10 p-7 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <div
                      className={`w-12 h-12 rounded-2xl border flex items-center justify-center ${ch.bgAccent} ${ch.accent}`}
                    >
                      <ch.icon className="w-6 h-6" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-3 py-1 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5" /> Official Channel
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">{ch.platform}</h3>
                    <p className="text-sm font-mono text-zinc-400 mt-0.5">{ch.handle}</p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-white/10">
                    {ch.formats.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-sm text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={ch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-full py-3 rounded-xl font-bold text-sm inline-flex items-center justify-center gap-2 transition-colors ${ch.btnClass}`}
                >
                  {ch.cta}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Built With Celoris Ecosystem (Gaming -> Tools Funnel) */}
        <section className="space-y-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-yellow-400 mb-1">
              <Zap className="w-3.5 h-3.5" /> Creator Stack
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              Tools We Use to Produce Celoris Play
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              Want to start your own gaming YouTube or Facebook Reels channel? Use the exact tools
              and training we use in-house.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {CREATOR_TOOLS.map((tool) => (
              <div
                key={tool.title}
                className="rounded-2xl bg-zinc-900/70 border border-white/10 p-6 flex flex-col justify-between gap-5"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <tool.icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                      {tool.tag}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{tool.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{tool.desc}</p>
                </div>

                <Link
                  href={tool.href}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  {tool.cta} <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* Brand Deals & Media Kit Section */}
        <section
          id="brand-deals"
          className="rounded-3xl bg-zinc-900/80 border border-white/10 p-7 sm:p-10 space-y-6"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1">
                <Tv className="w-3.5 h-3.5" /> Sponsorships &amp; Partnerships
              </div>
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Partner With Celoris Play (Brand Deals &amp; Integrations)
              </h2>
              <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
                We partner with gaming hardware brands, mobile/PC game publishers, creator apps,
                and tech accessories for short-form Reels, YouTube Shorts, and dedicated integrations.
              </p>
            </div>
          </div>

          {/* Semantic HTML Media Kit Table */}
          <div className="overflow-x-auto rounded-2xl bg-zinc-950/70 border border-white/10 p-4">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 text-zinc-400 uppercase text-[11px] tracking-wider">
                  <th className="py-2.5 pr-4">Partnership Format</th>
                  <th className="py-2.5 px-4">Platforms</th>
                  <th className="py-2.5 pl-4">Best For</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06] text-zinc-200">
                <tr>
                  <td className="py-3 pr-4 font-semibold text-white">Sponsored Short / Reel</td>
                  <td className="py-3 px-4">YouTube Shorts + Facebook Reels</td>
                  <td className="py-3 pl-4 text-zinc-300">Game launches, apps &amp; gaming gear</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-white">Affiliate &amp; Product Tagging</td>
                  <td className="py-3 px-4">Facebook Content Monetisation + YouTube</td>
                  <td className="py-3 pl-4 text-zinc-300">Peripherals, headphones, keyboards &amp; laptops</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-semibold text-white">Custom Gaming Server / Event</td>
                  <td className="py-3 px-4">Celoris FiveM + Cross-Platform Clips</td>
                  <td className="py-3 pl-4 text-zinc-300">Community tournaments &amp; creator campaigns</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={sponsorWhatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-zinc-950 font-extrabold text-sm inline-flex items-center gap-2 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp for Brand Deals
            </a>
            <a
              href="mailto:support@celorisdesigns.com?subject=Celoris%20Play%20Brand%20Deal%20Inquiry"
              className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-white font-bold text-sm inline-flex items-center gap-2 transition-colors"
            >
              <Mail className="w-4 h-4 text-emerald-400" />
              support@celorisdesigns.com
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
