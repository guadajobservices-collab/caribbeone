import { createAdminClient } from '@/lib/supabase/server'

export const metadata = { title: 'Médias — Admin CaribbeOne' }

const FF_DISPLAY = '"Baloo 2", cursive'
const FF_BODY = '"Nunito", sans-serif'

export default async function AdminMedias() {
  const supabase = createAdminClient()
  const { data: medias } = await supabase
    .from('media')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: FF_DISPLAY, fontWeight: 800, fontSize: '1.8rem', color: '#1A1A1A', marginBottom: 32 }}>
        Médiathèque
      </h1>

      {(!medias || medias.length === 0) ? (
        <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '60px', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>🖼️</div>
          <p style={{ fontFamily: FF_BODY, color: '#6B7280', fontSize: '1rem' }}>
            Aucun média enregistré pour le moment.
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
          {medias.map((m: Record<string, unknown>) => (
            <div key={m.id as string} style={{ background: '#FFFFFF', borderRadius: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
              {m.url ? (
                <img
                  src={m.url as string}
                  alt={m.name as string || ''}
                  style={{ width: '100%', height: 140, objectFit: 'cover' }}
                />
              ) : null}
              <div style={{ padding: '10px 12px' }}>
                <p style={{ fontFamily: FF_BODY, fontWeight: 700, fontSize: '0.82rem', color: '#1A1A1A', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {m.name as string || 'Sans nom'}
                </p>
                <p style={{ fontFamily: FF_BODY, fontSize: '0.75rem', color: '#6B7280', margin: '2px 0 0' }}>
                  {m.mime_type as string || ''}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
