import Link from 'next/link';
import { Calendar, User, Clock, Tag, TrendingUp, ArrowLeft, Eye } from 'lucide-react';
import ShareButtons from '@/components/ShareButtons';
import { createServerClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Metadata } from 'next';
import { marked } from 'marked';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  // Hardcoded metadata for the new blog post
  if (slug === 'fish-audio-s2-1-pro-voice-ai') {
    return {
      title: "Fish Audio S2.1 Pro: The Free TTS Model That's Changing the Voice AI Game | Celoris Blog",
      description: "Fish Audio's new S2.1 Pro voice model delivers ~70ms latency, 83-language support, and zero-shot voice cloning — free on Celo AI until September 18th.",
    };
  }

  if (slug === 'excel-copilot-modes-2026') {
    return {
      title: "From Chaos to Control: How Microsoft Excel's New Copilot Modes Are Redefining Spreadsheet Productivity | Celoris Blog",
      description: "Chat, Edit, Plan and now Agent Mode — here's how Copilot in Excel actually works in 2026, the research behind why planning beats acting, and how to master it.",
    };
  }

  if (slug === 'deepseek-harness-ai-trend-2026') {
    return {
      title: 'DeepSeek Harness Kya Hai? | Celoris Blog',
      description: 'DeepSeek Harness ne AI coding agents ki duniya badal di hai. Janiye kya hai Agent = Model + Harness.',
    };
  }

  const supabase = (await createServerClient()) as any;
  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();

  if (!post) return { title: 'Post Not Found - Celoris' };

  return {
    title: `${post.title} | Celoris Blog`,
    description: post.meta_description || post.excerpt,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  // Hardcoded data for the new blog post to bypass database requirements
  if (slug === 'excel-copilot-modes-2026') {
    const post = {
      id: '6',
      title: "From Chaos to Control: How Microsoft Excel's New Copilot Modes Are Redefining Spreadsheet Productivity",
      slug: 'excel-copilot-modes-2026',
      excerpt: "Microsoft has rebuilt Copilot in Excel into three modes — Chat, Edit, and Plan — plus a fully autonomous Agent Mode. Here's what changed, the research behind why planning beats acting, and how to master it with the Celoris course.",
      featured_image_url: "/Master Copilot in Microsoft Excel.png",
      author_name: 'Celoris Team',
      category: 'AI & Excel Tools',
      reading_time: 8,
      published_at: '2026-09-05T10:00:00Z',
      views_count: 0,
      content: `
The way we work with spreadsheets is undergoing a quiet but massive revolution. For decades, Microsoft Excel has been the ultimate playground for data modeling, budgeting, and business intelligence—but its full power was often reserved for formula wizards and VBA experts. Today, AI-driven assistants are democratizing these capabilities.

With the latest updates, Microsoft has evolved Copilot from a basic sidebar chatbot into an autonomous editor and collaborative partner. If you are looking to save hours of manual data wrangling and formula debugging, understanding how to steer these new capabilities is the key.

To help you stay ahead, we've broken down the major changes, the underlying science of how we collaborate with AI, and the best way to master these features through the [Celoris Master Copilot in Excel Course](https://celorisdesigns.com/learn/course/master-copilot-excel).

---

## 1. The Three-Mode Framework: Chat, Edit, and Plan

Copilot in Excel now operates under a unified three-mode framework designed to balance safe exploration, direct execution, and strategic planning:

*   **Chat Mode**: Safe and risk-free. In this mode, Copilot analyzes your workbook data and provides insights, explanations, and answers without making any direct changes to your file. It is perfect for asking, *"Which product line had the highest growth last quarter?"* or having Copilot explain a complex, nested formula in plain English.
*   **Edit Mode (Default)**: Direct and active. Here, Copilot edits your workbook directly based on your instructions. It writes working formulas, applies conditional formatting to highlight critical numbers, sorts and filters data, and builds PivotTables and charts right inside the grid.
*   **Plan Mode**: The strategic buffer. Designed for more complex, multi-step operations, Plan Mode acts as a "think-before-you-act" checkpoint. Instead of executing actions immediately, Copilot outlines a step-by-step plan first. You can review what Copilot intends to do, modify individual steps, and approve the workflow before a single cell is edited.

---

## 2. The Science of "Plan Mode": Why Upfront Planning Works

Does stopping to plan with an AI actually make you more productive, or does it just add unnecessary overhead?

A July 2026 academic paper titled *"Plans Work in Mysterious Ways: Evaluating a Plan Mode for Spreadsheet Agents"* published on arXiv evaluated this exact question. Researchers conducted a controlled user study (N=24) comparing a plan-based approach with direct immediate editing (Act Mode).

The findings were striking:
1.  **Massive Reduction in Refinement Loops**: When using Plan Mode, users spent significantly fewer turns refining spreadsheets post-hoc (averaging 1.4 refinement turns compared to 2.2 turns in direct Act Mode). Because potential errors and structural misunderstandings were caught in the planning phase, the final output was correct much faster.
2.  **More Efficient AI Reasoning**: Upfront planning significantly lowered the computational cost. The average number of LLM tokens used during reasoning, messaging, and editing was reduced from 17.0k tokens in Act Mode to just 11.0k in Plan Mode.
3.  **Surfacing Requirements Early**: Under direct editing, 35% of a user's requirements only emerged after seeing an incorrect spreadsheet edit. In Plan Mode, 37% of requirements were successfully surfaced before execution by responding to clarifying questions asked by the AI.
4.  **Enhanced Creativity and Agency**: Users overwhelmingly preferred Plan Mode across dimensions of creativity support and human-machine collaboration. It gave spreadsheet authors a feeling of true partnership, keeping their attention focused on the task rather than fighting the AI's direct actions.

---

## 3. Going Fully Autonomous: Agent Mode

When tasks grow from single actions (like creating a formula) into complex, multi-step workflows (like building an entire interactive dashboard), **Agent Mode** takes over.

Generally available across Excel for Web, Windows, and Mac as of early 2026, Agent Mode is integrated directly into the "Editing with Copilot" sidebar. It transforms Copilot into an active collaborator that takes your high-level goal, autonomously drafts a plan, executes actions step-by-step, validates its own outputs, and corrects errors along the way.

### Key Features of Agent Mode:
*   **Model Switching**: Excel now features an integrated model switcher, giving users visibility and choice. While the system defaults to selecting the best model automatically, users can explicitly choose between OpenAI's **GPT 5.2** (built for rapid, structured problem-solving) and Anthropic's **Claude Opus 4.5** (ideal for tasks requiring open-ended reasoning and detailed explanations).
*   **Web-Grounded Search**: Agent Mode features integrated web search with source citations. This means you can prompt the agent to "Pull in the latest exchange rates for our vendor currencies" or "Add a column showing the average monthly temperature for these vacation spots," and Copilot will fetch and cite real-world data directly.
*   **UI-Based Control**: The interface includes a dedicated Plan pane that displays a persistent, visible plan. Users have the unique capability to partially execute the plan (e.g., executing up to Step 3 to review progress) or edit the steps directly in the UI before execution begins.

---

## 4. Advanced Analytics: The Evolving Role of Python in Excel

Advanced data analysts should note that Microsoft has restructured its Python features in Excel. The older "App Skills" feature, which ran text and Python analyses inside the Copilot grid, was retired in early 2026 to make way for a more specialized, dual-path architecture:

1.  **The \`PY()\` Function**: This native Excel formula allows you to write and execute Python code directly inside an Excel cell. The code executes securely in Microsoft's cloud sandbox—meaning no local installation is needed—though it typically requires a separate Python in Excel license.
2.  **The Analyst Agent**: For deeper, exploratory work across multiple files, commercial users can utilize this dedicated agent. You can attach messy datasets, ask complex analytical questions, and receive a beautifully written report with charts—all without modifying your original, underlying Excel file.

---

## 5. Licensing and Setup: How to Access Copilot in 2026

If you are confused about how to get access to these features, you aren't alone. Microsoft completed a major licensing overhaul in 2026:

*   **The Retirement of Copilot Pro**: The standalone $20/month Copilot Pro subscription was officially phased out, with support ending on August 1, 2026.
*   **Current Subscription Paths**:
    *   **Individual Users**: Access advanced editing capabilities via a **Microsoft 365 Personal or Family** subscription (utilizing a monthly AI credits plan) or a **Microsoft 365 Premium** subscription ($19.99/month) which bundles AI features across Excel, Word, PowerPoint, Outlook, and OneNote.
    *   **Business Users**: Require a commercial **Microsoft 365 Copilot** license or a Copilot Chat-eligible enterprise subscription.
*   **Technical Requirements**: To ensure Copilot functions correctly, your files must be stored in **OneDrive** or **SharePoint** with **AutoSave** enabled.

*(Note: Agent Mode in Excel is currently rolling out globally but is not yet available to customers in the EU or UK).*

---

## 6. How to Master Excel Copilot Today

Having access to these powerful AI tools is only half the battle. To truly unlock their productivity-boosting benefits, you must learn the "language of AI"—how to write precise prompts, establish guardrails, and critically verify outputs.

If you want to transition from a beginner to an advanced AI power user, the [Celoris Master Copilot in Microsoft Excel Course](https://celorisdesigns.com/learn/course/master-copilot-excel) is the ultimate step-by-step guide.

### Course At a Glance:
*   **Format**: 6-week, self-paced online course (totaling 12–15 hours).
*   **Pricing**: Currently on a limited-time 50% discount at just **₹1,200** (reduced from ₹2,400).
*   **Key Learnings**:
    *   **Module 1 & 2**: Preparing data ranges into proper Excel Tables with clean headers so Copilot performs reliably.
    *   **Module 3**: Translating natural-language prompts into working formulas (like XLOOKUP and SUMIF) and debugging broken syntax.
    *   **Module 4**: Generating smart data visualizations, PivotTables, and summary reports.
    *   **Module 5 & 6**: Mastering the difference between **Plan Mode** and **Agent Mode**, including designing prompts and setting checkpoints for autonomous workflows.
    *   **Module 7 & 8**: Prompt-writing anatomy, governance, and a comprehensive **Capstone Project** using messy, real-world data.
*   **Certificate**: A verified Celoris Certificate of Completion is provided.

Whether you are a marketing manager reviewing product reviews, a finance professional managing budgets, or an Excel user tired of googling syntax, learning to steer Copilot will easily cut your weekly reporting prep time in half.

Don't let the future of work pass you by. Invest in your skills and register before the upcoming batch on October 1st closes on September 22nd!

👉 **[Enroll in the Master Copilot in Excel Course Today!](https://celorisdesigns.com/learn/course/master-copilot-excel)**
      `,
    };

    const contentHtml = await marked.parse(post.content || '');
    return renderPost(post, contentHtml as string);
  }

  // Hardcoded data for the new blog post to bypass database requirements
  if (slug === 'fish-audio-s2-1-pro-voice-ai') {
    const post = {
      id: '5',
      title: "Fish Audio S2.1 Pro: The Free TTS Model That's Changing the Voice AI Game",
      slug: 'fish-audio-s2-1-pro-voice-ai',
      excerpt: "Fish Audio's new S2.1 Pro voice model delivers ~70ms latency, 83-language support, and zero-shot voice cloning — and it's free on Celo AI until September 18th.",
      featured_image_url: "/Fish Audio S2.1 Pro The Free TTS Model That's Changing the Voice AI Game.png",
      author_name: 'Celoris Team',
      category: 'AI & Voice Tech',
      reading_time: 5,
      published_at: '2026-09-02T10:00:00Z',
      views_count: 0,
      content: `
# Fish Audio S2.1 Pro: The Free TTS Model That's Changing the Voice AI Game

If you've been building voice agents, audiobooks, dubbing tools, or any kind of AI voiceover product, you've probably run into the same wall everyone does: the *good* text-to-speech models cost money, and the free tiers are basically trial versions that run out in minutes. ElevenLabs gives you a few thousand credits and then the paywall hits. OpenAI's TTS has no free tier at all. Google's Gemini TTS charges from the very first token.

Fish Audio just flipped that script with **S2.1 Pro** — and the best part, right now you can use it completely free inside **Celo AI, no charges till September 18th**.

## What Exactly Is S2.1 Pro?

S2.1 Pro is Fish Audio's current flagship voice model — a neural speech synthesis system built for production-grade AI voice generation. It's the upgraded version of their earlier S2 Pro model, and it's tuned specifically for three things: low-latency streaming, multilingual coverage, and voice cloning.

In plain Hinglish terms — yeh ek aisa TTS model hai jo bilkul insaan jaisi awaaz generate karta hai, real-time mein, aur wo bhi 83 languages mein.

## The Numbers That Matter

Fish Audio didn't just tweak the old model — they rebuilt the inference stack from scratch. Here's what changed:

- **~70ms Time-to-First-Audio (TTFA)** on a single request — down from ~100ms in the previous generation. That's fast enough for natural back-and-forth conversation, not just narration.
- **61% win rate** against the older S2 Pro in blind listening evaluations.
- **2x+ throughput improvement** under high-concurrency load, which matters a lot if you're building something that needs to serve multiple users at once.
- **83 languages supported**, including English, Hindi, Japanese, Chinese, Korean, Spanish, Arabic, French, German, Portuguese, Russian, and dozens more — with automatic language detection, so you don't even need to specify what language the text is in.

## What Makes It Stand Out From the Crowd

**1. Natural language emotion control.** Instead of being locked into a fixed set of emotion tags, S2.1 Pro uses bracket-based cues like \`[whispers sweetly]\` or \`[laughing nervously]\` directly inside your text. You're not choosing from a dropdown — you're describing the performance you want, and the model delivers it.

**2. Zero-shot voice cloning.** Give it a short reference clip, and it can replicate that voice across all 83 supported languages, keeping the same voice identity consistent no matter what language the text is in.

**3. Multi-speaker synthesis in one call.** You can generate dialogue between multiple voices in a single API call — genuinely useful if you're producing podcasts, audiobooks with multiple characters, or dubbed content.

**4. Built for real conversation, not just narration.** Most TTS models were designed for scripted, one-directional narration. S2.1 Pro is architected around real-time, turn-taking conversation — which is exactly what you need for voice agents and support bots.

## Where This Actually Helps You

- **Voice agents and chatbots** — low latency means the conversation doesn't feel laggy or robotic.
- **Audiobook and podcast production** — multi-speaker support and emotional range cut down on manual editing.
- **Localization and dubbing** — 83-language coverage with consistent voice identity means one voice can carry your content across markets.
- **Prototyping voice products** — because it's free with no hard usage cap, you can actually stress-test an idea before committing budget to it.
- **Content creators** — Hinglish, regional Indian languages, and international content, sab kuch ek hi model se ban sakta hai.

## Free on Celo AI Till September 18th

Yahan pe sabse badi baat: **Celo AI par S2.1 Pro abhi free mein available hai, September 18th tak.** Agar aap voice content, dubbing, ya AI-powered voiceovers try karna chahte ho bina kisi paid subscription ke, toh yeh window use karne ka best time hai.

Whether you're testing it for a client project, building a prototype, or just experimenting with AI voiceovers for your content — get in before the free window closes on September 18th.

## Bottom Line

S2.1 Pro isn't a stripped-down "free tier" version of a paid product — it's the same state-of-the-art model running on both the free and paid API. That's rare in this space, and it's exactly why it's worth trying now while it's accessible on Celo AI at zero cost.

If you're serious about voice AI — narration, agents, dubbing, or cloning — this is a model worth putting through its paces before the free access window ends.
      `,
    };

    const contentHtml = await marked.parse(post.content || '');
    return renderPost(post, contentHtml as string);
  }

  // Hardcoded data for the new blog post to bypass database requirements
  if (slug === 'deepseek-harness-ai-trend-2026') {
    const post = {
      id: '4',
      title: 'DeepSeek Harness Kya Hai? Wo AI Trend Jo Har Coder Ko Pata Hona Chahiye (2026)',
      slug: 'deepseek-harness-ai-trend-2026',
      excerpt: 'DeepSeek Harness ne AI coding agents ki duniya badal di hai. Janiye kya hai Agent = Model + Harness aur kyun ye MIT-licensed framework developers ke liye game-changer hai.',
      featured_image_url: '/DeepSeek Harness Kya Hai Wo AI Trend Jo Har Coder Ko Pata Hona Chahiye (2026).png',
      author_name: 'Celoris Team',
      category: 'AI & Agents',
      reading_time: 6,
      published_at: '2026-09-01T10:00:00Z',
      views_count: 121,
      content: `
# DeepSeek Harness Kya Hai? Wo AI Trend Jo Har Coder Ko Pata Hona Chahiye (2026)

Agar aap tech ya AI space thoda bhi follow karte ho, toh pichle kuch weeks se "DeepSeek Harness" naam bohot suna hoga — Twitter/X pe, Hacker News pe, LinkedIn pe. Chaliye simple bhasha mein samajhte hain ki ye hai kya, aur ek student ya beginner ke liye iska matlab kya hai.

## Sabse Pehle — "Harness" Hota Kya Hai?

AI industry ne ek clean mental model settle kiya hai:

- **Model** = brain. Ye tokens predict karta hai (jaise DeepSeek-V4, Claude, GPT).
- **Harness** = baaki sab kuch. Tool definitions, filesystem/shell access, memory management, sub-agent orchestration, loop control, aur sabse important — kab rukna hai.

Simple words mein: model plan banata hai, lekin **harness decide karta hai ki kaam kab complete hua aur agent ko kaunse tools use karne hain**. Isi wajah se DeepSeek ka formula viral hua: **Agent = Model + Harness**.

## DeepSeek Harness Ne Kya Launch Kiya

13 August 2026 ko DeepSeek ne apna official open-source agent harness launch kiya — \`dsh\` naam se, GitHub repo \`deepseek-ai/deepseek-harness\` par. Ye **MIT license** ke under hai, matlab koi bhi ise inspect, modify, aur self-host kar sakta hai, bilkul free mein.

Key highlights:

- **Cordis meta-framework** par powered hai — core idea hai "Everything is a plugin." Models, tools, skills, sessions, sandboxes, filesystem, loops, orchestration — sab kuch plug-in ki tarah kaam karta hai.
- Ye **DeepSeek-V4-Flash** (ek ultra-cheap model) ke saath pair hokar aata hai, jisse agentic AI ki cost bohot kam ho jaati hai — ye DeepSeek ka bada strategic move hai.
- V4-Flash ke agent benchmarks mein bada jump aaya hai — jaise Terminal-Bench score 61.8 se 82.7 tak, sirf post-training se, architecture change kiye bina.
- Native **1M context window**, speculative decoding, teen reasoning levels (low/high/max), aur OpenAI ke Responses API ke saath compatibility bhi hai.
- Currently **Developer Preview** stage mein hai — usable hai, lekin DeepSeek khud warn karta hai ki API aur plugin contracts stable release se pehle change ho sakte hain.

Ek zaroori clarification: GitHub par ek separate community project bhi hai jo similar naam se hai (kisi third-party developer ka banaya hua adapter). Wo **official DeepSeek Harness nahi hai** — asli waala \`deepseek-ai/deepseek-harness\` hi hai.

## Ye Trend Kyun Ban Raha Hai

Pichle ek saal mein Claude Code, Cursor, aur OpenAI Codex ne "AI coding agents" ki category define ki thi. DeepSeek ne is baar sirf ek naya model release nahi kiya — unhone seedha us layer par kaam kiya jo model ko ek reliable, autonomous coding agent banata hai. Ye signal hai ki DeepSeek ab sirf "model company" nahi, balki ek **full agentic product company** banne ki taraf badh raha hai — jaise unke khud ke job postings mein bhi "Harness Product Manager" jaisi roles maangi gayi thi.

Result: cheap, open-source, aur MIT-licensed agent framework — jo startups aur individual developers dono ke liye agentic AI ko affordable bana raha hai.

## Students Ke Liye Iska Matlab Kya Hai?

Agar aap Python ya Agentic AI seekh rahe ho, toh ye samajhna zaroori hai ki sirf ek model use karna kaafi nahi hota — asli power tab aati hai jab aap jaante ho ki **tools, memory, aur execution loops** ko ek proper harness ke through kaise orchestrate karte hain. Yehi wo skill hai jo aane waale saal mein sabse zyada demand mein rahegi — chahe aap DeepSeek Harness use karo, Claude Code, ya koi aur agent framework.

---

*Ye trend fast-moving hai — DeepSeek Harness abhi Developer Preview stage mein hai, toh koi bhi tool decision lene se pehle official docs zaroor check kar lein.*
      `,
    };

    const contentHtml = await marked.parse(post.content || '');
    return renderPost(post, contentHtml as string);
  }

  const supabase = (await createServerClient()) as any;
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .eq('status', 'published')
    .maybeSingle();

  if (error || !post) {
    notFound();
  }

  const contentHtml = await marked.parse(post.content || '');
  return renderPost(post, contentHtml as string);
}

function renderPost(post: any, contentHtml: string) {
  const formatDate = (dateString: string) => {
    if (!dateString) return 'Recently';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      });
    } catch (error) {
      return 'Recently';
    }
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.excerpt,
    "image": post.featured_image_url,
    "author": {
      "@type": "Organization",
      "name": "Celoris Designs",
      "url": "https://www.celorisdesigns.com"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Celoris",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.celorisdesigns.com/favicon.svg"
      }
    },
    "datePublished": post.published_at,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://www.celorisdesigns.com/blog/${post.slug}`
    }
  };

  return (
    <div className="min-h-screen bg-[#050810] text-slate-300">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="relative h-[600px] w-full overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 hover:scale-105"
          style={{
            backgroundImage: `url("${post.featured_image_url || '/images/homepage/hero.png'}")`
          }}
          role="img"
          aria-label={post.title}
        />
        <div className="absolute inset-0 bg-black/60 bg-gradient-to-t from-[#050810] via-[#050810]/40 to-transparent" />

        <div className="container relative h-full flex flex-col justify-end pb-12 text-white px-4 mx-auto">
          <Button variant="ghost" className="text-white w-fit mb-8 hover:bg-white/10 group bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-6" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>
          </Button>

          <div className="max-w-4xl">
            <div className="flex items-center gap-3 mb-6 animate-fade-in">
              <span className="bg-emerald-500/20 text-emerald-400 px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase border border-emerald-500/30 backdrop-blur-md">
                {post.category || 'Insights'}
              </span>
              <span className="text-slate-400 text-xs font-bold flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-full border border-white/5 backdrop-blur-sm">
                <Clock className="h-3.5 w-3.5 text-emerald-500" /> {post.reading_time || 5} MIN READ
              </span>
            </div>
            <h1 className="text-4xl md:text-7xl font-black mb-8 leading-[1.05] tracking-tight text-white drop-shadow-2xl animate-slide-up">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-8 text-slate-400">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-600 flex items-center justify-center text-white font-black text-xl border-2 border-white/10 shadow-2xl overflow-hidden">
                  {post.author_name ? post.author_name.charAt(0) : 'C'}
                </div>
                <div>
                  <p className="font-black text-white tracking-tight text-lg">{post.author_name || 'Celoris Team'}</p>
                  <p className="text-[10px] uppercase font-black tracking-[0.2em] text-emerald-500">Official Creator</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2 font-bold">
                  <Calendar className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm uppercase tracking-widest">{formatDate(post.published_at)}</span>
                </div>
                <div className="flex items-center gap-2 font-bold">
                  <Eye className="h-4 w-4 text-emerald-500" />
                  <span className="text-sm uppercase tracking-widest">{post.views_count || 0} VIEWS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-20 px-4 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#0a0f1d] rounded-[2.5rem] p-8 md:p-16 shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] -mr-64 -mt-64 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[120px] -ml-64 -mb-64 pointer-events-none" />

            <div className="relative z-10">
              {post.excerpt && (
                <div className="mb-16">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-8 md:p-10 rounded-3xl relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-1.5 h-full bg-emerald-500" />
                    <p className="text-xl md:text-2xl text-slate-100 leading-relaxed font-bold italic">
                      "{post.excerpt}"
                    </p>
                  </div>
                </div>
              )}

              <article
                className="prose prose-invert prose-emerald prose-lg max-w-none 
                  prose-headings:text-white prose-headings:font-black prose-headings:tracking-tight
                  prose-h2:text-3xl md:prose-h2:text-4xl prose-h2:mt-16 prose-h2:mb-8
                  prose-h3:text-2xl prose-h3:mt-12 prose-h3:mb-6
                  prose-p:text-slate-300 prose-p:leading-relaxed prose-p:text-lg prose-p:mb-8
                  prose-li:text-slate-300 prose-li:text-lg
                  prose-strong:text-emerald-400 prose-strong:font-bold
                  prose-a:text-emerald-400 prose-a:no-underline hover:prose-a:underline
                  prose-blockquote:border-emerald-500 prose-blockquote:bg-emerald-500/5 prose-blockquote:py-2 prose-blockquote:px-6 prose-blockquote:rounded-r-2xl
                  prose-img:rounded-[2rem] prose-img:border prose-img:border-white/10 prose-img:shadow-2xl
                  blog-content"
                dangerouslySetInnerHTML={{ __html: contentHtml }}
              />

              <div className="mt-20 pt-12 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="flex flex-wrap items-center gap-3">
                  <Tag className="h-4 w-4 text-emerald-500" />
                  {post.tags && post.tags.map((tag: string) => (
                    <span key={tag} className="bg-white/5 text-slate-400 px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase hover:bg-emerald-500/20 hover:text-emerald-400 transition-all cursor-default border border-white/5 hover:border-emerald-500/30">
                      {tag}
                    </span>
                  ))}
                </div>
                <ShareButtons title={post.title} slug={post.slug} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container pb-32 px-4 mx-auto">
        <div className="max-w-4xl mx-auto rounded-[3rem] bg-gradient-to-br from-emerald-500 to-cyan-600 p-1 md:p-1.5 shadow-[0_20px_60px_rgba(16,185,129,0.3)]">
          <div className="bg-[#050810] rounded-[2.8rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
              style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)', backgroundSize: '24px 24px' }} />

            <h2 className="text-3xl md:text-5xl font-black mb-8 text-white tracking-tight leading-tight"> Ready to level up your professional skills?</h2>
            <p className="text-slate-400 text-lg mb-12 max-w-2xl mx-auto">Join thousands of creators, students and professionals building their future with Celoris. Free tools, real trainers, and genuine opportunities.</p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <Button size="lg" className="bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase tracking-[0.2em] rounded-full px-12 py-8 text-lg shadow-[0_10px_30px_rgba(16,185,129,0.3)] hover:scale-105 transition-all w-full sm:w-auto" asChild>
                <Link href="/blog">Browse All Articles</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white font-black uppercase tracking-[0.2em] rounded-full px-12 py-8 text-lg w-full sm:w-auto" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <footer className="container py-12 px-4 mx-auto border-t border-white/5 text-center">
        <p className="text-xs font-bold tracking-[0.3em] text-slate-600 uppercase">
          © {new Date().getFullYear()} Celoris Designs LLP • India's Free Creative Studio
        </p>
      </footer>
    </div>
  );
}
