'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

const ISLANDS = ['guadeloupe','martinique','marie-galante','les-saintes','metropole']
const CATEGORIES = ['musique','culture','gastronomie','carnaval','sport','arts']

export default function NouvelEvenementPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    title: '', slug: '', category: 'musique', island: 'guadeloupe',
    venue: '', starts_at: '', ends_at: '', description: '', status: 'draft'
  })

  const generateSlug = (title: string) =>
    title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/organisateur/evenements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      router.push(`/organisateur/evenements/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-[#1a1a1a] mb-8">Créer un événement</h1>
      <form onSubmit={handleSubmit} className="space-y-5 max-w-xl">
        {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Titre *</label>
          <input type="text" value={form.title} required
            onChange={e => setForm({...form, title: e.target.value, slug: generateSlug(e.target.value)})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]"
            placeholder="Festival Gwoka 2026" />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Slug URL *</label>
          <input type="text" value={form.slug} required
            onChange={e => setForm({...form, slug: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7] font-mono"
            placeholder="festival-gwoka-2026" />
          <p className="text-xs text-gray-400 mt-1">URL : /evenements/{form.slug || '...'}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Catégorie *</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7] bg-white">
              {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Île *</label>
            <select value={form.island} onChange={e => setForm({...form, island: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7] bg-white">
              {ISLANDS.map(i => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Lieu *</label>
          <input type="text" value={form.venue} required
            onChange={e => setForm({...form, venue: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]"
            placeholder="Stade René Serge Nabajoth, Guadeloupe" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Date/heure début *</label>
            <input type="datetime-local" value={form.starts_at} required
              onChange={e => setForm({...form, starts_at: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]" />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Date/heure fin</label>
            <input type="datetime-local" value={form.ends_at}
              onChange={e => setForm({...form, ends_at: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]" />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
          <textarea value={form.description} rows={4}
            onChange={e => setForm({...form, description: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7] resize-none"
            placeholder="Décrivez votre événement..." />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-700 block mb-1">Statut</label>
          <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7] bg-white">
            <option value="draft">📝 Brouillon (non visible)</option>
            <option value="pending">⏳ Soumettre pour validation</option>
          </select>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="flex-1 bg-[#8ab5a7] text-white py-3 rounded-xl font-bold hover:opacity-90 disabled:opacity-40">
            {loading ? 'Création...' : 'Créer l\'événement'}
          </button>
          <button type="button" onClick={() => router.back()}
            className="px-5 border border-gray-200 rounded-xl text-gray-600 hover:border-gray-400">
            Annuler
          </button>
        </div>
      </form>
    </div>
  )
}
