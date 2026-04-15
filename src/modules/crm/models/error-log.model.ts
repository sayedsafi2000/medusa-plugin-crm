import { model } from "@medusajs/framework/utils"

const ErrorLog = model.define("crm_error_log", {
  id: model.id({ prefix: "err" }).primaryKey(),
  source: model.enum(["api", "workflow", "automation", "campaign", "notification", "job", "export", "subscriber", "other"]).default("other"),
  error_code: model.text().nullable(),
  error_message: model.text(),
  stack_trace: model.text().nullable(),
  reference_type: model.text().nullable(),
  reference_id: model.text().nullable(),
  request_data: model.json().nullable(),
  retry_count: model.number().default(0),
  max_retries: model.number().default(3),
  status: model.enum(["pending", "retrying", "resolved", "failed"]).default("pending"),
  resolved_at: model.dateTime().nullable(),
  metadata: model.json().nullable(),
})

export default ErrorLog
