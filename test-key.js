const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function testConnection() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    console.log('URL:', url);
    console.log('Anon Key Start:', key ? key.substring(0, 10) : 'missing');
    console.log('Service Key Start:', serviceKey ? serviceKey.substring(0, 10) : 'missing');

    const supabase = createClient(url, serviceKey);

    const { data, error } = await supabase.from('blog_posts').select('id, title').limit(1);

    if (error) {
        console.error('❌ Error:', JSON.stringify(error, null, 2));
    } else {
        console.log('✅ Success! Found:', data.length, 'posts');
    }
}

testConnection().then(() => console.log('Done')).catch(err => console.error('Unhandled error:', err));
