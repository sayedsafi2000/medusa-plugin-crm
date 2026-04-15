import { Container, Heading, Text, Button, Badge, Input, Label, Select } from "@medusajs/ui"
import { Plus, X } from "@medusajs/icons"
import { useEffect, useState } from "react"

type Campaign = {
  id: string
  name: string
  description: string | null
  type: "email" | "sms" | "whatsapp" | "multi_channel"
  status: "draft" | "scheduled" | "active" | "completed" | "cancelled"
  segment_id: string | null
  scheduled_at: string | null
  started_at: string | null
  completed_at: string | null
  total_recipients: number
  sent_count: number
  delivered_count: number
  opened_count: number
  clicked_count: number
  converted_count: number
  created_by: string
  created_at: string
}

const typeColors = {
  email: "blue",
  sms: "green",
  whatsapp: "purple",
  multi_channel: "orange",
} as const

const statusColors = {
  draft: "grey",
  scheduled: "blue",
  active: "green",
  completed: "purple",
  cancelled: "red",
} as const

export const CampaignsList = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newCampaign, setNewCampaign] = useState({
    name: "",
    description: "",
    type: "email" as Campaign["type"],
    segment_id: "",
    scheduled_at: "",
  })

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch("/admin/crm/campaigns")
        const data = await response.json() as { campaigns?: Campaign[] }
        setCampaigns(data.campaigns || [])
      } catch (error) {
        console.error("Failed to fetch campaigns:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  const handleAddCampaign = async () => {
    if (!newCampaign.name.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch("/admin/crm/campaigns", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newCampaign,
          segment_id: newCampaign.segment_id || null,
          scheduled_at: newCampaign.scheduled_at || null,
          status: "draft",
          created_by: "Admin",
        }),
      })

      const data = await response.json() as { campaign?: Campaign }
      if (data.campaign) {
        setCampaigns([data.campaign, ...campaigns])
        setNewCampaign({
          name: "",
          description: "",
          type: "email",
          segment_id: "",
          scheduled_at: "",
        })
        setShowForm(false)
      }
    } catch (error) {
      console.error("Failed to add campaign:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateStatus = async (campaignId: string, status: Campaign["status"]) => {
    try {
      const response = await fetch(`/admin/crm/campaigns/${campaignId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json() as { campaign?: Campaign }
      if (data.campaign) {
        setCampaigns(campaigns.map((c) => (c.id === campaignId ? data.campaign! : c)))
      }
    } catch (error) {
      console.error("Failed to update campaign:", error)
    }
  }

  const handleDeleteCampaign = async (campaignId: string) => {
    try {
      await fetch(`/admin/crm/campaigns/${campaignId}`, {
        method: "DELETE",
      })
      setCampaigns(campaigns.filter((c) => c.id !== campaignId))
    } catch (error) {
      console.error("Failed to delete campaign:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Campaigns</Heading>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus /> {showForm ? "Cancel" : "Create Campaign"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-4">
            <div>
              <Label>Campaign Name *</Label>
              <Input
                value={newCampaign.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                placeholder="Summer Sale Campaign"
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                value={newCampaign.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                placeholder="Campaign description..."
                className="w-full min-h-[80px] p-2 border rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={newCampaign.type}
                  onValueChange={(value) => setNewCampaign({ ...newCampaign, type: value as Campaign["type"] })}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="email">Email</Select.Item>
                    <Select.Item value="sms">SMS</Select.Item>
                    <Select.Item value="whatsapp">WhatsApp</Select.Item>
                    <Select.Item value="multi_channel">Multi-Channel</Select.Item>
                  </Select.Content>
                </Select>
              </div>
              <div>
                <Label>Segment ID</Label>
                <Input
                  value={newCampaign.segment_id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCampaign({ ...newCampaign, segment_id: e.target.value })}
                  placeholder="Segment ID (optional)"
                />
              </div>
            </div>
            <div>
              <Label>Scheduled At</Label>
              <Input
                type="datetime-local"
                value={newCampaign.scheduled_at}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCampaign({ ...newCampaign, scheduled_at: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddCampaign} disabled={submitting}>
                {submitting ? "Creating..." : "Create Campaign"}
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {campaigns.length === 0 ? (
        <Text>No campaigns found</Text>
      ) : (
        <div className="space-y-4">
          {campaigns.map((campaign) => (
            <div key={campaign.id} className="p-4 border rounded-lg relative">
              <button
                onClick={() => handleDeleteCampaign(campaign.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X />
              </button>
              <div className="flex items-center gap-2 mb-2 pr-8">
                <Heading level="h3">{campaign.name}</Heading>
                <Badge color={typeColors[campaign.type]}>{campaign.type.replace("_", " ")}</Badge>
                <Badge color={statusColors[campaign.status]}>{campaign.status}</Badge>
              </div>
              {campaign.description && (
                <Text className="text-sm text-gray-600 mb-2">{campaign.description}</Text>
              )}
              <div className="grid grid-cols-6 gap-2 mt-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Text className="text-xs text-gray-500">Recipients</Text>
                  <Text className="font-bold">{campaign.total_recipients}</Text>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Text className="text-xs text-gray-500">Sent</Text>
                  <Text className="font-bold">{campaign.sent_count}</Text>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Text className="text-xs text-gray-500">Delivered</Text>
                  <Text className="font-bold">{campaign.delivered_count}</Text>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Text className="text-xs text-gray-500">Opened</Text>
                  <Text className="font-bold">{campaign.opened_count}</Text>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Text className="text-xs text-gray-500">Clicked</Text>
                  <Text className="font-bold">{campaign.clicked_count}</Text>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Text className="text-xs text-gray-500">Converted</Text>
                  <Text className="font-bold text-green-600">{campaign.converted_count}</Text>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <Select
                  value={campaign.status}
                  onValueChange={(value) => handleUpdateStatus(campaign.id, value as Campaign["status"])}
                >
                  <Select.Trigger className="w-[140px]">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="draft">Draft</Select.Item>
                    <Select.Item value="scheduled">Scheduled</Select.Item>
                    <Select.Item value="active">Active</Select.Item>
                    <Select.Item value="completed">Completed</Select.Item>
                    <Select.Item value="cancelled">Cancelled</Select.Item>
                  </Select.Content>
                </Select>
                <Text className="text-sm text-gray-500">
                  Created: {new Date(campaign.created_at).toLocaleDateString()}
                </Text>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
