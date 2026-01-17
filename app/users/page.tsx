"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TableSkeleton } from "@/components/skeleton"
import { getUserProfile, getUsers, updateUserStatus } from "@/lib/api"
import { toast } from "sonner"
import { ChevronLeft, ChevronRight, Search, Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedUser, setSelectedUser] = useState<any | null>(null)
  const [selectedUserProfile, setSelectedUserProfile] = useState<any | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const pageSize = 10

  useEffect(() => {
    setPage(1)
  }, [searchTerm, statusFilter])

  useEffect(() => {
    setLoading(true)
    getUsers(page, pageSize, searchTerm, statusFilter)
      .then((data) => {
        setUsers(data.users)
        setTotal(data.total)
      })
      .catch((error) => {
        toast.error(error.message || "Failed to load users")
      })
      .finally(() => setLoading(false))
  }, [page, searchTerm, statusFilter])

  const totalPages = Math.ceil(total / pageSize)

  const handleExport = () => {
    const csv = [
      ["Username", "Email", "Status", "Posts", "Comments", "Verified", "Join Date"],
      ...users.map((u) => [
        u.username,
        u.email,
        u.status,
        u.postsCount,
        u.commentsCount,
        u.verified ? "Yes" : "No",
        u.joinDate,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `users-export-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    toast.success("Users exported successfully")
  }

  const openManageUser = async (user: any) => {
    setSelectedUser(user)
    setDetailLoading(true)
    try {
      const profile = await getUserProfile(user.id)
      setSelectedUserProfile(profile)
    } catch (error: any) {
      toast.error(error.message || "Failed to load user details")
    } finally {
      setDetailLoading(false)
    }
  }

  const handleCloseDialog = () => {
    setSelectedUser(null)
    setSelectedUserProfile(null)
  }

  const applyStatusLocally = (action: string) => {
    const deriveStatus = (current: string) => {
      if (action === "ban" || action === "suspend") return "suspended"
      if (action === "restrict") return "inactive"
      if (["unban", "unsuspend", "unrestrict"].includes(action)) return "active"
      return current
    }

    setUsers((prev) =>
      prev.map((user) =>
        user.id === selectedUser?.id
          ? {
              ...user,
              status: deriveStatus(user.status),
              verified: action === "verify" ? true : action === "unverify" ? false : user.verified,
            }
          : user
      )
    )
    setSelectedUser((prev) =>
      prev
        ? {
            ...prev,
            status: deriveStatus(prev.status),
            verified: action === "verify" ? true : action === "unverify" ? false : prev.verified,
          }
        : prev
    )
    setSelectedUserProfile((prev) =>
      prev
        ? {
            ...prev,
            status: deriveStatus(prev.status || "active"),
            verified: action === "verify" ? true : action === "unverify" ? false : prev.verified,
          }
        : prev
    )
  }

  const handleUserAction = async (action: string) => {
    if (!selectedUser) return
    setActionLoading(true)
    try {
      await updateUserStatus(selectedUser.id, { action })
      applyStatusLocally(action)
      toast.success("User updated")
    } catch (error: any) {
      toast.error(error.message || "Failed to update user")
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <div>
      <Header title="User Management" description="Manage and view all platform users" />

      <div className="p-8 space-y-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="text-sm font-medium text-foreground mb-2 block">Search Users</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by username or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg text-sm"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <Button onClick={handleExport} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Username</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Phone</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Posts</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Comments</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Verified</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">School</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Work</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Ghost Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Join Date</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan={8} className="px-6 py-6">
                      <TableSkeleton />
                    </td>
                  </tr>
                ) : (
                  users.map((user: any) => (
                    <tr key={user.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{user.username}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.phoneNumber || "-"}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.status === "active"
                              ? "bg-green-100 text-green-700"
                              : user.status === "inactive"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-primary/10 text-primary"
                          }`}
                        >
                          {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{user.postsCount}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{user.commentsCount}</td>
                      <td className="px-6 py-4 text-sm">{user.verified ? "Yes" : "-"}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.education || "-"}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.work || "-"}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.anonymousId || "-"}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{user.joinDate}</td>
                      <td className="px-6 py-4 text-sm">
                        <Button size="sm" variant="ghost" onClick={() => openManageUser(user)}>
                          Manage
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
            Showing {Math.min((page - 1) * pageSize + 1, total)} to {Math.min(page * pageSize, total)} of {total} users
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

      <Dialog open={!!selectedUser} onOpenChange={(open) => (open ? null : handleCloseDialog())}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>Manage account status and flags.</DialogDescription>
          </DialogHeader>
          {detailLoading ? (
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          ) : selectedUser ? (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Username</p>
                  <p className="font-medium text-foreground">{(selectedUserProfile || selectedUser).username}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium text-foreground">{(selectedUserProfile || selectedUser).email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Phone</p>
                  <p className="font-medium text-foreground">{(selectedUserProfile || selectedUser).phoneNumber || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p className="font-medium text-foreground">{selectedUser.status}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Verified</p>
                  <p className="font-medium text-foreground">{selectedUser.verified ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Ghost Name</p>
                  <p className="font-medium text-foreground">{(selectedUserProfile || selectedUser).anonymousId || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">School</p>
                  <p className="font-medium text-foreground">{(selectedUserProfile || selectedUser).education || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Work</p>
                  <p className="font-medium text-foreground">{(selectedUserProfile || selectedUser).work || "-"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Posts</p>
                  <p className="font-medium text-foreground">{selectedUser.postsCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Comments</p>
                  <p className="font-medium text-foreground">{selectedUser.commentsCount}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Joined</p>
                  <p className="font-medium text-foreground">{selectedUser.joinDate}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Button size="sm" onClick={() => handleUserAction(selectedUser.verified ? "unverify" : "verify")} disabled={actionLoading}>
                  {selectedUser.verified ? "Remove verification" : "Verify user"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleUserAction("ban")} disabled={actionLoading}>
                  Ban account
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleUserAction("unban")} disabled={actionLoading}>
                  Lift ban
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleUserAction("restrict")} disabled={actionLoading}>
                  Restrict account
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleUserAction("unrestrict")} disabled={actionLoading}>
                  Lift restriction
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleUserAction("suspend")} disabled={actionLoading}>
                  Suspend
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleUserAction("unsuspend")} disabled={actionLoading}>
                  Resume
                </Button>
              </div>
            </div>
          ) : null}
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialog}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
