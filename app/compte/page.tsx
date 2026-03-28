import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getOrdersByUser, getProfile } from '@/lib/db'
import Link from 'next/link'
import { formatPrice, formatDateShort } from '@/lib/utils'

export const metadata = { title: 'Mon compte — CaribbeOne' }

export default async function ComptePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  const [profile, orders] = await Promise.all([
    getProfile(user.id).catch(() => null),
    getOrdersByUser(user.id).catch(() => []),
  ])

  const recentOrders = orders.slice(0, 3)
  const totalSpent = orders.filter(o => o.status === 'paid').reduce((s, o) => s + o.total_cents, 0)

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-14 h-14 bg-[#8ab5a7] rounded-full flex items-center justify-center text-white text-2xl font-black">
          {(profile?.first_name?.[0] || user.email?.[0] || '?').toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-black text-[#1a1a1a]">
            Bonjour, {profile?.first_name || 'Caribéen'} 👋
          </h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-[#1a1a1a]">{orders.length}</div>
          <div className="text-xs text-gray-500 mt-1">Réservations</div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-[#8ab5a7]">{formatPrice(totalSpent)}</div>
          <div className="text-xs text-gray-500 mt-1">Total dépensé</div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 text-center hidden md:block">
          <div className="text-2xl font-black text-[#1a1a1a]">
            {orders.reduce((s, o) => s + o.participant_count, 0)}
          </div>
          <div className="text-xs text-gray-500 mt-1">Billets achetés</div>
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-[#1a1a1a]">Réservations récentes</h2>
          <Link href="/compte/reservations" className="text-sm text-[#8ab5a7] hover:underline">Tout voir</Link>
        </div>
        {recentOrders.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-2xl text-gray-400">
            <div className="text-4xl mb-3">🎫</div>
            <p>Vous n&apos;avez pas encore de réservation.</p>
            <Link href="/evenements" className="mt-4 inline-block bg-[#8ab5a7] text-white px-5 py-2.5 rounded-xl text-sm font-bold">
              Voir les événements
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentOrders.map(order => (
              <div key={order.id} className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:border-[#8ab5a7] transition-colors">
                <div>
                  <p className="font-bold text-[#1a1a1a] text-sm">{order.package?.event?.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {formatDateShort(order.package?.event?.starts_at || '')} · {order.package?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#1a1a1a]">{formatPrice(order.total_cents)}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    order.status === 'paid' ? 'bg-green-100 text-green-700' :
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {order.status === 'paid' ? 'Payé' : order.status === 'pending' ? 'En attente' : 'Annulé'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
