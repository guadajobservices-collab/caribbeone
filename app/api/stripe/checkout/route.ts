import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const { packageId, departurePointId, participants, userId } = await request.json()

  if (!packageId || !participants?.length) {
    return NextResponse.json({ error: 'Données manquantes' }, { status: 400 })
  }

  // Récupérer le pack
  const pkgs = await db`
    SELECT p.*, e.title AS event_title, e.slug AS event_slug, e.starts_at
    FROM packages p
    JOIN events e ON e.id = p.event_id
    WHERE p.id = ${packageId} AND e.status = 'published'
    LIMIT 1
  `
  const pkg = pkgs[0] as { id: string; name: string; price_cents: number; stock: number; event_title: string; event_slug: string; starts_at: string } | undefined
  if (!pkg) return NextResponse.json({ error: 'Pack introuvable' }, { status: 404 })

  const count = participants.length
  if (pkg.stock < count) return NextResponse.json({ error: 'Plus assez de places disponibles' }, { status: 400 })

  const totalCents = pkg.price_cents * count

  // Créer la commande en statut pending
  const orders = await db`
    INSERT INTO orders (user_id, package_id, departure_point_id, total_cents, participant_count, status)
    VALUES (${userId}, ${packageId}, ${departurePointId || null}, ${totalCents}, ${count}, 'pending')
    RETURNING id
  `
  const orderId = orders[0].id as string

  // Insérer les participants
  for (const p of participants) {
    await db`
      INSERT INTO order_participants (order_id, first_name, last_name, birth_date)
      VALUES (${orderId}, ${p.first_name}, ${p.last_name}, ${p.birth_date || null})
    `
  }

  const stripe = getStripe()
  if (!stripe) {
    // Mode démo sans Stripe
    return NextResponse.json({
      url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/paiement/confirmation?session_id=demo_${orderId}`
    })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: `${pkg.event_title} — ${pkg.name}`,
          description: `${count} participant(s)`,
        },
        unit_amount: pkg.price_cents,
      },
      quantity: count,
    }],
    success_url: `${appUrl}/paiement/confirmation?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${appUrl}/evenements/${pkg.event_slug}`,
    metadata: { orderId, userId },
  })

  // Mettre à jour l'ordre avec le session ID
  await db`UPDATE orders SET stripe_checkout_session_id = ${session.id} WHERE id = ${orderId}`

  return NextResponse.json({ url: session.url })
}
