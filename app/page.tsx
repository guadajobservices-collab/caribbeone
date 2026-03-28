import Link from 'next/link'
import { getPublishedEvents } from '@/lib/db'
import EventCard from '@/components/events/EventCard'
import { Event, Package } from '@/types'

export default async function HomePage() {
  let featuredEvents: (Event & { packages: Package[] })[] = []
  try {
    const all = await getPublishedEvents()
    featuredEvents = all.slice(0, 6)
  } catch {
    // DB pas dispo au build
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-[#1a1a1a] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a1a] via-[#2d4a44] to-[#1a1a1a] opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 bg-[#8ab5a7]/20 text-[#8ab5a7] text-sm px-4 py-2 rounded-full mb-6 border border-[#8ab5a7]/30">
            <span>🌴</span>
            <span>Billetterie événementielle inter-îles Caraïbes</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            ain&apos;t nothin&apos; like<br />
            <span className="text-[#8ab5a7]">caribbean life !</span>
          </h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Réservez vos événements + ferry + hébergement en un seul achat.<br />
            Guadeloupe · Martinique · Marie-Galante · Les Saintes
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/evenements" className="bg-[#8ab5a7] text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-opacity">
              Voir les événements
            </Link>
            <Link href="/auth/inscription" className="border border-gray-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:border-[#8ab5a7] hover:text-[#8ab5a7] transition-colors">
              Créer un compte
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-[#8ab5a7] text-white py-8">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-3 gap-4 text-center">
          <div><div className="text-3xl font-black">4</div><div className="text-sm opacity-80">Îles couvertes</div></div>
          <div><div className="text-3xl font-black">100%</div><div className="text-sm opacity-80">Paiement sécurisé</div></div>
          <div><div className="text-3xl font-black">E-billet</div><div className="text-sm opacity-80">Instantané</div></div>
        </div>
      </section>

      {/* Events */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-[#1a1a1a]">Événements à venir</h2>
            <p className="text-gray-500 mt-1">Les prochaines fêtes caribéennes</p>
          </div>
          <Link href="/evenements" className="text-[#8ab5a7] font-semibold hover:underline text-sm">Voir tout →</Link>
        </div>
        {featuredEvents.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-6xl mb-4">🌴</div>
            <p className="text-lg">Les événements arrivent bientôt !</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center text-[#1a1a1a] mb-12">Comment ça marche ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🔍', title: 'Choisissez votre événement', desc: 'Parcourez le catalogue, filtrez par île, catégorie ou date.' },
              { icon: '📦', title: 'Sélectionnez votre pack', desc: 'Ferry + billet, hébergement, pack Diaspora... tout inclus en un seul achat.' },
              { icon: '📱', title: 'Recevez votre e-billet', desc: 'PDF avec QR code envoyé immédiatement. Valable sur mobile.' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-[#8ab5a7]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">{step.icon}</div>
                <h3 className="font-bold text-[#1a1a1a] mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Organisateurs */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="bg-[#1a1a1a] rounded-3xl p-8 md:p-12 text-white text-center">
          <h2 className="text-2xl md:text-3xl font-black mb-4">Vous êtes organisateur ?</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">Publiez vos événements en autonomie, gérez vos packs et recevez vos paiements via Stripe.</p>
          <Link href="/organisateur" className="inline-block bg-[#8ab5a7] text-white px-8 py-4 rounded-xl font-bold hover:opacity-90">Accéder au back-office →</Link>
        </div>
      </section>
    </div>
  )
}
