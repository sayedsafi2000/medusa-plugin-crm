import { model } from "@medusajs/framework/utils"

const CustomerActivity = model.define("customer_activity", {
  id: model.id({ prefix: "activity" }).primaryKey(),
  customer_id: model.text(),
  order_id: model.text().nullable(),
  activity_type: model.enum(["order", "note", "task", "login", "email", "campaign", "communication", "automation", "other"]),
  activity_data: model.json(),
  severity: model.enum(["info", "warning", "error"]).default("info"),
})

export default CustomerActivity
