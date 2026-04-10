import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve("crmModuleService")
  const { customer_id } = req.validatedQuery || req.query

  const filters: any = {}
  if (customer_id) filters.customer_id = customer_id
  const notes = await crmService.listCustomerNotes(filters)

  res.json({ notes })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve("crmModuleService")
  const noteData = req.validatedBody || req.body

  const note = await crmService.createCustomerNotes(noteData as any)

  res.json({ note })
}
