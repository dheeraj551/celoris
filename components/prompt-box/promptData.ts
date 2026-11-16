export type PromptCategory =
  | 'All'
  | 'Video & Reels'
  | 'Commercials & Ads'
  | '3D & Animation';

export interface PromptItem {
  id: string;
  title: string;
  category: Exclude<PromptCategory, 'All'>;
  modelTag: string;
  aspectRatio?: string;
  previewImage: string;
  videoUrl: string;
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
    title: 'Seoul Tower Sci-Fi Rocket Launch (5-Scene Short)',
    category: 'Video & Reels',
    modelTag: 'Tested on Seedance',
    aspectRatio: '9:16 Vertical',
    previewImage: '/videoediting.png',
    videoUrl: '/api/social/media/promptbox_clip01.mp4',
    shortSummary:
      'Hyper-realistic 19s sci-fi short: a woman beneath N Seoul Tower activates a massive rocket launch tracked from street level to an airplane window.',
    featured: true,
    proTip:
      'Tested on Seedance. Add a 2-second hook text at 00:00 ("1 Prompt. Wait for it...") and +10% contrast for mobile Reels.',
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
    id: 'kitkat-luxury-storyboard',
    title: 'KitKat "The Art of the Snap" 10-Frame Commercial Board',
    category: 'Commercials & Ads',
    modelTag: 'Tested on Seedance',
    aspectRatio: '15s Commercial',
    previewImage: '/content-creation-cover.png',
    videoUrl: '/api/social/media/promptbox_clip02.mp4',
    shortSummary:
      'Agency-grade 2×5 luxury chocolate commercial storyboard across 10 macro scenes—from cocoa dust reveal to molten chocolate silk pour.',
    proTip:
      'Tested on Seedance. Specifying lens glass (ARRI Alexa 35 + Cooke Anamorphic 50mm) locks in luxury commercial lighting.',
    relatedLinkLabel: 'Explore Video Courses',
    relatedLinkHref: '/learn',
    promptText: `Create one professional commercial storyboard presentation showing 10 cinematic frames arranged in a clean 2×5 grid on a white presentation board. Thin black borders separate each frame. Each panel contains a bold scene number (01–10), timestamp, and a short production caption underneath. The storyboard should look like a real advertising agency pre-production board for a luxury chocolate commercial.

TITLE: KITKAT "The Art of the Snap" Luxury Commercial Storyboard • 15 Seconds
STYLE: Inspired by the cinematic luxury aesthetic of premium chocolate commercials. Rich dark background, dramatic lighting, elegant slow motion, sensual textures, premium food photography, macro cinematography, high-end advertising, ultra photorealistic.

SCENE 01 (0.0–1.5s): Complete darkness. A single KitKat bar slowly emerges from shadow onto a polished dark stone pedestal. Tiny cocoa dust floats through warm golden light. Caption: The Reveal
SCENE 02 (1.5–3.0s): Extreme macro. Camera glides across the embossed KitKat logo. Chocolate surface reflects soft warm highlights. Every texture is perfectly visible. Caption: Luxury Detail
SCENE 03 (3.0–4.5s): Roasted cocoa beans. Madagascar vanilla pods. Fresh milk splash. Wafer layers. Chocolate curls. Everything slowly floats around the chocolate bar. Caption: Ingredients Rise
SCENE 04 (4.5–6.0s): The KitKat bar snaps perfectly in half. Time almost freezes. Chocolate shards, wafer crumbs, cocoa powder, and chocolate flakes explode outward in beautiful slow motion. Caption: The Perfect Snap
SCENE 05 (6.0–7.5s): Camera performs a slow cinematic orbit around the broken KitKat pieces. The creamy wafer layers are exposed. Chocolate dust dances through the light. Caption: Floating Luxury
SCENE 06 (7.5–9.0s): Extreme macro. Molten chocolate slowly pours over the broken wafer. The chocolate moves like silk. Tiny reflections shimmer. Caption: Chocolate Flow
SCENE 07 (9.0–10.5s): A cascade of liquid chocolate envelops the KitKat. Chocolate ribbons twist elegantly. Cocoa particles sparkle. Caption: Pure Indulgence
SCENE 08 (10.5–12.0s): Everything freezes. Chocolate droplets, wafer crumbs, chocolate curls, and cocoa powder all suspended perfectly around the product. Caption: Frozen Perfection
SCENE 09 (12.0–13.5s): Ultimate hero shot. Complete KitKat package standing beside the broken chocolate bar. Warm cinematic spotlight. Premium luxury composition. Caption: Hero Product
SCENE 10 (13.5–15.0s): Minimal luxury background. The KitKat logo appears. Elegant typography fades in. Tagline: "Have a Break. Enjoy Every Snap." Caption: Brand Signature

Presentation style: Professional Hollywood commercial storyboard, advertising agency pitch board, 10 cinematic storyboard frames, white presentation sheet, thin black borders, scene numbers, timestamps, production captions, ARRI Alexa 35, Cooke Anamorphic 50mm, HDR, soft volumetric lighting, ultra photorealistic, 8K.`,
  },
  {
    id: 'pixar-kitchen-flour-comedy',
    title: 'Pixar-Style 3D Kitchen Flour Comedy Short',
    category: '3D & Animation',
    modelTag: 'Tested on Seedance',
    aspectRatio: '9:16 · 15s',
    previewImage: '/blender-course-cover.png',
    videoUrl: '/api/social/media/promptbox_clip03.mp4',
    shortSummary:
      'Heartwarming 15-second 3D animated comedy in a sunlit kitchen where a mischievous toddler spills an entire bag of flour.',
    proTip:
      'Tested on Seedance. Including particle physics keywords ("realistic flour particles") dramatically improves 3D animation realism.',
    relatedLinkLabel: 'Explore Celoris 3D & Animation',
    relatedLinkHref: '/learn',
    promptText: `Create a 15-second vertical 3D animated cinematic comedy video. A young mother is baking in a beautiful, sunlit kitchen when her adorable, mischievous toddler secretly grabs a large paper flour bag. The baby struggles to carry it across the wooden floor, accidentally tearing the bag and spilling white flour everywhere. The mother turns around in surprise, while the baby ends up sitting in a fluffy pile of flour, looking innocent before breaking into a cute smile. Warm golden sunlight, realistic flour particles, expressive cartoon faces, detailed kitchen environment, smooth camera movements, Pixar-style 3D animation, soft cinematic lighting, realistic textures, adorable storytelling, humorous ending, 9:16 aspect ratio, high-quality rendering.`,
  },
  {
    id: 'mediterranean-luxury-fragrance',
    title: 'Mediterranean Cliff Luxury Fragrance Commercial',
    category: 'Commercials & Ads',
    modelTag: 'Tested on Seedance',
    aspectRatio: '35mm Anamorphic',
    previewImage: '/photolite-studio-preview.png',
    videoUrl: '/api/social/media/promptbox_clip04.mp4',
    shortSummary:
      'Ray-traced glass macro perfume commercial set on a sun-drenched Mediterranean coastal cliff with slow-motion mist & olive groves.',
    proTip:
      'Tested on Seedance. Describing ray-traced glass refraction and cap-pop physics creates authentic luxury ad motion.',
    relatedLinkLabel: 'Apply: Luxury Product Creator',
    relatedLinkHref: '/job-center',
    promptText: `A cinematic 3D product commercial for a luxury fragrance set against a sun-drenched Mediterranean coastal cliff overlooking vibrant turquoise water, hyper-realistic, 8k resolution, photorealistic lighting, ray-traced glass reflections, shot on 35mm anamorphic lens, 60fps smooth action: Extreme macro shot starting on the thick clear glass base of a square fragrance bottle with light refracting across stone, smooth tilt-up to reveal the pale green liquid inside, the silver metallic Medusa seal centered on the front, and the silver engraved cap. Small white jasmine blossoms and olive leaves frame the bottle on a rugged stone ledge. Dynamic cut to a close-up of green olives hanging from lush branches with glowing sunbeams piercing through against a deep blue sky. Rapid transition showing the silver bottle cap smoothly popping off into the sky, revealing the nozzle, followed by an ultra-macro shot of the nozzle spraying a fine mist of fragrance in slow motion as sunlight catches the microscopic droplets. Fast forward-zooming whip shot moving through a breezy Mediterranean olive grove, emerging out onto a high cliff ledge where the perfume sits above a shimmering ocean cove. A crystal-clear glass sphere expands and engulfs the scene with glowing green olive leaves swirling through the air around it. Final centered hero shot of the fragrance bottle sitting proudly on the sunlit stone ledge, subtle water reflections beneath it, olive branches framing the top, bright lens flare streaming from above, hyper-detailed commercial aesthetic.`,
  },
  {
    id: 'london-day-to-night-drone',
    title: 'London Thames Day-to-Night Aerial Travel Film',
    category: 'Video & Reels',
    modelTag: 'Tested on Seedance',
    aspectRatio: '9:16 · 30s',
    previewImage: '/blog-video-editor-india-2026.png',
    videoUrl: '/api/social/media/promptbox_clip05.mp4',
    shortSummary:
      '30-second ultra-photorealistic drone journey along the River Thames transitioning from bright daylight through golden hour to night.',
    proTip:
      'Tested on Seedance. Adding an explicit NEGATIVE PROMPT section prevents warped landmarks on Tower Bridge and Big Ben.',
    relatedLinkLabel: 'Read 2026 Video Economy Report',
    relatedLinkHref: '/blog/digital-media-video-production-trends-2026',
    promptText: `Create a 30-second ultra-photorealistic cinematic vertical travel film of LONDON, UNITED KINGDOM, designed in the exact visual style of a premium aerial city-reveal video.

FORMAT:
Vertical 9:16. Ultra-realistic live-action. Premium cinematic travel commercial. Continuous smooth aerial/drone-style camera movement with elegant transitions between landmarks.

0–4 SECONDS — THAMES OPENING:
Begin above the River Thames in bright daylight. A large sightseeing boat moves through the foreground while the camera smoothly glides forward over the water, revealing Tower Bridge in the distance. Introduce minimal centered title text: "LONDON / UNITED KINGDOM · EUROPE" with a small UK flag underneath.

4–7 SECONDS — TOWER BRIDGE:
Approach Tower Bridge at a slight diagonal angle showing stone towers, suspension cables, and boats below.

7–10 SECONDS — BRIDGE PASS:
Pass close beneath/alongside Tower Bridge to reveal the London skyline beyond.

10–14 SECONDS — WESTMINSTER:
Wide aerial view of the Houses of Parliament and Big Ben glowing in warm golden-hour sunlight.

11–16 SECONDS — LONDON SKYLINE:
Reveal The Shard prominently in the distance as lighting shifts from golden hour toward blue hour.

16–20 SECONDS — BLUE HOUR:
Camera rises higher as London lights up with illuminated bridges and boats leaving subtle light trails.

20–25 SECONDS — NIGHT CITY:
Spectacular nighttime aerial shot of Big Ben, Westminster, The Shard, and illuminated Thames reflections.

25–30 SECONDS — GRAND AERIAL REVEAL:
High-altitude pull-back revealing central London at night—River Thames, Tower Bridge, Big Ben, The Shard, and London Eye filling the frame.

AUDIO: Natural London river and city ambience. No narration, no dialogue.
NEGATIVE PROMPT: NO fantasy city, NO distorted landmarks, NO warped Tower Bridge or Big Ben, NO cartoon, NO CGI look, NO watermark.`,
  },
  {
    id: 'victorian-gothic-halloween-loop',
    title: 'Victorian Gothic Paper Collage Seamless Loop',
    category: '3D & Animation',
    modelTag: 'Tested on Seedance',
    aspectRatio: '9:16 · 30s Loop',
    previewImage: '/photolite-studio-preview.png',
    videoUrl: '/api/social/media/promptbox_clip06.mp4',
    shortSummary:
      'Surreal 30s Victorian Gothic digital collage with continuous physical paper-tear, moth swarm, and balloon-pop transitions.',
    proTip:
      'Tested on Seedance. Matching the final 28–30s tear composition back to 00:00 creates an invisible infinite Reels loop.',
    relatedLinkLabel: 'Explore Creative Studios',
    relatedLinkHref: '/video-studio',
    promptText: `Create a visually breathtaking 30-second, 9:16 surreal Halloween film.
STYLE: Vintage Gothic Halloween × Victorian Fashion × Digital Collage Surrealism. Photorealistic antique illustrations, torn paper, velvet, lace, skulls, candles and aged textures. Dusty pink, dark teal, pumpkin orange, black and antique gold.

00:00–00:03: Ornate skull chandelier with black candles hanging against dusty-pink sky. Camera pushes forward as paper tears open, revealing a Victorian pumpkin-headed woman.
00:03–00:06: Woman in black velvet surrounded by ravens and roses. Her pumpkin head splits into paper fragments, revealing a white skull.
00:06–00:09: Skull on a silver pedestal; white moths emerge and swirl upward, filling the lens.
00:09–00:13: Pumpkin bride wearing black lace veil and pearls beneath a golden moon; pumpkin face cracks away to reveal a Victorian woman.
00:13–00:17: Enormous headpiece grows from pumpkins, keys, candles and ravens as black balloons rise behind her.
00:17–00:19: Glossy black balloons cover the lens before drifting apart.
00:19–00:21: Pale Pierrot woman with cream ruffled collar holds a black balloon that bursts into black paper fragments.
00:21–00:24: Fragments assemble into a skeleton ballerina transforming into a human ballerina via collage replacement.
00:24–00:28: Antique portrait reveals a witch with floating eyes, ravens and candles; portrait tears vertically exposing pink paper.
00:28–00:30: Camera passes through the tear, returning seamlessly to the original skull chandelier for an invisible loop.

TRANSITIONS: Smooth paper peeling, silhouette matching, moth swarms, foreground wipes. No hard cuts or CGI glitches.
AUDIO: Eerie vintage Halloween waltz with synchronized dry Foley (paper rips, wing flaps, ONE sharp balloon pop). No dialogue.`,
  },
  {
    id: 'lego-agents-garage-action',
    title: 'LEGO Agents vs. Aliens Underground Action Short',
    category: '3D & Animation',
    modelTag: 'Tested on Seedance',
    aspectRatio: '15s Action',
    previewImage: '/web-dev-bootcamp-feature.png',
    videoUrl: '/api/social/media/promptbox_clip07.mp4',
    shortSummary:
      'High-energy 15s LEGO minifigure sci-fi shootout in a dark brick parking garage synced frame-for-frame to a hip-hop beat.',
    proTip:
      'Tested on Seedance. Defining distinct character rules (Agent J reactive vs. Agent K calm) keeps multi-character AI shots coherent.',
    relatedLinkLabel: 'Explore 3D Classrooms',
    relatedLinkHref: '/classrooms',
    promptText: `Cinematic LEGO short film clip, 15 seconds. Dark underground LEGO parking garage, chunky concrete LEGO pillars, blocky LEGO parked cars, dim flickering lights. Everything built from LEGO bricks.

AGENT J: Standard LEGO minifigure, dark brown cylindrical head, printed black wayfarer sunglasses, black suit, silver LEGO pistol. Energetic and reactive — rolls, ducks, dives, shoots on the move.
AGENT K: Standard LEGO minifigure, light skin tone head, black wraparound sunglasses, serious expression, black suit, oversized transparent blue alien blaster. Calm and precise.
ALIENS: Colorful LEGO alien creatures (green, purple, orange) with tentacles and extra eyes built from bricks.
AUDIO: High energy hip hop beat loud from frame one, every shot synced to the beat, loose LEGO bricks scattering with every explosion.

0:00–0:01 — Already mid-fight in the garage.
0:01–0:03 — Green LEGO alien bursts at J; J dives sideways and blasts it into loose green bricks.
0:03–0:05 — Two purple aliens charge K; K sidesteps one brick step and blasts both into purple bricks.
0:05–0:07 — Orange alien throws J onto a LEGO car hood; J fires from his back, exploding it into orange bricks.
0:07–0:09 — Both take cover behind a LEGO car, pop up together firing.
0:09–0:11 — Massive alien crashes through parked cars; K hands J the biggest blaster for an enormous brick explosion.
0:11–0:13 — Tiny alien scurries out; J stamps on it, popping into three pieces.
0:13–0:15 — Garage clear. Both raise claw hands and straighten printed sunglasses simultaneously. Hero moment.

STYLE: Stud details visible on all surfaces, plastic sheen, hard edge shadows, Unreal Engine quality, rapid action camera switching.`,
  },
  {
    id: 'wok-stir-fry-culinary-reel',
    title: 'Wok-Seared Chinese Greens Culinary Commercial',
    category: 'Commercials & Ads',
    modelTag: 'Tested on Seedance',
    aspectRatio: '9:16 · 17s',
    previewImage: '/videoediting.png',
    videoUrl: '/api/social/media/promptbox_clip08.mp4',
    shortSummary:
      'Ultra-realistic 17-second food commercial: washing greens, precision knife chopping, blue-flame wok searing, and plated macro finish.',
    proTip:
      'Tested on Seedance. Negative constraints ("no plastic CGI appearance, no distorted hands") keep culinary textures authentic.',
    relatedLinkLabel: 'Apply: Short-Form Video Producer',
    relatedLinkHref: '/job-center',
    promptText: `Create a cinematic, ultra-realistic 17-second live-action food sequence showing the complete preparation of glossy stir-fried Chinese greens in a warm, rustic home kitchen. Begin with an overhead close-up of fresh leafy greens being washed thoroughly in a large ceramic bowl filled with water. Capture realistic water movement, droplets, crisp green leaves, and natural hand movements.

Transition smoothly to a wooden cutting board as the greens are arranged and chopped into neat bite-sized pieces with a sharp kitchen knife. Cut to a black wok heating over a strong blue gas flame. Add sliced garlic and the chopped greens into the hot wok. Capture the sizzling oil, rising steam, subtle smoke, and realistic heat reactions as the vegetables soften while maintaining vibrant green color.

Use dynamic close-ups as the greens are tossed and stirred repeatedly with a metal spatula. Show glossy oil coating the stems and leaves, and include a wider shot of the cook in the warm kitchen. End with a macro close-up of the finished dish plated on white ceramic, topped with golden garlic slices as steam rises gently.

STYLE: Ultra-photorealistic live-action food commercial, authentic Asian home cooking, physically accurate cooking physics, warm rustic kitchen lighting, shallow depth of field, subtle film grain, 17 seconds, vertical 9:16, no text, no logos, no watermark, no plastic CGI appearance, no distorted hands.`,
  },
  {
    id: 'cairo-one-take-noir-zoom',
    title: 'Downtown Cairo One-Take Noir Crash Zoom',
    category: 'Video & Reels',
    modelTag: 'Tested on Seedance',
    aspectRatio: 'One-Take Shot',
    previewImage: '/agentic-ai-systems-cover.png',
    videoUrl: '/api/social/media/promptbox_clip09.mp4',
    shortSummary:
      'Continuous single-take crane pan over downtown Cairo minarets at dawn dropping into a high-speed Noir street crash zoom.',
    proTip:
      'Tested on Seedance. Short, punchy camera-first prompts (Crane Pan + Crash Zoom + One Take) deliver dramatic single-shot kinetic energy.',
    relatedLinkLabel: 'Explore Video Studio',
    relatedLinkHref: '/video-studio',
    promptText: `Crane camera starts from the roof of a tall building in downtown Cairo, a quick panoramic movement (Pan) from right to left, we see the minarets appearing with the first light, then the camera quickly descends (Crash Zoom) to the busy street, a quick tracking shot of a transport vehicle running between an old tram and donkeys loaded with vegetables, all this in one long take (One Take) at a pace that rivals Noir films.`,
  },
];
