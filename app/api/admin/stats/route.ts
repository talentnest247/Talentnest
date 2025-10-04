import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // Count total users
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Count total providers
    const { count: totalProviders } = await supabase
      .from('providers')
      .select('*', { count: 'exact', head: true });

    // Count pending verifications
    const { count: pendingVerifications } = await supabase
      .from('providers')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'pending');

    // Count approved providers
    const { count: approvedProviders } = await supabase
      .from('providers')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'approved');

    // Count rejected providers
    const { count: rejectedProviders } = await supabase
      .from('providers')
      .select('*', { count: 'exact', head: true })
      .eq('verification_status', 'rejected');

    return NextResponse.json({
      totalUsers: totalUsers || 0,
      totalProviders: totalProviders || 0,
      pendingVerifications: pendingVerifications || 0,
      approvedProviders: approvedProviders || 0,
      rejectedProviders: rejectedProviders || 0
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
