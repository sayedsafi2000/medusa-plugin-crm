import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { key } = req.params

  const settings = await crmService.listCrmSettings({ key })
  if (settings.length === 0) {
    res.status(404).json({ error: "Setting not found" })
    return
  }

  const setting = settings[0]
  res.json({
    key: setting.key,
    value: setting.is_secret ? "********" : setting.value,
    category: setting.category,
    description: setting.description,
    is_secret: setting.is_secret,
  })
}

export const DELETE = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { key } = req.params

  const settings = await crmService.listCrmSettings({ key })
  if (settings.length === 0) {
    res.status(404).json({ error: "Setting not found" })
    return
  }

  await crmService.deleteCrmSettings(settings[0].id)
  res.json({ key, deleted: true })
}
