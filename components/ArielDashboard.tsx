"use client"
import { useEffect, useState } from "react"

export default function ArielDashboard() {
  const [aiStatus, setAIStatus] = useState<any>(null)
  const [logs, setLogs] = useState<string>("")
  const [paused, setPaused] = useState(false)
  const [loading, setLoading] = useState(true)
  const [action, setAction] = useState<null | "pause" | "resume" | "kill">(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/ariel/status")
        if (!res.ok) throw new Error("Failed to fetch status")
        const data = await res.json()
        setAIStatus(data)
        setPaused(!data.running)
      } catch {
        setError("Failed to fetch Ariel status.")
      }
    }
    const fetchLogs = async () => {
      try {
        const res = await fetch("/api/ariel/logs")
        if (!res.ok) throw new Error("Failed to fetch logs")
        const data = await res.json()
        setLogs(typeof data.logs === "string" ? data.logs : (data.logs || []).join("\n"))
      } catch {
        setLogs("Unable to load logs.")
      }
    }
    fetchStatus()
    fetchLogs()
    setLoading(false)
    const interval = setInterval(() => { fetchStatus(); fetchLogs() }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handlePause = async () => {
    setAction("pause")
    setError(null)
    setSuccess(null)
    try {
      await fetch("/api/ariel/pause", { method: "POST" })
      setPaused(true)
      setSuccess("Ariel paused.")
    } catch {
      setError("Failed to pause Ariel.")
    } finally {
      setAction(null)
    }
  }
  const handleResume = async () => {
    setAction("resume")
    setError(null)
    setSuccess(null)
    try {
      await fetch("/api/ariel/resume", { method: "POST" })
      setPaused(false)
      setSuccess("Ariel resumed.")
    } catch {
      setError("Failed to resume Ariel.")
    } finally {
      setAction(null)
    }
  }
  const handleKill = async () => {
    if (!window.confirm("Are you sure? This will activate Ariel's kill switch.")) return
    setAction("kill")
    setError(null)
    setSuccess(null)
    try {
      await fetch("/api/ariel/kill", { method: "POST" })
      setSuccess("Kill switch activated. Ariel will be erased on next restart.")
    } catch {
      setError("Failed to activate kill switch.")
    } finally {
      setAction(null)
    }
  }

  return (
    <div className="neural-card p-6 rounded-xl bg-gradient-to-br from-[#1A2238] via-[#283655] to-[#1a1f2b] shadow-lg border border-[#394056] mb-8">
      <h2 className="text-2xl font-bold text-white mb-4">Ariel AI Operations Dashboard</h2>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {success && <div className="text-green-400 mb-2">{success}</div>}
      <div className="mb-4">
        <span>Status: </span>
        <span className={aiStatus?.running ? "text-green-400" : "text-red-400"}>
          {aiStatus?.running ? "ACTIVE" : "PAUSED"}
        </span>
      </div>
      <div className="flex gap-3 mb-4">
        <button className="quantum-button bg-yellow-600 text-white px-4 py-2 rounded"
          onClick={handlePause} disabled={paused || action !== null}>
          Pause Ariel
        </button>
        <button className="quantum-button bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleResume} disabled={!paused || action !== null}>
          Resume Ariel
        </button>
        <button className="quantum-button bg-red-700 text-white px-4 py-2 rounded"
          onClick={handleKill} disabled={action !== null}>
          Kill Switch
        </button>
      </div>
      <div>
        <h3 className="text-white font-medium mb-2">Recent Ariel Activity</h3>
        <div className="bg-white/10 rounded p-2 text-xs text-white h-40 overflow-y-scroll whitespace-pre-line">
          {logs}
        </div>
      </div>
    </div>
  )
}
