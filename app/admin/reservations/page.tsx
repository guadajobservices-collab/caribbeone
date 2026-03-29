import { createAdminClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const metadata = { title: 'Réservations — Admin CaribbeOne' }

const FF_DISPLAY = '"Baloo 2", cursive'
const FF_BODY = '"Nunito", sans-serif'

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  pending: { bg: '#f3f4f6', color: '#374151' },
  deposit_paid: { bg: '#fef9c3', color: '#854d0e' },
  fully_paid: { bg: '#dcfce7', color: '#166534' },
  cancelled: { bg: '#fee2e2', color: '#991b1b' },
}

interface SearchParams { status?: string }
interface Props { searchParams: Promise<SearchParams> }

export default async function AdminReservations({ searchParams }: Props) {
  const sp = await searchParams
  const statusFilter = sp.status || ''

  const supabase = createAdminClient()
  let query = supabase
    .from('bookings')
    .select('*, event_packages(name, events(title))')
    .order('created_at', { ascending: false })
    .limit(100)

  if (statusFilter) query = query.eq('status', statusFilter)

  const { data: bookings } = await query

  const statuses = ['', 'pending', 'deposit_paid', 'fully_paid', 'cancelled']

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontFamily: FF_DISPLAY, fontWeight: 800, fontSize: '1.8rem', color: '#1A1A1A' }}>
          Réservations
        </h1>
        <a
          href={`/api/admin/reservations/export${statusFilter ? `?status=${statusFilter}` : ''}`}
          style={{ background: '#0D3B4A', color: '#FFFFFF', padding: '10px 20px', borderRadius: 40, fontFamily: FF_DISPLAY, fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}
        >
          ↓ Export CSV
        </a>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' as const }}>
        {statuses.map(s => (
          <Link
            key={s || 'all'}
            href={s ? `/admin/reservations?status=${s}` : '/admin/reservations'}
            style={{
              padding: '6px 16px', borderRadius: 999, textDecoration: 'none',
              fontFamily: FF_BODY, fontSize: '0.85rem', fontWeight: 700,
              background: statusFilter === s ? '#0D3B4A' : '#F0F0F0',
              color: statusFilter === s ? '#FFFFFF' : '#374151',
            }}
          >
            {s || 'Tous'}
          </Link>
        ))}
      </div>

      <div style={{ background: '#FFFFFF', borderRadius: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#F8F9FA' }}>
              {['Référence', 'Client', 'Email', 'Événement', 'Pack', 'Montant', 'Statut', 'Date'].map(h => (
                <th key={h} style={{ fontFamily: FF_BODY, fontWeight: 700, fontSize: '0.78rem', color: '#6B7280', textAlign: 'left', padding: '12px 14px', textTransform: 'uppercase' as const, letterSpacing: 0.3 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(bookings ?? []).map((b: Record<string, unknown>) => {
              const pkg = b.event_packages as Record<string, unknown> | null
              const evt = pkg?.events as Record<string, unknown> | null
              const sc = STATUS_COLORS[b.status as string] || STATUS_COLORS.pending
              return (
                <tr key={b.id as string} style={{ borderTop: '1px solid #F0F0F0' }}>
                  <td style={{ padding: '12px 14px', fontFamily: FF_BODY, fontWeight: 700, color: '#0D3B4A', fontSize: '0.88rem' }}>{b.reference as string || '—'}</td>
                  <td style={{ padding: '12px 14px', fontFamily: FF_BODY, fontSize: '0.88rem' }}>{b.customer_name as string || '—'}</td>
                  <td style={{ padding: '12px 14px', fontFamily: FF_BODY, fontSize: '0.85rem', color: '#6B7280' }}>{b.customer_email as string || '—'}</td>
                  <td style={{ padding: '12px 14px', fontFamily: FF_BODY, fontSize: '0.85rem' }}>{(evt?.title as string) || '—'}</td>
                  <td style={{ padding: '12px 14px', fontFamily: FF_BODY, fontSize: '0.85rem' }}>{(pkg?.name as string) || '—'}</td>
                  <td style={{ padding: '12px 14px', fontFamily: FF_BODY, fontWeight: 700, fontSize: '0.88rem' }}>{b.total_price as number}€</td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ background: sc.bg, color: sc.color, padding: '3px 10px', borderRadius: 999, fontSize: '0.75rem', fontWeight: 700, fontFamily: FF_BODY }}>
                      {b.status as string}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', fontFamily: FF_BODY, fontSize: '0.82rem', color: '#6B7280' }}>
                    {new Date(b.created_at as string).toLocaleDateString('fr-FR')}
                  </td>
                </tr>
              )
            })}
            {(!bookings || bookings.length === 0) && (
              <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: '#6B7280', fontFamily: FF_BODY }}>Aucune réservation trouvée</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
