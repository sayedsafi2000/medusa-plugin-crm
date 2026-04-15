import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { CRM_MODULE } from "../../../../../modules/crm"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const crmService = req.scope.resolve(CRM_MODULE) as any
  const { id } = (req.validatedBody || req.body) as { id?: string }

  if (!id) {
    res.status(400).json({ error: "Campaign id is required" })
    return
  }

  try {
    const campaign = await crmService.retrieveCrmCampaign(id)

    if (campaign.status !== "draft" && campaign.status !== "scheduled") {
      res.status(400).json({ error: "Campaign must be in draft or scheduled status to send" })
      return
    }

    let recipientIds: string[] = []

    if (campaign.segment_id) {
      const assignments = await crmService.listCustomerSegmentAssignments({
        segment_id: campaign.segment_id,
      })
      recipientIds = assignments.map((a: any) => a.customer_id)
    }

    if (recipientIds.length === 0 && campaign.target_audience?.customer_ids) {
      recipientIds = campaign.target_audience.customer_ids
    }

    const customerModule = req.scope.resolve(Modules.CUSTOMER) as any
    let recipients: any[] = []
    if (recipientIds.length > 0) {
      recipients = await customerModule.listCustomers({
        id: recipientIds,
      }, {
        select: ["id", "email", "first_name", "last_name"],
      })
    }

    const notificationModule = req.scope.resolve(Modules.NOTIFICATION) as any
    let sentCount = 0
    let failedCount = 0

    const channel = campaign.type === "multi_channel" ? "email" : campaign.type

    for (const recipient of recipients) {
      try {
        if (notificationModule?.createNotifications) {
          await notificationModule.createNotifications({
            to: recipient.email,
            channel,
            template: campaign.template?.template_id || "crm-campaign",
            data: {
              campaign_name: campaign.name,
              campaign_description: campaign.description,
              customer_name: `${recipient.first_name || ""} ${recipient.last_name || ""}`.trim(),
              customer_email: recipient.email,
              ...campaign.template,
            },
          })
        }
        sentCount++
      } catch {
        failedCount++
      }
    }

    await crmService.updateCrmCampaigns({
      id: campaign.id,
      status: "active",
      started_at: new Date().toISOString(),
      total_recipients: recipients.length,
      sent_count: sentCount,
      failed_count: failedCount,
    })

    if (sentCount > 0) {
      await crmService.updateCrmCampaigns({
        id: campaign.id,
        status: "completed",
        completed_at: new Date().toISOString(),
        delivered_count: sentCount,
      })
    }

    for (const recipient of recipients.slice(0, 100)) {
      await crmService.createCustomerActivities({
        customer_id: recipient.id,
        activity_type: "campaign",
        activity_data: {
          campaign_id: campaign.id,
          campaign_name: campaign.name,
          campaign_type: campaign.type,
          channel,
        },
      })
    }

    res.json({
      campaign_id: campaign.id,
      status: sentCount > 0 ? "completed" : "failed",
      total_recipients: recipients.length,
      sent_count: sentCount,
      failed_count: failedCount,
    })
  } catch (error) {
    console.error("Failed to send campaign:", error)
    res.status(500).json({ error: "Failed to send campaign" })
  }
}
