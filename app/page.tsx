import Link from 'next/link'
import Image from 'next/image'
import { getPublishedEvents } from '@/lib/db'
import EventGrid from '@/components/events/EventGrid'
import { Event, Package } from '@/types'

const WaveDivider = ({ fill = '#FAFAF8', from = 'transparent' }: { fill?: string; from?: string }) => (
  <svg
    viewBox="0 0 1440 80"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full block"
    style={{ background: from, display: 'block', marginBottom: '-1px' }}
  >
    <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill={fill} />
  </svg>
)

export default async function HomePage() {
  let featuredEvents: (Event & { packages: Package[] })[] = []
  try {
    const all = await getPublishedEvents()
    featuredEvents = all.slice(0, 7)
  } catch {
    // DB pas dispo au build
  }

  return (
    <div style={{ background: 'var(--color-coco)' }}>

      {/* ══════════════════════════════════════
          HERO — Fond ocean, organique
      ══════════════════════════════════════ */}
      <section
        className="relative flex flex-col items-center justify-center text-center overflow-hidden"
        style={{
          background: 'var(--color-ocean)',
          paddingTop: '8rem',
          paddingBottom: '0',
          minHeight: '92vh',
        }}
      >
        {/* Cercles décoratifs subtils */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(42,191,191,0.08) 0%, transparent 70%)',
            top: '-100px',
            right: '-100px',
          }}
          aria-hidden="true"
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(224,117,96,0.06) 0%, transparent 70%)',
            bottom: '80px',
            left: '-80px',
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 pb-20">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Image
              src="/logo.jpg"
              alt="CaribbeOne"
              width={80}
              height={80}
              className="object-cover"
              style={{ borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}
            />
          </div>

          {/* Label */}
          <p
            className="text-sm font-semibold mb-4 tracking-widest uppercase"
            style={{ color: 'var(--color-sauge)', fontFamily: 'var(--font-body)', letterSpacing: '0.15em' }}
          >
            Billetterie inter-îles Caraïbes
          </p>

          {/* H1 */}
          <h1
            className="font-bold leading-tight mb-4"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: '#FAFAF8',
              lineHeight: 1.1,
            }}
          >
            La billetterie qui célèbre<br />
            <span style={{ color: 'var(--color-sauge)' }}>la vie caribéenne</span>
          </h1>

          {/* Tagline Caveat */}
          <p
            className="mb-10 italic"
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              color: 'var(--color-sauge)',
              opacity: 0.85,
            }}
          >
            ain&apos;t nothin&apos; like caribbean life !
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/evenements"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-base transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{
                background: 'var(--color-corail)',
                color: '#fff',
                borderRadius: 'var(--radius-xl)',
                fontFamily: 'var(--font-display)',
                boxShadow: '0 4px 16px rgba(224,117,96,0.4)',
              }}
            >
              Voir les événements
            </Link>
            <Link
              href="/organisateur"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold text-base transition-all hover:bg-white hover:text-ocean"
              style={{
                border: '2px solid rgba(250,250,248,0.5)',
                color: '#FAFAF8',
                borderRadius: 'var(--radius-xl)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Je suis organisateur
            </Link>
          </div>

          {/* Îles label */}
          <p
            className="mt-10 text-sm"
            style={{ color: 'rgba(250,250,248,0.4)', fontFamily: 'var(--font-body)' }}
          >
            Guadeloupe · Martinique · Marie-Galante · Les Saintes
          </p>
        </div>

        {/* Vague de transition vers le fond clair */}
        <div className="absolute bottom-0 left-0 right-0">
          <WaveDivider fill="var(--color-coco)" from="transparent" />
        </div>
      </section>

      {/* ══════════════════════════════════════
          PROCHAINS ÉVÉNEMENTS
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24" style={{ background: 'var(--color-coco)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-end justify-between mb-3">
            <h2
              className="leading-tight"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                color: 'var(--color-noir)',
              }}
            >
              Prochains{' '}
              <span style={{ color: 'var(--color-turquoise)' }}>événements</span>
            </h2>
            <Link
              href="/evenements"
              className="hidden md:inline-flex items-center gap-1 text-sm font-medium transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
            >
              Tout voir →
            </Link>
          </div>
          <p
            className="mb-10"
            style={{
              fontFamily: 'var(--font-script)',
              fontSize: '1.2rem',
              color: 'var(--color-sauge)',
            }}
          >
            Les plus belles soirées de l&apos;archipel
          </p>

          <EventGrid events={featuredEvents} />

          <div className="mt-8 md:hidden text-center">
            <Link
              href="/evenements"
              className="inline-flex items-center gap-2 px-8 py-3 text-sm font-semibold transition-opacity hover:opacity-80"
              style={{
                border: '2px solid var(--color-turquoise)',
                color: 'var(--color-turquoise)',
                borderRadius: 'var(--radius-xl)',
                fontFamily: 'var(--font-display)',
              }}
            >
              Voir tous les événements
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PACKAGES ÎLES — Fond sable
      ══════════════════════════════════════ */}
      <div>
        <WaveDivider fill="var(--color-sable)" from="var(--color-coco)" />
        <section
          id="about"
          className="py-16 md:py-24"
          style={{ background: 'var(--color-sable)', marginTop: '-1px' }}
        >
          <div className="max-w-7xl mx-auto px-4 md:px-8">
            <div className="mb-12">
              <h2
                className="leading-tight mb-2"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  color: 'var(--color-noir)',
                }}
              >
                Voyager &amp; Célébrer
              </h2>
              <p
                style={{
                  fontFamily: 'var(--font-script)',
                  fontSize: '1.3rem',
                  color: 'var(--color-corail)',
                }}
              >
                Des packs complets ferry + billet + hébergement
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: '🌊',
                  label: 'Ferry',
                  title: 'Traversée incluse',
                  desc: "Réservez votre billet et la traversée maritime en un seul achat. Aller-retour, simple et sécurisé.",
                  color: 'var(--color-turquoise)',
                },
                {
                  icon: '🏨',
                  label: 'Hébergement',
                  title: 'Séjour sur l\'île',
                  desc: "Nuit(s) d'hôtel sur l'île de l'événement. Réveils sans stress, profitez de chaque moment.",
                  color: 'var(--color-sauge)',
                },
                {
                  icon: '🎟️',
                  label: 'Billet',
                  title: 'Entrée garantie',
                  desc: "Votre e-billet sécurisé, envoyé instantanément. QR code scannable à l'entrée, sans file d'attente.",
                  color: 'var(--color-corail)',
                },
              ].map(({ icon, label, title, desc, color }) => (
                <div
                  key={label}
                  className="flex flex-col gap-4 p-7 bg-white"
                  style={{
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: '0 4px 24px rgba(13,59,74,0.06)',
                  }}
                >
                  <div
                    className="w-14 h-14 flex items-center justify-center text-2xl"
                    style={{ borderRadius: 'var(--radius-md)', background: `${color}22` }}
                  >
                    {icon}
                  </div>
                  <div>
                    <p
                      className="text-xs font-semibold mb-1 uppercase tracking-wide"
                      style={{ color, fontFamily: 'var(--font-display)' }}
                    >
                      {label}
                    </p>
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--color-noir)' }}
                    >
                      {title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)' }}
                    >
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 text-center">
              <Link
                href="/evenements"
                className="inline-flex items-center gap-2 px-8 py-4 font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{
                  background: 'var(--color-ocean)',
                  color: '#fff',
                  borderRadius: 'var(--radius-xl)',
                  fontFamily: 'var(--font-display)',
                  boxShadow: '0 4px 16px rgba(13,59,74,0.2)',
                }}
              >
                Découvrir les packs →
              </Link>
            </div>
          </div>
        </section>
        <WaveDivider fill="var(--color-noir)" from="var(--color-sable)" />
      </div>

      {/* ══════════════════════════════════════
          CTA ORGANISATEURS
      ══════════════════════════════════════ */}
      <section
        className="py-20 md:py-28 relative overflow-hidden"
        style={{ background: 'var(--color-noir)', marginTop: '-1px' }}
      >
        {/* Cercle déco */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(156,189,182,0.07) 0%, transparent 70%)',
            top: '-100px',
            right: '-50px',
          }}
          aria-hidden="true"
        />

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-2xl">
            <h2
              className="leading-tight mb-4"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.2rem, 5.5vw, 4rem)',
                color: '#FAFAF8',
              }}
            >
              Vous organisez<br />
              <span style={{ color: 'var(--color-sauge)' }}>un événement ?</span>
            </h2>
            <p
              className="text-base mb-8 leading-relaxed"
              style={{
                color: 'rgba(250,250,248,0.6)',
                fontFamily: 'var(--font-body)',
                maxWidth: '480px',
              }}
            >
              Publiez vos événements, gérez vos packs inter-îles et recevez vos paiements en autonomie.
              Diaspora, ferry, hébergement — tout configuré en quelques clics.
            </p>
            <Link
              href="/organisateur"
              className="inline-flex items-center gap-2 px-8 py-4 font-semibold transition-all hover:opacity-90 hover:-translate-y-0.5"
              style={{
                background: 'var(--color-sauge)',
                color: 'var(--color-noir)',
                borderRadius: 'var(--radius-xl)',
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
              }}
            >
              Accéder au back-office →
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
