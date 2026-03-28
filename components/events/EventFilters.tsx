'use client'
import { useRouter, useSearchParams } from 'next/navigation'

const ISLANDS = [
  { value: '', label: 'Toutes les îles' },
  { value: 'guadeloupe', label: '🌴 Guadeloupe' },
  { value: 'martinique', label: '🌺 Martinique' },
  { value: 'marie-galante', label: '⛵ Marie-Galante' },
  { value: 'les-saintes', label: '🏝️ Les Saintes' },
]

const CATEGORIES = [
  { value: '', label: 'Toutes catégories' },
  { value: 'musique', label: '🎵 Musique' },
  { value: 'culture', label: '🎭 Culture' },
  { value: 'gastronomie', label: '🍽️ Gastronomie' },
  { value: 'carnaval', label: '🎉 Carnaval' },
  { value: 'sport', label: '⚽ Sport' },
  { value: 'arts', label: '🎨 Arts' },
]

export default function EventFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    router.push(`/evenements?${params.toString()}`)
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-8">
      <div className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#8ab5a7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span className="text-sm font-semibold text-gray-700">Filtrer :</span>
        </div>

        <select
          value={searchParams.get('island') || ''}
          onChange={e => updateFilter('island', e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8ab5a7] bg-white"
        >
          {ISLANDS.map(i => <option key={i.value} value={i.value}>{i.label}</option>)}
        </select>

        <select
          value={searchParams.get('category') || ''}
          onChange={e => updateFilter('category', e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8ab5a7] bg-white"
        >
          {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>

        <input
          type="date"
          value={searchParams.get('date') || ''}
          onChange={e => updateFilter('date', e.target.value)}
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#8ab5a7] bg-white"
        />

        {(searchParams.get('island') || searchParams.get('category') || searchParams.get('date')) && (
          <button
            onClick={() => router.push('/evenements')}
            className="text-sm text-gray-400 hover:text-gray-600 flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Effacer
          </button>
        )}
      </div>
    </div>
  )
}
