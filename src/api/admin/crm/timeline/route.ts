import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { customer_id, order_id, limit, offset } = req.validatedQuery || req.query

  if (!customer_id && !order_id) {
    res.status(400).json({ error: "customer_id or order_id is required" })
    return
  }

  const take = Math.min(Number(limit) || 50, 100)
  const skip = Number(offset) || 0

  const filters: Record<string, unknown> = {}
  if (customer_id) filters.customer_id = customer_id
  if (order_id) filters.order_id = order_id

  const [activities, actCount] = await crmService.listAndCountCustomerActivities(filters, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  const noteFilters: Record<string, unknown> = {}
  if (customer_id) noteFilters.customer_id = customer_id
  if (order_id) noteFilters.order_id = order_id

  const [notes, noteCount] = await crmService.listAndCountCustomerNotes(noteFilters, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  const taskFilters: Record<string, unknown> = {}
  if (customer_id) taskFilters.customer_id = customer_id
  if (order_id) taskFilters.order_id = order_id

  const [tasks, taskCount] = await crmService.listAndCountCustomerTasks(taskFilters, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  const commFilters: Record<string, unknown> = {}
  if (customer_id) commFilters.customer_id = customer_id

  const communications = customer_id
    ? await crmService.listCommunicationLogs(commFilters, {
        take: take,
        order: { created_at: "DESC" },
      })
    : []

  const timeline = [
    ...activities.map((a: any) => ({
      id: a.id,
      type: "activity",
      activity_type: a.activity_type,
      severity: a.severity,
      data: a.activity_data,
      created_at: a.created_at,
    })),
    ...notes.map((n: any) => ({
      id: n.id,
      type: "note",
      note: n.note,
      created_by: n.created_by,
      created_at: n.created_at,
    })),
    ...tasks.map((t: any) => ({
      id: t.id,
      type: "task",
      title: t.title,
      status: t.status,
      priority: t.priority,
      due_date: t.due_date,
      created_at: t.created_at,
    })),
    ...communications.map((c: any) => ({
      id: c.id,
      type: "communication",
      comm_type: c.type,
      direction: c.direction,
      subject: c.subject,
      message: c.message,
      created_at: c.created_at,
    })),
  ].sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  res.json({
    timeline: timeline.slice(0, take),
    count: actCount + noteCount + taskCount + communications.length,
    limit: take,
    offset: skip,
  })
}
