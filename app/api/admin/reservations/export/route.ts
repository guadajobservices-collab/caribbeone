import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const status = searchParams.get('status')

  const supabase = createAdminClient()
  let query = supabase
    .from('bookings')
    .select('*, event_packages(name, events(title))')
    .order('created_at', { ascending: false })

  if (status) query = query.eq('status', status)

  const { data: bookings, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  const rows = bookings || []
  const headers = ['Référence', 'Client', 'Email', 'Téléphone', 'Événement', 'Pack', 'Montant (€)', 'Statut', 'Date']
  const lines = [
    headers.join(';'),
    ...rows.map((b: Record<string, unknown>) => {
      const pkg = b.event_packages as Record<string, unknown> | null
      const evt = pkg?.events as Record<string, unknown> | null
      return [
        b.reference || '',
        b.customer_name || '',
        b.customer_email || '',
        b.customer_phone || '',
        evt?.title || '',
        pkg?.name || '',
        b.total_price || 0,
        b.status || '',
        b.created_at ? new Date(b.created_at as string).toLocaleDateString('fr-FR') : '',
      ].join(';')
    }),
  ]

  const csv = lines.join('\n')
  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="reservations-${Date.now()}.csv"`,
    },
  })
}
