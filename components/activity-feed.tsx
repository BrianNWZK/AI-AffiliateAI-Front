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

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch("/api/activities/comprehensive")
        if (response.ok) {
          const data = await response.json()
          setActivities(data)
        }
      } catch (error) {
        console.error("Failed to fetch comprehensive activities:", error)
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
    const now = new Date()
    const activityDate = new Date(date)
    const diffInMinutes = Math.floor((now.getTime() - activityDate.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return `${Math.floor(diffInMinutes / 1440)}d ago`
  }

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

  return (
    <div className="neural-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Clock className="h-6 w-6 text-blue-500" />
        <h2 className="text-xl font-semibent text-white">Multi-Platform Activity</h2>
      </div>

      <div className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-white/60">No recent activities</p>
            <p className="text-white/40 text-sm mt-1">Configure your integrations to see real-time data</p>
          </div>
        ) : (
          activities.map((activity: any) => {
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
        <button className="text-blue-500 hover:text-blue-400 text-sm font-medium">View All Platforms</button>
      </div>
    </div>
  )
}
