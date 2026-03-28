'use client'
import { useState } from 'react'

export default function ScannerPage() {
  const [qrInput, setQrInput] = useState('')
  const [result, setResult] = useState<{ success: boolean; message: string; participant?: { first_name: string; last_name: string; event_title: string; checked_in: boolean } } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleScan = async (code: string) => {
    if (!code.trim()) return
    setLoading(true)
    setResult(null)
    try {
      const res = await fetch('/api/organisateur/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ qr_code: code.trim() }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ success: false, message: 'Erreur réseau' })
    } finally {
      setLoading(false)
      setQrInput('')
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-black text-[#1a1a1a] mb-2">Scanner QR Code</h1>
      <p className="text-gray-500 mb-8">Validez les billets à l&apos;entrée de l&apos;événement.</p>

      <div className="max-w-md">
        {/* Scan manuel */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-6">
          <h2 className="font-bold text-[#1a1a1a] mb-4">Saisie manuelle du code</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={qrInput}
              onChange={e => setQrInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleScan(qrInput)}
              placeholder="Collez ou saisissez le code QR..."
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7] font-mono"
              autoFocus
            />
            <button onClick={() => handleScan(qrInput)} disabled={loading || !qrInput.trim()}
              className="bg-[#8ab5a7] text-white px-5 py-3 rounded-xl font-bold text-sm hover:opacity-90 disabled:opacity-40">
              {loading ? '⏳' : '✓'}
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2">Appuyez sur Entrée pour valider</p>
        </div>

        {/* Résultat scan */}
        {result && (
          <div className={`rounded-2xl p-6 ${result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">{result.success ? '✅' : '❌'}</span>
              <div>
                <p className={`font-black text-lg ${result.success ? 'text-green-800' : 'text-red-700'}`}>
                  {result.success ? 'Billet validé !' : 'Billet invalide'}
                </p>
                <p className={`text-sm ${result.success ? 'text-green-600' : 'text-red-500'}`}>{result.message}</p>
              </div>
            </div>
            {result.participant && (
              <div className="bg-white rounded-xl p-3 text-sm space-y-1">
                <p><strong>Participant :</strong> {result.participant.first_name} {result.participant.last_name}</p>
                <p><strong>Événement :</strong> {result.participant.event_title}</p>
              </div>
            )}
          </div>
        )}

        <div className="mt-8 bg-[#8ab5a7]/10 rounded-2xl p-4 text-sm text-gray-600">
          <p className="font-semibold mb-2">💡 Comment utiliser le scanner ?</p>
          <ul className="space-y-1 list-disc list-inside text-xs">
            <li>Utilisez une douchette code-barre USB (lecture automatique)</li>
            <li>Ou saisissez manuellement le code et appuyez sur Entrée</li>
            <li>Chaque billet ne peut être scanné qu&apos;une seule fois</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
