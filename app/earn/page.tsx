import EarnClient from "./EarnClient"

async function getJobs() {
    try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) return []

        // Using fetch to match the existing API logic easily or direct supabase
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data } = await supabase
            .from('jobs')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(6);

        return data || [];
    } catch (error) {
        console.error('Error fetching jobs on server:', error);
        return [];
    }
}

export default async function EarnPage() {
    const initialJobs = await getJobs();

    return (
        <EarnClient initialJobs={initialJobs} />
    )
}
