'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminEventActions({ eventId, currentStatus }: { eventId: string; currentStatus: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const updateStatus = async (status: string) => {
    setLoading(true)
    await fetch(`/api/admin/evenements/${eventId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <div className="flex gap-2 flex-shrink-0">
      {currentStatus === 'pending' && (
        <button onClick={() => updateStatus('published')} disabled={loading}
          className="text-xs bg-green-600 text-white px-3 py-1.5 rounded-lg hover:opacity-80 disabled:opacity-40">
          ✅ Publier
        </button>
      )}
      {currentStatus === 'published' && (
        <button onClick={() => updateStatus('cancelled')} disabled={loading}
          className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-lg hover:opacity-80 disabled:opacity-40">
          ❌ Annuler
        </button>
      )}
      {currentStatus === 'draft' && (
        <button onClick={() => updateStatus('published')} disabled={loading}
          className="text-xs bg-[#8ab5a7] text-white px-3 py-1.5 rounded-lg hover:opacity-80 disabled:opacity-40">
          Forcer publi
        </button>
      )}
    </div>
  )
}
