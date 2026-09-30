import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { user_json_url } = body

    if (!user_json_url || typeof user_json_url !== 'string') {
      return NextResponse.json({ error: 'Missing or invalid user_json_url' }, { status: 400 })
    }

    // Security check: validate URL origin to avoid SSRF
    let parsedUrl: URL
    try {
      parsedUrl = new URL(user_json_url)
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 })
    }

    if (parsedUrl.protocol !== 'https:') {
      return NextResponse.json({ error: 'Only HTTPS URLs are allowed' }, { status: 400 })
    }

    const hostname = parsedUrl.hostname.toLowerCase()
    const allowed = hostname === 'phone.email' || hostname.endsWith('.phone.email')
    if (!allowed) {
      return NextResponse.json({ error: 'Untrusted verification provider' }, { status: 400 })
    }

    // Fetch the verified payload from Phone.email
    const res = await fetch(user_json_url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: 'Failed to retrieve verification details from provider' },
        { status: 502 }
      )
    }

    const data = await res.json()
    // Phone.email standard response structure:
    // {
    //   user_phone_number: "+919084718101",
    //   user_country_code: "+91",
    //   user_phone_number_without_country_code: "9084718101"
    // }

    const phone = (data?.user_phone_number || '').trim()
    const countryCode = (data?.user_country_code || '').trim()
    const phoneNational = (data?.user_phone_number_without_country_code || '').trim()
    const firstName = (data?.user_first_name || '').trim()
    const lastName = (data?.user_last_name || '').trim()

    if (!phone) {
      return NextResponse.json(
        { error: 'No phone number returned from verification provider' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      phone,
      countryCode,
      phoneNational,
      firstName,
      lastName,
    })
  } catch (error: any) {
    console.error('Error verifying phone email token:', error)
    return NextResponse.json(
      { error: error?.message || 'Internal verification error' },
      { status: 500 }
    )
  }
}
