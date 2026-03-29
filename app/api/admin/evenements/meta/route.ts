import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

export async function GET() {
  const supabase = createAdminClient()
  const [
    { data: islands },
    { data: categories },
    { data: musicStyles },
  ] = await Promise.all([
    supabase.from('islands').select('id, name').order('name'),
    supabase.from('event_categories').select('id, name').order('name'),
    supabase.from('music_styles').select('id, name').order('name'),
  ])
  return NextResponse.json({ islands: islands || [], categories: categories || [], musicStyles: musicStyles || [] })
}
