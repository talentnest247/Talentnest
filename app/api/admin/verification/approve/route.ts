import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin, logAdminAction } from '@/lib/supabase'

/**
 * POST /api/admin/verification/approve
 * Body: { id: string, action: 'approve' | 'reject', adminId: string, adminNotes?: string, verificationDetails?: object }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, action, adminId, adminNotes } = body
    if (!id || !action || !adminId) return NextResponse.json({ error: 'id, action and adminId are required' }, { status: 400 })

    if (!['approve', 'reject'].includes(action)) return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 })

    // build a loose updates object first to avoid direct incompatible casting
    const updates: Record<string, string | boolean | null> = {
      verification_reviewed_at: new Date().toISOString(),
      verification_reviewed_by: adminId,
      verification_notes: adminNotes || null,
      verification_status: action === 'approve' ? 'approved' : 'rejected',
      verified: action === 'approve'
    }

    // Normalize id - frontend earlier used `vr-<providerId>` for listing. Accept either form.
    const providerId = (typeof id === 'string' && id.startsWith('vr-')) ? id.slice(3) : id

    if (!supabaseAdmin) {
      console.error('supabaseAdmin not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Build final payload and update the providers record to match the GET listing
    // Note: providers table in PRD schema doesn't have individual verification flags
    const payload = { ...updates }

    let updated
    try {
      const { data, error } = await supabaseAdmin
        .from('providers')
        .update(payload)
        .eq('id', providerId)
        .select()
        .single()

      if (error) {
        console.error('Error updating artisan verification:', error)
        return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 })
      }

      updated = data
    } catch (e) {
      console.error('artisan update failed', e)
      return NextResponse.json({ error: 'Failed to update verification' }, { status: 500 })
    }
    // Log admin action
    try {
      await logAdminAction({ adminId, actionType: `verification_${action}`, targetId: id, details: adminNotes || '' })
    } catch (e) {
      // don't block response if logging fails
      console.warn('Admin action logging failed', e)
    }

    return NextResponse.json({ success: true, data: updated })
  } catch (err: unknown) {
    const message = (err as Error)?.message || String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
