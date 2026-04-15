import { Container, Heading, Text, Button, Badge } from "@medusajs/ui"
import { Check, Trash } from "@medusajs/icons"
import { useEffect, useState } from "react"

type Notification = {
  id: string
  type: string
  title: string
  message: string
  severity: "info" | "warning" | "error" | "success"
  is_read: boolean
  read_at: string | null
  reference_type: string | null
  reference_id: string | null
  created_at: string
}

const severityColors = {
  info: "blue",
  warning: "orange",
  error: "red",
  success: "green",
} as const

const typeLabels: Record<string, string> = {
  high_value_order: "High Value Order",
  new_lead: "New Lead",
  failed_campaign: "Failed Campaign",
  task_due: "Task Due",
  automation_error: "Automation Error",
  campaign_completed: "Campaign Completed",
  custom: "Custom",
}

export const NotificationsList = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState(0)
  const [offset, setOffset] = useState(0)
  const limit = 20

  const fetchNotifications = async (newOffset = 0) => {
    try {
      const response = await fetch(`/admin/crm/notifications?limit=${limit}&offset=${newOffset}`)
      const data = await response.json() as { notifications?: Notification[]; count?: number }
      setNotifications(data.notifications || [])
      setCount(data.count || 0)
      setOffset(newOffset)
    } catch (error) {
      console.error("Failed to fetch notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchNotifications() }, [])

  const handleMarkRead = async (ids: string[]) => {
    try {
      await fetch("/admin/crm/notifications/mark-read", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      })
      fetchNotifications(offset)
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const handleMarkAllRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id)
    if (unreadIds.length === 0) return
    await handleMarkRead(unreadIds)
  }

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/admin/crm/notifications/${id}`, { method: "DELETE" })
      fetchNotifications(offset)
    } catch (error) {
      console.error("Failed to delete notification:", error)
    }
  }

  if (loading) return <div>Loading...</div>

  const unreadCount = notifications.filter((n) => !n.is_read).length

  return (
    <Container>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Heading level="h2">Notifications</Heading>
          {unreadCount > 0 && (
            <Text className="text-sm text-gray-500">{unreadCount} unread</Text>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="small" onClick={handleMarkAllRead}>
            <Check /> Mark All Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Text>No notifications</Text>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-3 border rounded-lg flex items-start gap-3 ${!notification.is_read ? "bg-blue-50 border-blue-200" : ""}`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge color={severityColors[notification.severity]} size="small">
                    {typeLabels[notification.type] || notification.type}
                  </Badge>
                  {!notification.is_read && (
                    <Badge color="blue" size="small">New</Badge>
                  )}
                </div>
                <Text className="font-medium">{notification.title}</Text>
                <Text className="text-sm text-gray-600 mt-1">{notification.message}</Text>
                <Text className="text-xs text-gray-400 mt-1">
                  {new Date(notification.created_at).toLocaleString()}
                </Text>
              </div>
              <div className="flex gap-1">
                {!notification.is_read && (
                  <Button
                    variant="transparent"
                    size="small"
                    onClick={() => handleMarkRead([notification.id])}
                  >
                    <Check />
                  </Button>
                )}
                <Button
                  variant="transparent"
                  size="small"
                  onClick={() => handleDelete(notification.id)}
                >
                  <Trash />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {count > limit && (
        <div className="flex justify-between items-center mt-4">
          <Button
            variant="secondary"
            size="small"
            disabled={offset === 0}
            onClick={() => fetchNotifications(offset - limit)}
          >
            Previous
          </Button>
          <Text className="text-sm text-gray-500">
            {offset + 1}-{Math.min(offset + limit, count)} of {count}
          </Text>
          <Button
            variant="secondary"
            size="small"
            disabled={offset + limit >= count}
            onClick={() => fetchNotifications(offset + limit)}
          >
            Next
          </Button>
        </div>
      )}
    </Container>
  )
}
