import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { status, type, limit, offset } = req.validatedQuery || req.query

  const filters: Record<string, unknown> = {}
  if (status) filters.status = status
  if (type) filters.type = type

  const take = Math.min(Number(limit) || 50, 100)
  const skip = Number(offset) || 0

  const [campaigns, count] = await crmService.listAndCountCrmCampaigns(filters, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  res.json({ campaigns, count, limit: take, offset: skip })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const campaignData = req.validatedBody || req.body

  const campaign = await crmService.createCrmCampaigns(campaignData)
  res.json({ campaign })
}
