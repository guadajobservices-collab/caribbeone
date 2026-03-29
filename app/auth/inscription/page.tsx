'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function InscriptionPage() {
  const [form, setForm] = useState({ email: '', password: '', first_name: '', last_name: '', island: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { first_name: form.first_name, last_name: form.last_name, island: form.island }
      }
    })
    if (error) {
      setError(error.message)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/compte'), 2000)
    }
    setLoading(false)
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 text-center max-w-md shadow-lg">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-black">Bienvenue !</h2>
          <p className="text-gray-500 mt-2">Votre compte a été créé. Redirection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-lg p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/logo.png" alt="CaribbeOne" width={60} height={60} className="rounded-full mx-auto mb-4 object-cover" />
          </Link>
          <h1 className="text-2xl font-black text-[#1a1a1a]">Créer un compte</h1>
          <p className="text-gray-400 text-sm mt-1">Rejoins la communauté caribéenne 🌴</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>}
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Prénom *</label>
              <input type="text" value={form.first_name} onChange={e => setForm({...form, first_name: e.target.value})} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]"
                placeholder="Jean" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Nom *</label>
              <input type="text" value={form.last_name} onChange={e => setForm({...form, last_name: e.target.value})} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]"
                placeholder="Dupont" />
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Email *</label>
            <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]"
              placeholder="jean@example.com" />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Mot de passe *</label>
            <input type="password" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required minLength={6}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]"
              placeholder="6 caractères minimum" />
          </div>
          
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Île de résidence</label>
            <select value={form.island} onChange={e => setForm({...form, island: e.target.value})}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7] bg-white">
              <option value="">Sélectionner...</option>
              <option value="guadeloupe">🌴 Guadeloupe</option>
              <option value="martinique">🌺 Martinique</option>
              <option value="marie-galante">⛵ Marie-Galante</option>
              <option value="les-saintes">🏝️ Les Saintes</option>
              <option value="metropole">✈️ Métropole</option>
            </select>
          </div>
          
          <button type="submit" disabled={loading}
            className="w-full bg-[#8ab5a7] text-white py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-40">
            {loading ? 'Création...' : 'Créer mon compte'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Déjà un compte ?{' '}
          <Link href="/auth/connexion" className="text-[#8ab5a7] font-semibold hover:underline">Se connecter</Link>
        </p>
      </div>
    </div>
  )
}
