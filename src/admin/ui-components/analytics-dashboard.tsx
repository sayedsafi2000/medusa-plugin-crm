import { Container, Heading, Text, Badge } from "@medusajs/ui"
import { useEffect, useState } from "react"

type Analytics = {
  leads: {
    total: number
    won: number
    conversionRate: string
    totalPipelineValue: number
    wonValue: number
    byStage: Record<string, number>
  }
  tasks: {
    total: number
    completed: number
    pending: number
    completionRate: string
  }
  activities: {
    total: number
    byType: Record<string, number>
  }
  campaigns: {
    total: number
    totalSent: number
    totalOpened: number
    totalConverted: number
    openRate: string
    conversionRate: string
  }
}

export const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch("/admin/crm/analytics")
        const data = await response.json() as { analytics?: Analytics }
        setAnalytics(data.analytics || null)
      } catch (error) {
        console.error("Failed to fetch analytics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) return <div>Loading...</div>

  if (!analytics) return <Text>No analytics data available</Text>

  return (
    <Container>
      <Heading level="h2" className="mb-6">CRM Analytics Dashboard</Heading>

      {/* Leads Overview */}
      <div className="mb-8">
        <Heading level="h3" className="mb-4">Sales Pipeline</Heading>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <Text className="text-sm text-gray-500">Total Leads</Text>
            <Text className="text-2xl font-bold">{analytics.leads.total}</Text>
          </div>
          <div className="p-4 border rounded-lg">
            <Text className="text-sm text-gray-500">Won Leads</Text>
            <Text className="text-2xl font-bold text-green-600">{analytics.leads.won}</Text>
          </div>
          <div className="p-4 border rounded-lg">
            <Text className="text-sm text-gray-500">Conversion Rate</Text>
            <Text className="text-2xl font-bold">{analytics.leads.conversionRate}%</Text>
          </div>
          <div className="p-4 border rounded-lg">
            <Text className="text-sm text-gray-500">Pipeline Value</Text>
            <Text className="text-2xl font-bold">${analytics.leads.totalPipelineValue.toLocaleString()}</Text>
          </div>
        </div>
        <div className="mt-4 p-4 border rounded-lg">
          <Text className="font-medium mb-2">Leads by Stage</Text>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(analytics.leads.byStage).map(([stage, count]) => (
              <Badge key={stage} color="grey">
                {stage}: {count}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks Overview */}
      <div className="mb-8">
        <Heading level="h3" className="mb-4">Tasks</Heading>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <Text className="text-sm text-gray-500">Total Tasks</Text>
            <Text className="text-2xl font-bold">{analytics.tasks.total}</Text>
          </div>
          <div className="p-4 border rounded-lg">
            <Text className="text-sm text-gray-500">Completed</Text>
            <Text className="text-2xl font-bold text-green-600">{analytics.tasks.completed}</Text>
          </div>
          <div className="p-4 border rounded-lg">
            <Text className="text-sm text-gray-500">Completion Rate</Text>
            <Text className="text-2xl font-bold">{analytics.tasks.completionRate}%</Text>
          </div>
        </div>
      </div>

      {/* Activities Overview */}
      <div className="mb-8">
        <Heading level="h3" className="mb-4">Activities</Heading>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <Text className="text-sm text-gray-500">Total Activities</Text>
            <Text className="text-2xl font-bold">{analytics.activities.total}</Text>
          </div>
          <div className="p-4 border rounded-lg">
            <Text className="font-medium mb-2">By Type</Text>
            <div className="flex gap-2 flex-wrap">
              {Object.entries(analytics.activities.byType).map(([type, count]) => (
                <Badge key={type} color="blue">
                  {type}: {count}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Campaigns Overview */}
      <div>
        <Heading level="h3" className="mb-4">Campaigns</Heading>
        <div className="grid grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <Text className="text-sm text-gray-500">Total Campaigns</Text>
            <Text className="text-2xl font-bold">{analytics.campaigns.total}</Text>
          </div>
          <div className="p-4 border rounded-lg">
            <Text className="text-sm text-gray-500">Messages Sent</Text>
            <Text className="text-2xl font-bold">{analytics.campaigns.totalSent}</Text>
          </div>
          <div className="p-4 border rounded-lg">
            <Text className="text-sm text-gray-500">Open Rate</Text>
            <Text className="text-2xl font-bold">{analytics.campaigns.openRate}%</Text>
          </div>
          <div className="p-4 border rounded-lg">
            <Text className="text-sm text-gray-500">Conversion Rate</Text>
            <Text className="text-2xl font-bold">{analytics.campaigns.conversionRate}%</Text>
          </div>
        </div>
      </div>
    </Container>
  )
}
