import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

interface Props { params: Promise<{ id: string }> }

export async function GET(_req: Request, { params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const { data, error } = await supabase.from('events').select('*, islands(name), event_categories(name), music_styles(name)').eq('id', id).single()
  if (error) return NextResponse.json({ error: error.message }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(request: Request, { params }: Props) {
  const { id } = await params
  try {
    const supabase = createAdminClient()
    const body = await request.json()

    const updateData: Record<string, unknown> = {}
    const fields = ['title', 'slug', 'description', 'short_description', 'start_date', 'end_date', 'location', 'address', 'island_id', 'category_id', 'music_style_id', 'cover_image', 'status']
    for (const f of fields) {
      if (f in body) updateData[f] = body[f] || null
    }
    updateData.updated_at = new Date().toISOString()

    const { data, error } = await supabase.from('events').update(updateData).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 400 })
    return NextResponse.json(data)
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: Props) {
  const { id } = await params
  const supabase = createAdminClient()
  const { error } = await supabase.from('events').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
