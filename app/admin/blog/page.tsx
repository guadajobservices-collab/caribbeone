import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Blog — Admin CaribbeOne' }

const FF_DISPLAY = '"Baloo 2", cursive'
const FF_BODY = '"Nunito", sans-serif'

export default async function AdminBlog() {
  const supabase = createAdminClient()
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ fontFamily: FF_DISPLAY, fontWeight: 800, fontSize: '1.8rem', color: '#1A1A1A' }}>
          Blog
        </h1>
        <Link href="/admin/blog/nouveau" style={{
          background: '#E07560', color: '#FFFFFF',
          padding: '10px 24px', borderRadius: 40,
          fontFamily: FF_DISPLAY, fontWeight: 700,
          textDecoration: 'none', fontSize: '0.95rem',
        }}>
          + Nouvel article
        </Link>
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8F9FA' }}>
              {['Titre', 'Catégorie', 'Statut', 'Date', 'Actions'].map(h => (
                <th key={h} style={{ fontFamily: FF_BODY, fontWeight: 700, fontSize: '0.82rem', color: '#6B7280', textAlign: 'left', padding: '14px 16px', textTransform: 'uppercase' as const }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(posts ?? []).map((p: Record<string, unknown>) => (
              <tr key={p.id as string} style={{ borderTop: '1px solid #F0F0F0' }}>
                <td style={{ padding: '14px 16px', fontFamily: FF_BODY, fontWeight: 700, color: '#1A1A1A' }}>
                  {p.cover_image ? <img src={p.cover_image as string} style={{ width: 40, height: 30, objectFit: 'cover', borderRadius: 4, marginRight: 10, verticalAlign: 'middle' }} alt="" /> : null}
                  {p.title as string}
                </td>
                <td style={{ padding: '14px 16px', fontFamily: FF_BODY, fontSize: '0.88rem' }}>{p.category as string || '—'}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    background: p.status === 'published' ? '#dcfce7' : p.status === 'draft' ? '#f3f4f6' : '#fee2e2',
                    color: p.status === 'published' ? '#166534' : p.status === 'draft' ? '#374151' : '#991b1b',
                    padding: '3px 10px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, fontFamily: FF_BODY,
                  }}>
                    {p.status as string}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontFamily: FF_BODY, fontSize: '0.85rem', color: '#6B7280' }}>
                  {new Date(p.created_at as string).toLocaleDateString('fr-FR')}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <Link href={`/admin/blog/${p.id as string}`} style={{ background: '#0D3B4A', color: '#FFFFFF', padding: '5px 12px', borderRadius: 8, fontSize: '0.8rem', textDecoration: 'none', fontFamily: FF_BODY, fontWeight: 600 }}>
                    Éditer
                  </Link>
                </td>
              </tr>
            ))}
            {(!posts || posts.length === 0) && (
              <tr><td colSpan={5} style={{ padding: '40px', textAlign: 'center', color: '#6B7280', fontFamily: FF_BODY }}>Aucun article. <Link href="/admin/blog/nouveau" style={{ color: '#E07560' }}>Créer le premier →</Link></td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
