'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Header({ user }: { user: { email?: string; role?: string } | null }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-[#1a1a1a] text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="CaribbeOne" width={40} height={40} className="rounded-full object-cover" />
          <div>
            <span className="font-bold text-lg text-[#8ab5a7]">CaribbeOne</span>
            <p className="text-xs text-gray-400 hidden sm:block">ain&apos;t nothin&apos; like caribbean life !</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/evenements" className="text-gray-300 hover:text-[#8ab5a7] transition-colors text-sm font-medium">
            Événements
          </Link>
          {user ? (
            <>
              <Link href="/compte" className="text-gray-300 hover:text-[#8ab5a7] transition-colors text-sm font-medium">
                Mon compte
              </Link>
              {user.role === 'organizer' && (
                <Link href="/organisateur" className="text-gray-300 hover:text-[#8ab5a7] transition-colors text-sm font-medium">
                  Organisateur
                </Link>
              )}
              {user.role === 'admin' && (
                <Link href="/admin" className="text-gray-300 hover:text-[#8ab5a7] transition-colors text-sm font-medium">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-white transition-colors">
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/connexion" className="text-gray-300 hover:text-[#8ab5a7] transition-colors text-sm font-medium">
                Connexion
              </Link>
              <Link href="/auth/inscription" className="bg-[#8ab5a7] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">
                S&apos;inscrire
              </Link>
            </>
          )}
        </nav>

        {/* Mobile menu button */}
        <button className="md:hidden text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#111] border-t border-gray-800 px-4 py-4 flex flex-col gap-3">
          <Link href="/evenements" className="text-gray-300 py-2 text-sm" onClick={() => setMenuOpen(false)}>Événements</Link>
          {user ? (
            <>
              <Link href="/compte" className="text-gray-300 py-2 text-sm" onClick={() => setMenuOpen(false)}>Mon compte</Link>
              <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="text-left text-gray-400 py-2 text-sm">Déconnexion</button>
            </>
          ) : (
            <>
              <Link href="/auth/connexion" className="text-gray-300 py-2 text-sm" onClick={() => setMenuOpen(false)}>Connexion</Link>
              <Link href="/auth/inscription" className="bg-[#8ab5a7] text-white px-4 py-2 rounded-lg text-sm text-center font-semibold" onClick={() => setMenuOpen(false)}>S&apos;inscrire</Link>
            </>
          )}
        </div>
      )}
    </header>
  )
}
