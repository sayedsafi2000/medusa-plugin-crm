class CrmCampaign {
  declare id: string
  declare name: string
  declare description: string | null
  declare channels: {
    email?: boolean
    sms?: boolean
    whatsapp?: boolean
  }
  declare type: "manual" | "scheduled" | "trigger"
  declare status: "draft" | "scheduled" | "running" | "completed" | "paused"
  declare template: {
    subject?: string
    body: string
    variables?: string[]
  }
  declare recipients: {
    customer_ids?: string[]
    lead_ids?: string[]
    segment?: string
  } | null
  declare schedule: {
    send_at?: Date
    frequency?: "once" | "daily" | "weekly" | "monthly"
  } | null
  declare trigger: {
    event?: "order_placed" | "customer_created" | "abandoned_cart"
    conditions?: Record<string, any>
  } | null
  declare sent_count: number
  declare failed_count: number
  declare sent_at: Date | null
  declare created_at: Date
  declare updated_at: Date
}

export default CrmCampaign

