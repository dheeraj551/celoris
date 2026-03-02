import AboutClient from "./AboutClient"
import { createServerClient } from "@/lib/supabase-server"

export const dynamic = 'force-dynamic'

export default async function AboutPage() {
    const supabase = await createServerClient()

    const { data: dbTestimonials } = await supabase
        .from('testimonials')
        .select('*')
        .contains('target_pages', ['about'])
        .eq('is_visible', true)
        .order('created_at', { ascending: false })
        .limit(3);

    return (
        <AboutClient initialTestimonials={dbTestimonials || []} />
    )
}
