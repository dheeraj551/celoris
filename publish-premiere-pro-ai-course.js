const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

async function publishCourse() {
    console.log('Publishing Adobe Premiere Pro with AI in 2026 course...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase environment variables');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const courseData = {
        title: "How to Master Adobe Premiere Pro with AI in 2026",
        description: "A Practical 2-Week Intensive for Video Creators, Freelancers & Content Marketers. Master AI tools, B-roll generation, and automated workflows.",
        subject: "Design",
        grade_level: "Beginner to Intermediate",
        target_audience: "Content Creators, YouTubers, Reels Editors, Freelancers, Marketers",
        instructor_name: "Celoris Team",
        instructor_bio: "The Celoris core team specializes in creative tech and AI-assisted professional workflows.",
        learning_outcomes: [
            "Edit professional videos using Adobe Premiere Pro 2026's AI-powered tools",
            "Generate AI B-roll, voiceovers, and captions automatically",
            "Color grade footage using AI-matched color correction",
            "Remove backgrounds, key green screen, and composite AI scenes",
            "Dub and translate your videos into multiple languages with AI",
            "Automate repetitive editing tasks using AI plugins and batch workflows",
            "Export platform-optimized videos for YouTube, Instagram, and LinkedIn"
        ],
        requirements: [
            "Adobe Premiere Pro 2026",
            "Adobe Firefly access",
            "No prior editing experience needed"
        ],
        preview_video_url: "",
        syllabus_url: "",
        course_duration: "30 Hours",
        price: 14999,
        course_image_url: "/premiere-pro-ai-hero.png",
        is_published: true,
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select();

    if (error) {
        console.error('❌ Error publishing course:');
        console.error('Code:', error.code);
        console.error('Message:', error.message);
    } else {
        console.log('✅ Course published successfully!');
        console.log(JSON.stringify(data, null, 2));
    }
}

publishCourse();
