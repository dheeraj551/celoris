
const fs = require('fs');
const path = require('path');

function checkEnv() {
    console.log('Checking .env.local for required keys...');
    try {
        const envPath = path.resolve(__dirname, '.env.local');
        if (fs.existsSync(envPath)) {
            const envConfig = fs.readFileSync(envPath, 'utf8');
            const keys = {};
            envConfig.split('\n').forEach(line => {
                const match = line.match(/^([^=]+)=(.*)$/);
                if (match) {
                    keys[match[1].trim()] = true;
                }
            });

            console.log('NEXT_PUBLIC_SUPABASE_URL:', keys['NEXT_PUBLIC_SUPABASE_URL'] ? 'Present' : 'MISSING');
            console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', keys['NEXT_PUBLIC_SUPABASE_ANON_KEY'] ? 'Present' : 'MISSING');
            console.log('SUPABASE_SERVICE_ROLE_KEY:', keys['SUPABASE_SERVICE_ROLE_KEY'] ? 'Present' : 'MISSING');

        } else {
            console.error('❌ .env.local file not found!');
        }
    } catch (e) {
        console.error('Error reading .env.local:', e);
    }
}

checkEnv();
