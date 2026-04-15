import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { createCampaignStep } from "./steps/create-campaign"

export const createCampaignWorkflow = createWorkflow(
  "create-campaign",
  createCampaignStep
)
