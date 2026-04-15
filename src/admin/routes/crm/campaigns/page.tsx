"use client"

import { useState } from "react"
import { Button, Input, Label } from "@medusajs/ui"

export default function CreateCampaignPage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "manual",
    channels: {
      email: false,
      sms: false,
      whatsapp: false,
    },
    template: {
      subject: "",
      body: "",
    },
    recipients: {
      customer_ids: [],
    },
  })

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/admin/crm/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const campaign = await response.json()
        setMessage(`Campaign created: ${campaign.id}`)
        setFormData({
          name: "",
          description: "",
          type: "manual",
          channels: { email: false, sms: false, whatsapp: false },
          template: { subject: "", body: "" },
          recipients: { customer_ids: [] },
        })
      } else {
        setMessage("Failed to create campaign")
      }
    } catch (error) {
      setMessage(`Error: ${(error as any).message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Create Campaign</h1>

      {message && (
        <div className="p-4 mb-6 bg-blue-50 border border-blue-200 rounded text-blue-700">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Campaign Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            placeholder="e.g., Spring Promotion"
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Optional description"
          />
        </div>

        <div>
          <Label>Channels</Label>
          <div className="space-y-2 mt-2">
            {["email", "sms", "whatsapp"].map((channel) => (
              <label key={channel} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.channels[channel as keyof typeof formData.channels]}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      channels: {
                        ...formData.channels,
                        [channel]: e.target.checked,
                      },
                    })
                  }
                />
                <span className="capitalize">{channel}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label htmlFor="subject">Email Subject</Label>
          <Input
            id="subject"
            value={formData.template.subject}
            onChange={(e) =>
              setFormData({
                ...formData,
                template: { ...formData.template, subject: e.target.value },
              })
            }
            placeholder="Email subject line"
          />
        </div>

        <div>
          <Label htmlFor="body">Message Body</Label>
          <textarea
            id="body"
            value={formData.template.body}
            onChange={(e) =>
              setFormData({
                ...formData,
                template: { ...formData.template, body: e.target.value },
              })
            }
            placeholder="Campaign message content"
            className="w-full p-2 border rounded h-32"
            required
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Campaign"}
        </Button>
      </form>
    </div>
  )
}
