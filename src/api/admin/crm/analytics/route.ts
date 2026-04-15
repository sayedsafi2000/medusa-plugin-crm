import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { CRM_MODULE } from "../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const customerModule = req.scope.resolve(Modules.CUSTOMER) as any
  const orderModule = req.scope.resolve(Modules.ORDER) as any

  try {
    // CRM data
    const leads = await crmService.listLeads({})
    const totalLeads = leads.length
    const wonLeads = leads.filter((l: any) => l.stage === "won").length
    const totalPipelineValue = leads.reduce((sum: number, l: any) => sum + (l.estimated_value || 0), 0)
    const wonValue = leads.filter((l: any) => l.stage === "won").reduce((sum: number, l: any) => sum + (l.estimated_value || 0), 0)

    const tasks = await crmService.listCustomerTasks({})
    const completedTasks = tasks.filter((t: any) => t.status === "completed").length
    const pendingTasks = tasks.filter((t: any) => t.status === "pending").length

    const activities = await crmService.listCustomerActivities({})
    const activitiesByType = activities.reduce((acc: Record<string, number>, a: any) => {
      acc[a.activity_type] = (acc[a.activity_type] || 0) + 1
      return acc
    }, {})

    const campaigns = await crmService.listCrmCampaigns({ status: "completed" })
    const totalSent = campaigns.reduce((sum: number, c: any) => sum + (c.sent_count || 0), 0)
    const totalOpened = campaigns.reduce((sum: number, c: any) => sum + (c.opened_count || 0), 0)
    const totalConverted = campaigns.reduce((sum: number, c: any) => sum + (c.converted_count || 0), 0)

    // Medusa customer/order data
    let totalCustomers = 0
    let totalRevenue = 0
    let totalOrders = 0
    let activeCustomers = 0

    try {
      const customers = await customerModule.listCustomers({}, { take: 10000 })
      totalCustomers = customers.length

      const orders = await orderModule.listOrders({}, { take: 10000 })
      totalOrders = orders.length
      totalRevenue = orders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0)

      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      activeCustomers = customers.filter((c: any) => new Date(c.created_at) > thirtyDaysAgo).length
    } catch {
      // Medusa modules might not be available
    }

    const analytics = {
      leads: {
        total: totalLeads,
        won: wonLeads,
        conversionRate: totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(2) : 0,
        totalPipelineValue,
        wonValue,
        byStage: leads.reduce((acc: Record<string, number>, l: any) => {
          acc[l.stage] = (acc[l.stage] || 0) + 1
          return acc
        }, {}),
      },
      tasks: {
        total: tasks.length,
        completed: completedTasks,
        pending: pendingTasks,
        completionRate: tasks.length > 0 ? ((completedTasks / tasks.length) * 100).toFixed(2) : 0,
      },
      activities: {
        total: activities.length,
        byType: activitiesByType,
      },
      campaigns: {
        total: campaigns.length,
        totalSent,
        totalOpened,
        totalConverted,
        openRate: totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(2) : 0,
        conversionRate: totalSent > 0 ? ((totalConverted / totalSent) * 100).toFixed(2) : 0,
      },
      customers: {
        total: totalCustomers,
        active: activeCustomers,
        orders: totalOrders,
        revenue: totalRevenue,
        avgOrderValue: totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0,
      },
    }

    res.json({ analytics })
  } catch (error) {
    console.error("Failed to fetch analytics:", error)
    res.status(500).json({ error: "Failed to fetch analytics" })
  }
}
