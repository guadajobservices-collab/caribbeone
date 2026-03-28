import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getEventsByOrganizer, getProfile } from '@/lib/db'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

export const metadata = { title: 'Dashboard Organisateur — CaribbeOne' }

export default async function OrganisateurPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  const profile = await getProfile(user.id).catch(() => null)
  if (profile?.role === 'client') redirect('/compte')

  const events = await getEventsByOrganizer(user.id).catch(() => [])

  const totalRevenue = events.reduce((s, e) => s + (Number(e.total_revenue_cents) || 0), 0)
  const totalOrders = events.reduce((s, e) => s + (Number(e.total_orders) || 0), 0)
  const publishedCount = events.filter(e => e.status === 'published').length

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-[#1a1a1a]">Tableau de bord</h1>
          <p className="text-gray-400 text-sm">Bonjour, {profile?.first_name || user.email}</p>
        </div>
        <Link href="/organisateur/evenements/nouveau"
          className="bg-[#8ab5a7] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90">
          + Créer un événement
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Événements', value: events.length, icon: '🎪' },
          { label: 'Publiés', value: publishedCount, icon: '✅' },
          { label: 'Réservations', value: totalOrders, icon: '🎫' },
          { label: 'Revenus', value: formatPrice(totalRevenue), icon: '💰' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-gray-50 rounded-2xl p-4 text-center">
            <div className="text-2xl mb-1">{kpi.icon}</div>
            <div className="text-xl font-black text-[#1a1a1a]">{kpi.value}</div>
            <div className="text-xs text-gray-500">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Events list */}
      <h2 className="font-bold text-[#1a1a1a] mb-4">Mes événements récents</h2>
      {events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-2xl text-gray-400">
          <div className="text-4xl mb-3">🎪</div>
          <p>Aucun événement. Créez votre premier !</p>
          <Link href="/organisateur/evenements/nouveau"
            className="mt-4 inline-block bg-[#8ab5a7] text-white px-5 py-2.5 rounded-xl text-sm font-bold">
            Créer un événement
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.slice(0, 5).map(event => (
            <div key={event.id} className="border border-gray-100 rounded-2xl p-4 flex items-center justify-between hover:border-[#8ab5a7] transition-colors">
              <div>
                <h3 className="font-bold text-[#1a1a1a]">{event.title}</h3>
                <p className="text-sm text-gray-400">{event.venue} · {event.island}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                  event.status === 'published' ? 'bg-green-100 text-green-700' :
                  event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-gray-100 text-gray-600'
                }`}>
                  {event.status === 'published' ? '✅ Publié' :
                   event.status === 'pending' ? '⏳ En attente' :
                   event.status === 'draft' ? '📝 Brouillon' : '❌ Annulé'}
                </span>
                <Link href={`/organisateur/evenements/${event.id}`}
                  className="text-xs text-[#8ab5a7] hover:underline font-medium">Éditer →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
