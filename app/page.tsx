import { DashboardShell } from "@/components/home-new/DashboardShell"
import { DashboardContent } from "@/components/home-new/DashboardContent"
import { createServerClient } from "@/lib/supabase-server"
export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const supabase = createServerClient()

  // Fetch courses on server
  const { data: dbCourses } = await supabase
    .from('courses')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(12);

  const testCourseTitles = ['my new ai course will be here', 'agentic ai for beginners: from prompts to action', 'mastering nano banana pro'];
  const filteredCourses = (dbCourses || []).filter(course =>
    !testCourseTitles.includes(course.title.toLowerCase())
  );

  return (
    <DashboardShell>
      <DashboardContent courses={filteredCourses} />
    </DashboardShell>
  )
}