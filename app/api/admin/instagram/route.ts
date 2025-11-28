import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// INSTAGRAM API - Admin Instagram post creation with service role
export async function POST(request: NextRequest) {
  try {
    console.log('INSTAGRAM: Processing Instagram post creation request')
    
    // Verify environment variables exist
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY
    
    if (!supabaseUrl) {
      throw new Error('SUPABASE_URL environment variable is missing')
    }
    
    if (!serviceRoleKey) {
      throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is missing')
    }

    console.log('INSTAGRAM: Environment variables verified', {
      urlExists: !!supabaseUrl,
      keyExists: !!serviceRoleKey,
      url: supabaseUrl.substring(0, 20) + '...'
    })
    
    // Create service client
    const serviceClient = createClient(supabaseUrl, serviceRoleKey)
    console.log('INSTAGRAM: Service client created successfully')
    
    const body = await request.json()
    console.log('Instagram data received:', {
      url: body.instagram_url,
      hasEmbedHtml: !!body.embed_html,
      hasThumbnail: !!body.thumbnail_url
    })
    
    // Map frontend field names to database column names
    const instagramData = {
      instagram_url: body.instagram_url,
      embed_html: body.embed_html,
      thumbnail_url: body.thumbnail_url,
      user_id: body.user_id || 'default-user', // Required for profile display
      created_at: new Date().toISOString()
    }
    
    console.log('INSTAGRAM: Inserting Instagram post data:', instagramData)
    
    // Direct database insert using service role
    const { data, error } = await serviceClient
      .from('instagram_posts')
      .insert(instagramData)
      .select()
      .single()
    
    if (error) {
      console.error('INSTAGRAM: Database error:', error)
      return NextResponse.json({ 
        error: 'Failed to create Instagram post',
        details: error.message,
        code: error.code || 'DATABASE_ERROR',
        hint: error.hint || 'No hint available'
      }, { status: 500 })
    }
    
    console.log('INSTAGRAM: Post created successfully:', data)
    
    return NextResponse.json({ 
      post: data,
      message: 'Instagram post created successfully',
      status: 'admin_fix_active',
      timestamp: new Date().toISOString()
    }, { status: 201 })

  } catch (error) {
    console.error('INSTAGRAM: Post creation error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    
    return NextResponse.json({ 
      error: 'Failed to create Instagram post',
      details: errorMessage,
      status: 'admin_fix_failed',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

// GET - List Instagram posts (also service role)
export async function GET(request: NextRequest) {
  try {
    console.log('INSTAGRAM: Processing Instagram posts list request')
    
    // Verify environment variables
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing environment variables')
    }
    
    const serviceClient = createClient(supabaseUrl, serviceRoleKey)

    console.log('INSTAGRAM: Fetching Instagram posts with service role')

    const { data, error } = await serviceClient
      .from('instagram_posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('INSTAGRAM: Database error:', error)
      return NextResponse.json({ 
        error: 'Failed to fetch Instagram posts',
        details: error.message,
        status: 'admin_error'
      }, { status: 500 })
    }

    console.log('INSTAGRAM: Posts fetched successfully:', { count: data?.length })

    return NextResponse.json({
      posts: data || [],
      status: 'admin_fix_active',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('INSTAGRAM: Posts fetch error:', error)
    return NextResponse.json({ 
      error: 'Failed to fetch Instagram posts',
      details: error instanceof Error ? error.message : 'Unknown error',
      status: 'admin_error'
    }, { status: 500 })
  }
}

// DELETE - Delete Instagram post (service role)
export async function DELETE(request: NextRequest) {
  try {
    console.log('INSTAGRAM: Processing Instagram post deletion request')
    
    // Verify environment variables
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SERVICE_ROLE_KEY
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing environment variables')
    }
    
    const serviceClient = createClient(supabaseUrl, serviceRoleKey)

    // Get post ID from URL params
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      throw new Error('Post ID is required')
    }

    console.log('INSTAGRAM: Deleting Instagram post with ID:', id)

    const { error } = await serviceClient
      .from('instagram_posts')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('INSTAGRAM: Database error:', error)
      return NextResponse.json({ 
        error: 'Failed to delete Instagram post',
        details: error.message,
        status: 'admin_error'
      }, { status: 500 })
    }

    console.log('INSTAGRAM: Post deleted successfully')

    return NextResponse.json({
      message: 'Instagram post deleted successfully',
      status: 'admin_fix_active',
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('INSTAGRAM: Post deletion error:', error)
    return NextResponse.json({ 
      error: 'Failed to delete Instagram post',
      details: error instanceof Error ? error.message : 'Unknown error',
      status: 'admin_error'
    }, { status: 500 })
  }
}