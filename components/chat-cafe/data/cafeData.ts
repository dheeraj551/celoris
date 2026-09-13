import { CafeDrink, CafeTable, DiscussionTopic } from '../types';

export const CAFE_DRINKS: CafeDrink[] = [
  { id: 'latte', name: 'Velvet Vanilla Latte', icon: '☕', type: 'hot', flavorNote: 'Smooth espresso, steamed oat milk, Madagascar vanilla' },
  { id: 'matcha', name: 'Ceremonial Matcha Latte', icon: '🍵', type: 'hot', flavorNote: 'Uji green tea whisked with creamy honey froth' },
  { id: 'caramel_macchiato', name: 'Caramel Cloud Macchiato', icon: '🍮', type: 'hot', flavorNote: 'Rich dark espresso, vanilla syrup & golden drizzle' },
  { id: 'cold_brew', name: 'Lavender Cold Brew', icon: '🧊', type: 'iced', flavorNote: 'Steeped 18 hours, infused with French lavender & cream' },
  { id: 'chai', name: 'Spiced Cardamom Chai', icon: '🫖', type: 'hot', flavorNote: 'Black tea steeped with crushed cinnamon, clove & ginger' },
  { id: 'cappuccino', name: 'Cinematic Cappuccino', icon: '☕', type: 'hot', flavorNote: 'Classic 1:1:1 espresso, milk, and towering foam art' },
  { id: 'boba', name: 'Brown Sugar Milk Tea', icon: '🧋', type: 'sweet', flavorNote: 'Slow-simmered tapioca pearls, dark muscovado syrup' },
  { id: 'croissant', name: 'Flaky Almond Croissant', icon: '🥐', type: 'snack', flavorNote: 'Double-baked with frangipane and powdered sugar' },
  { id: 'cinnamon_roll', name: 'Warm Cinnamon Brioche', icon: '🧁', type: 'snack', flavorNote: 'Oven-fresh with cream cheese glaze' },
];

export const CAFE_TABLES: CafeTable[] = [
  {
    id: 'main_lounge',
    name: 'Celoris Cafe',
    tagline: 'The buzzing heart of the café. Casual greetings, lofi tunes, and warm introductions.',
    icon: '☕',
    atmosphere: 'Lively & Cozy',
    slowModeSeconds: 0,
  },
  {
    id: 'study_nook',
    name: 'Books & Study Nook',
    tagline: 'Quiet focus table for readers, students, learners, and thoughtful musings.',
    icon: '📚',
    atmosphere: 'Gentle & Concentrated',
    slowModeSeconds: 5,
  },
  {
    id: 'idea_roastery',
    name: 'The Idea Roastery',
    tagline: 'Creative brewing ground for philosophy, design, tech, hobbies, and midnight epiphanies.',
    icon: '💡',
    atmosphere: 'Curious & Dynamic',
    slowModeSeconds: 0,
  },
  {
    id: 'mindful_patio',
    name: 'Mindful Garden Patio',
    tagline: 'Open-air veranda for deep gratitude, daily reflections, and calming conversations.',
    icon: '🌿',
    atmosphere: 'Peaceful & Welcoming',
    slowModeSeconds: 5,
  },
];

export const SEED_TOPICS: DiscussionTopic[] = [
  {
    id: 'topic_1',
    title: 'Small Rituals That Save Our Sanity',
    prompt: 'What is one modest, everyday routine or comfort object that instantly resets your mind during a noisy day?',
    category: 'Daily Reflections & Mind',
    starterQuestions: [
      'Is it morning coffee, quiet walks, or an album you put on repeat?',
      'How did you first develop this habit?',
      'What advice would you give someone feeling overwhelmed today?'
    ],
    hostedBy: 'Barista Nora',
    startedAt: Date.now() - 1000 * 60 * 20,
    phase: 'open_floor',
  },
  {
    id: 'topic_2',
    title: 'The Lost Art of Third Places',
    prompt: 'Historically, cafes, libraries, and bookshops served as the "Third Place" between home and work. What creates a genuine sense of belonging in a digital space?',
    category: 'Culture & Community',
    starterQuestions: [
      'What is your favorite local hangout in your hometown?',
      'Can an online room ever feel as cozy as a physical corner booth?',
      'What small design touch makes you feel safe to speak your mind?'
    ],
    hostedBy: 'Oliver (Café Host)',
    startedAt: Date.now() - 1000 * 60 * 5,
    phase: 'open_floor',
  },
  {
    id: 'topic_3',
    title: 'Unconventional Things You Learned Recently',
    prompt: 'Share a surprising fact, strange rabbit hole, or craft technique you stumbled across this week.',
    category: 'Curiosity & Learning',
    starterQuestions: [
      'Did you read an essay, watch a documentary, or learn by trial and error?',
      'Why did it stick with you?',
      'What would you love to learn next if time wasn\'t an issue?'
    ],
    hostedBy: 'Barista Nora',
    startedAt: Date.now() - 1000 * 60 * 45,
    phase: 'deep_dive',
  },
];

export const AVATAR_CHARACTERS = [
  { id: 'cat_barista', name: 'Barista Cat', icon: '🐱', accessory: 'Apron & Whisk', color: 'from-amber-400 to-orange-500' },
  { id: 'fox_books', name: 'Library Fox', icon: '🦊', accessory: 'Horn-rim Glasses', color: 'from-orange-400 to-amber-600' },
  { id: 'owl_philosophy', name: 'Coffee Owl', icon: '🦉', accessory: 'Wool Scarf', color: 'from-stone-400 to-stone-600' },
  { id: 'bear_cozy', name: 'Cozy Bear', icon: '🐻', accessory: 'Knit Beanie', color: 'from-amber-700 to-yellow-800' },
  { id: 'rabbit_matcha', name: 'Matcha Bunny', icon: '🐰', accessory: 'Tea Flower', color: 'from-emerald-400 to-teal-600' },
  { id: 'capybara_chill', name: 'Chill Capybara', icon: '🦫', accessory: 'Steam Swirls', color: 'from-amber-600 to-amber-800' },
  { id: 'otter_latte', name: 'Latte Otter', icon: '🦦', accessory: 'Espresso Cup', color: 'from-cyan-500 to-blue-600' },
  { id: 'raccoon_pastry', name: 'Baker Raccoon', icon: '🦝', accessory: 'Baker Toque', color: 'from-slate-500 to-zinc-700' },
  { id: 'shiba_patron', name: 'Shiba Regular', icon: '🐕', accessory: 'Bandana', color: 'from-yellow-400 to-amber-500' },
];

export const STATUS_PRESETS = [
  'Sipping a warm oat latte ☕',
  'Deep in book chapter 7 📖',
  'Coding with lofi beats 🎧',
  'Writing journal reflections ✍️',
  'Looking for a good discussion 💬',
  'Taking a five-minute breather 🌿',
  'Baking fresh cinnamon buns 🥐',
  'Watching rain on the window 🌧️',
];

export const HOUSE_RULES = [
  { title: 'Be Warm & Welcoming', description: 'Treat every user with patience, curiosity, and courtesy. We come from all corners of the world.' },
  { title: 'Respect Topic Flow', description: 'When participating in guided discussions, listen generously and build on others\' insights.' },
  { title: 'No Harassment or Hate Speech', description: 'Zero tolerance for toxicity, discriminatory language, personal attacks, or aggressive behavior.' },
  { title: 'Keep the Space Safe & Cozy', description: 'No spamming, commercial promotions, or disruptive flooding. Respect slow mode when active.' },
  { title: 'Flag, Don’t Escalate', description: 'If a message violates the café spirit, use the report button so our moderators can handle it swiftly.' },
];
