"use client"

import { useEffect, useMemo, useState } from "react"
import Header from "@/components/header"
import MetricCard from "@/components/metric-card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  getDashboardSummary,
  DashboardSummary,
  getUsers,
  updateUserStatus,
  getContentFlags,
  reviewContent,
  getVerificationRequests,
  updateVerificationRequest,
} from "@/lib/api"
import { toast } from "sonner"

const formatDuration = (ms: number) => {
  if (ms <= 0) return "00:00:00"
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

type PanelType = "users" | "online" | "verified" | "flagged" | null

export default function Dashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null)
  const [fomoStatus, setFomoStatus] = useState("Loading...")
  const [fomoStats, setFomoStats] = useState({ posts: 0, users: 0 })
  const [panel, setPanel] = useState<PanelType>(null)
  const [panelLoading, setPanelLoading] = useState(false)
  const [panelUsers, setPanelUsers] = useState<any[]>([])
  const [panelModeration, setPanelModeration] = useState<any[]>([])
  const [panelVerifications, setPanelVerifications] = useState<any[]>([])

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

  const panelTitle = useMemo(() => {
    if (!panel) return ""
    switch (panel) {
      case "users":
        return "Total Users"
      case "online":
        return "Online Users"
      case "verified":
        return "Verification Queue"
      case "flagged":
        return "Flagged Content"
      default:
        return ""
    }
  }, [panel])

  const openPanel = (type: PanelType) => {
    setPanel(type)
    setPanelLoading(true)
    setPanelUsers([])
    setPanelModeration([])
    setPanelVerifications([])

    if (type === "flagged") {
      getContentFlags(1, 5, "pending")
        .then((data) => setPanelModeration(data.flags))
        .catch(() => toast.error("Could not load flagged content"))
        .finally(() => setPanelLoading(false))
      return
    }

    if (type === "verified") {
      getVerificationRequests("pending")
        .then((data) => setPanelVerifications(data))
        .catch(() => toast.error("Could not load verification requests"))
        .finally(() => setPanelLoading(false))
      return
    }

    const status = type === "online" ? "active" : undefined
    getUsers(1, 6, "", status)
      .then((data) => setPanelUsers(data.users))
      .catch(() => toast.error("Could not load users"))
      .finally(() => setPanelLoading(false))
  }

  const handleUserAction = async (userId: string, action: string) => {
    try {
      await updateUserStatus(userId, { action })
      toast.success("User updated")
      setPanelUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? {
                ...user,
                verified: action === "verify" ? true : action === "unverify" ? false : user.verified,
                status:
                  action === "ban" || action === "suspend"
                    ? "suspended"
                    : action === "restrict"
                      ? "inactive"
                      : action === "unban" || action === "unsuspend" || action === "unrestrict"
                        ? "active"
                        : user.status,
              }
            : user
        )
      )
    } catch (error: any) {
      toast.error(error.message || "Failed to update user")
    }
  }

  const handleModerationAction = async (flagId: string, action: "approve" | "hide") => {
    try {
      await reviewContent(flagId, action)
      toast.success(`Post ${action === "approve" ? "approved" : "hidden"}`)
      setPanelModeration((prev) => prev.filter((item) => item.id !== flagId))
    } catch (error: any) {
      toast.error(error.message || "Action failed")
    }
  }

  const handleVerificationAction = async (id: string, next: "approved" | "rejected") => {
    try {
      await updateVerificationRequest({ id, status: next, reason: next === "rejected" ? "Rejected via dashboard" : undefined })
      toast.success(`Request ${next}`)
      setPanelVerifications((prev) => prev.filter((item) => item.id !== id))
    } catch (error: any) {
      toast.error(error.message || "Update failed")
    }
  }

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
            onClick={() => openPanel("users")}
          />
          <MetricCard
            label="Online Now"
            value={summary ? summary.totals.onlineNow.toLocaleString() : "-"}
            icon="O"
            trend="-"
            trendUp={true}
            onClick={() => openPanel("online")}
          />
          <MetricCard
            label="Verified Accounts"
            value={summary ? summary.totals.verifiedAccounts.toLocaleString() : "-"}
            icon="V"
            trend="-"
            trendUp={true}
            onClick={() => openPanel("verified")}
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
            onClick={() => openPanel("flagged")}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-foreground">Top 5 Most Active Users</h2>
              <Button variant="outline" size="sm" onClick={() => openPanel("users")}>
                Quick manage
              </Button>
            </div>
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
              <Button variant="outline" size="sm" onClick={() => openPanel("flagged")}>
                Review flagged posts
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={!!panel} onOpenChange={(open) => (!open ? setPanel(null) : null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{panelTitle}</DialogTitle>
            <DialogDescription>
              {panel === "users" && "Quick actions for recently active accounts."}
              {panel === "online" && "Manage users currently marked as active."}
              {panel === "verified" && "Approve or reject pending verification requests without leaving the dashboard."}
              {panel === "flagged" && "Review and clear the most recent flagged content."}
            </DialogDescription>
          </DialogHeader>

          {panelLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : panel === "verified" ? (
            <div className="space-y-3">
              {panelVerifications.length === 0 ? (
                <p className="text-sm text-muted-foreground">No pending requests.</p>
              ) : (
                panelVerifications.map((req) => (
                  <div key={req.id} className="flex items-center justify-between bg-secondary/40 rounded-lg p-3">
                    <div>
                      <p className="font-medium text-foreground">{req.displayName}</p>
                      <p className="text-xs text-muted-foreground">{req.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleVerificationAction(req.id, "approved")}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleVerificationAction(req.id, "rejected")}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : panel === "flagged" ? (
            <div className="space-y-3">
              {panelModeration.length === 0 ? (
                <p className="text-sm text-muted-foreground">No flagged posts.</p>
              ) : (
                panelModeration.map((flag) => (
                  <div key={flag.id} className="flex items-start justify-between bg-secondary/30 rounded-lg p-3">
                    <div className="pr-4">
                      <p className="font-medium text-foreground line-clamp-2">{flag.content}</p>
                      <p className="text-xs text-muted-foreground mt-1">Reason: {flag.reason}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleModerationAction(flag.id, "approve")}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleModerationAction(flag.id, "hide")}>
                        Hide
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {panelUsers.length === 0 ? (
                <p className="text-sm text-muted-foreground">No users found.</p>
              ) : (
                panelUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between bg-secondary/30 rounded-lg p-3">
                    <div>
                      <p className="font-medium text-foreground">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.email} · {user.status}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, "verify")}>
                        Verify
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleUserAction(user.id, "ban")}>
                        Ban
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleUserAction(user.id, "restrict")}>
                        Restrict
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
