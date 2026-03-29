import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { PageForm } from '@/components/admin/PageForm'
import Link from 'next/link'

interface Props { params: Promise<{ id: string }> }

export default async function EditPage({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: page } = await supabase.from('pages').select('*').eq('id', id).single()
  if (!page) notFound()

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/pages" style={{ color: '#6B7280', fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', textDecoration: 'none' }}>
          ← Retour aux pages
        </Link>
      </div>
      <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.8rem', color: '#1A1A1A', marginBottom: 32 }}>
        Éditer : {page.title}
      </h1>
      <PageForm pageId={id} initialData={page} />
    </div>
  )
}
