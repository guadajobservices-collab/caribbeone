import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db, getProfile } from '@/lib/db'

interface Props { params: Promise<{ id: string }> }

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const profile = await getProfile(user.id).catch(() => null)
  if (!profile || profile.role !== 'admin') return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })

  const { status } = await request.json()
  if (!['published', 'cancelled', 'pending', 'draft'].includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 })
  }

  await db`UPDATE events SET status = ${status}, updated_at = now() WHERE id = ${id}`
  return NextResponse.json({ success: true })
}
