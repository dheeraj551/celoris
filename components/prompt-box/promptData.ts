export type PromptCategory =
  | 'All'
  | 'Video & Reels'
  | 'Long-Form Video'
  | 'Image Prompts'
  | 'Commercials & Ads'
  | '3D & Animation';

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
    id: 'gothic-coquette-studio-flash-editorial',
    title: 'Gothic Coquette Studio Flash Beauty Editorial',
    category: 'Video & Reels',
    modelTag: 'Tested on Seedance',
    aspectRatio: '35mm · 9:16',
    previewImage: '/api/social/media/promptbox_img01.jpg',
    videoUrl: '/api/social/media/promptbox_clip10.mp4',
    shortSummary:
      'Dreamy 35mm fashion editorial portrait with neon blue/lavender lighting, subtle pearl choker gesture, and a sharp studio flash freeze.',
    proTip:
      'Tested on Seedance. Adding explicit camera physics ("static 35mm lens, shallow depth of field, harsh white flash overexposing highlights") creates authentic editorial fashion motion.',
    relatedLinkLabel: 'Open PhotoLite AI Studio',
    relatedLinkHref: '/photolite',
    promptText: `A young East Asian woman in an elegant black gothic coquette dress with layered black tulle skirt and sheer polka-dot opera gloves stands against a blue and lavender gradient studio background, soft neon blue and purple light washing over her porcelain skin. She shifts her weight subtly, tilts her chin down slightly, raises one gloved hand to gently touch her pearl choker, then lifts her gaze directly into the camera with a calm melancholic expression — lips softly closed, lashes still — holding the perfect pose as the studio flash fires with a harsh white burst of light that briefly overexposes her highlights, freezing her in a dreamy cinematic beauty editorial moment. Camera is static, 35mm lens, shallow depth of field, soft focus edges.`,
  },
  {
    id: 'ya-hala-coffee-slow-motion-freeze-ad',
    title: 'Ya Hala Coffee Mid-Air Slow-Motion Freeze Commercial',
    category: 'Commercials & Ads',
    modelTag: 'Tested on Seedance',
    aspectRatio: '9:16 Commercial',
    previewImage: '/api/social/media/promptbox_img04.jpg',
    videoUrl: '/api/social/media/promptbox_clip11.mp4',
    shortSummary:
      'High-octane golden-hour NYC sidewalk commercial: iced coffee, flyer, and phone freeze mid-air in slow-motion liquid splashes.',
    proTip:
      'Tested on Seedance. Swap "YA HALA COFFEE - FALL MENU" and the caller ID ("BOSS") for any café, beverage, or D2C product brand.',
    relatedLinkLabel: 'Apply: Creative Video Editor',
    relatedLinkHref: '/job-center',
    promptText: `A stylish young woman walking confidently down a busy New York city sidewalk during golden hour, wearing a dark fitted t-shirt, relaxed dark jeans, and sneakers, talking on her smartphone and holding an iced coffee and a cafe menu, with a golden retriever dog walking on a leash beside her; suddenly, she trips and drops her phone, iced coffee cup, and a "YA HALA COFFEE - FALL MENU" flyer mid-stride, causing the items to suspend mid-air in slow motion with magical liquid splashes and floating autumn leaves, transitioning to a macro close-up of the branded coffee cup and a smartphone displaying an incoming call from "BOSS" before everything drops back to the pavement in a dynamic, high-octane commercial cinematic style.`,
  },
  {
    id: 'wall-street-bullet-time-frozen-slip',
    title: 'Wall Street 360° Bullet-Time Frozen Coffee Splash',
    category: 'Video & Reels',
    modelTag: 'Tested on Seedance',
    aspectRatio: '360° Bullet-Time',
    previewImage: '/videoediting.png',
    videoUrl: '/api/social/media/promptbox_clip12.mp4',
    shortSummary:
      'Matrix-style 360° low-angle bullet-time orbit around a Wall Street businessman slipping on ice with coffee & droplets completely frozen mid-air.',
    proTip:
      'Tested on Seedance. Stating "only the camera moves while everything else remains perfectly still" locks in crisp bullet-time suspension.',
    relatedLinkLabel: 'Explore Video Studio',
    relatedLinkHref: '/video-studio',
    promptText: `Bullet time effect. A businessman in white shirt and black tie slipping and falling backwards on an icy wet street in Wall Street, New York. Coffee cup standing on ground, liquid exploding outward frozen in mid-air. Ice chunks, water droplets, and coffee splash all completely suspended time is frozen. Tall buildings on both sides creating a canyon effect. The camera smoothly orbits 360 degrees around the falling man at low ground level angle, only the camera moves while everything else remains perfectly still. Cinematic, overcast dramatic lighting, wide angle lens distortion.`,
  },
  {
    id: 'downtown-dusk-flying-whale-one-take',
    title: 'Downtown Dusk Giant Humpback Whale Overhead (30s One-Take)',
    category: 'Video & Reels',
    modelTag: 'Tested on Seedance',
    aspectRatio: '9:16 · 30s POV',
    previewImage: '/videoediting.png',
    videoUrl: '/api/social/media/promptbox_clip13.mp4',
    shortSummary:
      'Handheld shot-on-iPhone 30s one-take: wet neon downtown street at dusk as a massive photoreal humpback whale glides silently between skyscrapers.',
    proTip:
      'Tested on Seedance. Specifying natural phone-camera imperfections ("slight delay tilting up, mild auto-exposure shifts, puddle ripples") sells the viral found-footage realism.',
    relatedLinkLabel: 'Explore Video Studio',
    relatedLinkHref: '/video-studio',
    promptText: `A single continuous 30-second one-take filmed on a smartphone, vertical 9:16, handheld with slight natural shake. A busy downtown street at dusk after light rain, wet asphalt reflecting neon signs and car headlights. The camera operator is a pedestrian standing on the sidewalk, filming casually.

0-6s: The camera pans across the street. People walk past, a delivery rider waits at a red light. Ambient city sound, distant sirens. Then a few people stop and look up. The camera tilts up with a slight delay, as a real person's would.

6-14s: A huge humpback whale glides slowly out from behind the glass towers, floating about 40 meters above the street. Photoreal skin texture, barnacles, water droplets falling off its fins and onto the road. Its shadow passes over cars and crowds. People gasp, raise phones, and one person grabs a friend's arm.

14-24s: The whale drifts overhead and lets out a deep, low call that vibrates through the street. Windows reflect its body, puddles ripple from the sound, and a flag and trees sway in the air it pushes. The camera shakes slightly and refocuses.

24-30s: It continues down the avenue, tail sweeping gently, and fades into low clouds between the buildings. The shot ends with the crowd still looking up and the camera lowering.

Realism: natural phone-camera behavior, mild auto-exposure shifts, slight lens flare from the neon, real-world scale and weight, no cartoon glow, no text or logos on screen. Ordinary, unposed pedestrians with natural reactions.
Audio: @Audio1 or synchronized ambient city sound, crowd murmurs, wind, and a deep whale call. No music, no narration.
Style: photorealistic, shot-on-iPhone look, natural color, light grain, realistic motion blur, sharp 4K.`,
  },
  {
    id: 'door-portal-fantasy-world-transition',
    title: 'Door Portal Into a Fantasy World (Video + Image Reference)',
    category: 'Video & Reels',
    modelTag: 'Tested on Seedance',
    aspectRatio: '9:16 · VFX Portal',
    previewImage: '/videoediting.png',
    videoUrl: '/api/social/media/promptbox_clip14.mp4',
    shortSummary:
      'Seamless reality-to-fantasy door portal transition preserving real room geometry, sharp door-frame occlusion, natural breeze, and directional sunlight spill.',
    proTip:
      'Tested on Seedance. Upload your real door-opening clip + any fantasy landscape image—this prompt enforces strict door-frame occlusion so the world never bleeds onto your walls.',
    relatedLinkLabel: 'Explore Video Studio',
    relatedLinkHref: '/video-studio',
    promptText: `Use the uploaded video of a door opening as the primary reference for the action and the character, and use the uploaded image of a fantasy world as the reference for the environment on the other side of the door.

Retain everything from the original video that occurs before the door opens—including the character’s identity, facial features, hairstyle, clothing, and body proportions; the structure of the room, the door frame, and the walls; as well as the camera position, composition, lighting, and the specific motion of opening the door. Do not alter, replace, or redesign the character or the real-world environment as they appear in the original footage.

When the door is closed, the scene must be identical to the original video. The character should move naturally toward the door and open it, following the actions shown in the original footage. The fantasy world should only begin to emerge from behind the door once a gap actually appears. Do not reveal the fantasy environment prematurely, and ensure the real-world room does not undergo any sudden, overall transformation.

Once the door is open, replace the space behind it with the fantasy world from the reference image. Preserve the key landscape features, architecture, vegetation, sky, color palette, lighting, and spatial depth from the reference image, ensuring it appears as a tangible environment existing on the other side of the door, rather than a flat image pasted onto it.

The door frame, the door itself, and the real-world room must remain stable. The fantasy world should appear only within the confines of the door frame and must not spill over onto the walls, the character, or the rest of the real-world space. The edges of the door frame must remain sharp, with accurate occlusion and perspective that align with the camera angle of the original video.

As the door opens fully, a gentle breeze should blow from the fantasy world into the room, causing the character’s hair and clothing to sway slightly and naturally. Soft sunlight should stream in from beyond the door, casting light, shadows, and warm-toned reflections onto the character, the door frame, and the floor—all consistent with the direction of the light source. These lighting changes must be gradual and natural, avoiding any sudden flickering or excessive, unnatural glow.

As the character passes through the doorway, they must retain their original appearance, clothing, and body proportions—no distortion, duplication, or change in identity is permitted. The character’s footsteps, center of gravity, and speed of movement must adhere to the laws of physical reality. Ensure that the occlusion between the character and the door frame is handled accurately, making it appear as though the character is truly stepping from the real-world room into the fantasy world. After passing through the doorway, the character continues moving forward, naturally running through or exploring the fantasy environment. The camera must maintain the same motion style as the original video; abrupt perspective shifts, orbiting the character, or transitioning to a drone-style shot are not permitted. The spatial transition between the real world and the fantasy world must be seamless, stable, and convincing.

The fantasy environment may feature subtle, natural movement—such as swaying leaves, rippling grass, slowly drifting clouds, faint mist in the distance, or sunlight filtering through trees—but must exclude intense storms, explosions, magical flashes, or any elements unrelated to the reference image.

The overall aesthetic should be realistic, dreamlike, and cinematic, as if the character has genuinely opened a door into another world.

The following are strictly prohibited: changes to the character’s face or clothing, physical distortions, the appearance of additional characters or extra limbs, floating objects, warped door frames, melting walls, flickering environments, a "flattened" look (loss of depth), incorrect perspective, abrupt transitions, camera jitter, the premature appearance of the fantasy world, scenery from the fantasy world spilling outside the door frame, excessive glow, text, subtitles, logos, or watermarks.`,
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
  {
    id: 'xiaomi-17-pro-forced-perspective-ad',
    title: 'Xiaomi 17 Pro Forced-Perspective Tech Fashion Ad',
    category: 'Image Prompts',
    modelTag: 'Image Prompt · 8K',
    aspectRatio: '3:4 / 9:16',
    previewImage: '/api/social/media/promptbox_img01.jpg',
    shortSummary:
      'Low-angle forced-perspective smartphone campaign featuring a lavender-braided model, glassmorphism UI callouts, and Leica camera specs.',
    proTip:
      'Swap the smartphone model, color palette, and UI callout labels to generate flagship tech ads for any hardware brand.',
    relatedLinkLabel: 'Open PhotoLite AI Studio',
    relatedLinkHref: '/photolite',
    promptText: `Ultra-realistic premium smartphone advertisement, featuring a confident young woman in her early 20s with fair skin and sharp facial features, wearing sleek black cat-eye sunglasses. She has long, thick braided hair styled into an extended oversized braid, colored in soft lavender/purple tones matching the product theme.

She is captured in a dynamic low-angle cinematic pose, slightly twisting her torso while holding a Xiaomi 17 Pro smartphone toward the camera in a bold hero shot with strong forced perspective, the phone dominating the foreground.

The smartphone features a matte metallic lavender/purple finish, minimalistic body with rounded corners, and a large rectangular camera module. The module includes two large camera lenses on the left, a circular secondary display on the right showing a minimal purple gradient clock UI, Leica branding near the camera, a clean flash strip, and subtle Xiaomi branding at the bottom.

Outfit: fitted long-sleeve crop top in soft lavender/purple, paired with high-waisted muted grey/olive cargo pants, modern tech-fashion aesthetic.
Background: clean minimal gradient transitioning from light grey to soft lavender/purple tones, with subtle blurred large-scale typography for depth.
Lighting: soft studio lighting with neutral-to-cool tones, smooth skin illumination, controlled highlights on the phone edges, glossy reflections on camera lenses and display, minimal shadows, premium product photography style.
Composition: low-angle shot for a powerful look, subject positioned slightly left, phone dominating the right foreground, clean negative space for branding.
Futuristic UI overlays: thin minimal white/purple lines and nodes pointing to features with floating labels: “Leica Camera System” “Secondary Display Integration” “Ultra-Slim Premium Design”
Glassmorphism panel (bottom-left, soft purple tint) listing: “Flagship Performance” “Advanced AI Imaging” “Fast Charging” “Next-Gen Xiaomi AI”
Top corner text: “Xiaomi 17 Pro” in clean modern sans-serif typography.
Style: high-end flagship smartphone advertisement, futuristic, minimal, elegant. 8K, ultra-detailed, sharp focus, HDR, cinematic commercial photography.`,
  },
  {
    id: 'tokyo-double-exposure-travel-poster',
    title: 'Tokyo Double-Exposure Luxury Travel Poster',
    category: 'Image Prompts',
    modelTag: 'Image Prompt · 8K',
    aspectRatio: 'Editorial Poster',
    previewImage: '/api/social/media/promptbox_img02.jpg',
    shortSummary:
      'Award-winning double-exposure destination campaign blending a traveler silhouette with Tokyo Tower, Shibuya neon, and cherry blossoms.',
    proTip:
      'Replace "TOKYO" and its landmarks (Tokyo Tower, Shibuya, Senso-ji) with any destination city to build instant tourism posters.',
    relatedLinkLabel: 'Apply: Logo & Brand Designer',
    relatedLinkHref: '/job-center',
    promptText: `Create image Ultra-premium destination marketing poster featuring a stylish modern traveler, created in an elegant double-exposure editorial style. A highly detailed cinematic portrait of a confident young traveler standing against a refined warm ivory-beige background, wearing a contemporary black jacket and minimalist travel backpack, casually holding a smartphone. The subject looks upward toward the distance with a sense of ambition, curiosity, and excitement for new experiences.

Within the silhouette, a stunning visual journey through Tokyo unfolds seamlessly. The composition blends iconic city elements including the illuminated skyline around Tokyo Tower, the vibrant neon streets of Shibuya Crossing, elegant traditional architecture inspired by Sensō-ji, cherry blossoms drifting through the scene, sleek high-speed trains, hidden lantern-lit alleyways, and panoramic city views glowing beneath a golden sunset. Soft clouds, distant birds, and atmospheric lighting create a powerful feeling of exploration and possibility.

Sophisticated modern typography occupies the right side of the layout with the headline "TOKYO" in large bold luxury lettering. Supporting travel campaign copy includes phrases such as "Discover the Extraordinary", "Where Tradition Meets Tomorrow", and "Every Street Tells a Story." Premium tourism branding, clean magazine-cover composition, minimalist luxury design language, balanced negative space, and subtle Japanese-inspired graphic accents.

Photorealistic double-exposure artwork, cinematic storytelling, ultra-realistic skin texture, golden-hour illumination, premium commercial photography, award-winning destination advertising design, 8K quality.`,
  },
  {
    id: 'aeterna-luxury-skincare-serum',
    title: 'Aeterna Botanical Luxury Skincare Product Shot',
    category: 'Image Prompts',
    modelTag: 'Image Prompt · 8K',
    aspectRatio: 'Product Hero',
    previewImage: '/api/social/media/promptbox_img03.png',
    shortSummary:
      'Golden-hour commercial product photography of an amber glass serum bottle on weathered driftwood framed by white lilies and vanilla pods.',
    proTip:
      'Keep exact label wording in ALL CAPS so the generator renders clean, legible luxury packaging typography.',
    relatedLinkLabel: 'Open PhotoLite AI Studio',
    relatedLinkHref: '/photolite',
    promptText: `Luxury skincare product photography, tall amber glass serum bottle with black pump cap and white minimal label reading AETERNA LUXURY SKINCARE RESTORATIVE SERUM VANILLA & BOTANICALS 50 ml, standing on a curved weathered driftwood branch, two fresh white lilies and green lily buds on either side, vanilla pods lying in foreground, warm golden-hour sunlight with long soft shadows, beige-brown textured background, water droplets on bottle, cinematic, ultra-realistic, premium commercial shot, 8K`,
  },
  {
    id: 'vivajuice-streetwear-beverage-ad',
    title: 'VIVAJUICE Forced-Perspective Streetwear Beverage Ad',
    category: 'Image Prompts',
    modelTag: 'Image Prompt · 3:4',
    aspectRatio: '3:4 Vertical',
    previewImage: '/api/social/media/promptbox_img04.jpg',
    shortSummary:
      'Energetic eCommerce beverage poster with graffiti hallway backdrop, oversized forced-perspective bottle, and 4 clean feature badges.',
    proTip:
      'Ideal for D2C drink brands—swap "VIVAJUICE", flavor names, and the 4 feature badges for instant Meta ad creatives.',
    relatedLinkLabel: 'Apply: UI/UX & Web Designer',
    relatedLinkHref: '/job-center',
    promptText: `Create a premium modern beverage advertisement poster in a vertical 3:4 format featuring a stylish young female model crouching confidently in a bright urban indoor hallway with colorful graffiti wall art on one side and clean minimal architecture on the other, giving a trendy streetwear lifestyle vibe. The model wears casual fashionable clothes such as a red oversized jacket, white inner top, black joggers, and white sneakers, looking directly at the camera with a cool confident expression. In the foreground, a giant realistic fruit juice bottle is held toward the camera in forced perspective, dominating the composition with sharp focus and glossy reflections. The bottle should have a completely different fictional brand name such as “VIVAJUICE” in bold modern typography, with attractive fruit illustrations on the label and flavor text like “Sunrise Mango” or “Tropical Burst.” At the top left, place the brand logo and a catchy tagline like “Drink Fresh. Live Bold.” Across the top center, add huge bold overlapping typography reading “PURE AS NATURE” or “FRESH EVERY SIP” in contrasting colors like dark green and mint. Below the headline, include 4 clean icon-based feature badges in a row with text such as “NO ADDED SUGAR,” “100% NATURAL,” “NO PRESERVATIVES,” and “NOT FROM CONCENTRATE.” At the bottom right, display three smaller bottle variants in different flavors neatly arranged. Use soft natural lighting mixed with commercial studio polish, realistic shadows, shallow depth of field, glossy floor reflections, and a premium energetic eCommerce campaign aesthetic inspired by modern Instagram and billboard ads.`,
  },
  {
    id: 'architectural-dumplings-editorial-poster',
    title: 'Architectural Steamed Dumplings Swiss Editorial Poster',
    category: 'Image Prompts',
    modelTag: 'Image Prompt · 4:5',
    aspectRatio: '4:5 Editorial',
    previewImage: '/api/social/media/promptbox_img05.jpg',
    shortSummary:
      'Quiet-luxury 4:5 culinary magazine poster featuring geometric glass-like steam architecture, chef hands, and condensed typography.',
    proTip:
      'Describing steam as "layered translucent sheets and geometric folds" creates a signature editorial look.',
    relatedLinkLabel: 'Open PhotoLite AI Studio',
    relatedLinkHref: '/photolite',
    promptText: `Vertical 4:5 editorial food poster featuring a single plate of handmade steamed dumplings arranged on a dark hammered ceramic dish over a charcoal stone countertop. The composition is centered and highly architectural.

A tall column of hot vapor rises directly above the dumplings and becomes the dominant graphic element. Instead of soft, fluffy steam, shape the vapor into layered translucent sheets, geometric folds, vertical planes, and overlapping glass-like structures, creating the feeling of an architectural monument built from heat.

Only the chef’s hands and forearms are visible. One arm enters naturally from the upper left in a clean ivory chef sleeve, delicately dropping fresh microgreens onto the dumplings. A second hand enters from the lower right, holding the edge of a round bamboo steamer, suggesting the dish has just been served. No face or full human figure.

The background is a flattened matte charcoal kitchen wall with minimal detail. Include only one functional object in the distance: a warm brushed-copper saucepan, softly out of focus.

Use a restrained palette of charcoal black, warm ivory, stone gray, muted copper, soft bamboo brown, and fresh herbal green. Dramatic directional restaurant lighting creates sculptural highlights on the dumplings, realistic moisture, gentle shadows, and visible heat.

Place an enormous translucent numeral “03” behind the rising vapor, partially obscured by the steam architecture and integrated into the composition rather than floating over it.

At the bottom, set the word “DUMPLINGS” in tall, narrow condensed editorial typography with generous letter spacing. Add very small secondary type around the edges for a refined culinary-magazine feel.

Minimal, premium, tactile, quiet luxury, food photography blended with Swiss editorial design and architectural poster composition. Heat, precision, ritual, stillness. No clutter, no cartoon styling, no excessive props. 4:5.`,
  },
  {
    id: 'hide-and-seek-fmcg-campaign-poster',
    title: 'Hide & Seek "Don\'t Just Snack" FMCG Campaign Poster',
    category: 'Image Prompts',
    modelTag: 'Image Prompt · 8K',
    aspectRatio: '4:5 Instagram',
    previewImage: '/api/social/media/promptbox_img06.jpg',
    shortSummary:
      'Behance-caliber Swiss-grid FMCG poster colliding hyper-real macro cookie photography with bold overlapping geometric typography.',
    proTip:
      'Specifying composition percentages (Cookie 45%, Typography 25%, Packaging 20%, Graphic Elements 10%) enforces agency-level layout balance.',
    relatedLinkLabel: 'Apply: Logo & Brand Designer',
    relatedLinkHref: '/job-center',
    promptText: `Act as the Global Creative Director for Parle Hide & Seek, thinking like a collaboration between Parle Creative Studio, The Minimalist, Pentagram, Buck Design, AKQA, Spotify Design, Coca-Cola Global Design, Adobe MAX Featured Designers, and Behance Branding. Create a flagship Instagram campaign poster—not a biscuit advertisement—but a bold, scroll-stopping premium youth culture campaign. Reject generic food photography, floating biscuit packs, milk splash clichés, realistic café scenes, AI-generated FMCG clichés, cheap gradients, and busy compositions.

Campaign: DON’T JUST SNACK. Format: Instagram, 4:5 Vertical, 8K Ultra HD, Modern Graphic Design Poster, Premium FMCG Social Media Campaign. One oversized hyper-real freshly baked cookie dominates the composition, dramatically broken with molten chocolate chips, baked cracks, sugar crystals, natural crumbs, and suspended chocolate pieces interacting with the typography. The factory-accurate matte packaging sits confidently near the bottom right with natural reflections, perspective, and shadow—never floating. Build an abstract premium graphic world inspired by the cookie using oversized circular forms, paper-cut layers, curved ribbons, offset geometric blocks, halftone textures, and strong colour blocking.

Use massive bold geometric sans-serif typography occupying about 35% of the artwork with headlines like DON’T JUST SNACK. or CHIP. CRUNCH. SMILE., integrated so the cookie, crumbs, and chocolate chips overlap and partially hide the letters. Capture as if photographed on a Phase One XF IQ4 150MP with a Schneider Kreuznach 80mm LS. Composition: Cookie 45%, Typography 25%, Packaging 20%, Graphic Elements 10%, following a Swiss-inspired grid with controlled asymmetry. Negative Prompt: NO milk splash, NO pouring chocolate, NO floating packaging, NO realistic kitchen, NO wooden table, NO human models, NO cheap gradients.`,
  },
  {
    id: '3d-puzzle-city-diorama',
    title: '3D Interlocking Puzzle-Piece City Diorama',
    category: 'Image Prompts',
    modelTag: 'Image Prompt · 3D',
    aspectRatio: 'Collectible Diorama',
    previewImage: '/api/social/media/promptbox_img07.jpg',
    shortSummary:
      'Playful collectible 3D miniature world built from interlocking raised puzzle pieces with custom city landmark and 3D lettering.',
    proTip:
      'Fill in [City], [Country], [Iconic Landmark], and [Famous For] (e.g. Jaipur / India / Hawa Mahal) to generate a viral city series.',
    relatedLinkLabel: 'Explore 3D Classrooms',
    relatedLinkHref: '/classrooms',
    promptText: `Create a charming 3D puzzle-piece travel scene of [City], [Country], designed as a single cohesive miniature world. Build the city from beautifully interlocking puzzle pieces, with [Iconic Landmark] as the central focal point. Surround it with recognizable local architecture, streets, trees, transportation, landscape, and small cultural details. Make the puzzle pieces slightly raised with visible seams, rounded edges, layered depth, and soft realistic shadows. Use a sophisticated palette inspired by the city, subtle handcrafted textures, warm studio lighting, clean cream background, playful yet premium collectible-diorama aesthetic. Add elegant 3D lettering: “[City]” and underneath “[Country] • [Famous For]”. Highly polished, cute, artistic, detailed, and instantly recognizable.`,
  },
  {
    id: 'monstera-cafe-product-enhancement',
    title: 'Minimalist Scandinavian Café & Monstera Product Ad',
    category: 'Image Prompts',
    modelTag: 'Image Prompt · 4:5',
    aspectRatio: '4:5 Editorial',
    previewImage: '/api/social/media/promptbox_img08.jpg',
    shortSummary:
      'Clean 85mm f/2.0 luxury café background enhancement with lush Monstera leaves, creamy bokeh, and Scandinavian editorial typography.',
    proTip:
      'Upload your own product photo as an image reference—this prompt preserves 100% of the product shape while upgrading the studio backdrop.',
    relatedLinkLabel: 'Open PhotoLite AI Studio',
    relatedLinkHref: '/photolite',
    promptText: `Create a premium minimalist commercial food photography scene in a clean editorial bakery style. Professionally enhance the photo to make the product look more appetizing and suitable for commercial use. Do not alter the product in any way—preserve its original appearance, shape, texture, color, and proportions exactly as they are. Ratio 4:5.

Create a premium tropical minimalist café background with large lush Monstera Deliciosa leaves placed naturally behind the product: large mature Monstera leaves with rich emerald green color, soft blurred indoor café environment, bright white wall with subtle natural daylight, strong depth of field with creamy bokeh, leaves positioned asymmetrically around the frame creating natural framing without covering the product. No flowers, no wooden shelves, no hanging lights, no people.

Lighting: Natural morning daylight with soft highlights and gentle shadows. Color Palette: Emerald Green, Fresh White, Soft Neutral Grey, Natural Cream. Lens: 85mm DSLR, f/2.0, Shallow Depth of Field.

Typography (Minimal Editorial Style): Reserve the upper-left area as a clean typography zone with a minimalist left-aligned editorial text layout (Brand Name large & elegant; Product Name noticeably smaller below in dark charcoal). Maintain 8–12% margin from left and top edges with generous negative space. Avoid bold heavy fonts, script fonts, gradients, or drop shadows.`,
  },
  {
    id: 'pixar-video-game-movie-poster',
    title: 'Pixar-Style 3D Video Game Movie Poster Reimagining',
    category: 'Image Prompts',
    modelTag: 'Image Prompt · 3D CGI',
    aspectRatio: 'Movie Poster',
    previewImage: '/api/social/media/promptbox_img09.jpg',
    shortSummary:
      'Transform any classic or modern video game into a glossy Pixar-style 3D animated movie poster with expressive characters and title logo.',
    proTip:
      'Replace [Video Game] with titles like GTA Vice City, Zelda, Minecraft, or Red Dead Redemption for instant viral nostalgia posts.',
    relatedLinkLabel: 'Explore Celoris Creative Hub',
    relatedLinkHref: '/social',
    promptText: `Pixar-style movie poster reimagining of the video game [Video Game]. Feature the main characters as charming 3D CGI caricature characters with exaggerated, expressive features, big expressive eyes, and warm glossy Pixar-quality rendering. Compose it as an actual movie poster layout: main characters grouped in a dynamic hero pose, consistent with the game's iconic visual themes, color palette, and setting. Add a bold, playful animated-movie-style title logo at the top or bottom using a font and color treatment that matches the video game’s tone. Include a tagline in small text. Cinematic lighting, vibrant background that reflects the game's world. Professional studio-quality poster composition, high detail, glossy finish.`,
  },
];
