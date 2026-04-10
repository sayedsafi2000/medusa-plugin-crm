import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve("crmModuleService")
  const { customer_id, status } = req.validatedQuery || req.query

  const filters: any = {}
  if (customer_id) filters.customer_id = customer_id
  if (status) filters.status = status
  const tasks = await crmService.listCustomerTasks(filters)

  res.json({ tasks })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve("crmModuleService")
  const taskData = req.validatedBody || req.body

  const task = await crmService.createCustomerTasks(taskData as any)

  res.json({ task })
}
