import { NextResponse } from 'next/server'
import { createPresignedUpload } from '@/lib/supabase'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { bucket, key, expiresInSeconds } = body
    if (!bucket || !key) return NextResponse.json({ error: 'bucket and key are required' }, { status: 400 })
    const signed = await createPresignedUpload({ bucket, key, expiresInSeconds })
    return NextResponse.json({ signed })
  } catch (err: unknown) {
    const message = (err as Error)?.message || String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
