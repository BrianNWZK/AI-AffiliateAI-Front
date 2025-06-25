"use client"

import { Brain, Target, Zap } from "lucide-react"

interface AIStatusIndicatorProps {
  status: {
    neural: string
    affiliate: string
    quantum: string
  }
}

export function AIStatusIndicator({ status }: AIStatusIndicatorProps) {
  return (
    <div className="neural-card p-6">
      <h2 className="text-lg font-semibold text-white mb-4">AI Systems Status</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex items-center space-x-3">
          <Brain className="h-6 w-6 text-blue-500" />
          <div>
            <p className="text-white font-medium">Neural Commerce</p>
            <span className={`ai-status ${status.neural}`}>{status.neural === "active" ? "Active" : "Learning"}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Target className="h-6 w-6 text-blue-500" />
          <div>
            <p className="text-white font-medium">Affiliate AI</p>
            <span className={`ai-status ${status.affiliate}`}>
              {status.affiliate === "active" ? "Active" : "Learning"}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Zap className="h-6 w-6 text-blue-500" />
          <div>
            <p className="text-white font-medium">Quantum Core</p>
            <span className={`ai-status ${status.quantum}`}>
              {status.quantum === "active" ? "Active" : "Initializing"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
