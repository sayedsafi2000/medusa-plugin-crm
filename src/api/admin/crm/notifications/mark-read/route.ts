import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../../modules/crm"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { ids } = (req.validatedBody || req.body) as { ids?: string[] }

  if (!ids || !ids.length) {
    res.status(400).json({ error: "ids array is required" })
    return
  }

  const updated: any[] = []
  for (const id of ids) {
    const notification = await crmService.updateNotifications({
      id,
      is_read: true,
      read_at: new Date().toISOString(),
    })
    updated.push(notification)
  }

  res.json({ updated: updated.length })
}
