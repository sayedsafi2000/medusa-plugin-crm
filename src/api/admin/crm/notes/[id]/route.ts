import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve(CRM_MODULE)
  const { id } = req.params

  const note = await crmService.retrieveCustomerNote(id)

  res.json({ note })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve(CRM_MODULE)
  const { id } = req.params
  const updates = (req.validatedBody || req.body) as Record<string, unknown> | undefined

  const updateData: Record<string, unknown> = { id, ...(updates ?? {}) }
  const note = await crmService.updateCustomerNotes(updateData)

  res.json({ note })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve(CRM_MODULE)
  const { id } = req.params

  await crmService.deleteCustomerNotes(id)

  res.json({ id, deleted: true })
}
