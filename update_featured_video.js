const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
    console.log('Fetching videos from featured_videos table...');
    const { data: videos, error: fetchError } = await supabase
        .from('featured_videos')
        .select('*')
        .order('created_at', { ascending: false });

    if (fetchError) {
        console.error('Fetch error:', fetchError);
        return;
    }

    if (!videos || videos.length === 0) {
        console.log('No videos found. Creating the new video as the first video...');
        const { error: insertError } = await supabase
            .from('featured_videos')
            .insert({
                title: 'LangChain in Action: Real Workflows Mastery',
                youtube_url: 'https://youtu.be/-Z1P-ebnfwQ?si=mRvMISpa-StuBSqd',
                thumbnail_url: 'https://img.youtube.com/vi/-Z1P-ebnfwQ/maxresdefault.jpg',
                category: 'Tutorial',
                author: 'Celoris Team',
                duration: '12:00',
                is_active: true
            });

        if (insertError) console.error('Insert error:', insertError);
        else console.log('Successfully created the video.');
        return;
    }

    // Try to find the Excel video first specifically
    const targetVideo = videos.find(v => v.title.toUpperCase().includes('EXCEL')) || videos[0];

    console.log('Updating video:', targetVideo.title);
    const { error: updateError } = await supabase
        .from('featured_videos')
        .update({
            title: 'LangChain in Action: Real Workflows Mastery',
            youtube_url: 'https://youtu.be/-Z1P-ebnfwQ?si=mRvMISpa-StuBSqd',
            thumbnail_url: 'https://img.youtube.com/vi/-Z1P-ebnfwQ/maxresdefault.jpg',
            category: 'Tutorial'
        })
        .eq('id', targetVideo.id);

    if (updateError) {
        console.error('Update error:', updateError);
    } else {
        console.log('Successfully updated the video.');
    }
}

run();
