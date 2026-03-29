import EventForm from '@/components/admin/EventForm'
import Link from 'next/link'

export const metadata = { title: 'Nouvel événement — Admin CaribbeOne' }

export default function NouvelEvenement() {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/evenements" style={{ color: '#6B7280', fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', textDecoration: 'none' }}>
          ← Retour aux événements
        </Link>
      </div>
      <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.8rem', color: '#1A1A1A', marginBottom: 32 }}>
        Nouvel événement
      </h1>
      <EventForm />
    </div>
  )
}
