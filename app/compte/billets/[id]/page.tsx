import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { formatDate, formatPrice } from '@/lib/utils'

interface Props { params: Promise<{ id: string }> }

export default async function BilletsPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  const rows = await db`
    SELECT o.id, o.total_cents, o.participant_count, o.status,
      p.name AS package_name, p.price_cents,
      e.title AS event_title, e.venue, e.starts_at, e.slug AS event_slug,
      COALESCE((
        SELECT json_agg(json_build_object(
          'id', op.id, 'first_name', op.first_name, 'last_name', op.last_name,
          'ticket_qr_code', op.ticket_qr_code, 'ticket_pdf_url', op.ticket_pdf_url,
          'checked_in', op.checked_in
        )) FROM order_participants op WHERE op.order_id = o.id
      ), '[]') AS participants
    FROM orders o
    JOIN packages p ON p.id = o.package_id
    JOIN events e ON e.id = p.event_id
    WHERE o.id = ${id} AND o.user_id = ${user.id}
    LIMIT 1
  `.catch(() => [])

  const order = rows[0] as {
    id: string; total_cents: number; participant_count: number; status: string;
    package_name: string; price_cents: number;
    event_title: string; venue: string; starts_at: string; event_slug: string;
    participants: { id: string; first_name: string; last_name: string; ticket_qr_code: string; ticket_pdf_url?: string; checked_in: boolean }[];
  } | undefined

  if (!order) notFound()
  if (order.status !== 'paid') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-5xl mb-4">⏳</div>
        <h1 className="text-xl font-black">Paiement non confirmé</h1>
        <p className="text-gray-500 mt-2">Les billets seront disponibles une fois le paiement confirmé.</p>
        <Link href="/compte/reservations" className="mt-4 inline-block bg-[#8ab5a7] text-white px-5 py-2.5 rounded-xl font-bold">Retour</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/compte/reservations" className="text-sm text-gray-400 hover:text-[#8ab5a7] flex items-center gap-1 mb-6">← Retour aux réservations</Link>

      <h1 className="text-2xl font-black text-[#1a1a1a] mb-2">E-billets</h1>
      <p className="text-gray-500 mb-6">{order.event_title} · {formatDate(order.starts_at)}</p>

      <div className="space-y-4">
        {order.participants.map((p, i) => (
          <div key={p.id} className="border border-gray-200 rounded-2xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-[#8ab5a7] mb-1">BILLET {i + 1} / {order.participant_count}</p>
                <h3 className="font-black text-[#1a1a1a] text-lg">{p.first_name} {p.last_name}</h3>
                <p className="text-sm text-gray-500 mt-1">{order.package_name} · {order.venue}</p>
                {p.checked_in && <p className="text-xs text-green-600 mt-1 font-semibold">✅ Scanné à l&apos;entrée</p>}
              </div>
              <div className="text-right">
                <p className="font-black text-[#1a1a1a]">{formatPrice(order.price_cents)}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <a href={`/api/billets/${p.id}`} target="_blank" rel="noopener noreferrer"
                className="flex-1 bg-[#8ab5a7] text-white py-2.5 rounded-xl text-sm font-bold text-center hover:opacity-90">
                📥 Télécharger PDF
              </a>
            </div>
            <p className="text-xs text-gray-400 mt-2 font-mono">QR: {p.ticket_qr_code.substring(0, 16)}...</p>
          </div>
        ))}
      </div>

      <div className="mt-6 bg-gray-50 rounded-2xl p-4 text-sm text-gray-500">
        <p>💡 Présentez le QR code à l&apos;entrée de l&apos;événement pour validation.</p>
        <p className="mt-1">Total payé : <strong className="text-[#1a1a1a]">{formatPrice(order.total_cents)}</strong></p>
      </div>
    </div>
  )
}
