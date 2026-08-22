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

    const mdContent = fs.readFileSync(path.resolve(__dirname, 'meta-ads-guide-celoris.md'), 'utf-8');
    // Remove the first line (the title) from the content to use as content body
    const contentBody = mdContent.split('\n').slice(1).join('\n').trim();

    const title = "Meta Ads Masterclass: How to Run Facebook & Instagram Ads That Actually Convert (2026 Guide)";
    
    const { data, error } = await supabase
        .from('blog_posts')
        .insert([
            {
                title: title,
                slug: 'meta-ads-guide-celoris',
                excerpt: "If you're running a business in Delhi/NCR — ya kahin bhi — chances hai aapke customers Instagram aur Facebook par scroll kar rahe hain right now. This guide breaks down everything from Ads Manager basics to reading your metrics like a pro.",
                content: contentBody,
                featured_image_url: '/Meta Ads Masterclass How to Run Facebook & Instagram Ads That Actually Convert (2026 Guide).png',
                author_name: 'Celoris Team',
                category: 'Marketing',
                tags: ['meta ads', 'facebook ads', 'instagram ads', 'digital marketing', 'Celoris', '2026 guide'],
                meta_title: title,
                meta_description: "A complete guide to Meta Ads for businesses. Learn Facebook and Instagram advertising basics, audience targeting, and metrics to run profitable campaigns in 2026.",
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
