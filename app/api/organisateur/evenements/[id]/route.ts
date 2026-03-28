import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'

interface Props { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const body = await request.json()
  const { title, slug, category, island, venue, starts_at, ends_at, description, status } = body

  // Filtrer les status autorisés (pas de 'published' direct par l'organisateur)
  const allowedStatus = ['draft', 'pending']
  if (status && !allowedStatus.includes(status)) {
    return NextResponse.json({ error: 'Statut non autorisé' }, { status: 400 })
  }

  await db`
    UPDATE events SET
      title = COALESCE(${title}, title),
      slug = COALESCE(${slug}, slug),
      category = COALESCE(${category}, category),
      island = COALESCE(${island}, island),
      venue = COALESCE(${venue}, venue),
      starts_at = COALESCE(${starts_at || null}, starts_at),
      ends_at = ${ends_at || null},
      description = ${description || null},
      status = COALESCE(${status || null}, status),
      updated_at = now()
    WHERE id = ${id} AND organizer_id = ${user.id}
  `

  return NextResponse.json({ success: true })
}
