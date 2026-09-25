import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { createServerClient } from '@/lib/supabase-server'

// Server-side SEO for /learn/course/[id].
//
// The page itself is a client component, so before this layout every course
// page was sent to Google with the homepage's title and description, no
// canonical tag, and course structured data that only appeared after
// JavaScript ran. This layout sends the real course title/description,
// a canonical URL, share (Open Graph) tags and Course JSON-LD in the HTML.
// It also permanently redirects old UUID links to each course's clean URL on
// the server (the page used to do that only in the browser).

const SITE = 'https://www.celorisdesigns.com'

// Clean URL slugs used by the flagship course pages.
const SLUG_TO_ID: Record<string, string> = {
  'digital-marketing-mastery': 'e7698318-7f57-421f-866e-0101ee239c01',
  'web-development-bootcamp': '48713643-694c-491f-86d6-5b6e713c1cf3',
  'ai-web-development': '879e499f-5517-413a-bd6a-76e2911b8331',
  'master-copilot-excel': 'f00459e9-20a0-4866-ba05-79aa574f7dff',
  'master-youtube-shorts-instagram-reels': 'f5badaa4-3ca2-4c70-96c3-a1ed97ee9ead',
}

// Old UUID links → their clean/premium URL (same list the page used).
const ID_REDIRECTS: Record<string, string> = {
  '1ca8cbea-1c9d-470d-ac69-f37882c31963': '/courses/build-real-time-ai-agents-with-livekit',
  '67bdf362-5e1c-49dd-9794-9c430ca351cb': '/courses/agentic-ai-for-beginners',
  ...Object.fromEntries(Object.entries(SLUG_TO_ID).map(([slug, id]) => [id, `/learn/course/${slug}`])),
}

type Params = Promise<{ id: string }>

async function loadCourse(idOrSlug: string) {
  const id = SLUG_TO_ID[idOrSlug] || idOrSlug
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) return null
  try {
    const supabase: any = await createServerClient()
    const { data } = await supabase
      .from('courses')
      .select('id, title, description, subject, category, grade_level, difficulty_level, course_image_url, price, course_duration, duration, instructor_name, learning_outcomes, is_published')
      .eq('id', id)
      .maybeSingle()
    return data && data.is_published !== false ? data : null
  } catch {
    return null
  }
}

function plain(text: string | null | undefined, max: number) {
  const s = String(text || '').replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  const cut = s.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : cut.length)}…`
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const course = await loadCourse(id)
  if (!course) return { title: 'Course not found', robots: { index: false, follow: true } }

  const path = `/learn/course/${id}`
  const description = plain(course.description, 158) || `Learn ${course.title} with Celoris Academy.`
  const image = course.course_image_url && /^https?:\/\//i.test(course.course_image_url) ? course.course_image_url : undefined

  return {
    title: course.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      url: `${SITE}${path}`,
      title: course.title,
      description,
      siteName: 'Celoris',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: course.title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  }
}

export default async function CourseLayout({ children, params }: { children: React.ReactNode; params: Params }) {
  const { id } = await params
  if (ID_REDIRECTS[id]) permanentRedirect(ID_REDIRECTS[id])

  const course = await loadCourse(id)
  const url = `${SITE}/learn/course/${id}`
  const price = course && course.price !== null && course.price !== undefined ? Number(course.price) : 0

  const jsonLd = course
    ? {
        '@context': 'https://schema.org',
        '@type': 'Course',
        '@id': `${url}#course`,
        name: course.title,
        description: plain(course.description, 500),
        url,
        ...(course.course_image_url && /^https?:\/\//i.test(course.course_image_url) ? { image: course.course_image_url } : {}),
        inLanguage: 'en-IN',
        ...(course.grade_level || course.difficulty_level ? { educationalLevel: course.difficulty_level || course.grade_level } : {}),
        ...(Array.isArray(course.learning_outcomes) && course.learning_outcomes.length
          ? { teaches: course.learning_outcomes.slice(0, 10) }
          : {}),
        provider: {
          '@type': 'Organization',
          '@id': `${SITE}/#organization`,
          name: 'Celoris Designs',
          sameAs: SITE,
        },
        offers: {
          '@type': 'Offer',
          category: price > 0 ? 'Paid' : 'Free',
          price: String(price),
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
          url,
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'Online',
          ...(course.instructor_name ? { instructor: { '@type': 'Person', name: course.instructor_name } } : {}),
        },
      }
    : null

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          // JSON.stringify output; "<" escaped so course text can't close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
        />
      )}
      {children}
    </>
  )
}
