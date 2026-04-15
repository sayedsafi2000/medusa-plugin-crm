import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const crm = req.scope.resolve("crm") as any
  const campaignService = req.scope.resolve("campaignService") as any
  const { campaign_id } = req.body as any

  try {
    if (!campaign_id) {
      return res.status(400).json({ error: "campaign_id is required" })
    }

    // Fetch campaign
    const campaign = await crm.retrieveCrmCampaign(campaign_id)

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" })
    }

    // Get recipients
    const recipients = campaign.recipients?.customer_ids || []
    const channels = Object.keys(campaign.channels || {}).filter(
      (ch) => campaign.channels[ch]
    )

    if (recipients.length === 0 || channels.length === 0) {
      return res.status(400).json({ error: "Campaign has no recipients or channels" })
    }

    // Send batch campaign
    const result = await campaignService.sendBatch(
      channels,
      recipients,
      campaign.template?.subject || "Campaign",
      campaign.template?.body
    )

    // Update campaign status
    await crm.updateCrmCampaign(campaign_id, {
      status: "running",
      sent_count: result.sent,
      failed_count: result.failed,
      sent_at: new Date(),
    })

    // Log communications
    for (const res_item of result.results) {
      await crm.createCrmCommunicationLog({
        campaign_id,
        channel: res_item.channel,
        recipient: res_item.recipient,
        status: res_item.success ? "sent" : "failed",
        error_message: res_item.error || null,
      })
    }

    res.json({
      success: true,
      sent: result.sent,
      failed: result.failed,
      total: recipients.length,
    })
  } catch (error) {
    res.status(500).json({ error: (error as any).message })
  }
}
