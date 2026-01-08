"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getAICampaigns, createAICampaign, updateAICampaignStatus, deleteAICampaign } from "@/lib/api"
import { toast } from "sonner"
import { Play, Pause, Trash2 } from "lucide-react"

const getTypeLabel = (type: string) => {
  switch (type) {
    case "engagement":
      return "Engagement Booster"
    case "posts":
      return "Content Seeding"
    case "comments":
      return "Comment Catalyst"
    default:
      return type
  }
}

export default function AISettingsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [campaignName, setCampaignName] = useState("")
  const [campaignType, setCampaignType] = useState("engagement")
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)

  const loadCampaigns = () => {
    setLoading(true)
    return getAICampaigns()
      .then(setCampaigns)
      .catch((error) => toast.error(error.message || "Failed to load campaigns"))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCampaigns()
  }, [])

  const handleCreateCampaign = async () => {
    if (!campaignName.trim()) {
      toast.error("Please enter a campaign name")
      return
    }

    setCreating(true)
    try {
      await createAICampaign({
        name: campaignName.trim(),
        type: campaignType as any,
        status: "active",
      })
      toast.success("Campaign created successfully")
      setCampaignName("")
      await loadCampaigns()
    } catch (error: any) {
      toast.error(error.message || "Failed to create campaign")
    } finally {
      setCreating(false)
    }
  }

  const handleToggleStatus = async (campaign: any) => {
    const nextStatus = campaign.status === "active" ? "paused" : "active"
    try {
      await updateAICampaignStatus(campaign.id, nextStatus)
      toast.success(`Campaign ${nextStatus === "active" ? "started" : "paused"}`)
      await loadCampaigns()
    } catch (error: any) {
      toast.error(error.message || "Failed to update campaign")
    }
  }

  const handleDelete = async (campaignId: string) => {
    if (!window.confirm("Delete this campaign?")) return
    try {
      await deleteAICampaign(campaignId)
      toast.success("Campaign deleted")
      await loadCampaigns()
    } catch (error: any) {
      toast.error(error.message || "Failed to delete campaign")
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
            <Button onClick={handleCreateCampaign} disabled={creating} className="w-full">
              {creating ? "Creating..." : "Create Campaign"}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">Active Campaigns</h2>
          {loading ? (
            <div className="text-sm text-muted-foreground">Loading campaigns...</div>
          ) : campaigns.length === 0 ? (
            <div className="text-sm text-muted-foreground">No campaigns yet.</div>
          ) : (
            campaigns.map((campaign: any) => (
              <div key={campaign.id} className="bg-white rounded-lg border border-border p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-base font-bold text-foreground">{campaign.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Type: {getTypeLabel(campaign.type)} | Started {campaign.startedAt}
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
                  <Button variant="outline" size="sm" onClick={() => handleToggleStatus(campaign)}>
                    {campaign.status === "active" ? (
                      <Pause className="w-4 h-4 mr-1" />
                    ) : (
                      <Play className="w-4 h-4 mr-1" />
                    )}
                    {campaign.status === "active" ? "Pause" : "Start"}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(campaign.id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
