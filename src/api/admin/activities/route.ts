import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve("crmModuleService")
  const { customer_id, activity_type } = req.validatedQuery || req.query

  const filters: any = {}
  if (customer_id) filters.customer_id = customer_id
  if (activity_type) filters.activity_type = activity_type
  const activities = await crmService.listCustomerActivities(filters)

  res.json({ activities })
}
