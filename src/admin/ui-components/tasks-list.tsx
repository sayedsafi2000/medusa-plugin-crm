import { Container, Heading, Text, Button, Badge } from "@medusajs/ui"
import { Plus } from "@medusajs/icons"
import { useEffect, useState } from "react"

type Task = {
  id: string
  customer_id: string
  title: string
  description?: string
  status: "pending" | "in_progress" | "completed" | "cancelled"
  priority: "low" | "medium" | "high"
  due_date?: string
  assigned_to?: string
  created_by: string
  created_at: string
}

const statusColors = {
  pending: "gray",
  in_progress: "blue",
  completed: "green",
  cancelled: "red",
} as const

const priorityColors = {
  low: "gray",
  medium: "yellow",
  high: "red",
} as const

export const TasksList = ({ customerId }: { customerId?: string }) => {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const url = customerId
          ? `/admin/crm/tasks?customer_id=${customerId}`
          : `/admin/crm/tasks`
        const response = await fetch(url)
        const data = await response.json()
        setTasks(data.tasks || [])
      } catch (error) {
        console.error("Failed to fetch tasks:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [customerId])

  if (loading) return <div>Loading...</div>

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <Heading level="h2">Customer Tasks</Heading>
        <Button>
          <Plus /> Add Task
        </Button>
      </div>
      {tasks.length === 0 ? (
        <Text>No tasks found</Text>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div key={task.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <Heading level="h3">{task.title}</Heading>
                  {task.description && (
                    <Text className="mt-2">{task.description}</Text>
                  )}
                </div>
                <div className="flex gap-2">
                  <Badge color={statusColors[task.status]}>
                    {task.status.replace("_", " ")}
                  </Badge>
                  <Badge color={priorityColors[task.priority]}>
                    {task.priority}
                  </Badge>
                </div>
              </div>
              {task.due_date && (
                <Text className="text-sm text-gray-500 mt-2">
                  Due: {new Date(task.due_date).toLocaleString()}
                </Text>
              )}
              {task.assigned_to && (
                <Text className="text-sm text-gray-500">
                  Assigned to: {task.assigned_to}
                </Text>
              )}
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
