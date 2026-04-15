import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"
import { useEffect, useState } from "react"

type TimelineEvent = {
  id: string
  type: "activity" | "note" | "task" | "communication"
  activity_type?: string
  severity?: string
  data?: any
  note?: string
  created_by?: string
  title?: string
  status?: string
  priority?: string
  due_date?: string
  comm_type?: string
  direction?: string
  subject?: string
  message?: string
  created_at: string
}

const typeIcons: Record<string, string> = {
  order: "📦",
  note: "📝",
  task: "✅",
  login: "🔐",
  email: "📧",
  campaign: "📢",
  communication: "💬",
  automation: "⚙️",
  other: "📌",
}

const typeColors: Record<string, "blue" | "green" | "orange" | "purple" | "red" | "grey"> = {
  activity: "blue",
  note: "green",
  task: "orange",
  communication: "purple",
}

export const CustomerTimeline = ({ customerId, orderId }: { customerId?: string; orderId?: string }) => {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const limit = 25

  const fetchTimeline = async (newOffset = 0) => {
    try {
      const params = new URLSearchParams({ limit: String(limit), offset: String(newOffset) })
      if (customerId) params.set("customer_id", customerId)
      if (orderId) params.set("order_id", orderId)

      const response = await fetch(`/admin/crm/timeline?${params}`)
      const data = await response.json() as { timeline?: TimelineEvent[]; count?: number }
      setEvents(data.timeline || [])
      setCount(data.count || 0)
      setOffset(newOffset)
    } catch (error) {
      console.error("Failed to fetch timeline:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchTimeline() }, [customerId, orderId])

  if (loading) return <div>Loading...</div>

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Timeline</Heading>
        <Badge color="blue">{count} events</Badge>
      </div>

      {events.length === 0 ? (
        <Text>No timeline events</Text>
      ) : (
        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
          <div className="space-y-4">
            {events.map((event) => (
              <div key={event.id} className="flex gap-4 relative pl-10">
                <div className="absolute left-2 top-2 w-5 h-5 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center text-xs">
                  {event.type === "activity" && event.activity_type
                    ? typeIcons[event.activity_type] || typeIcons.other
                    : event.type === "note"
                    ? typeIcons.note
                    : event.type === "task"
                    ? typeIcons.task
                    : typeIcons.communication}
                </div>
                <div className="flex-1 p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge color={typeColors[event.type] || "grey"} size="small">
                      {event.type}
                    </Badge>
                    {event.activity_type && (
                      <Badge size="small" color="grey">{event.activity_type.replace("_", " ")}</Badge>
                    )}
                    {event.severity && event.severity !== "info" && (
                      <Badge size="small" color={event.severity === "error" ? "red" : event.severity === "warning" ? "orange" : "blue"}>
                        {event.severity}
                      </Badge>
                    )}
                    <Text className="text-xs text-gray-400 ml-auto">
                      {new Date(event.created_at).toLocaleString()}
                    </Text>
                  </div>

                  {event.type === "activity" && event.data && (
                    <Text className="text-sm">
                      {event.data.event_name
                        ? String(event.data.event_name).replace(/\./g, " → ")
                        : JSON.stringify(event.data).slice(0, 100)}
                    </Text>
                  )}
                  {event.type === "note" && (
                    <div>
                      <Text className="text-sm">{event.note}</Text>
                      {event.created_by && (
                        <Text className="text-xs text-gray-400 mt-1">By: {event.created_by}</Text>
                      )}
                    </div>
                  )}
                  {event.type === "task" && (
                    <div>
                      <Text className="text-sm font-medium">{event.title}</Text>
                      <div className="flex gap-1 mt-1">
                        {event.status && <Badge size="small" color="grey">{event.status.replace("_", " ")}</Badge>}
                        {event.priority && <Badge size="small" color="orange">{event.priority}</Badge>}
                        {event.due_date && (
                          <Text className="text-xs text-gray-400">Due: {new Date(event.due_date).toLocaleDateString()}</Text>
                        )}
                      </div>
                    </div>
                  )}
                  {event.type === "communication" && (
                    <div>
                      {event.subject && <Text className="text-sm font-medium">{event.subject}</Text>}
                      {event.message && <Text className="text-sm">{event.message.slice(0, 100)}</Text>}
                      <div className="flex gap-1 mt-1">
                        {event.comm_type && <Badge size="small" color="blue">{event.comm_type}</Badge>}
                        {event.direction && <Badge size="small" color="green">{event.direction}</Badge>}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {count > limit && (
        <div className="flex justify-between items-center mt-4">
          <Button variant="secondary" size="small" disabled={offset === 0} onClick={() => fetchTimeline(offset - limit)}>
            Previous
          </Button>
          <Text className="text-sm text-gray-500">{offset + 1}-{Math.min(offset + limit, count)} of {count}</Text>
          <Button variant="secondary" size="small" disabled={offset + limit >= count} onClick={() => fetchTimeline(offset + limit)}>
            Next
          </Button>
        </div>
      )}
    </Container>
  )
}
