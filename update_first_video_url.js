const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Function to get env variables from .env.local
function getEnv() {
    const envPath = path.join(__dirname, '.env.local');
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');
    const env = {};
    lines.forEach(line => {
        const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
        if (match) {
            let value = match[2] || '';
            if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
            if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
            env[match[1]] = value;
        }
    });
    return env;
}

const env = getEnv();
const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL;
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key not found in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const newUrl = 'https://youtu.be/-Z1P-ebnfwQ?si=npaQ1bzJlLfnbt0k';

async function updateFirstVideo() {
    try {
        const { data: videos, error: fetchError } = await supabase
            .from('featured_videos')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(3);

        if (fetchError) throw fetchError;
        if (!videos || videos.length === 0) {
            console.log('No videos found in featured_videos table.');
            return;
        }

        const firstVideo = videos[0];
        console.log(`Found first video: "${firstVideo.title}" (ID: ${firstVideo.id})`);

        const { data: updatedVideo, error: updateError } = await supabase
            .from('featured_videos')
            .update({
                youtube_url: newUrl,
                updated_at: new Date().toISOString()
            })
            .eq('id', firstVideo.id)
            .select();

        if (updateError) throw updateError;

        console.log('Successfully updated the first video.');
        console.log('Updated Video:', updatedVideo);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

updateFirstVideo();
