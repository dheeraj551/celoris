const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

async function publishAiWebDevCourse() {
    console.log('Publishing AI-Powered Web Development course...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase environment variables');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const courseData = {
        title: "AI-Powered Web Development — Build Real Websites the Modern Way",
        description: "Learn to build and deploy real, live websites using AI tools — the same way modern developers actually work in 2026. This course teaches you to build complete, live websites using AI coding assistants and no-code/low-code AI builders — while still giving you enough technical literacy to understand, customize, and fix what AI generates. You won't just prompt blindly; you'll learn to direct AI like a professional developer does.",
        subject: "Web Development & AI",
        grade_level: "Beginner",
        target_audience: "Complete beginners with zero coding background, Students exploring a career switch into tech, Working professionals wanting to build websites/products fast, Freelancers wanting a modern high-leverage skill, Business owners who want to build or manage their own site",
        instructor_name: "Celoris Team",
        instructor_bio: "Core Celoris Development Team — experienced engineers and trainers who build production web apps using modern AI-assisted workflows.",
        learning_outcomes: [
            "A live, deployed website built using a real AI-assisted workflow",
            "The ability to direct AI tools like a professional, not just prompt randomly",
            "Enough fundamentals to debug, customize, and understand what AI builds for you",
            "A GitHub portfolio and live project link to show employers or clients"
        ],
        requirements: [
            "No prior coding experience required",
            "Basic computer literacy (browser, file folders)",
            "A laptop/desktop (mobile alone isn't practical for building)"
        ],
        preview_video_url: "",
        syllabus_url: "",
        course_duration: "6-8 weeks",
        price: 12999,
        course_image_url: "/ai-web-dev-feature.png",
        is_published: true,
        is_featured: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    };

    const { data: courseResult, error: courseError } = await supabase
        .from('courses')
        .insert([courseData])
        .select();

    if (courseError) {
        console.error('❌ Error publishing course:', courseError);
        return;
    }

    const newCourse = courseResult[0];
    const courseId = newCourse.id;
    console.log(`✅ Course published successfully with ID: ${courseId}`);

    const modules = [
        {
            module_number: 1,
            title: "The Modern Web Developer's Workflow",
            description: "How web development actually works in 2026 — AI-assisted, not AI-replaced.",
            topics: [
                "How web development actually works in 2026",
                "Overview of the AI dev stack: AI coding assistants, AI website builders",
                "Setting up your toolkit (browser, code editor, AI tools accounts)"
            ]
        },
        {
            module_number: 2,
            title: "Web Fundamentals (Just Enough to Be Dangerous)",
            description: "Learn HTML, CSS, and JS concepts so you can understand what the AI is generating.",
            topics: [
                "How websites work: HTML structure, CSS styling, JavaScript behavior",
                "Reading and understanding AI-generated code",
                "Why fundamentals still matter even when AI writes the first draft"
            ]
        },
        {
            module_number: 3,
            title: "Building with AI Coding Assistants",
            description: "Master the art of prompting for code and using modern AI coding tools.",
            topics: [
                "Prompting effectively for web development",
                "Hands-on with modern AI coding tools (Claude, Cursor, etc)",
                "Iterating: fixing, refining, and customizing AI-generated code"
            ]
        },
        {
            module_number: 4,
            title: "AI Website Builders & Rapid Prototyping",
            description: "Go from idea to working prototype in minutes using AI-first builders.",
            topics: [
                "Using AI-first builders (v0, Lovable, Bolt, Framer AI)",
                "Going from idea to working prototype in minutes",
                "When to use a builder vs. when to hand-code a section"
            ]
        },
        {
            module_number: 5,
            title: "Styling & Making It Look Professional",
            description: "Guide the AI to produce beautiful, custom-looking designs using Tailwind CSS.",
            topics: [
                "Design fundamentals: layout, spacing, color, typography",
                "Using Tailwind CSS with AI assistance for clean design",
                "Making sites look custom, not template-generic"
            ]
        },
        {
            module_number: 6,
            title: "Connecting Real Functionality",
            description: "Add forms, backend integration, and database basics with AI assistance.",
            topics: [
                "Forms, contact submissions, basic backend concepts",
                "Introduction to databases and APIs (Supabase basics)",
                "Understanding what's happening under the hood"
            ]
        },
        {
            module_number: 7,
            title: "Deployment & Going Live",
            description: "Ship your AI-built projects to the real world using GitHub and modern hosting.",
            topics: [
                "Git/GitHub basics for version control",
                "Deploying with Vercel/Netlify",
                "Custom domains and going live for real"
            ]
        },
        {
            module_number: 8,
            title: "Capstone Project",
            description: "Build and deploy a complete web application with your new workflow.",
            topics: [
                "Plan and build a complete website/web app using your AI workflow",
                "Deploy it live with a working URL",
                "Present it for trainer feedback — portfolio and interview-ready"
            ]
        }
    ];

    for (const mod of modules) {
        console.log(`Publishing Module ${mod.module_number}: ${mod.title}...`);

        const { data: modResult, error: modError } = await supabase
            .from('course_modules')
            .insert([{
                course_id: courseId,
                module_number: mod.module_number,
                title: mod.title,
                description: mod.description,
                estimated_duration: 180,
                is_published: true
            }])
            .select();

        if (modError) {
            console.error(`❌ Error inserting module ${mod.module_number}:`, modError);
            continue;
        }

        const moduleId = modResult[0].id;

        const topicsToInsert = mod.topics.map((topicTitle, index) => ({
            module_id: moduleId,
            order_in_module: index + 1,
            title: topicTitle,
            short_description: `Learn about ${topicTitle} in detail.`,
            full_content: `### ${topicTitle}\n\nDetailed learning material for this topic will be covered in class sessions and practical labs.`,
            content_type: 'text',
            estimated_duration: 45,
            status: 'published'
        }));

        const { error: topicsError } = await supabase
            .from('course_topics')
            .insert(topicsToInsert);

        if (topicsError) {
            console.error(`❌ Error inserting topics for module ${mod.module_number}:`, topicsError);
        } else {
            console.log(`✅ Module ${mod.module_number} and its topics inserted.`);
        }
    }

    console.log('');
    console.log(`🎉 Course publication complete!`);
    console.log(`📌 Course ID: ${courseId}`);
    console.log(`🔗 URL slug to use: ai-web-development`);
}

publishAiWebDevCourse();
