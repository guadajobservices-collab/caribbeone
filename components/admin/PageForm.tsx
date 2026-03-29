'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface PageFormProps {
  pageId?: string
  initialData?: Record<string, unknown>
}

export function PageForm({ pageId, initialData }: PageFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    title: '',
    slug: '',
    content: '',
    status: 'draft',
    ...initialData,
  })

  const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      const url = pageId ? `/api/admin/pages/${pageId}` : '/api/admin/pages'
      const method = pageId ? 'PATCH' : 'POST'
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setMsg('✅ Enregistré !')
      if (!pageId && data.id) router.push(`/admin/pages/${data.id}`)
    } catch (err) {
      setMsg('❌ ' + (err instanceof Error ? err.message : 'Erreur'))
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: "'Nunito', sans-serif", fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#374151', display: 'block', marginBottom: 6 }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>Titre *</label>
          <input style={inputStyle} value={form.title as string} onChange={e => { set('title', e.target.value); if (!pageId) set('slug', slugify(e.target.value)) }} required />
        </div>
        <div>
          <label style={labelStyle}>Slug</label>
          <input style={inputStyle} value={form.slug as string} onChange={e => set('slug', e.target.value)} />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Contenu</label>
        <textarea style={{ ...inputStyle, minHeight: 300, resize: 'vertical' }} value={form.content as string} onChange={e => set('content', e.target.value)} />
      </div>

      <div style={{ marginBottom: 20, maxWidth: 200 }}>
        <label style={labelStyle}>Statut</label>
        <select style={inputStyle} value={form.status as string} onChange={e => set('status', e.target.value)}>
          <option value="draft">Brouillon</option>
          <option value="published">Publié</option>
        </select>
      </div>

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
