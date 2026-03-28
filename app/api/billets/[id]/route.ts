import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { db } from '@/lib/db'
import { generateTicketPDF } from '@/lib/pdf'

interface Props { params: Promise<{ id: string }> }

export async function GET(request: Request, { params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })

  const rows = await db`
    SELECT op.*, o.user_id,
      p.name AS package_name,
      e.title AS event_title, e.venue, e.starts_at
    FROM order_participants op
    JOIN orders o ON o.id = op.order_id
    JOIN packages p ON p.id = o.package_id
    JOIN events e ON e.id = p.event_id
    WHERE op.id = ${id} AND o.user_id = ${user.id}
    LIMIT 1
  `.catch(() => [])

  const participant = rows[0] as {
    first_name: string; last_name: string; ticket_qr_code: string;
    package_name: string; event_title: string; venue: string; starts_at: string
  } | undefined

  if (!participant) return NextResponse.json({ error: 'Billet introuvable' }, { status: 404 })

  const pdfBuffer = await generateTicketPDF({
    participantName: `${participant.first_name} ${participant.last_name}`,
    eventTitle: participant.event_title,
    eventVenue: participant.venue,
    eventDate: new Date(participant.starts_at).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    packageName: participant.package_name,
    qrCode: participant.ticket_qr_code,
    orderRef: id.substring(0, 8).toUpperCase(),
  })

  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(new Uint8Array(pdfBuffer))
      controller.close()
    }
  })

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="billet-${id.substring(0, 8)}.pdf"`,
    },
  })
}
