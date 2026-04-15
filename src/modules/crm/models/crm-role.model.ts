import { model } from "@medusajs/framework/utils"

const CrmRole = model.define("crm_role", {
  id: model.id({ prefix: "crole" }).primaryKey(),
  name: model.text().unique(),
  label: model.text(),
  permissions: model.json(),
  is_default: model.boolean().default(false),
})

export default CrmRole
