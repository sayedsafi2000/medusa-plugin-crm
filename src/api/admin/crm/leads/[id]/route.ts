import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { id } = req.params

  const lead = await crmService.retrieveLead(id)
  res.json({ lead })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { id } = req.params
  const updates = (req.validatedBody || req.body) as Record<string, unknown> | undefined

  const updateData: Record<string, unknown> = { id, ...(updates ?? {}) }
  const lead = await crmService.updateLeads(updateData)

  res.json({ lead })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { id } = req.params

  await crmService.deleteLeads(id)

  res.json({ id, deleted: true })
}
