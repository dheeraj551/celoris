import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import type { ModelAsset } from '@/components/polyvault/types'

// Admin-only PolyVault catalog management. Reached only through the
// /admin/polyvault page, which is gated by the same client-side
// admin_session check as the rest of /admin/* — matching the existing admin
// API convention (see /api/admin/featured-videos) where the request itself
// carries no server-side auth check of its own. This always uses the
// service-role client so it can write regardless of polyvault_assets' RLS
// policies, which are scoped to a real signed-in creator
// (auth.uid() = author_id) and would otherwise reject an admin-published row
// (the admin panel has no Supabase auth session to satisfy that check).
//
// Admin-published listings are attributed to a fixed "Celoris Official"
// author identity rather than any real user row, so they read honestly as
// platform-curated rather than impersonating a creator.

const CELORIS_ADMIN_AUTHOR = {
  id: '00000000-0000-0000-0000-000000000001',
  name: 'Celoris Official',
  handle: '@celoris',
  avatar: 'https://ui-avatars.com/api/?name=Celoris&background=0f172a&color=fff',
}

function rowToAsset(row: any): ModelAsset {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    price: Number(row.price),
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    rating: Number(row.rating),
    reviewCount: row.review_count,
    polyCount: row.poly_count,
    vertexCount: row.vertex_count,
    formats: row.formats || [],
    textures: row.textures || [],
    isRigged: row.is_rigged,
    isAnimated: row.is_animated,
    isPbr: row.is_pbr,
    fileSizeMb: row.file_size_mb,
    license: row.license,
    author: {
      id: row.author_id,
      name: row.author_name,
      handle: row.author_handle,
      avatar: row.author_avatar || '',
      badge: row.author_id === CELORIS_ADMIN_AUTHOR.id ? 'OFFICIAL' : 'CREATOR',
      verified: true,
      salesCount: 0,
    },
    tags: row.tags || [],
    createdAt: row.created_at,
    downloadsCount: row.downloads_count,
    likesCount: row.likes_count,
    generatorType: row.generator_type,
    primaryColor: row.primary_color || undefined,
    accentColor: row.accent_color || undefined,
    r2ModelKey: row.r2_model_key || undefined,
    modelFileName: row.model_file_name || undefined,
    thumbnailDataUrl: row.thumbnail_data_url || undefined,
  }
}

// GET: every listing (admin table), newest first.
export async function GET() {
  try {
    const supabase = createSupabaseClientForServer()
    const { data, error } = await supabase
      .from('polyvault_assets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return NextResponse.json({ assets: (data || []).map(rowToAsset) })
  } catch (error: any) {
    console.error('admin polyvault GET error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to load assets' }, { status: 500 })
  }
}

// POST: publish a new admin listing, always authored as Celoris Official.
export async function POST(request: NextRequest) {
  try {
    const supabase = createSupabaseClientForServer()
    const body = await request.json().catch(() => ({}))

    const title = typeof body?.title === 'string' ? body.title.trim() : ''
    if (!title) {
      return NextResponse.json({ error: 'title is required' }, { status: 400 })
    }

    const insertRow = {
      title,
      description: typeof body?.description === 'string' ? body.description : '',
      category: body?.category || 'Props',
      price: Number(body?.price) || 0,
      original_price: body?.originalPrice != null ? Number(body.originalPrice) : null,
      rating: 5,
      review_count: 1,
      poly_count: Number(body?.polyCount) || 0,
      vertex_count: Number(body?.vertexCount) || 0,
      formats: Array.isArray(body?.formats) ? body.formats : [],
      textures: Array.isArray(body?.textures) ? body.textures : [],
      is_rigged: !!body?.isRigged,
      is_animated: !!body?.isAnimated,
      is_pbr: !!body?.isPbr,
      file_size_mb: Number(body?.fileSizeMb) || 0,
      license: body?.license || 'Standard Commercial',
      author_id: CELORIS_ADMIN_AUTHOR.id,
      author_name: CELORIS_ADMIN_AUTHOR.name,
      author_handle: CELORIS_ADMIN_AUTHOR.handle,
      author_avatar: CELORIS_ADMIN_AUTHOR.avatar,
      tags: Array.isArray(body?.tags) ? body.tags : [],
      downloads_count: 0,
      likes_count: 0,
      generator_type: body?.generatorType || 'drone',
      primary_color: body?.primaryColor || null,
      accent_color: body?.accentColor || null,
      r2_model_key: body?.r2ModelKey || null,
      model_file_name: body?.modelFileName || null,
      thumbnail_data_url: body?.thumbnailDataUrl || null,
    }

    const { data: inserted, error: insertError } = await supabase
      .from('polyvault_assets')
      .insert(insertRow)
      .select('*')
      .single()

    if (insertError) throw new Error(insertError.message)

    return NextResponse.json({ asset: rowToAsset(inserted) })
  } catch (error: any) {
    console.error('admin polyvault POST error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to publish asset' }, { status: 500 })
  }
}
