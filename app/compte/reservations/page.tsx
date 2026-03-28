import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getOrdersByUser } from '@/lib/db'
import Link from 'next/link'
import { formatPrice, formatDate, islandLabel } from '@/lib/utils'

export const metadata = { title: 'Mes réservations — CaribbeOne' }

export default async function ReservationsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  const orders = await getOrdersByUser(user.id).catch(() => [])

  return (
    <div>
      <h1 className="text-2xl font-black text-[#1a1a1a] mb-6">Mes réservations</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl text-gray-400">
          <div className="text-5xl mb-4">🎫</div>
          <p className="text-lg">Aucune réservation pour l&apos;instant.</p>
          <Link href="/evenements" className="mt-4 inline-block bg-[#8ab5a7] text-white px-6 py-3 rounded-xl font-bold">
            Découvrir les événements
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      order.status === 'paid' ? 'bg-green-100 text-green-700' :
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status === 'paid' ? '✅ Confirmé' : order.status === 'pending' ? '⏳ En attente' : '❌ Annulé'}
                    </span>
                  </div>
                  <h3 className="font-black text-[#1a1a1a] text-lg">{order.package?.event?.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(order.package?.event?.starts_at || '')}
                  </p>
                  <p className="text-sm text-gray-500">
                    📍 {order.package?.event?.venue} · {islandLabel(order.package?.event?.island || '')}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">Pack : <strong>{order.package?.name}</strong> · {order.participant_count} participant(s)</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-black text-[#1a1a1a]">{formatPrice(order.total_cents)}</p>
                  {order.status === 'paid' && order.participants && order.participants.length > 0 && (
                    <Link href={`/compte/billets/${order.id}`}
                      className="mt-2 inline-block bg-[#8ab5a7] text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:opacity-90">
                      📥 Télécharger billets
                    </Link>
                  )}
                </div>
              </div>

              {/* Participants */}
              {order.participants && order.participants.length > 0 && order.status === 'paid' && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 mb-2">PARTICIPANTS</p>
                  <div className="flex flex-wrap gap-2">
                    {order.participants.map(p => (
                      <span key={p.id} className={`text-xs px-3 py-1 rounded-full border ${p.checked_in ? 'border-green-300 bg-green-50 text-green-700' : 'border-gray-200 bg-gray-50 text-gray-600'}`}>
                        {p.first_name} {p.last_name} {p.checked_in ? '✓' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
