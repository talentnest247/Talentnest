import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('providers')
    .select('id, business_name, description, created_at, user:users!providers_user_id_fkey(email, full_name)')
    .eq('verification_status', 'pending')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data || []);
}

export async function POST(request: Request) {
  const { action, providerId, adminNotes } = await request.json();
  const status = action === 'approve' ? 'approved' : 'rejected';
  
  const updateData: Record<string, string> = { 
    verification_status: status, 
    verification_date: new Date().toISOString()
  };

  if (adminNotes) {
    updateData.verification_admin_notes = adminNotes;
  }
  
  const { error } = await supabase
    .from('providers')
    .update(updateData)
    .eq('id', providerId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
