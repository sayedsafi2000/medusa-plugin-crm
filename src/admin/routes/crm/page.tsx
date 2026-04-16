import { useState, useEffect } from "react"
import { Button, Container, Heading, Text, Stack, Grid } from "@medusajs/ui"

export default function CRMDashboard() {
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalLeads: 0,
    totalTasks: 0,
    activeCampaigns: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [customersRes, leadsRes, tasksRes, campaignsRes] = await Promise.all([
          fetch("/admin/crm/customers?limit=1"),
          fetch("/admin/crm/leads?limit=1"),
          fetch("/admin/crm/tasks?limit=1"),
          fetch("/admin/crm/campaigns?limit=1"),
        ])

        if (customersRes.ok && leadsRes.ok && tasksRes.ok && campaignsRes.ok) {
          const customers = await customersRes.json()
          const leads = await leadsRes.json()
          const tasks = await tasksRes.json()
          const campaigns = await campaignsRes.json()

          setStats({
            totalCustomers: customers.count || 0,
            totalLeads: leads.count || 0,
            totalTasks: tasks.count || 0,
            activeCampaigns: campaigns.count || 0,
          })
        }
      } catch (error) {
        console.error("Failed to fetch CRM stats:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  return (
    <Container>
      <Stack gap="x6">
        <Heading level="h1">CRM Dashboard</Heading>

        {loading ? (
          <div className="text-center py-12">Loading...</div>
        ) : (
          <>
            <Grid columns={{ xs: 1, sm: 2, lg: 4 }} gap="x6">
              <StatCard label="Total Customers" value={stats.totalCustomers} />
              <StatCard label="Total Leads" value={stats.totalLeads} />
              <StatCard label="Tasks" value={stats.totalTasks} />
              <StatCard label="Active Campaigns" value={stats.activeCampaigns} />
            </Grid>

            <Stack direction="row" gap="x3">
              <Button asChild>
                <a href="/admin/crm/customers">Manage Customers</a>
              </Button>
              <Button asChild variant="secondary">
                <a href="/admin/crm/leads">Manage Leads</a>
              </Button>
              <Button asChild variant="secondary">
                <a href="/admin/crm/campaigns">Create Campaign</a>
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </Container>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-6 rounded-lg border border-ui-border-strong bg-ui-bg-base shadow-sm">
      <Text size="small" className="text-ui-fg-muted">{label}</Text>
      <Text size="xl" className="font-bold mt-2">{value}</Text>
    </div>
  )
}
