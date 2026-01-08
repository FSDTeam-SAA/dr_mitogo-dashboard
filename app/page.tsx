"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import MetricCard from "@/components/metric-card"
import { getDashboardSummary, DashboardSummary } from "@/lib/api"

const formatDuration = (ms: number) => {
  if (ms <= 0) return "00:00:00"
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [fomoStatus, setFomoStatus] = useState("Loading...")
  const [fomoStats, setFomoStats] = useState({ posts: 0, users: 0 })

  useEffect(() => {
    let mounted = true

    getDashboardSummary()
      .then((data) => {
        if (!mounted) return
        setSummary(data)

        if (data.fomoStatus.isActive) {
          setFomoStats({
            posts: data.fomoStatus.stats.postCount,
            users: data.fomoStatus.stats.participantCount,
          })
        } else {
          setFomoStatus("No active window")
          setFomoStats({ posts: 0, users: 0 })
        }
      })
      .catch(() => {
        if (!mounted) return
        setFomoStatus("Unavailable")
      })

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!summary || !summary.fomoStatus.isActive) return

    const endTime = new Date(summary.fomoStatus.endTime).getTime()

    const updateStatus = () => {
      const remaining = endTime - Date.now()
      if (remaining <= 0) {
        setFomoStatus("Window ended")
        return
      }
      setFomoStatus(`Active for another ${formatDuration(remaining)}`)
    }

    updateStatus()
    const interval = window.setInterval(updateStatus, 1000)

    return () => window.clearInterval(interval)
  }, [summary])

  return (
    <div>
      <Header title="Dashboard" description="Welcome to Casa Rancha Admin Panel" />

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard
            label="Total Users"
            value={summary ? summary.totals.users.toLocaleString() : "-"}
            icon="U"
            trend="-"
            trendUp={true}
          />
          <MetricCard
            label="Online Now"
            value={summary ? summary.totals.onlineNow.toLocaleString() : "-"}
            icon="O"
            trend="-"
            trendUp={true}
          />
          <MetricCard
            label="Verified Accounts"
            value={summary ? summary.totals.verifiedAccounts.toLocaleString() : "-"}
            icon="V"
            trend="-"
            trendUp={true}
          />
          <MetricCard
            label="Ghost Posts (24h)"
            value={summary ? summary.totals.ghostPosts24h.toLocaleString() : "-"}
            icon="G"
            trend="-"
            trendUp={false}
          />
          <MetricCard
            label="Flagged Content"
            value={summary ? summary.totals.flaggedContent.toLocaleString() : "-"}
            icon="!"
            trend="-"
            trendUp={false}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Top 5 Most Active Users</h2>
            <div className="space-y-4">
              {summary?.topActiveUsers?.length ? (
                summary.topActiveUsers.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">
                        {index + 1}. {user.username || user.displayName || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {user.posts} posts / {user.comments} comments
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">{user.interactions}</p>
                      <p className="text-xs text-muted-foreground">interactions</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No activity yet.</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">AI Engagement Today</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {summary ? summary.aiEngagementToday.comments : 0}
                </p>
                <p className="text-xs text-muted-foreground mt-2">AI Comments</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {summary ? summary.aiEngagementToday.likes : 0}
                </p>
                <p className="text-xs text-muted-foreground mt-2">AI Likes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">
                  {summary ? summary.aiEngagementToday.replies : 0}
                </p>
                <p className="text-xs text-muted-foreground mt-2">AI Replies</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">FOMO Window Status</h2>
            <div className="space-y-4">
              <div className="bg-secondary rounded p-4">
                <p className="text-sm font-medium text-foreground">{fomoStatus}</p>
                <p className="text-xs text-muted-foreground mt-2">
                  {summary?.fomoStatus.isActive
                    ? "Current FOMO window is active"
                    : "No active FOMO window"}
                </p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>- {fomoStats.posts.toLocaleString()} posts created</p>
                <p>- {fomoStats.users.toLocaleString()} unique users participated</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Flagged Explicit Content</h2>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-primary">
                {summary ? summary.flaggedExplicitContent.total : 0}
              </div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Last 24 hours detected by AI</p>
                <p>- {summary ? summary.flaggedExplicitContent.hiddenUnder18 : 0} items hidden from under-18</p>
                <p>- {summary ? summary.flaggedExplicitContent.escalated : 0} items escalated for review</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
