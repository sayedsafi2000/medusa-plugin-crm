import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve("crmModuleService")
  const { id } = req.params

  const note = await crmService.retrieveCustomerNote(id)

  res.json({ note })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService: any = req.scope.resolve("crmModuleService")
  const { id } = req.params

  await crmService.deleteCustomerNotes(id)

  res.json({ id, deleted: true })
}
