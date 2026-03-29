import Link from 'next/link'
import Image from 'next/image'

const WaveDivider = ({ fill = '#0D3B4A', from = '#F5E6D0' }) => (
  <svg viewBox="0 0 1440 80" xmlns="http://www.w3.org/2000/svg" className="w-full block" style={{ background: from }}>
    <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill={fill} />
  </svg>
)

export default function Footer() {
  return (
    <footer>
      <WaveDivider fill="#0D3B4A" from="#1A1A1A" />

      <div style={{ background: 'var(--color-ocean)' }}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 pt-12 pb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10">
            {/* Logo + tagline */}
            <div className="flex flex-col gap-3 max-w-xs">
              <Image
                src="/logo.jpg"
                alt="CaribbeOne"
                width={52}
                height={52}
                className="object-cover"
                style={{ borderRadius: '12px' }}
              />
              <p
                className="text-base leading-snug"
                style={{
                  fontFamily: 'var(--font-script)',
                  color: 'var(--color-sauge)',
                  fontSize: '1.2rem',
                }}
              >
                ain&apos;t nothin&apos; like caribbean life !
              </p>
              <p className="text-sm" style={{ color: 'rgba(250,250,248,0.5)', fontFamily: 'var(--font-body)' }}>
                Billetterie événementielle inter-îles Caraïbes
              </p>
            </div>

            {/* Liens */}
            <div className="flex flex-wrap gap-x-12 gap-y-6">
              <div className="flex flex-col gap-2">
                <p
                  className="text-xs mb-1 font-semibold"
                  style={{ color: 'var(--color-sauge)', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}
                >
                  Découvrir
                </p>
                {[
                  { href: '/evenements', label: 'Tous les événements' },
                  { href: '/evenements?island=guadeloupe', label: 'Guadeloupe' },
                  { href: '/evenements?island=martinique', label: 'Martinique' },
                  { href: '/evenements?island=marie-galante', label: 'Marie-Galante' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-sm transition-opacity hover:opacity-70"
                    style={{ color: 'rgba(250,250,248,0.65)', fontFamily: 'var(--font-body)' }}
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <p
                  className="text-xs mb-1 font-semibold"
                  style={{ color: 'var(--color-sauge)', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}
                >
                  Organisateurs
                </p>
                {[
                  { href: '/organisateur', label: 'Espace organisateur' },
                  { href: '/organisateur/evenements/nouveau', label: 'Créer un événement' },
                  { href: '/auth/inscription', label: "S'inscrire" },
                  { href: '/auth/connexion', label: 'Se connecter' },
                ].map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="text-sm transition-opacity hover:opacity-70"
                    style={{ color: 'rgba(250,250,248,0.65)', fontFamily: 'var(--font-body)' }}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div
            className="mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs"
            style={{ borderTop: '1px solid rgba(156,189,182,0.15)', color: 'rgba(250,250,248,0.35)', fontFamily: 'var(--font-body)' }}
          >
            <p>© 2026 CaribbeOne. Tous droits réservés.</p>
            <div className="flex gap-6">
              {[
                { href: '/mentions-legales', label: 'Mentions légales' },
                { href: '/cgu', label: 'CGU' },
                { href: '/confidentialite', label: 'Confidentialité' },
              ].map(({ href, label }) => (
                <Link key={href} href={href} className="hover:opacity-70 transition-opacity">{label}</Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
