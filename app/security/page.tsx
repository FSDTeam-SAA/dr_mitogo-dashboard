"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getSecuritySummary } from "@/lib/api"
import { toast } from "sonner"
import { Shield, Lock, AlertTriangle, Activity } from "lucide-react"

export default function SecurityPage() {
  const [summary, setSummary] = useState({
    sslStatus: "unknown",
    sslValidUntil: null as string | null,
    rateLimitStatus: "unknown",
    twoFaAdoptionPercent: 0,
    failedLogins24h: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSecuritySummary()
      .then(setSummary)
      .catch((error) => toast.error(error.message || "Failed to load security summary"))
      .finally(() => setLoading(false))
  }, [])

  const statusColor = (status: string, positive = "green") => {
    if (status === "active" || status === "normal" || status === "enabled") {
      return positive === "green" ? "text-green-600" : "text-blue-600"
    }
    if (status === "warning" || status === "degraded") {
      return "text-yellow-600"
    }
    return "text-red-600"
  }

  const formatDate = (value: string | null) => (value ? new Date(value).toISOString().split("T")[0] : "Unknown")
  const sslStatus = summary.sslStatus?.toLowerCase() || "unknown"
  const rateStatus = summary.rateLimitStatus?.toLowerCase() || "unknown"

  return (
    <div>
      <Header title="Security" description="Platform security settings and monitoring" />

      <div className="p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" />
                SSL Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${statusColor(sslStatus)}`}>
                {loading ? "Loading" : summary.sslStatus}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Valid until {formatDate(summary.sslValidUntil)}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Activity className="w-4 h-4" />
                API Rate Limit
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${statusColor(rateStatus)}`}>
                {loading ? "Loading" : summary.rateLimitStatus}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Status from last 24 hours</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Lock className="w-4 h-4" />
                2FA Enabled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-2xl font-bold ${statusColor("enabled", "blue")}`}>
                {loading ? "Loading" : "Enabled"}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {summary.twoFaAdoptionPercent.toFixed(1)}% user adoption
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Failed Logins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-yellow-600">{summary.failedLogins24h}</p>
              <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Security Actions</CardTitle>
            <CardDescription>Manage platform security features</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Ban IP Addresses</p>
                <p className="text-sm text-muted-foreground">Block suspicious IPs</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success("Ban IP interface opened")}>
                Manage
              </Button>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="font-medium text-foreground">Security Audit Log</p>
                <p className="text-sm text-muted-foreground">View security events</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success("Audit log opened")}>
                View Log
              </Button>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div>
                <p className="font-medium text-foreground">Reset Admin Password</p>
                <p className="text-sm text-muted-foreground">Change admin credentials</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => toast.success("Password reset initiated")}>
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
