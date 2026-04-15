import { model } from "@medusajs/framework/utils"

const CustomerNote = model.define("customer_note", {
  id: model.id({ prefix: "note" }).primaryKey(),
  customer_id: model.text(),
  order_id: model.text().nullable(),
  note: model.text(),
  created_by: model.text(),
  metadata: model.json().nullable(),
})

export default CustomerNote
