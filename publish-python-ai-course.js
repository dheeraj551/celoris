const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

async function publishCourse() {
    console.log('Publishing Python for AI Developers course...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase environment variables');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const courseData = {
        title: "Python for AI Developers",
        description: "A comprehensive course in applied Python for Machine Learning & AI. 10 Modules, 40+ Hours of high-impact content.",
        subject: "Artificial Intelligence",
        grade_level: "Applied Python for ML & AI",
        target_audience: "Software Developers, Engineers, Data Professionals",
        instructor_name: "Celoris Team",
        instructor_bio: "Core Celoris AI Engineering Team specializing in production-ready AI systems.",
        learning_outcomes: [
            "Write clean, idiomatic Python code for AI workflows",
            "Build and train ML models with scikit-learn and PyTorch",
            "Work with LLMs (OpenAI, Claude) and Agentic systems",
            "Build & Deploy AI APIs with FastAPI and Docker"
        ],
        requirements: [
            "Basic programming experience in any language",
            "No prior Python or ML knowledge required"
        ],
        preview_video_url: "",
        syllabus_url: "",
        course_duration: "40+ Hours",
        price: 19999,
        course_image_url: "/python-ai-course.png",
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
        console.error('Details:', error.details);
        console.error('Hint:', error.hint);
    } else {
        console.log('✅ Course published successfully!');
        console.log(JSON.stringify(data, null, 2));
    }
}

publishCourse();
