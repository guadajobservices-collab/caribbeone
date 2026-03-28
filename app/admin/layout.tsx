import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getProfile } from '@/lib/db'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/connexion')

  const profile = await getProfile(user.id).catch(() => null)
  if (!profile || profile.role !== 'admin') redirect('/')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex gap-8">
        <aside className="hidden md:block w-52 flex-shrink-0">
          <div className="mb-4">
            <p className="text-xs font-bold text-red-500 uppercase tracking-wider mb-2">Admin</p>
          </div>
          <nav className="space-y-1">
            {[
              { href: '/admin', label: '📊 Dashboard' },
              { href: '/admin/evenements', label: '🎪 Modération' },
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
