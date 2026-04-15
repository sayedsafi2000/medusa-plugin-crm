import { Container, Heading, Text, Button, Badge, Input, Label, Select } from "@medusajs/ui"
import { Plus, X } from "@medusajs/icons"
import { useEffect, useState } from "react"

type CommunicationLog = {
  id: string
  customer_id: string
  lead_id: string | null
  type: "email" | "sms" | "whatsapp" | "call" | "other"
  direction: "inbound" | "outbound"
  subject: string | null
  message: string
  recipient: string
  sender: string
  status: "sent" | "delivered" | "failed" | "pending"
  sent_at: string | null
  created_by: string
  created_at: string
}

const typeColors = {
  email: "blue",
  sms: "green",
  whatsapp: "purple",
  call: "orange",
  other: "grey",
} as const

const directionColors = {
  inbound: "blue",
  outbound: "green",
} as const

const statusColors = {
  sent: "blue",
  delivered: "green",
  failed: "red",
  pending: "grey",
} as const

export const CommunicationLogs = ({ customerId }: { customerId?: string }) => {
  const [logs, setLogs] = useState<CommunicationLog[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [newLog, setNewLog] = useState({
    customer_id: customerId || "",
    lead_id: "",
    type: "email" as CommunicationLog["type"],
    direction: "outbound" as CommunicationLog["direction"],
    subject: "",
    message: "",
    recipient: "",
    sender: "Admin",
  })

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const url = customerId
          ? `/admin/crm/communication-logs?customer_id=${customerId}`
          : `/admin/crm/communication-logs`
        const response = await fetch(url)
        const data = await response.json() as { communication_logs?: CommunicationLog[] }
        setLogs(data.communication_logs || [])
      } catch (error) {
        console.error("Failed to fetch communication logs:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLogs()
  }, [customerId])

  const handleAddLog = async () => {
    if (!newLog.message.trim() || !newLog.recipient.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch("/admin/crm/communication-logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newLog,
          customer_id: newLog.customer_id || null,
          created_by: "Admin",
        }),
      })

      const data = await response.json() as { communication_log?: CommunicationLog }
      if (data.communication_log) {
        setLogs([data.communication_log, ...logs])
        setNewLog({
          customer_id: customerId || "",
          lead_id: "",
          type: "email",
          direction: "outbound",
          subject: "",
          message: "",
          recipient: "",
          sender: "Admin",
        })
        setShowForm(false)
      }
    } catch (error) {
      console.error("Failed to add communication log:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteLog = async (logId: string) => {
    try {
      await fetch(`/admin/crm/communication-logs/${logId}`, {
        method: "DELETE",
      })
      setLogs(logs.filter((log) => log.id !== logId))
    } catch (error) {
      console.error("Failed to delete communication log:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Communication Logs</Heading>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus /> {showForm ? "Cancel" : "Log Communication"}
        </Button>
      </div>

      {showForm && (
        <div className="mb-4 p-4 border rounded-lg bg-gray-50">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Customer ID</Label>
                <Input
                  value={newLog.customer_id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLog({ ...newLog, customer_id: e.target.value })}
                  placeholder="Customer ID (optional)"
                  disabled={!!customerId}
                />
              </div>
              <div>
                <Label>Lead ID</Label>
                <Input
                  value={newLog.lead_id}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLog({ ...newLog, lead_id: e.target.value })}
                  placeholder="Lead ID (optional)"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Type</Label>
                <Select
                  value={newLog.type}
                  onValueChange={(value) => setNewLog({ ...newLog, type: value as CommunicationLog["type"] })}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="email">Email</Select.Item>
                    <Select.Item value="sms">SMS</Select.Item>
                    <Select.Item value="whatsapp">WhatsApp</Select.Item>
                    <Select.Item value="call">Call</Select.Item>
                    <Select.Item value="other">Other</Select.Item>
                  </Select.Content>
                </Select>
              </div>
              <div>
                <Label>Direction</Label>
                <Select
                  value={newLog.direction}
                  onValueChange={(value) => setNewLog({ ...newLog, direction: value as CommunicationLog["direction"] })}
                >
                  <Select.Trigger>
                    <Select.Value />
                  </Select.Trigger>
                  <Select.Content>
                    <Select.Item value="inbound">Inbound</Select.Item>
                    <Select.Item value="outbound">Outbound</Select.Item>
                  </Select.Content>
                </Select>
              </div>
            </div>
            <div>
              <Label>Subject</Label>
              <Input
                value={newLog.subject}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLog({ ...newLog, subject: e.target.value })}
                placeholder="Subject (optional)"
              />
            </div>
            <div>
              <Label>Message *</Label>
              <textarea
                value={newLog.message}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setNewLog({ ...newLog, message: e.target.value })}
                placeholder="Message content..."
                className="w-full min-h-[100px] p-2 border rounded-md"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Recipient *</Label>
                <Input
                  value={newLog.recipient}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLog({ ...newLog, recipient: e.target.value })}
                  placeholder="recipient@example.com"
                />
              </div>
              <div>
                <Label>Sender</Label>
                <Input
                  value={newLog.sender}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewLog({ ...newLog, sender: e.target.value })}
                  placeholder="Sender name"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddLog} disabled={submitting}>
                {submitting ? "Saving..." : "Log Communication"}
              </Button>
              <Button variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}

      {logs.length === 0 ? (
        <Text>No communication logs found</Text>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="p-4 border rounded-lg relative">
              <button
                onClick={() => handleDeleteLog(log.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
              >
                <X />
              </button>
              <div className="flex items-center gap-2 mb-2">
                <Badge color={typeColors[log.type]}>{log.type}</Badge>
                <Badge color={directionColors[log.direction]}>{log.direction}</Badge>
                <Badge color={statusColors[log.status]}>{log.status}</Badge>
              </div>
              {log.subject && (
                <Text className="font-medium">{log.subject}</Text>
              )}
              <Text className="mt-1">{log.message}</Text>
              <div className="flex justify-between mt-2">
                <Text className="text-sm text-gray-500">
                  {log.direction === "outbound" ? `To: ${log.recipient}` : `From: ${log.sender}`}
                </Text>
                <Text className="text-sm text-gray-500">
                  {new Date(log.created_at).toLocaleString()}
                </Text>
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
