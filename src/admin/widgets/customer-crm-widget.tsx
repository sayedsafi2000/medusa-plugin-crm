import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Container, Heading, Text, Badge, Button } from "@medusajs/ui"
import { Plus } from "@medusajs/icons"
import { useEffect, useState } from "react"
import { DetailWidgetProps } from "@medusajs/framework/types"

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

const statusColors: Record<string, "grey" | "blue" | "green" | "red" | "orange" | "purple"> = {
  pending: "grey",
  in_progress: "blue",
  completed: "green",
  cancelled: "red",
}

const priorityColors: Record<string, "grey" | "blue" | "green" | "red" | "orange" | "purple"> = {
  low: "grey",
  medium: "orange",
  high: "red",
}

const CustomerCrmWidget = ({
  data,
}: DetailWidgetProps<{ id: string }>) => {
  const customerId = data?.id
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [newNote, setNewNote] = useState("")
  const [showNoteInput, setShowNoteInput] = useState(false)
  const [notes, setNotes] = useState([])
  const [tasks, setTasks] = useState([])
  const [activities, setActivities] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      if (!customerId) return
      try {
        const profileRes = await fetch(`/admin/crm/customers/${customerId}`)
        const profile = await profileRes.json() as any
        setNotes(profile.notes?.slice(0, 3) || [])
        setTasks(profile.tasks?.filter((t: any) => t.status === "pending" || t.status === "in_progress").slice(0, 3) || [])
        setActivities(profile.activities?.slice(0, 5) || [])
        setMetrics(profile.customer?.crm_metrics || null)
        setOrders(profile.orders?.slice(0, 5) || [])
      } catch (error) {
        console.error("Failed to fetch CRM data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [customerId])

  const handleAddNote = async () => {
    if (!newNote.trim() || !customerId) return

    try {
      const response = await fetch("/admin/crm/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          note: newNote,
          created_by: "Admin",
        }),
      })

      const data = await response.json() as { note?: any }
      if (data.note) {
        setEvents([
          {
            id: data.note.id,
            type: "note",
            note: data.note.note,
            created_by: data.note.created_by,
            created_at: data.note.created_at || new Date().toISOString(),
          },
          ...events,
        ])
        setNewNote("")
        setShowNoteInput(false)
      }
    } catch (error) {
      console.error("Failed to add note:", error)
    }
  }

  if (loading) return <div>Loading CRM data...</div>

  const pendingTasks = events.filter((e) => e.type === "task" && e.status !== "completed" && e.status !== "cancelled")
  const noteCount = events.filter((e) => e.type === "note").length
  const activityCount = events.filter((e) => e.type === "activity").length

  return (
    <Container>
      <Heading level="h3" className="mb-4">CRM Overview</Heading>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="p-3 border rounded-lg text-center">
          <Text className="text-sm text-gray-500">Notes</Text>
          <Text className="text-xl font-bold">{noteCount}</Text>
        </div>
        <div className="p-3 border rounded-lg text-center">
          <Text className="text-sm text-gray-500">Open Tasks</Text>
          <Text className="text-xl font-bold">{pendingTasks.length}</Text>
        </div>
        <div className="p-3 border rounded-lg text-center">
          <Text className="text-sm text-gray-500">Activities</Text>
          <Text className="text-xl font-bold">{activityCount}</Text>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <Text className="font-medium">Quick Note</Text>
          <Button variant="transparent" size="small" onClick={() => setShowNoteInput(!showNoteInput)}>
            <Plus /> Add
          </Button>
        </div>
        {showNoteInput && (
          <div className="mb-2 flex gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewNote(e.target.value)}
              placeholder="Add a quick note..."
              className="flex-1 border rounded-md px-3 py-1 text-sm"
            />
            <Button size="small" onClick={handleAddNote}>Save</Button>
          </div>
        )}
      </div>

      <div className="mb-4">
        <Text className="font-medium mb-2">Pending Tasks</Text>
        {pendingTasks.length === 0 ? (
          <Text className="text-sm text-gray-400">No pending tasks</Text>
        ) : (
          <div className="space-y-2">
            {pendingTasks.slice(0, 5).map((task) => (
              <div key={task.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                <Badge color={statusColors[task.status || ""] || "grey"} size="small">
                  {(task.status || "").replace("_", " ")}
                </Badge>
                <Badge color={priorityColors[task.priority || ""] || "grey"} size="small">
                  {task.priority}
                </Badge>
                <Text className="text-sm flex-1">{task.title}</Text>
                {task.due_date && (
                  <Text className="text-xs text-gray-400">
                    Due: {new Date(task.due_date).toLocaleDateString()}
                  </Text>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <Text className="font-medium mb-2">Recent Timeline</Text>
        {events.length === 0 ? (
          <Text className="text-sm text-gray-400">No activity recorded</Text>
        ) : (
          <div className="space-y-1">
            {events.slice(0, 8).map((event) => (
              <div key={event.id} className="flex justify-between text-sm p-1">
                <div className="flex items-center gap-2">
                  <Badge size="small" color="grey">{event.type}</Badge>
                  <Text>
                    {event.type === "note" ? event.note?.slice(0, 40) :
                     event.type === "task" ? event.title :
                     event.type === "communication" ? event.subject || event.message?.slice(0, 40) :
                     event.activity_type?.replace("_", " ")}
                  </Text>
                </div>
                <Text className="text-gray-400">{new Date(event.created_at).toLocaleDateString()}</Text>
              </div>
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "customer.details.after",
})

export default CustomerCrmWidget
