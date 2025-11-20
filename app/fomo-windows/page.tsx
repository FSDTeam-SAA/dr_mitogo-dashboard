"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { getFOMOWindows } from "@/lib/api"
import { toast } from "sonner"

export default function FOMOWindowsPage() {
  const [windows, setWindows] = useState([])

  useEffect(() => {
    getFOMOWindows().then(setWindows)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "scheduled":
        return "bg-blue-100 text-blue-700"
      case "ended":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div>
      <Header title="FOMO Windows" description="Manage time-limited engagement windows" />

      <div className="p-8 space-y-6">
        <Button className="w-full">Create New FOMO Window</Button>

        <div className="grid grid-cols-1 gap-4">
          {windows.map((window: any) => (
            <div
              key={window.id}
              className="bg-white rounded-lg border border-border p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{window.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {window.startDate} to {window.endDate}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(window.status)}`}>
                  {window.status.charAt(0).toUpperCase() + window.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Posts Created</p>
                  <p className="text-2xl font-bold text-primary">{window.postsCreated.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Users Participated</p>
                  <p className="text-2xl font-bold text-primary">{window.usersParticipated.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" onClick={() => toast.success("Edit clicked")}>
                  Edit
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Analytics clicked")}>
                  Analytics
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Delete clicked")}>
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
