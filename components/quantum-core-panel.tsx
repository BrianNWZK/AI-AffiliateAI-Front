"use client";

import { useEffect, useState } from "react";
import { Atom, Activity, Settings, FileText, X } from "lucide-react";

export function QuantumCorePanel() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizeMsg, setOptimizeMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/quantum/status");
        if (!res.ok) throw new Error("Quantum Core status API error");
        const data = await res.json();
        setStatus(data);
      } catch (e: any) {
        setError("Failed to fetch Quantum Core status.");
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await fetch("/api/quantum/activities");
        const data = await res.json();
        setActivities(data.activities || []);
      } catch {
        setActivities([]);
      }
    };
    fetchActivities();
    const interval = setInterval(fetchActivities, 20000);
    return () => clearInterval(interval);
  }, []);

  const handleOptimize = async () => {
    setOptimizing(true);
    setOptimizeMsg(null);
    try {
      const res = await fetch("/api/quantum/optimize", { method: "POST" });
      const data = await res.json();
      setOptimizeMsg(data.message || "Quantum optimization triggered!");
    } catch {
      setOptimizeMsg("Failed to trigger optimization.");
    } finally {
      setOptimizing(false);
      setTimeout(() => setOptimizeMsg(null), 7000);
    }
  };

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
      </div>
      <div className="mt-6 flex space-x-3">
        <button className="quantum-button flex-1" onClick={handleOptimize} disabled={optimizing}>
          {optimizing ? "Optimizing..." : "Quantum Optimize"}
        </button>
      </div>
      <div className="mt-8">
        <h3 className="text-lg text-white font-bold mb-2">Recent Quantum Activities</h3>
        {activities.length === 0 ? (
          <div className="text-white/40">No recent activities.</div>
        ) : (
          <ul className="space-y-2">
            {activities.map((a, i) => (
              <li key={i} className="bg-black/30 rounded p-2 text-white text-xs">
                [{new Date(a.timestamp).toLocaleTimeString()}] {a.type}: {a.result || a.error}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
