import { NextResponse } from 'next/server'
import { createReview, getReviews } from '@/lib/supabase'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const providerId = url.searchParams.get('providerId') || undefined
    const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined
    const reviews = await getReviews(providerId, limit)
    return NextResponse.json({ reviews })
  } catch (err: unknown) {
    const message = (err as Error)?.message || String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const created = await createReview(body)
    return NextResponse.json(created, { status: 201 })
  } catch (err: unknown) {
    const message = (err as Error)?.message || String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
