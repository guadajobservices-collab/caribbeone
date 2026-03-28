import { getEventBySlug } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate, islandLabel, categoryLabel, formatPrice } from '@/lib/utils'
import { Package } from '@/types'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug).catch(() => null)
  return {
    title: event ? `${event.title} — CaribbeOne` : 'Événement — CaribbeOne',
    description: event?.description?.substring(0, 160),
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug).catch(() => null)
  if (!event) notFound()

  const packages = (event.packages || []) as (Package & { departure_points: { id: string; label: string; city: string; departure_time: string }[] })[]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
        <Link href="/" className="hover:text-[#8ab5a7]">Accueil</Link>
        <span>/</span>
        <Link href="/evenements" className="hover:text-[#8ab5a7]">Événements</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-xs">{event.title}</span>
      </nav>

      {event.cover_image_url && (
        <div className="relative h-64 md:h-96 rounded-3xl overflow-hidden mb-8">
          <Image src={event.cover_image_url} alt={event.title} fill className="object-cover" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-[#8ab5a7]/10 text-[#8ab5a7] text-xs font-semibold px-3 py-1 rounded-full">{categoryLabel(event.category)}</span>
            <span className="bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full">📍 {islandLabel(event.island)}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#1a1a1a] mb-4">{event.title}</h1>
          <div className="space-y-2 text-gray-600 mb-6">
            <p className="flex items-center gap-2"><span>📅</span><span>{formatDate(event.starts_at)}</span></p>
            <p className="flex items-center gap-2"><span>📍</span><span>{event.venue}</span></p>
          </div>
          {event.description && (
            <div>
              <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">À propos</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Packs disponibles</h2>
          {packages.length === 0 ? (
            <p className="text-gray-400 text-sm">Aucun pack disponible.</p>
          ) : (
            <div className="space-y-4">
              {packages.map((pkg: Package) => (
                <div key={pkg.id} className="border border-gray-200 rounded-2xl p-4 hover:border-[#8ab5a7] transition-colors">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-[#1a1a1a] text-sm">{pkg.name}</h3>
                    {pkg.is_promo && <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-semibold">PROMO</span>}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {pkg.transport_mode && (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
                        {pkg.transport_mode === 'ferry' ? '⛵ Ferry' : pkg.transport_mode === 'navette' ? '🚌 Navette' : '✈️ Vol'}
                      </span>
                    )}
                    {pkg.includes_accommodation && <span className="text-xs bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full">🏨 Hébergement</span>}
                    {pkg.is_diaspora && <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">✈️ Diaspora</span>}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xl font-black text-[#1a1a1a]">{formatPrice(pkg.price_cents)}</span>
                      <span className="text-xs text-gray-400 ml-1">/ pers.</span>
                    </div>
                    <span className={`text-xs ${pkg.stock > 10 ? 'text-green-600' : pkg.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                      {pkg.stock > 0 ? `${pkg.stock} places` : 'Complet'}
                    </span>
                  </div>
                  {pkg.stock > 0 && (
                    <Link href={`/evenements/${event.slug}/reserver?pack=${pkg.id}`}
                      className="mt-3 w-full bg-[#8ab5a7] text-white py-2.5 rounded-xl text-sm font-bold text-center hover:opacity-90 block">
                      Réserver ce pack
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
