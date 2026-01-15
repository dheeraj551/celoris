import AboutClient from "./AboutClient"
import { createServerClient } from "@/lib/supabase-server"

export default async function AboutPage() {
    const supabase = createServerClient()

    const { data: dbTestimonials } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_featured', true)
        .limit(3);

    return (
        <AboutClient initialTestimonials={dbTestimonials || []} />
    )
}
