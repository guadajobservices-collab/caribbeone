import Link from 'next/link'
import Image from 'next/image'
import { Event } from '@/types'
import { formatDateShort, islandLabel, categoryLabel } from '@/lib/utils'

export default function EventCard({ event }: { event: Event }) {
  const minPrice = event.packages && event.packages.length > 0
    ? Math.min(...event.packages.map(p => p.price_cents))
    : null

  return (
    <Link href={`/evenements/${event.slug}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="relative h-48 bg-gradient-to-br from-[#1a1a1a] to-[#2d4a44]">
        {event.cover_image_url ? (
          <Image
            src={event.cover_image_url}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-5xl">{event.category === 'musique' ? '🎵' : event.category === 'carnaval' ? '🎉' : '🌴'}</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-[#1a1a1a]/80 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
            {categoryLabel(event.category)}
          </span>
        </div>
        {minPrice && (
          <div className="absolute bottom-3 right-3">
            <span className="bg-[#8ab5a7] text-white text-sm font-bold px-3 py-1 rounded-full">
              dès {(minPrice / 100).toFixed(0)}€
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 text-xs text-[#8ab5a7] font-medium mb-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {islandLabel(event.island)}
        </div>
        <h3 className="font-bold text-[#1a1a1a] text-base leading-tight mb-2 group-hover:text-[#8ab5a7] transition-colors line-clamp-2">
          {event.title}
        </h3>
        <p className="text-xs text-gray-500 mb-3">
          📅 {formatDateShort(event.starts_at)} · 📍 {event.venue}
        </p>
        {event.packages && event.packages.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {event.packages.slice(0, 3).map(p => (
              <span key={p.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {p.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  )
}
