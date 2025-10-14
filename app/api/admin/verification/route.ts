import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    console.log('[Admin Verification API] Fetching pending providers...');
    
    const { data, error } = await supabase
      .from('providers')
      .select(`
        id, 
        business_name, 
        description, 
        bio,
        specialization,
        experience,
        location,
        verification_status,
        verified,
        verification_evidence,
        certificates,
        whatsapp_number,
        availability_available_for_learning,
        availability_available_for_work,
        pricing_base_rate,
        pricing_learning_rate,
        pricing_currency,
        rating,
        total_reviews,
        created_at,
        updated_at,
        user:users!providers_user_id_fkey(
          id,
          email, 
          full_name,
          phone,
          student_id,
          department,
          level,
          avatar_url
        )
      `)
      .eq('verification_status', 'pending')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('[Admin Verification API] Database error:', error);
      return NextResponse.json({ 
        error: error.message,
        details: error,
        hint: 'Check RLS policies and service role key'
      }, { status: 500 });
    }
    
    console.log(`[Admin Verification API] Found ${data?.length || 0} pending providers`);
    return NextResponse.json(data || []);
  } catch (err) {
    console.error('[Admin Verification API] Unexpected error:', err);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { action, providerId, adminNotes } = await request.json();
  
  // Handle different actions
  if (action === 'toggle_verified_badge') {
    // Toggle the verified badge (separate from approval status)
    const { data: provider } = await supabase
      .from('providers')
      .select('verified')
      .eq('id', providerId)
      .single();
    
    const { error } = await supabase
      .from('providers')
      .update({ verified: !provider?.verified })
      .eq('id', providerId);
    
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, verified: !provider?.verified });
  }
  
  // Handle approve/reject actions
  const status = action === 'approve' ? 'approved' : 'rejected';
  
  const updateData: Record<string, string | boolean> = { 
    verification_status: status,
    verification_date: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // Add admin notes if provided
  if (adminNotes) {
    updateData.verification_admin_notes = adminNotes;
  }
  
  // Auto-assign verified badge when approving
  if (action === 'approve') {
    updateData.verified = true;
  }
  
  const { error } = await supabase
    .from('providers')
    .update(updateData)
    .eq('id', providerId);

  if (error) {
    console.error('[Admin Verification API] Update error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  console.log(`[Admin Verification API] Provider ${providerId} ${status}`);
  return NextResponse.json({ success: true });
}
