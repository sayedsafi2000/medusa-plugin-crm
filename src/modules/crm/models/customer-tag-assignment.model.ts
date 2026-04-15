import { model } from "@medusajs/framework/utils"

const CustomerTagAssignment = model.define("customer_tag_assignment", {
  id: model.id({ prefix: "cta" }).primaryKey(),
  customer_id: model.text(),
  tag_id: model.text(),
  assigned_by: model.text().nullable(),
})

export default CustomerTagAssignment
