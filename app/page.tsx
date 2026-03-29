import Link from 'next/link'
import Image from 'next/image'
import { getPublishedEvents } from '@/lib/db'
import EventGrid from '@/components/events/EventGrid'
import { Event, Package } from '@/types'

export default async function HomePage() {
  let featuredEvents: (Event & { packages: Package[] })[] = []
  try {
    const all = await getPublishedEvents()
    featuredEvents = all.slice(0, 7)
  } catch {
    // DB pas dispo au build
  }

  return (
    <div style={{ background: 'var(--color-bg)' }}>

      {/* ══════════════════════════════════════
          HERO — Éditorial Festival
      ══════════════════════════════════════ */}
      <section
        className="grain relative min-h-screen flex flex-col justify-end pb-16 md:pb-24 overflow-hidden"
        style={{ background: 'var(--color-bg)', paddingTop: '6rem' }}
      >
        {/* Ligne verticale décorative */}
        <div
          className="absolute left-8 md:left-16 top-32 bottom-16 hidden md:block"
          style={{ width: '1px', background: 'rgba(91,168,160,0.3)' }}
        />

        <div className="max-w-7xl mx-auto px-4 md:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end">

            {/* TITRE MASSIF */}
            <div className="md:col-span-8 relative z-10">
              {/* Label de section */}
              <div className="flex items-center gap-3 mb-6">
                <div style={{ width: '2rem', height: '1px', background: 'var(--color-teal)' }} />
                <span
                  className="text-xs tracking-widest"
                  style={{
                    color: 'var(--color-teal)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.2em',
                  }}
                >
                  BILLETTERIE INTER-ÎLES CARAÏBES
                </span>
              </div>

              <h1
                className="leading-none"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(4rem, 14vw, 13rem)',
                  color: 'var(--color-text)',
                  letterSpacing: '0.01em',
                  lineHeight: 0.9,
                }}
              >
                AIN&apos;T<br />
                NOTHIN&apos;<br />
                <span style={{ color: 'var(--color-teal)' }}>LIKE</span><br />
                CARIBBEAN<br />
                <span style={{ color: 'var(--color-accent)' }}>LIFE.</span>
              </h1>

              <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <p style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-body)', fontSize: '0.9rem' }}>
                  Guadeloupe · Martinique · Marie-Galante · Les Saintes
                </p>
                <Link
                  href="/evenements"
                  className="group flex items-center gap-3 transition-all"
                  style={{
                    background: 'var(--color-teal)',
                    color: 'var(--color-primary)',
                    padding: '0.875rem 2rem',
                    fontFamily: 'var(--font-display)',
                    fontSize: '1rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  EXPLORER LES ÉVÉNEMENTS
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </Link>
              </div>
            </div>

            {/* CARD ÉVÉNEMENT FLOTTANTE */}
            <div className="md:col-span-4 relative z-10 hidden md:block">
              {featuredEvents[0] ? (
                <div
                  className="relative overflow-hidden"
                  style={{
                    background: '#111',
                    transform: 'rotate(1.5deg)',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                  }}
                >
                  <div className="relative" style={{ aspectRatio: '3/4' }}>
                    {featuredEvents[0].cover_image_url ? (
                      <Image
                        src={featuredEvents[0].cover_image_url}
                        alt={featuredEvents[0].title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2d4a44 100%)', width: '100%', height: '100%' }} />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(13,13,13,0.9) 0%, transparent 60%)' }}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <span
                      className="text-xs px-2 py-0.5 mb-2 inline-block"
                      style={{
                        background: 'var(--color-accent)',
                        color: '#fff',
                        fontFamily: 'var(--font-display)',
                        letterSpacing: '0.06em',
                      }}
                    >
                      À VENIR
                    </span>
                    <h3
                      className="text-lg font-bold leading-tight"
                      style={{ color: 'var(--color-text)', fontFamily: 'var(--font-body)' }}
                    >
                      {featuredEvents[0].title}
                    </h3>
                    <p
                      className="text-xs mt-1"
                      style={{ color: 'var(--color-teal)', fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}
                    >
                      {featuredEvents[0].venue}
                    </p>
                  </div>
                </div>
              ) : (
                <div
                  className="relative overflow-hidden flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #1A1A1A 0%, #2d4a44 100%)',
                    aspectRatio: '3/4',
                    transform: 'rotate(1.5deg)',
                  }}
                >
                  <div className="text-center p-8">
                    <p
                      className="text-4xl mb-4"
                      style={{ fontFamily: 'var(--font-display)', color: 'var(--color-teal)', letterSpacing: '0.08em' }}
                    >
                      SUMMER<br />2026
                    </p>
                    <p style={{ color: 'var(--color-muted)', fontSize: '0.85rem' }}>Événements à venir</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bande horizontale teal au bas de la section */}
        <div
          className="absolute bottom-0 left-0 right-0 flex items-center gap-8 px-4 md:px-8 overflow-hidden"
          style={{ height: '44px', background: 'var(--color-teal)', zIndex: 2 }}
        >
          {Array.from({ length: 8 }).map((_, i) => (
            <span
              key={i}
              className="flex-shrink-0 text-sm"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-primary)',
                letterSpacing: '0.1em',
                opacity: 0.7,
              }}
            >
              ♪ CARIBBEONE
            </span>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          ÉVÉNEMENTS À VENIR
      ══════════════════════════════════════ */}
      <section className="py-16 md:py-24" style={{ background: 'var(--color-bg)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex items-baseline justify-between mb-8 md:mb-12">
            <h2
              className="leading-none"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                color: 'var(--color-text)',
                letterSpacing: '0.02em',
              }}
            >
              PROCHAINS<br />
              <span style={{ color: 'var(--color-teal)' }}>ÉVÉNEMENTS</span>
            </h2>
            <Link
              href="/evenements"
              className="hidden md:flex items-center gap-2 text-sm transition-opacity hover:opacity-70"
              style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}
            >
              TOUT VOIR →
            </Link>
          </div>

          <EventGrid events={featuredEvents} />

          <div className="mt-8 md:hidden text-center">
            <Link
              href="/evenements"
              className="inline-block px-8 py-3 text-sm"
              style={{
                border: '1px solid var(--color-teal)',
                color: 'var(--color-teal)',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.08em',
              }}
            >
              VOIR TOUS LES ÉVÉNEMENTS →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          PACK ÎLES — Fond crème avec diagonale
      ══════════════════════════════════════ */}
      <section
        id="about"
        className="relative py-24 md:py-32"
        style={{
          background: 'var(--color-bg-light)',
          clipPath: 'polygon(0 4%, 100% 0, 100% 96%, 0 100%)',
          marginTop: '-3rem',
          marginBottom: '-3rem',
          paddingTop: '8rem',
          paddingBottom: '8rem',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          {/* Header asymétrique */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div style={{ width: '2rem', height: '1px', background: 'var(--color-accent)' }} />
                <span
                  className="text-xs tracking-widest"
                  style={{
                    color: 'var(--color-accent)',
                    fontFamily: 'var(--font-display)',
                    letterSpacing: '0.2em',
                  }}
                >
                  PACKS INTER-ÎLES
                </span>
              </div>
              <h2
                className="leading-none"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                  color: 'var(--color-text-dark)',
                  letterSpacing: '0.02em',
                }}
              >
                LE VOYAGE<br />
                <span style={{ color: 'var(--color-teal)' }}>INCLUS.</span>
              </h2>
            </div>
            <div className="flex items-end">
              <p style={{ color: 'var(--color-text-dark)', opacity: 0.65, fontFamily: 'var(--font-body)', lineHeight: 1.7 }}>
                Un seul achat pour l&apos;événement, la traversée en ferry et l&apos;hébergement.
                Guadeloupe, Martinique, Marie-Galante — on s&apos;occupe de tout.
              </p>
            </div>
          </div>

          {/* 3 packs — formats asymétriques */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Pack 1 — grand, accent */}
            <div
              className="md:col-span-5 p-8 flex flex-col justify-between"
              style={{
                background: 'var(--color-text-dark)',
                color: 'var(--color-text)',
                minHeight: '320px',
              }}
            >
              <div>
                <span
                  className="text-xs tracking-widest mb-4 block"
                  style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.15em' }}
                >
                  PACK ESSENTIEL
                </span>
                <h3
                  className="text-3xl leading-tight mb-3"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
                >
                  BILLET +<br />FERRY
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'rgba(247,243,238,0.6)' }}>
                  L&apos;entrée à l&apos;événement et la traversée maritime aller-retour. Simple et efficace.
                </p>
              </div>
              <Link
                href="/evenements"
                className="inline-flex items-center gap-2 text-sm mt-6"
                style={{ color: 'var(--color-teal)', fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}
              >
                EXPLORER →
              </Link>
            </div>

            {/* Pack 2 — teal, médium */}
            <div
              className="md:col-span-4 p-8 flex flex-col justify-between"
              style={{
                background: 'var(--color-teal)',
                color: 'var(--color-primary)',
                minHeight: '280px',
              }}
            >
              <div>
                <span
                  className="text-xs tracking-widest mb-4 block"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.15em', opacity: 0.7 }}
                >
                  PACK SÉJOUR
                </span>
                <h3
                  className="text-3xl leading-tight mb-3"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
                >
                  TOUT<br />INCLUS
                </h3>
                <p className="text-sm leading-relaxed" style={{ opacity: 0.75 }}>
                  Ferry + billet + hébergement sur l&apos;île. Profitez sans vous soucier de rien.
                </p>
              </div>
              <Link
                href="/evenements"
                className="inline-flex items-center gap-2 text-sm mt-6"
                style={{ color: 'var(--color-primary)', fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}
              >
                DÉCOUVRIR →
              </Link>
            </div>

            {/* Pack 3 — crème avec border, petit */}
            <div
              className="md:col-span-3 p-6 flex flex-col justify-between"
              style={{
                border: '2px solid var(--color-text-dark)',
                background: 'transparent',
                color: 'var(--color-text-dark)',
                minHeight: '240px',
              }}
            >
              <div>
                <span
                  className="text-xs tracking-widest mb-4 block"
                  style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.15em' }}
                >
                  PACK DIASPORA
                </span>
                <h3
                  className="text-2xl leading-tight mb-3"
                  style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
                >
                  VOL +<br />SÉJOUR
                </h3>
                <p className="text-sm leading-relaxed" style={{ opacity: 0.65 }}>
                  Depuis la Métropole. Vol inclus.
                </p>
              </div>
              <Link
                href="/evenements"
                className="inline-flex items-center gap-2 text-sm mt-4"
                style={{ color: 'var(--color-accent)', fontFamily: 'var(--font-display)', letterSpacing: '0.06em' }}
              >
                EN SAVOIR + →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA ORGANISATEURS — Fond teal
      ══════════════════════════════════════ */}
      <section
        className="py-20 md:py-28 relative overflow-hidden"
        style={{ background: 'var(--color-teal)', marginTop: '3rem' }}
      >
        {/* Typo décorative en arrière-plan */}
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
          aria-hidden="true"
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(8rem, 25vw, 22rem)',
              color: 'rgba(13,13,13,0.07)',
              letterSpacing: '-0.02em',
              whiteSpace: 'nowrap',
              userSelect: 'none',
            }}
          >
            ORGANISEZ
          </span>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl">
            <h2
              className="leading-none mb-6"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(3rem, 8vw, 7rem)',
                color: 'var(--color-primary)',
                letterSpacing: '0.01em',
              }}
            >
              VOUS ORGANISEZ<br />UN ÉVÉNEMENT ?
            </h2>
            <p
              className="text-base md:text-lg mb-10 max-w-xl"
              style={{ color: 'rgba(26,26,26,0.7)', fontFamily: 'var(--font-body)', lineHeight: 1.7 }}
            >
              Publiez vos événements, gérez vos packs inter-îles et recevez vos paiements en autonomie. Diaspora, ferry, hébergement — tout configuré en quelques clics.
            </p>
            <Link
              href="/organisateur"
              className="inline-flex items-center gap-3 px-8 py-4 transition-opacity hover:opacity-90"
              style={{
                background: 'var(--color-primary)',
                color: 'var(--color-text)',
                fontFamily: 'var(--font-display)',
                fontSize: '1.1rem',
                letterSpacing: '0.08em',
              }}
            >
              ACCÉDER AU BACK-OFFICE →
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          STATS BANDE
      ══════════════════════════════════════ */}
      <section
        className="py-10"
        style={{ background: 'var(--color-primary)', borderTop: '1px solid rgba(247,243,238,0.06)' }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {[
              { value: '4', label: 'ÎLES COUVERTES' },
              { value: '100%', label: 'SÉCURISÉ STRIPE' },
              { value: 'E-BILLET', label: 'INSTANTANÉ' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                    color: 'var(--color-teal)',
                    letterSpacing: '0.04em',
                    lineHeight: 1,
                  }}
                >
                  {stat.value}
                </p>
                <p
                  className="text-xs mt-1"
                  style={{ color: 'var(--color-muted)', fontFamily: 'var(--font-display)', letterSpacing: '0.12em' }}
                >
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
