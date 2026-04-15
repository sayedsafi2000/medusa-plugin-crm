import { createWorkflow } from "@medusajs/framework/workflows-sdk"
import { updateLeadStep } from "./steps/update-lead"

export const updateLeadWorkflow = createWorkflow(
  "update-lead",
  updateLeadStep
)
