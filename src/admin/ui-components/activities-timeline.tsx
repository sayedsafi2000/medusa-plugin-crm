import { Container, Heading, Text } from "@medusajs/ui"
import { useEffect, useState } from "react"

type Activity = {
  id: string
  customer_id: string
  activity_type: "order" | "note" | "task" | "login" | "email" | "other"
  activity_data: Record<string, any>
  created_at: string
}

const activityIcons = {
  order: "📦",
  note: "📝",
  task: "✅",
  login: "🔐",
  email: "📧",
  other: "📌",
}

export const ActivitiesTimeline = ({ customerId }: { customerId?: string }) => {
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const url = customerId
          ? `/admin/crm/activities?customer_id=${customerId}`
          : `/admin/crm/activities`
        const response = await fetch(url)
        const data = await response.json()
        setActivities(data.activities || [])
      } catch (error) {
        console.error("Failed to fetch activities:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchActivities()
  }, [customerId])

  if (loading) return <div>Loading...</div>

  return (
    <Container>
      <Heading level="h2" className="mb-4">
        Activity Timeline
      </Heading>
      {activities.length === 0 ? (
        <Text>No activities found</Text>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex gap-4">
              <div className="text-2xl">
                {activityIcons[activity.activity_type] || activityIcons.other}
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <Text className="font-medium capitalize">
                    {activity.activity_type.replace("_", " ")}
                  </Text>
                  <Text className="text-sm text-gray-500">
                    {new Date(activity.created_at).toLocaleString()}
                  </Text>
                </div>
                {activity.activity_data && (
                  <Text className="text-sm text-gray-600 mt-1">
                    {JSON.stringify(activity.activity_data)}
                  </Text>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Container>
  )
}
