import { DashboardShell } from "@/components/home-new/DashboardShell"
import { DashboardContent } from "@/components/home-new/DashboardContent"
import { createServerClient } from "@/lib/supabase-server"

export default async function HomePage() {
  const supabase = createServerClient()

  // Fetch courses on server
  const { data: dbCourses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(12);

  return (
    <DashboardShell>
      <DashboardContent courses={dbCourses || []} />
    </DashboardShell>
  )
}