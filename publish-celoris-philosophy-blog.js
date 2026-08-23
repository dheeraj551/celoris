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

    const mdContent = fs.readFileSync(path.resolve(__dirname, 'celoris-blog-simple-transparent-honest.md'), 'utf-8');
    // Remove the first line (the title) from the content to use as content body
    const contentBody = mdContent.split('\n').slice(1).join('\n').trim();

    const title = "Why We Built Celoris to Be Simple, Transparent & Honest (And Why That Matters More Than You Think)";
    
    const { data, error } = await supabase
        .from('blog_posts')
        .insert([
            {
                title: title,
                slug: 'celoris-blog-simple-transparent-honest',
                excerpt: "We built Celoris because we were tired of hidden fees and sales calls. Learn why simple, transparent, and honest isn't just a tagline, but the core philosophy behind our platform.",
                content: contentBody,
                featured_image_url: '/Why We Built Celoris to Be Simple,.png',
                author_name: 'Celoris Team',
                category: 'Company',
                tags: ['Celoris', 'philosophy', 'transparent', 'online learning', 'education'],
                meta_title: title,
                meta_description: "Learn why Celoris is built on simplicity, transparency, and honesty. Discover how we're changing online learning in India with free tools and education.",
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
