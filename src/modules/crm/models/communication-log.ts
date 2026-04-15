class CrmCommunicationLog {
id: string
customer_id: string | null
lead_id: string | null
campaign_id: string
channel: "email" | "sms" | "whatsapp"
recipient: string
status: "pending" | "sent" | "failed" | "bounced"
subject: string | null
message: string | null
error_message: string | null
sent_at: Date | null
created_at: Date
updated_at: Date
}

export default CrmCommunicationLog

