import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getEventsByOrganizer } from '@/lib/db'
import Link from 'next/link'
import { formatDateShort, formatPrice } from '@/lib/utils'

export const metadata = { title: 'Mes événements — CaribbeOne' }

export default async function EvenementsOrganisateurPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  const events = await getEventsByOrganizer(user.id).catch(() => [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-black text-[#1a1a1a]">Mes événements</h1>
        <Link href="/organisateur/evenements/nouveau"
          className="bg-[#8ab5a7] text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:opacity-90">
          + Nouveau
        </Link>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl text-gray-400">
          <div className="text-5xl mb-4">🎪</div>
          <p>Aucun événement créé.</p>
          <Link href="/organisateur/evenements/nouveau"
            className="mt-4 inline-block bg-[#8ab5a7] text-white px-6 py-3 rounded-xl font-bold text-sm">
            Créer mon premier événement
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map(event => (
            <div key={event.id} className="border border-gray-100 rounded-2xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      event.status === 'published' ? 'bg-green-100 text-green-700' :
                      event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      event.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                    }`}>
                      {event.status === 'published' ? '✅ Publié' :
                       event.status === 'pending' ? '⏳ En attente validation' :
                       event.status === 'draft' ? '📝 Brouillon' : '❌ Annulé'}
                    </span>
                  </div>
                  <h3 className="font-black text-[#1a1a1a]">{event.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{formatDateShort(event.starts_at)} · {event.venue}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {(event.packages?.length || 0)} pack(s) ·
                    {Number(event.total_orders) || 0} réservation(s) ·
                    <span className="text-[#8ab5a7] font-semibold ml-1">{formatPrice(Number(event.total_revenue_cents) || 0)}</span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/evenements/${event.slug}`} target="_blank"
                    className="text-xs border border-gray-200 text-gray-600 px-3 py-1.5 rounded-lg hover:border-gray-400">
                    👁 Voir
                  </Link>
                  <Link href={`/organisateur/evenements/${event.id}`}
                    className="text-xs bg-[#1a1a1a] text-white px-3 py-1.5 rounded-lg hover:opacity-80">
                    ✏️ Éditer
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
