import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseClientForServer } from '@/lib/supabase-client'
import { deleteR2Object } from '@/lib/r2-client'

// Admin delete for a PolyVault listing (same service-role pattern as the
// other admin/[id] routes — see /api/admin/featured-videos/[id]). Also
// cleans up the listing's R2 object, if it has one, so a deleted listing
// doesn't leave an orphaned file behind in the bucket.
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = createSupabaseClientForServer()
    const { id } = await params

    const { data: existing } = await supabase
      .from('polyvault_assets')
      .select('r2_model_key')
      .eq('id', id)
      .maybeSingle()

    const { error } = await supabase
      .from('polyvault_assets')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting polyvault asset:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    if (existing?.r2_model_key) {
      try {
        await deleteR2Object(existing.r2_model_key)
      } catch (r2Error) {
        // The catalog row is already gone — log the storage cleanup miss
        // rather than failing the whole delete over it.
        console.error('Failed to delete R2 object for removed polyvault asset:', r2Error)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error in DELETE polyvault asset:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
