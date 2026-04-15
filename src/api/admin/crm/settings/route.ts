import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CRM_MODULE } from "../../../../modules/crm"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { category } = req.validatedQuery || req.query

  const filters: Record<string, unknown> = {}
  if (category) filters.category = category

  const settings = await crmService.listCrmSettings(filters)

  const settingsMap: Record<string, any> = {}
  for (const setting of settings) {
    settingsMap[setting.key] = setting.is_secret ? "********" : setting.value
  }

  res.json({ settings: settingsMap, raw: settings })
}

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { key, value, category, description, is_secret } = (req.validatedBody || req.body) as {
    key: string
    value: any
    category?: string
    description?: string
    is_secret?: boolean
  }

  const existing = await crmService.listCrmSettings({ key })
  if (existing.length > 0) {
    const setting = await crmService.updateCrmSettings({
      id: existing[0].id,
      value,
      category: category || existing[0].category,
      description: description || existing[0].description,
      is_secret: is_secret !== undefined ? is_secret : existing[0].is_secret,
      updated_by: "Admin",
    })
    res.json({ setting })
  } else {
    const setting = await crmService.createCrmSettings({
      key,
      value,
      category: category || "general",
      description: description || null,
      is_secret: is_secret || false,
      updated_by: "Admin",
    })
    res.json({ setting })
  }
}
