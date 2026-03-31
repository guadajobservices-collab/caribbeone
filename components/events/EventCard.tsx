import Link from 'next/link'
import Image from 'next/image'
import { Event } from '@/types'
import { formatDateShort, islandLabel } from '@/lib/utils'

interface EventCardProps {
  event: Event
  size?: 'large' | 'small' | 'wide'
}

export default function EventCard({ event, size = 'small' }: EventCardProps) {
  const minPrice = event.packages && event.packages.length > 0
    ? Math.min(...event.packages.map(p => p.price_cents))
    : null

  const priceLabel = minPrice !== null ? `dès ${(minPrice / 100).toFixed(0)}€` : 'Gratuit'

  if (size === 'large') {
    return (
      <Link
        href={`/evenements/${event.slug}`}
        className="group block relative overflow-hidden"
        style={{
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 4px 24px rgba(13,59,74,0.10)',
          aspectRatio: '16/9',
        }}
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
            style={{ background: 'linear-gradient(135deg, var(--color-ocean) 0%, #1a5a6a 100%)' }}
          >
            <span className="text-7xl opacity-40">🎵</span>
          </div>
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(13,59,74,0.92) 0%, rgba(13,59,74,0.2) 50%, transparent 100%)' }}
        />
        {/* Hover sauge overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{ background: 'var(--color-sauge)' }}
        />
        {/* Badge île */}
        <div className="absolute top-4 right-4">
          <span
            className="text-xs font-semibold px-3 py-1.5 text-white"
            style={{
              background: 'var(--color-sauge)',
              borderRadius: 'var(--radius-xl)',
              fontFamily: 'var(--font-body)',
            }}
          >
            {islandLabel(event.island)}
          </span>
        </div>
        {/* Content bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
          <p
            className="text-sm font-semibold mb-1"
            style={{ color: 'var(--color-corail)', fontFamily: 'var(--font-display)' }}
          >
            {formatDateShort(event.starts_at)}
          </p>
          <h3
            className="text-2xl md:text-3xl font-bold leading-tight text-white"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {event.title}
          </h3>
          <p className="text-sm mt-1" style={{ color: 'rgba(250,250,248,0.6)', fontFamily: 'var(--font-body)' }}>
            {event.location}
          </p>
        </div>
        {/* Prix */}
        {minPrice !== null && (
          <div className="absolute bottom-6 right-6 z-10">
            <span
              className="text-sm font-bold px-4 py-1.5"
              style={{
                background: 'var(--color-noir)',
                color: 'var(--color-coco)',
                borderRadius: 'var(--radius-xl)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {priceLabel}
            </span>
          </div>
        )}
      </Link>
    )
  }

  if (size === 'wide') {
    return (
      <Link
        href={`/evenements/${event.slug}`}
        className="group flex items-center gap-4 p-3 transition-all duration-300"
        style={{
          borderRadius: 'var(--radius-md)',
          background: 'var(--color-coco)',
          boxShadow: '0 2px 12px rgba(13,59,74,0.06)',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(13,59,74,0.12)'
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 12px rgba(13,59,74,0.06)'
        }}
      >
        <div
          className="relative flex-shrink-0 overflow-hidden"
          style={{ width: '80px', height: '60px', borderRadius: 'var(--radius-sm)' }}
        >
          {event.cover_image_url ? (
            <Image
              src={event.cover_image_url}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div style={{ background: 'var(--color-ocean)', width: '100%', height: '100%' }} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-semibold mb-0.5"
            style={{ color: 'var(--color-corail)', fontFamily: 'var(--font-display)' }}
          >
            {formatDateShort(event.starts_at)}
          </p>
          <h3
            className="font-semibold leading-tight truncate"
            style={{ color: 'var(--color-noir)', fontFamily: 'var(--font-body)' }}
          >
            {event.title}
          </h3>
          <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--color-muted)' }}>
            {event.location} · {islandLabel(event.island)}
          </p>
        </div>
        <div className="flex-shrink-0 text-right">
          {minPrice !== null && (
            <span
              className="text-sm font-bold"
              style={{ color: 'var(--color-corail)', fontFamily: 'var(--font-display)' }}
            >
              {priceLabel}
            </span>
          )}
          <p className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>→</p>
        </div>
      </Link>
    )
  }

  // Default: small card
  return (
    <Link
      href={`/evenements/${event.slug}`}
      className="group block overflow-hidden bg-white"
      style={{
        borderRadius: 'var(--radius-lg)',
        boxShadow: '0 4px 24px rgba(13,59,74,0.08)',
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(13,59,74,0.14)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 24px rgba(13,59,74,0.08)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
    >
      <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
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
            style={{ background: 'linear-gradient(135deg, var(--color-ocean) 0%, #1a5a6a 100%)' }}
          >
            <span className="text-5xl opacity-30">🎵</span>
          </div>
        )}
        {/* Hover sauge overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{ background: 'var(--color-sauge)' }}
        />
        {/* Badge île */}
        <span
          className="absolute top-3 right-3 text-xs font-semibold px-3 py-1 text-white"
          style={{
            borderRadius: 'var(--radius-xl)',
            background: 'var(--color-sauge)',
            fontFamily: 'var(--font-body)',
          }}
        >
          {islandLabel(event.island)}
        </span>
      </div>

      <div className="p-5">
        <div
          className="text-sm font-semibold uppercase tracking-wide mb-1"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-corail)' }}
        >
          {formatDateShort(event.starts_at)}
        </div>
        <h3
          className="text-xl font-bold mt-1 mb-2 leading-tight"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--color-noir)' }}
        >
          {event.title}
        </h3>
        <div className="flex justify-between items-center">
          <span className="text-sm" style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}>
            {event.location}
          </span>
          {minPrice !== null && (
            <span
              className="px-4 py-1.5 text-sm font-semibold"
              style={{
                background: 'var(--color-noir)',
                color: 'var(--color-coco)',
                borderRadius: 'var(--radius-xl)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {priceLabel}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
