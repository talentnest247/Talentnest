import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Type definitions for the query result
type JoinedUser = {
  id: string
  email?: string
  first_name?: string
  last_name?: string
  full_name?: string
  student_id?: string | null
  department?: string | null
}

type ProviderRow = {
  id: string
  user_id: string
  business_name?: string
  description?: string
  bio?: string | null
  specialization?: string[]
  experience_years?: number
  location?: string
  certificates?: string[]
  verification_status?: 'pending' | 'approved' | 'rejected'
  verification_evidence?: string[]
  verified?: boolean
  verification_reviewed_at?: string | null
  verification_reviewed_by?: string | null
  verification_notes?: string | null
  created_at?: string
  updated_at?: string
  // Note: PostgREST returns joined relations as arrays, e.g. `user:users (...)` will be an array
  user?: JoinedUser[]
}

export async function GET() {
  try {
    // Get verification requests by fetching pending providers
    const { data: providers, error } = await supabase
      .from('providers')
      .select(`
        id,
        user_id,
        business_name,
        description,
        bio,
        specialization,
        experience_years,
        location,
        certificates,
        verification_status,
        verification_evidence,
        verified,
        verification_reviewed_at,
        verification_reviewed_by,
        verification_notes,
        created_at,
        updated_at,
        user:users (
          id,
          email,
          first_name,
          last_name,
          full_name,
          student_id,
          department
        )
      `)
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      console.error("Error fetching verification requests:", error)
      return NextResponse.json(
        { error: "Failed to fetch verification requests" },
        { status: 500 }
      )
    }

    // Transform the data to match the VerificationRequest interface
    const verificationRequests = (providers as ProviderRow[])?.map(provider => {
      // user is returned as `user` (joined users row) and comes back as an array
      const rawUser = provider.user ?? null
      const user = Array.isArray(rawUser) ? rawUser[0] : rawUser

      return {
        id: `vr-${provider.id}`,
        providerId: provider.id,
        providerName: user?.full_name || 'Unknown',
        providerEmail: user?.email || '',
        studentId: user?.student_id || '',
        matricNumber: user?.student_id || '', // Matric number for verification
        department: user?.department || '',
        businessName: provider.business_name,
        businessDescription: provider.description,
        bio: provider.bio,
        specializations: provider.specialization || [],
        experienceYears: provider.experience_years,
        certificates: provider.certificates || [],
        evidenceFiles: (provider.verification_evidence || []).map((url: string) => ({
          url,
          type: url.includes('.pdf') ? 'certificate' as const : 'portfolio' as const
        })),
        status: provider.verification_status,
        submittedAt: provider.created_at ? new Date(provider.created_at) : undefined,
        reviewedAt: provider.verification_reviewed_at ? new Date(provider.verification_reviewed_at) : undefined,
        reviewedBy: provider.verification_reviewed_by || undefined,
        adminNotes: provider.verification_notes || undefined,
        // For PRD schema, use simple verification flags
        matricNumberVerified: provider.verification_status === 'approved',
        businessNameVerified: provider.verification_status === 'approved',
        certificatesVerified: provider.verification_status === 'approved',
        bioVerified: provider.verification_status === 'approved',
        verificationComplete: provider.verification_status === 'approved'
      }
    }) || []

    return NextResponse.json({
      success: true,
      data: verificationRequests
    })

  } catch (error) {
    console.error("Error in verification requests API:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action, providerId, adminNotes } = await request.json()

    if (!action || !providerId) {
      return NextResponse.json(
        { error: "Missing required fields: action, providerId" },
        { status: 400 }
      )
    }

    if (!['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      )
    }

    const adminUserId = "admin-user-id" // TODO: Get from authenticated session

    if (action === 'approve') {
      // When approving, mark all verification fields as verified
      const { data, error } = await supabase
        .from('providers')
        .update({
          verification_status: 'approved',
          verified: true,
          verification_reviewed_at: new Date().toISOString(),
          verification_reviewed_by: adminUserId,
          verification_notes: adminNotes || 'Application approved after comprehensive review.',
          updated_at: new Date().toISOString()
        })
        .eq('id', providerId)
        .select()

      if (error) {
        console.error("Error approving provider:", error)
        return NextResponse.json(
          { error: "Failed to approve provider" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `Service Provider verified successfully! All verification requirements met.`,
        data: data[0]
      })

    } else {
      // When rejecting, provide detailed verification feedback
      const { data, error } = await supabase
        .from('providers')
        .update({
          verification_status: 'rejected',
          verified: false,
          verification_reviewed_at: new Date().toISOString(),
          verification_reviewed_by: adminUserId,
          verification_notes: adminNotes || 'Application rejected after review.',
          updated_at: new Date().toISOString()
        })
        .eq('id', providerId)
        .select()

      if (error) {
        console.error("Error rejecting provider:", error)
        return NextResponse.json(
          { error: "Failed to reject provider" },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        message: `Application rejected. Detailed feedback provided to service provider.`,
        data: data[0]
      })
    }

  } catch (error) {
    console.error("Error in verification update:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
