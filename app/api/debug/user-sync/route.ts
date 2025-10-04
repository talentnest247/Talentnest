import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase"

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check auth.users
    const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers()
    
    // Check public.users
    const { data: publicUsers, error: publicError } = await supabaseAdmin
      .from('users')
      .select('id, email, role, first_name, last_name, created_at')
    
    return NextResponse.json({
      success: true,
      authUsers: authError ? { error: authError.message } : authUsers.users.map(u => ({
        id: u.id,
        email: u.email,
        created_at: u.created_at,
        metadata: u.user_metadata
      })),
      publicUsers: publicError ? { error: publicError.message } : publicUsers,
      comparison: {
        authCount: authUsers?.users?.length || 0,
        publicCount: publicUsers?.length || 0,
        synced: !publicError && !authError && authUsers?.users?.length === publicUsers?.length
      }
    })
  } catch (error) {
    console.error("Debug error:", error)
    return NextResponse.json(
      { error: "Debug check failed", details: String(error) },
      { status: 500 }
    )
  }
}
