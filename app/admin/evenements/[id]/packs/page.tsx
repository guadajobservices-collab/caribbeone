'use client'
import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface Pack {
  id: string
  name: string
  type: string
  departure_island_id: string
  price: number
  deposit_amount: number
  deposit_type: string
  capacity: number
  status: string
}

export default function PacksPage() {
  const params = useParams()
  const eventId = params.id as string
  const [packs, setPacks] = useState<Pack[]>([])
  const [eventTitle, setEventTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [form, setForm] = useState({
    name: '',
    type: 'full_pack',
    departure_island_id: '',
    price: '',
    deposit_amount: '',
    deposit_type: 'percent',
    capacity: '',
  })

  const loadPacks = useCallback(async () => {
    const res = await fetch(`/api/admin/evenements/${eventId}/packs`)
    const data = await res.json()
    setPacks(data.packs || [])
    setEventTitle(data.eventTitle || '')
  }, [eventId])

  useEffect(() => { loadPacks() }, [loadPacks])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')
    try {
      const res = await fetch(`/api/admin/evenements/${eventId}/packs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erreur')
      setMsg('✅ Pack ajouté !')
      setForm({ name: '', type: 'full_pack', departure_island_id: '', price: '', deposit_amount: '', deposit_type: 'percent', capacity: '' })
      loadPacks()
    } catch (err) {
      setMsg('❌ ' + (err instanceof Error ? err.message : 'Erreur'))
    } finally {
      setLoading(false)
    }
  }

  const handleArchive = async (packId: string) => {
    if (!confirm('Archiver ce pack ?')) return
    await fetch(`/api/admin/evenements/${eventId}/packs/${packId}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: 'archived' }) })
    loadPacks()
  }

  const inputStyle = { width: '100%', padding: '10px 14px', borderRadius: 10, border: '1.5px solid #E5E7EB', fontFamily: "'Nunito', sans-serif", fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box' as const }
  const labelStyle = { fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#374151', display: 'block', marginBottom: 6 }

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: 24 }}>
        <Link href={`/admin/evenements/${eventId}`} style={{ color: '#6B7280', fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', textDecoration: 'none' }}>
          ← Retour à l&apos;événement
        </Link>
      </div>
      <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.8rem', color: '#1A1A1A', marginBottom: 8 }}>
        Packs — {eventTitle}
      </h1>

      {/* Packs existants */}
      <div style={{ background: '#FFFFFF', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 32, overflow: 'hidden' }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #F0F0F0' }}>
          <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>Packs existants</h2>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8F9FA' }}>
              {['Nom', 'Type', 'Prix', 'Acompte', 'Capacité', 'Statut', 'Actions'].map(h => (
                <th key={h} style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 700, fontSize: '0.8rem', color: '#6B7280', textAlign: 'left', padding: '12px 16px', textTransform: 'uppercase' as const }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {packs.map(p => (
              <tr key={p.id} style={{ borderTop: '1px solid #F0F0F0' }}>
                <td style={{ padding: '12px 16px', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>{p.name}</td>
                <td style={{ padding: '12px 16px', fontFamily: "'Nunito', sans-serif", fontSize: '0.88rem' }}>{p.type}</td>
                <td style={{ padding: '12px 16px', fontFamily: "'Nunito', sans-serif", fontWeight: 700 }}>{p.price}€</td>
                <td style={{ padding: '12px 16px', fontFamily: "'Nunito', sans-serif", fontSize: '0.88rem' }}>{p.deposit_amount}{p.deposit_type === 'percent' ? '%' : '€'}</td>
                <td style={{ padding: '12px 16px', fontFamily: "'Nunito', sans-serif", fontSize: '0.88rem' }}>{p.capacity}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ background: p.status === 'active' ? '#dcfce7' : '#fee2e2', color: p.status === 'active' ? '#166534' : '#991b1b', padding: '3px 8px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, fontFamily: "'Nunito', sans-serif" }}>
                    {p.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  {p.status !== 'archived' && (
                    <button onClick={() => handleArchive(p.id)} style={{ background: '#fee2e2', color: '#991b1b', border: 'none', padding: '5px 12px', borderRadius: 8, cursor: 'pointer', fontSize: '0.8rem', fontFamily: "'Nunito', sans-serif", fontWeight: 600 }}>
                      Archiver
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {packs.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '32px', textAlign: 'center', color: '#6B7280', fontFamily: "'Nunito', sans-serif" }}>Aucun pack pour le moment</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Ajouter un pack */}
      <div style={{ background: '#FFFFFF', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', padding: '24px' }}>
        <h2 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '1.1rem', marginBottom: 24 }}>Ajouter un pack</h2>
        <form onSubmit={handleAdd}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Nom *</label>
              <input style={inputStyle} value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label style={labelStyle}>Type *</label>
              <select style={inputStyle} value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="ferry_ticket">Billet ferry</option>
                <option value="plane_ticket">Billet avion</option>
                <option value="hotel_ticket">Hôtel</option>
                <option value="full_pack">Pack complet</option>
                <option value="vip">VIP</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Prix (€) *</label>
              <input style={inputStyle} type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
            </div>
            <div>
              <label style={labelStyle}>Capacité</label>
              <input style={inputStyle} type="number" min="0" value={form.capacity} onChange={e => setForm(f => ({ ...f, capacity: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Acompte</label>
              <input style={inputStyle} type="number" min="0" value={form.deposit_amount} onChange={e => setForm(f => ({ ...f, deposit_amount: e.target.value }))} />
            </div>
            <div>
              <label style={labelStyle}>Type d&apos;acompte</label>
              <select style={inputStyle} value={form.deposit_type} onChange={e => setForm(f => ({ ...f, deposit_type: e.target.value }))}>
                <option value="percent">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (€)</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button type="submit" disabled={loading} style={{
              background: '#9CBDB6', color: '#FFFFFF', padding: '10px 28px',
              borderRadius: 40, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: "'Baloo 2', cursive", fontWeight: 700, fontSize: '0.95rem', opacity: loading ? 0.6 : 1,
            }}>
              {loading ? 'Ajout...' : '+ Ajouter le pack'}
            </button>
            {msg && <span style={{ fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem' }}>{msg}</span>}
          </div>
        </form>
      </div>
    </div>
  )
}
