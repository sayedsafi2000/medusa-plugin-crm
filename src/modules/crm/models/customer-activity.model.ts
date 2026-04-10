import { model } from "@medusajs/framework/utils"

const CustomerActivity = model.define("customer_activity", {
  id: model.id({ prefix: "activity" }).primaryKey(),
  customer_id: model.text(),
  activity_type: model.enum(["order", "note", "task", "login", "email", "other"]),
  activity_data: model.json(),
})

export default CustomerActivity
