import { notFound } from 'next/navigation'
import { loadCourseBatch, loadCoursePageData } from '@/lib/course-batch'
import CourseDetailClient from './CourseDetailClient'

// /learn/course/[id] — server part.
//
// The course (with its curriculum) and the live batch figures are loaded
// here on the server, so the whole page arrives as real HTML for Google and
// AI crawlers instead of a loading spinner. A missing or unpublished course
// now returns a proper 404 (it used to render an "Error" page with status
// 200, which search engines index as a soft 404). Old UUID links are
// redirected to the clean URL by ./layout.tsx.

export const dynamic = 'force-dynamic'

type Params = Promise<{ id: string }>

export default async function CourseDetailPage({ params }: { params: Params }) {
  const { id } = await params
  const course = await loadCoursePageData(id)
  if (!course) notFound()
  const batch = await loadCourseBatch(id)
  return <CourseDetailClient initialCourse={course} initialBatch={batch} courseKey={id} />
}
