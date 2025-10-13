import { NextResponse } from 'next/server'
import { getProviders, createProvider } from '@/lib/supabase'

type ProviderFilters = {
  specialization?: string
  location?: string
  verified?: boolean
  limit?: number
  include_all_statuses?: boolean
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const location = url.searchParams.get('location') || undefined
    const specialization = url.searchParams.get('specialization') || undefined
    const verifiedParam = url.searchParams.get('verified')
    const limit = url.searchParams.get('limit') ? Number(url.searchParams.get('limit')) : undefined
    const includeAllStatuses = url.searchParams.get('include_all_statuses') === 'true'

    const filters: ProviderFilters = {}
    if (specialization) filters.specialization = specialization
    if (location) filters.location = location
    if (verifiedParam !== null) filters.verified = verifiedParam === 'true'
    if (limit) filters.limit = limit
    if (includeAllStatuses) filters.include_all_statuses = true

    const providers = await getProviders(filters)
    return NextResponse.json({ providers })
  } catch (err: unknown) {
    const message = (err as Error)?.message || String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const created = await createProvider(body)
    return NextResponse.json(created, { status: 201 })
  } catch (err: unknown) {
    const message = (err as Error)?.message || String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
