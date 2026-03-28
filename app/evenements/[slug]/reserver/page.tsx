import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'
import { getEventBySlug } from '@/lib/db'
import ReservationTunnel from '@/components/reservation/ReservationTunnel'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ pack?: string }>
}

export default async function ReservationPage({ params, searchParams }: Props) {
  const { slug } = await params
  const { pack: packId } = await searchParams

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect(`/auth/connexion?redirect=/evenements/${slug}/reserver${packId ? `?pack=${packId}` : ''}`)
  }

  const event = await getEventBySlug(slug).catch(() => null)
  if (!event) notFound()

  const packages = event.packages || []
  const selectedPackage = packId
    ? packages.find(p => p.id === packId) || packages[0]
    : packages[0]

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-[#1a1a1a]">Réservation</h1>
        <p className="text-gray-500 mt-1">{event.title}</p>
      </div>
      <ReservationTunnel event={event as Parameters<typeof ReservationTunnel>[0]['event']} initialPackage={selectedPackage as Parameters<typeof ReservationTunnel>[0]['initialPackage']} userId={user.id} />
    </div>
  )
}
