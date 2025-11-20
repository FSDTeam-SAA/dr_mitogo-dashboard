"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CheckCircle, XCircle } from "lucide-react"

const verificationRequests = [
  {
    id: "1",
    username: "@johndoe",
    email: "john@example.com",
    type: "Blue Check",
    submittedAt: "2024-01-15",
    status: "pending",
  },
  {
    id: "2",
    username: "@janedoe",
    email: "jane@example.com",
    type: "Creator Program",
    submittedAt: "2024-01-14",
    status: "pending",
  },
  {
    id: "3",
    username: "@artistpro",
    email: "artist@example.com",
    type: "Blue Check",
    submittedAt: "2024-01-13",
    status: "pending",
  },
]

export default function VerificationPage() {
  const [requests, setRequests] = useState(verificationRequests)

  const handleApprove = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id))
    toast.success("Verification approved!")
  }

  const handleReject = (id: string) => {
    setRequests(requests.filter((r) => r.id !== id))
    toast.error("Verification rejected")
  }

  return (
    <div>
      <Header title="Verification Requests" description="Process user verification applications" />

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">Pending Requests</p>
            <p className="text-3xl font-bold text-primary mt-2">{requests.length}</p>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">Approved (30d)</p>
            <p className="text-3xl font-bold text-primary mt-2">234</p>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <p className="text-sm text-muted-foreground">Rejected (30d)</p>
            <p className="text-3xl font-bold text-primary mt-2">56</p>
          </div>
        </div>

        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white rounded-lg border border-border p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{request.username}</p>
                  <p className="text-sm text-muted-foreground mt-1">{request.email}</p>
                  <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                    <span>Type: {request.type}</span>
                    <span>Submitted: {request.submittedAt}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(request.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReject(request.id)}>
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
