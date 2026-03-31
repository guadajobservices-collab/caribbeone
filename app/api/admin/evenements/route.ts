import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const { data, error } = await supabase.from('events').insert({
      title: body.title,
      slug: body.slug || body.title?.toLowerCase().replace(/\s+/g, '-'),
      description: body.description || null,
      short_description: body.short_description || null,
      start_date: body.start_date || null,
      end_date: body.end_date || null,
      location: body.location || body.venue || null,
      address: body.address || null,
      island_id: body.island_id || null,
      category_id: body.category_id || null,
      music_style_id: body.music_style_id || null,
      cover_image: body.cover_image || null,
      status: body.status || 'draft',
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET() {
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('events').select('*, islands(name), event_categories(name)').order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}
