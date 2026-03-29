import { PageForm } from '@/components/admin/PageForm'
import Link from 'next/link'

export const metadata = { title: 'Nouvelle page — Admin CaribbeOne' }

export default function NouvellePage() {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/pages" style={{ color: '#6B7280', fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', textDecoration: 'none' }}>
          ← Retour aux pages
        </Link>
      </div>
      <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.8rem', color: '#1A1A1A', marginBottom: 32 }}>
        Nouvelle page
      </h1>
      <PageForm />
    </div>
  )
}
