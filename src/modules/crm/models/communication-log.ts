class CrmCommunicationLog {
  declare id: string
  declare customer_id: string | null
  declare lead_id: string | null
  declare campaign_id: string
  declare channel: "email" | "sms" | "whatsapp"
  declare recipient: string
  declare status: "pending" | "sent" | "failed" | "bounced"
  declare subject: string | null
  declare message: string | null
  declare error_message: string | null
  declare sent_at: Date | null
  declare created_at: Date
  declare updated_at: Date
}

export default CrmCommunicationLog

