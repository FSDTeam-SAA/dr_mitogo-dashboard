"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { sendNotification, getNotifications } from "@/lib/api"
import { toast } from "sonner"
import { Send } from "lucide-react"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<any[]>([])
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [targetType, setTargetType] = useState("all")
  const [targetValue, setTargetValue] = useState("")
  const [mediaUrl, setMediaUrl] = useState("")
  const [loading, setLoading] = useState(false)

  const loadNotifications = () =>
    getNotifications()
      .then(setNotifications)
      .catch((error) => toast.error(error.message || "Failed to load notifications"))

  useEffect(() => {
    loadNotifications()
  }, [])

  const handleSend = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in title and content")
      return
    }
    if ((targetType === "group" || targetType === "user") && !targetValue.trim()) {
      toast.error("Please provide a target group or user id")
      return
    }

    setLoading(true)
    try {
      await sendNotification({
        title,
        content,
        targetType,
        targetValue: targetValue.trim() || undefined,
        mediaUrl: mediaUrl.trim() || undefined,
      })
      toast.success("Notification sent successfully!")
      setTitle("")
      setContent("")
      setMediaUrl("")
      setTargetValue("")
      await loadNotifications()
    } catch (error: any) {
      toast.error(error.message || "Failed to send notification")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Header title="Push Notifications" description="Send notifications to users" />

      <div className="p-8 space-y-6">
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-6">Send New Notification</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Audience</label>
              <select
                value={targetType}
                onChange={(e) => setTargetType(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg text-sm"
              >
                <option value="all">All Users</option>
                <option value="verified">Verified Only</option>
                <option value="active">Active Users</option>
                <option value="group">Specific Group</option>
                <option value="user">Specific User</option>
              </select>
            </div>
            {(targetType === "group" || targetType === "user") && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {targetType === "group" ? "Group ID" : "User ID"}
                </label>
                <Input
                  placeholder={targetType === "group" ? "Enter group id" : "Enter user id"}
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                />
              </div>
            )}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
              <Input placeholder="Notification title" value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Content</label>
              <textarea
                placeholder="Notification content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg text-sm min-h-24"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Media URL (optional)</label>
              <Input
                placeholder="Attach image/video/audio via URL"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
              />
            </div>
            <Button onClick={handleSend} disabled={loading} className="w-full">
              <Send className="w-4 h-4 mr-2" />
              {loading ? "Sending..." : "Send Notification"}
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Recent Notifications</h2>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-sm">No notifications sent yet</p>
            ) : (
                notifications.map((notif: any) => (
                  <div key={notif.id} className="p-4 bg-secondary/50 rounded-lg border border-border">
                    <p className="font-medium text-foreground">{notif.title}</p>
                    <p className="text-sm text-muted-foreground mt-1">{notif.content}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Audience: {notif.targetType || notif.targetGroup}
                      {notif.targetValue ? ` (${notif.targetValue})` : ""}
                    </p>
                    {notif.mediaUrl ? (
                      <p className="text-xs text-primary mt-1 break-all">Media: {notif.mediaUrl}</p>
                    ) : null}
                    <p className="text-xs text-muted-foreground mt-2">
                      Delivered to {notif.deliveredCount.toLocaleString()} users
                    </p>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
