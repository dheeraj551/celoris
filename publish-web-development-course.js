const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

async function publishWebDevCourse() {
    console.log('Publishing Web Development Bootcamp course...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase environment variables');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const courseData = {
        title: "Web Development Bootcamp — From Zero to Your First Live Website",
        description: "Learn to build real websites from scratch — HTML, CSS, JavaScript, and hands-on projects — taught by trainers who build for a living, not just teach from slides. This course takes you from complete beginner to building your own live, functional websites. You won't just learn syntax — you'll build real projects you can show in interviews, freelance pitches, or your own portfolio.",
        subject: "Web Development",
        grade_level: "Beginner",
        target_audience: "Complete beginners with zero coding background, Students exploring a career switch into tech, Working professionals wanting a high-demand freelance skill, Business owners who want to understand or manage their own website, Anyone who's always wanted to build something real on the internet",
        instructor_name: "Celoris Team",
        instructor_bio: "Core Celoris Development Team — experienced engineers and trainers who build production web apps and teach real-world skills, not just slides.",
        learning_outcomes: [
            "Build and deploy a complete, live personal website or web app from scratch",
            "Master HTML5 structure, semantic tags, forms, and embedded media",
            "Style websites with CSS3, Flexbox, Grid, and Tailwind CSS for responsive design",
            "Write JavaScript to manipulate the DOM, handle events, and add interactivity",
            "Use Git & GitHub for version control and collaborate on projects",
            "Deploy live websites using Vercel, Netlify, or GitHub Pages"
        ],
        requirements: [
            "No prior coding experience required",
            "Basic computer literacy (using a browser, file folders)",
            "A laptop/desktop (mobile alone isn't practical for coding practice)"
        ],
        preview_video_url: "",
        syllabus_url: "",
        course_duration: "8-10 weeks",
        price: 11999,
        course_image_url: "/celoris-web-development-course.gif",
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
            title: "Web Development Foundations",
            description: "Understand how the web works, set up your tools, and learn the big picture of front-end vs back-end.",
            topics: [
                "How the web works: browsers, servers, domains, hosting",
                "Setting up your development environment (VS Code, browser dev tools)",
                "Understanding front-end vs. back-end"
            ]
        },
        {
            module_number: 2,
            title: "HTML — Structuring the Web",
            description: "Learn the building blocks of every webpage using HTML.",
            topics: [
                "HTML document structure and semantic tags",
                "Forms, tables, links, images, embedding media",
                "Building your first static page"
            ]
        },
        {
            module_number: 3,
            title: "CSS — Styling & Layout",
            description: "Make your websites look great with modern CSS techniques.",
            topics: [
                "Selectors, box model, colors, typography",
                "Flexbox and Grid for modern layouts",
                "Responsive design: making sites work on mobile and desktop",
                "Intro to Tailwind CSS (industry-relevant utility framework)"
            ]
        },
        {
            module_number: 4,
            title: "JavaScript Fundamentals",
            description: "Add interactivity and logic to your websites with JavaScript.",
            topics: [
                "Variables, functions, loops, conditionals",
                "DOM manipulation (making pages interactive)",
                "Events, forms validation, basic interactivity projects"
            ]
        },
        {
            module_number: 5,
            title: "Intermediate JavaScript",
            description: "Level up your JS skills with APIs, async programming, and modern syntax.",
            topics: [
                "Working with APIs and fetch requests",
                "JSON, asynchronous programming basics",
                "Introduction to modern JS practices (ES6+)"
            ]
        },
        {
            module_number: 6,
            title: "Version Control & Deployment",
            description: "Ship your projects live using Git, GitHub, and hosting platforms.",
            topics: [
                "Git and GitHub basics — tracking changes, collaboration",
                "Deploying a live website (Vercel/Netlify/GitHub Pages)",
                "Setting up a custom domain (optional add-on)"
            ]
        },
        {
            module_number: 7,
            title: "Intro to a Modern Framework",
            description: "Get a practical introduction to React and component-based development.",
            topics: [
                "Overview of React (or chosen framework) fundamentals",
                "Building a simple component-based project",
                "Why frameworks matter in real-world development"
            ]
        },
        {
            module_number: 8,
            title: "Capstone Project",
            description: "Build and deploy your own complete website or web app with trainer feedback.",
            topics: [
                "Plan and build a complete personal website or small web app",
                "Deploy it live with a working URL",
                "Get trainer feedback for portfolio/interview readiness"
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
    console.log(`🔗 URL slug to use: web-development-bootcamp`);
}

publishWebDevCourse();
