"use client"
import { useEffect, useState } from "react"

export default function ArielDashboard() {
  const [aiStatus, setAIStatus] = useState<any>(null)
  const [logs, setLogs] = useState<string[]>([])
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      const res = await fetch("/api/ariel/status")
      const data = await res.json()
      setAIStatus(data)
    }
    const fetchLogs = async () => {
      const res = await fetch("/api/ariel/logs")
      const data = await res.json()
      setLogs(data.logs)
    }
    fetchStatus()
    fetchLogs()
    const interval = setInterval(() => { fetchStatus(); fetchLogs() }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handlePause = async () => {
    await fetch("/api/ariel/pause", { method: "POST" })
    setPaused(true)
  }
  const handleResume = async () => {
    await fetch("/api/ariel/resume", { method: "POST" })
    setPaused(false)
  }

  return (
    <div className="neural-card p-6">
      <h2 className="text-2xl font-bold text-white mb-4">Ariel AI Operations Dashboard</h2>
      <div className="mb-4">
        <span>Status: </span>
        <span className={aiStatus?.running ? "text-green-400" : "text-red-400"}>
          {aiStatus?.running ? "ACTIVE" : "PAUSED"}
        </span>
      </div>
      <div className="flex gap-3 mb-4">
        <button className="quantum-button" onClick={handlePause} disabled={paused}>Pause Ariel</button>
        <button className="quantum-button" onClick={handleResume} disabled={!paused}>Resume Ariel</button>
      </div>
      <div>
        <h3 className="text-white font-medium mb-2">Recent Ariel Activity</h3>
        <div className="bg-white/10 rounded p-2 text-xs text-white h-40 overflow-y-scroll">
          {logs.map((log, idx) => <div key={idx}>{log}</div>)}
        </div>
      </div>
    </div>
  )
}
