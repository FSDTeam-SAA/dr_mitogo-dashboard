"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAICampaigns, createAICampaign } from "@/lib/api"
import { toast } from "sonner"
import { Play, Pause, Trash2 } from "lucide-react"

export default function AISettingsPage() {
  const [campaigns, setCampaigns] = useState([])
  const [campaignName, setCampaignName] = useState("")
  const [campaignType, setCampaignType] = useState("engagement")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getAICampaigns().then(setCampaigns)
  }, [])

  const handleCreateCampaign = async () => {
    if (!campaignName.trim()) {
      toast.error("Please enter a campaign name")
      return
    }

    setLoading(true)
    try {
      await createAICampaign({
        name: campaignName,
        type: campaignType as any,
        status: "active",
      })
      toast.success("Campaign created successfully!")
      setCampaignName("")
      await getAICampaigns().then(setCampaigns)
    } catch (error) {
      toast.error("Failed to create campaign")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "paused":
        return "bg-yellow-100 text-yellow-700"
      case "completed":
        return "bg-gray-100 text-gray-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <div>
      <Header title="AI & Automation" description="Manage AI campaigns and automation settings" />

      <div className="p-8 space-y-6">
        <div className="bg-white rounded-lg border border-border p-6">
          <h2 className="text-lg font-bold text-foreground mb-4">Create New Campaign</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Campaign Name</label>
              <Input
                placeholder="e.g., Summer Engagement Boost"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Campaign Type</label>
              <select
                value={campaignType}
                onChange={(e) => setCampaignType(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-lg text-sm"
              >
                <option value="engagement">Engagement Booster</option>
                <option value="posts">Content Seeding</option>
                <option value="comments">Comment Catalyst</option>
              </select>
            </div>
            <Button onClick={handleCreateCampaign} disabled={loading} className="w-full">
              {loading ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Active Campaigns</h2>
          {campaigns.map((campaign: any) => (
            <div key={campaign.id} className="bg-white rounded-lg border border-border p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-foreground">{campaign.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Type: {campaign.type.charAt(0).toUpperCase() + campaign.type.slice(1)} • Started{" "}
                    {campaign.startedAt}
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                  {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Interactions</p>
                  <p className="text-2xl font-bold text-primary">{campaign.interactions.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reach</p>
                  <p className="text-2xl font-bold text-primary">{campaign.reach.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success(`${campaign.status === "active" ? "Paused" : "Started"}`)}
                >
                  {campaign.status === "active" ? (
                    <Pause className="w-4 h-4 mr-1" />
                  ) : (
                    <Play className="w-4 h-4 mr-1" />
                  )}
                  {campaign.status === "active" ? "Pause" : "Start"}
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast.success("Campaign deleted")}>
                  <Trash2 className="w-4 h-4 mr-1" />
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
