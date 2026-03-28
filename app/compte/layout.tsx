import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function CompteLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion?redirect=/compte')

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        <aside className="hidden md:block w-48 flex-shrink-0">
          <nav className="space-y-1">
            {[
              { href: '/compte', label: '🏠 Tableau de bord' },
              { href: '/compte/reservations', label: '🎫 Mes réservations' },
            ].map(item => (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-[#1a1a1a] transition-colors">
                {item.label}
              </Link>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  )
}
