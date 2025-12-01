
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
                    const value = match[2].trim().replace(/^["']|["']$/g, ''); // Remove quotes
                    process.env[key] = value;
                }
            });
        }
    } catch (e) {
        console.error('Error loading .env.local:', e);
    }
}

loadEnv();

async function verifyNoticeBoardData() {
    console.log('Verifying Notice Board Data in Supabase...');

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Missing Supabase environment variables');
        console.log('URL:', supabaseUrl);
        console.log('Key:', supabaseKey ? 'Found' : 'Missing');
        return;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    try {
        const { data, error, count } = await supabase
            .from('notice_board')
            .select('*', { count: 'exact' })
            .eq('is_active', true)
            .limit(5);

        if (error) {
            console.error('❌ Error fetching data:', error);
        } else {
            console.log('✅ Data fetch successful');
            console.log(`Found ${count} active notices.`);
            console.log('Sample data:', data);

            if (data.length > 0) {
                console.log('✅ Verification PASSED: Data exists in the table.');
            } else {
                console.warn('⚠️ Verification WARNING: Table is empty or no active notices found.');
            }
        }
    } catch (err) {
        console.error('❌ Unexpected error:', err);
    }
}

verifyNoticeBoardData();
