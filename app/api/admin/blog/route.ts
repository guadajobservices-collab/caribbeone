import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()
    const { data, error } = await supabase.from('blog_posts').insert({
      title: body.title,
      slug: body.slug || body.title?.toLowerCase().replace(/\s+/g, '-'),
      excerpt: body.excerpt || null,
      content: body.content || null,
      cover_image: body.cover_image || null,
      category: body.category || null,
      tags: body.tags || [],
      status: body.status || 'draft',
    }).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
