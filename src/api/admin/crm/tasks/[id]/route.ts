import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve(CRM_MODULE)
  const { id } = req.params

  const task = await crmService.retrieveCustomerTask(id)

  res.json({ task })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve(CRM_MODULE)
  const { id } = req.params
  const updates = (req.validatedBody || req.body) as Record<string, unknown> | undefined

  const updateData: Record<string, unknown> = { id, ...(updates ?? {}) }
  const task = await crmService.updateCustomerTasks(updateData)

  res.json({ task })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve(CRM_MODULE)
  const { id } = req.params

  await crmService.deleteCustomerTasks(id)

  res.json({ id, deleted: true })
}
