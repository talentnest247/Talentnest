import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const providerId = params.id;

    // Delete provider (cascade will handle portfolio, bookings, reviews)
    const { error } = await supabase
      .from('providers')
      .delete()
      .eq('id', providerId);

    if (error) {
      console.error('Error deleting provider:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Provider deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE handler:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
