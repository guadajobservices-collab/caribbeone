import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { qr_code } = await request.json()
  if (!qr_code) return NextResponse.json({ success: false, message: 'Code QR manquant' })

  const rows = await db`
    SELECT op.id, op.first_name, op.last_name, op.checked_in, op.checked_in_at,
      e.title AS event_title, e.organizer_id
    FROM order_participants op
    JOIN orders o ON o.id = op.order_id
    JOIN packages p ON p.id = o.package_id
    JOIN events e ON e.id = p.event_id
    WHERE op.ticket_qr_code = ${qr_code}
    LIMIT 1
  `

  const participant = rows[0] as {
    id: string; first_name: string; last_name: string;
    checked_in: boolean; checked_in_at: string | null;
    event_title: string; organizer_id: string
  } | undefined

  if (!participant) {
    return NextResponse.json({ success: false, message: 'Billet introuvable ou invalide' })
  }

  // Vérifier que l'organisateur est bien le propriétaire
  if (participant.organizer_id !== user.id) {
    // Permettre si admin
    const profiles = await db`SELECT role FROM profiles WHERE id = ${user.id} LIMIT 1`
    if ((profiles[0] as { role: string })?.role !== 'admin') {
      return NextResponse.json({ success: false, message: 'Non autorisé à scanner cet événement' })
    }
  }

  if (participant.checked_in) {
    return NextResponse.json({
      success: false,
      message: `Billet déjà scanné le ${new Date(participant.checked_in_at!).toLocaleString('fr-FR')}`,
      participant: { first_name: participant.first_name, last_name: participant.last_name, event_title: participant.event_title, checked_in: true }
    })
  }

  // Valider le billet
  await db`
    UPDATE order_participants SET checked_in = true, checked_in_at = now()
    WHERE id = ${participant.id}
  `

  return NextResponse.json({
    success: true,
    message: 'Entrée validée avec succès !',
    participant: { first_name: participant.first_name, last_name: participant.last_name, event_title: participant.event_title, checked_in: false }
  })
}
