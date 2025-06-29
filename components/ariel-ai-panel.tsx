"use client"

import { useEffect, useState } from "react"
import { Cpu, Zap, Settings, FileText, X } from "lucide-react"

export function ArielAIPanel() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastActive, setLastActive] = useState<string | null>(null)
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
        const res = await fetch("/api/ariel/status")
        if (!res.ok) throw new Error("ArielAI status API error")
        const data = await res.json()
        if (active) {
          setStatus(data)
          setLastActive(data.lastActive)
        }
      } catch (e: any) {
        setError("Failed to fetch ArielAI status. Showing fallback.")
        setStatus({ running: false, lastActive: null, processingCount: 0, lastError: null })
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
      const res = await fetch("/api/ariel/optimize", { method: "POST" })
      if (!res.ok) throw new Error("Failed to optimize")
      const data = await res.json()
      setOptimizeMsg(data.message || "Optimization triggered successfully!")
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
      const res = await fetch("/api/ariel/logs")
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
          <Cpu className="h-6 w-6 text-green-500" />
          <h2 className="text-xl font-semibold text-white">Ariel AI Core</h2>
        </div>
        <button className="p-2 text-white/70 hover:text-white" title="Settings (coming soon)">
          <Settings className="h-5 w-5" />
        </button>
      </div>

      {error && <div className="text-red-400 mb-3">{error}</div>}
      {optimizeMsg && <div className="text-blue-400 mb-3">{optimizeMsg}</div>}

      <div className="mb-6">
        <div className="flex items-center mb-2">
          <Zap className="h-5 w-5 text-green-400 mr-2" />
          <span className="text-white font-medium">Core Status:</span>
          <span className={`ml-2 font-bold ${status?.running ? "text-green-400" : "text-red-400"}`}>
            {status?.running ? "Active" : "Offline"}
          </span>
        </div>
        <p className="text-white/70 text-sm mb-1">
          Last active: {lastActive ? new Date(lastActive).toLocaleString() : "Never"}
        </p>
        <div className="grid grid-cols-2 gap-3 mt-2">
          <div>
            <span className="text-xs text-white/60">Processing:</span>
            <span className="text-lg text-white font-bold ml-2">
              {typeof status?.processingCount === "number" ? status.processingCount : "0"}
            </span>
          </div>
          <div>
            <span className="text-xs text-white/60">Last Error:</span>
            <span className={`ml-1 text-xs ${status?.lastError ? "text-red-400" : "text-green-400"}`}>
              {status?.lastError ? status.lastError : "None"}
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
          {optimizing ? "Optimizing..." : "Optimize Ariel AI"}
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
              <FileText className="h-5 w-5" /> ArielAI Logs
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
