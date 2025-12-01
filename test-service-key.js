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

async function testBlogWithServiceKey() {
    console.log('Testing blog query with SERVICE ROLE KEY...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
        console.error('❌ Missing Supabase environment variables');
        console.log('URL:', supabaseUrl ? 'Present' : 'Missing');
        console.log('Service Key:', serviceKey ? 'Present' : 'Missing');
        return;
    }

    const supabase = createClient(supabaseUrl, serviceKey);

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

        console.log('Data:', data ? 'FOUND - ' + data.title : 'null');
        console.log('Error:', error);

        if (data) {
            console.log('\n✅ SUCCESS! Blog post found with service key');
            console.log('This confirms RLS is blocking anon key access');
        } else {
            console.log('\n⚠️ Even service key returns null - check if post is actually published');
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

testBlogWithServiceKey();
