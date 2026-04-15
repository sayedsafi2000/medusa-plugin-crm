import { model } from "@medusajs/framework/utils"

const CustomerTask = model.define("customer_task", {
  id: model.id({ prefix: "task" }).primaryKey(),
  customer_id: model.text(),
  order_id: model.text().nullable(),
  title: model.text(),
  description: model.text().nullable(),
  status: model.enum(["pending", "in_progress", "completed", "cancelled"]).default("pending"),
  priority: model.enum(["low", "medium", "high"]).default("medium"),
  due_date: model.dateTime().nullable(),
  assigned_to: model.text().nullable(),
  created_by: model.text(),
  metadata: model.json().nullable(),
})

export default CustomerTask
