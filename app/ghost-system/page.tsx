"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { TableSkeleton } from "@/components/skeleton"
import { getGhostPosts, getGhostSummary, getGhostInsights, getGhostNames, updateGhostNameStatus } from "@/lib/api"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function GhostSystemPage() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [summary, setSummary] = useState({
    totalGhostPosts: 0,
    activeThisHour: 0,
    avgEngagement: 0,
  })
  const [insights, setInsights] = useState<any | null>(null)
  const [ghostNames, setGhostNames] = useState<any[]>([])
  const [updatingName, setUpdatingName] = useState<string | null>(null)
  const [selectedPost, setSelectedPost] = useState<any | null>(null)

  const pageSize = 10

  useEffect(() => {
    getGhostSummary()
      .then(setSummary)
      .catch((error) => toast.error(error.message || "Failed to load summary"))
  }, [])

  useEffect(() => {
    getGhostInsights()
      .then(setInsights)
      .catch((error) => toast.error(error.message || "Failed to load ghost insights"))
    getGhostNames()
      .then(setGhostNames)
      .catch((error) => toast.error(error.message || "Failed to load ghost names"))
  }, [])

  useEffect(() => {
    setLoading(true)
    getGhostPosts(page, pageSize)
      .then((data) => {
        setPosts(data.posts)
        setTotal(data.total)
      })
      .catch((error) => toast.error(error.message || "Failed to load ghost posts"))
      .finally(() => setLoading(false))
  }, [page])

  const totalPages = Math.ceil(total / pageSize)

  const handleGhostNameStatus = async (name: string, status: "available" | "reserved" | "restricted") => {
    setUpdatingName(name)
    try {
      await updateGhostNameStatus(name, status)
      setGhostNames((prev) =>
        prev.map((entry) =>
          entry.name === name
            ? { ...entry, status, restricted: status === "restricted", reserved: status === "reserved" }
            : entry
        )
      )
      toast.success(`Ghost name marked as ${status}`)
    } catch (error: any) {
      toast.error(error.message || "Failed to update ghost name")
    } finally {
      setUpdatingName(null)
    }
  }

  return (
    <div>
      <Header title="Ghost System" description="Anonymous posts and ghost interactions" />

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">Total Ghost Posts</p>
            <p className="text-3xl font-bold text-primary mt-2">{summary.totalGhostPosts.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">Active This Hour</p>
            <p className="text-3xl font-bold text-primary mt-2">{summary.activeThisHour.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">Avg Engagement</p>
            <p className="text-3xl font-bold text-primary mt-2">{summary.avgEngagement.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg border border-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Content Breakdown</h3>
              <p className="text-xs text-muted-foreground">Last pull</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-muted-foreground">Words only</p>
                <p className="text-2xl font-bold text-primary">
                  {insights ? insights.breakdown.textPosts.toLocaleString() : "-"}
                </p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-muted-foreground">Images</p>
                <p className="text-2xl font-bold text-primary">
                  {insights ? insights.breakdown.imagePosts.toLocaleString() : "-"}
                </p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-muted-foreground">Videos</p>
                <p className="text-2xl font-bold text-primary">
                  {insights ? insights.breakdown.videoPosts.toLocaleString() : "-"}
                </p>
              </div>
              <div className="p-3 bg-secondary/50 rounded-lg">
                <p className="text-muted-foreground">Audio/Music</p>
                <p className="text-2xl font-bold text-primary">
                  {insights ? insights.breakdown.audioPosts.toLocaleString() : "-"}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-border p-6 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">Flagged Ghost Posts</h3>
              <p className="text-xs text-muted-foreground">Auto-hide after 3+ reports</p>
            </div>
            {!insights || insights.flagged.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing flagged right now.</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {insights.flagged.map((item: any) => (
                  <div key={item.id} className="p-3 bg-secondary/40 rounded-lg">
                    <p className="text-sm text-foreground line-clamp-2">{item.contentPreview || "No preview"}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {item.reportCount} reports · {item.ghostName || "Ghost"}
                    </p>
                    {item.reasons?.length ? (
                      <p className="text-xs text-muted-foreground mt-1">Reasons: {item.reasons.join(", ")}</p>
                    ) : null}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold text-foreground">Ghost Names</h3>
            <p className="text-xs text-muted-foreground">Reserve or restrict names from assignment</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-secondary/50">
                <tr>
                  <th className="px-4 py-2 text-left font-semibold">Ghost Name</th>
                  <th className="px-4 py-2 text-left font-semibold">User</th>
                  <th className="px-4 py-2 text-left font-semibold">School</th>
                  <th className="px-4 py-2 text-left font-semibold">Work</th>
                  <th className="px-4 py-2 text-left font-semibold">Status</th>
                  <th className="px-4 py-2 text-left font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ghostNames.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-4 text-muted-foreground text-sm">
                      No ghost names found.
                    </td>
                  </tr>
                ) : (
                  ghostNames.map((entry) => (
                    <tr key={entry.name}>
                      <td className="px-4 py-3 font-medium text-foreground">{entry.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{entry.username || "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{entry.school || "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground">{entry.work || "-"}</td>
                      <td className="px-4 py-3 text-muted-foreground capitalize">{entry.status}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGhostNameStatus(entry.name, "restricted")}
                            disabled={updatingName === entry.name}
                          >
                            Restrict
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleGhostNameStatus(entry.name, "reserved")}
                            disabled={updatingName === entry.name}
                          >
                            Reserve
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleGhostNameStatus(entry.name, "available")}
                            disabled={updatingName === entry.name}
                          >
                            Allow
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Content</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Author</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Likes</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Comments</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-6">
                      <TableSkeleton />
                    </td>
                  </tr>
                ) : posts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-6 text-sm text-muted-foreground">
                      No ghost posts found.
                    </td>
                  </tr>
                ) : (
                  posts.map((post: any) => (
                    <tr key={post.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">{post.content}</td>
                      <td className="px-6 py-4 text-sm font-medium text-primary">{post.author}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{post.likes}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{post.comments}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{post.createdAt}</td>
                      <td className="px-6 py-4 text-sm">
                        <Button size="sm" variant="ghost" onClick={() => setSelectedPost(post)}>
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {Math.min((page - 1) * pageSize + 1, total)} to {Math.min(page * pageSize, total)} of {total} posts
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1 || totalPages === 0}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
              const pageNum = page > 3 ? page + i - 2 : i + 1
              return pageNum <= totalPages ? (
                <Button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  variant={pageNum === page ? "default" : "outline"}
                  size="sm"
                >
                  {pageNum}
                </Button>
              ) : null
            })}
            <Button
              onClick={() => setPage((p) => Math.min(totalPages || 1, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              variant="outline"
              size="sm"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={!!selectedPost} onOpenChange={(open) => (open ? null : setSelectedPost(null))}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Ghost Post Details</DialogTitle>
            <DialogDescription>View the full post and engagement stats.</DialogDescription>
          </DialogHeader>
          {selectedPost ? (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-muted-foreground">Content</p>
                <p className="text-foreground mt-1">{selectedPost.content}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Author</p>
                  <p className="font-medium text-foreground">{selectedPost.author}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium text-foreground">{selectedPost.createdAt}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Likes</p>
                  <p className="font-medium text-foreground">{selectedPost.likes}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Comments</p>
                  <p className="font-medium text-foreground">{selectedPost.comments}</p>
                </div>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedPost(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
