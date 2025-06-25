"use client"

import { Bell, Settings, User, Zap } from "lucide-react"

export function DashboardHeader() {
  return (
    <header className="bg-white/5 backdrop-blur-sm border-b border-white/10">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-8 w-8 text-blue-500" />
              <h1 className="text-2xl font-bold text-white">AI SaaS Dashboard</h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-white/70">
              <span>Neural Commerce</span>
              <span>•</span>
              <span>Affiliate AI</span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-white/70 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/70 hover:text-white transition-colors">
              <Settings className="h-5 w-5" />
            </button>
            <button className="p-2 text-white/70 hover:text-white transition-colors">
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
