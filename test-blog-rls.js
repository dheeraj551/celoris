const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

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

async function testBlogQuery() {
    console.log('Testing blog query with exact conditions from API...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl, supabaseKey);

    const slug = 'sobhita-dhulipala-serves-fierce-secret-agent-vibes-in-stunning-new-photos-fans-are-obsessed-159263/';

    try {
        console.log('Testing with slug:', slug);

        const { data, error } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', slug)
            .eq('is_published', true)
            .eq('status', 'published')
            .limit(1)
            .maybeSingle();

        console.log('Data:', data);
        console.log('Error:', error);

        if (!data && !error) {
            console.log('\n⚠️ Query returned null - this suggests RLS policy is blocking access');
            console.log('Trying without RLS filters...');

            const { data: data2, error: error2 } = await supabase
                .from('blog_posts')
                .select('*')
                .eq('slug', slug)
                .limit(1)
                .maybeSingle();

            console.log('Without filters - Data:', data2);
            console.log('Without filters - Error:', error2);
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

testBlogQuery();
