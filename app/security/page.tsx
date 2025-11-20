"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Shield, Lock, AlertTriangle, Activity } from "lucide-react"

export default function SecurityPage() {
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
              <p className="text-2xl font-bold text-green-600">Active</p>
              <p className="text-xs text-muted-foreground mt-1">Valid until Dec 2025</p>
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
              <p className="text-2xl font-bold text-green-600">Normal</p>
              <p className="text-xs text-muted-foreground mt-1">No violations detected</p>
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
              <p className="text-2xl font-bold text-green-600">Enabled</p>
              <p className="text-xs text-muted-foreground mt-1">98.4% user adoption</p>
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
              <p className="text-2xl font-bold text-yellow-600">23</p>
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
