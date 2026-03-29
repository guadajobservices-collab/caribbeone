import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import EventForm from '@/components/admin/EventForm'
import Link from 'next/link'

interface Props { params: Promise<{ id: string }> }

export default async function EditEvent({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: event } = await supabase.from('events').select('*').eq('id', id).single()
  if (!event) notFound()

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: 24, display: 'flex', gap: 16 }}>
        <Link href="/admin/evenements" style={{ color: '#6B7280', fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', textDecoration: 'none' }}>
          ← Retour aux événements
        </Link>
        <Link href={`/admin/evenements/${id}/packs`} style={{ color: '#9CBDB6', fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', textDecoration: 'none', fontWeight: 700 }}>
          Gérer les packs →
        </Link>
      </div>
      <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.8rem', color: '#1A1A1A', marginBottom: 32 }}>
        Éditer : {event.title}
      </h1>
      <EventForm eventId={id} initialData={event} />
    </div>
  )
}
