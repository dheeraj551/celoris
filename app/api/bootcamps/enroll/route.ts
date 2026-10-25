import { NextRequest, NextResponse } from "next/server"
import { createRouteClient } from "@/lib/supabase-server"
import { createSupabaseClientForServer } from "@/lib/supabase-client"
import {
    APPLICATION_MAX_CHARS,
    APPLICATION_MIN_CHARS,
    APPLIED_STATUS,
    SELECTED_STATUSES,
    bootcampDates,
    currentBatchStart,
    formatBatchDate,
    freeSeatsFor,
    getBootcamp,
    nextBatchStart,
} from "@/lib/bootcamps"

// Free bootcamp applications. Free seats are given to selected applicants: a new
// sign-up is saved as "applied", and the team changes it to "selected" when they
// pick someone. The signed-in user comes from the session cookie (or a Bearer
// token); the batch date is always decided here, never by the browser.

export const dynamic = "force-dynamic"

async function getUser(request: NextRequest) {
    const supabase: any = await createRouteClient()
    const bearer = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1]
    const { data } = bearer ? await supabase.auth.getUser(bearer) : await supabase.auth.getUser()
    return data?.user || null
}

export async function GET(request: NextRequest) {
    try {
        const user = await getUser(request)
        if (!user) return NextResponse.json({ enrolled: false })
        const slug = request.nextUrl.searchParams.get("slug") || ""
        const bootcamp = getBootcamp(slug)
        if (!bootcamp) return NextResponse.json({ enrolled: false })

        const admin: any = createSupabaseClientForServer()
        const { data } = await admin
            .from("bootcamp_enrollments")
            .select("batch_start,status")
            .eq("user_id", user.id)
            .eq("bootcamp", slug)
            .gte("batch_start", currentBatchStart(new Date(), bootcamp))
            .order("batch_start", { ascending: true })
            .limit(1)
        const row = (data || [])[0]
        return NextResponse.json(
            row
                ? {
                      enrolled: true,
                      status: row.status,
                      selected: (SELECTED_STATUSES as readonly string[]).includes(row.status),
                      batchStart: row.batch_start,
                      batchLabel: formatBatchDate(bootcampDates(bootcamp, row.batch_start).first),
                  }
                : { enrolled: false },
            { headers: { "Cache-Control": "no-store" } }
        )
    } catch (e) {
        console.error("[bootcamps/enroll GET]", e)
        return NextResponse.json({ enrolled: false })
    }
}

export async function POST(request: NextRequest) {
    try {
        const user = await getUser(request)
        if (!user) return NextResponse.json({ error: "Please sign in first." }, { status: 401 })

        const body = await request.json().catch(() => ({}))
        const bootcamp = getBootcamp(String(body?.slug || ""))
        if (!bootcamp) return NextResponse.json({ error: "Unknown course." }, { status: 400 })

        const whatsapp = String(body?.whatsapp || "").replace(/\D/g, "").slice(-10)
        if (!/^[6-9]\d{9}$/.test(whatsapp)) {
            return NextResponse.json({ error: "Enter a valid 10-digit WhatsApp number." }, { status: 400 })
        }
        const consent = body?.consent === true
        const answer = String(body?.answer || "").replace(/\s+/g, " ").trim()
        if (answer.length < APPLICATION_MIN_CHARS) {
            return NextResponse.json({ error: "Tell us in one line what you will do with this skill (at least 20 characters)." }, { status: 400 })
        }

        const admin: any = createSupabaseClientForServer()

        // Anyone can apply while a batch still has free seats to give. Once every free
        // seat in a batch has been given to a selected applicant, the application goes
        // to the next batch. For the launch batch, offline (paid) students already took
        // part of the 10 seats.
        let batchStart = currentBatchStart(new Date(), bootcamp)
        for (let i = 0; i < 6; i++) {
            const { count } = await admin
                .from("bootcamp_enrollments")
                .select("id", { count: "exact", head: true })
                .eq("bootcamp", bootcamp.slug)
                .eq("batch_start", batchStart)
                .in("status", SELECTED_STATUSES as unknown as string[])
                .neq("user_id", user.id)
            if ((count ?? 0) < freeSeatsFor(bootcamp, batchStart)) break
            batchStart = nextBatchStart(batchStart)
        }

        const meta: any = user.user_metadata || {}
        const { error } = await admin.from("bootcamp_enrollments").upsert(
            {
                user_id: user.id,
                bootcamp: bootcamp.slug,
                batch_start: batchStart,
                full_name: String(meta.full_name || meta.name || "").slice(0, 120) || null,
                email: user.email || null,
                whatsapp,
                whatsapp_consent: consent,
                status: APPLIED_STATUS,
                application_answer: answer.slice(0, APPLICATION_MAX_CHARS),
            },
            { onConflict: "user_id,bootcamp,batch_start", ignoreDuplicates: true }
        )
        if (error) throw error

        return NextResponse.json({
            ok: true,
            status: APPLIED_STATUS,
            batchStart,
            batchLabel: formatBatchDate(bootcampDates(bootcamp, batchStart).first),
            movedToNextBatch: batchStart !== currentBatchStart(new Date(), bootcamp),
        })
    } catch (e) {
        console.error("[bootcamps/enroll POST]", e)
        return NextResponse.json({ error: "Could not join right now. Please try again." }, { status: 500 })
    }
}
