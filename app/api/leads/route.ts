import { createRouteClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

// ---------- CSV parsing ----------

// Proper CSV row parser — handles quoted fields, commas inside quotes, and
// "" as an escaped quote. The old version just did `row.split(',')`, which
// breaks the moment any field (like an address or a note) contains a comma.
function parseCsvLine(line: string): string[] {
    const values: string[] = []
    let current = ''
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
        const char = line[i]

        if (inQuotes) {
            if (char === '"') {
                if (line[i + 1] === '"') {
                    current += '"'
                    i++
                } else {
                    inQuotes = false
                }
            } else {
                current += char
            }
        } else {
            if (char === '"') {
                inQuotes = true
            } else if (char === ',') {
                values.push(current.trim())
                current = ''
            } else {
                current += char
            }
        }
    }
    values.push(current.trim())
    return values
}

// Maps a spreadsheet column header to a leads-table field using substring
// matching rather than an exact-phrase dictionary — real sheets drift
// ("Course" becomes "Course Interest", "Phone" becomes "Contact Number",
// etc.) and an exact-match list silently drops anything it doesn't
// recognize instead of erroring, which is exactly what happened here:
// "Course Interest" didn't match the old "course interested" alias, so
// every course value got silently discarded. Order matters — more
// specific checks (phone/email/course) run before the generic "name"
// catch-all so "Course Name" maps to course, not name.
function mapHeaderToField(rawHeader: string): string | null {
    const h = normalizeHeader(rawHeader)
    if (h.includes('phone') || h.includes('mobile') || h.includes('whatsapp')) return 'phone'
    if (h.includes('email')) return 'email'
    if (h.includes('course')) return 'course'
    if (h.includes('mode')) return 'mode'
    if (h.includes('location') || h === 'city') return 'location'
    if (h.includes('status')) return 'status'
    if (h.includes('budget')) return 'budget'
    if (h.includes('requirement') || h.includes('message') || h.includes('note') || h.includes('quer') || h.includes('enquir') || h.includes('inquir')) return 'requirement'
    if (h.includes('contact')) return 'contact_info'
    if (h.includes('source')) return 'source'
    if (h.includes('name')) return 'name'
    return null
}

type ParsedLead = {
    name?: string
    phone?: string
    email?: string
    course?: string
    mode?: string
    location?: string
    requirement?: string
    contact_info?: string
    budget?: string
    status?: string
    source?: string
}

function normalizeHeader(h: string): string {
    return h.replace(/^["']|["']$/g, '').trim().toLowerCase()
}

function normalizeStatus(val: string): 'open' | 'contacted' | 'closed' {
    const v = val.toLowerCase()
    if (v.includes('contact')) return 'contacted'
    if (v.includes('close') || v.includes('won') || v.includes('lost')) return 'closed'
    return 'open'
}

// Parses raw CSV text into leads-table-shaped rows using whatever columns
// are present — forgiving of column order, missing columns, and extra
// columns (those are just ignored).
function parseLeadsCsv(text: string, defaultSource: string): ParsedLead[] {
    const rows = text.split('\n').map(r => r.trim()).filter(r => r.length > 0)
    if (rows.length === 0) return []

    // Find the header row (first row that looks like it has a "name" column).
    let headerIndex = rows.findIndex(r => r.toLowerCase().includes('name'))
    if (headerIndex === -1) headerIndex = 0

    const rawHeaders = parseCsvLine(rows[headerIndex])
    const fields = rawHeaders.map(mapHeaderToField)

    return rows.slice(headerIndex + 1).map(row => {
        const values = parseCsvLine(row)
        const lead: ParsedLead = {}

        fields.forEach((field, i) => {
            if (!field) return
            const val = (values[i] || '').trim()
            if (!val) return
            if (field === 'status') lead.status = normalizeStatus(val)
            else (lead as any)[field] = val
        })

        if (!lead.status) lead.status = 'open'
        if (!lead.source) lead.source = defaultSource
        if (!lead.course) lead.course = 'General Inquiry'

        return lead
    }).filter(l => (l.name && l.name.length > 1) || l.phone || l.email)
}

// ---------- Matched upsert (this is the actual fix) ----------

// Strips everything but digits and keeps the last 10, so "+91 98765 43210",
// "9876543210" and "98765-43210" all match as the same phone number.
function normalizePhone(phone: string): string {
    const digits = phone.replace(/\D/g, '')
    return digits.slice(-10)
}

function normalizeEmail(email: string): string {
    return email.trim().toLowerCase()
}

// Fallback match key for sources with no phone/email at all (like the
// urbanpro_sheet feed) — without this, a lead with neither field can never
// be matched on re-sync and gets duplicated every single time.
function nameLocationKey(name?: string, location?: string): string {
    return `${(name || '').trim().toLowerCase()}|${(location || '').trim().toLowerCase()}`
}

async function upsertLeads(supabase: any, leads: ParsedLead[]) {
    if (leads.length === 0) {
        return { inserted: 0, updated: 0, skipped: 0 }
    }

    const { data: existing, error: fetchError } = await supabase
        .from('leads')
        .select('id, name, phone, email, location')

    if (fetchError) throw fetchError

    const byPhone = new Map<string, string>()
    const byEmail = new Map<string, string>()
    const byNameLocation = new Map<string, string>()
    for (const row of existing || []) {
        if (row.phone) byPhone.set(normalizePhone(row.phone), row.id)
        if (row.email) byEmail.set(normalizeEmail(row.email), row.id)
        // Only usable as a fallback key when the row has no phone/email —
        // otherwise two different people who share a name and city could
        // wrongly collide.
        if (!row.phone && !row.email && row.name) {
            byNameLocation.set(nameLocationKey(row.name, row.location), row.id)
        }
    }

    const toInsert: ParsedLead[] = []
    let updated = 0
    let skipped = 0

    for (const lead of leads) {
        const phoneKey = lead.phone ? normalizePhone(lead.phone) : ''
        const emailKey = lead.email ? normalizeEmail(lead.email) : ''
        // Only fall back to name+location when this row has no phone/email
        // of its own — same reasoning as when we built the map.
        const nlKey = (!phoneKey && !emailKey && lead.name) ? nameLocationKey(lead.name, lead.location) : ''

        const matchId =
            (phoneKey && byPhone.get(phoneKey)) ||
            (emailKey && byEmail.get(emailKey)) ||
            (nlKey && byNameLocation.get(nlKey)) ||
            null

        if (!matchId) {
            if (!lead.name && !lead.phone && !lead.email) {
                skipped++
                continue
            }
            toInsert.push(lead)
            // Register the new lead's keys too, so duplicate rows further
            // down in the SAME csv match each other instead of also
            // getting inserted as separate rows.
            if (phoneKey) byPhone.set(phoneKey, 'pending')
            if (emailKey) byEmail.set(emailKey, 'pending')
            if (nlKey) byNameLocation.set(nlKey, 'pending')
            continue
        }

        if (matchId === 'pending') {
            // Already queued for insert earlier in this same import — merge
            // into that pending row instead of creating a second duplicate.
            const pending = toInsert[toInsert.length - 1]
            Object.assign(pending, lead, { name: lead.name || pending.name })
            continue
        }

        const { error: updateError } = await supabase
            .from('leads')
            .update(lead)
            .eq('id', matchId)

        if (updateError) throw updateError
        updated++
    }

    if (toInsert.length > 0) {
        const { error: insertError } = await supabase.from('leads').insert(toInsert)
        if (insertError) throw insertError
    }

    return { inserted: toInsert.length, updated, skipped }
}

// ---------- Routes ----------

export async function GET() {
    const supabase = (await createRouteClient()) as any
    const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
}

export async function POST(request: Request) {
    const supabase = (await createRouteClient()) as any
    const body = await request.json()
    const { action, payload } = body

    if (action === 'sync_url') {
        try {
            const response = await fetch(payload.url)
            const text = await response.text()

            const leads = parseLeadsCsv(text, 'urbanpro_sheet')
            const result = await upsertLeads(supabase, leads)

            return NextResponse.json({ success: true, ...result, count: result.inserted })
        } catch (e: any) {
            console.error('Sync error:', e)
            return NextResponse.json({ error: e.message }, { status: 500 })
        }
    }

    if (action === 'csv_upload') {
        try {
            const leads = parseLeadsCsv(payload.csvText || '', 'csv_upload')
            const result = await upsertLeads(supabase, leads)

            return NextResponse.json({ success: true, ...result })
        } catch (e: any) {
            console.error('CSV upload error:', e)
            return NextResponse.json({ error: e.message }, { status: 500 })
        }
    }

    if (action === 'manual_import') {
        // payload.data is array of objects
        const { error } = await supabase.from('leads').insert(payload.data)
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}
