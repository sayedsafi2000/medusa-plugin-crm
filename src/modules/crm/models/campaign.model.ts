import { model } from "@medusajs/framework/utils"

const CrmCampaign = model.define("crm_campaign", {
  id: model.id({ prefix: "camp" }).primaryKey(),
  name: model.text(),
  description: model.text().nullable(),
  type: model.enum(["email", "sms", "whatsapp", "multi_channel"]).default("email"),
  status: model.enum(["draft", "scheduled", "active", "completed", "cancelled"]).default("draft"),
  segment_id: model.text().nullable(),
  target_audience: model.json().nullable(),
  scheduled_at: model.dateTime().nullable(),
  started_at: model.dateTime().nullable(),
  completed_at: model.dateTime().nullable(),
  total_recipients: model.number().default(0),
  sent_count: model.number().default(0),
  delivered_count: model.number().default(0),
  opened_count: model.number().default(0),
  clicked_count: model.number().default(0),
  converted_count: model.number().default(0),
  failed_count: model.number().default(0),
  bounced_count: model.number().default(0),
  template: model.json().nullable(),
  created_by: model.text(),
  metadata: model.json().nullable(),
})

export default CrmCampaign
