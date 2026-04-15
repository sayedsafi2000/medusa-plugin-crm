import { model } from "@medusajs/framework/utils"

const CustomerSegment = model.define("customer_segment", {
  id: model.id({ prefix: "seg" }).primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  criteria: model.json(),
  customer_count: model.number().default(0),
  is_dynamic: model.boolean().default(false),
  refresh_interval: model.enum(["never", "daily", "weekly", "monthly"]).default("never"),
  last_refreshed_at: model.dateTime().nullable(),
  created_by: model.text(),
  metadata: model.json().nullable(),
})

export default CustomerSegment
