import { model } from "@medusajs/framework/utils"

const CommunicationLog = model.define("communication_log", {
  id: model.id({ prefix: "comm" }).primaryKey(),
  customer_id: model.text(),
  lead_id: model.text().nullable(),
  type: model.enum(["email", "sms", "whatsapp", "call", "other"]).default("email"),
  direction: model.enum(["inbound", "outbound"]).default("outbound"),
  subject: model.text().nullable(),
  message: model.text(),
  recipient: model.text(),
  sender: model.text(),
  status: model.enum(["sent", "delivered", "failed", "pending"]).default("pending"),
  sent_at: model.dateTime().nullable(),
  created_by: model.text(),
  metadata: model.json().nullable(),
})

export default CommunicationLog
