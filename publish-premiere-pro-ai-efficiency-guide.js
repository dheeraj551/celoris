const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function publishBlogPost() {
    console.log('Publishing Premiere Pro AI Efficiency Guide...');

    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
    const supabaseServiceKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('❌ Missing Supabase environment variables');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const mdContent = fs.readFileSync(path.resolve(__dirname, 'premiere-pro-ai-efficiency-guide.md'), 'utf-8');
    const contentBody = mdContent.split('\n').slice(1).join('\n').trim();

    const title = "The AI Post-Production Blueprint: Quantifying Efficiency, Workflows, and Enterprise ROI in Adobe Premiere Pro";
    const slug = 'premiere-pro-ai-efficiency-guide-2026';

    const postPayload = {
        title: title,
        slug: slug,
        excerpt: "Enterprise benchmark data reveals how native AI in Adobe Premiere Pro—Text-Based Editing, Generative Extend via Firefly, Essential Sound, Lumetri Color Match, and Auto Reframe—slashes assembly time by up to 70%, shifting editors to scalable value-based retainers.",
        content: contentBody,
        featured_image_url: '/premiere-pro-ai-efficiency-guide-2026.jpg',
        author_name: 'Celoris Video & AI Editorial Lab',
        category: 'AI Video • Post-Production',
        tags: ['Adobe Premiere Pro', 'AI Video Editing', 'Firefly Video', 'Text-Based Editing', 'Lumetri Color', 'Auto Reframe', 'Post-Production ROI', 'Celoris Academy'],
        meta_title: title,
        meta_description: "Enterprise benchmark analysis: How native AI in Adobe Premiere Pro slashes post-production assembly time by up to 70% and powers high-margin editorial workflows.",
        is_published: true,
        is_featured: true,
        status: 'published',
        published_at: new Date().toISOString()
    };

    // Check if post already exists
    const { data: existing } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', slug)
        .maybeSingle();

    let result;
    if (existing) {
        console.log('Updating existing post:', existing.id);
        result = await supabase
            .from('blog_posts')
            .update(postPayload)
            .eq('id', existing.id)
            .select();
    } else {
        console.log('Inserting new blog post...');
        result = await supabase
            .from('blog_posts')
            .insert([postPayload])
            .select();
    }

    if (result.error) {
        console.error('❌ Error saving blog post to Supabase:', result.error);
    } else {
        console.log('✅ Blog post successfully published to Supabase database!');
        console.log(JSON.stringify(result.data, null, 2));
    }
}

publishBlogPost();
