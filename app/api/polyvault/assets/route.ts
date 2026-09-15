import { NextRequest, NextResponse } from 'next/server'
import { createRouteClient } from '@/lib/supabase-server'
import type { ModelAsset } from '@/components/polyvault/types'

// PolyVault's shared marketplace catalog. Previously every "published"
// listing only ever lived in the uploading browser's localStorage, so no
// other visitor — a different browser, device, or signed-out shopper —
// could ever see it: the model looked unavailable and the creator name
// fell back to whatever the *viewer's own* browser had seeded, which was
// always the demo catalog's placeholder author. This route makes listings
// real rows in Supabase (see the polyvault_assets migration) so every
// visitor sees the same catalog and the same real creator.

// Maps a polyvault_assets DB row (snake_case) to the shape the frontend
// already works with everywhere (camelCase ModelAsset).
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
      badge: 'CREATOR',
      verified: true,
      // No real sales-tracking exists yet for PolyVault listings — 0 is the
      // honest figure for a freshly published asset rather than borrowing a
      // number from the old mock profile.
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

// GET: public catalog read. No sign-in required — this is a public
// marketplace, and RLS's "polyvault_assets_public_read" policy allows the
// anon role to select every row.
export async function GET() {
  try {
    const supabase = await createRouteClient()
    const { data, error } = await supabase
      .from('polyvault_assets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)

    return NextResponse.json({ assets: (data || []).map(rowToAsset) })
  } catch (error: any) {
    console.error('polyvault assets GET error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to load assets' }, { status: 500 })
  }
}

// POST: publish a new listing. Requires sign-in. The creator's displayed
// identity (name/handle/avatar) is derived here from their real profile —
// never trusted from the request body — and author_id is always the
// caller's own id; the polyvault_assets_owner_insert RLS policy enforces
// that server-side too, so this can't be used to publish as someone else.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'You must be signed in to publish an asset' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, avatar_url')
      .eq('id', user.id)
      .maybeSingle()

    const authorName = profile?.full_name || user.email?.split('@')[0] || 'Creator'
    const authorHandle = `@${(user.email?.split('@')[0] || 'creator').toLowerCase().replace(/[^a-z0-9_]/g, '')}`
    const authorAvatar =
      profile?.avatar_url ||
      `https://ui-avatars.com/api/?name=${encodeURIComponent(authorName)}&background=10b981&color=fff`

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
      author_id: user.id,
      author_name: authorName,
      author_handle: authorHandle,
      author_avatar: authorAvatar,
      tags: Array.isArray(body?.tags) ? body.tags : [],
      downloads_count: 0,
      likes_count: 1,
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
    console.error('polyvault assets POST error:', error)
    return NextResponse.json({ error: error?.message || 'Failed to publish asset' }, { status: 500 })
  }
}
