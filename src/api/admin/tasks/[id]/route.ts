import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve("crmModuleService")
  const { id } = req.params

  const task = await crmService.retrieveCustomerTask(id)

  res.json({ task })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve("crmModuleService")
  const { id } = req.params
  const updates = req.validatedBody || req.body

  const updateData: any = { id }
  Object.assign(updateData, updates)
  const task = await crmService.updateCustomerTasks(updateData)

  res.json({ task })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve("crmModuleService")
  const { id } = req.params

  await crmService.deleteCustomerTasks(id)

  res.json({ id, deleted: true })
}
