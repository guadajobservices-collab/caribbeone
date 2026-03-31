'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Island { id: string; name: string }
interface Category { id: string; name: string }
interface MusicStyle { id: string; name: string }

interface EventFormProps {
  eventId?: string
  initialData?: Record<string, unknown>
}

export default function EventForm({ eventId, initialData }: EventFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [islands, setIslands] = useState<Island[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [musicStyles, setMusicStyles] = useState<MusicStyle[]>([])

  const [form, setForm] = useState({
    title: '',
    slug: '',
    description: '',
    short_description: '',
    start_date: '',
    end_date: '',
    location: '',
    address: '',
    island_id: '',
    category_id: '',
    music_style_id: '',
    cover_image: '',
    status: 'draft',
    ...initialData,
  })

  useEffect(() => {
    fetch('/api/admin/evenements/meta').then(r => r.json()).then(d => {
      setIslands(d.islands || [])
      setCategories(d.categories || [])
      setMusicStyles(d.musicStyles || [])
    }).catch(() => {})
  }, [])

  const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      const url = eventId ? `/api/admin/evenements/${eventId}` : '/api/admin/evenements'
      const method = eventId ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setMsg('✅ Enregistré !')
      if (!eventId && data.id) router.push(`/admin/evenements/${data.id}`)
    } catch (err) {
      setMsg('❌ ' + (err instanceof Error ? err.message : 'Erreur'))
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: "'Nunito', sans-serif", fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#374151', display: 'block', marginBottom: 6 }
  const fieldStyle = { marginBottom: 20 }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Titre *</label>
          <input style={inputStyle} value={form.title as string} onChange={e => { set('title', e.target.value); if (!eventId) set('slug', slugify(e.target.value)) }} required />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Slug</label>
          <input style={inputStyle} value={form.slug as string} onChange={e => set('slug', e.target.value)} />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Description courte</label>
        <input style={inputStyle} value={form.short_description as string} onChange={e => set('short_description', e.target.value)} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Description complète</label>
        <textarea style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }} value={form.description as string} onChange={e => set('description', e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Date de début</label>
          <input type="datetime-local" style={inputStyle} value={form.start_date as string} onChange={e => set('start_date', e.target.value)} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Date de fin</label>
          <input type="datetime-local" style={inputStyle} value={form.end_date as string} onChange={e => set('end_date', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Lieu</label>
          <input style={inputStyle} value={form.location as string} onChange={e => set('location', e.target.value)} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Adresse</label>
          <input style={inputStyle} value={form.address as string} onChange={e => set('address', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Île</label>
          <select style={inputStyle} value={form.island_id as string} onChange={e => set('island_id', e.target.value)}>
            <option value="">— Sélectionner —</option>
            {islands.map(i => <option key={i.id} value={i.id}>{i.name}</option>)}
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Catégorie</label>
          <select style={inputStyle} value={form.category_id as string} onChange={e => set('category_id', e.target.value)}>
            <option value="">— Sélectionner —</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Style musical</label>
          <select style={inputStyle} value={form.music_style_id as string} onChange={e => set('music_style_id', e.target.value)}>
            <option value="">— Sélectionner —</option>
            {musicStyles.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>URL image de couverture</label>
          <input style={inputStyle} type="url" value={form.cover_image as string} onChange={e => set('cover_image', e.target.value)} placeholder="https://..." />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Statut</label>
          <select style={inputStyle} value={form.status as string} onChange={e => set('status', e.target.value)}>
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="archived">Archivé</option>
          </select>
        </div>
      </div>

      {form.cover_image && (
        <div style={{ marginBottom: 20 }}>
          <img src={form.cover_image as string} alt="Aperçu" style={{ height: 120, borderRadius: 8, objectFit: 'cover' }} />
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button type="submit" disabled={loading} style={{
          background: '#E07560', color: '#FFFFFF', padding: '12px 32px',
          borderRadius: 40, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem', opacity: loading ? 0.6 : 1,
        }}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        {msg && <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem' }}>{msg}</span>}
      </div>
    </form>
  )
}
