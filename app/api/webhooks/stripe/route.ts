import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import { generateTicketPDF } from '@/lib/pdf'
import { sendConfirmationEmail } from '@/lib/resend'

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  const stripe = getStripe()
  if (!stripe) return NextResponse.json({ received: true })

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Signature invalide' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as unknown as { id: string; metadata: { orderId: string; userId: string } }
    const { orderId, userId } = session.metadata

    // Confirmer la commande
    await db`
      UPDATE orders SET status = 'paid', stripe_checkout_session_id = ${session.id}
      WHERE id = ${orderId}
    `

    // Réduire le stock
    await db`
      UPDATE packages SET stock = stock - (
        SELECT participant_count FROM orders WHERE id = ${orderId}
      )
      WHERE id = (SELECT package_id FROM orders WHERE id = ${orderId})
    `

    // Récupérer participants + infos pour PDF
    const orderData = await db`
      SELECT o.id, o.total_cents,
        p.name AS package_name, p.price_cents,
        e.title AS event_title, e.venue, e.starts_at,
        pr.email
      FROM orders o
      JOIN packages p ON p.id = o.package_id
      JOIN events e ON e.id = p.event_id
      JOIN profiles pr ON pr.id = o.user_id
      WHERE o.id = ${orderId}
      LIMIT 1
    `
    const order = orderData[0] as { package_name: string; price_cents: number; event_title: string; venue: string; starts_at: string; email: string } | undefined
    if (!order) return NextResponse.json({ received: true })

    const participants = await db`
      SELECT * FROM order_participants WHERE order_id = ${orderId}
    ` as { id: string; first_name: string; last_name: string; ticket_qr_code: string }[]

    // Générer PDFs
    for (const p of participants) {
      try {
        const pdfBuffer = await generateTicketPDF({
          participantName: `${p.first_name} ${p.last_name}`,
          eventTitle: order.event_title,
          eventVenue: order.venue,
          eventDate: new Date(order.starts_at).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
          packageName: order.package_name,
          qrCode: p.ticket_qr_code,
          orderRef: orderId.substring(0, 8).toUpperCase(),
        })
        // Stocker le PDF en base64 (simple pour MVP)
        const pdfB64 = pdfBuffer.toString('base64')
        await db`UPDATE order_participants SET ticket_pdf_url = ${`data:application/pdf;base64,${pdfB64}`} WHERE id = ${p.id}`
      } catch (err) {
        console.error('PDF gen error:', err)
      }
    }

    // Envoyer email de confirmation
    try {
      await sendConfirmationEmail({
        to: order.email,
        firstName: '',
        eventTitle: order.event_title,
        orderRef: orderId.substring(0, 8).toUpperCase(),
        pdfUrls: [],
      })
    } catch {}
  }

  return NextResponse.json({ received: true })
}
