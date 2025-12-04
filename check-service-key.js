const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY;
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

console.log('Checking Supabase Configuration...');
console.log('URL:', url ? 'Present' : 'Missing');
console.log('Service Role Key:', serviceKey ? 'Present' : 'Missing');

if (serviceKey) {
    console.log('Service Role Key Length:', serviceKey.length);
    console.log('Service Role Key Start:', serviceKey.substring(0, 10) + '...');
} else {
    console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is missing!');
}

if (!url) {
    console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL is missing!');
}
