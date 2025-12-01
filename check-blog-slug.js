const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Manually parse .env.local
function loadEnv() {
    try {
        const envPath = path.resolve(__dirname, '.env.local');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            envConfig.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    const key = match[1].trim();
                    const value = match[2].trim().replace(/^["']|["']$/g, '');
                    process.env[key] = value;
                }
            });
        }
    } catch (e) {
        console.error('Error loading .env.local:', e);
    }
}

loadEnv();

async function checkBlogPost() {
    console.log('Checking blog post with slug containing "sobhita-dhulipala"...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase environment variables');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Search for blog posts with similar slug
        const { data, error } = await supabase
            .from('blog_posts')
            .select('id, title, slug')
            .ilike('slug', '%sobhita-dhulipala%')
            .limit(5);

        if (error) {
            console.error('❌ Error fetching blog posts:', error);
        } else {
            console.log('✅ Found blog posts:');
            console.log(JSON.stringify(data, null, 2));

            if (data && data.length > 0) {
                console.log('\nExpected URL slug:', data[0].slug);
                console.log('Actual URL slug:', 'sobhita-dhulipala-serves-fierce-secret-agent-vibes-in-stunning-new-photos-fans-are-obsessed-159263');
            }
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

checkBlogPost();
