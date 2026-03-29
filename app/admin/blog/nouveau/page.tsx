import BlogForm from '@/components/admin/BlogForm'
import Link from 'next/link'

export const metadata = { title: 'Nouvel article — Admin CaribbeOne' }

export default function NouvelArticle() {
  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/blog" style={{ color: '#6B7280', fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', textDecoration: 'none' }}>
          ← Retour au blog
        </Link>
      </div>
      <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.8rem', color: '#1A1A1A', marginBottom: 32 }}>
        Nouvel article
      </h1>
      <BlogForm />
    </div>
  )
}
