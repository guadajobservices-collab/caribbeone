import { createAdminClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import BlogForm from '@/components/admin/BlogForm'
import Link from 'next/link'

interface Props { params: Promise<{ id: string }> }

export default async function EditPost({ params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data: post } = await supabase.from('blog_posts').select('*').eq('id', id).single()
  if (!post) notFound()

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ marginBottom: 24 }}>
        <Link href="/admin/blog" style={{ color: '#6B7280', fontFamily: "'Nunito', sans-serif", fontSize: '0.9rem', textDecoration: 'none' }}>
          ← Retour au blog
        </Link>
      </div>
      <h1 style={{ fontFamily: "'Baloo 2', cursive", fontWeight: 800, fontSize: '1.8rem', color: '#1A1A1A', marginBottom: 32 }}>
        Éditer : {post.title}
      </h1>
      <BlogForm postId={id} initialData={post} />
    </div>
  )
}
