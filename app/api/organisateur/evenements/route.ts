import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { getProfile, upsertProfile } from '@/lib/db'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  // Vérifier/créer le profil si pas encore en base
  let profile = await getProfile(user.id).catch(() => null)
  if (!profile) {
    await upsertProfile({
      id: user.id,
      email: user.email,
      first_name: user.user_metadata?.first_name || '',
      last_name: user.user_metadata?.last_name || '',
      role: 'organizer',
    })
    profile = await getProfile(user.id).catch(() => null)
  }

  // Auto-upgrade à organisateur si besoin
  if (profile?.role === 'client') {
    await db`UPDATE profiles SET role = 'organizer' WHERE id = ${user.id}`
  }

  const body = await request.json()
  const { title, slug, category, island, venue, starts_at, ends_at, description, status } = body

  if (!title || !slug || !category || !island || !venue || !starts_at) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
  }

  const rows = await db`
    INSERT INTO events (organizer_id, title, slug, category, island, venue, starts_at, ends_at, description, status)
    VALUES (${user.id}, ${title}, ${slug}, ${category}, ${island}, ${venue}, ${starts_at}, ${ends_at || null}, ${description || null}, ${status || 'draft'})
    RETURNING id, slug
  `.catch((e: Error) => { throw e })

  return NextResponse.json({ id: rows[0].id, slug: rows[0].slug })
}
