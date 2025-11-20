"use client"

import { useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { MessageSquare, CheckCircle, Clock } from "lucide-react"

const supportTickets = [
  {
    id: "1",
    subject: "Bug in ghost posting",
    user: "@user123",
    status: "open",
    priority: "high",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    subject: "Feature request: dark mode",
    user: "@user456",
    status: "open",
    priority: "low",
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    subject: "Verification issue",
    user: "@user789",
    status: "in-progress",
    priority: "medium",
    createdAt: "2024-01-13",
  },
]

export default function SupportPage() {
  const [tickets, setTickets] = useState(supportTickets)

  const handleResolve = (id: string) => {
    setTickets(tickets.filter((t) => t.id !== id))
    toast.success("Ticket resolved!")
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-primary/10 text-primary"
      case "medium":
        return "bg-yellow-100 text-yellow-700"
      case "low":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <MessageSquare className="w-4 h-4 mr-1" />
      case "in-progress":
        return <Clock className="w-4 h-4 mr-1" />
      case "resolved":
        return <CheckCircle className="w-4 h-4 mr-1" />
      default:
        return null
    }
  }

  return (
    <div>
      <Header title="Support Tickets" description="Manage customer support requests" />

      <div className="p-8 space-y-6">
        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">User</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Priority</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{ticket.subject}</td>
                    <td className="px-6 py-4 text-sm text-primary">{ticket.user}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="flex items-center text-foreground">
                        {getStatusIcon(ticket.status)}
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}
                      >
                        {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{ticket.createdAt}</td>
                    <td className="px-6 py-4 text-sm">
                      <Button size="sm" variant="ghost" onClick={() => handleResolve(ticket.id)}>
                        Resolve
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
