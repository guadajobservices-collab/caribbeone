import { db } from '@/lib/db'
import { formatDateShort } from '@/lib/utils'
import AdminEventActions from '@/components/admin/AdminEventActions'

export const metadata = { title: 'Modération — CaribbeOne Admin' }

export default async function AdminEvenementsPage() {
  const events = await db`
    SELECT e.*, p.first_name, p.last_name, p.email
    FROM events e
    LEFT JOIN profiles p ON p.id = e.organizer_id
    ORDER BY e.created_at DESC
  `.catch(() => []) as {
    id: string; title: string; slug: string; island: string; status: string;
    starts_at: string; first_name: string; last_name: string; email: string
  }[]

  return (
    <div>
      <h1 className="text-2xl font-black text-[#1a1a1a] mb-6">Modération des événements</h1>
      <div className="space-y-3">
        {events.map(event => (
          <div key={event.id} className="border border-gray-100 rounded-2xl p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    event.status === 'published' ? 'bg-green-100 text-green-700' :
                    event.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    event.status === 'draft' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'
                  }`}>{event.status}</span>
                </div>
                <h3 className="font-bold text-[#1a1a1a]">{event.title}</h3>
                <p className="text-xs text-gray-400 mt-0.5">
                  {formatDateShort(event.starts_at)} · {event.island} ·
                  Organisateur : {event.first_name} {event.last_name} ({event.email})
                </p>
              </div>
              <AdminEventActions eventId={event.id} currentStatus={event.status} />
            </div>
          </div>
        ))}
        {events.length === 0 && <p className="text-gray-400 text-center py-8">Aucun événement.</p>}
      </div>
    </div>
  )
}
