"use client"

import { useState, useEffect } from "react"
import { Button } from "@medusajs/ui"

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
    <div className="p-8 bg-white rounded-lg shadow">
      <h1 className="text-3xl font-bold mb-8">CRM Dashboard</h1>

      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard label="Total Customers" value={stats.totalCustomers} />
            <StatCard label="Total Leads" value={stats.totalLeads} />
            <StatCard label="Tasks" value={stats.totalTasks} />
            <StatCard label="Active Campaigns" value={stats.activeCampaigns} />
          </div>

          <div className="flex gap-4">
            <Button asChild>
              <a href="/admin/crm/customers">Manage Customers</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/admin/crm/leads">Manage Leads</a>
            </Button>
            <Button asChild variant="secondary">
              <a href="/admin/crm/campaigns">Create Campaign</a>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-200">
      <h3 className="text-sm font-medium text-gray-600">{label}</h3>
      <p className="text-2xl font-bold text-indigo-600 mt-2">{value}</p>
    </div>
  )
}
