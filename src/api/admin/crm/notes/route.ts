import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve(CRM_MODULE)
  const { customer_id, order_id, limit, offset } = req.validatedQuery || req.query

  const filters: Record<string, unknown> = {}
  if (customer_id) filters.customer_id = customer_id
  if (order_id) filters.order_id = order_id

  const take = Math.min(Number(limit) || 50, 100)
  const skip = Number(offset) || 0

  const [notes, count] = await crmService.listAndCountCustomerNotes(filters, {
    take,
    skip,
    order: { created_at: "DESC" },
  })

  res.json({ notes, count, limit: take, offset: skip })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve(CRM_MODULE)
  const noteData = req.validatedBody || req.body

  const note = await crmService.createCustomerNotes(noteData)

  res.json({ note })
}
