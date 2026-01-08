"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { TableSkeleton } from "@/components/skeleton"
import { getContentFlags, reviewContent } from "@/lib/api"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight, CheckCircle, Eye } from "lucide-react"

export default function ContentPage() {
  const [flags, setFlags] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [statusFilter, setStatusFilter] = useState("all")

  const pageSize = 10

  useEffect(() => {
    setPage(1)
  }, [statusFilter])

  useEffect(() => {
    setLoading(true)
    getContentFlags(page, pageSize, statusFilter)
      .then((data) => {
        setFlags(data.flags)
        setTotal(data.total)
      })
      .catch((error) => toast.error(error.message || "Failed to load moderation queue"))
      .finally(() => setLoading(false))
  }, [page, statusFilter])

  const totalPages = Math.ceil(total / pageSize)

  const handleReview = async (flagId: string, action: "approve" | "hide") => {
    try {
      await reviewContent(flagId, action)
      toast.success(`Content ${action === "approve" ? "approved" : "hidden"} successfully`)
      setFlags(flags.filter((f: any) => f.id !== flagId))
    } catch (error) {
      toast.error("Failed to review content")
    }
  }

  return (
    <div>
      <Header title="Content Moderation" description="Review and manage flagged content" />

      <div className="p-8 space-y-6">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Filter by Status</label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg text-sm"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Post ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Content Preview</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Reason</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Author</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
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
                ) : flags.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-6">
                      <div className="text-sm text-muted-foreground">No flagged posts found.</div>
                    </td>
                  </tr>
                ) : (
                  flags.map((flag: any) => (
                    <tr key={flag.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-muted-foreground">{flag.postId}</td>
                      <td className="px-6 py-4 text-sm text-foreground max-w-xs truncate">{flag.content}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{flag.reason}</td>
                      <td className="px-6 py-4 text-sm text-primary">{flag.author}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            flag.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : flag.status === "reviewed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-primary/10 text-primary"
                          }`}
                        >
                          {flag.status.charAt(0).toUpperCase() + flag.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReview(flag.id, "approve")}
                          disabled={flag.status === "reviewed"}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReview(flag.id, "hide")}
                          disabled={flag.status === "hidden"}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Hide
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
            Showing {Math.min((page - 1) * pageSize + 1, total)} to {Math.min(page * pageSize, total)} of {total} flags
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
    </div>
  )
}
