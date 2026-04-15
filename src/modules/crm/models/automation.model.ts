import { model } from "@medusajs/framework/utils"

const Automation = model.define("automation", {
  id: model.id({ prefix: "auto" }).primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  type: model.enum(["follow_up", "abandoned_cart", "birthday", "re_engagement", "order_created", "customer_created", "high_value_order", "custom"]).default("custom"),
  trigger_event: model.text(),
  trigger_conditions: model.json().nullable(),
  actions: model.json(),
  status: model.enum(["active", "paused", "disabled"]).default("active"),
  is_active: model.boolean().default(true),
  segment_id: model.text().nullable(),
  schedule: model.json().nullable(),
  max_retries: model.number().default(3),
  retry_count: model.number().default(0),
  last_run_at: model.dateTime().nullable(),
  next_run_at: model.dateTime().nullable(),
  last_error: model.text().nullable(),
  run_count: model.number().default(0),
  success_count: model.number().default(0),
  failure_count: model.number().default(0),
  created_by: model.text(),
  metadata: model.json().nullable(),
})

export default Automation
