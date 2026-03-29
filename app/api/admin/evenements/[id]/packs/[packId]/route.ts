import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

interface Props { params: Promise<{ id: string; packId: string }> }

export async function PATCH(request: Request, { params }: Props) {
  const { packId } = await params
  const supabase = createAdminClient()
  const body = await request.json()
  const { data, error } = await supabase.from('event_packages').update(body).eq('id', packId).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json(data)
}

export async function DELETE(_req: Request, { params }: Props) {
  const { packId } = await params
  const supabase = createAdminClient()
  const { error } = await supabase.from('event_packages').delete().eq('id', packId)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
