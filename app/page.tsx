"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import MetricCard from "@/components/metric-card"
import { getFOMOWindows } from "@/lib/api"

interface AIEngagement {
  comments: number
  likes: number
  replies: number
}

const mostActiveUsers = [
  { username: "@sophiaArt", posts: 245, comments: 512 },
  { username: "@oliviaStyle", posts: 198, comments: 445 },
  { username: "@avaDesigns", posts: 176, comments: 389 },
  { username: "@jessicakim", posts: 154, comments: 321 },
  { username: "@emmaMusic", posts: 132, comments: 278 },
]

const aiEngagement: AIEngagement = {
  comments: 320,
  likes: 1150,
  replies: 75,
}

export default function Dashboard() {
  const [fomoStatus, setFomoStatus] = useState("Loading...")
  const [fomoStats, setFomoStats] = useState({ posts: 0, users: 0 })

  useEffect(() => {
    getFOMOWindows().then((windows) => {
      const active = windows.find((w) => w.status === "active")
      if (active) {
        const now = new Date()
        const end = new Date(active.endDate)
        const diff = end.getTime() - now.getTime()
        const hours = Math.floor(diff / 3600000)
        const minutes = Math.floor((diff % 3600000) / 60000)
        const seconds = Math.floor((diff % 60000) / 1000)
        setFomoStatus(
          `Active for another ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
        )
        setFomoStats({ posts: active.postsCreated, users: active.usersParticipated })
      }
    })
  }, [])

  return (
    <div>
      <Header title="Dashboard" description="Welcome to Casa Rancha Admin Panel" />

      <div className="p-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <MetricCard label="Total Users" value="23,450" icon="👥" trend="+12% from last month" trendUp={true} />
          <MetricCard label="Online Now" value="421" icon="🟢" trend="+5% online" trendUp={true} />
          <MetricCard label="Verified Accounts" value="3,218" icon="✓" trend="+8% verified" trendUp={true} />
          <MetricCard label="Ghost Posts (24h)" value="1,032" icon="👻" trend="-3% activity" trendUp={false} />
          <MetricCard label="Flagged Content" value="47" icon="⚠️" trend="+2 items" trendUp={false} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Top 5 Most Active Users</h2>
            <div className="space-y-4">
              {mostActiveUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {index + 1}. {user.username}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.posts} posts • {user.comments} comments
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-primary">{user.posts + user.comments}</p>
                    <p className="text-xs text-muted-foreground">interactions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">AI Engagement Today</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{aiEngagement.comments}</p>
                <p className="text-xs text-muted-foreground mt-2">AI Comments</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{aiEngagement.likes}</p>
                <p className="text-xs text-muted-foreground mt-2">AI Likes</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-primary">{aiEngagement.replies}</p>
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
                <p className="text-xs text-muted-foreground mt-2">Current FOMO window is active</p>
              </div>
              <div className="text-sm text-muted-foreground">
                <p>✓ {fomoStats.posts.toLocaleString()} posts created</p>
                <p>✓ {fomoStats.users.toLocaleString()} unique users participated</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6">
            <h2 className="text-lg font-bold text-foreground mb-4">Flagged Explicit Content</h2>
            <div className="space-y-4">
              <div className="text-3xl font-bold text-primary">47</div>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Last 24 hours detected by AI</p>
                <p>✓ 23 items hidden from under-18</p>
                <p>✓ 8 items escalated for review</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
