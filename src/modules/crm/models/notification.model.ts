import { model } from "@medusajs/framework/utils"

const Notification = model.define("crm_notification", {
  id: model.id({ prefix: "notif" }).primaryKey(),
  recipient_id: model.text(),
  recipient_type: model.enum(["admin", "staff"]).default("admin"),
  type: model.enum(["high_value_order", "new_lead", "failed_campaign", "task_due", "automation_error", "campaign_completed", "custom"]).default("custom"),
  title: model.text(),
  message: model.text(),
  severity: model.enum(["info", "warning", "error", "success"]).default("info"),
  is_read: model.boolean().default(false),
  read_at: model.dateTime().nullable(),
  reference_type: model.text().nullable(),
  reference_id: model.text().nullable(),
  metadata: model.json().nullable(),
})

export default Notification
