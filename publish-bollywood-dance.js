const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function createBlogPost() {
    console.log('Creating new blog post...');

    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
    const supabaseServiceKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('❌ Missing Supabase environment variables');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const title = "How to Learn Bollywood Dance at Home Without a Trainer";
    const content = `
Whether you've been inspired by a movie, a wedding performance, or just want a fun way to stay active — learning Bollywood dance at home is 100% possible. Here's everything you need to get started.

## Why Bollywood Dance Is Perfect for Home Learning
Bollywood dance is one of the most joyful and expressive dance forms in the world. It blends classical Indian dance (like Kathak and Bharatanatyam), folk styles, and modern hip-hop into something uniquely energetic and visual.

The good news? You don't need a studio or a trainer to begin. Bollywood dance is learner-friendly because:

- **The movements are expressive and intuitive** — gestures, facial expressions, and storytelling are at the heart of it.
- **There's a huge library of free content online** — YouTube is full of quality tutorials.
- **You can start with just your living room** — no special equipment needed.
- **It works for all fitness levels** — you control the pace.

## What You'll Need Before You Start
Getting set up doesn't require much:

- **A clear space** — move your furniture back to give yourself a 6x6 ft area minimum.
- **Comfortable clothing** — something you can move freely in; loose kurtas or leggings work great.
- **A phone or laptop** — to follow along with tutorials.
- **Bare feet or soft-soled shoes** — most Bollywood styles are performed without shoes.
- **A mirror (optional but recommended)** — helps you check your posture and expressions.

## Step 1: Start With the Basics — Don't Skip This
Before you jump into full choreography, spend your first few sessions on foundational movements. These appear again and again in Bollywood routines:

### Key Basic Movements to Learn First
1. **The Thumka**
This is the signature hip drop of Bollywood. Stand with feet hip-width apart, slightly bend your knees, and drop one hip down while shifting your weight. It's the base of countless moves.

2. **The Namaste Pose + Hand Gestures (Mudras)**
Bollywood draws heavily from classical dance. Simple mudras — like the lotus hand, the pointing finger, and the open palm — add polish and authenticity to any routine.

3. **Head Slides (Neck Isolations)**
A slow, side-to-side head slide is one of the most iconic and recognizable Bollywood movements. Practice in front of a mirror: keep your shoulders still and slide your head left and right smoothly.

4. **Basic Footwork Pattern**
Step-touch, step-step-touch: right foot steps right, left foot closes in, then left foot steps left. This simple pattern underlies many Bollywood sequences.

5. **Shoulder Shimmy**
Alternating shoulder pushes forward in a quick, rhythmic motion. Practice it slowly first, then speed up to match the music.

## Step 2: Find the Right YouTube Tutorials
Not all tutorials are created equal. Here's what to look for when choosing videos to learn from:

- **Search terms to use:** "Bollywood dance tutorial for beginners," "easy Bollywood steps at home," "learn Bollywood dance step by step"
- **Look for:** Videos that break down each move slowly before showing it at full speed
- **Recommended content types:** Single-song choreography breakdowns, basic steps compilations, or tutorials organized by skill level

**Pro tip:** Choose songs you actually love. Motivation is everything when you're learning solo — if you're obsessed with the song, you'll repeat it 20 times without noticing.

## Step 3: Learn Your First Full Choreography
Once you've got the basics down (give it 2–4 sessions), pick ONE song and ONE choreography tutorial and commit to it fully. Here's how to approach it:

- **Watch the full video first without dancing** — just observe the flow, the sections, and the transitions.
- **Break it into chunks** — most Bollywood songs have a verse, pre-chorus, chorus, and bridge. Learn one section at a time.
- **Slow it down** — most video players let you reduce speed to 0.75x or 0.5x; use this constantly.
- **Layer it up** — first learn the feet, then add the arms, then add expressions.
- **Record yourself** — watching your own video is uncomfortable but incredibly effective. It shows you what's working and what isn't.

Plan for 5–10 sessions per song before you feel fully comfortable with it. That's completely normal.

## Step 4: Build a Consistent Practice Routine
The biggest difference between people who progress and those who stagnate is consistency, not talent.

A simple weekly structure for beginners:

| Day | Focus | Duration |
| :--- | :--- | :--- |
| **Monday** | Warm-up + basics review | 20–25 min |
| **Wednesday** | New choreography learning | 30 min |
| **Friday** | Full run-throughs + freestyle | 20–30 min |
| **Weekend** | Rest or light practice | - |

Even three 20-minute sessions per week will produce noticeable progress within a month.

## Step 5: Train Your Expressions — This Is What Makes Bollywood, Bollywood
Technical steps alone won't capture the essence of Bollywood. The *abhinaya* (expressional storytelling) is equally important.

Here's how to work on this at home:
- **Practice in front of a mirror** — exaggerate your facial expressions, then dial back to find the right level.
- **Watch your favorite Bollywood songs** and focus on the dancers' faces, not just their feet.
- **Emotion mapping** — for each section of your song, decide what emotion you're conveying: joy, longing, teasing, celebration.
- **Let go of self-consciousness** — this is probably the hardest part of at-home practice, but it's essential. Dance like no one is watching, because literally no one is.

## Common Mistakes Beginners Make
- **Dancing too big too fast.** Bollywood looks large and energetic, but control comes first. Master the movement small, then expand it.
- **Ignoring the music.** Count the beats out loud when you're learning. Bollywood has very clear 8-count phrases — use them.
- **Skipping the warm-up.** Bollywood involves a lot of hip, shoulder, and neck movement. A 5-minute warm-up (neck rolls, hip circles, arm swings) prevents strain.
- **Only learning choreography and not basics.** Choreography teaches you a routine; basics teach you to dance. Do both.
- **Giving up after the first few awkward sessions.** Everyone looks terrible at the beginning. It's a feature, not a bug.

## Songs That Are Great for Beginners
These are popular, well-loved tracks with clear beats and approachable choreography online:

- **Nagada Sang Dhol** — strong rhythm, easy to find the beat.
- **Desi Girl** — clear 8-count structure, lots of tutorial options.
- **Badtameez Dil** — energetic and fun, great for building stamina.
- **Dilbar** — slower sections make it good for learning control.
- **Ghungroo** — mixes classical and contemporary Bollywood nicely.

## When Should You Consider a Trainer?
Home learning can take you surprisingly far — but there are a few signals that a trainer would help:

- You've been practicing for 3–6 months and feel stuck on technique.
- You want to perform at a wedding, event, or show and want polish.
- You're experiencing pain or discomfort (especially in knees or back) — a trainer can correct posture.
- You want to learn a specific classical style deeply (Kathak, Bharatanatyam) — these really do benefit from in-person instruction.

## Your First Week: A Simple Action Plan
- **Day 1:** Clear your space, find 3 tutorial channels you like, practice the thumka and head slide for 15 minutes.
- **Day 2:** Learn shoulder shimmy and basic footwork, practice all basics for 20 minutes.
- **Day 3:** Choose your first song, watch the choreography tutorial in full, learn the first 8 counts.
- **Day 4:** Review and add the next 8 counts.
- **Day 5:** Rest or light freestyle to your chosen song.
- **Day 6–7:** Keep building the choreography, one section at a time.

Bollywood dance is meant to be joyful and communal — but there's nothing wrong with starting alone in your living room. Some of the best dancers started exactly that way.
`;

    const { data, error } = await supabase
        .from('blog_posts')
        .insert([
            {
                title: title,
                slug: 'how-to-learn-bollywood-dance-at-home-without-a-trainer',
                excerpt: "Whether you've been inspired by a movie or just want a fun way to stay active — learning Bollywood dance at home is 100% possible. Here's everything you need to get started.",
                content: content,
                featured_image_url: '/blog-bollywood-dance.png',
                author_name: 'Celoris Team',
                category: 'Tutorial',
                tags: ['learn bollywood dance at home', 'bollywood dance for beginners', 'how to learn bollywood dance without a trainer', 'bollywood dance tutorial', 'at-home dance practice'],
                meta_title: "How to Learn Bollywood Dance at Home Without a Trainer | Celoris",
                meta_description: "Learn Bollywood dance at home for free! Follow our step-by-step guide on basic moves, finding the best tutorials, and building a practice routine.",
                is_published: true,
                is_featured: true,
                status: 'published',
                published_at: new Date().toISOString()
            }
        ])
        .select();

    if (error) {
        console.error('❌ Error creating blog post:', error);
    } else {
        console.log('✅ Blog post created and published successfully');
        console.log(JSON.stringify(data, null, 2));
    }
}

createBlogPost();
