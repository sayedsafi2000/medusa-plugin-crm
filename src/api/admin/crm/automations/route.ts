import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { status, type, is_active, limit, offset } = req.validatedQuery || req.query

  const filters: Record<string, unknown> = {}
  if (status) filters.status = status
  if (type) filters.type = type
  if (is_active !== undefined) filters.is_active = is_active === "true"

  const take = Math.min(Number(limit) || 50, 100)
  const skip = Number(offset) || 0

  const [automations, count] = await crmService.listAndCountAutomations(filters, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  res.json({ automations, count, limit: take, offset: skip })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const automationData = req.validatedBody || req.body

  const automation = await crmService.createAutomations(automationData)
  res.json({ automation })
}
