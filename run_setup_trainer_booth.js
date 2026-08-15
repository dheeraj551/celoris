require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function setup() {
    console.log("Setting up trainer booths...");
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
    const sql = fs.readFileSync('setup_trainer_booth.sql', 'utf8');

    // Run the SQL using rest API or we can just create the table manually if RPC exec_sql isn't there
    // Let's check if the query runs
    // Actually, supabase JS doesn't have a direct sql query runner unless pg is used.
    
    // Instead of raw sql, we will use postgres directly
    const { Client } = require('pg');
    const client = new Client({
        connectionString: process.env.DATABASE_URL
    });
    
    await client.connect();
    try {
        await client.query(sql);
        console.log("Setup completed successfully.");
    } catch(err) {
        console.error("Failed to run SQL: ", err);
    } finally {
        await client.end();
    }
}
setup();
