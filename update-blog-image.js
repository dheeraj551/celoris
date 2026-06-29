const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function updateBlogImage() {
    const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim();
    const supabaseServiceKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim();

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('❌ Missing Supabase environment variables');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    console.log('Updating blog image...');
    const newImageUrl = '/Microsoft Word Advanced Shortcut Keys The Complete Guide to Work Smarter in 2026.png';
    
    const { data, error } = await supabase
        .from('blog_posts')
        .update({ featured_image_url: newImageUrl })
        .eq('slug', 'microsoft-word-advanced-shortcut-keys-guide-2026')
        .select();

    if (error) {
        console.error('❌ Error updating blog post:', error);
    } else {
        console.log('✅ Blog post updated successfully');
        console.log(JSON.stringify(data, null, 2));
    }
}

updateBlogImage();
