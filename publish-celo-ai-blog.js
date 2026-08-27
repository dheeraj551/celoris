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

    const mdContent = fs.readFileSync(path.resolve(__dirname, 'celo-ai-models-comparison.md'), 'utf-8');
    // Remove the first line (the title) from the content to use as content body
    const contentBody = mdContent.split('\n').slice(1).join('\n').trim();

    const title = "Celo AI Is Here: 35+ AI Models, 100% Free for Celoris Students";
    
    const { data, error } = await supabase
        .from('blog_posts')
        .insert([
            {
                title: title,
                slug: 'celo-ai-models-comparison',
                excerpt: "At Celoris, we've always believed that learning shouldn't come with hidden costs. That's why we're excited to introduce Celo AI — your built-in AI study buddy with 35+ different AI models, completely free for every enrolled student.",
                content: contentBody,
                featured_image_url: '/Celo AI Is Here.png',
                author_name: 'Celoris Team',
                category: 'Product Updates',
                tags: ['Celo AI', 'AI Models', 'Product Update', 'Student Resources', 'Celoris'],
                meta_title: title,
                meta_description: "Discover Celo AI on Celoris. Access 35+ top AI models for free to help you study, code, and learn more effectively.",
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
