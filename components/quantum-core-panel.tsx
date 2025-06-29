"use client"

import { useEffect, useState } from "react"
import { Atom, Activity, Settings, FileText, X } from "lucide-react"

export function QuantumCorePanel() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [optimizing, setOptimizing] = useState(false)
  const [optimizeMsg, setOptimizeMsg] = useState<string | null>(null)
  const [showLogs, setShowLogs] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [logsLoading, setLogsLoading] = useState(false)
  const [logsError, setLogsError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    const fetchStatus = async () => {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch("/api/quantum/status")
        if (!res.ok) throw new Error("Quantum Core status API error")
        const data = await res.json()
        if (active) setStatus(data)
      } catch (e: any) {
        setError("Failed to fetch Quantum Core status. Showing fallback.")
        setStatus({
          status: "offline",
          lastActive: null,
          jobCount: 0,
          errorMessage: null,
        })
      } finally {
        setLoading(false)
      }
    }
    fetchStatus()
    const interval = setInterval(fetchStatus, 15000)
    return () => {
      active = false
      clearInterval(interval)
    }
  }, [])

  const handleOptimize = async () => {
    setOptimizing(true)
    setOptimizeMsg(null)
    try {
      const res = await fetch("/api/quantum/optimize", { method: "POST" })
      if (!res.ok) throw new Error("Failed to optimize")
      const data = await res.json()
      setOptimizeMsg(data.message || "Quantum optimization triggered!")
    } catch {
      setOptimizeMsg("Failed to trigger optimization.")
    } finally {
      setOptimizing(false)
      setTimeout(() => setOptimizeMsg(null), 7000)
    }
  }

  // Fetch logs when modal is opened
  const fetchLogs = async () => {
    setLogsLoading(true)
    setLogsError(null)
    try {
      const res = await fetch("/api/quantum/logs")
      if (!res.ok) throw new Error("Failed to fetch logs")
      const data = await res.json()
      setLogs(data.logs || [])
    } catch {
      setLogsError("Failed to fetch logs. Try again.")
      setLogs([])
    } finally {
      setLogsLoading(false)
    }
  }

  const openLogs = () => {
    setShowLogs(true)
    fetchLogs()
  }

  return (
    <div className="neural-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Atom className="h-6 w-6 text-purple-500" />
          <h2 className="text-xl font-semibold text-white">Quantum Core</h2>
        </div>
        <button className="p-2 text-white/70 hover:text-white" title="Settings (coming soon)">
          <Settings className="h-5 w-5" />
        </button>
      </div>
      {error && <div className="text-red-400 mb-3">{error}</div>}
      {optimizeMsg && <div className="text-blue-400 mb-3">{optimizeMsg}</div>}

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Activity className="h-5 w-5 text-purple-400 mr-2" />
          <span className="text-white font-medium">Core Status:</span>
          <span className={`ml-2 font-bold ${status?.status === "active" ? "text-green-400" : "text-red-400"}`}>
            {status?.status === "active" ? "Active" : "Offline"}
          </span>
        </div>
        <p className="text-white/70 text-sm mb-1">
          Last active: {status?.lastActive ? new Date(status.lastActive).toLocaleString() : "Never"}
        </p>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <span className="text-xs text-white/60">Jobs Running:</span>
            <span className="text-lg text-white font-bold ml-2">
              {typeof status?.jobCount === "number" ? status.jobCount : "0"}
            </span>
          </div>
          <div>
            <span className="text-xs text-white/60">Last Error:</span>
            <span className={`ml-1 text-xs ${status?.errorMessage ? "text-red-400" : "text-green-400"}`}>
              {status?.errorMessage ? status.errorMessage : "None"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex space-x-3">
        <button
          className="quantum-button flex-1"
          onClick={handleOptimize}
          disabled={optimizing}
        >
          {optimizing ? "Optimizing..." : "Quantum Optimize"}
        </button>
        <button className="quantum-button flex-1 flex items-center justify-center gap-2" onClick={openLogs}>
          <FileText className="h-5 w-5" /> View Logs
        </button>
      </div>

      {/* Logs Modal */}
      {showLogs && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
            <button
              className="absolute top-2 right-2 p-2 text-white/60 hover:text-white"
              onClick={() => setShowLogs(false)}
              aria-label="Close logs"
            >
              <X className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5" /> Quantum Core Logs
            </h3>
            {logsLoading && <div className="text-white/80">Loading logs...</div>}
            {logsError && <div className="text-red-400">{logsError}</div>}
            <div className="max-h-72 overflow-y-auto mt-2 bg-black/30 rounded p-3 text-xs text-white font-mono space-y-2">
              {logs.length === 0 && !logsLoading && !logsError && (
                <div className="text-white/40">No logs found.</div>
              )}
              {logs.map((log, idx) => (
                <div key={idx}>{log}</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
