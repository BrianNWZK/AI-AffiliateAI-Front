"use client"

import { useState } from "react"

export function QuantumOptimizationModal({ open, onClose, panel }: { open: boolean; onClose: () => void; panel: string }) {
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<{ recommendations: string[]; quantumInsights: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Only fetch when opened and not already loaded
  React.useEffect(() => {
    if (open && !results && !loading) {
      setLoading(true)
      fetch("/api/quantum/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ panel }),
      })
        .then((res) => res.json())
        .then((data) => {
          setResults(data)
          setLoading(false)
        })
        .catch((e) => {
          setError("Quantum Core AI optimization failed.")
          setLoading(false)
        })
    }
    if (!open) {
      setResults(null)
      setError(null)
      setLoading(false)
    }
    // eslint-disable-next-line
  }, [open])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-gray-900 p-8 rounded-lg max-w-md w-full">
        <h3 className="text-lg font-bold text-white mb-4">Quantum Core Optimization</h3>
        {loading && <p className="text-white/80">Quantum Core AI is optimizing strategies...</p>}
        {error && <p className="text-red-400">{error}</p>}
        {results && (
          <>
            <p className="text-white/80 mb-4">{results.quantumInsights}</p>
            <ul className="list-disc pl-6 text-green-400">
              {results.recommendations.map((rec, i) => (
                <li key={i}>{rec}</li>
              ))}
            </ul>
          </>
        )}
        <button className="quantum-button mt-6 w-full" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
