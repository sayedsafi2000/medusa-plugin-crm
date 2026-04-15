import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { stage, assigned_to, source, limit, offset } = req.validatedQuery || req.query

  const filters: Record<string, unknown> = {}
  if (stage) filters.stage = stage
  if (assigned_to) filters.assigned_to = assigned_to
  if (source) filters.source = source

  const take = Math.min(Number(limit) || 50, 100)
  const skip = Number(offset) || 0

  const [leads, count] = await crmService.listAndCountLeads(filters, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  res.json({ leads, count, limit: take, offset: skip })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const leadData = req.validatedBody || req.body
  const lead = await crmService.createLeads(leadData)
  res.json({ lead })
}
