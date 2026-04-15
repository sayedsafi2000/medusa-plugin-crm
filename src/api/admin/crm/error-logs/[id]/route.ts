import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { id } = req.params
  const errorLog = await crmService.retrieveErrorLog(id)
  res.json({ error_log: errorLog })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { id } = req.params
  const updates = (req.validatedBody || req.body) as Record<string, unknown> | undefined
  const updateData: Record<string, unknown> = { id, ...(updates ?? {}) }
  const errorLog = await crmService.updateErrorLogs(updateData)
  res.json({ error_log: errorLog })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { id } = req.params
  await crmService.deleteErrorLogs(id)
  res.json({ id, deleted: true })
}
