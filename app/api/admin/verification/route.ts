import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Type definitions for the query result
interface ProviderWithUser {
  id: string
  user_id: string
  business_name: string
  description: string
  bio: string | null
  specialization: string[]
  experience: number
  location: string
  certificates: string[]
  verification_status: 'pending' | 'approved' | 'rejected'
  verification_evidence: string[]
  verification_submitted_at: string
  verification_reviewed_at: string | null
  verification_reviewed_by: string | null
  verification_notes: string | null
  matric_number_verified: boolean
  business_name_verified: boolean
  certificates_verified: boolean
  bio_verified: boolean
  created_at: string
  updated_at: string
  users: {
    id: string
    email: string
    first_name: string
    last_name: string
    full_name: string
    student_id: string | null
    department: string | null
  }[]
}

export async function GET(request: NextRequest) {
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
        experience,
        location,
        certificates,
        verification_status,
        verification_evidence,
        verification_submitted_at,
        verification_reviewed_at,
        verification_reviewed_by,
        verification_notes,
        matric_number_verified,
        business_name_verified,
        certificates_verified,
        bio_verified,
        created_at,
        updated_at,
        users (
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
      .order('verification_submitted_at', { ascending: false })

    if (error) {
      console.error("Error fetching verification requests:", error)
      return NextResponse.json(
        { error: "Failed to fetch verification requests" },
        { status: 500 }
      )
    }

    // Transform the data to match the VerificationRequest interface
    const verificationRequests = (providers as ProviderWithUser[])?.map(provider => {
      // Get the first user from the array (should only be one due to foreign key relationship)
      const user = provider.users?.[0];
      
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
        experienceYears: provider.experience,
        certificates: provider.certificates || [],
        evidenceFiles: (provider.verification_evidence || []).map((url: string) => ({
          url,
          type: url.includes('.pdf') ? 'certificate' as const : 'portfolio' as const
        })),
        status: provider.verification_status,
        submittedAt: new Date(provider.verification_submitted_at || provider.created_at),
        reviewedAt: provider.verification_reviewed_at ? new Date(provider.verification_reviewed_at) : undefined,
        reviewedBy: provider.verification_reviewed_by || undefined,
        adminNotes: provider.verification_notes || undefined,
        // Individual verification tracking
        matricNumberVerified: provider.matric_number_verified || false,
        businessNameVerified: provider.business_name_verified || false,
        certificatesVerified: provider.certificates_verified || false,
        bioVerified: provider.bio_verified || false,
        verificationComplete: (
          provider.matric_number_verified &&
          provider.business_name_verified &&
          provider.certificates_verified &&
          provider.bio_verified
        ) || false
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
    const { action, providerId, adminNotes, verificationDetails } = await request.json()

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
          matric_number_verified: true,
          business_name_verified: true,
          certificates_verified: true,
          bio_verified: true,
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
        message: `Artisan verified successfully! All verification requirements met.`,
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
          // Keep individual verification flags as they were for feedback
          matric_number_verified: verificationDetails?.matric_number_verified || false,
          business_name_verified: verificationDetails?.business_name_verified || false,
          certificates_verified: verificationDetails?.certificates_verified || false,
          bio_verified: verificationDetails?.bio_verified || false,
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
        message: `Application rejected. Detailed feedback provided to artisan.`,
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
