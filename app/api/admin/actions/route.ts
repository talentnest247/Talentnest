import { NextResponse } from 'next/server'
import { logAdminAction } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const created = await logAdminAction(body)
    return NextResponse.json(created, { status: 201 })
  } catch (err: unknown) {
    const message = (err as Error)?.message || String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
