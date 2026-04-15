import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { limit, offset } = req.validatedQuery || req.query

  const take = Math.min(Number(limit) || 50, 100)
  const skip = Number(offset) || 0

  const [tags, count] = await crmService.listAndCountCustomerTags({}, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  res.json({ tags, count, limit: take, offset: skip })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const tagData = req.validatedBody || req.body
  const tag = await crmService.createCustomerTags(tagData)
  res.json({ tag })
}
