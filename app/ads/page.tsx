"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { getAdSummary, getAdCampaigns, createAdCampaign } from "@/lib/api"
import { toast } from "sonner"
import { BarChart3, TrendingUp, Eye, Clock as Click } from "lucide-react"

export default function AdsPage() {
  const [summary, setSummary] = useState({ totalImpressions: 0, totalClicks: 0, avgCtr: 0, totalSpend: 0 })
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadCampaigns = async () => {
    setLoading(true)
    try {
      const [summaryData, campaignsData] = await Promise.all([getAdSummary(), getAdCampaigns()])
      setSummary(summaryData)
      setCampaigns(campaignsData)
    } catch (error: any) {
      toast.error(error.message || "Failed to load ad campaigns")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCampaigns()
  }, [])

  const handleCreate = async () => {
    const name = window.prompt("Campaign name")
    if (!name?.trim()) return

    try {
      await createAdCampaign({ name: name.trim() })
      toast.success("Campaign created")
      await loadCampaigns()
    } catch (error: any) {
      toast.error(error.message || "Failed to create campaign")
    }
  }

  const formatSpend = (value: number) => `$${value.toFixed(2)}`

  return (
    <div>
      <Header title="Ad Campaigns" description="Manage advertising campaigns and analytics" />

      <div className="p-8 space-y-6">
        <Button className="w-full" onClick={handleCreate}>
          Create New Campaign
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Impressions</p>
                <p className="text-2xl font-bold text-primary mt-2">
                  {summary.totalImpressions.toLocaleString()}
                </p>
              </div>
              <Eye className="w-8 h-8 text-primary/20" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Clicks</p>
                <p className="text-2xl font-bold text-primary mt-2">{summary.totalClicks.toLocaleString()}</p>
              </div>
              <Click className="w-8 h-8 text-primary/20" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg CTR</p>
                <p className="text-2xl font-bold text-primary mt-2">{summary.avgCtr.toFixed(2)}%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary/20" />
            </div>
          </div>
          <div className="bg-white rounded-lg border border-border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Spend</p>
                <p className="text-2xl font-bold text-primary mt-2">{formatSpend(summary.totalSpend)}</p>
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
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-6">
                      <div className="text-sm text-muted-foreground">Loading campaigns...</div>
                    </td>
                  </tr>
                ) : campaigns.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-6">
                      <div className="text-sm text-muted-foreground">No campaigns found.</div>
                    </td>
                  </tr>
                ) : (
                  campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{campaign.name}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{campaign.impressions.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-foreground">{campaign.clicks.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-primary font-semibold">
                        {campaign.ctr.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 text-sm text-foreground">{formatSpend(campaign.spend)}</td>
                      <td className="px-6 py-4 text-sm">
                        <Button size="sm" variant="ghost" onClick={() => toast.success("Analytics opened")}>View</Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
