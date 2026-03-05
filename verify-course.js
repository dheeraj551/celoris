const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

async function verifyCourse() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await supabase
        .from('courses')
        .select('*')
        .eq('title', 'Python for AI Developers');

    if (error) {
        console.error('Error:', error);
    } else {
        console.log('Found courses:', data.length);
        if (data.length > 0) {
            console.log(JSON.stringify(data[0], null, 2));
        }
    }
}

verifyCourse();
