import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { CRM_MODULE } from "../../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { id } = req.params
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const customerModule = req.scope.resolve(Modules.CUSTOMER) as any
  const orderModule = req.scope.resolve(Modules.ORDER) as any

  try {
    let customer: any = null
    try {
      customer = await customerModule.retrieveCustomer(id, {
        select: ["id", "email", "first_name", "last_name", "phone", "created_at", "updated_at"],
      })
    } catch {
      res.status(404).json({ error: "Customer not found" })
      return
    }

    let orders: any[] = []
    let totalSpent = 0
    let orderCount = 0
    let lastOrderDate: string | null = null

    try {
      orders = await orderModule.listOrders(
        { customer_id: id },
        {
          select: ["id", "total", "status", "created_at"],
          order: { created_at: "DESC" },
        }
      )
      orderCount = orders.length
      totalSpent = orders.reduce((sum: number, o: any) => sum + (Number(o.total) || 0), 0)
      if (orders.length > 0) {
        lastOrderDate = orders[0].created_at
      }
    } catch {
      // Customer may have no orders
    }

    const [notes, noteCount] = await crmService.listAndCountCustomerNotes(
      { customer_id: id },
      { take: 10, order: { created_at: "DESC" } }
    )

    const [tasks, taskCount] = await crmService.listAndCountCustomerTasks(
      { customer_id: id },
      { take: 10, order: { created_at: "DESC" } }
    )

    const [activities, activityCount] = await crmService.listAndCountCustomerActivities(
      { customer_id: id },
      { take: 10, order: { created_at: "DESC" } }
    )

    const tagAssignments = await crmService.listCustomerTagAssignments({ customer_id: id })
    const tagIds = tagAssignments.map((a: any) => a.tag_id)
    const tags = tagIds.length > 0
      ? await crmService.listCustomerTags({ id: tagIds })
      : []

    const segmentAssignments = await crmService.listCustomerSegmentAssignments({ customer_id: id })
    const segmentIds = segmentAssignments.map((a: any) => a.segment_id)
    const segments = segmentIds.length > 0
      ? await crmService.listCustomerSegments({ id: segmentIds })
      : []

    const [communications, commCount] = await crmService.listAndCountCommunicationLogs(
      { customer_id: id },
      { take: 10, order: { created_at: "DESC" } }
    )

    const pendingTasks = tasks.filter((t: any) => t.status === "pending" || t.status === "in_progress")

    res.json({
      customer: {
        ...customer,
        crm_metrics: {
          total_spent: totalSpent,
          order_count: orderCount,
          last_order_date: lastOrderDate,
          note_count: noteCount,
          task_count: taskCount,
          pending_task_count: pendingTasks.length,
          activity_count: activityCount,
          communication_count: commCount,
        },
        crm_tags: tags,
        crm_segments: segments,
      },
      orders: orders.slice(0, 20),
      notes,
      tasks,
      activities,
      communications,
    })
  } catch (error) {
    console.error("Failed to fetch customer CRM profile:", error)
    res.status(500).json({ error: "Failed to fetch customer CRM profile" })
  }
}
