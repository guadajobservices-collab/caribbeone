import { getPublishedEvents } from '@/lib/db'
import EventCard from '@/components/events/EventCard'
import EventFilters from '@/components/events/EventFilters'
import { Suspense } from 'react'
import { Event, Package } from '@/types'

export const metadata = {
  title: 'Événements — CaribbeOne',
  description: 'Découvrez tous les événements caribéens.',
}

interface Props {
  searchParams: Promise<{ island?: string; category?: string; date?: string; q?: string }>
}

async function EventsList({ searchParams }: Props) {
  const params = await searchParams
  let events: (Event & { packages: Package[] })[] = []
  try {
    events = await getPublishedEvents(params)
  } catch {
    return <div className="text-center py-16 text-red-400">Erreur lors du chargement.</div>
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <div className="text-6xl mb-4">🌴</div>
        <p className="text-lg font-semibold">Aucun événement trouvé</p>
        <p className="text-sm mt-2">Modifiez vos filtres ou revenez prochainement.</p>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map(event => <EventCard key={event.id} event={event} />)}
    </div>
  )
}

export default async function EventsPage({ searchParams }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-[#1a1a1a]">Événements Caraïbes 🌴</h1>
        <p className="text-gray-500 mt-1">Concerts, festivals, carnavals, gastronomie...</p>
      </div>
      <Suspense fallback={<div className="h-16 bg-gray-100 rounded-2xl animate-pulse mb-8" />}>
        <EventFilters />
      </Suspense>
      <Suspense fallback={
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />)}
        </div>
      }>
        <EventsList searchParams={searchParams} />
      </Suspense>
    </div>
  )
}
