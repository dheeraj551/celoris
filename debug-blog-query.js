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

async function debugBlogPost() {
    console.log('Debugging blog post query...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Test 1: Get the post without any filters
        console.log('\n=== Test 1: Get post by slug (no filters) ===');
        const { data: test1, error: error1 } = await supabase
            .from('blog_posts')
            .select('id, slug, is_published, status')
            .ilike('slug', '%sobhita%')
            .limit(1)
            .maybeSingle();

        console.log('Result:', test1);
        console.log('Error:', error1);

        // Test 2: Get with exact slug match
        console.log('\n=== Test 2: Exact slug match with trailing slash ===');
        const { data: test2, error: error2 } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', 'sobhita-dhulipala-serves-fierce-secret-agent-vibes-in-stunning-new-photos-fans-are-obsessed-159263/')
            .limit(1)
            .maybeSingle();

        console.log('Result:', test2 ? 'FOUND' : 'null');
        console.log('Error:', error2);

        // Test 3: With published filters
        console.log('\n=== Test 3: With is_published and status filters ===');
        const { data: test3, error: error3 } = await supabase
            .from('blog_posts')
            .select('*')
            .eq('slug', 'sobhita-dhulipala-serves-fierce-secret-agent-vibes-in-stunning-new-photos-fans-are-obsessed-159263/')
            .eq('is_published', true)
            .eq('status', 'published')
            .limit(1)
            .maybeSingle();

        console.log('Result:', test3 ? 'FOUND - ' + test3.title : 'null');
        console.log('Error:', error3);

    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

debugBlogPost();
