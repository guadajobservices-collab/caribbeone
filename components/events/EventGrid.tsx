import { Event } from '@/types'
import EventCard from './EventCard'

interface EventGridProps {
  events: Event[]
}

export default function EventGrid({ events }: EventGridProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-20">
        <p
          className="text-6xl mb-4"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-teal)', letterSpacing: '0.1em' }}
        >
          BIENTÔT
        </p>
        <p style={{ color: 'var(--color-muted)' }}>Les événements arrivent sur l&apos;île !</p>
      </div>
    )
  }

  const [first, second, third, fourth, ...rest] = events

  return (
    <div className="flex flex-col gap-1">
      {/* Row 1 : Grand (2/3) + Petit (1/3) */}
      {first && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
          <div className="md:col-span-2">
            <EventCard event={first} size="large" />
          </div>
          {second && (
            <div className="md:col-span-1">
              <EventCard event={second} size="large" />
            </div>
          )}
        </div>
      )}

      {/* Row 2 : 3 petits côte à côte */}
      {(third || fourth || rest[0]) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1">
          {third && <EventCard event={third} size="small" />}
          {fourth && <EventCard event={fourth} size="small" />}
          {rest[0] && <EventCard event={rest[0]} size="small" />}
        </div>
      )}

      {/* Row 3 : Full width horizontal pour les suivants */}
      {rest.slice(1).map(event => (
        <EventCard key={event.id} event={event} size="wide" />
      ))}
    </div>
  )
}
