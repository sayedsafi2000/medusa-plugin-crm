class CrmCampaign {
id: string
name: string
description: string | null
channels: {
    email?: boolean
    sms?: boolean
    whatsapp?: boolean
  }
type: "manual" | "scheduled" | "trigger"
status: "draft" | "scheduled" | "running" | "completed" | "paused"
template: {
    subject?: string
    body: string
    variables?: string[]
  }
recipients: {
    customer_ids?: string[]
    lead_ids?: string[]
    segment?: string
  } | null
schedule: {
    send_at?: Date
    frequency?: "once" | "daily" | "weekly" | "monthly"
  } | null
trigger: {
    event?: "order_placed" | "customer_created" | "abandoned_cart"
    conditions?: Record<string, any>
  } | null
sent_count: number
failed_count: number
sent_at: Date | null
created_at: Date
updated_at: Date
}

export default CrmCampaign

