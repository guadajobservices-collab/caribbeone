import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'

interface Props { params: Promise<{ id: string }> }

export async function POST(request: Request, { params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  // Vérifier ownership
  const evts = await db`SELECT id FROM events WHERE id = ${id} AND organizer_id = ${user.id} LIMIT 1`
  if (!evts[0]) return NextResponse.json({ error: 'Événement introuvable' }, { status: 404 })

  const body = await request.json()
  const { name, price_cents, stock, transport_mode, transport_operator, includes_accommodation, accommodation_type, is_promo, is_diaspora } = body

  if (!name || !price_cents) return NextResponse.json({ error: 'Champs manquants' }, { status: 400 })

  const rows = await db`
    INSERT INTO packages (event_id, name, price_cents, stock, transport_mode, transport_operator, includes_accommodation, accommodation_type, is_promo, is_diaspora)
    VALUES (${id}, ${name}, ${price_cents}, ${stock || 50}, ${transport_mode || null}, ${transport_operator || null}, ${includes_accommodation || false}, ${accommodation_type || null}, ${is_promo || false}, ${is_diaspora || false})
    RETURNING id
  `
  return NextResponse.json({ id: rows[0].id })
}
