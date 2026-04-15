import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { is_dynamic, limit, offset } = req.validatedQuery || req.query

  const filters: Record<string, unknown> = {}
  if (is_dynamic !== undefined) filters.is_dynamic = is_dynamic === "true"

  const take = Math.min(Number(limit) || 50, 100)
  const skip = Number(offset) || 0

  const [segments, count] = await crmService.listAndCountCustomerSegments(filters, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  res.json({ segments, count, limit: take, offset: skip })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const segmentData = req.validatedBody || req.body
  const segment = await crmService.createCustomerSegments(segmentData)
  res.json({ segment })
}
