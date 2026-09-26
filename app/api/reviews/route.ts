import { NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import {
  REVIEW_MAX_CHARS,
  REVIEW_MIN_CHARS,
  REVIEW_REASON_LABEL,
  isValidCourseKey,
  type PublicReview,
  type ReviewVerifiedReason,
} from '@/lib/course-reviews'
import { cleanReviewText, reviewEligibility, reviewerDisplayName } from '@/lib/course-reviews-server'

// Verified course reviews.
//   GET  ?course=<key>  → approved reviews + summary, and (when signed in)
//                         whether you can review and your own review
//   POST { courseKey, courseTitle, rating, text } → write / edit your review
//                         (goes back to "waiting for approval" when edited)
// Only approved reviews are ever shown to the public; reviewer emails and
// user ids never leave the server.

export const dynamic = 'force-dynamic'

const MAX_REVIEWS_PER_DAY = 5

async function currentUser() {
  try {
    const client = await createRouteClient()
    const {
      data: { user },
    } = await client.auth.getUser()
    return user
  } catch {
    return null
  }
}

export async function GET(request: Request) {
  try {
    const course = new URL(request.url).searchParams.get('course')
    if (!isValidCourseKey(course)) return NextResponse.json({ error: 'Unknown course' }, { status: 400 })

    const admin: any = createSupabaseClientForServer()
    const { data: rows } = await admin
      .from('course_reviews')
      .select('id, reviewer_name, rating, review_text, verified_reason, created_at')
      .eq('course_key', course)
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .limit(100)

    const reviews: PublicReview[] = ((rows || []) as any[]).map((r) => ({
      id: r.id,
      name: r.reviewer_name,
      rating: r.rating,
      text: r.review_text,
      createdAt: r.created_at,
      verifiedLabel: REVIEW_REASON_LABEL[r.verified_reason as ReviewVerifiedReason] || 'Celoris student',
    }))
    const sum = reviews.reduce((a, r) => a + r.rating, 0)
    const summary = { count: reviews.length, average: reviews.length ? Math.round((sum / reviews.length) * 10) / 10 : null }

    let me: any = { signedIn: false }
    const user = await currentUser()
    if (user) {
      const [reason, { data: mine }] = await Promise.all([
        reviewEligibility(admin, user.id),
        admin
          .from('course_reviews')
          .select('rating, review_text, status, admin_note, updated_at')
          .eq('course_key', course)
          .eq('user_id', user.id)
          .maybeSingle(),
      ])
      me = {
        signedIn: true,
        eligible: !!reason,
        myReview: mine
          ? { rating: mine.rating, text: mine.review_text, status: mine.status, note: mine.status === 'rejected' ? mine.admin_note || null : null }
          : null,
      }
    }

    return NextResponse.json({ reviews, summary, me })
  } catch (err) {
    console.error('[reviews] GET error:', err)
    return NextResponse.json({ error: 'Could not load reviews.' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ error: 'Please sign in to write a review.' }, { status: 401 })

    const body = await request.json().catch(() => ({}))
    const courseKey = body?.courseKey
    if (!isValidCourseKey(courseKey)) return NextResponse.json({ error: 'Unknown course.' }, { status: 400 })
    const courseTitle = typeof body?.courseTitle === 'string' ? body.courseTitle.slice(0, 160) : null
    const rating = Math.round(Number(body?.rating))
    if (!(rating >= 1 && rating <= 5)) return NextResponse.json({ error: 'Please choose 1 to 5 stars.' }, { status: 400 })
    const text = cleanReviewText(typeof body?.text === 'string' ? body.text : '')
    if (text.length < REVIEW_MIN_CHARS) {
      return NextResponse.json({ error: `Please write at least ${REVIEW_MIN_CHARS} characters about your experience.` }, { status: 400 })
    }
    if (text.length > REVIEW_MAX_CHARS) {
      return NextResponse.json({ error: `Please keep it under ${REVIEW_MAX_CHARS} characters.` }, { status: 400 })
    }

    const admin: any = createSupabaseClientForServer()
    const reason = await reviewEligibility(admin, user.id)
    if (!reason) {
      return NextResponse.json(
        { error: 'Reviews are open to Celoris students. Join a live class (free) and you can review right after.' },
        { status: 403 }
      )
    }

    // A few reviews a day at most.
    const since = new Date(Date.now() - 86_400_000).toISOString()
    const { count } = await admin
      .from('course_reviews')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('updated_at', since)
    if ((count || 0) >= MAX_REVIEWS_PER_DAY) {
      return NextResponse.json({ error: 'You have written a lot of reviews today. Please try again tomorrow.' }, { status: 429 })
    }

    const name = await reviewerDisplayName(admin, user.id, user.email)
    const now = new Date().toISOString()
    const { error } = await admin.from('course_reviews').upsert(
      {
        course_key: courseKey,
        course_title: courseTitle,
        user_id: user.id,
        reviewer_name: name,
        rating,
        review_text: text,
        status: 'pending',
        verified_reason: reason,
        admin_note: null,
        updated_at: now,
        reviewed_at: null,
        reviewed_by: null,
      },
      { onConflict: 'course_key,user_id' }
    )
    if (error) throw error

    return NextResponse.json({ ok: true, status: 'pending' })
  } catch (err) {
    console.error('[reviews] POST error:', err)
    return NextResponse.json({ error: 'Could not save your review. Please try again.' }, { status: 500 })
  }
}
