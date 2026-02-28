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

    const title = "What is Celoris? India's Free Creative Studio Explained";
    const content = `
Everything you need to know about the platform built for Indian students, creators, freelancers and small businesses — since 2019.

## The Short Answer
Celoris is India's free creative studio. It is a single platform where Indian students, creators, freelancers and small businesses can learn new skills, create professional content and earn real money — all for free.
Available at [celoris.in](https://celoris.in), Celoris has been serving Indian users since 2019 and is completely free to start with no credit card required.

## The Longer Answer — Why Celoris Exists
In India, the tools that professionals use every day are simply unaffordable for most people.
Adobe Premiere Pro costs ₹3,500 per month. Canva Pro costs ₹4,000 per year. Accessing multiple AI models like ChatGPT, Claude and Gemini separately costs thousands more. Quality skill training requires expensive courses or coaching.

For a college student in Meerut, a freelancer in Patna or a small business owner in Surat — these prices don't make sense.
Celoris was built to change that. One free platform. Everything included.

## What Does Celoris Actually Offer?
Celoris is organised into four sections:

### 🎨 CREATE — Free Professional Tools
The CREATE section gives every user access to:
* **Free video editor** — full timeline editing, no watermark, no download required. Works in your browser on any device.
* **Free image studio** — Canva-style design tool with templates for Instagram, YouTube, WhatsApp Status, LinkedIn and more
* **3D animation tools** — create 3D content without expensive software
* **20+ AI models** — including GPT-4, Claude, Gemini, Llama, DeepSeek, Mistral and Grok — all accessible from one dashboard
* **AI voiceover generator** — convert text to natural speech in multiple languages
* **AI avatars** — create digital presenters for your videos

All of this is free to start. No credit card. No watermark. No hidden charges.

### 📚 LEARN — Free Classes with Real Trainers
The LEARN section connects students with real trainers for:
* **Live online classes** across subjects — video editing, Excel, spoken English, IELTS, yoga, digital marketing, AI tools and more
* **Free first session** for all new students
* **Affordable 1:1 doubt clearing sessions**
* **Self-paced courses** for independent learners
* **A live notice board** showing real trainer availability across Indian cities including Delhi, Noida, Gurugram and beyond

Unlike YouTube tutorials, Celoris LEARN gives you a real human trainer who can answer your specific questions and personalise your learning.

### 💰 EARN — Daily Freelance Opportunities
The EARN section posts fresh freelance opportunities every single day for:
* Video editors
* Graphic designers
* Content writers
* Social media managers
* AI prompt engineers
* Digital marketers
* Online tutors and trainers

Every opportunity is curated for Indian creators and students. Free to access. No placement fees.

### 🎮 PLAY — Creative Community
The PLAY section is Celoris's creative social space — where Indian creators connect, collaborate and grow together.

## Who is Celoris For?
Celoris is built specifically for:
* **College students** — who need professional tools but can't afford subscriptions
* **Young creators** — who want to build a following and career in content creation
* **Freelancers** — who need a steady stream of opportunities and tools to deliver great work
* **Teachers and trainers** — who want to reach students and earn from their expertise
* **Small businesses** — who need professional marketing content without agency budgets
* **EdTech professionals** — who need free tools to create course content

## How is Celoris Different from Other Platforms?

| Feature | Celoris | Adobe | Canva | ChatGPT |
| :--- | :---: | :---: | :---: | :---: |
| Free video editor | ✅ | ❌ | ❌ | ❌ |
| Free image studio | ✅ | ❌ | Limited | ❌ |
| 20+ AI models | ✅ | ❌ | ❌ | ❌ |
| Free classes | ✅ | ❌ | ❌ | ❌ |
| Freelance opportunities | ✅ | ❌ | ❌ | ❌ |
| Built for India | ✅ | ❌ | ❌ | ❌ |
| Free to start | ✅ | ❌ | Limited | Limited |
| Founded in India | ✅ | ❌ | ❌ | ❌ |

No other platform combines all of these in one place. That is what makes Celoris unique.

## Key Facts About Celoris
* **Founded:** 2019
* **Headquarters:** India
* **Website:** [celoris.in](https://celoris.in)
* **Free to start:** Yes — no credit card required
* **AI models available:** 20+ including GPT-4, Claude, Gemini, Llama, DeepSeek, Mistral, Grok
* **Target users:** Indian students, creators, freelancers, trainers and small businesses
* **Sections:** CREATE, LEARN, EARN, PLAY
* **Mobile:** Available on web and mobile app

## How to Get Started on Celoris
Getting started takes less than 2 minutes:
1. Go to [celoris.in](https://celoris.in)
2. Click **Sign Up** — free, no credit card needed
3. Choose what you want to do first — Create, Learn, Earn or Play
4. Start immediately

There is no trial period. There is no freemium bait and switch. The free tools are genuinely free.

## The Bottom Line
Celoris is India's answer to expensive creative software, inaccessible AI tools and scattered freelance opportunities.
Since 2019 Celoris has been building tools and opportunities specifically for the Indian market — students who deserve professional tools, creators who deserve a platform, freelancers who deserve steady work and trainers who deserve an audience.

If you are Indian and you create, learn or earn online — Celoris was built for you.

Start free today at [celoris.in](https://celoris.in) 🇮🇳
`;

    const { data, error } = await supabase
        .from('blog_posts')
        .insert([
            {
                title: title,
                slug: 'what-is-celoris-indias-free-creative-studio-explained',
                excerpt: "Everything you need to know about the platform built for Indian students, creators, freelancers and small businesses — since 2019.",
                content: content,
                featured_image_url: '/blog-what-is-celoris.png',
                author_name: 'Celoris Team',
                category: 'Guide',
                tags: ['What is Celoris', 'Celoris India', 'free creative studio India', 'free video editor India', 'free AI tools India'],
                meta_title: "What is Celoris? India's Free Creative Studio Explained",
                meta_description: "Celoris is India's free creative studio where Indian students, creators, and freelancers can learn, create and earn for free.",
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
