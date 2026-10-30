import { NextRequest, NextResponse } from "next/server"

interface AdSimulationRequest {
  hook: string
  caption: string
  objective: "leads" | "traffic" | "brand"
  targetAudience: {
    cities: string[]
    ageRange: string
    niche: string
  }
  budget: number
}

// Fallback high-fidelity simulation engine calibrated to real Indian Meta ad benchmarks
function generateFallbackSimulation(req: AdSimulationRequest) {
  const hookWords = req.hook.trim().split(/\s+/).length
  const hasNumbers = /\d+/.test(req.hook)
  const isQuestionOrDirect = /you|your|why|stop|how|karo|kaise|\?|!/i.test(req.hook)
  
  // Calculate Hook Quality Score (0 - 100)
  let score = 65
  if (hookWords >= 4 && hookWords <= 12) score += 12
  if (hasNumbers) score += 10
  if (isQuestionOrDirect) score += 8
  score = Math.min(94, Math.max(48, score))

  const baseMultiplier = score / 100
  // Real Indian CPC benchmarks: ₹4 to ₹22
  const cpc = +(18 - baseMultiplier * 12 + (Math.random() * 2 - 1)).toFixed(2)
  const ctr = +(1.2 + baseMultiplier * 1.6 + (Math.random() * 0.4 - 0.2)).toFixed(2)
  
  const estimatedClicks = Math.floor(req.budget / Math.max(4, cpc))
  const estimatedImpressions = Math.floor((estimatedClicks / (ctr / 100)))
  const estimatedLeads = req.objective === "leads" ? Math.max(1, Math.floor(estimatedClicks * 0.12)) : 0

  const indianPersonas = [
    {
      persona_name: "Pooja Sharma (21, Jaipur)",
      avatar_initial: "P",
      action: score > 75 ? "Saved" : "Commented",
      comment_text: score > 75 
        ? "Is this suitable for beginners with zero video editing experience? Do we get live feedback?" 
        : "Sounds interesting, but CapCut to banned hai na India me? How do you guys use it?",
      sentiment: "neutral",
    },
    {
      persona_name: "The Skeptic (Aman, 26, Delhi)",
      avatar_initial: "A",
      action: score > 85 ? "Liked" : "Commented",
      comment_text: score > 85
        ? "Actually a solid point. Agencies charge ₹20k for basic templates."
        : "Bro stop scrolling bolke sab wahi course bechte hain. What is different in your batch?",
      sentiment: score > 85 ? "positive" : "skeptical",
    },
    {
      persona_name: "The Algorithm Bot",
      avatar_initial: "🤖",
      action: score > 70 ? "Shared" : "Scrolled Past",
      comment_text: score > 70
        ? `High completion velocity detected (${ctr}% CTR). Meta Reels auction favors this hook angle.`
        : "Drop-off spike detected between 0.8s and 2.1s. Hook needs visual proof or numbers.",
      sentiment: score > 70 ? "positive" : "negative",
    },
  ]

  const fixes = []
  if (!hasNumbers) {
    fixes.push("Add concrete numbers to your first line (e.g. '₹15,000/month', '3-step setup', or '48 hours').")
  }
  if (!isQuestionOrDirect) {
    fixes.push("Call out the viewer directly in the first 2 seconds (e.g. 'Stop wasting...' or 'If you are struggling with...').")
  }
  fixes.push("Give a specific lead magnet keyword in your CTA (e.g. 'Comment ROADMAP to get our portfolio checklist').")

  return {
    overall_score: score,
    hook_rating: score >= 88 ? "God Tier" : score >= 75 ? "Punchy" : score >= 60 ? "Average" : "Weak",
    estimated_impressions: estimatedImpressions,
    estimated_clicks: estimatedClicks,
    estimated_cpc: `₹${cpc.toFixed(2)}`,
    estimated_ctr: `${ctr.toFixed(2)}%`,
    estimated_leads: estimatedLeads,
    simulated_audience_feed: indianPersonas,
    actionable_fixes: fixes,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as AdSimulationRequest

    if (!body.hook || !body.budget) {
      return NextResponse.json({ error: "Hook and budget are required" }, { status: 400 })
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GOOGLE_AI_API_KEY

    if (apiKey) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai")
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({
          model: "gemini-1.5-flash",
          generationConfig: {
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        })

        const prompt = `You are the Celoris Social Ad Simulation Engine. Analyze this student ad targeting Indian audiences:
Hook: "${body.hook}"
Caption: "${body.caption || "None"}"
Objective: "${body.objective}"
Budget: ₹${body.budget}
Targeting: ${JSON.stringify(body.targetAudience)}

Output strictly valid JSON with this exact structure:
{
  "overall_score": <number 50-95>,
  "hook_rating": "<Weak | Average | Punchy | God Tier>",
  "estimated_impressions": <calculated integer based on budget>,
  "estimated_clicks": <calculated integer>,
  "estimated_cpc": "₹<cpc like 6.50>",
  "estimated_ctr": "<ctr like 2.40>%",
  "estimated_leads": <calculated integer if leads objective, else 0>,
  "simulated_audience_feed": [
    {
      "persona_name": "<Indian persona like 'Pooja (21, Jaipur)'>",
      "avatar_initial": "<Initial>",
      "action": "<Commented | Liked | Saved | Scrolled Past>",
      "comment_text": "<Authentic Hinglish comment with real reaction>",
      "sentiment": "<positive | neutral | skeptical | negative>"
    }
  ],
  "actionable_fixes": [
    "<High-impact fix 1>",
    "<High-impact fix 2>"
  ]
}`

        const result = await model.generateContent(prompt)
        const text = result.response.text()
        const parsed = JSON.parse(text)
        return NextResponse.json({ success: true, data: parsed, engine: "gemini" })
      } catch (geminiErr) {
        console.warn("[simulate-ad] Gemini call failed, using heuristic engine:", geminiErr)
      }
    }

    // Heuristic simulation engine fallback (fast, zero external dependency)
    const fallbackData = generateFallbackSimulation(body)
    return NextResponse.json({ success: true, data: fallbackData, engine: "heuristic" })
  } catch (err: any) {
    console.error("[simulate-ad] API error:", err)
    return NextResponse.json({ error: err.message || "Failed to simulate ad" }, { status: 500 })
  }
}
