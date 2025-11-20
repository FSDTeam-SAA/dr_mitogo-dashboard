"use client"

import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { BarChart3, TrendingUp, Eye, Clock as Click } from "lucide-react"

const campaigns = [
  { id: "1", name: "Summer Sale 2024", impressions: 45230, clicks: 1240, ctr: 2.74, spend: "$523.50" },
  { id: "2", name: "New Feature Launch", impressions: 32150, clicks: 890, ctr: 2.77, spend: "$412.20" },
  { id: "3", name: "Brand Awareness", impressions: 56780, clicks: 1560, ctr: 2.74, spend: "$634.80" },
]

export default function AdsPage() {
  return (
    <div>
      <Header title="Ad Campaigns" description="Manage advertising campaigns and analytics" />

      <div className="p-8 space-y-6">
        <Button className="w-full">Create New Campaign</Button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Impressions</p>
                <p className="text-2xl font-bold text-primary mt-2">134,160</p>
              </div>
              <Eye className="w-8 h-8 text-primary/20" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold text-primary mt-2">3,690</p>
              </div>
              <Click className="w-8 h-8 text-primary/20" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg CTR</p>
                <p className="text-2xl font-bold text-primary mt-2">2.75%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/20" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold text-primary mt-2">$1,570.50</p>
              </div>
              <BarChart3 className="w-8 h-8 text-primary/20" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-secondary/50 border-b border-border">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Campaign Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Impressions</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Clicks</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">CTR</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Spend</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-secondary/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">{campaign.name}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{campaign.impressions.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-foreground">{campaign.clicks.toLocaleString()}</td>
                    <td className="px-6 py-4 text-sm text-primary font-semibold">{campaign.ctr}%</td>
                    <td className="px-6 py-4 text-sm text-foreground">{campaign.spend}</td>
                    <td className="px-6 py-4 text-sm">
                      <Button size="sm" variant="ghost" onClick={() => toast.success("Analytics opened")}>
                        View
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
