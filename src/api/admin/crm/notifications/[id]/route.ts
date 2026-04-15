import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { id } = req.params
  const notification = await crmService.retrieveNotification(id)
  res.json({ notification })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { id } = req.params
  const updates = (req.validatedBody || req.body) as Record<string, unknown> | undefined

  const updateData: Record<string, unknown> = { id, ...(updates ?? {}) }
  const notification = await crmService.updateNotifications(updateData)
  res.json({ notification })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { id } = req.params
  await crmService.deleteNotifications(id)
  res.json({ id, deleted: true })
}
