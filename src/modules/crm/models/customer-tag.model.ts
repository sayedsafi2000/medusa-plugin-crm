import { model } from "@medusajs/framework/utils"

const CustomerTag = model.define("customer_tag", {
  id: model.id({ prefix: "tag" }).primaryKey(),
  name: model.text().unique(),
  color: model.text().nullable(),
  customer_count: model.number().default(0),
  created_by: model.text(),
  metadata: model.json().nullable(),
})

export default CustomerTag
