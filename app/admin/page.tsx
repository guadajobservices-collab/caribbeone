import { createAdminClient } from '@/lib/supabase/server'

export const metadata = { title: 'Tableau de bord — Admin CaribbeOne' }

const FF_DISPLAY = '"Baloo 2", cursive'
const FF_BODY = '"Nunito", sans-serif'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const [
    { count: eventsCount },
    { count: bookingsCount },
    { count: pendingCount },
    { data: recentBookings },
  ] = await Promise.all([
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('bookings').select('*', { count: 'exact', head: true }),
    supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status', 'deposit_paid'),
    supabase.from('bookings').select('*, event_packages(name, events(title))').order('created_at', { ascending: false }).limit(5),
  ])

  const stats = [
    { label: 'Événements publiés', value: eventsCount ?? 0, icon: '🎪', color: '#9CBDB6' },
    { label: 'Réservations totales', value: bookingsCount ?? 0, icon: '🎟️', color: '#E07560' },
    { label: 'Soldes en attente', value: pendingCount ?? 0, icon: '⏳', color: '#F2C744' },
  ]

  return (
    <div style={{ padding: '32px' }}>
      <h1 style={{ fontFamily: FF_DISPLAY, fontWeight: 800, fontSize: '1.8rem', color: '#1A1A1A', marginBottom: 8 }}>
        Tableau de bord
      </h1>
      <p style={{ fontFamily: FF_BODY, color: '#6B7280', marginBottom: 32 }}>
        Bienvenue dans votre espace d&apos;administration
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
        {stats.map(s => (
          <div key={s.label} style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: `4px solid ${s.color}` }}>
            <div style={{ fontSize: '2rem', marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontFamily: FF_DISPLAY, fontWeight: 800, fontSize: '2.2rem', color: '#1A1A1A' }}>{s.value}</div>
            <div style={{ fontFamily: FF_BODY, color: '#6B7280', fontSize: '0.9rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 16, padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <h2 style={{ fontFamily: FF_DISPLAY, fontWeight: 700, fontSize: '1.2rem', marginBottom: 20 }}>
          Dernières réservations
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Référence', 'Client', 'Événement', 'Montant', 'Statut', 'Date'].map(h => (
                <th key={h} style={{ fontFamily: FF_BODY, fontWeight: 700, fontSize: '0.82rem', color: '#6B7280', textAlign: 'left', padding: '8px 12px', borderBottom: '2px solid #F0F0F0', textTransform: 'uppercase' as const, letterSpacing: 0.5 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(recentBookings ?? []).map((b: Record<string, unknown>) => {
              const pkg = b.event_packages as Record<string, unknown> | null
              const evt = pkg?.events as Record<string, unknown> | null
              return (
                <tr key={b.id as string}>
                  <td style={{ padding: '12px', fontFamily: FF_BODY, fontSize: '0.88rem', fontWeight: 700, color: '#0D3B4A' }}>{b.reference as string || '—'}</td>
                  <td style={{ padding: '12px', fontFamily: FF_BODY, fontSize: '0.88rem' }}>{(b.customer_name as string) || (b.customer_email as string) || '—'}</td>
                  <td style={{ padding: '12px', fontFamily: FF_BODY, fontSize: '0.88rem' }}>{(evt?.title as string) || '—'}</td>
                  <td style={{ padding: '12px', fontFamily: FF_BODY, fontSize: '0.88rem', fontWeight: 700 }}>{b.total_price as number}€</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      background: b.status === 'fully_paid' ? '#dcfce7' : b.status === 'deposit_paid' ? '#fef9c3' : '#fee2e2',
                      color: b.status === 'fully_paid' ? '#166534' : b.status === 'deposit_paid' ? '#854d0e' : '#991b1b',
                      padding: '3px 10px', borderRadius: 999, fontSize: '0.78rem', fontWeight: 700, fontFamily: FF_BODY,
                    }}>
                      {b.status as string}
                    </span>
                  </td>
                  <td style={{ padding: '12px', fontFamily: FF_BODY, fontSize: '0.85rem', color: '#6B7280' }}>
                    {new Date(b.created_at as string).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              )
            })}
            {(!recentBookings || recentBookings.length === 0) && (
              <tr><td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#6B7280', fontFamily: FF_BODY }}>Aucune réservation pour l&apos;instant</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
