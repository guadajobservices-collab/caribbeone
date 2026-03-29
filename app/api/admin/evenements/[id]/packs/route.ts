import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

interface Props { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const [{ data: packs }, { data: event }] = await Promise.all([
    supabase.from('event_packages').select('*').eq('event_id', id).order('created_at'),
    supabase.from('events').select('title').eq('id', id).single(),
  ])
  return NextResponse.json({ packs: packs || [], eventTitle: event?.title || '' })
}

export async function POST(request: Request, { params }: Props) {
  const { id } = await params
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { data, error } = await supabase.from('event_packages').insert({
      event_id: id,
      name: body.name,
      type: body.type || 'full_pack',
      departure_island_id: body.departure_island_id || null,
      price: parseFloat(body.price) || 0,
      deposit_amount: parseFloat(body.deposit_amount) || 0,
      deposit_type: body.deposit_type || 'percent',
      capacity: parseInt(body.capacity) || null,
      status: 'active',
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
