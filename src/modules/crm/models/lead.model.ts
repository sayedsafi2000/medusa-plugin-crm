import { model } from "@medusajs/framework/utils"

const Lead = model.define("lead", {
  id: model.id({ prefix: "lead" }).primaryKey(),
  customer_id: model.text().nullable(),
  contact_name: model.text(),
  contact_email: model.text(),
  contact_phone: model.text().nullable(),
  company: model.text().nullable(),
  source: model.enum(["website", "referral", "social_media", "email", "phone", "other"]).default("other"),
  stage: model.enum(["new", "qualified", "proposal", "negotiation", "won", "lost"]).default("new"),
  estimated_value: model.number().nullable(),
  probability: model.number().default(0),
  expected_close_date: model.dateTime().nullable(),
  assigned_to: model.text().nullable(),
  notes: model.text().nullable(),
  lost_reason: model.text().nullable(),
  created_by: model.text(),
  metadata: model.json().nullable(),
})

export default Lead
