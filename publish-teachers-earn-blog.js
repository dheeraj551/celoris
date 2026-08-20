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

    const mdContent = fs.readFileSync(path.resolve(__dirname, 'how-teachers-can-earn-online-with-celoris.md'), 'utf-8');
    // Remove the first line (the title) from the content to use as content body, or just keep it as H1
    const contentBody = mdContent.split('\n').slice(1).join('\n').trim();

    const title = "How to Earn Online as a Teacher in 2026: A Complete Guide for Delhi/NCR Educators";
    
    const { data, error } = await supabase
        .from('blog_posts')
        .insert([
            {
                title: title,
                slug: 'how-teachers-can-earn-online-with-celoris',
                excerpt: "If you're a teacher, tutor, or trainer in Delhi/NCR, you already have something incredibly valuable — expertise that people are actively searching for online. This guide breaks down exactly how teachers are building real online income in 2026.",
                content: contentBody,
                featured_image_url: '/blog-online-teaching-delhi-2026.png',
                author_name: 'Celoris Team',
                category: 'Guide',
                tags: ['online teaching', 'earn online', 'delhi ncr', 'online courses', 'Celoris', 'teachers'],
                meta_title: title,
                meta_description: "A complete guide for teachers in Delhi/NCR to start earning online in 2026. Compare platforms, see why Celoris is different, and start monetizing your skills.",
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
