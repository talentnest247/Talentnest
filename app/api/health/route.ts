import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  try {
    if (!supabaseAdmin) {
      return NextResponse.json({ error: "Supabase admin client not available" }, { status: 500 });
    }

    // Test basic connectivity
    // Check a lightweight, existing public table (users).
    const { error } = await supabaseAdmin
      .from('users')
      .select('id')
      .limit(1);

    if (error) {
      console.error("Supabase connection error:", error);
      return NextResponse.json({ error: "Database connection failed", details: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      status: "ok", 
      message: "Database connected successfully",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json({ 
      error: "Health check failed", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}
