"use client"

import { useEffect, useState } from "react"
import { QuantumOptimizationModal } from "./quantum-optimization-modal"

// This component should be included once in your app root (e.g. in _app.tsx or layout.tsx)
export function RootQuantumModalListener() {
  const [open, setOpen] = useState(false)
  const [panel, setPanel] = useState<string>("neural")

  useEffect(() => {
    const handler = (e: any) => {
      setPanel(e.detail?.panel || "neural")
      setOpen(true)
    }
    window.addEventListener("optimize-strategies", handler)
    return () => window.removeEventListener("optimize-strategies", handler)
  }, [])

  return <QuantumOptimizationModal open={open} onClose={() => setOpen(false)} panel={panel} />
}
