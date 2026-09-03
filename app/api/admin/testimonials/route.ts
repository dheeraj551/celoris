// ===========================================
// TESTIMONIALS MANAGEMENT - API ROUTES
// ===========================================

import { NextRequest, NextResponse } from 'next/server';
import { createSupabaseClientForServer } from '@/lib/supabase-client';
import { createRouteClient } from '@/lib/supabase-server';

// These write straight to the DB with the service role key (which bypasses
// row level security), so this check is what actually keeps random visitors
// from editing/deleting testimonials — verify the caller is really the admin
// before doing anything destructive.
async function requireAdmin(): Promise<NextResponse | null> {
  try {
    const authClient = (await createRouteClient()) as any;
    const { data: { user } } = await authClient.auth.getUser();
    if (!user || user.email !== 'support@celorisdesigns.com') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }
    return null;
  } catch {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const supabase = (createSupabaseClientForServer() as any)
    const { searchParams } = new URL(request.url)

    const type = searchParams.get('type')
    const featured = searchParams.get('featured')
    const page = searchParams.get('page')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('testimonials')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('display_order', { ascending: true })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type && type !== 'all') {
      query = query.eq('testimonial_type', type)
    }

    if (featured !== null && featured !== undefined) {
      query = query.eq('is_featured', featured === 'true')
    }

    if (page) {
      query = query.contains('target_pages', [page])
    }

    const { data, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data,
      count: count || data?.length || 0
    })

  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const supabase = (createSupabaseClientForServer() as any)
    const body = await request.json()

    const {
      client_name,
      client_title,
      client_company,
      client_avatar_url,
      testimonial_text,
      rating = 5,
      testimonial_type = 'general',
      target_pages = ['homepage'],
      display_order = 0,
      is_featured = false,
      is_visible = true,
      client_location,
      client_website,
      project_details,
      client_industry,
      date_received,
      verification_status = 'pending'
    } = body

    // Validate required fields
    if (!client_name || !testimonial_text) {
      return NextResponse.json(
        { success: false, error: 'Client name and testimonial text are required' },
        { status: 400 }
      )
    }

    // Ensure target_pages is an array
    const processedTargetPages = Array.isArray(target_pages)
      ? target_pages
      : (typeof target_pages === 'string' ? target_pages.split(',').map(p => p.trim()).filter(p => p) : ['homepage'])

    console.log('Creating testimonial with data:', {
      client_name,
      testimonial_type,
      target_pages: processedTargetPages,
      is_visible
    })

    const { data, error } = await (supabase as any)
      .from('testimonials')
      .insert({
        client_name,
        client_title,
        client_company,
        client_avatar_url,
        testimonial_text,
        rating,
        testimonial_type,
        target_pages: processedTargetPages,
        display_order,
        is_featured,
        is_visible,
        client_location,
        client_website,
        project_details,
        client_industry,
        date_received,
        verification_status
        // created_by will default to null automatically
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error details:', error)
      throw error
    }

    console.log('Testimonial created successfully:', data)

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Testimonial created successfully'
    })

  } catch (error) {
    console.error('Error creating testimonial:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
    const errorDetails = error instanceof Error && error.message ? error.message : 'Database operation failed'

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        details: errorDetails
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const supabase = (createSupabaseClientForServer() as any)
    const body = await request.json()

    const {
      id,
      client_name,
      client_title,
      client_company,
      client_avatar_url,
      testimonial_text,
      rating,
      testimonial_type,
      target_pages,
      display_order,
      is_featured,
      is_visible,
      client_location,
      client_website,
      project_details,
      client_industry,
      date_received,
      verification_status
    } = body

    // Validate required fields
    if (!id || !client_name || !testimonial_text) {
      return NextResponse.json(
        { success: false, error: 'ID, client name, and testimonial text are required' },
        { status: 400 }
      )
    }

    const { data, error } = await (supabase as any)
      .from('testimonials')
      .update({
        client_name,
        client_title,
        client_company,
        client_avatar_url,
        testimonial_text,
        rating,
        testimonial_type,
        target_pages,
        display_order,
        is_featured,
        is_visible,
        client_location,
        client_website,
        project_details,
        client_industry,
        date_received,
        verification_status,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data,
      message: 'Testimonial updated successfully'
    })

  } catch (error) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const supabase = (createSupabaseClientForServer() as any)
    const { searchParams } = new URL(request.url)

    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Testimonial ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('testimonials')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error occurred' },
      { status: 500 }
    )
  }
}
