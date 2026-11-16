export type PromptCategory =
  | 'All'
  | 'Video & Reels'
  | '3D & WebGL'
  | 'UI/UX & Design'
  | 'AI Automation';

export interface PromptItem {
  id: string;
  title: string;
  category: Exclude<PromptCategory, 'All'>;
  modelTag: string;
  aspectRatio?: string;
  previewImage: string;
  videoUrl?: string;
  shortSummary: string;
  promptText: string;
  proTip: string;
  relatedLinkLabel?: string;
  relatedLinkHref?: string;
  featured?: boolean;
}

export const PROMPT_ITEMS: PromptItem[] = [
  {
    id: 'seoul-tower-sci-fi-launch',
    title: 'Seoul Tower Sci-Fi Rocket Launch (5-Scene Master Prompt)',
    category: 'Video & Reels',
    modelTag: 'Veo 3.1 / Kling 3.0',
    aspectRatio: '9:16 Vertical',
    previewImage: '/videoediting.png',
    shortSummary:
      'Hyper-realistic 19s cinematic sci-fi short: mysterious woman beneath N Seoul Tower triggers a massive rocket launch tracked from street level to an airplane window.',
    featured: true,
    proTip:
      'Add a 2-second hook text at 00:00 ("1 Prompt. Wait for it...") and boost contrast +10% in post for mobile feeds.',
    relatedLinkLabel: 'Apply: Social Media Video Editor',
    relatedLinkHref: '/job-center',
    promptText: `Create a hyper-realistic cinematic sci-fi short video featuring a beautiful young East Asian woman with shoulder-length black hair, wearing a white oversized shirt over a black outfit and elegant black trousers.

SCENE 1 (0–4 SEC): THE MYSTERIOUS WOMAN
Close-up of the woman sitting outdoors in a modern Korean city park. She looks directly into the camera with a calm, confident expression. Cut to a wide shot revealing her standing beneath a tall Seoul communication tower, surrounded by leafless trees and a clear blue sky.

SCENE 2 (4–8 SEC): THE ROCKET IGNITION
The woman slowly raises one hand toward the sky as if activating something with a magical gesture. Suddenly, a massive rocket positioned behind the communication tower ignites. Powerful orange flames burst from its engines, followed by thick white smoke. The rocket begins ascending rapidly into the sky.

SCENE 3 (8–12 SEC): CITYWIDE LAUNCH
Cut to a wide street-level view of a busy Korean residential neighborhood. The massive rocket rises into the sky behind buildings and electric power lines. Bright engine flames illuminate the surroundings while enormous clouds of smoke expand below. Cinematic camera movement captures the incredible scale of the launch.

SCENE 4 (12–19 SEC): THE JOURNEY THROUGH THE SKY
Transition inside a commercial airplane cabin. A passenger looks through the airplane window. Outside, the enormous rocket flies upward through the atmosphere, passing beautiful blue skies and distant mountain landscapes. The rocket's fiery exhaust creates a spectacular cinematic contrast against the peaceful sky.

SCENE 5 (19 SEC – END): EPIC ROCKET CLOSE-UP
The camera slowly tracks the rocket as it continues climbing higher into the atmosphere. Bright orange flames, realistic smoke trails, atmospheric haze, and breathtaking aerial views create an epic sci-fi ending.

VISUAL STYLE:
Ultra-photorealistic live-action cinematography, 4K resolution, vertical 9:16, realistic rocket propulsion, physically accurate smoke and fire simulations, natural daylight, detailed Korean urban architecture, cinematic camera transitions, realistic airplane window reflections, dramatic scale, professional Hollywood sci-fi visual effects.

CAMERA:
Handheld close-ups, wide establishing shots, low-angle rocket shots, dynamic tracking shots, and cinematic airplane POV footage.

AUDIO:
Natural outdoor ambience, subtle suspenseful cinematic music, deep rocket ignition rumble, powerful engine roar, rushing wind, and atmospheric sound effects.

CONSISTENCY RULES:
Maintain the same woman's facial features, hairstyle, and clothing. Keep the rocket design consistent across every scene. Ensure realistic rocket movement, continuous smoke trails, believable lighting, and seamless transitions. No cartoon effects, no distorted buildings, no extra limbs, no unwanted text, no logos, and no watermarks.`,
  },
  {
    id: 'luxury-jewellery-macro-reel',
    title: 'Luxury Jewellery Macro Specular Fire Reel',
    category: 'Video & Reels',
    modelTag: 'Veo 3.1 / Runway Gen-4',
    aspectRatio: '9:16 Vertical',
    previewImage: '/content-creation-cover.png',
    shortSummary:
      'Studio-lit 18K yellow gold & emerald macro showcase with controlled specular diamond sparkle and velvet texture.',
    proTip:
      'Pair with subtle ASMR clasp/velvet sound effects and a minimalist serif end-lockup.',
    relatedLinkLabel: 'Apply: Luxury Jewellery Creator',
    relatedLinkHref: '/job-center',
    promptText: `Ultra-photorealistic 100mm macro commercial video of an 18K yellow gold halo necklace set with an untreated deep green Colombian emerald and pavé diamonds resting on matte black velvet.

SCENE 1 (0–4s): Slow motorized slider push-in as a soft diffused studio light sweeps across the emerald facets, triggering crisp diamond scintillation without blowing out metallic gold highlights.
SCENE 2 (4–10s): Graceful female collarbone close-up in warm natural window light, subtle slow-motion movement at 60fps showing how the pendant drapes naturally.

STYLE: High-end editorial luxury fashion cinematography, shallow depth of field (f/8 macro sharpness on stones), true-to-life 18K gold color accuracy, zero text, zero watermarks.`,
  },
  {
    id: 'isometric-3d-web-world',
    title: 'Interactive 3D Isometric Web Classroom / Micro-World',
    category: '3D & WebGL',
    modelTag: 'Gemini 4 Carbon / Three.js',
    aspectRatio: 'Interactive Web',
    previewImage: '/blender-course-cover.png',
    shortSummary:
      'Single-file procedural Three.js / WebGL2 isometric studio scene with orbit controls, dynamic lighting, and interactive hover hotspots.',
    proTip:
      'Run in Google AI Studio or bundle inside Next.js with dynamic ssr:false for instant 60fps performance.',
    relatedLinkLabel: 'Explore Celoris 3D Classrooms',
    relatedLinkHref: '/classrooms',
    promptText: `Build a single-file interactive 3D WebGL scene using Three.js with OrbitControls and smooth damping.

SCENE ARCHITECTURE:
- Isometric modern creative studio & learning loft with warm oak floors, glass skylight, minimalist floating staircase, and glowing emerald LED accents (#10B981).
- Procedural furniture: dual-monitor creator desk, velvet lounge sofa, potted monstera plants, and an interactive presentation screen displaying animated waveform bars.
- Lighting: soft global hemisphere light + warm directional sunlight casting crisp PCFSoftShadowMap shadows.
- Interactivity: Clicking any desk or screen smoothly tweens the camera focus and opens a clean HUD tooltip. Maintain 60fps on mobile and desktop.`,
  },
  {
    id: 'conversion-saas-hero-ui',
    title: 'Conversion-First Dark-Mode SaaS Hero & Bento UI',
    category: 'UI/UX & Design',
    modelTag: 'Claude / Figma AI',
    aspectRatio: '16:9 & Mobile',
    previewImage: '/web-dev-bootcamp-feature.png',
    shortSummary:
      'High-contrast above-the-fold SaaS hero layout engineered for maximum CTR, 44px mobile touch targets, and clean Auto Layout tokens.',
    proTip:
      'Keep only ONE primary high-contrast CTA above the fold to minimize decision fatigue.',
    relatedLinkLabel: 'Apply: UI/UX & Web/App Designer',
    relatedLinkHref: '/job-center',
    promptText: `Design a conversion-focused dark-mode SaaS landing page hero + 3-card bento feature grid using Tailwind CSS and clean semantic tokens.

CONSTRAINTS:
- Background: Deep obsidian (#090A0D) with subtle emerald radial glow (#10B981 at 12% opacity) — strictly avoid purple/violet gradients.
- Above-the-Fold Hierarchy: 1 punchy benefit headline (max 8 words), 1 concise 2-line subheadline, 1 primary emerald CTA button (min 44px height for mobile touch safety), and 1 secondary ghost button.
- Right Column: Crisp glassmorphic product preview card with real-time metric badges.
- Responsive: Fluid stack on 375px mobile with zero horizontal overflow.`,
  },
  {
    id: 'brand-identity-mini-style-guide',
    title: 'Minimalist Brand Identity & Logo Sheet Generator',
    category: 'UI/UX & Design',
    modelTag: 'Illustrator / Midjourney + Vector',
    aspectRatio: '1:1 Square',
    previewImage: '/photolite-studio-preview.png',
    shortSummary:
      'Clean vector-ready brand mark concept sheet including monochrome favicon lockup, HEX/CMYK palette, and clear-space rules.',
    proTip:
      'Always test your generated icon silhouette at 16x16px before vectorizing in Illustrator.',
    relatedLinkLabel: 'Apply: Logo & Brand Identity Designer',
    relatedLinkHref: '/job-center',
    promptText: `Create a clean, flat vector brand identity presentation sheet on a crisp off-white grid background (#F8FAFC).

DELIVERABLES ON SHEET:
1. Primary minimalist geometric icon + modern sans-serif wordmark.
2. Pure 1-color black & white monochrome lockup for stamps and favicons.
3. Compact 4-swatch brand color palette displaying exact HEX and CMYK codes.
4. Clear-space grid diagram showing minimum padding around the icon mark.

STYLE: Swiss modernist graphic design, flat 2D vector geometry, sharp edges, zero 3D bevels, zero photorealistic mockups, no extra filler text.`,
  },
  {
    id: 'aws-ai-email-support-agent',
    title: 'Enterprise AI Email Support Agent (Sub-20s + Guardrails)',
    category: 'AI Automation',
    modelTag: 'Claude / OpenAI + AWS',
    aspectRatio: 'Backend System',
    previewImage: '/agentic-ai-systems-cover.png',
    shortSummary:
      'Production system prompt + JSON schema guardrail template for reading customer order/return emails and drafting verified replies under 20s.',
    proTip:
      'Always inject live order DB records via RAG and enforce a 0.7 contextual grounding check before showing drafts to agents.',
    relatedLinkLabel: 'Apply: AI & NLP Engineer',
    relatedLinkHref: '/job-center',
    promptText: `You are an Enterprise Customer Support Drafting Assistant. Read the incoming customer email and retrieved order JSON, then return ONLY a valid JSON object matching this schema:
{
  "intent": "order_status | return_request | account_issue | escalation",
  "order_id": "string | null",
  "confidence": 0.0-1.0,
  "draft_reply": "string"
}

STRICT GUARDRAILS:
1. Ground every date, tracking number, and refund eligibility strictly in the provided <verified_order_context>. Never invent policies or delivery dates.
2. If order_id is missing or policy data is absent, set confidence < 0.7 and draft a polite verification question instead of guessing.
3. Maintain a warm, concise brand voice (120–180 words max) ready for 1-click human approval.`,
  },
  {
    id: 'viral-ad-hook-editor-sop',
    title: 'Scroll-Stopping 9:16 D2C Promo Ad Edit Blueprint',
    category: 'Video & Reels',
    modelTag: 'Premiere Pro / After Effects',
    aspectRatio: '9:16 Vertical',
    previewImage: '/blog-video-editor-india-2026.png',
    shortSummary:
      'Exact 30-second vertical ad pacing prompt & timeline structure for Meta/Instagram promos with kinetic typography and -14 LUFS audio.',
    proTip:
      'Duck background music to -20 dB under dialogue and keep all kinetic text inside Instagram Reels safe zones.',
    relatedLinkLabel: 'Read 2026 Video Economy Report',
    relatedLinkHref: '/blog/digital-media-video-production-trends-2026',
    promptText: `Act as a Senior Performance Video Editor. Turn my raw 12 product b-roll clips and 2 customer testimonials into a high-converting 30-second 9:16 Instagram/Facebook video ad script & edit sheet:

- 0–3s HOOK: Immediate visual pattern interrupt + bold 5-word kinetic headline inside safe margins.
- 4–18s VALUE & DEMO: Fast 1.2s–1.8s on-beat cuts paired with tactile whoosh SFX and 1-line benefit callouts.
- 19–25s SOCIAL PROOF: Cut to customer testimonial with animated quote badge and high-contrast captions.
- 26–30s CTA LOCKUP: Clean logo sting + direct offer call-to-action. Output as a timestamped table with SFX and text overlay cues.`,
  },
];
