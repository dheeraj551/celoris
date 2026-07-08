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

    const mdContent = fs.readFileSync(path.resolve(__dirname, 'how-to-teach-online-and-earn-extra-income-2026.md'), 'utf-8');
    // Remove the first line (the title) from the content to use as content body, or just keep it as H1
    const contentBody = mdContent.split('\n').slice(1).join('\n').trim();

    const title = "How to Teach Online and Earn Extra Income in 2026 (Complete Guide)";
    
    const { data, error } = await supabase
        .from('blog_posts')
        .insert([
            {
                title: title,
                slug: 'how-to-teach-online-and-earn-extra-income-2026',
                excerpt: "If you have a skill — Excel, Python, digital marketing, dance, spoken English, design, whatever it is — 2026 is one of the best years to turn it into income. More people are learning online than ever.",
                content: contentBody,
                featured_image_url: '/how-to-teach-online-and-earn-extra-income-2026.png',
                author_name: 'Celoris Team',
                category: 'Guide',
                tags: ['online teaching', 'earn extra income', 'freelance', 'online courses', 'Celoris'],
                meta_title: "How to Teach Online and Earn Extra Income in 2026 (Complete Guide)",
                meta_description: "A complete guide to teaching online in 2026. Compare major platforms, earning potential, and the best ways to start monetizing your skills today.",
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
