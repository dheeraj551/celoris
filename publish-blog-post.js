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

async function publishBlogPost() {
    console.log('Publishing blog post...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        console.error('❌ Missing Supabase environment variables');
        console.log('URL:', supabaseUrl ? 'Present' : 'Missing');
        console.log('Service Key:', supabaseServiceKey ? 'Present' : 'Missing');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        const { data, error } = await supabase
            .from('blog_posts')
            .update({
                is_published: true,
                status: 'published',
                published_at: new Date().toISOString()
            })
            .eq('id', '1cacf1f9-0001-44e3-93cd-0880524c32ed')
            .select();

        if (error) {
            console.error('❌ Error updating blog post:', error);
        } else {
            console.log('✅ Blog post published successfully');
            console.log(JSON.stringify(data, null, 2));
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

publishBlogPost();
