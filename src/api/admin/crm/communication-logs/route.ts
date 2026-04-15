import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { customer_id, lead_id, type, direction, limit, offset } = req.validatedQuery || req.query

  const filters: Record<string, unknown> = {}
  if (customer_id) filters.customer_id = customer_id
  if (lead_id) filters.lead_id = lead_id
  if (type) filters.type = type
  if (direction) filters.direction = direction

  const take = Math.min(Number(limit) || 50, 100)
  const skip = Number(offset) || 0

  const [logs, count] = await crmService.listAndCountCommunicationLogs(filters, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  res.json({ communication_logs: logs, count, limit: take, offset: skip })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const logData = req.validatedBody || req.body

  const log = await crmService.createCommunicationLogs(logData)
  res.json({ communication_log: log })
}
