const { createClient } = require('@supabase/supabase-js');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '.env.local') });

async function testAnonInsert() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    const supabase = createClient(url, key);

    const { data, error } = await supabase.from('blog_posts').insert({
        title: 'Test',
        slug: 'test-' + Date.now(),
        content: 'test',
        is_published: false
    });

    if (error) {
        console.log('Error with ANON_KEY:', error.message, error.code);
    } else {
        console.log('Success with ANON_KEY (RLS might be off!)');
    }
}

testAnonInsert();
