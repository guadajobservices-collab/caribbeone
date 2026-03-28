'use client'
import { useState } from 'react'
import { Event, Package, DeparturePoint } from '@/types'
import { formatPrice, formatDate } from '@/lib/utils'

interface Props {
  event: Event & { packages: (Package & { departure_points: DeparturePoint[] })[] }
  initialPackage?: Package & { departure_points: DeparturePoint[] }
  userId: string
}

interface Participant {
  first_name: string
  last_name: string
  birth_date: string
}

const STEPS = ['Pack', 'Départ', 'Participants', 'Récapitulatif', 'Paiement']

export default function ReservationTunnel({ event, initialPackage, userId }: Props) {
  const [step, setStep] = useState(0)
  const [selectedPackage, setSelectedPackage] = useState<Package & { departure_points: DeparturePoint[] } | undefined>(initialPackage)
  const [selectedDeparture, setSelectedDeparture] = useState<DeparturePoint | undefined>()
  const [participantCount, setParticipantCount] = useState(1)
  const [participants, setParticipants] = useState<Participant[]>([{ first_name: '', last_name: '', birth_date: '' }])
  const [acceptedCGV, setAcceptedCGV] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const totalCents = selectedPackage ? selectedPackage.price_cents * participantCount : 0

  const updateParticipant = (idx: number, field: keyof Participant, value: string) => {
    const updated = [...participants]
    updated[idx] = { ...updated[idx], [field]: value }
    setParticipants(updated)
  }

  const updateCount = (count: number) => {
    setParticipantCount(count)
    const newParts = Array.from({ length: count }, (_, i) => participants[i] || { first_name: '', last_name: '', birth_date: '' })
    setParticipants(newParts)
  }

  const handleCheckout = async () => {
    if (!selectedPackage) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: selectedPackage.id,
          departurePointId: selectedDeparture?.id,
          participants,
          userId,
          eventSlug: event.slug,
        }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Erreur lors du paiement')
      }
    } catch {
      setError('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  const canProceed = () => {
    if (step === 0) return !!selectedPackage
    if (step === 1) return !selectedPackage?.departure_points?.length || !!selectedDeparture
    if (step === 2) return participants.every(p => p.first_name && p.last_name)
    if (step === 3) return acceptedCGV
    return true
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        {STEPS.map((s, i) => (
          <div key={i} className="flex items-center gap-2 flex-shrink-0">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              i < step ? 'bg-[#8ab5a7] text-white' :
              i === step ? 'bg-[#1a1a1a] text-white' :
              'bg-gray-100 text-gray-400'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-sm font-medium ${i === step ? 'text-[#1a1a1a]' : 'text-gray-400'}`}>{s}</span>
            {i < STEPS.length - 1 && <div className={`h-0.5 w-8 ${i < step ? 'bg-[#8ab5a7]' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {/* Step 1: Pack */}
      {step === 0 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Choisissez votre pack</h2>
          <div className="space-y-3">
            {event.packages?.map(pkg => (
              <div
                key={pkg.id}
                onClick={() => setSelectedPackage(pkg as Package & { departure_points: DeparturePoint[] })}
                className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                  selectedPackage?.id === pkg.id ? 'border-[#8ab5a7] bg-[#8ab5a7]/5' : 'border-gray-200 hover:border-gray-300'
                } ${pkg.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-[#1a1a1a]">{pkg.name}</h3>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {pkg.transport_mode && (
                        <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                          {pkg.transport_mode === 'ferry' ? '⛵ Ferry' : pkg.transport_mode === 'navette' ? '🚌 Navette' : '✈️ Vol'}
                        </span>
                      )}
                      {pkg.includes_accommodation && <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">🏨 Hébergement</span>}
                      {pkg.is_diaspora && <span className="text-xs text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">Pack Diaspora</span>}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-black text-[#1a1a1a]">{formatPrice(pkg.price_cents)}</p>
                    <p className={`text-xs ${pkg.stock > 10 ? 'text-green-600' : pkg.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
                      {pkg.stock > 0 ? `${pkg.stock} places` : 'Complet'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de participants</label>
            <div className="flex items-center gap-3">
              <button onClick={() => updateCount(Math.max(1, participantCount - 1))} className="w-10 h-10 rounded-full border-2 border-gray-200 font-bold text-lg hover:border-[#8ab5a7] transition-colors">-</button>
              <span className="text-xl font-bold w-8 text-center">{participantCount}</span>
              <button onClick={() => updateCount(Math.min(10, participantCount + 1))} className="w-10 h-10 rounded-full border-2 border-gray-200 font-bold text-lg hover:border-[#8ab5a7] transition-colors">+</button>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Departure */}
      {step === 1 && selectedPackage && (
        <div>
          <h2 className="text-lg font-bold mb-4">Point de départ</h2>
          {selectedPackage.departure_points?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p>Aucun point de départ configuré pour ce pack.</p>
              <p className="text-sm mt-1">Vous pouvez passer à l&apos;étape suivante.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedPackage.departure_points?.map(dp => (
                <div
                  key={dp.id}
                  onClick={() => setSelectedDeparture(dp)}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                    selectedDeparture?.id === dp.id ? 'border-[#8ab5a7] bg-[#8ab5a7]/5' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-bold text-[#1a1a1a]">{dp.label}</h3>
                      <p className="text-sm text-gray-500">{dp.city}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>🕐 Départ : {dp.departure_time}</p>
                      {dp.return_time && <p>🔄 Retour : {dp.return_time}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Step 3: Participants */}
      {step === 2 && (
        <div>
          <h2 className="text-lg font-bold mb-4">Informations participants</h2>
          <div className="space-y-4">
            {participants.map((p, i) => (
              <div key={i} className="border border-gray-200 rounded-2xl p-4">
                <h3 className="font-semibold text-sm text-gray-600 mb-3">Participant {i + 1}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Prénom *</label>
                    <input
                      type="text"
                      value={p.first_name}
                      onChange={e => updateParticipant(i, 'first_name', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]"
                      placeholder="Jean"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">Nom *</label>
                    <input
                      type="text"
                      value={p.last_name}
                      onChange={e => updateParticipant(i, 'last_name', e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]"
                      placeholder="Dupont"
                    />
                  </div>
                </div>
                <div className="mt-3">
                  <label className="text-xs text-gray-500 mb-1 block">Date de naissance (optionnel)</label>
                  <input
                    type="date"
                    value={p.birth_date}
                    onChange={e => updateParticipant(i, 'birth_date', e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#8ab5a7]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 4: Summary */}
      {step === 3 && selectedPackage && (
        <div>
          <h2 className="text-lg font-bold mb-4">Récapitulatif</h2>
          <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Événement</span>
              <span className="font-semibold">{event.title}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-semibold text-sm">{formatDate(event.starts_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Pack</span>
              <span className="font-semibold">{selectedPackage.name}</span>
            </div>
            {selectedDeparture && (
              <div className="flex justify-between">
                <span className="text-gray-600">Départ</span>
                <span className="font-semibold">{selectedDeparture.label}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Participants</span>
              <span className="font-semibold">{participantCount}</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="text-gray-600">Prix unitaire</span>
              <span className="font-semibold">{formatPrice(selectedPackage.price_cents)}</span>
            </div>
            <div className="flex justify-between text-lg font-black">
              <span>Total</span>
              <span className="text-[#8ab5a7]">{formatPrice(totalCents)}</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <h3 className="font-semibold text-sm mb-2">Participants</h3>
            {participants.map((p, i) => (
              <div key={i} className="flex justify-between text-sm py-1">
                <span>{i + 1}. {p.first_name} {p.last_name}</span>
                {p.birth_date && <span className="text-gray-400">{p.birth_date}</span>}
              </div>
            ))}
          </div>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptedCGV}
              onChange={e => setAcceptedCGV(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-[#8ab5a7]"
            />
            <span className="text-sm text-gray-600">
              J&apos;accepte les <a href="/cgu" className="text-[#8ab5a7] underline" target="_blank">conditions générales de vente</a> et la politique d&apos;annulation de CaribbeOne.
            </span>
          </label>
        </div>
      )}

      {/* Step 5: Payment */}
      {step === 4 && (
        <div className="text-center py-8">
          <div className="text-6xl mb-4">💳</div>
          <h2 className="text-xl font-bold mb-2">Procéder au paiement</h2>
          <p className="text-gray-500 mb-4">Total : <span className="font-black text-[#1a1a1a] text-xl">{formatPrice(totalCents)}</span></p>
          <p className="text-xs text-gray-400 mb-8">Paiement sécurisé par Stripe · CB, Apple Pay, Google Pay</p>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-4 border-t border-gray-100">
        <button
          onClick={() => setStep(s => Math.max(0, s - 1))}
          className={`px-6 py-3 rounded-xl font-semibold transition-colors ${step === 0 ? 'invisible' : 'border border-gray-200 text-gray-600 hover:border-gray-400'}`}
        >
          ← Retour
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canProceed()}
            className="bg-[#8ab5a7] text-white px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Continuer →
          </button>
        ) : (
          <button
            onClick={handleCheckout}
            disabled={loading || !canProceed()}
            className="bg-[#1a1a1a] text-white px-8 py-3 rounded-xl font-bold hover:opacity-80 transition-opacity disabled:opacity-40"
          >
            {loading ? '⏳ Redirection...' : '💳 Payer maintenant'}
          </button>
        )}
      </div>
    </div>
  )
}
