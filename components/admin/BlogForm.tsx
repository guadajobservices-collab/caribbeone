'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface BlogFormProps {
  postId?: string
  initialData?: Record<string, unknown>
}

export default function BlogForm({ postId, initialData }: BlogFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const tagsValue = Array.isArray(initialData?.tags) ? (initialData.tags as string[]).join(', ') : (initialData?.tags as string || '')
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    cover_image: '',
    category: '',
    status: 'draft',
    ...initialData,
    tags: tagsValue,
  })

  const slugify = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      const url = postId ? `/api/admin/blog/${postId}` : '/api/admin/blog'
      const method = postId ? 'PATCH' : 'POST'
      const body = {
        ...form,
        tags: form.tags ? (form.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      }
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setMsg('✅ Enregistré !')
      if (!postId && data.id) router.push(`/admin/blog/${data.id}`)
    } catch (err) {
      setMsg('❌ ' + (err instanceof Error ? err.message : 'Erreur'))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!postId || !confirm('Supprimer cet article ?')) return
    await fetch(`/api/admin/blog/${postId}`, { method: 'DELETE' })
    router.push('/admin/blog')
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: "'Nunito', sans-serif", fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#374151', display: 'block', marginBottom: 6 }
  const fieldStyle = { marginBottom: 20 }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 800 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Titre *</label>
          <input style={inputStyle} value={form.title as string} onChange={e => { set('title', e.target.value); if (!postId) set('slug', slugify(e.target.value)) }} required />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Slug</label>
          <input style={inputStyle} value={form.slug as string} onChange={e => set('slug', e.target.value)} />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Extrait</label>
        <input style={inputStyle} value={form.excerpt as string} onChange={e => set('excerpt', e.target.value)} />
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Contenu</label>
        <textarea style={{ ...inputStyle, minHeight: 200, resize: 'vertical' }} value={form.content as string} onChange={e => set('content', e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>URL image de couverture</label>
          <input style={inputStyle} type="url" value={form.cover_image as string} onChange={e => set('cover_image', e.target.value)} placeholder="https://..." />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Catégorie</label>
          <input style={inputStyle} value={form.category as string} onChange={e => set('category', e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Tags (séparés par virgule)</label>
          <input style={inputStyle} value={form.tags as string} onChange={e => set('tags', e.target.value)} placeholder="musique, caraïbes, festival" />
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

      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button type="submit" disabled={loading} style={{
          background: '#E07560', color: '#FFFFFF', padding: '12px 32px',
          borderRadius: 40, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1rem', opacity: loading ? 0.6 : 1,
        }}>
          {loading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        {postId && (
          <button type="button" onClick={handleDelete} style={{
            background: '#fee2e2', color: '#991b1b', padding: '12px 24px',
            borderRadius: 40, border: 'none', cursor: 'pointer',
            fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.9rem',
          }}>
            Supprimer
          </button>
        )}
        {msg && <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem' }}>{msg}</span>}
      </div>
    </form>
  )
}
