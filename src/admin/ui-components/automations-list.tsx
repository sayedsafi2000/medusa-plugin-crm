import { Container, Heading, Text, Button, Badge, Input, Label, Select } from "@medusajs/ui"
import { Plus, X } from "@medusajs/icons"
import { useEffect, useState } from "react"

type Automation = {
  id: string
  name: string
  description: string | null
  type: "follow_up" | "abandoned_cart" | "birthday" | "re_engagement" | "custom"
  trigger_event: string
  trigger_conditions: Record<string, any> | null
  actions: Record<string, any>
  status: "active" | "paused" | "disabled"
  segment_id: string | null
  schedule: Record<string, any> | null
  last_run_at: string | null
  next_run_at: string | null
  run_count: number
  success_count: number
  failure_count: number
  created_by: string
  created_at: string
}

const typeColors = {
  follow_up: "blue",
  abandoned_cart: "orange",
  birthday: "purple",
  re_engagement: "green",
  custom: "grey",
} as const

const statusColors = {
  active: "green",
  paused: "orange",
  disabled: "red",
} as const

export const AutomationsList = () => {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newAutomation, setNewAutomation] = useState({
    name: "",
    description: "",
    type: "custom" as Automation["type"],
    trigger_event: "",
    segment_id: "",
  })

  useEffect(() => {
    const fetchAutomations = async () => {
      try {
        const response = await fetch("/admin/crm/automations")
        const data = await response.json() as { automations?: Automation[] }
        setAutomations(data.automations || [])
      } catch (error) {
        console.error("Failed to fetch automations:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAutomations()
  }, [])

  const handleAddAutomation = async () => {
    if (!newAutomation.name.trim() || !newAutomation.trigger_event.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch("/admin/crm/automations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newAutomation,
          segment_id: newAutomation.segment_id || null,
          actions: { type: "notification", message: `Automation: ${newAutomation.name}` },
          created_by: "Admin",
        }),
      })

      const data = await response.json() as { automation?: Automation }
      if (data.automation) {
        setAutomations([data.automation, ...automations])
        setNewAutomation({
          name: "",
          description: "",
          type: "custom",
          trigger_event: "",
          segment_id: "",
        })
        setShowForm(false)
      }
    } catch (error) {
      console.error("Failed to add automation:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateStatus = async (automationId: string, status: Automation["status"]) => {
    try {
      const response = await fetch(`/admin/crm/automations/${automationId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })

      const data = await response.json() as { automation?: Automation }
      if (data.automation) {
        setAutomations(automations.map((a) => (a.id === automationId ? data.automation! : a)))
      }
    } catch (error) {
      console.error("Failed to update automation:", error)
    }
  }

  const handleDeleteAutomation = async (automationId: string) => {
    try {
      await fetch(`/admin/crm/automations/${automationId}`, {
        method: "DELETE",
      })
      setAutomations(automations.filter((a) => a.id !== automationId))
    } catch (error) {
      console.error("Failed to delete automation:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Automations</Heading>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus /> {showForm ? "Cancel" : "Create Automation"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-4">
            <div>
              <Label>Automation Name *</Label>
              <Input
                value={newAutomation.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAutomation({ ...newAutomation, name: e.target.value })}
                placeholder="Welcome Email Automation"
              />
            </div>
            <div>
              <Label>Description</Label>
              <textarea
                value={newAutomation.description}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewAutomation({ ...newAutomation, description: e.target.value })}
                placeholder="Automation description..."
                className="w-full min-h-[80px] p-2 border rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={newAutomation.type}
                  onValueChange={(value) => setNewAutomation({ ...newAutomation, type: value as Automation["type"] })}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="follow_up">Follow Up</Select.Item>
                    <Select.Item value="abandoned_cart">Abandoned Cart</Select.Item>
                    <Select.Item value="birthday">Birthday</Select.Item>
                    <Select.Item value="re_engagement">Re-Engagement</Select.Item>
                    <Select.Item value="custom">Custom</Select.Item>
                  </Select.Content>
                </Select>
              </div>
              <div>
                <Label>Trigger Event *</Label>
                <Input
                  value={newAutomation.trigger_event}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAutomation({ ...newAutomation, trigger_event: e.target.value })}
                  placeholder="order.placed"
                />
              </div>
            </div>
            <div>
              <Label>Segment ID</Label>
              <Input
                value={newAutomation.segment_id}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewAutomation({ ...newAutomation, segment_id: e.target.value })}
                placeholder="Segment ID (optional)"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddAutomation} disabled={submitting}>
                {submitting ? "Creating..." : "Create Automation"}
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {automations.length === 0 ? (
        <Text>No automations found</Text>
      ) : (
        <div className="space-y-4">
          {automations.map((automation) => (
            <div key={automation.id} className="p-4 border rounded-lg relative">
              <button
                onClick={() => handleDeleteAutomation(automation.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X />
              </button>
              <div className="flex items-center gap-2 mb-2 pr-8">
                <Heading level="h3">{automation.name}</Heading>
                <Badge color={typeColors[automation.type]}>{automation.type.replace("_", " ")}</Badge>
                <Badge color={statusColors[automation.status]}>{automation.status}</Badge>
              </div>
              {automation.description && (
                <Text className="text-sm text-gray-600 mb-2">{automation.description}</Text>
              )}
              <Text className="text-sm">
                <span className="text-gray-500">Trigger:</span> {automation.trigger_event}
              </Text>
              <div className="grid grid-cols-3 gap-2 mt-3">
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Text className="text-xs text-gray-500">Total Runs</Text>
                  <Text className="font-bold">{automation.run_count}</Text>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Text className="text-xs text-gray-500">Success</Text>
                  <Text className="font-bold text-green-600">{automation.success_count}</Text>
                </div>
                <div className="text-center p-2 bg-gray-50 rounded">
                  <Text className="text-xs text-gray-500">Failures</Text>
                  <Text className="font-bold text-red-600">{automation.failure_count}</Text>
                </div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <Select
                  value={automation.status}
                  onValueChange={(value) => handleUpdateStatus(automation.id, value as Automation["status"])}
                >
                  <Select.Trigger className="w-[140px]">
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="active">Active</Select.Item>
                    <Select.Item value="paused">Paused</Select.Item>
                    <Select.Item value="disabled">Disabled</Select.Item>
                  </Select.Content>
                </Select>
                <Text className="text-sm text-gray-500">
                  {automation.last_run_at
                    ? `Last run: ${new Date(automation.last_run_at).toLocaleString()}`
                    : "Never run"}
                </Text>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
