import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { recipient_id, type, is_read, severity, limit, offset } = req.validatedQuery || req.query

  const filters: Record<string, unknown> = {}
  if (recipient_id) filters.recipient_id = recipient_id
  if (type) filters.type = type
  if (is_read !== undefined) filters.is_read = is_read === "true"
  if (severity) filters.severity = severity

  const take = Math.min(Number(limit) || 50, 100)
  const skip = Number(offset) || 0

  const [notifications, count] = await crmService.listAndCountNotifications(filters, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  res.json({ notifications, count, limit: take, offset: skip })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const data = req.validatedBody || req.body
  const notification = await crmService.createNotifications(data)
  res.json({ notification })
}
