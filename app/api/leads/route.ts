import { createRouteClient } from "@/lib/supabase-server"
import { NextResponse } from "next/server"

export async function GET() {
    const supabase = createRouteClient()
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
    const supabase = createRouteClient()
    const body = await request.json()
    const { action, payload } = body

    if (action === 'sync_url') {
        try {
            const response = await fetch(payload.url)
            const text = await response.text()

            // Parser for the specific Google Sheet format shown:
            // Expected Headers: Name, Status, Course, Mode, Location, Enquiry Time
            // Note: CSV export might include empty start columns if Column A is empty.

            const rows = text.split('\n').map(r => r.trim()).filter(r => r.length > 0)

            // Find the header row (contains "Name" and "Course")
            let headerIndex = rows.findIndex(r => r.toLowerCase().includes('name') && r.toLowerCase().includes('course'))
            if (headerIndex === -1) headerIndex = 0 // Fallback

            // Standardize headers: remove quotes, lowercase
            const headers = rows[headerIndex].split(',').map(h => h.replace(/^["']|["']$/g, '').trim().toLowerCase())

            const leads = rows.slice(headerIndex + 1).map(row => {
                // Handle split properly (ignoring commas inside quotes would be better, but simple split for now)
                const values = row.split(',').map(v => v.replace(/^["']|["']$/g, '').trim())

                const lead: any = { source: 'urbanpro_sheet', status: 'open' }

                headers.forEach((h, i) => {
                    const val = values[i] || ''
                    if (!val) return

                    if (h === 'name') lead.name = val
                    else if (h === 'status') {
                        // Map "New" to "open" logic
                        if (val.toLowerCase() === 'new') lead.status = 'open'
                        else if (val.toLowerCase().includes('contact')) lead.status = 'contacted'
                        else lead.status = 'open'
                    }
                    else if (h === 'course') lead.course = val
                    else if (h === 'mode') lead.mode = val
                    else if (h === 'location') lead.location = val
                })

                // Optional: Cleanup
                if (!lead.course) lead.course = "General Inquiry"

                return lead
            })

            // Filter out empty rows/invalid leads
            const validLeads = leads.filter(l => l.name && l.name.length > 1)

            // Use insert, not upsert, as we don't have unique IDs from the sheet
            const { error: insertError } = await supabase.from('leads').insert(validLeads)

            if (insertError) throw insertError

            return NextResponse.json({ success: true, count: validLeads.length })

        } catch (e: any) {
            console.error("Sync error:", e)
            return NextResponse.json({ error: e.message }, { status: 500 })
        }
    }

    if (action === 'manual_import') {
        // payload.data is array of objects
        const { error } = await supabase.from('leads').insert(payload.data)
        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
}
