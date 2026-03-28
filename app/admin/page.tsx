import { db } from '@/lib/db'
import { formatPrice } from '@/lib/utils'

export const metadata = { title: 'Admin Dashboard — CaribbeOne' }

export default async function AdminPage() {
  const stats = await db`
    SELECT
      (SELECT COUNT(*) FROM events) AS total_events,
      (SELECT COUNT(*) FROM events WHERE status = 'published') AS published_events,
      (SELECT COUNT(*) FROM events WHERE status = 'pending') AS pending_events,
      (SELECT COUNT(*) FROM profiles) AS total_users,
      (SELECT COUNT(*) FROM orders WHERE status = 'paid') AS paid_orders,
      (SELECT COALESCE(SUM(total_cents),0) FROM orders WHERE status = 'paid') AS total_revenue
  `.catch(() => [{ total_events: 0, published_events: 0, pending_events: 0, total_users: 0, paid_orders: 0, total_revenue: 0 }])

  const s = stats[0] as { total_events: number; published_events: number; pending_events: number; total_users: number; paid_orders: number; total_revenue: number }

  return (
    <div>
      <h1 className="text-2xl font-black text-[#1a1a1a] mb-8">Dashboard Admin</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Événements total', value: s.total_events, icon: '🎪' },
          { label: 'Publiés', value: s.published_events, icon: '✅', color: 'text-green-600' },
          { label: 'En attente', value: s.pending_events, icon: '⏳', color: 'text-yellow-600' },
          { label: 'Utilisateurs', value: s.total_users, icon: '👥' },
          { label: 'Réservations payées', value: s.paid_orders, icon: '🎫' },
          { label: 'GMV', value: formatPrice(Number(s.total_revenue)), icon: '💰', color: 'text-[#8ab5a7]' },
        ].map(stat => (
          <div key={stat.label} className="bg-gray-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className={`text-2xl font-black ${stat.color || 'text-[#1a1a1a]'}`}>{stat.value}</div>
            <div className="text-xs text-gray-500 mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
