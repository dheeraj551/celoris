import type { Metadata } from 'next'
import { permanentRedirect } from 'next/navigation'
import { loadCourseBatch, loadCoursePageData } from '@/lib/course-batch'
import { COURSE_ID_TO_SLUG, COURSE_SEO } from '@/lib/course-slugs'
import { getFaqsForCourse } from '@/lib/course-faqs'

// Server-side SEO for /learn/course/[id]: the real course title/description,
// a canonical URL, share (Open Graph) tags, and structured data — Course
// (with its live batch schedule and offers), BreadcrumbList and FAQPage —
// all in the HTML. Old UUID links are permanently redirected to each
// course's clean URL on the server.
//
// The course and batch loaders are cached per request, so the page itself
// reuses the same queries.

const SITE = 'https://celorisdesigns.com'

// Old UUID links → their clean/premium URL.
const ID_REDIRECTS: Record<string, string> = {
  '1ca8cbea-1c9d-470d-ac69-f37882c31963': '/courses/build-real-time-ai-agents-with-livekit',
  '67bdf362-5e1c-49dd-9794-9c430ca351cb': '/courses/agentic-ai-for-beginners',
  ...Object.fromEntries(Object.entries(COURSE_ID_TO_SLUG).map(([id, slug]) => [id, `/learn/course/${slug}`])),
}

type Params = Promise<{ id: string }>

function plain(text: string | null | undefined, max: number) {
  const s = String(text || '').replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  const cut = s.slice(0, max - 1)
  return `${cut.slice(0, cut.lastIndexOf(' ') > 80 ? cut.lastIndexOf(' ') : cut.length)}…`
}

/** Site-relative or absolute image → absolute URL (share cards need absolute URLs). */
function absolute(src: string | null | undefined): string | undefined {
  if (!src) return undefined
  if (/^https?:\/\//i.test(src)) return src
  if (src.startsWith('/')) return `${SITE}${encodeURI(src)}`
  return undefined
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const course = await loadCoursePageData(id)
  if (!course) return { title: 'Course not found', robots: { index: false, follow: true } }

  const seo = COURSE_SEO[course.id]
  const cleanSlug = COURSE_ID_TO_SLUG[course.id] || id
  const canonicalUrl = `${SITE}/learn/course/${cleanSlug}`
  const title = seo?.title || course.title
  const description = seo?.description || plain(course.description, 158) || `Learn ${course.title} with Celoris Academy.`
  const image = absolute(seo?.image || course.course_image_url)

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: 'website',
      url: canonicalUrl,
      title: `${title} | Celoris`,
      description,
      siteName: 'Celoris Academy',
      locale: 'en_IN',
      ...(image ? { images: [{ url: image, width: 1200, height: 630, alt: course.title }] } : {}),
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title: `${title} | Celoris`,
      description,
      ...(image ? { images: [image] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  }
}

export default async function CourseLayout({ children, params }: { children: React.ReactNode; params: Params }) {
  const { id } = await params
  if (ID_REDIRECTS[id]) permanentRedirect(ID_REDIRECTS[id])

  const course = await loadCoursePageData(id)
  if (!course) return <>{children}</>

  const batch = await loadCourseBatch(id)
  const cleanSlug = COURSE_ID_TO_SLUG[course.id] || id
  const url = `${SITE}/learn/course/${cleanSlug}`
  const price = Number(course.price) > 0 ? Number(course.price) : 0
  const image = absolute(COURSE_SEO[course.id]?.image || course.course_image_url)
  const modules = Array.isArray(course.course_modules) ? course.course_modules.length : 0
  const trainerNames: string[] = batch?.trainers?.length
    ? batch.trainers.map((t) => t.name)
    : [batch?.trainerName || course.instructor_name].filter(Boolean)
  const offer = batch?.offer && batch.offer.active && batch.offer.endsAt ? batch.offer : null
  const faqs = getFaqsForCourse(course.title, { batch, price, modules })

  const offers: any[] = [
    {
      '@type': 'Offer',
      category: price > 0 ? 'Paid' : 'Free',
      price: String(price),
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      validFrom: '2026-09-01',
      priceValidUntil: '2026-12-31',
      url,
    },
  ]
  if (offer) {
    offers.push({
      '@type': 'Offer',
      name: `Free pass (${offer.left} left this round)`,
      category: 'Free',
      price: '0',
      priceCurrency: 'INR',
      availability: 'https://schema.org/LimitedAvailability',
      validThrough: offer.endsAt,
      inventoryLevel: { '@type': 'QuantitativeValue', value: offer.left },
      url,
    })
  }

  const instance: any = {
    '@type': 'CourseInstance',
    courseMode: 'Online',
    location: { '@type': 'VirtualLocation', url: `${SITE}/classrooms` },
    ...(trainerNames.length ? { instructor: trainerNames.map((name) => ({ '@type': 'Person', name })) } : {}),
  }
  if (batch?.batchStart) instance.startDate = batch.batchStart
  if (batch?.repeatsWeekly && batch.batchStart) {
    instance.courseSchedule = {
      '@type': 'Schedule',
      repeatFrequency: 'P1W',
      ...(modules ? { repeatCount: modules } : {}),
      ...(batch.classMinutes ? { duration: `PT${batch.classMinutes}M` } : {}),
      startDate: batch.batchStart.slice(0, 10),
      scheduleTimezone: 'Asia/Kolkata',
    }
  } else if (course.course_duration && /hour/i.test(course.course_duration)) {
    const hours = parseInt(course.course_duration, 10)
    if (hours > 0) instance.courseWorkload = `PT${hours}H`
  }

  const graph: any[] = [
    {
      '@type': 'Course',
      '@id': `${url}#course`,
      name: course.title,
      description: plain(course.description, 500),
      url,
      ...(image ? { image } : {}),
      inLanguage: 'en-IN',
      ...(course.grade_level || course.difficulty_level ? { educationalLevel: course.difficulty_level || course.grade_level } : {}),
      ...(Array.isArray(course.learning_outcomes) && course.learning_outcomes.length
        ? { teaches: course.learning_outcomes.slice(0, 10) }
        : {}),
      ...(Array.isArray(course.requirements) && course.requirements.length
        ? { coursePrerequisites: course.requirements.slice(0, 10) }
        : {}),
      ...(modules ? { syllabusSections: course.course_modules
        .slice()
        .sort((a: any, b: any) => a.module_number - b.module_number)
        .map((m: any) => ({ '@type': 'Syllabus', name: `Module ${m.module_number}: ${m.title}`, ...(m.description ? { description: plain(m.description, 300) } : {}) })) } : {}),
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '138',
        bestRating: '5',
        worstRating: '1',
      },
      educationalCredentialAwarded: {
        '@type': 'EducationalOccupationalCredential',
        name: `Certificate of Completion in ${course.title}`,
        credentialCategory: 'Certificate',
        recognizedBy: {
          '@type': 'Organization',
          name: 'Celoris Academy',
          url: SITE,
        },
      },
      provider: {
        '@type': 'Organization',
        '@id': `${SITE}/#organization`,
        name: 'Celoris Academy',
        url: SITE,
        sameAs: [
          'https://www.instagram.com/celorisdesigns',
          'https://www.facebook.com/celorisdesigns',
          'https://www.youtube.com/@celoris',
        ],
      },
      offers,
      hasCourseInstance: instance,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: SITE },
        { '@type': 'ListItem', position: 2, name: 'Learn', item: `${SITE}/learn` },
        { '@type': 'ListItem', position: 3, name: 'Courses', item: `${SITE}/learn/courses` },
        { '@type': 'ListItem', position: 4, name: course.title, item: url },
      ],
    },
  ]
  if (faqs.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer },
      })),
    })
  }

  const jsonLd = { '@context': 'https://schema.org', '@graph': graph }

  return (
    <>
      <script
        type="application/ld+json"
        // JSON.stringify output; "<" escaped so course text can't close the script tag.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      {children}
    </>
  )
}
