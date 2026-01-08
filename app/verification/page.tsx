"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { getVerificationRequests, getVerificationStats, updateVerificationRequest } from "@/lib/api"
import { toast } from "sonner"
import { CheckCircle, XCircle } from "lucide-react"

export default function VerificationPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [stats, setStats] = useState({ pending: 0, approved30d: 0, rejected30d: 0 })
  const [loading, setLoading] = useState(true)

  const loadRequests = async () => {
    setLoading(true)
    try {
      const [reqs, statData] = await Promise.all([getVerificationRequests(), getVerificationStats()])
      setRequests(reqs)
      setStats(statData)
    } catch (error: any) {
      toast.error(error.message || "Failed to load verification requests")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRequests()
  }, [])

  const handleApprove = async (id: string) => {
    try {
      await updateVerificationRequest({ id, status: "approved" })
      toast.success("Verification approved")
      await loadRequests()
    } catch (error: any) {
      toast.error(error.message || "Failed to approve verification")
    }
  }

  const handleReject = async (id: string) => {
    const reason = window.prompt("Reason for rejection")
    if (!reason?.trim()) {
      toast.error("Rejection reason is required")
      return
    }

    try {
      await updateVerificationRequest({ id, status: "rejected", reason: reason.trim() })
      toast.success("Verification rejected")
      await loadRequests()
    } catch (error: any) {
      toast.error(error.message || "Failed to reject verification")
    }
  }

  const statusLabel = (status: string) => {
    if (!status) return "Pending"
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div>
      <Header title="Verification Requests" description="Process user verification applications" />

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">Pending Requests</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">Approved (30d)</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.approved30d}</p>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">Rejected (30d)</p>
            <p className="text-3xl font-bold text-primary mt-2">{stats.rejected30d}</p>
          </div>
        </div>

        <div className="space-y-3">
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading requests...</div>
          ) : requests.length === 0 ? (
            <div className="text-sm text-muted-foreground">No verification requests.</div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{request.displayName}</p>
                    <p className="text-sm text-muted-foreground mt-1">{request.email}</p>
                    <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                      <span>Type: {request.type}</span>
                      <span>Submitted: {request.submittedAt}</span>
                      <span>Status: {statusLabel(request.status)}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleApprove(request.id)}
                      className="bg-green-600 hover:bg-green-700"
                      disabled={request.status === "approved"}
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(request.id)}
                      disabled={request.status === "rejected"}
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
