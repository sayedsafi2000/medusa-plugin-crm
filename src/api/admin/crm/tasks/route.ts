import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve(CRM_MODULE)
  const { customer_id, order_id, status, priority, assigned_to, limit, offset } = req.validatedQuery || req.query

  const filters: Record<string, unknown> = {}
  if (customer_id) filters.customer_id = customer_id
  if (order_id) filters.order_id = order_id
  if (status) filters.status = status
  if (priority) filters.priority = priority
  if (assigned_to) filters.assigned_to = assigned_to

  const take = Math.min(Number(limit) || 50, 100)
  const skip = Number(offset) || 0

  const [tasks, count] = await crmService.listAndCountCustomerTasks(filters, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  res.json({ tasks, count, limit: take, offset: skip })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve(CRM_MODULE)
  const taskData = req.validatedBody || req.body

  const task = await crmService.createCustomerTasks(taskData)

  res.json({ task })
}
