import Link from 'next/link'
import Image from 'next/image'
import { Event } from '@/types'
import { formatDateShort, islandLabel, categoryLabel } from '@/lib/utils'

interface EventCardProps {
  event: Event
  size?: 'large' | 'small' | 'wide'
}

export default function EventCard({ event, size = 'small' }: EventCardProps) {
  const minPrice = event.packages && event.packages.length > 0
    ? Math.min(...event.packages.map(p => p.price_cents))
    : null

  const isGuadeloupe = event.island === 'guadeloupe'
  const badgeColor = isGuadeloupe ? 'var(--color-teal)' : 'var(--color-accent)'

  if (size === 'large') {
    return (
      <Link
        href={`/evenements/${event.slug}`}
        className="group block relative overflow-hidden"
        style={{ background: '#1A1A1A', aspectRatio: '16/9' }}
      >
        {event.cover_image_url ? (
          <Image
            src={event.cover_image_url}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2d4a44 100%)' }}
          >
            <span className="text-7xl opacity-30">🎵</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.92) 0%, rgba(13,13,13,0.3) 50%, transparent 100%)' }}
        />
        {/* Teal hover overlay */}
        <div className="event-card-overlay" />
        {/* Badge île */}
        <div className="absolute top-4 left-4">
          <span
            className="text-xs font-medium px-3 py-1"
            style={{
              background: badgeColor,
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.06em',
            }}
          >
            {islandLabel(event.island).toUpperCase()}
          </span>
        </div>
        {/* Prix */}
        {minPrice !== null && (
          <div className="absolute top-4 right-4">
            <span
              className="text-sm font-bold px-3 py-1"
              style={{
                background: 'var(--color-accent)',
                color: '#fff',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.04em',
              }}
            >
              dès {(minPrice / 100).toFixed(0)}€
            </span>
          </div>
        )}
        {/* Content bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <p
            className="text-sm mb-1"
            style={{ color: 'var(--color-teal)', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}
          >
            {formatDateShort(event.starts_at).toUpperCase()} — {event.venue.toUpperCase()}
          </p>
          <h3
            className="text-2xl md:text-3xl font-bold leading-tight"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
          >
            {event.title}
          </h3>
        </div>
      </Link>
    )
  }

  if (size === 'wide') {
    return (
      <Link
        href={`/evenements/${event.slug}`}
        className="group flex items-center overflow-hidden border-t transition-all duration-300"
        style={{
          borderColor: 'rgba(247,243,238,0.08)',
          padding: '1.25rem 0',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-teal)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(247,243,238,0.08)'
        }}
      >
        <div className="relative w-24 h-16 flex-shrink-0 overflow-hidden">
          {event.cover_image_url ? (
            <Image
              src={event.cover_image_url}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div style={{ background: '#1A1A1A', width: '100%', height: '100%' }} />
          )}
        </div>
        <div className="flex-1 px-4">
          <p
            className="text-xs mb-1"
            style={{ color: 'var(--color-teal)', fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}
          >
            {formatDateShort(event.starts_at).toUpperCase()}
          </p>
          <h3
            className="font-semibold leading-tight"
            style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
          >
            {event.title}
          </h3>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
            {event.venue} · {islandLabel(event.island)}
          </p>
        </div>
        <div className="flex-shrink-0 text-right pr-2">
          {minPrice !== null && (
            <span
              className="text-sm font-bold"
              style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
            >
              {(minPrice / 100).toFixed(0)}€
            </span>
          )}
          <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>
            →
          </p>
        </div>
      </Link>
    )
  }

  // Default: small card
  return (
    <Link
      href={`/evenements/${event.slug}`}
      className="group block relative overflow-hidden"
      style={{ background: '#111' }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {event.cover_image_url ? (
          <Image
            src={event.cover_image_url}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2d4a44 100%)' }}
          >
            <span className="text-5xl opacity-20">🎵</span>
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.7) 0%, transparent 60%)' }}
        />
        {/* Teal hover */}
        <div className="event-card-overlay" />
        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span
            className="text-xs px-2 py-0.5"
            style={{
              background: badgeColor,
              color: 'var(--color-primary)',
              fontFamily: 'var(--font-display)',
              letterSpacing: '0.05em',
            }}
          >
            {islandLabel(event.island).toUpperCase()}
          </span>
        </div>
      </div>
      <div className="p-4">
        <p
          className="text-xs mb-1"
          style={{ color: 'var(--color-teal)', fontFamily: 'var(--font-display)', letterSpacing: '0.07em' }}
        >
          {formatDateShort(event.starts_at).toUpperCase()}
        </p>
        <h3
          className="font-semibold text-base leading-tight mb-1 group-hover:opacity-80 transition-opacity"
          style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
        >
          {event.title}
        </h3>
        <p className="text-xs" style={{ color: 'var(--color-muted)' }}>
          {event.venue}
        </p>
        {minPrice !== null && (
          <p
            className="text-sm font-bold mt-2"
            style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
          >
            dès {(minPrice / 100).toFixed(0)}€
          </p>
        )}
      </div>
    </Link>
  )
}
