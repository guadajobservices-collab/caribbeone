import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--color-bg)' }}>
      {/* Ligne teal en haut */}
      <div style={{ height: '2px', background: 'var(--color-teal)' }} />

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          {/* Logo + tagline */}
          <div className="flex flex-col gap-3">
            <Image
              src="/logo.jpg"
              alt="CaribbeOne"
              width={48}
              height={48}
              className="object-cover"
              style={{ borderRadius: 0 }}
            />
            <p
              className="text-base leading-tight max-w-xs"
              style={{
                fontFamily: 'var(--font-display)',
                color: 'var(--color-text)',
                letterSpacing: '0.06em',
                fontSize: '1.1rem',
              }}
            >
              AIN&apos;T NOTHIN&apos; LIKE CARIBBEAN LIFE.
            </p>
            <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
              Billetterie événementielle inter-îles
            </p>
          </div>

          {/* Liens essentiels */}
          <div className="flex flex-wrap gap-x-12 gap-y-6">
            <div className="flex flex-col gap-2">
              <p
                className="text-xs mb-1"
                style={{ color: 'var(--color-teal)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}
              >
                DÉCOUVRIR
              </p>
              <Link href="/evenements" className="text-sm transition-colors hover:opacity-70" style={{ color: 'var(--color-text)' }}>
                Tous les événements
              </Link>
              <Link href="/evenements?island=guadeloupe" className="text-sm transition-colors hover:opacity-70" style={{ color: 'var(--color-muted)' }}>
                Guadeloupe
              </Link>
              <Link href="/evenements?island=martinique" className="text-sm transition-colors hover:opacity-70" style={{ color: 'var(--color-muted)' }}>
                Martinique
              </Link>
              <Link href="/evenements?island=marie-galante" className="text-sm transition-colors hover:opacity-70" style={{ color: 'var(--color-muted)' }}>
                Marie-Galante
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <p
                className="text-xs mb-1"
                style={{ color: 'var(--color-teal)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}
              >
                ORGANISATEURS
              </p>
              <Link href="/organisateur" className="text-sm transition-colors hover:opacity-70" style={{ color: 'var(--color-text)' }}>
                Espace organisateur
              </Link>
              <Link href="/organisateur/evenements/nouveau" className="text-sm transition-colors hover:opacity-70" style={{ color: 'var(--color-muted)' }}>
                Créer un événement
              </Link>
            </div>
            <div className="flex flex-col gap-2">
              <p
                className="text-xs mb-1"
                style={{ color: 'var(--color-teal)', fontFamily: 'var(--font-display)', letterSpacing: '0.1em' }}
              >
                MON COMPTE
              </p>
              <Link href="/auth/inscription" className="text-sm transition-colors hover:opacity-70" style={{ color: 'var(--color-text)' }}>
                S&apos;inscrire
              </Link>
              <Link href="/auth/connexion" className="text-sm transition-colors hover:opacity-70" style={{ color: 'var(--color-muted)' }}>
                Se connecter
              </Link>
              <Link href="/compte/reservations" className="text-sm transition-colors hover:opacity-70" style={{ color: 'var(--color-muted)' }}>
                Mes réservations
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs"
          style={{ borderTop: '1px solid rgba(247,243,238,0.08)', color: 'var(--color-muted)' }}
        >
          <p>© 2026 CaribbeOne. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/mentions-legales" className="hover:opacity-70 transition-opacity">Mentions légales</Link>
            <Link href="/cgu" className="hover:opacity-70 transition-opacity">CGU</Link>
            <Link href="/confidentialite" className="hover:opacity-70 transition-opacity">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
