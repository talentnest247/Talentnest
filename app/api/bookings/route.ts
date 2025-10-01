import { NextResponse } from 'next/server'
import { createBooking, getUserBookings, getProviderBookings } from '@/lib/supabase'

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const userId = url.searchParams.get('userId') || undefined
    const providerId = url.searchParams.get('providerId') || undefined

    if (userId) {
      const bookings = await getUserBookings(userId)
      return NextResponse.json({ bookings })
    }

    if (providerId) {
      const bookings = await getProviderBookings(providerId)
      return NextResponse.json({ bookings })
    }

    return NextResponse.json({ bookings: [] })
  } catch (err: unknown) {
    const message = (err as Error)?.message || String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const created = await createBooking(body)
    return NextResponse.json(created, { status: 201 })
  } catch (err: unknown) {
    const message = (err as Error)?.message || String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
