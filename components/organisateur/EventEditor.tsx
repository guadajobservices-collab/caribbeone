'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Event, Package } from '@/types'
import { formatPrice } from '@/lib/utils'

interface Props {
  event: Event & { packages: (Package & { departure_points: { id: string; label: string; city: string; island: string; departure_time: string; return_time?: string }[] })[] }
}

export default function EventEditor({ event }: Props) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [form, setForm] = useState<{title:string;slug:string;category:string;island:string;venue?:string;location?:string;description:string;starts_at:string;ends_at:string;status:string}>({
    title: event.title, slug: event.slug, category: event.category,
    island: event.island, venue: event.venue, description: event.description || '',
    starts_at: event.starts_at.substring(0, 16), ends_at: event.ends_at?.substring(0, 16) || '',
    status: event.status,
  })
  const [showPackForm, setShowPackForm] = useState(false)
  const [newPack, setNewPack] = useState({ name: '', price_cents: '', stock: '50', transport_mode: '', includes_accommodation: false, is_diaspora: false })

  const handleSave = async () => {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch(`/api/organisateur/evenements/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { setMessage('✅ Sauvegardé !'); router.refresh() }
      else { const d = await res.json(); setMessage('❌ ' + (d.error || 'Erreur')) }
    } finally { setSaving(false) }
  }

  const handleAddPack = async () => {
    if (!newPack.name || !newPack.price_cents) return
    try {
      const res = await fetch(`/api/organisateur/evenements/${event.id}/packs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newPack,
          price_cents: Math.round(parseFloat(newPack.price_cents) * 100),
          stock: parseInt(newPack.stock) || 50,
        }),
      })
      if (res.ok) { setShowPackForm(false); router.refresh() }
    } catch { setMessage('❌ Erreur ajout pack') }
  }

  return (
    <div className="max-w-2xl space-y-6">
      {message && (
        <div className={`px-4 py-3 rounded-xl text-sm ${message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      {/* Infos générales */}
      <div className="border border-gray-200 rounded-2xl p-5">
        <h2 className="font-bold text-[#1a1a1a] mb-4">Informations générales</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Titre</label>
            <input value={form.title} onChange={e => setForm({...form, title: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Catégorie</label>
              <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]">
                {['musique','culture','gastronomie','carnaval','sport','arts'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Île</label>
              <select value={form.island} onChange={e => setForm({...form, island: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]">
                {['guadeloupe','martinique','marie-galante','les-saintes','metropole'].map(i => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Lieu</label>
            <input value={form.venue} onChange={e => setForm({...form, venue: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Début</label>
              <input type="datetime-local" value={form.starts_at} onChange={e => setForm({...form, starts_at: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]" />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Fin</label>
              <input type="datetime-local" value={form.ends_at} onChange={e => setForm({...form, ends_at: e.target.value})}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]" />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Description</label>
            <textarea value={form.description} rows={3} onChange={e => setForm({...form, description: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7] resize-none" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 block mb-1">Statut</label>
            <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]">
              <option value="draft">📝 Brouillon</option>
              <option value="pending">⏳ En attente validation</option>
            </select>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="mt-4 bg-[#8ab5a7] text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-40">
          {saving ? 'Sauvegarde...' : 'Sauvegarder'}
        </button>
      </div>

      {/* Packs */}
      <div className="border border-gray-200 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-[#1a1a1a]">Packs ({event.packages?.length || 0})</h2>
          <button onClick={() => setShowPackForm(!showPackForm)}
            className="text-sm bg-[#1a1a1a] text-white px-3 py-1.5 rounded-lg hover:opacity-80">
            + Ajouter un pack
          </button>
        </div>

        {showPackForm && (
          <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-700">Nouveau pack</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Nom *</label>
                <input value={newPack.name} onChange={e => setNewPack({...newPack, name: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]"
                  placeholder="Ferry + Billet" />
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Prix (€) *</label>
                <input type="number" value={newPack.price_cents} min="1" step="0.01"
                  onChange={e => setNewPack({...newPack, price_cents: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]"
                  placeholder="89.00" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Transport</label>
                <select value={newPack.transport_mode} onChange={e => setNewPack({...newPack, transport_mode: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]">
                  <option value="">Aucun</option>
                  <option value="ferry">⛵ Ferry</option>
                  <option value="navette">🚌 Navette</option>
                  <option value="vol">✈️ Vol</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Places</label>
                <input type="number" value={newPack.stock} min="1"
                  onChange={e => setNewPack({...newPack, stock: e.target.value})}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]" />
              </div>
            </div>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={newPack.includes_accommodation}
                  onChange={e => setNewPack({...newPack, includes_accommodation: e.target.checked})}
                  className="accent-[#8ab5a7]" />
                🏨 Hébergement inclus
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={newPack.is_diaspora}
                  onChange={e => setNewPack({...newPack, is_diaspora: e.target.checked})}
                  className="accent-[#8ab5a7]" />
                ✈️ Pack Diaspora
              </label>
            </div>
            <div className="flex gap-2">
              <button onClick={handleAddPack} className="bg-[#8ab5a7] text-white px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90">
                Ajouter
              </button>
              <button onClick={() => setShowPackForm(false)} className="text-sm text-gray-400 hover:text-gray-600 px-3">Annuler</button>
            </div>
          </div>
        )}

        {event.packages?.length === 0 ? (
          <p className="text-sm text-gray-400">Aucun pack configuré. Ajoutez un pack pour recevoir des réservations.</p>
        ) : (
          <div className="space-y-2">
            {event.packages?.map(pkg => (
              <div key={pkg.id} className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div>
                  <p className="font-semibold text-sm text-[#1a1a1a]">{pkg.name}</p>
                  <p className="text-xs text-gray-400">{formatPrice(pkg.price_cents)} · {pkg.stock} places</p>
                </div>
                <div className="flex gap-2 items-center">
                  {pkg.transport_mode && <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{pkg.transport_mode}</span>}
                  {pkg.is_diaspora && <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">diaspora</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex gap-3 pb-8">
        <a href={`/evenements/${event.slug}`} target="_blank"
          className="border border-gray-200 text-gray-600 px-5 py-2.5 rounded-xl font-semibold text-sm hover:border-gray-400">
          👁 Voir la page publique
        </a>
      </div>
    </div>
  )
}
