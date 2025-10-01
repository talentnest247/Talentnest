
import { NextResponse } from 'next/server'
import { getProviderById, getPortfolioByProvider, createPortfolioItem } from '@/lib/supabase'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    if (!id) return NextResponse.json({ error: 'Provider id is required' }, { status: 400 })

    const provider = await getProviderById(id)
    if (!provider) return NextResponse.json({ error: 'Provider not found' }, { status: 404 })

    const portfolio = await getPortfolioByProvider(id)
    return NextResponse.json({ provider, portfolio })
  } catch (err: unknown) {
    const message = (err as Error)?.message || String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id
    if (!id) return NextResponse.json({ error: 'Provider id is required' }, { status: 400 })

    const body = await req.json()
    const payload = { ...body, providerId: id }
    const created = await createPortfolioItem(payload)
    return NextResponse.json(created, { status: 201 })
  } catch (err: unknown) {
    const message = (err as Error)?.message || String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
