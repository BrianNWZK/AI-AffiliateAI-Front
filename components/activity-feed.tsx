"use client"

import { useState, useEffect } from "react"
import { Clock, DollarSign, TrendingUp, Users, Zap, Target } from "lucide-react"

const iconMap = {
  DollarSign,
  TrendingUp,
  Users,
  Zap,
  Target,
}

export function ActivityFeed() {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        console.log("🔍 Fetching activities...")
        const response = await fetch("/api/activities/comprehensive")

        if (response.ok) {
          const data = await response.json()
          console.log("📊 Activities response:", data)

          // Handle different response formats
          let activitiesArray = []
          if (Array.isArray(data)) {
            activitiesArray = data
          } else if (data.activities && Array.isArray(data.activities)) {
            activitiesArray = data.activities
          } else if (data.data && Array.isArray(data.data)) {
            activitiesArray = data.data
          } else {
            console.warn("⚠️ Unexpected activities format:", data)
            activitiesArray = []
          }

          setActivities(activitiesArray)
          setError(null)
        } else {
          console.warn("⚠️ Activities API returned error:", response.status)
          setActivities([])
          setError("Failed to fetch activities")
        }
      } catch (error) {
        console.error("❌ Failed to fetch activities:", error)
        setActivities([])
        setError("Network error")
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()

    // Refresh activities every 2 minutes
    const interval = setInterval(fetchActivities, 120000)
    return () => clearInterval(interval)
  }, [])

  const formatTimeAgo = (date: string | Date) => {
    try {
      const now = new Date()
      const activityDate = new Date(date)
      const diffInMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60))

      if (diffInMinutes < 1) return "Just now"
      if (diffInMinutes < 60) return `${diffInMinutes}m ago`
      if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
      return `${Math.floor(diffInMinutes / 1440)}d ago`
    } catch {
      return "Recently"
    }
  }

  // Demo activities for when real data isn't available
  const demoActivities = [
    {
      id: "demo-1",
      type: "revenue",
      message: "Neural Commerce generated ₦45,000 in revenue",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      icon: "DollarSign",
      color: "text-green-400",
    },
    {
      id: "demo-2",
      type: "system",
      message: "AI optimization increased conversion rate by 12%",
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
      icon: "TrendingUp",
      color: "text-blue-500",
    },
    {
      id: "demo-3",
      type: "affiliate",
      message: "New affiliate partner generated ₦8,500",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      icon: "Users",
      color: "text-purple-400",
    },
    {
      id: "demo-4",
      type: "system",
      message: "Real-time analytics system initialized",
      timestamp: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      icon: "Zap",
      color: "text-yellow-400",
    },
  ]

  if (loading) {
    return (
      <div className="neural-card p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Clock className="h-6 w-6 text-blue-500" />
          <h2 className="text-xl font-semibold text-white">Multi-Platform Activity</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg animate-pulse">
              <div className="w-10 h-10 bg-white/10 rounded-lg"></div>
              <div className="flex-1">
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-3 bg-white/5 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Use demo activities if no real activities or error
  const displayActivities = activities.length > 0 ? activities : demoActivities

  return (
    <div className="neural-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-semibold text-white">Multi-Platform Activity</h2>
        {error && <span className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Demo Mode</span>}
      </div>

      <div className="space-y-4">
        {displayActivities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/60">No recent activities</p>
            <p className="text-white/40 text-sm mt-1">Configure your integrations to see real-time data</p>
          </div>
        ) : (
          displayActivities.map((activity: any) => {
            const IconComponent = iconMap[activity.icon as keyof typeof iconMap] || Zap
            return (
              <div key={activity.id} className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg">
                <div className={`p-2 rounded-lg bg-white/10`}>
                  <IconComponent className={`h-5 w-5 ${activity.color}`} />
                </div>
                <div className="flex-1">
                  <p className="text-white/90">{activity.message}</p>
                  <p className="text-white/50 text-sm mt-1">{formatTimeAgo(activity.timestamp)}</p>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="mt-6 text-center">
        <button className="text-blue-500 hover:text-blue-400 text-sm font-medium">
          {activities.length > 0 ? "View All Activities" : "View Demo Activities"}
        </button>
      </div>
    </div>
  )
}
