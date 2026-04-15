import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { id } = req.params

  const log = await crmService.retrieveCommunicationLog(id)
  res.json({ communication_log: log })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { id } = req.params
  const updates = (req.validatedBody || req.body) as Record<string, unknown> | undefined

  const updateData: Record<string, unknown> = { id, ...(updates ?? {}) }
  const log = await crmService.updateCommunicationLogs(updateData)

  res.json({ communication_log: log })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { id } = req.params

  await crmService.deleteCommunicationLogs(id)

  res.json({ id, deleted: true })
}
