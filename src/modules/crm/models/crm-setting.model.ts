import { model } from "@medusajs/framework/utils"

const CrmSetting = model.define("crm_setting", {
  id: model.id({ prefix: "cset" }).primaryKey(),
  key: model.text().unique(),
  value: model.json(),
  category: model.enum(["api", "campaign", "automation", "notification", "general"]).default("general"),
  description: model.text().nullable(),
  is_secret: model.boolean().default(false),
  updated_by: model.text().nullable(),
})

export default CrmSetting
