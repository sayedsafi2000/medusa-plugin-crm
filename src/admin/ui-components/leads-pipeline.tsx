import { Container, Heading, Text, Button, Badge, Input, Label, Select } from "@medusajs/ui"
import { Plus, X } from "@medusajs/icons"
import { useEffect, useState } from "react"

type Lead = {
  id: string
  customer_id: string | null
  contact_name: string
  contact_email: string
  contact_phone: string | null
  company: string | null
  source: "website" | "referral" | "social_media" | "email" | "phone" | "other"
  stage: "new" | "qualified" | "proposal" | "negotiation" | "won" | "lost"
  estimated_value: number | null
  probability: number
  expected_close_date: string | null
  assigned_to: string | null
  notes: string | null
  lost_reason: string | null
  created_by: string
  created_at: string
}

const stages = ["new", "qualified", "proposal", "negotiation", "won", "lost"] as const
const stageColors = {
  new: "grey",
  qualified: "blue",
  proposal: "orange",
  negotiation: "purple",
  won: "green",
  lost: "red",
} as const

const sourceColors = {
  website: "blue",
  referral: "green",
  social_media: "purple",
  email: "orange",
  phone: "grey",
  other: "grey",
} as const

export const LeadsPipeline = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newLead, setNewLead] = useState({
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    company: "",
    source: "other" as Lead["source"],
    stage: "new" as Lead["stage"],
    estimated_value: "",
    probability: 0,
    expected_close_date: "",
    assigned_to: "",
    notes: "",
  })

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("/admin/crm/leads")
        const data = await response.json() as { leads?: Lead[] }
        setLeads(data.leads || [])
      } catch (error) {
        console.error("Failed to fetch leads:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  const handleAddLead = async () => {
    if (!newLead.contact_name.trim() || !newLead.contact_email.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch("/admin/crm/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newLead,
          estimated_value: newLead.estimated_value ? Number(newLead.estimated_value) : null,
          created_by: "Admin",
        }),
      })

      const data = await response.json() as { lead?: Lead }
      if (data.lead) {
        setLeads([data.lead, ...leads])
        setNewLead({
          contact_name: "",
          contact_email: "",
          contact_phone: "",
          company: "",
          source: "other",
          stage: "new",
          estimated_value: "",
          probability: 0,
          expected_close_date: "",
          assigned_to: "",
          notes: "",
        })
        setShowForm(false)
      }
    } catch (error) {
      console.error("Failed to add lead:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleUpdateStage = async (leadId: string, stage: Lead["stage"]) => {
    try {
      const response = await fetch(`/admin/crm/leads/${leadId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ stage }),
      })

      const data = await response.json() as { lead?: Lead }
      if (data.lead) {
        setLeads(leads.map((lead) => (lead.id === leadId ? data.lead! : lead)))
      }
    } catch (error) {
      console.error("Failed to update lead:", error)
    }
  }

  const handleDeleteLead = async (leadId: string) => {
    try {
      await fetch(`/admin/crm/leads/${leadId}`, {
        method: "DELETE",
      })
      setLeads(leads.filter((lead) => lead.id !== leadId))
    } catch (error) {
      console.error("Failed to delete lead:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  const leadsByStage = stages.reduce((acc, stage) => {
    acc[stage] = leads.filter((lead) => lead.stage === stage)
    return acc
  }, {} as Record<string, Lead[]>)

  const totalValue = leads.reduce((sum, lead) => sum + (lead.estimated_value || 0), 0)

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Heading level="h2">Sales Pipeline</Heading>
          <Text className="text-sm text-gray-500">
            Total Pipeline Value: ${totalValue.toLocaleString()} | {leads.length} Leads
          </Text>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus /> {showForm ? "Cancel" : "Add Lead"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contact Name *</Label>
                <Input
                  value={newLead.contact_name}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLead({ ...newLead, contact_name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div>
                <Label>Contact Email *</Label>
                <Input
                  type="email"
                  value={newLead.contact_email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLead({ ...newLead, contact_email: e.target.value })}
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Contact Phone</Label>
                <Input
                  value={newLead.contact_phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLead({ ...newLead, contact_phone: e.target.value })}
                  placeholder="+1 234 567 890"
                />
              </div>
              <div>
                <Label>Company</Label>
                <Input
                  value={newLead.company}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLead({ ...newLead, company: e.target.value })}
                  placeholder="Acme Inc"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Source</Label>
                <Select
                  value={newLead.source}
                  onValueChange={(value) => setNewLead({ ...newLead, source: value as Lead["source"] })}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="website">Website</Select.Item>
                    <Select.Item value="referral">Referral</Select.Item>
                    <Select.Item value="social_media">Social Media</Select.Item>
                    <Select.Item value="email">Email</Select.Item>
                    <Select.Item value="phone">Phone</Select.Item>
                    <Select.Item value="other">Other</Select.Item>
                  </Select.Content>
                </Select>
              </div>
              <div>
                <Label>Stage</Label>
                <Select
                  value={newLead.stage}
                  onValueChange={(value) => setNewLead({ ...newLead, stage: value as Lead["stage"] })}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="new">New</Select.Item>
                    <Select.Item value="qualified">Qualified</Select.Item>
                    <Select.Item value="proposal">Proposal</Select.Item>
                    <Select.Item value="negotiation">Negotiation</Select.Item>
                    <Select.Item value="won">Won</Select.Item>
                    <Select.Item value="lost">Lost</Select.Item>
                  </Select.Content>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Estimated Value</Label>
                <Input
                  type="number"
                  value={newLead.estimated_value}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLead({ ...newLead, estimated_value: e.target.value })}
                  placeholder="1000"
                />
              </div>
              <div>
                <Label>Probability (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={newLead.probability}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLead({ ...newLead, probability: Number(e.target.value) })}
                  placeholder="50"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Expected Close Date</Label>
                <Input
                  type="date"
                  value={newLead.expected_close_date}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLead({ ...newLead, expected_close_date: e.target.value })}
                />
              </div>
              <div>
                <Label>Assigned To</Label>
                <Input
                  value={newLead.assigned_to}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLead({ ...newLead, assigned_to: e.target.value })}
                  placeholder="Sales Rep"
                />
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <textarea
                value={newLead.notes}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewLead({ ...newLead, notes: e.target.value })}
                placeholder="Additional notes..."
                className="w-full min-h-[80px] p-2 border rounded-md"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddLead} disabled={submitting}>
                {submitting ? "Adding..." : "Add Lead"}
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-6 gap-4">
        {stages.map((stage) => (
          <div key={stage} className="border rounded-lg p-3">
            <div className="flex items-center justify-between mb-3">
              <Heading level="h3" className="capitalize text-sm">
                {stage.replace("_", " ")}
              </Heading>
              <Badge color={stageColors[stage]}>{leadsByStage[stage]?.length || 0}</Badge>
            </div>
            <div className="space-y-2">
              {leadsByStage[stage]?.map((lead) => (
                <div key={lead.id} className="p-3 border rounded bg-white relative">
                  <button
                    onClick={() => handleDeleteLead(lead.id)}
                    className="absolute top-1 right-1 text-gray-400 hover:text-red-500"
                  >
                    <X />
                  </button>
                  <Text className="font-medium text-sm">{lead.contact_name}</Text>
                  <Text className="text-xs text-gray-500">{lead.company || lead.contact_email}</Text>
                  {lead.estimated_value && (
                    <Text className="text-sm font-medium text-green-600">
                      ${lead.estimated_value.toLocaleString()}
                    </Text>
                  )}
                  <div className="flex gap-1 mt-2">
                    <Badge color={sourceColors[lead.source]} size="small">
                      {lead.source}
                    </Badge>
                    <Badge color="grey" size="small">
                      {lead.probability}%
                    </Badge>
                  </div>
                  <Select
                    value={lead.stage}
                    onValueChange={(value) => handleUpdateStage(lead.id, value as Lead["stage"])}
                  >
                    <Select.Trigger className="mt-2 h-8 text-xs">
                      <Select.Value />
                    </Select.Trigger>
                    <Select.Content>
                      {stages.map((s) => (
                        <Select.Item key={s} value={s}>
                          {s.replace("_", " ")}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Container>
  )
}
