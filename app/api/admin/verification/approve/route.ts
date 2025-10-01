import { NextResponse } from 'next/server'
import { supabaseAdmin, logAdminAction } from '@/lib/supabase'

type VerificationStatus = 'approved' | 'rejected'

interface VerificationUpdate {
  verification_reviewed_at: string
  verification_reviewed_by: string
  verification_notes: string | null
  verification_status: VerificationStatus
  verified: boolean
  matric_number_verified?: boolean
  business_name_verified?: boolean
  certificates_verified?: boolean
  bio_verified?: boolean
    }

/**
 * POST /api/admin/verification/approve
 * Body: { id: string, action: 'approve' | 'reject', adminId: string, adminNotes?: string, verificationDetails?: object }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id, action, adminId, adminNotes, verificationDetails } = body
    if (!id || !action || !adminId) return NextResponse.json({ error: 'id, action and adminId are required' }, { status: 400 })

    if (!['approve', 'reject'].includes(action)) return NextResponse.json({ error: 'action must be approve or reject' }, { status: 400 })

    // build a loose updates object first to avoid direct incompatible casting
    const updates: Record<string, any> = {
      verification_reviewed_at: new Date().toISOString(),
      verification_reviewed_by: adminId,
      verification_notes: adminNotes || null,
      verification_status: action === 'approve' ? 'approved' : 'rejected',
      verified: action === 'approve'
    }

    // If rejecting, allow passing back details for individual flags (optional)
    if (action === 'reject' && verificationDetails) {
      updates.matric_number_verified = verificationDetails?.matric_number_verified ?? false
      updates.business_name_verified = verificationDetails?.business_name_verified ?? false
      updates.certificates_verified = verificationDetails?.certificates_verified ?? false
      updates.bio_verified = verificationDetails?.bio_verified ?? false
    }

    // normalize individual verification flags
    const details = verificationDetails ?? {}
    const flags = {
      matric_number_verified: details.matric_number_verified ?? (action === 'approve'),
      business_name_verified: details.business_name_verified ?? (action === 'approve'),
      certificates_verified: details.certificates_verified ?? (action === 'approve'),
      bio_verified: details.bio_verified ?? (action === 'approve'),
    }

    // Normalize id - frontend earlier used `vr-<providerId>` for listing. Accept either form.
    const providerId = (typeof id === 'string' && id.startsWith('vr-')) ? id.slice(3) : id

    if (!supabaseAdmin) {
      console.error('supabaseAdmin not configured')
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    // Build final payload and update the artisans (provider) record to match the GET listing
    const payload = { ...updates, ...flags }

    let updated
    try {
      const { data, error } = await supabaseAdmin
        .from('artisans')
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
