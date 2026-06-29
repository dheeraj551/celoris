const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function publishBlog() {
    console.log('Reading markdown file...');
    const content = fs.readFileSync(path.resolve(__dirname, 'microsoft-word-advanced-shortcut-keys-blog.md'), 'utf-8');

    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
    const supabaseServiceKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('❌ Missing Supabase environment variables');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const title = "Microsoft Word Advanced Shortcut Keys: The Complete Guide to Work Smarter in 2026";
    
    console.log('Publishing blog post to Supabase...');
    
    const { data, error } = await supabase
        .from('blog_posts')
        .insert([
            {
                title: title,
                slug: 'microsoft-word-advanced-shortcut-keys-guide-2026',
                excerpt: "Master 80+ Microsoft Word advanced shortcut keys for editing, formatting, navigation, tables, and more. Boost your productivity with this complete keyboard shortcut guide.",
                content: content,
                featured_image_url: '/blog-ms-word-shortcuts.jpg',
                author_name: 'Celoris Team',
                category: 'Microsoft Office Tips',
                tags: ['Microsoft Word shortcut keys', 'MS Word keyboard shortcuts', 'Word advanced shortcuts', 'Microsoft Word tips', 'Word productivity shortcuts'],
                meta_title: "Microsoft Word Advanced Shortcut Keys: 2026 Guide",
                meta_description: "Master 80+ Microsoft Word advanced shortcut keys for editing, formatting, navigation, tables, and more. Boost your productivity with this complete keyboard shortcut guide.",
                is_published: true,
                is_featured: false,
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

publishBlog();
