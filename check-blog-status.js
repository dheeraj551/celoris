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

async function checkBlogPostStatus() {
    console.log('Checking blog post status in database...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase environment variables');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        // Get all blog posts with sobhita in slug, regardless of status
        const { data, error } = await supabase
            .from('blog_posts')
            .select('id, title, slug, is_published, status')
            .ilike('slug', '%sobhita%');

        if (error) {
            console.error('❌ Error:', error);
        } else {
            console.log('✅ Found blog posts:');
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

checkBlogPostStatus();
