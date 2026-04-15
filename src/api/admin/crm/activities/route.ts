import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve(CRM_MODULE)
  const { customer_id, order_id, activity_type, severity, limit, offset } = req.validatedQuery || req.query

  const filters: Record<string, unknown> = {}
  if (customer_id) filters.customer_id = customer_id
  if (order_id) filters.order_id = order_id
  if (activity_type) filters.activity_type = activity_type
  if (severity) filters.severity = severity

  const take = Math.min(Number(limit) || 50, 100)
  const skip = Number(offset) || 0

  const [activities, count] = await crmService.listAndCountCustomerActivities(filters, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  res.json({ activities, count, limit: take, offset: skip })
}
