import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Événements — Admin CaribbeOne' }

const FF_DISPLAY = '"Baloo 2", cursive'
const FF_BODY = '"Nunito", sans-serif'

export default async function AdminEvents() {
  const supabase = createAdminClient()
  const { data: events } = await supabase
    .from('events')
    .select('*, islands(name), event_categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: FF_DISPLAY, fontWeight: 800, fontSize: '1.8rem', color: '#1A1A1A' }}>
          Événements
        </h1>
        <Link href="/admin/evenements/nouveau" style={{
          background: '#E07560', color: '#FFFFFF',
          padding: '10px 24px', borderRadius: 40,
          fontFamily: FF_DISPLAY, fontWeight: 700,
          textDecoration: 'none', fontSize: '0.95rem',
        }}>
          + Nouvel événement
        </Link>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8F9FA' }}>
              {['Titre', 'Île', 'Catégorie', 'Date', 'Statut', 'Actions'].map(h => (
                <th key={h} style={{ fontFamily: FF_BODY, fontWeight: 700, fontSize: '0.82rem', color: '#6B7280', textAlign: 'left', padding: '14px 16px', textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(events ?? []).map((e: Record<string, unknown>) => {
              const island = e.islands as Record<string, unknown> | null
              const category = e.event_categories as Record<string, unknown> | null
              return (
                <tr key={e.id as string} style={{ borderTop: '1px solid #F0F0F0' }}>
                  <td style={{ padding: '14px 16px', fontFamily: FF_BODY, fontWeight: 700, color: '#1A1A1A' }}>
                    {e.cover_image ? <img src={e.cover_image as string} style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: 4, marginRight: 10, verticalAlign: 'middle' }} alt="" /> : null}
                    {e.title as string}
                  </td>
                  <td style={{ padding: '14px 16px', fontFamily: FF_BODY, fontSize: '0.88rem' }}>{(island?.name as string) || '—'}</td>
                  <td style={{ padding: '14px 16px', fontFamily: FF_BODY, fontSize: '0.88rem' }}>{(category?.name as string) || '—'}</td>
                  <td style={{ padding: '14px 16px', fontFamily: FF_BODY, fontSize: '0.88rem', color: '#6B7280' }}>
                    {e.start_date ? new Date(e.start_date as string).toLocaleDateString('fr-FR') : '—'}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      background: e.status === 'published' ? '#dcfce7' : e.status === 'draft' ? '#f3f4f6' : '#fee2e2',
                      color: e.status === 'published' ? '#166534' : e.status === 'draft' ? '#374151' : '#991b1b',
                      padding: '3px 10px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, fontFamily: FF_BODY,
                    }}>
                      {e.status as string}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Link href={`/admin/evenements/${e.id as string}`} style={{ background: '#0D3B4A', color: '#FFFFFF', padding: '5px 12px', borderRadius: 8, fontSize: '0.8rem', textDecoration: 'none', fontFamily: FF_BODY, fontWeight: 600 }}>Éditer</Link>
                      <Link href={`/admin/evenements/${e.id as string}/packs`} style={{ background: '#9CBDB6', color: '#FFFFFF', padding: '5px 12px', borderRadius: 8, fontSize: '0.8rem', textDecoration: 'none', fontFamily: FF_BODY, fontWeight: 600 }}>Packs</Link>
                    </div>
                  </td>
                </tr>
              )
            })}
            {(!events || events.length === 0) && (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#6B7280', fontFamily: FF_BODY }}>Aucun événement. <Link href="/admin/evenements/nouveau" style={{ color: '#E07560' }}>Créer le premier →</Link></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
