import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-[#1a1a1a] text-gray-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4 text-[#8ab5a7]">CaribbeOne</h3>
            <p className="text-sm leading-relaxed">La plateforme de billetterie événementielle inter-îles Caraïbes.</p>
            <p className="text-xs mt-2 italic">ain&apos;t nothin&apos; like caribbean life !</p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Découvrir</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/evenements" className="hover:text-[#8ab5a7] transition-colors">Tous les événements</Link></li>
              <li><Link href="/evenements?island=guadeloupe" className="hover:text-[#8ab5a7] transition-colors">Guadeloupe</Link></li>
              <li><Link href="/evenements?island=martinique" className="hover:text-[#8ab5a7] transition-colors">Martinique</Link></li>
              <li><Link href="/evenements?island=marie-galante" className="hover:text-[#8ab5a7] transition-colors">Marie-Galante</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Mon compte</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/auth/inscription" className="hover:text-[#8ab5a7] transition-colors">S&apos;inscrire</Link></li>
              <li><Link href="/auth/connexion" className="hover:text-[#8ab5a7] transition-colors">Se connecter</Link></li>
              <li><Link href="/compte/reservations" className="hover:text-[#8ab5a7] transition-colors">Mes réservations</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm">Organisateurs</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/organisateur" className="hover:text-[#8ab5a7] transition-colors">Espace organisateur</Link></li>
              <li><Link href="/organisateur/evenements/nouveau" className="hover:text-[#8ab5a7] transition-colors">Créer un événement</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs gap-2">
          <p>© 2026 CaribbeOne. Tous droits réservés.</p>
          <div className="flex gap-4">
            <Link href="/mentions-legales" className="hover:text-[#8ab5a7]">Mentions légales</Link>
            <Link href="/cgu" className="hover:text-[#8ab5a7]">CGU</Link>
            <Link href="/confidentialite" className="hover:text-[#8ab5a7]">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
