
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateVideoUrls() {
    console.log('Updating blog video URLs...');

    // Update 1: Agentic AI - set to specific video
    const { error: error1 } = await supabase
        .from('blog_posts')
        .update({ featured_image_url: 'https://youtu.be/41MSDF80_-I?si=FS-6VMgEhPe46UtL' })
        .ilike('title', '%Agentic AI%');

    if (error1) console.error('Error updating Agentic AI:', error1);
    else console.log('Updated Agentic AI video');

    // Update 2: Nano Bana Pro - set to a relevant tech video placeholder (Google Gemini announcement)
    const { error: error2 } = await supabase
        .from('blog_posts')
        .update({ featured_image_url: 'https://www.youtube.com/watch?v=jV1vkHv4zq8' })
        .ilike('title', '%Nano Bana Pro%');

    if (error2) console.error('Error updating Nano Bana Pro:', error2);
    else console.log('Updated Nano Bana Pro video');
}

updateVideoUrls();
