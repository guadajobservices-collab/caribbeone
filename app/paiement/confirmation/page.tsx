import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Link from 'next/link'
import { formatDate, formatPrice } from '@/lib/utils'

interface Props {
  searchParams: Promise<{ session_id?: string }>
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { session_id } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  if (!session_id) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">❌</div>
        <h1 className="text-2xl font-black text-[#1a1a1a]">Lien invalide</h1>
        <Link href="/compte" className="mt-6 inline-block bg-[#8ab5a7] text-white px-6 py-3 rounded-xl font-bold">Mon compte</Link>
      </div>
    )
  }

  let order: {
    id: string; total_cents: number; participant_count: number; status: string;
    package_name: string; event_title: string; event_venue: string; starts_at: string;
  } | undefined

  try {
    const rows = await db`
      SELECT o.id, o.total_cents, o.participant_count, o.status,
        p.name AS package_name,
        e.title AS event_title, e.venue AS event_venue, e.starts_at
      FROM orders o
      JOIN packages p ON p.id = o.package_id
      JOIN events e ON e.id = p.event_id
      WHERE o.stripe_checkout_session_id = ${session_id}
      AND o.user_id = ${user.id}
      LIMIT 1
    `
    order = rows[0] as typeof order
  } catch { /* ignore */ }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">⏳</div>
        <h1 className="text-2xl font-black text-[#1a1a1a]">Paiement en cours de vérification</h1>
        <p className="text-gray-500 mt-3">Vos billets vous seront envoyés par email sous quelques minutes.</p>
        <Link href="/compte/reservations" className="mt-6 inline-block bg-[#8ab5a7] text-white px-6 py-3 rounded-xl font-bold">Voir mes réservations</Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <div className="text-center mb-10">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl">✅</div>
        <h1 className="text-3xl font-black text-[#1a1a1a]">Réservation confirmée !</h1>
        <p className="text-gray-500 mt-2">ain&apos;t nothin&apos; like caribbean life ! 🌴</p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-6 mb-6 space-y-3">
        <div className="flex justify-between"><span className="text-gray-500">Événement</span><span className="font-bold">{order.event_title}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Date</span><span className="font-semibold text-sm">{formatDate(order.starts_at)}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Lieu</span><span className="font-semibold">{order.event_venue}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Pack</span><span className="font-semibold">{order.package_name}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">Participants</span><span className="font-semibold">{order.participant_count}</span></div>
        <div className="border-t pt-3 flex justify-between text-lg font-black">
          <span>Total payé</span>
          <span className="text-[#8ab5a7]">{formatPrice(order.total_cents)}</span>
        </div>
      </div>

      <div className="bg-[#8ab5a7]/10 border border-[#8ab5a7]/30 rounded-2xl p-4 mb-6 text-sm text-gray-600">
        <p>📧 Vos <strong>e-billets PDF avec QR code</strong> vous ont été envoyés par email.</p>
        <p className="mt-1">Vous pouvez aussi les télécharger depuis votre espace client.</p>
      </div>

      <div className="flex gap-3">
        <Link href="/compte/reservations" className="flex-1 bg-[#1a1a1a] text-white py-3 rounded-xl font-bold text-center hover:opacity-80">
          Mes réservations
        </Link>
        <Link href="/evenements" className="flex-1 border border-gray-200 text-gray-700 py-3 rounded-xl font-bold text-center hover:border-[#8ab5a7]">
          Autres événements
        </Link>
      </div>
    </div>
  )
}
