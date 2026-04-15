import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { CRM_MODULE } from "../../modules/crm"

export const createCampaignStep = createStep(
  "create-campaign",
  async (input: any, { container }: any) => {
    const crmService: any = container.resolve(CRM_MODULE)
    const campaign = await crmService.createCampaigns(input)
    return new StepResponse(campaign, campaign.id)
  },
  async (campaignId: string | undefined, { container }: any) => {
    if (!campaignId) return
    const crmService: any = container.resolve(CRM_MODULE)
    await crmService.deleteCampaigns(campaignId)
  }
)
