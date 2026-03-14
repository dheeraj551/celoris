// Vercel Environment Variables Verification Script
// Run this locally to verify your environment variables

console.log("🔍 Checking Environment Variables...\n");

// Check current environment variables
const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serverUrl = process.env.SUPABASE_URL;
const serverKey = process.env.SUPABASE_ANON_KEY;

console.log("📍 Public Variables (Browser/Client):");
console.log(`NEXT_PUBLIC_SUPABASE_URL: ${publicUrl ? '✅ Set' : '❌ Missing'}`);
if (publicUrl) console.log(`  Value: ${publicUrl}`);
console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${publicKey ? '✅ Set' : '❌ Missing'}`);
if (publicKey) console.log(`  Value: ${publicKey.substring(0, 50)}...`);

console.log("\n🖥️  Server Variables (API Routes):");
console.log(`SUPABASE_URL: ${serverUrl ? '✅ Set' : '❌ Missing - THIS WILL CAUSE DEPLOYMENT ERRORS'}`);
if (serverUrl) console.log(`  Value: ${serverUrl}`);
console.log(`SUPABASE_ANON_KEY: ${serverKey ? '✅ Set' : '❌ Missing - THIS WILL CAUSE DEPLOYMENT ERRORS'}`);
if (serverKey) console.log(`  Value: ${serverKey.substring(0, 50)}...`);

console.log("\n🔧 What to Add in Vercel:");
console.log("Name: SUPABASE_URL");
console.log(`Value: ${publicUrl}`);
console.log("\nName: SUPABASE_ANON_KEY");
console.log(`Value: ${publicKey}`);

// Test Supabase connection if variables are available
if (serverUrl && serverKey) {
    console.log("\n🧪 Testing Supabase Connection...");
    
    // This is just a simple URL validation
    const urlPattern = /^https:\/\/.+\.supabase\.co$/;
    
    if (urlPattern.test(serverUrl)) {
        console.log("✅ Supabase URL format looks correct");
    } else {
        console.log("❌ Supabase URL format is invalid");
    }
    
    if (serverKey.startsWith('eyJhbGciOiJIUzI1NiIs')) {
        console.log("✅ Supabase Anon Key format looks correct");
    } else {
        console.log("❌ Supabase Anon Key format is invalid");
    }
}

console.log("\n📋 Next Steps:");
if (!serverUrl || !serverKey) {
    console.log("1. Add SUPABASE_URL and SUPABASE_ANON_KEY to your Vercel environment variables");
    console.log("2. Use the same values as your NEXT_PUBLIC_* variables");
    console.log("3. Redeploy your application");
} else {
    console.log("✅ All required variables are set!");
    console.log("Your API routes should work correctly in deployment.");
}

console.log("\n🔍 To check your Vercel environment variables:");
console.log("1. Go to https://vercel.com/dashboard");
console.log("2. Select your celorisdesigns project");
console.log("3. Click Settings → Environment Variables");
console.log("4. Verify you have both SUPABASE_URL and SUPABASE_ANON_KEY set");
