import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Pages — Admin CaribbeOne' }

const FF_DISPLAY = '"Baloo 2", cursive'
const FF_BODY = '"Nunito", sans-serif'

export default async function AdminPages() {
  const supabase = createAdminClient()
  const { data: pages } = await supabase
    .from('pages')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: FF_DISPLAY, fontWeight: 800, fontSize: '1.8rem', color: '#1A1A1A' }}>
          Pages statiques
        </h1>
        <Link href="/admin/pages/nouveau" style={{
          background: '#E07560', color: '#FFFFFF',
          padding: '10px 24px', borderRadius: 40,
          fontFamily: FF_DISPLAY, fontWeight: 700,
          textDecoration: 'none', fontSize: '0.95rem',
        }}>
          + Nouvelle page
        </Link>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8F9FA' }}>
              {['Titre', 'Slug', 'Statut', 'Mise à jour', 'Actions'].map(h => (
                <th key={h} style={{ fontFamily: FF_BODY, fontWeight: 700, fontSize: '0.82rem', color: '#6B7280', textAlign: 'left', padding: '14px 16px', textTransform: 'uppercase' as const }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(pages ?? []).map((p: Record<string, unknown>) => (
              <tr key={p.id as string} style={{ borderTop: '1px solid #F0F0F0' }}>
                <td style={{ padding: '14px 16px', fontFamily: FF_BODY, fontWeight: 700, color: '#1A1A1A' }}>{p.title as string}</td>
                <td style={{ padding: '14px 16px', fontFamily: FF_BODY, fontSize: '0.85rem', color: '#6B7280' }}>/{p.slug as string}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    background: p.status === 'published' ? '#dcfce7' : '#f3f4f6',
                    color: p.status === 'published' ? '#166534' : '#374151',
                    padding: '3px 10px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, fontFamily: FF_BODY,
                  }}>
                    {p.status as string || 'draft'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: FF_BODY, fontSize: '0.85rem', color: '#6B7280' }}>
                  {p.updated_at ? new Date(p.updated_at as string).toLocaleDateString('fr-FR') : '—'}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <Link href={`/admin/pages/${p.id as string}`} style={{ background: '#0D3B4A', color: '#FFFFFF', padding: '5px 12px', borderRadius: 8, fontSize: '0.8rem', textDecoration: 'none', fontFamily: FF_BODY, fontWeight: 600 }}>
                    Éditer
                  </Link>
                </td>
              </tr>
            ))}
            {(!pages || pages.length === 0) && (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#6B7280', fontFamily: FF_BODY }}>Aucune page. <Link href="/admin/pages/nouveau" style={{ color: '#E07560' }}>Créer la première →</Link></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
